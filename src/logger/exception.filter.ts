import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomLogger } from './logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new CustomLogger();

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const httpStatusMessage =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const httpStatusError =
      exception instanceof HttpException
        ? exception.name
        : 'Internal server error';

    const responseBody = {
      statusCode: httpStatus,
      message: httpStatusMessage,
      error: httpStatusError,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    console.log('11111111 exception', exception);
    this.logger.error(exception);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
