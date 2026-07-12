import {
  buyerPains,
  heroMetrics,
  navItems,
  operatingLoop,
  pilotPackages,
  safetyClaims,
} from './commercial-demo-data';

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="nav">
        <div className="container nav-inner">
          <a className="brand" href="/">
            <span className="brand-mark">Δ</span>
            <span>DataFinOps</span>
          </a>
          <nav className="nav-links" aria-label="Commercial demo navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <a className="button" href="/demo">
            Launch sandbox demo
          </a>
        </div>
      </header>

      <section className="container hero">
        <div>
          <span className="eyebrow">Sandbox SaaS demo · live-write disabled</span>
          <h1>Commercial control for data-rights spend.</h1>
          <p className="lead">
            DataFinOps turns TxLINE pricing, usage, entitlements, renewals, approvals, and savings
            evidence into one governed operating loop — ready for executive demos and buyer pilots
            without touching funded wallets or production credentials.
          </p>
          <div className="hero-actions">
            <a className="button" href="/demo">
              Launch sandbox demo
            </a>
            <a
              className="button-secondary"
              href="mailto:sales@datafinops.example?subject=DataFinOps%20pilot"
            >
              Book pilot conversation
            </a>
          </div>
          <div className="safety-strip" aria-label="Safety posture">
            {safetyClaims.map((claim) => (
              <span className="pill" key={claim}>
                {claim}
              </span>
            ))}
          </div>
        </div>

        <aside className="hero-card" aria-label="Commercial demo metrics">
          <div className="terminal-header">
            <span>Sandbox portfolio</span>
            <span>Evidence pack ready</span>
          </div>
          <div className="metric-grid">
            {heroMetrics.map((metric) => (
              <div className="metric-card" key={metric.label}>
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">
                  <strong>{metric.label}</strong>
                  <br />
                  {metric.detail}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="container section" id="product">
        <div className="section-header">
          <div>
            <span className="eyebrow">Why buyers care</span>
            <h2 className="section-title">Stop running data spend from spreadsheets.</h2>
          </div>
          <p>
            The demo focuses on the executive story: find savings, preserve requirements, prevent
            unsafe execution, and give finance an audit trail they can defend.
          </p>
        </div>
        <div className="card-grid">
          {buyerPains.map((pain) => (
            <article className="panel-card" key={pain.title}>
              <h3>{pain.title}</h3>
              <p>{pain.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Operating loop</span>
            <h2 className="section-title">From portfolio state to approved savings.</h2>
          </div>
        </div>
        <div className="loop-grid">
          {operatingLoop.map((item) => (
            <article className="panel-card" key={item.step}>
              <div className="step">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section" id="security">
        <div className="cta-band">
          <div>
            <span className="eyebrow">Commercial-safe sandbox</span>
            <h2 className="section-title">Demo the workflow, not risky execution.</h2>
            <p className="lead">
              This web demo is designed for sales and pilot conversations. It uses synthetic data,
              public/unfunded references, deterministic replay, and non-custodial proposal flows.
            </p>
          </div>
          <a className="button-secondary" href="/policies">
            Review policy gates
          </a>
        </div>
      </section>

      <section className="container section" id="pilot">
        <div className="section-header">
          <div>
            <span className="eyebrow">Pilot packaging</span>
            <h2 className="section-title">A buyer-ready path from demo to assessment.</h2>
          </div>
        </div>
        <div className="card-grid">
          {pilotPackages.map((pack) => (
            <article className="pricing-card" key={pack.name}>
              <span className="pill">{pack.price}</span>
              <h3>{pack.name}</h3>
              <p>{pack.body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          DataFinOps sandbox demo · no live spend · no public deployment claim · live-write disabled
          by default.
        </div>
      </footer>
    </main>
  );
}
