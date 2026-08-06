import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MetricCard } from '../components/MetricCard';
import { BootSequence } from '../components/BootSequence';
import { useDashboard, useMetrics } from '../hooks/usePlatformQueries';

const plainLanguagePipeline = [
  {
    step: '01',
    title: 'Understands request',
    description: 'Classifies intent and routes your request to the right agent workflow.',
  },
  {
    step: '02',
    title: 'Plans the work',
    description: 'Decomposes complex goals into an ordered series of subtasks.',
  },
  {
    step: '03',
    title: 'Runs specialist agents',
    description: 'Executes subtasks using specialized Planner, Researcher, Coder, and Reviewer agents.',
  },
  {
    step: '04',
    title: 'Remembers context',
    description: 'Maintains short-term task state and long-term memory across turns.',
  },
  {
    step: '05',
    title: 'Delivers clear answer',
    description: 'Synthesizes agent outputs into a single, cohesive response.',
  },
];

const technicalModules = [
  { name: 'IntentRouter', role: 'FastAPI / router.py — intent classification and pipeline selection.' },
  { name: 'TaskScheduler', role: 'scheduler.py — process control block (PCB) queue management.' },
  { name: 'AgentPCB & Registry', role: 'pcb.py & registry.py — agent registration, token budgets, and limits.' },
  { name: 'Memory Manager', role: 'manager.py & vector_store.py — ChromaDB vector retrieval & working memory.' },
  { name: 'Aggregator', role: 'aggregator.py — markdown synthesis of agent responses.' },
];

const roles = [
  {
    name: 'Planner',
    description: 'Decomposes complex goals into subtasks and coordinates task assignment.',
  },
  {
    name: 'Researcher',
    description: 'Gathers evidence, queries memory, and searches external resources.',
  },
  {
    name: 'Coder',
    description: 'Writes implementation code, documentation, and executes sandboxed tests.',
  },
  {
    name: 'Reviewer',
    description: 'Critiques code quality, safety, correctness, and goal alignment.',
  },
];

export function LandingPage() {
  const dashboard = useDashboard();
  const metrics = useMetrics();
  const [showTechDetails, setShowTechDetails] = useState(false);

  // Single health check state
  const isBackendHealthy = Boolean(dashboard.data?.online);
  const liveReady = Boolean(dashboard.data || metrics.data);

  // Log raw backend detail silently to developer console
  useEffect(() => {
    if (dashboard.data?.detail && !isBackendHealthy) {
      console.debug('[MARS Landing] Backend status detail:', dashboard.data.detail);
    }
  }, [dashboard.data, isBackendHealthy]);

  const snapshot = {
    modelName: dashboard.data?.model_name ?? 'Local snapshot',
    activeAgents: dashboard.data?.active_agents ?? 4,
    completedTasks: dashboard.data?.completed_tasks ?? 0,
    successRate: metrics.data?.success_rate ?? 1,
    latencyMs: dashboard.data?.latency_ms ?? metrics.data?.average_latency_ms ?? 0,
    totalRequests: metrics.data?.total_requests ?? 0,
    waitingAgents: dashboard.data?.waiting_agents ?? 0,
  };

  return (
    <main className="landing-page">
      <section className="landing-hero section-card">
        <div className="landing-hero-copy">
          <div className="eyebrow">Local-first multi-agent OS</div>
          <h1>MARS is an operating system for AI agents.</h1>
          <p className="landing-subhead">
            It routes requests, schedules specialized agents, manages memory, and delivers unified answers in a local dashboard.
          </p>

          <div className="landing-actions">
            <Link to="/app/tasks" className="primary-button landing-button">
              Open Task Console
            </Link>
            <Link to="/app/dashboard" className="secondary-button landing-button">
              View Dashboard
            </Link>
          </div>
        </div>

        <BootSequence />
      </section>

      {/* Simplified Plain-Language System Flow */}
      <section className="landing-section">
        <div className="section-head">
          <div>
            <div className="eyebrow">System flow</div>
            <h2>How a request moves through MARS.</h2>
          </div>
          <p className="muted">Five predictable steps from prompt to response.</p>
        </div>

        <div className="pipeline-grid">
          {plainLanguagePipeline.map((item) => (
            <div key={item.step} className="card pipeline-card">
              <div className="pipeline-index">{item.step}</div>
              <div className="pipeline-title">{item.title}</div>
              <p className="muted" style={{ fontSize: '0.84rem' }}>{item.description}</p>
            </div>
          ))}
        </div>

        {/* Collapsible Architecture Details Toggle */}
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowTechDetails(!showTechDetails)}
            className="secondary-button"
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            {showTechDetails ? 'Hide technical architecture' : 'Show technical architecture details (Internal Modules)'}
          </button>

          {showTechDetails ? (
            <div className="card" style={{ marginTop: '14px', background: 'var(--surface-raised)' }}>
              <div className="card-head">
                <h3>Kernel Abstractions & Classes</h3>
                <span className="card-subtitle">Source code mapping under mars/kernel/</span>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {technicalModules.map((mod) => (
                  <div key={mod.name} style={{ display: 'flex', gap: '12px', fontSize: '0.84rem' }}>
                    <span className="cell-mono" style={{ color: 'var(--accent)', fontWeight: 600, minWidth: '160px' }}>
                      {mod.name}
                    </span>
                    <span className="muted">{mod.role}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Clean Agent Role Cards without Noise Badges */}
      <section className="landing-section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Agent roles</div>
            <h2>Specialized AI agents working in concert.</h2>
          </div>
        </div>

        <div className="role-grid">
          {roles.map((role) => (
            <article key={role.name} className="card role-card">
              <div className="role-name" style={{ color: 'var(--accent)' }}>{role.name}</div>
              <p className="muted" style={{ fontSize: '0.86rem', margin: 0 }}>{role.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* System Snapshot with Calm Single Banner */}
      <section className="landing-section">
        <div className="section-head">
          <div>
            <div className="eyebrow">System snapshot</div>
            <h2>Operational overview at a glance.</h2>
          </div>
        </div>

        <div className="metrics-grid">
          <MetricCard label="Active Agents" value={String(snapshot.activeAgents)} detail="Planner, Researcher, Coder, Reviewer" />
          <MetricCard label="Tasks Completed" value={String(snapshot.completedTasks)} detail={`Queue waiting: ${snapshot.waitingAgents}`} />
          <MetricCard label="Success Rate" value={`${(snapshot.successRate * 100).toFixed(1)}%`} detail="Historical execution" />
          <MetricCard label="Average Latency" value={`${snapshot.latencyMs.toFixed(0)} ms`} detail={`${snapshot.totalRequests} total requests`} />
        </div>

        {!isBackendHealthy ? (
          <p className="muted" style={{ fontSize: '0.8rem', marginTop: '12px', fontStyle: 'italic' }}>
            Showing example data — connect a local LM Studio backend to view live system statistics.
          </p>
        ) : null}
      </section>

      <section className="landing-footer section-card">
        <div>
          <div className="eyebrow">Get started</div>
          <h2>Run a request in the console.</h2>
        </div>
        <Link to="/app/tasks" className="primary-button landing-button">
          Open Task Console
        </Link>
      </section>
    </main>
  );
}