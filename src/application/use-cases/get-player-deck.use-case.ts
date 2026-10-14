import { PlayerNotFoundError } from '@domain/errors/domain.error';
import { IPlayerRepository } from '@domain/repositories/player.repository.interface';
import { PlayerDeckOutputDto, PlayerMapper } from '../dtos/player.dto';

export class GetPlayerDeckUseCase {
  constructor(private readonly playerRepository: IPlayerRepository) {}

  public async execute(playerId: string): Promise<PlayerDeckOutputDto> {
    const player = await this.playerRepository.findById(playerId);
    if (!player) {
      throw new PlayerNotFoundError(playerId);
    }

    return PlayerMapper.toDeckOutput(player);
  }
}
