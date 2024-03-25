import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { UserService } from '../user/user.service';
import { jwtRefreshSignOptions, jwtSignOptions } from './constants/jwt.constant';
import { Encryptor } from './encryptor/encryptor';
import { ErrorMessage } from './constants/error-message.constant';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private encryptor: Encryptor,
    ) { }

    async login(user: any) {
        const tokens = await this.getTokens(user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return { user, tokens };
    }

    async register(user: CreateUserDto) {
        const registered_user = await this.userService.create(user);
        if (registered_user) {
            const login = await this.login(registered_user);
            const result = {
                message: ErrorMessage.Auth().REGISTER_SUCCESS,
                user: login.user,
                access_token: login.tokens.accessToken
            }
            return result;
        }
        return { message: ErrorMessage.Auth().REGISTER_FAIL }
    }

    async getTokens(email: string) {
        const user = await this.userService.findOneWithEmail(email);
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.sign(
                {
                    user,
                    sub: user.id,
                },
                jwtSignOptions
            ),
            this.jwtService.sign(
                {
                    user,
                    sub: user.id,
                },
                jwtRefreshSignOptions
            ),
        ]);

        return { accessToken, refreshToken };

    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await this.encryptor.hashPassword(refreshToken);
        await this.userService.update(userId, { refresh_token: hashedRefreshToken })
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.userService.findwithID(userId);
        if (!user || !user.refresh_token)
            throw new ForbiddenException('Access Denied');
        const refreshTokenMatches = await this.encryptor.isPasswordCorrect(
            refreshToken,
            user.refresh_token,
        );
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
}