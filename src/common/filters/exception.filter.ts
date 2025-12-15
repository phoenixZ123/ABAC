// common/filters/exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

function safeJsonParse(value: any) {
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return value; // fallback to original string
  }
}
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // ✅ SAFE JSON.parse usage
      const parsed = safeJsonParse(exceptionResponse);

      if (typeof parsed === 'string') {
        message = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        message = parsed.message ?? parsed;
      }
    }

    response.status(status).json({
      success: false,
      path: request.url,
      timestamp: new Date().toISOString(),
      message,
      statusCode: status,
    });
  }
}

