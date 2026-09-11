import { DomainExceptionCode } from './domain-exception-codes';
import { Extension } from './error-extension.type';

export class DomainException extends Error {
  readonly code: DomainExceptionCode;
  readonly extensions: Extension[];

  constructor(errorInfo: {
    code: DomainExceptionCode;
    message: string;
    extensions?: Extension[];
  }) {
    super(errorInfo.message);
    this.name = DomainException.name;
    this.code = errorInfo.code;
    this.extensions = errorInfo.extensions ?? [];
  }
}
