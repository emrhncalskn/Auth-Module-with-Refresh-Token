import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GetUserPipe } from '../pipes/parse-token.pipe';

export const GetUserID = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user.id;
});

export const CurrentUser = (userKey?: any) => GetUserID(userKey, GetUserPipe);

/*

 => Dekoratör üzerinden header'dan gelen token'dan kullanıcı bilgilerini almak için kullanılır.

Kullanımı:

@Get('test')
async test(@CurrentUser() user) {
    return user;
}

Çıktı:
    {
        "id": 1,
        "username": "emir",
        "email": "example@email.com",
        "role_id": 1
    }
}

********************************************************

@Get('test2')
async test2(@CurrentUser('id') user_id:number) {
    return user;
}

Çıktı: 1

*/