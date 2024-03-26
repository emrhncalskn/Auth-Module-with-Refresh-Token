import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LogService } from './log.service';
import { LogConstant } from './log.constant';

// Middleware that enables the capture and logging of errors
@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  constructor(
    private logService: LogService
  ) { }

  // Method to handle incoming requests and responses
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Log the response
      await this.logService.getResponseLog(res);
      // Call the next middleware in the chain if available
      if (next) {
        next();
        return;
      }
    }
    // Catch any errors that occur during logging
    catch (e) {
      // Log the error
      await this.logService.createLog(res, JSON.stringify({ msg: LogConstant.ERROR_IN_LOGGER, error: e.message }), true);
      // Call the next middleware in the chain
      next();
      return;
    }
  }
}
