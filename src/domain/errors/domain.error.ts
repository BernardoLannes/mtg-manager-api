export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export abstract class DomainError extends AppError {
  constructor(message: string, statusCode = 400) {
    super(message, statusCode, true);
  }
}

export class CardNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Card '${identifier}' was not found in the catalog.`, 404);
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

export class PlayerNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Player with ID '${id}' was not found.`, 404);
  }
}

export class PlayerAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`Player with email '${email}' already exists.`, 409);
  }
}

export class DeckLimitExceededError extends DomainError {
  constructor(maxSize = 60) {
    super(
      `Deck limit exceeded: Player cannot have more than ${maxSize} cards in active deck.`,
      422,
    );
  }
}

export class MaxCardCopiesExceededError extends DomainError {
  constructor(cardName: string, maxCopies = 4) {
    super(
      `Rule violation: Cannot include more than ${maxCopies} copies of '${cardName}' in deck (rule does not apply to basic lands).`,
      422,
    );
  }
}

export class ScryfallCardNotFoundError extends DomainError {
  constructor(name: string) {
    super(`Card '${name}' was not found in the Scryfall API.`, 404);
  }
}

export class ExternalApiError extends AppError {
  constructor(service: string, details: string) {
    super(`External API failure (${service}): ${details}`, 502);
  }
}
