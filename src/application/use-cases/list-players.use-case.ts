import { IPlayerRepository } from '@domain/repositories/player.repository.interface';
import { PlayerMapper, PlayerOutputDto } from '../dtos/player.dto';

export class ListPlayersUseCase {
  constructor(private readonly playerRepository: IPlayerRepository) {}

  public async execute(): Promise<PlayerOutputDto[]> {
    const players = await this.playerRepository.listAll();
    return players.map(PlayerMapper.toOutput);
  }
}
