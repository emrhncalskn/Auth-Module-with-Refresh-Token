import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmDbSource } from 'db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmDbSource), AuthModule, UserModule, LogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
