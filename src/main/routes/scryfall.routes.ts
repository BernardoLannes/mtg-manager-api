import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { makeScryfallController } from '../factories/scryfall.factory';
import { searchScryfallRouteSchema } from '../schemas/openapi.schemas';

export const scryfallRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  const controller = makeScryfallController();

  app.get('/scryfall/search', { schema: searchScryfallRouteSchema }, controller.search);
};
