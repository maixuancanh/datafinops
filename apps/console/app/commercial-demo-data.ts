export const navItems = [
  { label: 'Product', href: '#product' },
  { label: 'Demo', href: '/demo' },
  { label: 'Security', href: '#security' },
  { label: 'Pilot', href: '#pilot' },
] as const;

export const heroMetrics = [
  { label: 'Managed annualized spend', value: '$18.4M', detail: 'synthetic TxLINE portfolio' },
  { label: 'Projected avoidable spend', value: '$2.7M', detail: 'policy-safe optimization' },
  { label: 'Renewals at risk', value: '14', detail: 'next 45 days' },
  { label: 'Evidence readiness', value: '97%', detail: 'audit pack coverage' },
] as const;

export const buyerPains = [
  {
    title: 'Rights spend is scattered',
    body: 'Pricing, usage, fixture coverage, latency commitments, renewals, and approvals usually live in different tools.',
  },
  {
    title: 'Optimization is hard to trust',
    body: 'Finance teams need deterministic replay, exact money math, and evidence before approving subscription changes.',
  },
  {
    title: 'Execution risk is expensive',
    body: 'A missed entitlement, wrong network, stale approval, or unsigned proposal can turn savings into incidents.',
  },
] as const;

export const operatingLoop = [
  {
    step: '01',
    title: 'Ingest verified portfolio state',
    body: 'Normalize pricing, usage, subscriptions, fixture requirements, revenue, cost centers, and entitlement evidence.',
  },
  {
    step: '02',
    title: 'Optimize within policy',
    body: 'Run deterministic scenario analysis while preserving hard requirements and surfacing conflicts instead of hiding them.',
  },
  {
    step: '03',
    title: 'Approve with audit-grade context',
    body: 'Freeze proposal hashes, policy versions, approval graphs, rationale, expiry, and material-change invalidation.',
  },
  {
    step: '04',
    title: 'Verify savings and renewal risk',
    body: 'Track realized savings, entitlement mismatches, renewal windows, and evidence bundles for finance sign-off.',
  },
] as const;

export const demoModules = [
  {
    title: 'Portfolio control room',
    metric: '$18.4M managed',
    body: 'View current commitments, coverage, latency classes, regions, and cost-center exposure.',
    href: '/portfolio',
  },
  {
    title: 'Optimization scenarios',
    metric: '$2.7M opportunity',
    body: 'Compare current state with candidate configurations and see every hard/soft requirement consequence.',
    href: '/scenarios',
  },
  {
    title: 'Governed proposals',
    metric: '6 pending',
    body: 'Review proposal hashes, approval graph state, policy reasons, expiry, and transaction safety checks.',
    href: '/proposals/demo-proposal-001',
  },
  {
    title: 'Savings evidence',
    metric: '97% ready',
    body: 'Inspect realized savings, baseline versions, replay evidence, and finance export status.',
    href: '/savings',
  },
  {
    title: 'Renewal risk radar',
    metric: '14 at risk',
    body: 'Prioritize expiring commitments, missing requirements, approval delays, and entitlement mismatches.',
    href: '/renewals',
  },
  {
    title: 'Usage and metering',
    metric: '42 workspaces',
    body: 'Track platform meters, managed spend, optimizer runs, integration coverage, and enterprise usage.',
    href: '/usage',
  },
] as const;

export const proposalQueue = [
  {
    id: 'PR-2048',
    title: 'Consolidate premium football feed coverage',
    impact: '$410K projected annual savings',
    state: 'Approval required',
    risk: 'Signer separation pending',
  },
  {
    id: 'PR-2052',
    title: 'Move low-latency fixtures to regional tier',
    impact: '$185K projected annual savings',
    state: 'Eligible',
    risk: 'Entitlement verifier green',
  },
  {
    id: 'PR-2055',
    title: 'Retire duplicate basketball data pack',
    impact: '$96K projected annual savings',
    state: 'Blocked',
    risk: 'Hard requirement conflict',
  },
] as const;

export const renewalRisks = [
  { label: 'Premium football feed', due: '12 days', reason: 'approval delay', severity: 'High' },
  {
    label: 'Historical odds archive',
    due: '21 days',
    reason: 'missing entitlement evidence',
    severity: 'Medium',
  },
  {
    label: 'Latency add-on APAC',
    due: '37 days',
    reason: 'fixture coverage mismatch',
    severity: 'Medium',
  },
] as const;

export const evidenceChecks = [
  'Deterministic optimizer replay',
  'Proposal material-input hash',
  'Policy and approval graph snapshot',
  'Non-custodial transaction envelope',
  'Savings baseline and finance export',
] as const;

export const pilotPackages = [
  {
    name: 'Executive demo',
    price: '1 week',
    body: 'Walk through a synthetic portfolio, risks, proposals, and savings evidence with your buying committee.',
  },
  {
    name: 'Sandbox pilot',
    price: '30 days',
    body: 'Load sample portfolio structures and validate governance, optimizer replay, and evidence packs.',
  },
  {
    name: 'Enterprise assessment',
    price: 'Custom',
    body: 'Map controls, data sources, security posture, and production-readiness gates before live integrations.',
  },
] as const;

export const safetyClaims = [
  'Sandbox demo data only',
  'No private signing material',
  'No server-side signing',
  'Live-write disabled by default',
  'No funded-wallet workflow',
] as const;
