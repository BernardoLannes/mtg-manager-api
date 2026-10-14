import { FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateCardInputDto,
  CreateCardUseCase,
  DeleteCardUseCase,
  GetCardByIdUseCase,
  ListCardsUseCase,
  UpdateCardInputDto,
  UpdateCardUseCase,
} from '@application/index';
import { CardFilterInputDto } from '@application/dtos/card.dto';

export class CardController {
  constructor(
    private readonly listCardsUseCase: ListCardsUseCase,
    private readonly getCardByIdUseCase: GetCardByIdUseCase,
    private readonly createCardUseCase: CreateCardUseCase,
    private readonly updateCardUseCase: UpdateCardUseCase,
    private readonly deleteCardUseCase: DeleteCardUseCase,
  ) {}

  public list = async (
    request: FastifyRequest<{ Querystring: CardFilterInputDto }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const cards = await this.listCardsUseCase.execute(request.query);
    reply.status(200).send(cards);
  };

  public getById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = request.params;
    const card = await this.getCardByIdUseCase.execute(id);
    reply.status(200).send(card);
  };

  public create = async (
    request: FastifyRequest<{ Body: CreateCardInputDto }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const created = await this.createCardUseCase.execute(request.body);
    reply.status(201).send(created);
  };

  public update = async (
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateCardInputDto }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = request.params;
    const updated = await this.updateCardUseCase.execute(id, request.body);
    reply.status(200).send(updated);
  };

  public delete = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const { id } = request.params;
    await this.deleteCardUseCase.execute(id);
    reply.status(204).send();
  };
}
