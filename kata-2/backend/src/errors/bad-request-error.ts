import { AppError } from "./app-error";
import { HttpStatus } from "./http-status";

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}