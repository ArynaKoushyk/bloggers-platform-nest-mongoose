import { DomainExceptionCode } from './domain-exception-code.enum';
import { ErrorExtension } from './error-extension.type';

export type ErrorResponseBody = {
  timestamp: string;
  path: string | null;
  message: string;
  extensions: ErrorExtension[];
  code: DomainExceptionCode;
};
