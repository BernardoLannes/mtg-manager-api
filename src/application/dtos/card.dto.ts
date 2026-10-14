import { Card, CardRarity } from '@domain/entities/card.entity';

export interface CreateCardInputDto {
  name: string;
  manaCost: string;
  cmc: number;
  typeLine: string;
  oracleText?: string;
  colors: string[];
  rarity: CardRarity;
  set: string;
  power?: string;
  toughness?: string;
  imageUrl?: string;
}

export interface UpdateCardInputDto {
  name?: string;
  manaCost?: string;
  cmc?: number;
  typeLine?: string;
  oracleText?: string;
  colors?: string[];
  rarity?: CardRarity;
  set?: string;
  power?: string;
  toughness?: string;
  imageUrl?: string;
}

export interface CardFilterInputDto {
  name?: string;
  type?: string;
  color?: string;
  rarity?: string;
  set?: string;
}

export interface CardOutputDto {
  id: string;
  name: string;
  manaCost: string;
  cmc: number;
  typeLine: string;
  oracleText?: string;
  colors: string[];
  rarity: CardRarity;
  set: string;
  power?: string;
  toughness?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export class CardMapper {
  public static toOutput(card: Card): CardOutputDto {
    return {
      id: card.id,
      name: card.name,
      manaCost: card.manaCost,
      cmc: card.cmc,
      typeLine: card.typeLine,
      oracleText: card.oracleText,
      colors: card.colors,
      rarity: card.rarity,
      set: card.set,
      power: card.power,
      toughness: card.toughness,
      imageUrl: card.imageUrl,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    };
  }
}
