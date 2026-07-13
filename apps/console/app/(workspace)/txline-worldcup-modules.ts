export type TxlineModule = {
  eyebrow: string;
  title: string;
  lead: string;
  kpis: ReadonlyArray<{ label: string; value: string; detail: string }>;
  records: ReadonlyArray<{
    name: string;
    scope: string;
    evidence: string;
    status: 'Ready' | 'Watch' | 'Blocked';
  }>;
  proofs: ReadonlyArray<string>;
  action: {
    label: string;
    body: string;
  };
};

export const portfolioModule: TxlineModule = {
  eyebrow: 'World Cup portfolio control room',
  title: 'TxLINE fixture, odds, score, and latency baseline',
  lead: 'A synthetic World Cup 2026 portfolio showing the feed commitments that sportsbook ops, fan apps, sponsors, and settlement teams must protect before any savings move is approved.',
  kpis: [
    { label: 'Fixture windows', value: '104', detail: 'group, knockout, and final windows mapped' },
    { label: 'TxLINE feeds', value: '18', detail: 'odds, scores, stats, and replay entitlements' },
    { label: 'Latency classes', value: '4', detail: 'live, near-live, replay, archive' },
    { label: 'Coverage hash', value: '0x8c41…f9b2', detail: 'synthetic fixture snapshot' },
  ],
  records: [
    {
      name: 'Group stage live odds bundle',
      scope: '48 fixtures · sportsbook markets',
      evidence: 'odds SSE replay window attached',
      status: 'Ready',
    },
    {
      name: 'Fan-app score sync package',
      scope: '64 matches · APAC and Americas',
      evidence: 'score stream watermark 99.8%',
      status: 'Watch',
    },
    {
      name: 'Sponsor trigger archive',
      scope: 'goal, VAR, card, and final-whistle events',
      evidence: 'stat validation proof required for settlement',
      status: 'Blocked',
    },
  ],
  proofs: [
    'Fixture snapshot hash pinned before scenario generation',
    'Entitlement evidence separates live match windows from replay windows',
    'No real TxLINE token or customer portfolio is loaded',
  ],
  action: {
    label: 'Baseline ready for scenario analysis',
    body: 'Use this page as the starting state for every optimization proposal. Changes must preserve hard fixture, feed, and settlement requirements.',
  },
};

export const scenariosModule: TxlineModule = {
  eyebrow: 'TxLINE optimization scenarios',
  title: 'Compare feed-tier changes against settlement-critical requirements',
  lead: 'Scenario analysis turns the World Cup portfolio into safe savings candidates by checking each feed-tier move against fixture coverage, live odds replay, live scores replay, and sponsor-trigger obligations.',
  kpis: [
    { label: 'Candidate savings', value: '$2.7M', detail: 'annualized synthetic opportunity' },
    { label: 'Hard conflicts', value: '3', detail: 'blocked before approval' },
    { label: 'Replay coverage', value: '97%', detail: 'odds/scores proof pack readiness' },
    { label: 'Policy version', value: 'WC26-17', detail: 'sandbox verifier rule set' },
  ],
  records: [
    {
      name: 'Downgrade replay-only archive windows',
      scope: '$620K savings · no live settlement dependency',
      evidence: 'historical replay proof complete',
      status: 'Ready',
    },
    {
      name: 'Move non-featured fixtures to regional tier',
      scope: '$185K savings · APAC late matches',
      evidence: 'score validation green, latency watch',
      status: 'Watch',
    },
    {
      name: 'Remove sponsor-trigger stats feed',
      scope: '$96K savings · goal and VAR triggers',
      evidence: 'hard settlement requirement conflict',
      status: 'Blocked',
    },
  ],
  proofs: [
    'Every scenario references the same fixture snapshot hash',
    'Live-write remains disabled until approval and signing gates pass',
    'Rejected scenarios stay visible with exact conflict reasons',
  ],
  action: {
    label: 'Promote safe candidate to proposal',
    body: 'Only candidates with complete odds/scores replay and no hard settlement conflict become governed proposals.',
  },
};

export const proposalModule: TxlineModule = {
  eyebrow: 'Governed settlement proposal',
  title: 'Frozen proposal review for WC26-2048',
  lead: 'A buyer-facing proposal packet that binds savings, fixture coverage, TxLINE replay evidence, policy decisions, approval graph, and transaction safety checks before anyone can execute.',
  kpis: [
    {
      label: 'Projected savings',
      value: '$410K',
      detail: 'duplicate group-stage odds feed consolidation',
    },
    { label: 'Material hash', value: '0xf204…91aa', detail: 'proposal inputs frozen' },
    { label: 'Approvals', value: '2 / 3', detail: 'finance and ops approved, signer pending' },
    { label: 'Expiry', value: '36h', detail: 'invalidates if fixture snapshot changes' },
  ],
  records: [
    {
      name: 'Finance approval',
      scope: 'savings baseline and export reviewed',
      evidence: 'baseline hash 0x71ab…c042',
      status: 'Ready',
    },
    {
      name: 'Sports operations approval',
      scope: 'fixture and market coverage reviewed',
      evidence: 'TxLINE odds replay complete',
      status: 'Ready',
    },
    {
      name: 'Signer separation',
      scope: 'non-custodial transaction envelope',
      evidence: 'waiting on final signer',
      status: 'Watch',
    },
  ],
  proofs: [
    'Proposal hash covers scenario, policy, fixture snapshot, and replay window',
    'Transaction envelope is shown but cannot live-write in sandbox mode',
    'Material input changes invalidate the approval packet',
  ],
  action: {
    label: 'Approval required · live-write disabled',
    body: 'This sandbox proposal demonstrates governance and evidence only. It does not submit transactions or require a funded wallet.',
  },
};

