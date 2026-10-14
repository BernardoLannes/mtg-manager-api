import { ZodSchema } from 'zod';

export function validatePayload<T>(schema: ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}
