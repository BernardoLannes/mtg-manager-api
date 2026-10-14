import fastify, { FastifyError, FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { DomainError } from '@domain/errors/domain.error';
import { cardRoutes } from '../routes/card.routes';

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
          'Magic: The Gathering Deck & Card Management API built with Clean Architecture, Node.js, and TypeScript.',
        version: '1.0.0',
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
        { name: 'Cards', description: 'Magic: The Gathering local card catalog operations' },
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

  // Global Error Handler
  app.setErrorHandler((error: FastifyError, _request, reply) => {
    if (error instanceof DomainError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
      });
    }

    if (error.validation) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Validation Error',
        message: error.message,
      });
    }

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

  // Register Card Routes under /api/v1
  app.register(cardRoutes, { prefix: '/api/v1' });

  return app;
}
