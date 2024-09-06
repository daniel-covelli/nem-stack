import { StatusCodes } from "http-status-codes";

// base error class
export class BaseError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

// 404 error class
export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// validation error class
export class ValidationError extends BaseError {
  errorData: Record<string, string>[];
  constructor(data: Record<string, string>[]) {
    super("Validation Error", StatusCodes.BAD_REQUEST);
    this.errorData = data;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AlreadyExists extends BaseError {
  errorData: Record<string, string>[];
  constructor(data: Record<string, string>[]) {
    super("AlreadyExists", StatusCodes.CONFLICT);
    this.errorData = data;
    Object.setPrototypeOf(this, AlreadyExists.prototype);
  }
}
