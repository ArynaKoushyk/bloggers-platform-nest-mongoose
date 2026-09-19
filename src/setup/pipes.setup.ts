import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from '@nestjs/common';

import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-code.enum';
import type { ErrorExtension } from '../core/exceptions/error-extension.type';
import { DomainException } from '../core/exceptions/domain.exception';

//функция использует рекурсию для обхода объекта children при вложенных полях при валидации
//TODO: tests

export const formatValidationErrors = (
  errors: ValidationError[],
  parentPath = '',
): ErrorExtension[] => {
  return errors.flatMap((error) => {
    const key = parentPath ? `${parentPath}.${error.property}` : error.property;
    const message = error.constraints
      ? Object.values(error.constraints)[0]
      : undefined;

    const currentError: ErrorExtension[] = message ? [{ key, message }] : [];
    const childErrors = formatValidationErrors(error.children ?? [], key);

    return [...currentError, ...childErrors];
  });
};

export function setupGlobalPipes(app: INestApplication) {
  //Глобальный пайп для валидации и трансформации входящих данных.
  app.useGlobalPipes(
    new ParseObjectIdPipe(),
    new ValidationPipe({
      //class-transformer создает экземпляр dto
      //соответственно применятся значения по-умолчанию
      //и методы классов dto
      transform: true,

      whitelist: true,
      //Выдавать первую ошибку для каждого поля
      stopAtFirstError: true,
      //Для преобразования ошибок класс валидатора в необходимый вид
      exceptionFactory: (errors) => {
        const formattedErrors = formatValidationErrors(errors);

        throw new DomainException({
          code: DomainExceptionCode.ValidationError,
          message: 'Validation failed',
          extensions: formattedErrors,
        });
      },
    }),
  );
}
