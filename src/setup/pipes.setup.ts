import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from '@nestjs/common';

import { ObjectIdValidationTransformationPipe } from '../core/pipes/object-id-validation-transformation-pipe.service';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-codes';
import type { Extension } from '../core/exceptions/error-extension.type';
import { DomainException } from '../core/exceptions/domain-exceptions';

//функция использует рекурсию для обхода объекта children при вложенных полях при валидации
//TODO: tests

export const errorFormatter = (
  errors: ValidationError[],
  parentPath = '',
): Extension[] => {
  return errors.flatMap((error) => {
    const key = parentPath ? `${parentPath}.${error.property}` : error.property;
    const message = error.constraints
      ? Object.values(error.constraints)[0]
      : undefined;

    const currentError: Extension[] = message ? [{ key, message }] : [];
    const childErrors = errorFormatter(error.children ?? [], key);

    return [...currentError, ...childErrors];
  });
};

export function pipesSetup(app: INestApplication) {
  //Глобальный пайп для валидации и трансформации входящих данных.
  app.useGlobalPipes(
    new ObjectIdValidationTransformationPipe(),
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
        const formattedErrors = errorFormatter(errors);

        throw new DomainException({
          code: DomainExceptionCode.ValidationError,
          message: 'Validation failed',
          extensions: formattedErrors,
        });
      },
    }),
  );
}
