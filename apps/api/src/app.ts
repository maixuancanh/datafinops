import Fastify, { type FastifyInstance } from 'fastify';

export interface HealthConfiguration {
  readonly version: string;
  readonly mode: 'sandbox' | 'devnet' | 'live-read' | 'live-write';
  readonly adapter: string;
  readonly fixedClock?: string;
  readonly liveWrite: boolean;
}

export function buildApi(configuration: HealthConfiguration): FastifyInstance {
  const app = Fastify({ logger: false });
  app.get(
    '/api/health',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            additionalProperties: false,
            required: ['status', 'version', 'mode', 'adapter', 'liveWrite'],
            properties: {
              status: { const: 'ok' },
              version: { type: 'string' },
              mode: { enum: ['sandbox', 'devnet', 'live-read', 'live-write'] },
              adapter: { type: 'string' },
              fixedClock: { type: 'string' },
              liveWrite: { enum: ['disabled', 'enabled'] },
            },
          },
        },
      },
    },
    async () => ({
      status: 'ok' as const,
      version: configuration.version,
      mode: configuration.mode,
      adapter: configuration.adapter,
      ...(configuration.fixedClock ? { fixedClock: configuration.fixedClock } : {}),
      liveWrite: configuration.liveWrite ? ('enabled' as const) : ('disabled' as const),
    }),
  );
  return app;
}
