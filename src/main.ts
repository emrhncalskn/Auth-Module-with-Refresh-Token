import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { PermissionService } from './auth/permission/permission.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const permissionService = app.get<PermissionService>(PermissionService);

  dotenv.config();

  const config = new DocumentBuilder()
    .setTitle('Swagger')
    .setDescription('API for managing Swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3000);


  console.log(`Uygulama '${await app.getUrl()}' adresinde çalışıyore.`);
  console.log(`Swagger '${await app.getUrl()}/api' adresinde çalışıyore.`);

  //await permissionService.createApiRoutes(app);

}

bootstrap();
