export const deploymentModes = ['sandbox', 'devnet', 'live-read', 'live-write'] as const;
export type DeploymentMode = (typeof deploymentModes)[number];

export type ModeEnvironment = Readonly<Record<string, string | undefined>>;

export type ModeConfiguration = Readonly<{
  mode: DeploymentMode;
  fixedClock?: string;
  liveWrite: boolean;
  liveWriteEvidence?: string;
  networkAllowlist: readonly string[];
  programAllowlist: readonly string[];
  tenantAllowlist: readonly string[];
}>;

function requireMode(value: string | undefined): DeploymentMode {
  if (deploymentModes.includes(value as DeploymentMode)) return value as DeploymentMode;
  throw new Error(`DATAFINOPS_MODE must be one of: ${deploymentModes.join(', ')}`);
}

function parseBoolean(value: string | undefined, name: string): boolean {
  if (value === undefined || value === 'false') return false;
  if (value === 'true') return true;
  throw new Error(`${name} must be true or false`);
}

function parseList(value: string | undefined): readonly string[] {
  if (!value) return [];
  return Object.freeze(
    [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))].sort(),
  );
}

function validateFixedClock(mode: DeploymentMode, value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (mode !== 'sandbox') throw new Error('A fixed clock is permitted only in sandbox mode');
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString() !== value) {
    throw new Error('DATAFINOPS_FIXED_CLOCK must be a canonical ISO-8601 instant');
  }
  return value;
}

export function parseModeConfiguration(environment: ModeEnvironment): ModeConfiguration {
  const mode = requireMode(environment.DATAFINOPS_MODE);
  const liveWrite = parseBoolean(environment.DATAFINOPS_LIVE_WRITE, 'DATAFINOPS_LIVE_WRITE');
  const networkAllowlist = parseList(environment.DATAFINOPS_NETWORK_ALLOWLIST);
  const programAllowlist = parseList(environment.DATAFINOPS_PROGRAM_ALLOWLIST);
  const tenantAllowlist = parseList(environment.DATAFINOPS_TENANT_ALLOWLIST);
  const liveWriteEvidence = environment.DATAFINOPS_LIVE_WRITE_EVIDENCE?.trim() || undefined;
  const fixedClock = validateFixedClock(mode, environment.DATAFINOPS_FIXED_CLOCK);

  if (mode !== 'live-write' && liveWrite) {
    throw new Error(`live-write cannot be enabled while mode is ${mode}`);
  }
  if (mode === 'live-write') {
    if (!liveWriteEvidence) throw new Error('live-write requires tenant enablement evidence');
    if (!liveWrite) throw new Error('live-write mode requires explicit DATAFINOPS_LIVE_WRITE=true');
    if (networkAllowlist.length === 0 || programAllowlist.length === 0 || tenantAllowlist.length === 0) {
      throw new Error('live-write requires network, program, and tenant allowlists');
    }
  }

  return Object.freeze({
    mode,
    ...(fixedClock === undefined ? {} : { fixedClock }),
    liveWrite,
    ...(liveWriteEvidence === undefined ? {} : { liveWriteEvidence }),
    networkAllowlist,
    programAllowlist,
    tenantAllowlist,
  });
}
