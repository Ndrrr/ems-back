import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import * as argon from 'argon2';
import { SignInRequest, SignUpRequest } from "./dto/auth.request";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { Tokens } from "./types";
import { Prisma } from '@prisma/client';
import { Response } from "express";

@Injectable()
export class AuthService{
    constructor(private readonly prisma: PrismaService,
                private readonly jwtService: JwtService) {}

    async register(dto: SignUpRequest){
      let user;
      try {
        user = await this.prisma.user.create({
          data: {
            email: dto.email,
            password: await argon.hash(dto.password),
            firstName: dto.firstName,
            lastName: dto.lastName,
          }
        });
      } catch (e) {
        if(e.code === 'P2002'){
          throw new BadRequestException('User already exists');
        }
      }

      // const tokens = await this.SignTokens(user.id, user.email);
      // await this.updateRtHash(user.id, tokens.refresh_token);
      return { msg: "User created" };
    }

    async login(dto: SignInRequest, res: Response){
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        }
      });
      if(!user){
        throw new ForbiddenException('User not found');
      }

      if(!await argon.verify(user.password, dto.password)){
        // console.log("invalid pass");
        throw new ForbiddenException('User not found');
      }

      const tokens = await this.SignTokens(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);

      return tokens;
    }

    async logout(userId: number, res: Response) {
      await this.prisma.user.updateMany({
        where: {
          id: userId,
          hashedRt: {
            not: null,
          }
        },
        data: {
          hashedRt: null,
        }
      });
      res.clearCookie('refresh_token');
      return true;
    }

    async refreshTokens(userId: number, refreshToken: string, res: Response) {
      console.log(userId);
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        }
      });

      if(!user || !user.hashedRt){
        throw new ForbiddenException('Access denied');
      }

      if(!await argon.verify(user.hashedRt, refreshToken)){
        throw new ForbiddenException('Access denied');
      }

      const tokens = await this.SignTokens(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);

      res.cookie('refresh_token', tokens.refresh_token, {httpOnly: true});
      return {
        access_token: tokens.access_token,
      };
    }

    async SignTokens(userId: number, email: string) : Promise<Tokens> {
      const [access_token, refresh_token] = await Promise.all([this.jwtService.signAsync({
        sub: userId,
        email: email,
      }, {
        secret: process.env.JWT_SECRET,
        expiresIn: 1800,
      }),
      this.jwtService.signAsync({
        sub: userId,
        email: email,
      }, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: 86400,
      })]);

      return {
        access_token,
        refresh_token,
      }
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