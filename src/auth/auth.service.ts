import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon from 'argon2';
import { SignInRequest, SignUpRequest } from './dto/auth.request';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: SignUpRequest): Promise<Tokens> {
    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: await argon.hash(dto.password),
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
      // should be removed in full version
      // as there is not teacher and student here
      // they should get created in the register process
      user = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          teacherId: user.id,
          studentId: user.id,
        },
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new BadRequestException('User already exists');
      }
    }

    const tokens = await this.SignTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async login(dto: SignInRequest): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!(await argon.verify(user.password, dto.password))) {
      // console.log("invalid pass");
      throw new ForbiddenException('User not found');
    }

    const tokens = await this.SignTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });

    return 'ok';
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!user.hashedRt) {
      throw new ForbiddenException('User not found');
    }

    if (!(await argon.verify(user.hashedRt, refreshToken))) {
      throw new ForbiddenException('User not found');
    }

    const tokens = await this.SignTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async SignTokens(userId: number, email: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: 1800,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: 86400,
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async updateRtHash(userId: number, rtHash: string) {
    const hash = await argon.hash(rtHash);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }
}
