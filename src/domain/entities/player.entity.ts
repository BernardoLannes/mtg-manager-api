import {
  DeckLimitExceededError,
  InvalidCardDataError,
  MaxCardCopiesExceededError,
} from '../errors/domain.error';
import { Card } from './card.entity';

export interface DeckCardItem {
  card: Card;
  quantity: number;
}

export interface PlayerProps {
  id?: string;
  name: string;
  email: string;
  deck?: DeckCardItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

const BASIC_LANDS = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Wastes'];

export class Player {
  private readonly _id: string;
  private _name: string;
  private _email: string;
  private _deck: Map<string, DeckCardItem>;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: PlayerProps) {
    this.validate(props);

    this._id = props.id ?? crypto.randomUUID();
    this._name = props.name.trim();
    this._email = props.email.trim().toLowerCase();
    this._deck = new Map();

    if (props.deck) {
      for (const item of props.deck) {
        this._deck.set(item.card.id, { card: item.card, quantity: item.quantity });
      }
    }

    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: PlayerProps): void {
    if (!props.name || props.name.trim().length < 2) {
      throw new InvalidCardDataError('Player name must be at least 2 characters long.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!props.email || !emailRegex.test(props.email.trim())) {
      throw new InvalidCardDataError('Invalid player email format.');
    }
  }

  public isBasicLand(card: Card): boolean {
    const typeLineLower = card.typeLine.toLowerCase();
    return BASIC_LANDS.some((land) => typeLineLower.includes(land.toLowerCase()));
  }

  public getTotalDeckSize(): number {
    let total = 0;
    for (const item of this._deck.values()) {
      total += item.quantity;
    }
    return total;
  }

  public getCopiesCountByName(cardName: string): number {
    let count = 0;
    const target = cardName.trim().toLowerCase();
    for (const item of this._deck.values()) {
      if (item.card.name.toLowerCase() === target) {
        count += item.quantity;
      }
    }
    return count;
  }

  public addCard(card: Card, quantity = 1, maxDeckSize = 60, maxCopies = 4): void {
    if (quantity <= 0) {
      throw new InvalidCardDataError('Quantity to add must be greater than zero.');
    }

    const currentTotal = this.getTotalDeckSize();
    if (currentTotal + quantity > maxDeckSize) {
      throw new DeckLimitExceededError(maxDeckSize);
    }

    const isLand = this.isBasicLand(card);
    if (!isLand) {
      const currentCopies = this.getCopiesCountByName(card.name);
      if (currentCopies + quantity > maxCopies) {
        throw new MaxCardCopiesExceededError(card.name, maxCopies);
      }
    }

    const existing = this._deck.get(card.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this._deck.set(card.id, { card, quantity });
    }

    this._updatedAt = new Date();
  }

  public removeCard(cardId: string, quantity = 1): void {
    const existing = this._deck.get(cardId);
    if (!existing) {
      return;
    }

    if (existing.quantity <= quantity) {
      this._deck.delete(cardId);
    } else {
      existing.quantity -= quantity;
    }

    this._updatedAt = new Date();
  }

  public get id(): string {
    return this._id;
  }
  public get name(): string {
    return this._name;
  }
  public get email(): string {
    return this._email;
  }
  public get deck(): DeckCardItem[] {
    return Array.from(this._deck.values());
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      totalCards: this.getTotalDeckSize(),
      deck: this.deck.map((item) => ({
        card: item.card.toJSON(),
        quantity: item.quantity,
      })),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
