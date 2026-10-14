import fastify, { FastifyError, FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { ZodError } from 'zod';
import { AppError } from '@domain/errors/domain.error';
import { cardRoutes } from '../routes/card.routes';
import { playerRoutes } from '../routes/player.routes';
import { scryfallRoutes } from '../routes/scryfall.routes';

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
    ajv: {
      customOptions: {
        strict: false,
      },
    },
  });

  // CORS
  app.register(cors, {
    origin: '*',
  });

  // Swagger (OpenAPI 3.0)
  app.register(swagger, {
    openapi: {
      info: {
        title: 'MTG Manager API',
        description:
          'Magic: The Gathering Deck & Card Management API built with Clean Architecture, Node.js, Fastify, Prisma ORM, and Scryfall API integration.',
        version: '2.0.0',
        contact: {
          name: 'Bernardo Lannes',
          email: 'bernardolannes2003@gmail.com',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local development server',
        },
      ],
      tags: [
        { name: 'Cards', description: 'Magic: The Gathering card catalog operations' },
        {
          name: 'Players',
          description: 'Planeswalker registration, deck management, and deck-building rules',
        },
        {
          name: 'Scryfall Gateway',
          description: 'Real-time external card data search and consumption',
        },
        { name: 'Health', description: 'API health checks' },
      ],
    },
  });

  // Swagger UI at /api/docs
  app.register(swaggerUi, {
    routePrefix: '/api/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  // Global Error Handler (AppError, Domain exceptions, Zod errors, and Prisma)
  app.setErrorHandler((error: FastifyError | Error, _request, reply) => {
    // 1. Domain and Application AppErrors
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
      });
    }

    // 2. Zod Payload Validation Errors
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Validation Error',
        message: 'Request payload validation failed.',
        issues: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    // 3. Fastify Schema Validation Errors
    if ('validation' in error && error.validation) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Validation Error',
        message: error.message,
      });
    }

    // 4. Prisma Unique Constraint Violation (P2002)
    if ('code' in error && error.code === 'P2002') {
      return reply.status(409).send({
        statusCode: 409,
        error: 'Conflict Error',
        message: 'A record with this unique field already exists.',
      });
    }

    // 5. Prisma Record Not Found (P2025)
    if ('code' in error && error.code === 'P2025') {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'The requested database record was not found.',
      });
    }

    // 6. Unexpected internal error
    app.log.error(error);
    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An unexpected internal server error occurred.',
    });
  });

  // Health check
  app.get(
    '/api/v1/health',
    {
      schema: {
        summary: 'Health check',
        tags: ['Health'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'ok' },
              uptime: { type: 'number' },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async () => {
      return {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      };
    },
  );

  // Register Routes under /api/v1
  app.register(cardRoutes, { prefix: '/api/v1' });
  app.register(playerRoutes, { prefix: '/api/v1' });
  app.register(scryfallRoutes, { prefix: '/api/v1' });

  return app;
}
