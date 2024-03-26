import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Encryptor } from './encryptor/encryptor';
import { Api } from './entities/api.entity';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { PermissionService } from './permission/permission.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { PermissionController } from './permission/permission.controller';
import { GetUserPipe } from './pipes/parse-token.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([Api, Permission, Role]), UserModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController, PermissionController],
  providers: [
    AuthService, JwtService, PermissionService, LocalStrategy, JwtStrategy, RefreshTokenStrategy, Encryptor, GetUserPipe,
    { provide: APP_GUARD, useClass: JwtAuthGuard }, { provide: APP_GUARD, useClass: PermissionGuard }
  ],
  exports: [PermissionService]
})
export class AuthModule { }