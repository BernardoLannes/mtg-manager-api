import { PrismaClient } from '@prisma/client';

class PrismaService {
  private static instance: PrismaClient | null = null;

  public static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    return PrismaService.instance;
  }
}

export const prisma = PrismaService.getInstance();
