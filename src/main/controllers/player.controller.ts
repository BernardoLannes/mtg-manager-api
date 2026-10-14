import { FastifyReply, FastifyRequest } from 'fastify';
import {
  AddCardToDeckUseCase,
  CreatePlayerUseCase,
  GetPlayerDeckUseCase,
} from '@application/index';
import {
  addCardToDeckBodySchema,
  createPlayerBodySchema,
  playerParamsSchema,
} from '../schemas/zod/schemas';
import { validatePayload } from '../validators/zod.validator';

export class PlayerController {
  constructor(
    private readonly createPlayerUseCase: CreatePlayerUseCase,
    private readonly addCardToDeckUseCase: AddCardToDeckUseCase,
    private readonly getPlayerDeckUseCase: GetPlayerDeckUseCase,
  ) {}

  public create = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = validatePayload(createPlayerBodySchema, request.body);
    const player = await this.createPlayerUseCase.execute(body);
    reply.status(201).send(player);
  };

  public addCard = async (
    request: FastifyRequest<{ Params: { playerId: string } }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const params = validatePayload(playerParamsSchema, request.params);
    const body = validatePayload(addCardToDeckBodySchema, request.body);

    const deck = await this.addCardToDeckUseCase.execute({
      playerId: params.playerId,
      cardName: body.cardName,
      quantity: body.quantity,
    });

    reply.status(201).send(deck);
  };

  public getDeck = async (
    request: FastifyRequest<{ Params: { playerId: string } }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const params = validatePayload(playerParamsSchema, request.params);
    const deck = await this.getPlayerDeckUseCase.execute(params.playerId);
    reply.status(200).send(deck);
  };
}
