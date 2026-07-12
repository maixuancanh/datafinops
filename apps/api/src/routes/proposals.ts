import type { FastifyInstance } from 'fastify';
import { createProposal } from '@datafinops/domain';
export function registerProposalRoutes(app: FastifyInstance): void {
  app.post('/v1/proposals', async (request, reply) => {
    try {
      const body = (request.body ?? {}) as Record<string, unknown>;
      return reply.code(201).send({
        proposal: createProposal({ ...body, id: `proposal_${Date.now()}`, version: 1 } as never),
      });
    } catch (error) {
      return reply
        .code(400)
        .send({ error: error instanceof Error ? error.message : 'invalid proposal' });
    }
  });
}
