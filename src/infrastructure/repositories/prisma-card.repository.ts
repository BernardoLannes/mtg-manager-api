import { Card, CardRarity } from '@domain/entities/card.entity';
import { CardFilterOptions, ICardRepository } from '@domain/repositories/card.repository.interface';
import { prisma } from '../database/prisma.client';

export class PrismaCardRepository implements ICardRepository {
  public async findAll(filters?: CardFilterOptions): Promise<Card[]> {
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
    const record = await prisma.card.findUnique({
      where: { id },
    });

    return record ? this.toDomain(record) : null;
  }

  public async findByName(name: string): Promise<Card | null> {
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
