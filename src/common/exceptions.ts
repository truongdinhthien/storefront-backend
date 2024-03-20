export class ApiException extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HttpNotFoundException extends ApiException {
  constructor(message: string) {
    super(message, 404);
  }
}

export class HttpBadRequestException extends ApiException {
  constructor(message: string) {
    super(message, 400);
  }
}
