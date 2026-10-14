import { ICardRepository } from '@domain/repositories/card.repository.interface';
import { CardFilterInputDto, CardMapper, CardOutputDto } from '../dtos/card.dto';

export class ListCardsUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  public async execute(filters?: CardFilterInputDto): Promise<CardOutputDto[]> {
    const cards = await this.cardRepository.findAll(filters);
    return cards.map(CardMapper.toOutput);
  }
}
