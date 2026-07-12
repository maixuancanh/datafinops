import type { FastifyInstance } from 'fastify';

export interface ConnectionStore {
  create(input: {
    readonly tenantId: string;
    readonly environmentId: string;
    readonly secretRef: string;
    readonly expectedNetwork: string;
    readonly expectedProgramId: string;
    readonly expectedApiHost: string;
    readonly publicWalletRef: string;
  }): { readonly id: string; readonly tenantId: string; readonly environmentId: string; readonly expectedNetwork: string; readonly expectedProgramId: string; readonly expectedApiHost: string; readonly publicWalletRef: string };
}

export function registerConnectionRoutes(app: FastifyInstance, store: ConnectionStore): void {
  app.post('/v1/connections', async (request, reply) => {
    const body = request.body as Partial<{
      tenantId: string; environmentId: string; readCredentialSecretRef: string;
      expectedNetwork: string; expectedProgramId: string; expectedApiHost: string; publicWalletRef: string;
    }>;
    const required = ['tenantId', 'environmentId', 'readCredentialSecretRef', 'expectedNetwork', 'expectedProgramId', 'expectedApiHost', 'publicWalletRef'] as const;
    if (required.some((key) => !body[key]?.trim())) return reply.code(400).send({ error: 'connection fields are required' });
    const connection = store.create({
      tenantId: body.tenantId!, environmentId: body.environmentId!, secretRef: body.readCredentialSecretRef!,
      expectedNetwork: body.expectedNetwork!, expectedProgramId: body.expectedProgramId!, expectedApiHost: body.expectedApiHost!, publicWalletRef: body.publicWalletRef!,
    });
    return reply.code(201).send({ connection, verification: { status: 'PENDING', executable: false } });
  });
}

export function createMemoryConnectionStore(): ConnectionStore & { readonly records: Map<string, Record<string, string>> } {
  const records = new Map<string, Record<string, string>>();
  return {
    records,
    create(input) {
      const id = `conn_${records.size + 1}`;
      records.set(id, { id, ...input });
      const publicRecord: Record<string, string> = { id, ...input };
      delete publicRecord.secretRef;
      return publicRecord as { readonly id: string; readonly tenantId: string; readonly environmentId: string; readonly expectedNetwork: string; readonly expectedProgramId: string; readonly expectedApiHost: string; readonly publicWalletRef: string };
    },
  };
}
