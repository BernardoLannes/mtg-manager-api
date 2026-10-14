import { SearchScryfallUseCase } from '@application/index';
import { ScryfallProvider } from '@infrastructure/providers/scryfall.provider';
import { ScryfallController } from '../controllers/scryfall.controller';

export function makeScryfallController(): ScryfallController {
  const scryfallProvider = new ScryfallProvider();
  const searchScryfallUseCase = new SearchScryfallUseCase(scryfallProvider);
  return new ScryfallController(searchScryfallUseCase);
}
