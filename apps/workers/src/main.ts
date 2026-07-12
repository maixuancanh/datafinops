import { loadConfiguration } from '@datafinops/config';

const configuration = loadConfiguration(process.env);
const status = {
  service: 'datafinops-workers',
  version: process.env.DATAFINOPS_VERSION ?? '0.1.0-dev',
  mode: configuration.mode.mode,
  adapter: process.env.TXLINE_ADAPTER_MODE ?? 'replay',
  liveWrite: configuration.mode.liveWrite ? 'enabled' : 'disabled',
};

process.stdout.write(`${JSON.stringify(status)}\n`);
