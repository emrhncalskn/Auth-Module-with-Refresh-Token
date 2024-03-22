import { INestApplication, Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }

  randomDigits(res: Response) {
    const digits = Math.floor(100000 + Math.random() * 900000)
    return res.status(200).send({ digits });
  }
}