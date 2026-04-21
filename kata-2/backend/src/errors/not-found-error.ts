import { AppError } from "./app-error";
import { HttpStatus } from "./http-status";

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, HttpStatus.NOT_FOUND);
  }
}

// throw new NotFoundError("User"); exemplo de uso 