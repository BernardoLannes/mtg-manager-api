import { Player } from '@domain/entities/player.entity';
import { IPlayerRepository } from '@domain/repositories/player.repository.interface';

export class InMemoryPlayerRepository implements IPlayerRepository {
  private readonly players: Map<string, Player> = new Map();

  public async create(player: Player): Promise<Player> {
    this.players.set(player.id, player);
    return player;
  }

  public async findById(id: string): Promise<Player | null> {
    const player = this.players.get(id);
    return player ?? null;
  }

  public async findByEmail(email: string): Promise<Player | null> {
    const target = email.trim().toLowerCase();
    for (const player of this.players.values()) {
      if (player.email.toLowerCase() === target) {
        return player;
      }
    }
    return null;
  }

  public async save(player: Player): Promise<Player> {
    this.players.set(player.id, player);
    return player;
  }

  public async listAll(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  public clear(): void {
    this.players.clear();
  }
}
