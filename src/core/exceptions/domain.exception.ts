import { DomainExceptionCode } from './domain-exception-code.enum';
import type { ErrorExtension } from './error-extension.type';

export class DomainException extends Error {
  readonly code: DomainExceptionCode;
  readonly extensions: ErrorExtension[];

  constructor(errorInfo: {
    code: DomainExceptionCode;
    message: string;
    extensions?: ErrorExtension[];
  }) {
    super(errorInfo.message);
    this.name = DomainException.name;
    this.code = errorInfo.code;
    this.extensions = errorInfo.extensions ?? [];
  }
}
