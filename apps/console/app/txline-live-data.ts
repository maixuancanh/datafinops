import { createHash } from 'node:crypto';

import { demoModules, demoWorkflowSteps, heroMetrics } from './commercial-demo-data';
import {
  portfolioModule,
  proposalModule,
  renewalsModule,
  savingsModule,
  scenariosModule,
  usageModule,
  type TxlineModule,
} from './(workspace)/txline-worldcup-modules';
import type { WorkflowStep } from './demo/demo-workflow';

type TxlineFixture = {
  FixtureId?: number;
  fixtureId?: number;
  Participant1?: string;
  participant1?: string;
  Participant2?: string;
  participant2?: string;
  Participant1IsHome?: boolean;
  participant1IsHome?: boolean;
  StartTime?: string;
  startTime?: string;
  GameState?: number;
  gameState?: number;
  Fixture?: string;
  fixture?: string;
  Competition?: string;
  competition?: string;
  Country?: string;
  country?: string;
  Sport?: string;
  sport?: string;
};

export type TxlineLiveSnapshot = {
  source: 'live' | 'fallback';
  network: 'mainnet' | 'devnet';
  apiOrigin: string;
  fetchedAt: string;
  reason?: string;
  fixtureCount: number;
  fixtureId?: number;
  fixtureLabel: string;
  fixtureStart?: string;
  fixtureState?: string;
  oddsCount: number;
  scoresCount: number;
  coverageHash: string;
};

export type TxlineDataMode = {
  label: string;
  detail: string;
  pillClassName: 'pill' | 'pill warn';
};

const DEFAULT_ORIGIN = 'https://txline.txodds.com';
const TXLINE_FETCH_TIMEOUT_MS = 10_000;
const WORLD_CUP_HINTS = ['world cup', 'international'];

function normalizeOrigin(value: string | undefined): string {
  const origin = value?.replace(/\/api\/?$/, '').replace(/\/$/, '');
  return origin || DEFAULT_ORIGIN;
}

function readToken(): string | undefined {
  return process.env.TXLINE_API_TOKEN || process.env.DATAFINOPS_TXLINE_API_TOKEN;
}

