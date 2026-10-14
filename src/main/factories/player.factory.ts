import {
  AddCardToDeckUseCase,
  CreatePlayerUseCase,
  GetPlayerDeckUseCase,
  ListPlayersUseCase,
} from '@application/index';
import { ScryfallProvider } from '@infrastructure/providers/scryfall.provider';
import { PlayerController } from '../controllers/player.controller';
import { getCardRepository, getPlayerRepository } from './repository.factory';

export function makePlayerController(): PlayerController {
  const playerRepository = getPlayerRepository();
  const cardRepository = getCardRepository();
  const scryfallGateway = new ScryfallProvider();

  const createPlayerUseCase = new CreatePlayerUseCase(playerRepository);
  const listPlayersUseCase = new ListPlayersUseCase(playerRepository);
  const addCardToDeckUseCase = new AddCardToDeckUseCase(
    playerRepository,
    cardRepository,
    scryfallGateway,
  );
  const getPlayerDeckUseCase = new GetPlayerDeckUseCase(playerRepository);

  return new PlayerController(
    createPlayerUseCase,
    listPlayersUseCase,
    addCardToDeckUseCase,
    getPlayerDeckUseCase,
  );
}
