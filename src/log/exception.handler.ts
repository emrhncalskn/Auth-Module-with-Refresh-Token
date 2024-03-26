import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { LogService } from './log.service';
import { Response } from 'express';
import { LogConstant } from './log.constant';

// This class enables handling of errors caught within try-catch blocks.
// It creates a custom HTTP response and logs the exception.

@Catch()
export class ExceptionHandler implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly logService: LogService
    ) { }

    // Method to catch and handle exceptions
    async catch(exception: unknown, host: ArgumentsHost) {
        const exception_JSON = JSON.parse(JSON.stringify(exception))
        const { httpAdapter } = this.httpAdapterHost; // Get the HTTP adapter
        const ctx = host.switchToHttp(); // Switch context and get the HTTP response
        const res = ctx.getResponse<Response>();
        res.setHeader('origin', 'log-middleware');
        res.setHeader('Authorization', `${res.req.get('Authorization')}`);
        const log = await this.logService.createLog(res, { msg: LogConstant.ERROR_IN_HANDLER, exception }, true); // Log the exception message
        if (!exception_JSON.status || exception_JSON.status >= 500) {
            httpAdapter.reply(ctx.getResponse(), { msg: LogConstant.SOMETHING_WENT_WRONG, error_code: log.unique_code }, 500); // Create an HTTP response and send the error message
        }
        else httpAdapter.reply(ctx.getResponse(), exception_JSON.response, exception_JSON.status);
    }
}
