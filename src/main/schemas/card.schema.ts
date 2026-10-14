export const cardResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', example: '11111111-1111-1111-1111-111111111111' },
    name: { type: 'string', example: 'Black Lotus' },
    manaCost: { type: 'string', example: '{0}' },
    cmc: { type: 'number', example: 0 },
    typeLine: { type: 'string', example: 'Artifact' },
    oracleText: {
      type: 'string',
      example: '{T}, Sacrifice Black Lotus: Add three mana of any one color.',
    },
    colors: {
      type: 'array',
      items: { type: 'string' },
      example: [],
    },
    rarity: {
      type: 'string',
      enum: ['common', 'uncommon', 'rare', 'mythic'],
      example: 'rare',
    },
    set: { type: 'string', example: 'LEA' },
    power: { type: 'string', example: '0' },
    toughness: { type: 'string', example: '1' },
    imageUrl: {
      type: 'string',
      format: 'uri',
      example:
        'https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg',
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'name', 'manaCost', 'cmc', 'typeLine', 'colors', 'rarity', 'set'],
};

export const errorResponseSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number', example: 404 },
    error: { type: 'string', example: 'Not Found' },
    message: { type: 'string', example: 'Card with ID not found' },
  },
};

export const listCardsRouteSchema = {
  summary: 'List all cards',
  description:
    'Retrieves a list of cards from the local in-memory catalog with optional filtering.',
  tags: ['Cards'],
  querystring: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Filter by card name (partial match)' },
      type: {
        type: 'string',
        description: 'Filter by typeLine (e.g., Creature, Instant, Artifact)',
      },
      color: { type: 'string', description: 'Filter by color (W, U, B, R, G)' },
      rarity: {
        type: 'string',
        enum: ['common', 'uncommon', 'rare', 'mythic'],
        description: 'Filter by rarity',
      },
      set: { type: 'string', description: 'Filter by expansion set code (e.g. LEA, M21)' },
    },
  },
  response: {
    200: {
      type: 'array',
      items: cardResponseSchema,
      description: 'List of matching cards',
    },
  },
};

export const getCardByIdRouteSchema = {
  summary: 'Get card by ID',
  description: 'Retrieves a single card by its unique identifier from the local catalog.',
  tags: ['Cards'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', description: 'Card ID (UUID)' },
    },
  },
  response: {
    200: cardResponseSchema,
    404: errorResponseSchema,
  },
};

export const createCardRouteSchema = {
  summary: 'Create a new card',
  description: 'Manually registers a new Magic: The Gathering card in the local catalog.',
  tags: ['Cards'],
  body: {
    type: 'object',
    required: ['name', 'manaCost', 'cmc', 'typeLine', 'colors', 'rarity', 'set'],
    properties: {
      name: { type: 'string', example: 'Mox Sapphire' },
      manaCost: { type: 'string', example: '{0}' },
      cmc: { type: 'number', minimum: 0, example: 0 },
      typeLine: { type: 'string', example: 'Artifact' },
      oracleText: { type: 'string', example: '{T}: Add {U}.' },
      colors: {
        type: 'array',
        items: { type: 'string' },
        example: [],
      },
      rarity: {
        type: 'string',
        enum: ['common', 'uncommon', 'rare', 'mythic'],
        example: 'rare',
      },
      set: { type: 'string', example: 'LEA' },
      power: { type: 'string', example: '0' },
      toughness: { type: 'string', example: '0' },
      imageUrl: {
        type: 'string',
        example:
          'https://cards.scryfall.io/normal/front/e/a/ea494052-e34a-4352-8778-878980b56f1e.jpg',
      },
    },
  },
  response: {
    201: cardResponseSchema,
    400: errorResponseSchema,
    409: errorResponseSchema,
  },
};

export const updateCardRouteSchema = {
  summary: 'Update an existing card',
  description: 'Updates data of an existing card by ID in the local catalog.',
  tags: ['Cards'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', description: 'Card ID (UUID)' },
    },
  },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Updated Card Name' },
      manaCost: { type: 'string', example: '{1}{U}' },
      cmc: { type: 'number', minimum: 0, example: 2 },
      typeLine: { type: 'string', example: 'Instant' },
      oracleText: { type: 'string', example: 'New rules text' },
      colors: {
        type: 'array',
        items: { type: 'string' },
        example: ['U'],
      },
      rarity: {
        type: 'string',
        enum: ['common', 'uncommon', 'rare', 'mythic'],
      },
      set: { type: 'string', example: 'M21' },
      power: { type: 'string' },
      toughness: { type: 'string' },
      imageUrl: { type: 'string' },
    },
  },
  response: {
    200: cardResponseSchema,
    400: errorResponseSchema,
    404: errorResponseSchema,
  },
};

export const deleteCardRouteSchema = {
  summary: 'Delete a card',
  description: 'Removes a card from the local catalog by ID.',
  tags: ['Cards'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', description: 'Card ID (UUID)' },
    },
  },
  response: {
    204: {
      type: 'null',
      description: 'Card deleted successfully (no content)',
    },
    404: errorResponseSchema,
  },
};
