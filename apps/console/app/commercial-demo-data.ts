export const navItems = [
  { label: 'World Cup control', href: '#product' },
  { label: 'TxLINE demo', href: '/demo' },
  { label: 'Proofs', href: '#security' },
  { label: 'Pilot', href: '#pilot' },
] as const;

export const heroMetrics = [
  { label: 'World Cup fixture windows', value: '104', detail: 'synthetic 2026 coverage plan' },
  { label: 'TxLINE feeds monitored', value: '3.8M', detail: 'odds and score events replayed' },
  { label: 'Avoidable data spend', value: '$2.7M', detail: 'policy-safe feed optimization' },
  {
    label: 'Settlement proof readiness',
    value: '97%',
    detail: 'replay and validation pack coverage',
  },
] as const;

export const buyerPains = [
  {
    title: 'World Cup data spend spikes fast',
    body: 'Sportsbooks, fan apps, sponsor activations, and prediction desks buy overlapping fixture, odds, score, and latency packages under pressure.',
  },
  {
    title: 'TxLINE changes need proof',
    body: 'Finance and ops teams need deterministic replay of fixtures, live odds SSE, live scores SSE, and validation proofs before approving feed changes.',
  },
  {
    title: 'Settlement errors are visible',
    body: 'A stale score, missing odds snapshot, bad entitlement, or unsigned settlement envelope can turn a savings move into a public incident.',
  },
] as const;

export const operatingLoop = [
  {
    step: '01',
    title: 'Map World Cup coverage',
    body: 'Normalize teams, fixture windows, markets, sponsor triggers, fan surfaces, latency tiers, and TxLINE feed entitlements.',
  },
  {
    step: '02',
    title: 'Replay TxLINE evidence',
    body: 'Run historical fixture replay with live odds and score streams so every optimization keeps settlement-critical data intact.',
  },
  {
    step: '03',
    title: 'Approve spend moves safely',
    body: 'Freeze proposal hashes, fixture snapshots, policy versions, approval graphs, and material-change invalidation before execution.',
  },
  {
    step: '04',
    title: 'Prove savings and settlement readiness',
    body: 'Track realized savings, feed coverage gaps, validation proofs, renewal windows, and finance-ready evidence bundles.',
  },
] as const;

export const demoModules = [
  {
    title: 'World Cup portfolio control room',
    metric: '104 fixture windows',
    body: 'View committed TxLINE fixture, odds, score, latency, market, sponsor, and regional coverage.',
    href: '/portfolio',
  },
  {
    title: 'TxLINE optimization scenarios',
    metric: '$2.7M opportunity',
    body: 'Compare feed-tier moves against hard settlement, fan-experience, and sponsor-trigger requirements.',
    href: '/scenarios',
  },
  {
    title: 'Governed settlement proposals',
    metric: '6 pending',
    body: 'Review proposal hashes, replay windows, approval graph state, fixture proofs, and transaction safety checks.',
    href: '/proposals/demo-proposal-001',
  },
  {
    title: 'Replay-backed savings evidence',
    metric: '97% ready',
    body: 'Inspect realized savings, baseline versions, TxLINE replay evidence, and finance export status.',
    href: '/savings',
  },
  {
    title: 'World Cup renewal risk radar',
    metric: '14 at risk',
    body: 'Prioritize expiring fixture commitments, missing score proofs, approval delays, and entitlement mismatches.',
    href: '/renewals',
  },
  {
    title: 'TxLINE usage and metering',
    metric: '42 workspaces',
    body: 'Track odds/scores event volume, optimizer runs, replay coverage, and team-level World Cup data consumption.',
    href: '/usage',
  },
] as const;

export const proposalQueue = [
  {
    id: 'WC26-2048',
    title: 'Consolidate duplicate odds feeds for group-stage fixtures',
    impact: '$410K projected annual savings',
    state: 'Approval required',
    risk: 'TxLINE odds replay complete; signer separation pending',
  },
  {
    id: 'WC26-2052',
    title: 'Downgrade stale low-latency tier outside live match windows',
    impact: '$185K projected annual savings',
    state: 'Eligible',
    risk: 'Fixture snapshot and scores validation green',
  },
  {
    id: 'WC26-2055',
    title: 'Block sponsor-trigger settlement without score proof',
    impact: '$96K projected annual savings',
    state: 'Blocked',
    risk: 'Missing TxLINE live scores replay for knockout scenario',
  },
] as const;

export const renewalRisks = [
  {
    label: 'World Cup knockout odds bundle',
    due: '12 days',
    reason: 'approval delay',
    severity: 'High',
  },
  {
    label: 'Historical TxLINE odds archive',
    due: '21 days',
    reason: 'missing replay entitlement evidence',
    severity: 'Medium',
  },
  {
    label: 'Fan-app APAC latency add-on',
    due: '37 days',
    reason: 'fixture coverage mismatch for late matches',
    severity: 'Medium',
  },
] as const;

export const evidenceChecks = [
  'TxLINE fixture snapshot hash',
  'Live odds SSE replay coverage',
  'Live scores SSE replay coverage',
  'On-chain/stat validation proof',
  'Settlement envelope and proposal hash',
  'Savings baseline and finance export',
] as const;

export const pilotPackages = [
  {
    name: 'World Cup executive demo',
    price: '1 week',
    body: 'Walk sportsbook, fan-app, sponsor, and prediction-market stakeholders through a synthetic TxLINE World Cup portfolio.',
  },
  {
    name: 'TxLINE sandbox pilot',
    price: '30 days',
    body: 'Validate fixture coverage, odds/scores replay, governance, optimizer replay, and settlement evidence packs.',
  },
  {
    name: 'Settlement-readiness assessment',
    price: 'Custom',
    body: 'Map controls, data sources, score/odds proof policy, security posture, and production-readiness gates.',
  },
] as const;

export const safetyClaims = [
  'Sandbox demo data only',
  'No real TxLINE token required',
  'No funded wallet required',
  'Live-write disabled by default',
  'Replay proofs are synthetic',
] as const;
