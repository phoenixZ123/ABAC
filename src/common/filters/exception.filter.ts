import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = {
        success: false,
        message: 'Internal server error',
      };
      this.logger.error(
        `Unexpected error: ${exception instanceof Error ? exception.stack : exception}`,
      );
    }

    response.status(status).json({
      success: false,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(
        typeof message === 'string'
          ? { message }
          : message // for objects like { status, message }
      ),
    });
  }
}
