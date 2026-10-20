import { Card, CardRarity } from '@domain/entities/card.entity';
import { CardFilterOptions, ICardRepository } from '@domain/repositories/card.repository.interface';
import { prisma } from '../database/prisma.client';

export class PrismaCardRepository implements ICardRepository {
  private seeded = false;

  private async ensureSeeded(): Promise<void> {
    if (this.seeded) return;
    this.seeded = true;

    try {
      const count = await prisma.card.count();
      if (count > 0) return;

      const initialSeeds = [
        {
          id: '11111111-1111-1111-1111-111111111111',
          name: 'Black Lotus',
          manaCost: '{0}',
          cmc: 0,
          typeLine: 'Artifact',
          oracleText: '{T}, Sacrifice Black Lotus: Add three mana of any one color.',
          colors: '',
          rarity: 'rare',
          set: 'LEA',
          imageUrl:
            'https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg',
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          name: 'Lightning Bolt',
          manaCost: '{R}',
          cmc: 1,
          typeLine: 'Instant',
          oracleText: 'Lightning Bolt deals 3 damage to any target.',
          colors: 'R',
          rarity: 'common',
          set: 'LEA',
          imageUrl:
            'https://cards.scryfall.io/normal/front/c/c/cc4f6aaa-3153-4516-a7e6-ab13042534f9.jpg',
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          name: 'Counterspell',
          manaCost: '{U}{U}',
          cmc: 2,
          typeLine: 'Instant',
          oracleText: 'Counter target spell.',
          colors: 'U',
          rarity: 'uncommon',
          set: 'LEA',
          imageUrl:
            'https://cards.scryfall.io/normal/front/1/9/1920dae4-fb92-4f19-ae4b-eb3276b8dac7.jpg',
        },
        {
          id: '44444444-4444-4444-4444-444444444444',
          name: 'Birds of Paradise',
          manaCost: '{G}',
          cmc: 1,
          typeLine: 'Creature — Bird',
          oracleText: 'Flying\n{T}: Add one mana of any color.',
          colors: 'G',
          rarity: 'rare',
          set: 'LEA',
          power: '0',
          toughness: '1',
          imageUrl:
            'https://cards.scryfall.io/normal/front/f/e/feefe9f0-24a6-461c-9ef1-86c5a6f33b83.jpg',
        },
        {
          id: '55555555-5555-5555-5555-555555555555',
          name: 'Dark Ritual',
          manaCost: '{B}',
          cmc: 1,
          typeLine: 'Instant',
          oracleText: 'Add {B}{B}{B}.',
          colors: 'B',
          rarity: 'common',
          set: 'LEA',
          imageUrl:
            'https://cards.scryfall.io/normal/front/9/5/95f27eeb-6f14-4db3-adb9-9be5ed76b34b.jpg',
        },
        {
          id: '66666666-6666-6666-6666-666666666666',
          name: 'Serra Angel',
          manaCost: '{3}{W}{W}',
          cmc: 5,
          typeLine: 'Creature — Angel',
          oracleText: 'Flying, vigilance',
          colors: 'W',
          rarity: 'uncommon',
          set: 'LEA',
          power: '4',
          toughness: '4',
          imageUrl:
            'https://cards.scryfall.io/normal/front/9/0/9067f035-3437-4c5c-bae9-d3c9001a3411.jpg',
        },
      ];

      await prisma.card.createMany({
        data: initialSeeds,
        skipDuplicates: true,
      });
    } catch {
      // Ignore seed error if db not ready
    }
  }

  public async findAll(filters?: CardFilterOptions): Promise<Card[]> {
    await this.ensureSeeded();

    const where: Record<string, unknown> = {};

    if (filters?.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }

    if (filters?.type) {
      where.typeLine = { contains: filters.type, mode: 'insensitive' };
    }

    if (filters?.color) {
      where.colors = { contains: filters.color.toUpperCase() };
    }

    if (filters?.rarity) {
      where.rarity = { equals: filters.rarity.toLowerCase(), mode: 'insensitive' };
    }

    if (filters?.set) {
      where.set = { equals: filters.set.toUpperCase(), mode: 'insensitive' };
    }

    const records = await prisma.card.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  public async findById(id: string): Promise<Card | null> {
    await this.ensureSeeded();

    const record = await prisma.card.findUnique({
      where: { id },
    });

    return record ? this.toDomain(record) : null;
  }

  public async findByName(name: string): Promise<Card | null> {
    await this.ensureSeeded();

    const record = await prisma.card.findFirst({
      where: { name: { equals: name.trim(), mode: 'insensitive' } },
    });

    return record ? this.toDomain(record) : null;
  }

  public async create(card: Card): Promise<Card> {
    const record = await prisma.card.create({
      data: {
        id: card.id,
        name: card.name,
        manaCost: card.manaCost,
        cmc: card.cmc,
        typeLine: card.typeLine,
        oracleText: card.oracleText,
        colors: card.colors.join(','),
        rarity: card.rarity,
        set: card.set,
        power: card.power,
        toughness: card.toughness,
        imageUrl: card.imageUrl,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
      },
    });

    return this.toDomain(record);
  }

  public async update(id: string, card: Card): Promise<Card | null> {
    try {
      const record = await prisma.card.update({
        where: { id },
        data: {
          name: card.name,
          manaCost: card.manaCost,
          cmc: card.cmc,
          typeLine: card.typeLine,
          oracleText: card.oracleText,
          colors: card.colors.join(','),
          rarity: card.rarity,
          set: card.set,
          power: card.power,
          toughness: card.toughness,
          imageUrl: card.imageUrl,
          updatedAt: new Date(),
        },
      });

      return this.toDomain(record);
    } catch {
      return null;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await prisma.card.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  private toDomain(record: {
    id: string;
    name: string;
    manaCost: string;
    cmc: number;
    typeLine: string;
    oracleText: string | null;
    colors: string;
    rarity: string;
    set: string;
    power: string | null;
    toughness: string | null;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Card {
    const colors = record.colors ? record.colors.split(',').filter(Boolean) : [];
    const rarity = (
      ['common', 'uncommon', 'rare', 'mythic'].includes(record.rarity.toLowerCase())
        ? record.rarity.toLowerCase()
        : 'common'
    ) as CardRarity;

    return new Card({
      id: record.id,
      name: record.name,
      manaCost: record.manaCost,
      cmc: record.cmc,
      typeLine: record.typeLine,
      oracleText: record.oracleText ?? undefined,
      colors,
      rarity,
      set: record.set,
      power: record.power ?? undefined,
      toughness: record.toughness ?? undefined,
      imageUrl: record.imageUrl ?? undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
