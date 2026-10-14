import { Card, CardRarity } from '../entities/card.entity';

export interface CardFilterOptions {
  name?: string;
  type?: string;
  color?: string;
  rarity?: CardRarity | string;
  set?: string;
}

export interface ICardRepository {
  findAll(filters?: CardFilterOptions): Promise<Card[]>;
  findById(id: string): Promise<Card | null>;
  findByName(name: string): Promise<Card | null>;
  create(card: Card): Promise<Card>;
  update(id: string, card: Card): Promise<Card | null>;
  delete(id: string): Promise<boolean>;
}
