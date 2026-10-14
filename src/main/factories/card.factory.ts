import {
  CreateCardUseCase,
  DeleteCardUseCase,
  GetCardByIdUseCase,
  ListCardsUseCase,
  UpdateCardUseCase,
} from '@application/index';
import { CardController } from '../controllers/card.controller';
import { getCardRepository } from './repository.factory';

export function makeCardController(): CardController {
  const cardRepository = getCardRepository();

  const listCardsUseCase = new ListCardsUseCase(cardRepository);
  const getCardByIdUseCase = new GetCardByIdUseCase(cardRepository);
  const createCardUseCase = new CreateCardUseCase(cardRepository);
  const updateCardUseCase = new UpdateCardUseCase(cardRepository);
  const deleteCardUseCase = new DeleteCardUseCase(cardRepository);

  return new CardController(
    listCardsUseCase,
    getCardByIdUseCase,
    createCardUseCase,
    updateCardUseCase,
    deleteCardUseCase,
  );
}
