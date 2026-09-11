import { DomainExceptionCode } from './domain-exception-codes';
import { Extension } from './error-extension.type';

export type ErrorResponseBody = {
  timestamp: string;
  path: string | null;
  message: string;
  extensions: Extension[];
  code: DomainExceptionCode;
};
