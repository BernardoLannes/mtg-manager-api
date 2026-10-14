import { FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateCardUseCase,
  DeleteCardUseCase,
  GetCardByIdUseCase,
  ListCardsUseCase,
  UpdateCardUseCase,
} from '@application/index';
import {
  cardParamsSchema,
  createCardBodySchema,
  listCardsQuerySchema,
  updateCardBodySchema,
} from '../schemas/zod/schemas';
import { validatePayload } from '../validators/zod.validator';

export class CardController {
  constructor(
    private readonly listCardsUseCase: ListCardsUseCase,
    private readonly getCardByIdUseCase: GetCardByIdUseCase,
    private readonly createCardUseCase: CreateCardUseCase,
    private readonly updateCardUseCase: UpdateCardUseCase,
    private readonly deleteCardUseCase: DeleteCardUseCase,
  ) {}

  public list = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const query = validatePayload(listCardsQuerySchema, request.query);
    const cards = await this.listCardsUseCase.execute(query);
    reply.status(200).send(cards);
  };

  public getById = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = validatePayload(cardParamsSchema, request.params);
    const card = await this.getCardByIdUseCase.execute(params.id);
    reply.status(200).send(card);
  };

  public create = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = validatePayload(createCardBodySchema, request.body);
    const created = await this.createCardUseCase.execute(body);
    reply.status(201).send(created);
  };

  public update = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = validatePayload(cardParamsSchema, request.params);
    const body = validatePayload(updateCardBodySchema, request.body);
    const updated = await this.updateCardUseCase.execute(params.id, body);
    reply.status(200).send(updated);
  };

  public delete = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = validatePayload(cardParamsSchema, request.params);
    await this.deleteCardUseCase.execute(params.id);
    reply.status(204).send();
  };
}
