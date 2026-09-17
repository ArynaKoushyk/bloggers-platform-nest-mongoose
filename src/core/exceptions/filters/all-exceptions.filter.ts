import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { DomainExceptionCode } from '../domain-exception-codes';
import type { ErrorResponseBody } from '../error-response-body.type';
import { ConfigService } from '@nestjs/config';

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = this.extractHttpExceptionMessage(exception);
      const code = this.mapHttpStatusToDomainCode(status);
      const responseBody = this.buildResponseBody({
        requestUrl: request.url,
        message,
        code,
        hideDetailsInProduction: status >= 500,
      });

      response.status(status).json(responseBody);
      return;
    }

    //Если сработал этот фильтр, то пользователю улетит 500я ошибка

    const message =
      exception instanceof Error
        ? exception.message
        : 'Unknown exception occurred.';
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = this.buildResponseBody({
      requestUrl: request.url,
      message,
      code: DomainExceptionCode.InternalServerError,
      hideDetailsInProduction: true,
    });

    response.status(status).json(responseBody);
  }

  private extractHttpExceptionMessage(exception: HttpException): string {
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if ('message' in exceptionResponse) {
      const { message } = exceptionResponse;

      if (typeof message === 'string') {
        return message;
      }

      if (Array.isArray(message)) {
        return message.filter((item) => typeof item === 'string').join('; ');
      }
    }

    return exception.message;
  }

  private mapHttpStatusToDomainCode(status: HttpStatus): DomainExceptionCode {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return DomainExceptionCode.BadRequest;
      case HttpStatus.UNAUTHORIZED:
        return DomainExceptionCode.Unauthorized;
      case HttpStatus.FORBIDDEN:
        return DomainExceptionCode.Forbidden;
      case HttpStatus.NOT_FOUND:
        return DomainExceptionCode.NotFound;
      case HttpStatus.CONFLICT:
        return DomainExceptionCode.Conflict;
      default:
        return status >= HttpStatus.INTERNAL_SERVER_ERROR
          ? DomainExceptionCode.InternalServerError
          : DomainExceptionCode.BadRequest;
    }
  }

  private buildResponseBody(args: {
    requestUrl: string;
    message: string;
    code: DomainExceptionCode;
    hideDetailsInProduction: boolean;
  }): ErrorResponseBody {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    if (isProduction && args.hideDetailsInProduction) {
      return {
        timestamp: new Date().toISOString(),
        path: null,
        message: 'Some error occurred',
        extensions: [],
        code: DomainExceptionCode.InternalServerError,
      };
    }

    return {
      timestamp: new Date().toISOString(),
      path: args.requestUrl,
      message: args.message,
      extensions: [],
      code: args.code,
    };
  }
}
