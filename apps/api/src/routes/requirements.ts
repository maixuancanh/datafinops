import type { FastifyInstance } from 'fastify';
import { createRequirementVersion } from '@datafinops/domain';

export function registerRequirementRoutes(app: FastifyInstance): void {
  app.post('/v1/requirements', async (request, reply) => {
    try {
      const body = (request.body ?? {}) as Record<string, unknown>;
      const requirement = createRequirementVersion({
        ...body,
        id: `req_${Date.now()}`,
        version: 1,
      } as never);
      return reply.code(201).send({ requirement });
    } catch (error) {
      return reply
        .code(400)
        .send({ error: error instanceof Error ? error.message : 'invalid requirement' });
    }
  });
}