export const savingsModule: TxlineModule = {
  eyebrow: 'Replay-backed savings evidence',
  title: 'Separate forecast savings from realized World Cup feed savings',
  lead: 'Finance can inspect which savings are forecast, which are realized, and which remain blocked until complete TxLINE replay and period watermarks are available.',
  kpis: [
    { label: 'Forecast savings', value: '$2.7M', detail: 'scenario opportunity pool' },
    { label: 'Realized savings', value: '$612K', detail: 'sandbox closed-period evidence' },
    { label: 'Watermark', value: '99.4%', detail: 'complete odds/scores replay period' },
    { label: 'Export status', value: 'Ready', detail: 'finance CSV and audit pack' },
  ],
  records: [
    {
      name: 'Group-stage duplicate feed retirement',
      scope: '$410K forecast · $188K realized',
      evidence: 'odds replay and invoice baseline match',
      status: 'Ready',
    },
    {
      name: 'Replay archive tier shift',
      scope: '$620K forecast · awaiting full period',
      evidence: 'period watermark incomplete',
      status: 'Watch',
    },
    {
      name: 'Sponsor-trigger package removal',
      scope: '$96K forecast · rejected',
      evidence: 'settlement proof missing',
      status: 'Blocked',
    },
  ],
  proofs: [
    'Forecast and realized savings are never mixed',
    'Finance export includes fixture snapshot and replay hashes',
    'Blocked savings remain visible with proof gaps',
  ],
  action: {
    label: 'Audit pack ready',
    body: 'Use the evidence pack to explain exactly which World Cup feed changes produced savings and which changes stayed blocked.',
  },
};

export const renewalsModule: TxlineModule = {
  eyebrow: 'World Cup renewal risk radar',
  title: 'Clear fixture, replay, and approval risks before renewal dates',
  lead: 'The renewal radar shows which World Cup commitments are about to lock in, what proof is missing, and which team owns the next action.',
  kpis: [
    { label: 'At-risk renewals', value: '14', detail: 'next 45 days' },
    { label: 'High severity', value: '3', detail: 'knockout-stage coverage' },
    { label: 'Proof gaps', value: '5', detail: 'score, odds, or entitlement evidence' },
    { label: 'Avoidable lock-in', value: '$840K', detail: 'synthetic renewal exposure' },
  ],
  records: [
    {
      name: 'World Cup knockout odds bundle',
      scope: 'renews in 12 days · sportsbook markets',
      evidence: 'finance approved, signer pending',
      status: 'Watch',
    },
    {
      name: 'Historical TxLINE odds archive',
      scope: 'renews in 21 days · replay windows',
      evidence: 'entitlement evidence missing',
      status: 'Blocked',
    },
    {
      name: 'Fan-app APAC latency add-on',
      scope: 'renews in 37 days · late match coverage',
      evidence: 'fixture coverage mismatch under review',
      status: 'Watch',
    },
  ],
  proofs: [
    'Every renewal row links to snapshot, policy, approval, and entitlement evidence',
    'High-risk renewals cannot be auto-approved',
    'Sandbox view never renews or cancels real commitments',
  ],
  action: {
    label: 'Renewal triage required',
    body: 'Resolve proof gaps before renewal lock-in so spend reductions do not break match-critical coverage.',
  },
};

export const usageModule: TxlineModule = {
  eyebrow: 'TxLINE usage and metering',
  title: 'Track World Cup odds, scores, replay, and workspace usage',
  lead: 'Usage metering connects event volume to spend decisions so teams can see which workspaces, regions, and match windows drive TxLINE costs.',
  kpis: [
    { label: 'Odds events', value: '2.4M', detail: 'synthetic replayed market updates' },
    { label: 'Score events', value: '1.4M', detail: 'goals, cards, VAR, final states' },
    { label: 'Workspaces', value: '42', detail: 'ops, finance, fan, sponsor teams' },
    { label: 'Quality', value: '99.8%', detail: 'schema and watermark checks' },
  ],
  records: [
    {
      name: 'Sportsbook operations',
      scope: '1.8M odds events · 64 fixture windows',
      evidence: 'market update volume drives live-tier spend',
      status: 'Ready',
    },
    {
      name: 'Fan engagement app',
      scope: '1.1M score events · APAC/Americas',
      evidence: 'late-match score sync watchlist',
      status: 'Watch',
    },
    {
      name: 'Sponsor activation desk',
      scope: '210K trigger events · archive replay',
      evidence: 'stat proof missing for some triggers',
      status: 'Blocked',
    },
  ],
  proofs: [
    'Customer identifiers are not required for sandbox usage imports',
    'Usage rows connect event volume to feed tier decisions',
    'Quality checks reject incomplete period, currency, unit, or product-scope data',
  ],
  action: {
    label: 'Metering ready for spend review',
    body: 'Use usage volume to explain why specific TxLINE feed tiers should be kept, downgraded, or blocked from change.',
  },
};
