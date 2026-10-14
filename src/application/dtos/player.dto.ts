import { Player } from '@domain/entities/player.entity';
import { CardMapper, CardOutputDto } from './card.dto';

export interface CreatePlayerInputDto {
  name: string;
  email: string;
}

export interface PlayerOutputDto {
  id: string;
  name: string;
  email: string;
  totalCards: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddCardToDeckInputDto {
  playerId: string;
  cardName: string;
  quantity?: number;
}

export interface DeckItemOutputDto {
  card: CardOutputDto;
  quantity: number;
}

export interface PlayerDeckOutputDto {
  playerId: string;
  playerName: string;
  playerEmail: string;
  totalCards: number;
  deck: DeckItemOutputDto[];
}

export class PlayerMapper {
  public static toOutput(player: Player): PlayerOutputDto {
    return {
      id: player.id,
      name: player.name,
      email: player.email,
      totalCards: player.getTotalDeckSize(),
      createdAt: player.createdAt.toISOString(),
      updatedAt: player.updatedAt.toISOString(),
    };
  }

  public static toDeckOutput(player: Player): PlayerDeckOutputDto {
    return {
      playerId: player.id,
      playerName: player.name,
      playerEmail: player.email,
      totalCards: player.getTotalDeckSize(),
      deck: player.deck.map((item) => ({
        card: CardMapper.toOutput(item.card),
        quantity: item.quantity,
      })),
    };
  }
}
