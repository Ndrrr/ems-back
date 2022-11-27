import { AuthService } from "./auth.service";
import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { SignInRequest, SignUpRequest } from "./dto/auth.request";
import { Tokens } from "./types";
import { AtGuard, RtGuard } from "../common/guards";
import { GetCurrentUser } from "../common/decorators/get-current-user.decorator";
import { Response } from "express";

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: SignUpRequest) {
        return this.authService.register(dto);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: SignInRequest, @Res({passthrough: true}) res: Response) {
        const tokens = await this.authService.login(dto, res);
        res.cookie('refresh_token', tokens.refresh_token, {httpOnly: true});
        return {
            access_token: tokens.access_token,
        }
    }

    @UseGuards(AtGuard)
    @Post('/logout')
    @HttpCode(HttpStatus.OK)
    async logout(@GetCurrentUser('sub') userId: number, @Res({passthrough: true}) res: Response) {
        return this.authService.logout(userId, res);
    }

    @UseGuards(RtGuard)
    @Post('/refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(@GetCurrentUser() user: any ,@Res({passthrough: true}) res: Response) {
        return this.authService.refreshTokens(user.sub, user.refreshToken, res);
    }

}