import type { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";
import { HttpStatus } from "../errors/http-status.js";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: "Validation error",
      errors: z.treeifyError(err)
    });
  }

  console.error(err);

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
  });
}