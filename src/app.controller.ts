import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  randomDigits(@Res() res: Response) {
    return this.appService.randomDigits(res);
  }

}
