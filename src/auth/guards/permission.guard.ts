import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { PermissionErrorMessage } from '../constants/error.constant';
import { IS_ALLOWED_PERMISSION } from '../decorators/pass-permission.decorator';
import { Api } from '../entities/api.entity';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRepository(Api)
        private readonly apiRepository: Repository<Api>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        private userService: UserService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        try {

            const isAllowed = this.reflector.getAllAndOverride<boolean>(IS_ALLOWED_PERMISSION, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (isAllowed) { return true }
            const request = context.switchToHttp().getRequest();
            const path = request.route.path;
            if (!path) throw new HttpException(PermissionErrorMessage.ROUTE_NOT_EXIST, 404)
            const method = request.route.stack[0].method;
            if (!method) throw new HttpException(PermissionErrorMessage.METHOD_NOT_EXIST, 404)
            const api = await this.apiRepository.findOne({ where: { path: path, method: method } });
            if (!api) throw new HttpException(PermissionErrorMessage.API_NOT_EXIST, 404)
            const apiId = api.id;

            const userId = request.user.id;
            const user = await this.userService.findwithID(userId);
            if (!user) throw new HttpException(PermissionErrorMessage.USER_NOT_EXIST, 404)
            const roleId = user.role_id;

            const permission = await this.permissionRepository.findOne({ where: { api_id: apiId, role_id: roleId } });

            if (!permission) {
                throw new HttpException(PermissionErrorMessage.PERMISSION_NOT_EXIST, 404);
            }

            return true;

        }
        catch (err) {
            console.log(err)
            context.switchToHttp().getResponse().status(HttpStatus.BAD_REQUEST).send({ msg: err.message })
        }
    }
}