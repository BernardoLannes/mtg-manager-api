import { InvalidCardDataError } from '../errors/domain.error';

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'mythic';

export type CardColor = 'W' | 'U' | 'B' | 'R' | 'G' | 'C';

export interface CardProps {
  id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export class Card {
  private readonly _id: string;
  private _name: string;
  private _manaCost: string;
  private _cmc: number;
  private _typeLine: string;
  private _oracleText?: string;
  private _colors: string[];
  private _rarity: CardRarity;
  private _set: string;
  private _power?: string;
  private _toughness?: string;
  private _imageUrl?: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: CardProps) {
    this.validate(props);

    this._id = props.id ?? crypto.randomUUID();
    this._name = props.name.trim();
    this._manaCost = props.manaCost.trim();
    this._cmc = props.cmc;
    this._typeLine = props.typeLine.trim();
    this._oracleText = props.oracleText?.trim();
    this._colors = props.colors.map((c) => c.toUpperCase());
    this._rarity = props.rarity;
    this._set = props.set.trim().toUpperCase();
    this._power = props.power?.trim();
    this._toughness = props.toughness?.trim();
    this._imageUrl = props.imageUrl?.trim();
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: CardProps): void {
    if (!props.name || props.name.trim().length === 0) {
      throw new InvalidCardDataError('Card name is required.');
    }
    if (props.cmc < 0) {
      throw new InvalidCardDataError('Converted mana cost (cmc) cannot be negative.');
    }
    if (!props.typeLine || props.typeLine.trim().length === 0) {
      throw new InvalidCardDataError(
        'Card typeLine is required (e.g., Creature — Dragon, Instant).',
      );
    }
    const validRarities: CardRarity[] = ['common', 'uncommon', 'rare', 'mythic'];
    if (!validRarities.includes(props.rarity)) {
      throw new InvalidCardDataError(
        `Invalid rarity '${props.rarity}'. Allowed values: ${validRarities.join(', ')}`,
      );
    }
  }

  public update(props: Partial<Omit<CardProps, 'id' | 'createdAt'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) throw new InvalidCardDataError('Card name cannot be empty.');
      this._name = props.name.trim();
    }
    if (props.manaCost !== undefined) this._manaCost = props.manaCost.trim();
    if (props.cmc !== undefined) {
      if (props.cmc < 0) throw new InvalidCardDataError('cmc cannot be negative.');
      this._cmc = props.cmc;
    }
    if (props.typeLine !== undefined) {
      if (!props.typeLine.trim()) throw new InvalidCardDataError('typeLine cannot be empty.');
      this._typeLine = props.typeLine.trim();
    }
    if (props.oracleText !== undefined) this._oracleText = props.oracleText.trim();
    if (props.colors !== undefined) this._colors = props.colors.map((c) => c.toUpperCase());
    if (props.rarity !== undefined) {
      const validRarities: CardRarity[] = ['common', 'uncommon', 'rare', 'mythic'];
      if (!validRarities.includes(props.rarity)) {
        throw new InvalidCardDataError(`Invalid rarity '${props.rarity}'.`);
      }
      this._rarity = props.rarity;
    }
    if (props.set !== undefined) this._set = props.set.trim().toUpperCase();
    if (props.power !== undefined) this._power = props.power.trim();
    if (props.toughness !== undefined) this._toughness = props.toughness.trim();
    if (props.imageUrl !== undefined) this._imageUrl = props.imageUrl.trim();

    this._updatedAt = new Date();
  }

  // Getters
  public get id(): string {
    return this._id;
  }
  public get name(): string {
    return this._name;
  }
  public get manaCost(): string {
    return this._manaCost;
  }
  public get cmc(): number {
    return this._cmc;
  }
  public get typeLine(): string {
    return this._typeLine;
  }
  public get oracleText(): string | undefined {
    return this._oracleText;
  }
  public get colors(): string[] {
    return [...this._colors];
  }
  public get rarity(): CardRarity {
    return this._rarity;
  }
  public get set(): string {
    return this._set;
  }
  public get power(): string | undefined {
    return this._power;
  }
  public get toughness(): string | undefined {
    return this._toughness;
  }
  public get imageUrl(): string | undefined {
    return this._imageUrl;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public toJSON(): CardProps & { id: string; createdAt: Date; updatedAt: Date } {
    return {
      id: this._id,
      name: this._name,
      manaCost: this._manaCost,
      cmc: this._cmc,
      typeLine: this._typeLine,
      oracleText: this._oracleText,
      colors: this._colors,
      rarity: this._rarity,
      set: this._set,
      power: this._power,
      toughness: this._toughness,
      imageUrl: this._imageUrl,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
