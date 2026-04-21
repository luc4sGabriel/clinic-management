// fiz essa classe pra padronizar os erros da aplicacao 500, 400 etc .. , e pra ajudar a capturar os erros certos no teste

import { HttpStatus } from "./http-status";

export class AppError extends Error {
  public readonly statusCode: HttpStatus;

  constructor(message: string, statusCode: HttpStatus) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}