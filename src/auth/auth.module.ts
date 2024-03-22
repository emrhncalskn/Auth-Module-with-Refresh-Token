import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Encryptor } from './encryptor/encryptor';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtService, LocalStrategy, JwtStrategy, RefreshTokenStrategy, Encryptor, { provide: APP_GUARD, useClass: JwtAuthGuard }]
})
export class AuthModule { }