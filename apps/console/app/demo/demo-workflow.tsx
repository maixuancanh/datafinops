'use client';

import { useEffect, useMemo, useState } from 'react';

import type { demoWorkflowSteps } from '../commercial-demo-data';

type WorkflowStep = (typeof demoWorkflowSteps)[number];

export function DemoWorkflow({ steps }: Readonly<{ steps: ReadonlyArray<WorkflowStep> }>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const safeIndex = Math.min(activeIndex, Math.max(steps.length - 1, 0));
  const activeStep = steps[safeIndex];
  const progress = useMemo(
    () => (steps.length > 0 ? ((safeIndex + 1) / steps.length) * 100 : 0),
    [safeIndex, steps.length],
  );

  useEffect(() => {
    if (!isRunning || steps.length === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => {
        if (current >= steps.length - 1) {
          setIsRunning(false);
          return current;
        }

        return current + 1;
      });
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isRunning, steps.length]);

  if (!activeStep) {
    return null;
  }

  return (
    <section className="container section workflow-section" aria-label="Guided workflow demo">
      <div className="workflow-header">
        <div>
          <span className="eyebrow">Guided workflow</span>
          <h2 className="section-title">Run the TxLINE World Cup demo story end to end.</h2>
          <p>
            Follow one savings candidate from coverage ingestion to proof-backed decision. Use
            auto-run for a narrated sales demo, or jump manually to any step.
          </p>
        </div>
        <div className="workflow-controls">
          <button
            className="button"
            type="button"
            onClick={() => {
              if (activeIndex === steps.length - 1) {
                setActiveIndex(0);
              }
              setIsRunning(true);
            }}
          >
            Auto-run demo
          </button>
          <button className="button-secondary" type="button" onClick={() => setIsRunning(false)}>
            Pause
          </button>
          <button
            className="button-secondary"
            type="button"
            onClick={() => {
              setIsRunning(false);
              setActiveIndex(0);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div
        aria-label="Workflow progress"
        aria-valuemax={steps.length}
        aria-valuemin={1}
        aria-valuenow={safeIndex + 1}
        className="workflow-progress"
        role="progressbar"
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="workflow-shell">
        <nav className="workflow-steps" aria-label="Workflow steps">
          {steps.map((step, index) => (
            <button
              aria-current={index === safeIndex ? 'step' : undefined}
              aria-pressed={index === safeIndex}
              className={index === safeIndex ? 'workflow-step active' : 'workflow-step'}
              key={step.stage}
              type="button"
              onClick={() => {
                setIsRunning(false);
                setActiveIndex(index);
              }}
            >
              <span>{step.stage}</span>
              <strong>{step.title}</strong>
              <small>{step.status}</small>
            </button>
          ))}
        </nav>

        <article className="workflow-panel">
          <div className="workflow-panel-top">
            <span className="pill">{activeStep.metric}</span>
            <span className={activeStep.status.includes('blocked') ? 'pill danger' : 'pill'}>
              {isRunning ? 'Auto-running' : activeStep.status}
            </span>
          </div>
          <h3>{activeStep.title}</h3>
          <p>{activeStep.body}</p>

          <div className="comparison-grid">
            <div>
              <span className="module-metric">Current state</span>
              <p>{activeStep.current}</p>
            </div>
            <div>
              <span className="module-metric">Candidate state</span>
              <p>{activeStep.candidate}</p>
            </div>
          </div>

          <div className="workflow-proof-list">
            {activeStep.proofs.map((proof) => (
              <div className="check-item" key={proof}>
                <span>{proof}</span>
                <span className="pill">Shown</span>
              </div>
            ))}
          </div>

          <a className="button-secondary" href={activeStep.href}>
            Open this module
          </a>
        </article>
      </div>
    </section>
  );
}
