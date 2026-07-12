import { Queue, type ConnectionOptions } from 'bullmq';

export interface QueueDefinition {
  readonly queueName: string;
  readonly attempts: number;
  readonly backoff: Readonly<{ type: 'exponential'; delay: number }>;
  readonly removeOnComplete: false;
}

function definition(queueName: string, attempts: number): QueueDefinition {
  return Object.freeze({
    queueName,
    attempts,
    backoff: Object.freeze({ type: 'exponential' as const, delay: 1_000 }),
    removeOnComplete: false as const,
  });
}

export const queueDefinitions = Object.freeze({
  activation: definition('activation', 4),
  close: definition('close', 3),
  export: definition('export', 3),
  ingestion: definition('ingestion', 5),
  metering: definition('metering', 3),
  notification: definition('notification', 8),
  observation: definition('observation', 8),
  optimization: definition('optimization', 2),
  renewal: definition('renewal', 4),
  snapshot: definition('snapshot', 3),
  verification: definition('verification', 5),
});

export type QueueKind = keyof typeof queueDefinitions;

export function createQueueRegistry(input: {
  readonly connection: ConnectionOptions;
  readonly environmentId: string;
}) {
  if (!input.environmentId.trim())
    throw new TypeError('environmentId is required for queue isolation');
  return Object.fromEntries(
    Object.entries(queueDefinitions).map(([kind, config]) => [
      kind,
      new Queue(`datafinops:${input.environmentId}:${config.queueName}`, {
        connection: input.connection,
        defaultJobOptions: {
          attempts: config.attempts,
          backoff: config.backoff,
          removeOnComplete: config.removeOnComplete,
          removeOnFail: false,
        },
      }),
    ]),
  ) as Record<QueueKind, Queue>;
}

export class FairTenantScheduler<T> {
  readonly #burst: number;
  readonly #queues = new Map<string, T[]>();
  readonly #order: string[] = [];
  #currentBurst = 0;

  constructor(input: { readonly perTenantBurst: number }) {
    if (
      !Number.isSafeInteger(input.perTenantBurst) ||
      input.perTenantBurst < 1 ||
      input.perTenantBurst > 100
    ) {
      throw new RangeError('tenant burst must be an integer from 1 through 100');
    }
    this.#burst = input.perTenantBurst;
  }

  enqueue(tenantId: string, job: T): void {
    if (!tenantId.trim()) throw new TypeError('tenantId is required');
    const queue = this.#queues.get(tenantId);
    if (queue) queue.push(job);
    else {
      this.#queues.set(tenantId, [job]);
      this.#order.push(tenantId);
    }
  }

  next(): Readonly<{ tenantId: string; job: T }> | undefined {
    const tenantId = this.#order[0];
    if (!tenantId) return undefined;
    const queue = this.#queues.get(tenantId);
    if (!queue) throw new Error('Fair scheduler tenant invariant failed');
    const job = queue.shift();
    if (job === undefined) throw new Error('Fair scheduler queue invariant failed');
    this.#currentBurst += 1;
    if (queue.length === 0) {
      this.#queues.delete(tenantId);
      this.#order.shift();
      this.#currentBurst = 0;
    } else if (this.#currentBurst >= this.#burst && this.#order.length > 1) {
      this.#order.push(this.#order.shift() as string);
      this.#currentBurst = 0;
    }
    return Object.freeze({ tenantId, job });
  }
}
