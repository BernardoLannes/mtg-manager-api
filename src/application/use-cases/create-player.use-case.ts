import { Player } from '@domain/entities/player.entity';
import { PlayerAlreadyExistsError } from '@domain/errors/domain.error';
import { IPlayerRepository } from '@domain/repositories/player.repository.interface';
import { CreatePlayerInputDto, PlayerMapper, PlayerOutputDto } from '../dtos/player.dto';

export class CreatePlayerUseCase {
  constructor(private readonly playerRepository: IPlayerRepository) {}

  public async execute(input: CreatePlayerInputDto): Promise<PlayerOutputDto> {
    const existing = await this.playerRepository.findByEmail(input.email);
    if (existing) {
      throw new PlayerAlreadyExistsError(input.email);
    }

    const player = new Player({
      name: input.name,
      email: input.email,
    });

    const saved = await this.playerRepository.create(player);
    return PlayerMapper.toOutput(saved);
  }
}
