import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { LoggerMiddleware } from './log.middleware';
import { LogService } from './log.service';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionHandler } from './exception.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [LoggerMiddleware, LogService, // Provide LoggerMiddleware and LogService
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler // Provide ExceptionHandler as the application filter
    }
  ],
})

export class LogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { // Configure middleware to be used for all routes
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
