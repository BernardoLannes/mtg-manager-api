import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { makeCardController } from '../factories/card.factory';
import {
  createCardRouteSchema,
  deleteCardRouteSchema,
  getCardByIdRouteSchema,
  listCardsRouteSchema,
  updateCardRouteSchema,
} from '../schemas/card.schema';

export const cardRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  const controller = makeCardController();

  app.get('/cards', { schema: listCardsRouteSchema }, controller.list);
  app.get('/cards/:id', { schema: getCardByIdRouteSchema }, controller.getById);
  app.post('/cards', { schema: createCardRouteSchema }, controller.create);
  app.put('/cards/:id', { schema: updateCardRouteSchema }, controller.update);
  app.delete('/cards/:id', { schema: deleteCardRouteSchema }, controller.delete);
};
