import { z } from 'zod';

export const searchScryfallQuerySchema = z.object({
  name: z.string({ message: 'Query parameter "name" is required.' }).trim().min(1, {
    message: 'Query parameter "name" cannot be empty.',
  }),
});

export const createPlayerBodySchema = z.object({
  name: z
    .string({ message: 'Player name is required.' })
    .trim()
    .min(2, 'Player name must be at least 2 characters long.'),
  email: z
    .string({ message: 'Player email is required.' })
    .trim()
    .email('Invalid email address format.'),
});

export const playerParamsSchema = z.object({
  playerId: z.string({ message: 'Player ID is required.' }).uuid('Invalid Player UUID format.'),
});

export const addCardToDeckBodySchema = z.object({
  cardName: z
    .string({ message: 'cardName is required.' })
    .trim()
    .min(1, 'cardName cannot be empty.'),
  quantity: z.number().int().positive('Quantity must be at least 1.').optional().default(1),
});

export const cardParamsSchema = z.object({
  id: z.string({ message: 'Card ID is required.' }).uuid('Invalid Card UUID format.'),
});

export const listCardsQuerySchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  color: z.string().optional(),
  rarity: z.enum(['common', 'uncommon', 'rare', 'mythic']).optional(),
  set: z.string().optional(),
});

export const createCardBodySchema = z.object({
  name: z.string().trim().min(1, 'Card name is required.'),
  manaCost: z.string().trim(),
  cmc: z.number().nonnegative('cmc cannot be negative.'),
  typeLine: z.string().trim().min(1, 'typeLine is required.'),
  oracleText: z.string().optional(),
  colors: z.array(z.string()),
  rarity: z.enum(['common', 'uncommon', 'rare', 'mythic']),
  set: z.string().trim().min(1, 'set code is required.'),
  power: z.string().optional(),
  toughness: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL.').optional(),
});

export const updateCardBodySchema = createCardBodySchema.partial();
