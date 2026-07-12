import { redact, redactText } from './redaction.js';

type Attributes = Readonly<Record<string, unknown>>;
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const logAttributeAllowlist = new Set([
  'correlationId',
  'environmentRef',
  'mode',
  'operationId',
  'reasonCode',
  'tenantRef',
  'workspaceRef',
]);

function allowlisted(attributes: Attributes): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(attributes)
      .filter(([key]) => logAttributeAllowlist.has(key))
      .map(([key, value]) => [key, redact(value, key)]),
  );
}

export function createTelemetry(configuration: {
  readonly serviceName: string;
  readonly serviceVersion: string;
}) {
  const logs: Record<string, unknown>[] = [];
  const metrics: Record<string, unknown>[] = [];
  const spans: Record<string, unknown>[] = [];
  const errors: Record<string, unknown>[] = [];
  const common = Object.freeze({
    serviceName: configuration.serviceName,
    serviceVersion: configuration.serviceVersion,
  });
  return Object.freeze({
    log(level: LogLevel, event: string, attributes: Attributes = {}) {
      logs.push({ ...common, level, event, ...allowlisted(attributes) });
    },
    metric(name: string, value: number, attributes: Attributes = {}) {
      if (!Number.isFinite(value)) throw new TypeError('Metric value must be finite');
      metrics.push({ ...common, name, value, attributes: allowlisted(attributes) });
    },
    span(name: string, attributes: Attributes = {}) {
      spans.push({ ...common, name, attributes: allowlisted(attributes) });
    },
    captureError(error: Error, attributes: Attributes = {}) {
      errors.push({
        ...common,
        name: error.name,
        message: redactText(error.message),
        attributes: allowlisted(attributes),
      });
    },
    snapshot() {
      return structuredClone({ logs, metrics, spans, errors });
    },
  });
}
