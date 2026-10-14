import { CardNotFoundError } from '@domain/errors/domain.error';
import { ICardRepository } from '@domain/repositories/card.repository.interface';

export class DeleteCardUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  public async execute(id: string): Promise<void> {
    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new CardNotFoundError(id);
    }

    await this.cardRepository.delete(id);
  }
}
