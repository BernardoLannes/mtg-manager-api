import { IScryfallGateway, ScryfallCardData } from '@domain/gateways/scryfall.gateway.interface';

export class SearchScryfallUseCase {
  constructor(private readonly scryfallGateway: IScryfallGateway) {}

  public async execute(name: string): Promise<ScryfallCardData> {
    return this.scryfallGateway.searchCardByName(name);
  }
}
