import { parseModeConfiguration, type ModeEnvironment } from './modes.js';

export type DataFinOpsConfiguration = Readonly<{
  nodeEnvironment: 'development' | 'test' | 'production';
  serviceName: string;
  mode: ReturnType<typeof parseModeConfiguration>;
}>;

export function loadConfiguration(environment: ModeEnvironment): DataFinOpsConfiguration {
  const nodeEnvironment = environment.NODE_ENV ?? 'development';
  if (!['development', 'test', 'production'].includes(nodeEnvironment)) {
    throw new Error('NODE_ENV must be development, test, or production');
  }
  const serviceName = environment.DATAFINOPS_SERVICE_NAME?.trim();
  if (!serviceName) throw new Error('DATAFINOPS_SERVICE_NAME is required');
  return Object.freeze({
    nodeEnvironment: nodeEnvironment as DataFinOpsConfiguration['nodeEnvironment'],
    serviceName,
    mode: parseModeConfiguration(environment),
  });
}

export * from './modes.js';
