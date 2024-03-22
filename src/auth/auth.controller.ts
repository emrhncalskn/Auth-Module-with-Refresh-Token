import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { PassAuth } from './decorators/pass-auth.decorator';
import { AuthDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { PassPermission } from './decorators/pass-permission.decorator';

@PassAuth()
@PassPermission()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req, @Res() res, @Body() user: AuthDto) {
        try { return res.status(200).send(await this.authService.login(req.user)) }
        catch (error) { return res.status(400).send({ msg: error.message }) }
    }

    @Post('register')
    async register(@Body() user: CreateUserDto, @Res() res) {
        try { return res.status(200).send(await this.authService.register(user)) }
        catch (error) { return res.status(400).send({ msg: error.message }) }
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    async refreshTokens(@Req() req: Request) {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return await this.authService.refreshTokens(userId, refreshToken);
    }

}