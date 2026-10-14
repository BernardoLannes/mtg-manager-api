export const scryfallCardResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string', example: 'Black Lotus' },
    manaCost: { type: 'string', example: '{0}' },
    cmc: { type: 'number', example: 0 },
    typeLine: { type: 'string', example: 'Artifact' },
    oracleText: { type: 'string' },
    colors: { type: 'array', items: { type: 'string' } },
    rarity: { type: 'string', example: 'rare' },
    set: { type: 'string', example: 'LEA' },
    power: { type: 'string' },
    toughness: { type: 'string' },
    imageUrl: { type: 'string', format: 'uri' },
    scryfallUri: { type: 'string', format: 'uri' },
  },
  required: ['id', 'name', 'manaCost', 'cmc', 'typeLine', 'colors', 'rarity', 'set'],
};

export const playerResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string', example: 'Jace Beleren' },
    email: { type: 'string', format: 'email', example: 'jace@ravnica.org' },
    totalCards: { type: 'number', example: 0 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'name', 'email', 'totalCards', 'createdAt', 'updatedAt'],
};

export const playerDeckResponseSchema = {
  type: 'object',
  properties: {
    playerId: { type: 'string', format: 'uuid' },
    playerName: { type: 'string', example: 'Jace Beleren' },
    playerEmail: { type: 'string', example: 'jace@ravnica.org' },
    totalCards: { type: 'number', example: 4 },
    deck: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          card: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              manaCost: { type: 'string' },
              cmc: { type: 'number' },
              typeLine: { type: 'string' },
              colors: { type: 'array', items: { type: 'string' } },
              rarity: { type: 'string' },
              set: { type: 'string' },
              imageUrl: { type: 'string' },
            },
          },
          quantity: { type: 'number', example: 4 },
        },
      },
    },
  },
};

export const searchScryfallRouteSchema = {
  summary: 'Search card directly on official Scryfall API',
  description:
    'Queries the official public Scryfall API in real time and returns formatted card DTO.',
  tags: ['Scryfall Gateway'],
  querystring: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', description: 'Name of the card to search' },
    },
  },
  response: {
    200: scryfallCardResponseSchema,
  },
};

export const createPlayerRouteSchema = {
  summary: 'Register new Player / Planeswalker in database',
  description: 'Creates a new player record in the relational database.',
  tags: ['Players'],
  body: {
    type: 'object',
    required: ['name', 'email'],
    properties: {
      name: { type: 'string', example: 'Chandra Nalaar' },
      email: { type: 'string', format: 'email', example: 'chandra@kaladesh.org' },
    },
  },
  response: {
    201: playerResponseSchema,
  },
};

export const addCardToDeckRouteSchema = {
  summary: 'Add card to player deck',
  description:
    'Fetches card from Scryfall API, validates deck rules (max 60 cards, max 4 copies of non-basic land), and persists card to player deck.',
  tags: ['Players'],
  params: {
    type: 'object',
    required: ['playerId'],
    properties: {
      playerId: { type: 'string', format: 'uuid', description: 'Player UUID' },
    },
  },
  body: {
    type: 'object',
    required: ['cardName'],
    properties: {
      cardName: { type: 'string', example: 'Lightning Bolt' },
      quantity: { type: 'number', minimum: 1, default: 1, example: 4 },
    },
  },
  response: {
    201: playerDeckResponseSchema,
  },
};

export const getPlayerDeckRouteSchema = {
  summary: "Get player's active deck",
  description: "Lists all cards and quantities currently in the player's active deck.",
  tags: ['Players'],
  params: {
    type: 'object',
    required: ['playerId'],
    properties: {
      playerId: { type: 'string', format: 'uuid', description: 'Player UUID' },
    },
  },
  response: {
    200: playerDeckResponseSchema,
  },
};
