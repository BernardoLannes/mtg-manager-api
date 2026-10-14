import { Card } from '@domain/entities/card.entity';
import { CardAlreadyExistsError } from '@domain/errors/domain.error';
import { ICardRepository } from '@domain/repositories/card.repository.interface';
import { CardMapper, CardOutputDto, CreateCardInputDto } from '../dtos/card.dto';

export class CreateCardUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  public async execute(input: CreateCardInputDto): Promise<CardOutputDto> {
    const existing = await this.cardRepository.findByName(input.name);
    if (existing) {
      throw new CardAlreadyExistsError(input.name);
    }

    const card = new Card({
      name: input.name,
      manaCost: input.manaCost,
      cmc: input.cmc,
      typeLine: input.typeLine,
      oracleText: input.oracleText,
      colors: input.colors,
      rarity: input.rarity,
      set: input.set,
      power: input.power,
      toughness: input.toughness,
      imageUrl: input.imageUrl,
    });

    const savedCard = await this.cardRepository.create(card);
    return CardMapper.toOutput(savedCard);
  }
}
