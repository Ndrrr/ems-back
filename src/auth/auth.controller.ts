import { AuthService } from "./auth.service";
import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { SignInRequest, SignUpRequest } from "./dto/auth.request";
import { Tokens } from "./types";
import { Request } from "express";
import { AtGuard, RtGuard } from "../common/guards";
import { GetCurrentUser } from "../common/decorators/get-current-user.decorator";

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: SignUpRequest) : Promise<Tokens>  {
        return this.authService.register(dto);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: SignInRequest) : Promise<Tokens> {
        return this.authService.login(dto);
    }

    @UseGuards(AtGuard)
    @Post('/logout')
    @HttpCode(HttpStatus.OK)
    async logout(@GetCurrentUser('sub') userId: number) {
        return this.authService.logout(userId);
    }

    @UseGuards(RtGuard)
    @Post('/refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(@GetCurrentUser() user: any) {
        return this.authService.refreshTokens(user.sub, user.refreshToken);
    }

}