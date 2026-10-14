import {
  CreateCardUseCase,
  DeleteCardUseCase,
  GetCardByIdUseCase,
  ListCardsUseCase,
  UpdateCardUseCase,
} from '@application/index';
import { InMemoryCardRepository } from '@infrastructure/repositories/in-memory-card.repository';
import { CardController } from '../controllers/card.controller';

// Singleton instance for in-memory persistence during application runtime
const inMemoryCardRepository = new InMemoryCardRepository();

export function makeCardController(): CardController {
  const listCardsUseCase = new ListCardsUseCase(inMemoryCardRepository);
  const getCardByIdUseCase = new GetCardByIdUseCase(inMemoryCardRepository);
  const createCardUseCase = new CreateCardUseCase(inMemoryCardRepository);
  const updateCardUseCase = new UpdateCardUseCase(inMemoryCardRepository);
  const deleteCardUseCase = new DeleteCardUseCase(inMemoryCardRepository);

  return new CardController(
    listCardsUseCase,
    getCardByIdUseCase,
    createCardUseCase,
    updateCardUseCase,
    deleteCardUseCase,
  );
}
