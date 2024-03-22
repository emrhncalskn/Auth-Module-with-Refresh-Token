import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/user/user.service';
import { Encryptor } from '../encryptor/encryptor';
import { AuthErrorMessage } from '../constant/error.constant';

// Kullanıcı var mı yok mu ve girdiği bilgiler doğru mu diye kontrol eden guard -- login yapacak kullanıcıyı kontrol eder

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(
        private userService: UserService,
        private encyrptor: Encryptor,
    ) {
        super({ usernameField: 'email', passwordField: 'password' });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.userService.findOneWithEmail(email);
        if (user) {
            const compare = await this.encyrptor.isPasswordCorrect(password, user.password);
            if (compare) {
                const { password, ...result } = user;
                return result;
            }
            else {
                throw new HttpException(AuthErrorMessage.WRONG_PASSWORD, 401)
            }
        }
        throw new HttpException(AuthErrorMessage.USER_NOT_FOUND, 404)
    }
}

