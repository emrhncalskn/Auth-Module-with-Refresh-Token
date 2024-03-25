import { HttpException, HttpStatus, INestApplication } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RolesConstant } from "../constants/roles.constant";
import { UserPermissionsConstant } from "../constants/user-permissions.constant";
import { RoleDto } from "../dto/role.dto";
import { Api } from "../entities/api.entity";
import { Permission } from "../entities/permission.entity";
import { Role } from "../entities/role.entity";
import { PermissionDto } from "../dto/permission.dto";
import { ConfirmMessage } from "../constants/confirm-message.constant";
import { ErrorMessage } from "../constants/error-message.constant";

export class PermissionService {
    constructor(
        @InjectRepository(Api)
        private readonly apiRepository: Repository<Api>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) { }

    async syncApiRoutes(app: INestApplication) {
        const routes = JSON.parse(JSON.stringify(this.extractRoutes(app)));
        const apis = JSON.parse(JSON.stringify(await this.apiRepository.find()));
        const routesToCreate = routes.filter(route => !apis.some(api => this.compareRoutes(api, route)));
        const routesToDelete = apis.filter(api => !routes.some(route => this.compareRoutes(api, route)));
        const permissionsToDelete = [];

        await Promise.all(routesToDelete.map(async (route) => {
            const permission = await this.permissionRepository.find({ where: { api_id: route.id } });
            if (permission.length > 0) {
                permissionsToDelete.push(JSON.parse(JSON.stringify(permission)));
                await this.permissionRepository.remove(permission);
            }
        }));

        if (permissionsToDelete.length > 0) {
            console.log("++++++++++++ UYARI!! Veritabanında bulunan fakat uygulamada bulunmayan yetkilendirmeler bulundu ve başarı ile veritabanından kaldırıldı. ++++++++++++")
            console.log("Veritabanından kaldırılan yetkilendirmeler :: ", permissionsToDelete);
        }

        if (routesToDelete.length > 0) {
            console.log("++++++++++++ UYARI!! Veritabanında bulunan fakat uygulamada bulunmayan API'ler bulundu ve başarı ile veritabanından kaldırıldı. ++++++++++++")
            console.log("Veritabanından kaldırılan API'ler :: ", routesToDelete);
            await this.apiRepository.remove(routesToDelete);
        }

        if (routesToCreate.length > 0) {
            console.log("++++++++++++ UYARI!! Yeni API'ler bulundu ve başarı ile veritabanına kaydedildi. ++++++++++++")
            console.log("Yeni eklenen API'ler :: ", routesToCreate);
            await this.apiRepository.save(routesToCreate);
        }

        else {
            console.log("++++++++++++ Veritabanı ve Uygulamadaki API'ler Güncel ++++++++++++")
        }
    }

    private extractRoutes(app: INestApplication) {
        const server = app.getHttpServer();
        const router = server._events.request._router;

        return router.stack
            .filter(layer => layer.route && !layer.route.path.includes('api'))
            .map(layer => ({
                path: layer.route.path,
                method: layer.route.stack[0].method
            }));
    }

    private compareRoutes(route1: { path: string, method: string }, route2: { path: string, method: string }) {
        return route1.path === route2.path && route1.method === route2.method;
    }

    async syncAdminPermissions() {
        const role = await this.roleRepository.findOne({ where: { name: RolesConstant.SUPER_ADMIN } });
        if (!role) {
            await this.roleRepository.save({ name: RolesConstant.SUPER_ADMIN });
        }
        else {
            const apis = await this.apiRepository.find();
            const permissions = await this.permissionRepository.find({ where: { role_id: role.id } });
            const existingApiIds = permissions.map(permission => permission.api_id);
            const newApiPermissions = apis.filter(api => !existingApiIds.includes(api.id))
                .map(api => ({ api_id: api.id, role_id: role.id }));

            if (newApiPermissions.length > 0) {
                await this.permissionRepository.save(newApiPermissions);
                console.log('++++++++++++ Super Admin yetkileri başarı ile verildi. ++++++++++++');
            }
        }
    }

    async syncUserPermissions() {
        const role = await this.roleRepository.findOne({ where: { name: RolesConstant.USER } });
        if (!role) {
            await this.roleRepository.save({ name: RolesConstant.USER });
        }
        else {
            const permissions = await this.permissionRepository.find({ where: { role_id: role.id } });
            if (permissions.length === 0) {
                const apis = await this.apiRepository.find({ where: UserPermissionsConstant.PERMISSIONS });
                const newPermissions = apis.map(api => ({ api_id: api.id, role_id: role.id }));
                await this.permissionRepository.save(newPermissions);
                console.log('++++++++++++ User yetkileri başarı ile verildi. ++++++++++++');
            }
        }
    }

