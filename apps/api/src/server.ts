import Fastify from 'fastify';
import { createMemoryConnectionStore, registerConnectionRoutes } from './routes/connections.js';
import { registerImportRoutes } from './routes/imports.js';
import { registerRequirementRoutes } from './routes/requirements.js';
import { registerProposalRoutes } from './routes/proposals.js';
import { registerApprovalRoutes } from './routes/approvals.js';
import { registerFinanceImportRoutes } from './routes/finance-imports.js';

export function buildServer() {
  const app = Fastify({ logger: false });
  const store = createMemoryConnectionStore();
  app.get('/health', async () => ({ status: 'ok' }));
  registerConnectionRoutes(app, store);
  registerImportRoutes(app);
  registerRequirementRoutes(app);
  registerProposalRoutes(app);
  registerApprovalRoutes(app);
  registerFinanceImportRoutes(app);
  return { app, store };
}

if (process.argv[1]?.endsWith('server.ts')) {
  const { app } = buildServer();
  await app.listen({ port: Number(process.env.PORT ?? 4010), host: process.env.HOST ?? '127.0.0.1' });
}
