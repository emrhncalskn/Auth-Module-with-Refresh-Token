import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GetUserPipe implements PipeTransform {
    constructor(private userService: UserService) { }

    async transform(user_id: number, key: ArgumentMetadata) {
        const userInfo = await this.userService.findwithID(user_id);
        if (!userInfo) throw new Error('User not found');
        const { password, ...user } = userInfo
        return user[`${key.data}`] || user;
    }
}

// Token'dan gelen kullanıcı bilgileri işlenir ve geri döndürülür.