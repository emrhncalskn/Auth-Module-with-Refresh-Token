import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { IS_ALLOWED_PERMISSION } from '../decorators/pass-permission.decorator';
import { Api } from '../entities/api.entity';
import { Permission } from '../entities/permission.entity';
import { ErrorMessage } from '../constants/error-message.constant';

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
            if (!path) throw new HttpException(ErrorMessage.Permission().ROUTE_NOT_EXIST, 404)
            const method = request.route.stack[0].method;
            if (!method) throw new HttpException(ErrorMessage.Permission().METHOD_NOT_EXIST, 404)
            const api = await this.apiRepository.findOne({ where: { path: path, method: method } });
            if (!api) throw new HttpException(ErrorMessage.Permission().API_NOT_EXIST, 404)
            const apiId = api.id;

            const userId = request.user.id;
            const user = await this.userService.findwithID(userId);
            if (!user) throw new HttpException(ErrorMessage.Permission().USER_NOT_EXIST, 404)
            const roleId = user.role_id;

            const permission = await this.permissionRepository.findOne({ where: { api_id: apiId, role_id: roleId } });

            if (!permission) {
                throw new HttpException(ErrorMessage.Permission().PERMISSION_NOT_EXIST, 404);
            }

            return true;

        }
        catch (err) {
            context.switchToHttp().getResponse().status(HttpStatus.BAD_REQUEST).send({ msg: err.message })
        }
    }
}