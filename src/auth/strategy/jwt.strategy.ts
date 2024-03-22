import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';


// Bu class, token'ın geçerliliğini kontrol eder -- login yapmış kullanıcıyı kontrol eder

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // token süresi doldu mu kontrolü
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(payload: any) {
        return payload;
    }
}