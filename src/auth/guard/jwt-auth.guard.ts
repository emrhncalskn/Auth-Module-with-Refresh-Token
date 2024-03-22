import { ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_ALLOWED } from '../decorator/pass-auth.decorator';

// önce buraya sonra strategy'e girer

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isAllowed = this.reflector.getAllAndOverride<boolean>(IS_ALLOWED, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isAllowed) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw new HttpException({ error: 'Unauthorized', msg: info.message }, 401);
        }
        return user;
    }

}

