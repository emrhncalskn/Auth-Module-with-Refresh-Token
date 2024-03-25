import { INestApplication } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Api } from "../entities/api.entity";
import { Permission } from "../entities/permission.entity";
import { Role } from "../entities/role.entity";
import { RolesConstant } from "../constants/roles.constant";
import { UserPermissionsConstant } from "../constants/user-permissions.constant";

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
}

export async function syncPermission(app: INestApplication) {
    const permissionService = app.get<PermissionService>(PermissionService);
    await permissionService.syncApiRoutes(app);
    await permissionService.syncAdminPermissions();
    await permissionService.syncUserPermissions();
}