async function getGuestJwt(apiOrigin: string): Promise<string> {
  if (process.env.TXLINE_GUEST_JWT) {
    return process.env.TXLINE_GUEST_JWT;
  }

  const response = await fetch(`${apiOrigin}/auth/guest/start`, {
    method: 'POST',
    cache: 'no-store',
    signal: AbortSignal.timeout(TXLINE_FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`guest auth failed with HTTP ${response.status}`);
  }

  const body = (await response.json()) as { token?: string } | string;
  if (typeof body === 'string') {
    return body;
  }
  if (!body.token) {
    throw new Error('guest auth response did not include token');
  }

  return body.token;
}

async function txlineGet<T>(
  apiOrigin: string,
  jwt: string,
  apiToken: string,
  path: string,
): Promise<T> {
  const response = await fetch(`${apiOrigin}${path}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(TXLINE_FETCH_TIMEOUT_MS),
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${jwt}`,
      'X-Api-Token': apiToken,
    },
  });

  if (!response.ok) {
    throw new Error(`${path} failed with HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

function fixtureId(fixture: TxlineFixture): number | undefined {
  return fixture.FixtureId ?? fixture.fixtureId;
}

function fixtureText(fixture: TxlineFixture): string {
  return [
    fixture.Fixture,
    fixture.fixture,
    fixture.Competition,
    fixture.competition,
    fixture.Country,
    fixture.country,
    fixture.Sport,
    fixture.sport,
    fixture.Participant1,
    fixture.participant1,
    fixture.Participant2,
    fixture.participant2,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function isWorldCupFixture(fixture: TxlineFixture): boolean {
  const text = fixtureText(fixture);
  return WORLD_CUP_HINTS.some((hint) => text.includes(hint));
}

function teamNames(fixture: TxlineFixture): { home: string; away: string } {
  const participant1 = fixture.Participant1 ?? fixture.participant1 ?? 'Participant 1';
  const participant2 = fixture.Participant2 ?? fixture.participant2 ?? 'Participant 2';
  const participant1IsHome = fixture.Participant1IsHome ?? fixture.participant1IsHome ?? true;
  return participant1IsHome
    ? { home: participant1, away: participant2 }
    : { home: participant2, away: participant1 };
}

function summarizeFixture(fixture: TxlineFixture | undefined): string {
  if (!fixture) {
    return 'World Cup fixture unavailable';
  }

  const { home, away } = teamNames(fixture);
  return `${home} vs ${away}`;
}

function shortHash(payload: unknown): string {
  return `0x${createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 10)}`;
}

function fallbackSnapshot(reason: string): TxlineLiveSnapshot {
  return {
    source: 'fallback',
    network: 'mainnet',
    apiOrigin: DEFAULT_ORIGIN,
    fetchedAt: new Date().toISOString(),
    reason,
    fixtureCount: 104,
    fixtureId: 18237038,
    fixtureLabel: 'France vs Spain',
    fixtureStart: '2026-07-14T19:00:00.000Z',
    fixtureState: 'scheduled',
    oddsCount: 0,
    scoresCount: 0,
    coverageHash: '0x8c41f9b2',
  };
}

export async function getTxlineLiveSnapshot(): Promise<TxlineLiveSnapshot> {
  const apiOrigin = normalizeOrigin(
    process.env.TXLINE_API_ORIGIN || process.env.TXLINE_API_BASE_URL,
  );
  const network = apiOrigin.includes('txline-dev') ? 'devnet' : 'mainnet';
  const apiToken = readToken();

  if (!apiToken) {
    return fallbackSnapshot('TXLINE_API_TOKEN is not configured');
  }

  try {
    const jwt = await getGuestJwt(apiOrigin);
    const fixtures = await txlineGet<TxlineFixture[]>(
      apiOrigin,
      jwt,
      apiToken,
      '/api/fixtures/snapshot',
    );
    const worldCupFixtures = fixtures.filter(isWorldCupFixture);
    const selectedFixture = worldCupFixtures[0] ?? fixtures[0];
    const selectedFixtureId = selectedFixture ? fixtureId(selectedFixture) : undefined;
    const [odds, scores] = selectedFixtureId
      ? await Promise.all([
          txlineGet<unknown[]>(
            apiOrigin,
            jwt,
            apiToken,
            `/api/odds/snapshot/${selectedFixtureId}`,
          ).catch(() => []),
          txlineGet<unknown[]>(
            apiOrigin,
            jwt,
            apiToken,
            `/api/scores/snapshot/${selectedFixtureId}`,
          ).catch(() => []),
        ])
      : [[], []];

    const liveSnapshot: TxlineLiveSnapshot = {
      source: 'live',
      network,
      apiOrigin,
      fetchedAt: new Date().toISOString(),
      fixtureCount: worldCupFixtures.length || fixtures.length,
      fixtureLabel: summarizeFixture(selectedFixture),
      fixtureState: String(selectedFixture?.GameState ?? selectedFixture?.gameState ?? 'unknown'),
      oddsCount: odds.length,
      scoresCount: scores.length,
      coverageHash: shortHash({
        selectedFixture,
        fixtureCount: worldCupFixtures.length || fixtures.length,
        oddsCount: odds.length,
        scoresCount: scores.length,
      }),
    };

    if (selectedFixtureId !== undefined) {
      liveSnapshot.fixtureId = selectedFixtureId;
    }

    const selectedFixtureStart = selectedFixture?.StartTime ?? selectedFixture?.startTime;
    if (selectedFixtureStart !== undefined) {
      liveSnapshot.fixtureStart = selectedFixtureStart;
    }

    return liveSnapshot;
  } catch (error) {
    return fallbackSnapshot(error instanceof Error ? error.message : 'unknown TxLINE API error');
  }
}

export function buildLiveHeroMetrics(snapshot: TxlineLiveSnapshot) {
  return [
    {
      label: 'World Cup fixture windows',
      value: String(snapshot.fixtureCount),
      detail:
        snapshot.source === 'live' ? `live ${snapshot.network} fixtures` : heroMetrics[0].detail,
    },
    {
      label: 'TxLINE odds entries',
      value: String(snapshot.oddsCount),
      detail:
        snapshot.source === 'live'
          ? `snapshot for fixture ${snapshot.fixtureId ?? 'n/a'}`
          : 'synthetic odds replay entries',
    },
    {
      label: 'TxLINE score entries',
      value: String(snapshot.scoresCount),
      detail:
        snapshot.source === 'live'
          ? `snapshot for ${snapshot.fixtureLabel}`
          : 'synthetic score replay entries',
    },
    {
      label: 'Coverage hash',
      value: snapshot.coverageHash,
      detail:
        snapshot.source === 'live' ? 'computed from live snapshot' : 'synthetic fallback hash',
    },
  ] as const;
}

export function buildTxlineDataMode(snapshot: TxlineLiveSnapshot): TxlineDataMode {
  if (snapshot.source === 'live') {
    return {
      label: 'Live TxLINE API',
      detail: `${snapshot.fixtureLabel} · fixture ${snapshot.fixtureId ?? 'n/a'} · ${snapshot.fetchedAt}`,
      pillClassName: 'pill',
    };
  }

  return {
    label: 'Synthetic fallback',
    detail: `Set TXLINE_API_TOKEN to enable live TxLINE reads. ${snapshot.reason ?? ''}`,
    pillClassName: 'pill warn',
  };
}

export function buildLiveWorkflowSteps(snapshot: TxlineLiveSnapshot): WorkflowStep[] {
  const steps: WorkflowStep[] = demoWorkflowSteps.map((step) => ({
    ...step,
    proofs: [...step.proofs],
  }));
  const ingestStep = steps[0];
  if (ingestStep) {
    steps[0] = {
      ...ingestStep,
      metric: `${snapshot.fixtureCount} fixture windows`,
      status:
        snapshot.source === 'live' ? 'Live TxLINE snapshot loaded' : 'Synthetic fallback loaded',
      current: `${snapshot.fixtureLabel} · fixture ${snapshot.fixtureId ?? 'n/a'} · state ${snapshot.fixtureState ?? 'unknown'}`,
      candidate: `Coverage hash ${snapshot.coverageHash} from ${snapshot.source === 'live' ? 'TxLINE API' : 'fallback data'}`,
      proofs: [
        `Data source: ${snapshot.source === 'live' ? `Live TxLINE ${snapshot.network}` : 'Synthetic fallback'}`,
        `API origin: ${snapshot.apiOrigin}`,
        `Fetched at: ${snapshot.fetchedAt}`,
      ],
    };
  }

  const optimizerStep = steps[2];
  if (optimizerStep) {
    steps[2] = {
      ...optimizerStep,
      metric: `${snapshot.oddsCount} odds rows`,
      proofs: [
        `Odds snapshot rows: ${snapshot.oddsCount}`,
        `Scores snapshot rows: ${snapshot.scoresCount}`,
        `Selected fixture: ${snapshot.fixtureLabel}`,
      ],
    };
  }

  const proofStep = steps[4];
  if (proofStep) {
    steps[4] = {
      ...proofStep,
      metric: `${snapshot.source === 'live' ? 'Live' : 'Fallback'} proof pack`,
      proofs: [
        `Fixture snapshot hash ${snapshot.coverageHash}`,
        `Odds snapshot endpoint checked for ${snapshot.fixtureId ?? 'n/a'}`,
        `Scores snapshot endpoint checked for ${snapshot.fixtureId ?? 'n/a'}`,
      ],
    };
  }
  return steps;
}

export function buildLiveDemoModules(snapshot: TxlineLiveSnapshot) {
  return demoModules.map((module, index) => {
    if (index === 0) {
      return {
        ...module,
        metric: `${snapshot.fixtureCount} fixture windows`,
        body:
          snapshot.source === 'live'
            ? `Live TxLINE fixture snapshot from ${snapshot.network}: ${snapshot.fixtureLabel}, odds rows ${snapshot.oddsCount}, score rows ${snapshot.scoresCount}.`
            : module.body,
      };
    }

    if (index === 1) {
      return {
        ...module,
        metric: `${snapshot.oddsCount} odds rows`,
      };
    }

    if (index === 2) {
      return {
        ...module,
        metric: `${snapshot.source === 'live' ? 'live' : 'fallback'} proof source`,
      };
    }

    if (index === 5) {
      return {
        ...module,
        metric: `${snapshot.scoresCount} score rows`,
      };
    }

    return module;
  });
}

function withLiveKpis(module: TxlineModule, snapshot: TxlineLiveSnapshot): TxlineModule {
  return {
    ...module,
    kpis: [
      {
        label: 'Data source',
        value: snapshot.source === 'live' ? 'Live' : 'Fallback',
        detail: snapshot.apiOrigin,
      },
      {
        label: 'Fixture rows',
        value: String(snapshot.fixtureCount),
        detail: snapshot.fixtureLabel,
      },
      {
        label: 'Odds rows',
        value: String(snapshot.oddsCount),
        detail: `fixture ${snapshot.fixtureId ?? 'n/a'}`,
      },
      { label: 'Score rows', value: String(snapshot.scoresCount), detail: snapshot.coverageHash },
    ],
    proofs: [
      `TxLINE mode: ${snapshot.source === 'live' ? `live ${snapshot.network}` : 'synthetic fallback'}`,
      `Fetched at ${snapshot.fetchedAt}`,
      snapshot.reason
        ? `Fallback reason: ${snapshot.reason}`
        : 'Live read completed without fallback',
    ],
  };
}

export function buildLiveModules(snapshot: TxlineLiveSnapshot) {
  return {
    portfolio: withLiveKpis(portfolioModule, snapshot),
    scenarios: withLiveKpis(scenariosModule, snapshot),
    proposal: withLiveKpis(proposalModule, snapshot),
    savings: withLiveKpis(savingsModule, snapshot),
    renewals: withLiveKpis(renewalsModule, snapshot),
    usage: withLiveKpis(usageModule, snapshot),
  };
}
