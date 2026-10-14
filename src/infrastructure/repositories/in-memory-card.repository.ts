import { Card } from '@domain/entities/card.entity';
import { CardFilterOptions, ICardRepository } from '@domain/repositories/card.repository.interface';

export class InMemoryCardRepository implements ICardRepository {
  private readonly cards: Map<string, Card> = new Map();

  constructor(seedWithDefaults = true) {
    if (seedWithDefaults) {
      this.seedInitialCards();
    }
  }

  public async findAll(filters?: CardFilterOptions): Promise<Card[]> {
    let result = Array.from(this.cards.values());

    if (!filters) {
      return result;
    }

    if (filters.name) {
      const term = filters.name.toLowerCase();
      result = result.filter((card) => card.name.toLowerCase().includes(term));
    }

    if (filters.type) {
      const term = filters.type.toLowerCase();
      result = result.filter((card) => card.typeLine.toLowerCase().includes(term));
    }

    if (filters.color) {
      const colorUpper = filters.color.toUpperCase();
      result = result.filter((card) => card.colors.includes(colorUpper));
    }

    if (filters.rarity) {
      const rarityLower = filters.rarity.toLowerCase();
      result = result.filter((card) => card.rarity.toLowerCase() === rarityLower);
    }

    if (filters.set) {
      const setUpper = filters.set.toUpperCase();
      result = result.filter((card) => card.set.toUpperCase() === setUpper);
    }

    return result;
  }

  public async findById(id: string): Promise<Card | null> {
    const card = this.cards.get(id);
    return card ?? null;
  }

  public async findByName(name: string): Promise<Card | null> {
    const target = name.trim().toLowerCase();
    for (const card of this.cards.values()) {
      if (card.name.toLowerCase() === target) {
        return card;
      }
    }
    return null;
  }

  public async create(card: Card): Promise<Card> {
    this.cards.set(card.id, card);
    return card;
  }

  public async update(id: string, card: Card): Promise<Card | null> {
    if (!this.cards.has(id)) {
      return null;
    }
    this.cards.set(id, card);
    return card;
  }

  public async delete(id: string): Promise<boolean> {
    return this.cards.delete(id);
  }

  public clear(): void {
    this.cards.clear();
  }

  private seedInitialCards(): void {
    const seeds = [
      new Card({
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Black Lotus',
        manaCost: '{0}',
        cmc: 0,
        typeLine: 'Artifact',
        oracleText: '{T}, Sacrifice Black Lotus: Add three mana of any one color.',
        colors: [],
        rarity: 'rare',
        set: 'LEA',
        imageUrl:
          'https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg',
      }),
      new Card({
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Lightning Bolt',
        manaCost: '{R}',
        cmc: 1,
        typeLine: 'Instant',
        oracleText: 'Lightning Bolt deals 3 damage to any target.',
        colors: ['R'],
        rarity: 'common',
        set: 'LEA',
        imageUrl:
          'https://cards.scryfall.io/normal/front/c/c/cc4f6aaa-3153-4516-a7e6-ab13042534f9.jpg',
      }),
      new Card({
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Counterspell',
        manaCost: '{U}{U}',
        cmc: 2,
        typeLine: 'Instant',
        oracleText: 'Counter target spell.',
        colors: ['U'],
        rarity: 'uncommon',
        set: 'LEA',
        imageUrl:
          'https://cards.scryfall.io/normal/front/1/9/1920dae4-fb92-4f19-ae4b-eb3276b8dac7.jpg',
      }),
      new Card({
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Birds of Paradise',
        manaCost: '{G}',
        cmc: 1,
        typeLine: 'Creature — Bird',
        oracleText: 'Flying\n{T}: Add one mana of any color.',
        colors: ['G'],
        rarity: 'rare',
        set: 'LEA',
        power: '0',
        toughness: '1',
        imageUrl:
          'https://cards.scryfall.io/normal/front/f/e/feefe9f0-24a6-461c-9ef1-86c5a6f33b83.jpg',
      }),
      new Card({
        id: '55555555-5555-5555-5555-555555555555',
        name: 'Dark Ritual',
        manaCost: '{B}',
        cmc: 1,
        typeLine: 'Instant',
        oracleText: 'Add {B}{B}{B}.',
        colors: ['B'],
        rarity: 'common',
        set: 'LEA',
        imageUrl:
          'https://cards.scryfall.io/normal/front/9/5/95f27eeb-6f14-4db3-adb9-9be5ed76b34b.jpg',
      }),
      new Card({
        id: '66666666-6666-6666-6666-666666666666',
        name: 'Serra Angel',
        manaCost: '{3}{W}{W}',
        cmc: 5,
        typeLine: 'Creature — Angel',
        oracleText: 'Flying, vigilance',
        colors: ['W'],
        rarity: 'uncommon',
        set: 'LEA',
        power: '4',
        toughness: '4',
        imageUrl:
          'https://cards.scryfall.io/normal/front/9/0/9067f035-3437-4c5c-bae9-d3c9001a3411.jpg',
      }),
    ];

    for (const card of seeds) {
      this.cards.set(card.id, card);
    }
  }
}
