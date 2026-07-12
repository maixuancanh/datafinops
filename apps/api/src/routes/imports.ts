import type { FastifyInstance } from 'fastify';
import { parseAggregateImport } from '@datafinops/domain';

export function registerImportRoutes(app: FastifyInstance): void {
  app.post('/v1/imports/aggregate', async (request, reply) => {
    const body = request.body as { tenantId?: string; periodEnd?: string; rows?: readonly Readonly<Record<string, unknown>>[] };
    if (!body.tenantId || !body.periodEnd || !Array.isArray(body.rows)) return reply.code(400).send({ error: 'tenantId, periodEnd and rows are required' });
    const result = parseAggregateImport({ tenantId: body.tenantId, periodEnd: body.periodEnd, rows: body.rows, now: new Date().toISOString() });
    return reply.code(202).send(result);
  });
}
