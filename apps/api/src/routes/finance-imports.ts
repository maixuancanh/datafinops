import type { FastifyInstance } from 'fastify';
export function registerFinanceImportRoutes(app: FastifyInstance): void {
  app.post('/v1/finance-imports', async (_request, reply) =>
    reply.code(202).send({ status: 'QUEUED', mode: 'SANDBOX', customerLevelData: 'REJECTED' }),
  );
}
