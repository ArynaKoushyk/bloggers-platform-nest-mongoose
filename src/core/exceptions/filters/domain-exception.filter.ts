import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DomainException } from '../domain.exception';
import type { Request, Response } from 'express';
import { DomainExceptionCode } from '../domain-exception-code.enum';
import type { ErrorResponseBody } from '../error-response-body.type';
import type { ApiErrorResponse } from '../api-error-response.type';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.mapToHttpStatus(exception.code);
    const responseBody =
      status === HttpStatus.BAD_REQUEST
        ? this.buildBadRequestResponse(exception)
        : this.buildResponseBody(exception, request.url);

    response.status(status).json(responseBody);
  }

  private buildBadRequestResponse(
    exception: DomainException,
  ): ApiErrorResponse {
    return {
      errorsMessages: exception.extensions.map(({ message, key }) => ({
        message,
        field: key,
      })),
    };
  }

  private mapToHttpStatus(code: DomainExceptionCode): HttpStatus {
    switch (code) {
      case DomainExceptionCode.BadRequest:
      case DomainExceptionCode.ValidationError:
      case DomainExceptionCode.ConfirmationCodeExpired:
      case DomainExceptionCode.EmailNotConfirmed:
      case DomainExceptionCode.PasswordRecoveryCodeExpired:
        return HttpStatus.BAD_REQUEST;

      case DomainExceptionCode.Conflict:
        return HttpStatus.CONFLICT;

      case DomainExceptionCode.Forbidden:
        return HttpStatus.FORBIDDEN;

      case DomainExceptionCode.NotFound:
        return HttpStatus.NOT_FOUND;

      case DomainExceptionCode.Unauthorized:
        return HttpStatus.UNAUTHORIZED;

      case DomainExceptionCode.InternalServerError:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return HttpStatus.I_AM_A_TEAPOT;
    }
  }

  private buildResponseBody(
    exception: DomainException,
    requestUrl: string,
  ): ErrorResponseBody {
    return {
      timestamp: new Date().toISOString(),
      path: requestUrl,
      message: exception.message,
      code: exception.code,
      extensions: exception.extensions,
    };
  }
}
