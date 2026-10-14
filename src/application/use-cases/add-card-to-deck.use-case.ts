import { Card, CardRarity } from '@domain/entities/card.entity';
import { PlayerNotFoundError } from '@domain/errors/domain.error';
import { IScryfallGateway } from '@domain/gateways/scryfall.gateway.interface';
import { ICardRepository } from '@domain/repositories/card.repository.interface';
import { IPlayerRepository } from '@domain/repositories/player.repository.interface';
import { AddCardToDeckInputDto, PlayerDeckOutputDto, PlayerMapper } from '../dtos/player.dto';

export class AddCardToDeckUseCase {
  constructor(
    private readonly playerRepository: IPlayerRepository,
    private readonly cardRepository: ICardRepository,
    private readonly scryfallGateway: IScryfallGateway,
  ) {}

  public async execute(input: AddCardToDeckInputDto): Promise<PlayerDeckOutputDto> {
    const player = await this.playerRepository.findById(input.playerId);
    if (!player) {
      throw new PlayerNotFoundError(input.playerId);
    }

    // 1. Check if card exists in local catalog, otherwise fetch from Scryfall API
    let card = await this.cardRepository.findByName(input.cardName);

    if (!card) {
      const scryfallData = await this.scryfallGateway.searchCardByName(input.cardName);

      const rarityNormalized = (
        ['common', 'uncommon', 'rare', 'mythic'].includes(scryfallData.rarity.toLowerCase())
          ? scryfallData.rarity.toLowerCase()
          : 'common'
      ) as CardRarity;

      card = new Card({
        id: scryfallData.id,
        name: scryfallData.name,
        manaCost: scryfallData.manaCost,
        cmc: scryfallData.cmc,
        typeLine: scryfallData.typeLine,
        oracleText: scryfallData.oracleText,
        colors: scryfallData.colors,
        rarity: rarityNormalized,
        set: scryfallData.set,
        power: scryfallData.power,
        toughness: scryfallData.toughness,
        imageUrl: scryfallData.imageUrl,
      });

      card = await this.cardRepository.create(card);
    }

    // 2. Validate and enforce domain deck building rules
    const quantity = input.quantity ?? 1;
    player.addCard(card, quantity);

    // 3. Persist updated deck and player in database
    await this.playerRepository.save(player);

    return PlayerMapper.toDeckOutput(player);
  }
}
