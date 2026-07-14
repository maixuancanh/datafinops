import type { TxlineDataMode } from '../txline-live-data';
import type { TxlineModule } from './txline-worldcup-modules';

const statusClass = {
  Ready: 'pill',
  Watch: 'pill warn',
  Blocked: 'pill danger',
} as const satisfies Record<TxlineModule['records'][number]['status'], string>;

export function TxlineModulePage({
  module,
  context,
  dataMode,
}: Readonly<{ module: TxlineModule; context: string; dataMode: TxlineDataMode }>) {
  return (
    <main className="site-shell workspace-shell">
      <header className="nav">
        <div className="container nav-inner">
          <a className="brand" href="/demo">
            <span className="brand-mark">Δ</span>
            <span>DataFinOps</span>
          </a>
          <nav className="nav-links" aria-label="Workspace module navigation">
            <a href="/demo">Demo</a>
            <a href="/portfolio">Portfolio</a>
            <a href="/scenarios">Scenarios</a>
            <a href="/savings">Savings</a>
            <a href="/renewals">Renewals</a>
            <a href="/usage">Usage</a>
          </nav>
        </div>
      </header>

      <section className="container workspace-hero">
        <span className="eyebrow">{module.eyebrow}</span>
        <p className="workspace-context">{context}</p>
        <h1 className="section-title">{module.title}</h1>
        <p className="lead">{module.lead}</p>
        <div className="safety-strip">
          <span className="pill">TxLINE World Cup 2026 sandbox</span>
          <span className={dataMode.pillClassName}>{dataMode.label}</span>
          <span className="pill">No funded wallet</span>
          <span className="pill">Live-write disabled</span>
        </div>
        <div
          className={
            dataMode.label === 'Live TxLINE API' ? 'source-banner live' : 'source-banner fallback'
          }
        >
          <strong>{dataMode.label}</strong>
          <span>{dataMode.detail}</span>
        </div>
      </section>

      <section className="container section">
        <div className="metric-grid workspace-metrics">
          {module.kpis.map((kpi) => (
            <article className="metric-card" key={kpi.label}>
              <div className="metric-value">{kpi.value}</div>
              <div className="metric-label">
                <strong>{kpi.label}</strong>
                <br />
                {kpi.detail}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container section workspace-grid">
        <article className="panel-card">
          <span className="eyebrow">Module records</span>
          <h2>Operational rows buyers can inspect</h2>
          <div className="record-list">
            {module.records.map((record) => (
              <div className="record-item" key={record.name}>
                <div>
                  <strong>{record.name}</strong>
                  <p>{record.scope}</p>
                  <p>{record.evidence}</p>
                </div>
                <span className={statusClass[record.status]}>{record.status}</span>
              </div>
            ))}
          </div>
        </article>

        <aside className="panel-card">
          <span className="eyebrow">Proof checklist</span>
          <h2>Why this is not just a label swap</h2>
          {module.proofs.map((proof) => (
            <div className="check-item" key={proof}>
              <span>{proof}</span>
              <span className="pill">Shown</span>
            </div>
          ))}
        </aside>
      </section>

      <section className="container section">
        <div className="cta-band">
          <div>
            <span className="eyebrow">Next action</span>
            <h2 className="section-title">{module.action.label}</h2>
            <p className="lead">{module.action.body}</p>
          </div>
          <a className="button-secondary" href="/demo">
            Back to demo
          </a>
        </div>
      </section>
    </main>
  );
}
