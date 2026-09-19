export type FieldError = {
  message: string;
  field: string;
};

export type ApiErrorResponse = {
  errorsMessages: FieldError[];
};
