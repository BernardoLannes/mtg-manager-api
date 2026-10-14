import { FastifyReply, FastifyRequest } from 'fastify';
import { SearchScryfallUseCase } from '@application/index';
import { searchScryfallQuerySchema } from '../schemas/zod/schemas';
import { validatePayload } from '../validators/zod.validator';

export class ScryfallController {
  constructor(private readonly searchScryfallUseCase: SearchScryfallUseCase) {}

  public search = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const query = validatePayload(searchScryfallQuerySchema, request.query);
    const cardData = await this.searchScryfallUseCase.execute(query.name);
    reply.status(200).send(cardData);
  };
}
