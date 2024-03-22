import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
    constructor() {
        super();
    }
    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            if (info.message === 'jwt expired')
                throw new HttpException({ error: 'Unauthorized', msg: 'Refresh token expired' }, 401);
            else if (info.message === 'invalid signature')
                throw new HttpException({ error: 'Unauthorized', msg: 'Invalid refresh token' }, 401);
            else
                throw new HttpException({ error: 'Unauthorized', msg: info.message }, 401);
        }
        return user;
    }
}