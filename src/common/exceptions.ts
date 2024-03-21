import httpStatus from 'http-status';

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
    super(message, httpStatus.NOT_FOUND);
  }
}

export class HttpBadRequestException extends ApiException {
  constructor(message: string) {
    super(message, httpStatus.BAD_REQUEST);
  }
}

export class HttpUnauthorizedException extends ApiException {
  constructor(message: string) {
    super(message, httpStatus.UNAUTHORIZED);
  }
}

export class HttpForbiddenException extends ApiException {
  constructor(message: string) {
    super(message, httpStatus.FORBIDDEN);
  }
}