    async create(data: PermissionDto) {
        const checkexist = await this.permissionRepository.findOne({ where: { api_id: data.api_id, role_id: data.role_id } });
        if (checkexist) { throw new HttpException(ErrorMessage.Permission().ALREADY_EXIST, HttpStatus.BAD_REQUEST); }
        const perm = await this.permissionRepository.create(data);
        const newPerm = await this.permissionRepository.save(perm);
        if (!newPerm) { throw new HttpException(ErrorMessage.Permission().NOT_CREATED, HttpStatus.BAD_REQUEST) }
        return { message: ConfirmMessage.Permission().CREATED }
    }

    async getPermissions() {
        const perms = await this.permissionRepository.find({ relations: { api: true, role: true } });
        if (perms.length < 1) { throw new HttpException(ErrorMessage.Permission().NOT_FOUND, HttpStatus.NOT_FOUND) }
        return { perms };
    }

    async getPermission(permid: number) {
        const perm = await this.permissionRepository.findOne({ where: { id: permid }, relations: { api: true, role: true } });
        if (!perm) { throw new HttpException(ErrorMessage.Permission().NOT_FOUND, HttpStatus.NOT_FOUND) }
        return { perm };
    }

    async setPermission(permid: number, data: PermissionDto) {
        const perm = await this.permissionRepository.update({ id: permid }, { api_id: data.api_id, role_id: data.role_id });
        if (perm.affected < 1) { throw new HttpException(ErrorMessage.Permission().NOT_UPDATED, HttpStatus.BAD_REQUEST); }
        return { message: ConfirmMessage.Permission().UPDATED };
    }

    async deletePermission(permid: number) {
        const checkexist = await this.permissionRepository.findOne({ where: { id: permid } });
        if (!checkexist) { throw new HttpException(ErrorMessage.Permission().NOT_FOUND, HttpStatus.NOT_FOUND); }
        const perm = await this.permissionRepository.delete({ id: permid });
        if (perm.affected < 1) { throw new HttpException(ErrorMessage.Permission().NOT_DELETED, HttpStatus.BAD_REQUEST); }
        return { message: ConfirmMessage.Permission().DELETED }
    }

    async createRole(data: RoleDto) {
        const role = this.roleRepository.create(data);
        const newRole = await this.roleRepository.save(role);
        if (!newRole) throw new HttpException(ErrorMessage.Role().NOT_CREATED, HttpStatus.BAD_REQUEST);
        return { message: ConfirmMessage.Role().CREATED }
    }

    async getRoles() {
        const roles = await this.roleRepository.find();
        if (roles.length < 1) throw new HttpException(ErrorMessage.Role().NOT_FOUND, HttpStatus.NOT_FOUND);
        return { roles };
    }

    async getRole(role_id: number) {
        const role = await this.roleRepository.findOne({ where: { id: role_id } });
        if (!role) throw new HttpException(ErrorMessage.Role().NOT_FOUND, HttpStatus.NOT_FOUND);
        return role;
    }

    async setRole(roleid: number, data: RoleDto) {
        const role = await this.roleRepository.update({ id: roleid }, { name: data.name });
        if (role.affected < 1) throw new HttpException(ErrorMessage.Role().NOT_UPDATED, HttpStatus.BAD_REQUEST);
        return { message: ConfirmMessage.Role().UPDATED };
    }

    async deleteRole(roleid: number) {
        const role = await this.roleRepository.delete({ id: roleid });
        if (role.affected < 1) throw new HttpException(ErrorMessage.Role().NOT_DELETED, HttpStatus.BAD_REQUEST);
        return { message: ConfirmMessage.Role().DELETED };
    }

    async getApis() {
        const apis = await this.permissionRepository.find({ relations: { api: true } });
        if (apis.length < 1) throw new HttpException(ErrorMessage.Role().NOT_FOUND, HttpStatus.NOT_FOUND);
        const api = [];
        apis.forEach(element => { !api.includes(element.api) ? api.push(element.api) : null });
        return { api };
    }

    async getApisByRole(roleid: number) {
        const apis = await this.permissionRepository.find({ where: { role_id: roleid }, relations: { api: true, role: true }, select: ['api'] });
        if (apis.length < 1) throw new HttpException(ErrorMessage.Role().NOT_FOUND, HttpStatus.NOT_FOUND);
        const api = [];
        apis.forEach(element => { !api.includes(element.api) ? api.push(element.api) : null });
        const role = apis[0].role;
        return { role, api };
    }

}

export async function syncPermission(app: INestApplication) {
    const permissionService = app.get<PermissionService>(PermissionService);
    await permissionService.syncApiRoutes(app);
    await permissionService.syncAdminPermissions();
    await permissionService.syncUserPermissions();
}