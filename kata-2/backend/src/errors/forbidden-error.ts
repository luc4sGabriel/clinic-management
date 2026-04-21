import { AppError } from "./app-error";
import { HttpStatus } from "./http-status";

export class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, HttpStatus.FORBIDDEN);
  }
}

