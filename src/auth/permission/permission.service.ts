import { INestApplication } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Api } from "../entities/api.entity";

export class PermissionService {
    constructor(
        @InjectRepository(Api)
        private readonly apiRepository: Repository<Api>
    ) { }

    async createApiRoutes(app: INestApplication) {
        const routes = JSON.parse(JSON.stringify(this.extractRoutes(app)));
        const apis = JSON.parse(JSON.stringify(await this.apiRepository.find()));
        const routesToCreate = routes.filter(route => !apis.some(api => this.compareRoutes(api, route)));
        const routesToDelete = apis.filter(api => !routes.some(route => this.compareRoutes(api, route)));
        if (routesToCreate.length > 0) {
            console.log("++++++++++++ UYARI!! Yeni API'ler bulundu ve başarı ile veritabanına kaydedildi. ++++++++++++")
            console.log("Yeni eklenen API'ler :: ", routesToCreate);
            await this.apiRepository.save(routesToCreate);

        }

        if (routesToDelete.length > 0) {
            console.log("++++++++++++ UYARI!! Veritabanında bulunan fakat uygulamada bulunmayan API'ler bulundu ve başarı ile veritabanından kaldırıldı. ++++++++++++")
            console.log("Veritabanından kaldırılan API'ler :: ", routesToDelete);
            await this.apiRepository.remove(routesToDelete);
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
}
