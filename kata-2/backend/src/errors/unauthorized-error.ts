import { AppError } from "./app-error";
import { HttpStatus } from "./http-status";

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

// throw new UnauthorizedError("Invalid credentials"); exemplo de uso