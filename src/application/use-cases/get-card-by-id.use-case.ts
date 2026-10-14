import { CardNotFoundError } from '@domain/errors/domain.error';
import { ICardRepository } from '@domain/repositories/card.repository.interface';
import { CardMapper, CardOutputDto } from '../dtos/card.dto';

export class GetCardByIdUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  public async execute(id: string): Promise<CardOutputDto> {
    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new CardNotFoundError(id);
    }
    return CardMapper.toOutput(card);
  }
}
