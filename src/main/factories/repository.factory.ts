import { ICardRepository } from '@domain/repositories/card.repository.interface';
import { IPlayerRepository } from '@domain/repositories/player.repository.interface';
import { InMemoryCardRepository } from '@infrastructure/repositories/in-memory-card.repository';
import { InMemoryPlayerRepository } from '@infrastructure/repositories/in-memory-player.repository';
import { PrismaCardRepository } from '@infrastructure/repositories/prisma-card.repository';
import { PrismaPlayerRepository } from '@infrastructure/repositories/prisma-player.repository';

const usePrisma = process.env.USE_PRISMA === 'true';

const inMemoryCardRepo = new InMemoryCardRepository();
const inMemoryPlayerRepo = new InMemoryPlayerRepository();

const prismaCardRepo = new PrismaCardRepository();
const prismaPlayerRepo = new PrismaPlayerRepository();

export function getCardRepository(): ICardRepository {
  return usePrisma ? prismaCardRepo : inMemoryCardRepo;
}

export function getPlayerRepository(): IPlayerRepository {
  return usePrisma ? prismaPlayerRepo : inMemoryPlayerRepo;
}
