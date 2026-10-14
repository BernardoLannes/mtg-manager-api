export abstract class DomainError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class CardNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Card with ID '${id}' was not found in the local catalog.`, 404);
  }
}

export class CardAlreadyExistsError extends DomainError {
  constructor(name: string) {
    super(`Card with name '${name}' already exists in the catalog.`, 409);
  }
}

export class InvalidCardDataError extends DomainError {
  constructor(reason: string) {
    super(`Invalid card data: ${reason}`, 400);
  }
}
