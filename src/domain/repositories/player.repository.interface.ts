import { Player } from '../entities/player.entity';

export interface IPlayerRepository {
  create(player: Player): Promise<Player>;
  findById(id: string): Promise<Player | null>;
  findByEmail(email: string): Promise<Player | null>;
  save(player: Player): Promise<Player>;
  listAll(): Promise<Player[]>;
}
