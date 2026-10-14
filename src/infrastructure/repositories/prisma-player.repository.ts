import { Card, CardRarity } from '@domain/entities/card.entity';
import { DeckCardItem, Player } from '@domain/entities/player.entity';
import { IPlayerRepository } from '@domain/repositories/player.repository.interface';
import { prisma } from '../database/prisma.client';

export class PrismaPlayerRepository implements IPlayerRepository {
  public async create(player: Player): Promise<Player> {
    const record = await prisma.player.create({
      data: {
        id: player.id,
        name: player.name,
        email: player.email,
        createdAt: player.createdAt,
        updatedAt: player.updatedAt,
      },
    });

    return new Player({
      id: record.id,
      name: record.name,
      email: record.email,
      deck: [],
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  public async findById(id: string): Promise<Player | null> {
    const record = await prisma.player.findUnique({
      where: { id },
      include: {
        deckCards: {
          include: { card: true },
        },
      },
    });

    return record ? this.toDomain(record) : null;
  }

  public async findByEmail(email: string): Promise<Player | null> {
    const record = await prisma.player.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: {
        deckCards: {
          include: { card: true },
        },
      },
    });

    return record ? this.toDomain(record) : null;
  }

  public async save(player: Player): Promise<Player> {
    // Transaction to update player and replace deck cards
    await prisma.$transaction(async (tx) => {
      await tx.player.update({
        where: { id: player.id },
        data: {
          name: player.name,
          email: player.email,
          updatedAt: new Date(),
        },
      });

      // Remove existing deck cards for this player
      await tx.deckCard.deleteMany({
        where: { playerId: player.id },
      });

      // Insert current deck cards
      for (const item of player.deck) {
        await tx.deckCard.create({
          data: {
            playerId: player.id,
            cardId: item.card.id,
            quantity: item.quantity,
          },
        });
      }
    });

    return player;
  }

  public async listAll(): Promise<Player[]> {
    const records = await prisma.player.findMany({
      include: {
        deckCards: {
          include: { card: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  private toDomain(record: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    deckCards: Array<{
      quantity: number;
      card: {
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
      };
    }>;
  }): Player {
    const deck: DeckCardItem[] = record.deckCards.map((dc) => {
      const colors = dc.card.colors ? dc.card.colors.split(',').filter(Boolean) : [];
      const rarity = (
        ['common', 'uncommon', 'rare', 'mythic'].includes(dc.card.rarity.toLowerCase())
          ? dc.card.rarity.toLowerCase()
          : 'common'
      ) as CardRarity;

      const card = new Card({
        id: dc.card.id,
        name: dc.card.name,
        manaCost: dc.card.manaCost,
        cmc: dc.card.cmc,
        typeLine: dc.card.typeLine,
        oracleText: dc.card.oracleText ?? undefined,
        colors,
        rarity,
        set: dc.card.set,
        power: dc.card.power ?? undefined,
        toughness: dc.card.toughness ?? undefined,
        imageUrl: dc.card.imageUrl ?? undefined,
        createdAt: dc.card.createdAt,
        updatedAt: dc.card.updatedAt,
      });

      return { card, quantity: dc.quantity };
    });

    return new Player({
      id: record.id,
      name: record.name,
      email: record.email,
      deck,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
