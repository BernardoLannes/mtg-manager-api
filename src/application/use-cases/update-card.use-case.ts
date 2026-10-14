import { CardNotFoundError } from '@domain/errors/domain.error';
import { ICardRepository } from '@domain/repositories/card.repository.interface';
import { CardMapper, CardOutputDto, UpdateCardInputDto } from '../dtos/card.dto';

export class UpdateCardUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  public async execute(id: string, input: UpdateCardInputDto): Promise<CardOutputDto> {
    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new CardNotFoundError(id);
    }

    card.update(input);

    const updatedCard = await this.cardRepository.update(id, card);
    if (!updatedCard) {
      throw new CardNotFoundError(id);
    }

    return CardMapper.toOutput(updatedCard);
  }
}
