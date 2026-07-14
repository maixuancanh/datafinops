import { evidenceChecks, proposalQueue, renewalRisks } from '../commercial-demo-data';
import {
  buildLiveDemoModules,
  buildLiveHeroMetrics,
  buildLiveWorkflowSteps,
  buildTxlineDataMode,
  getTxlineLiveSnapshot,
} from '../txline-live-data';
import { DemoWorkflow } from './demo-workflow';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DemoPage() {
  const txlineSnapshot = await getTxlineLiveSnapshot();
  const metrics = buildLiveHeroMetrics(txlineSnapshot);
  const workflowSteps = buildLiveWorkflowSteps(txlineSnapshot);
  const modules = buildLiveDemoModules(txlineSnapshot);
  const dataMode = buildTxlineDataMode(txlineSnapshot);
  const safetyClaims =
    txlineSnapshot.source === 'live'
      ? ['TxLINE read-only snapshot', 'No funded wallet required', 'Live-write disabled by default']
      : ['Synthetic fallback data', 'No funded wallet required', 'Live-write disabled by default'];

  return (
    <main className="site-shell">
      <header className="nav">
        <div className="container nav-inner">
          <a className="brand" href="/">
            <span className="brand-mark">Δ</span>
            <span>DataFinOps</span>
          </a>
          <nav className="nav-links" aria-label="Demo navigation">
            <a href="/portfolio">Portfolio</a>
            <a href="/scenarios">Scenarios</a>
            <a href="/savings">Savings</a>
            <a href="/administration">Admin</a>
          </nav>
          <a className="button-secondary" href="/">
            Back to overview
          </a>
        </div>
      </header>

      <section className="container demo-hero">
        <span className="eyebrow">Guided TxLINE sandbox · World Cup 2026 portfolio</span>
        <h1 className="section-title">TxLINE World Cup 2026 spend command center</h1>
        <p className="lead">
          A buyer-facing walkthrough for sportsbook ops, fan apps, sponsor activations, and
          prediction-market settlement teams: fixture coverage, odds/scores replay, governed savings
          proposals, renewal risk, and finance-grade proof packs.
        </p>
        <div className="safety-strip">
          <span className={dataMode.pillClassName}>{dataMode.label}</span>
          {safetyClaims.map((claim) => (
            <span className="pill" key={claim}>
              {claim}
            </span>
          ))}
        </div>
        <div
          className={
            txlineSnapshot.source === 'live' ? 'source-banner live' : 'source-banner fallback'
          }
        >
          <strong>{dataMode.label}</strong>
          <span>{dataMode.detail}</span>
        </div>
      </section>

      <DemoWorkflow steps={workflowSteps} />

      <section className="container section">
        <div className="metric-grid">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">
                <strong>{metric.label}</strong>
                <br />
                {metric.detail}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container section demo-layout">
        <article className="panel-card">
          <span className="eyebrow">TxLINE proposal queue</span>
          <h2>Approval-ready World Cup savings candidates</h2>
          {proposalQueue.map((proposal) => (
            <div className="queue-item" key={proposal.id}>
              <div>
                <strong>
                  {proposal.id} · {proposal.title}
                </strong>
                <p>
                  {proposal.impact} · {proposal.risk}
                </p>
              </div>
              <span className={proposal.state === 'Blocked' ? 'pill danger' : 'pill'}>
                {proposal.state}
              </span>
            </div>
          ))}
        </article>

        <aside className="panel-card">
          <span className="eyebrow">World Cup renewal radar</span>
          <h2>Risks to clear before match-critical commitment dates</h2>
          {renewalRisks.map((risk) => (
            <div className="risk-item" key={risk.label}>
              <div>
                <strong>{risk.label}</strong>
                <p>
                  Due in {risk.due} · {risk.reason}
                </p>
              </div>
              <span className={risk.severity === 'High' ? 'pill danger' : 'pill warn'}>
                {risk.severity}
              </span>
            </div>
          ))}
        </aside>
      </section>

      <section className="container section">
        <div className="section-header">
          <div>
            <span className="eyebrow">TxLINE launch points</span>
            <h2 className="section-title">Drill into the modules behind the workflow.</h2>
          </div>
          <p>
            These module pages support the guided story above. Use them when a buyer wants to
            inspect the portfolio baseline, scenario math, proposal packet, savings evidence,
            renewal risk, or usage metering in detail.
          </p>
        </div>
        <div className="card-grid">
          {modules.map((module) => (
            <a className="module-card" href={module.href} key={module.title}>
              <div>
                <span className="module-metric">{module.metric}</span>
                <h3>{module.title}</h3>
                <p>{module.body}</p>
              </div>
              <span className="button-secondary">Open module</span>
            </a>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="cta-band">
          <div>
            <span className="eyebrow">TxLINE evidence checklist</span>
            <h2 className="section-title">
              What finance, security, and settlement teams can inspect.
            </h2>
          </div>
          <div>
            {evidenceChecks.map((check) => (
              <div className="check-item" key={check}>
                <span>{check}</span>
                <span className="pill">Ready</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
