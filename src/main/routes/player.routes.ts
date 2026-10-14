import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { makePlayerController } from '../factories/player.factory';
import {
  addCardToDeckRouteSchema,
  createPlayerRouteSchema,
  getPlayerDeckRouteSchema,
} from '../schemas/openapi.schemas';

export const playerRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  const controller = makePlayerController();

  app.post('/players', { schema: createPlayerRouteSchema }, controller.create);
  app.post(
    '/players/:playerId/deck/cards',
    { schema: addCardToDeckRouteSchema },
    controller.addCard,
  );
  app.get('/players/:playerId/deck', { schema: getPlayerDeckRouteSchema }, controller.getDeck);
};
