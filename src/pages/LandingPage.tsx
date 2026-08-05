import { Link } from 'react-router-dom';
import { MetricCard } from '../components/MetricCard';
import { BootSequence } from '../components/BootSequence';
import { StateBadge } from '../components/StateBadge';
import { useDashboard, useMetrics } from '../hooks/usePlatformQueries';

const pipeline = [
  {
    title: 'IntentRouter',
    note: 'Classifies the request and picks the smallest pipeline that fits.',
  },
  {
    title: 'TaskScheduler',
    note: 'Creates AgentPCB entries, orders readiness, and tracks queue state.',
  },
  {
    title: 'AgentPCB + roles',
    note: 'Planner, Researcher, Coder, and Reviewer execute the plan.',
  },
  {
    title: 'Memory layer',
    note: 'Shared memory and long-term memory feed the next turn.',
  },
  {
    title: 'Aggregator',
    note: 'Combines the outputs into the final report for the user.',
  },
];

const roles = [
  {
    name: 'Planner',
    description:
      'Decomposes complex user goals into an ordered list of subtasks, assigning each to the right specialized role.',
  },
  {
    name: 'Researcher',
    description:
      'Gathers evidence, searches external resources and web sources, queries long-term memory, and synthesizes findings.',
  },
  {
    name: 'Coder',
    description:
      'Implements code solutions, writes documentation, creates or edits files, and runs sandbox verification.',
  },
  {
    name: 'Reviewer',
    description:
      'Critiques prior outputs and checks correctness, consistency, safety, and alignment to the user goal.',
  },
];

export function LandingPage() {
  const dashboard = useDashboard();
  const metrics = useMetrics();

  const snapshot = {
    modelName: dashboard.data?.model_name ?? 'Local snapshot',
    activeAgents: dashboard.data?.active_agents ?? 4,
    completedTasks: dashboard.data?.completed_tasks ?? 0,
    successRate: metrics.data?.success_rate ?? 1,
    latencyMs: dashboard.data?.latency_ms ?? metrics.data?.average_latency_ms ?? 0,
    totalRequests: metrics.data?.total_requests ?? 0,
    waitingAgents: dashboard.data?.waiting_agents ?? 0,
    detail: dashboard.data?.detail ?? (metrics.data?.total_requests ? 'Live API snapshot' : 'Backend offline. Showing static values.'),
  };

  const liveReady = Boolean(dashboard.data || metrics.data);

  return (
    <main className="landing-page">
      <section className="landing-hero section-card">
        <div className="landing-hero-copy">
          <div className="eyebrow">Local-first multi-agent OS</div>
          <h1>MARS is an operating system for AI agents.</h1>
          <p className="landing-subhead">
            It routes requests, schedules work, tracks agent state, stores memory, and assembles the final answer in one
            local dashboard.
          </p>

          <div className="landing-actions">
            <Link to="/app/dashboard" className="primary-button landing-button">
              Open Dashboard
            </Link>
            <Link to="/app/tasks" className="secondary-button landing-button">
              Open Task Console
            </Link>
          </div>
          <p className="landing-note muted">Same kernel. Same scheduler. Same dashboard screens used in the app.</p>
        </div>

        <BootSequence />
      </section>

      <section className="landing-section">
        <div className="section-head">
          <div>
            <div className="eyebrow">System flow</div>
            <h2>How a request moves through MARS.</h2>
          </div>
          <p className="muted">The route is real: router, scheduler, agent PCBs, memory, then aggregation.</p>
        </div>

        <div className="pipeline-grid">
          {pipeline.map((step, index) => (
            <div key={step.title} className="card pipeline-card">
              <div className="pipeline-index">0{index + 1}</div>
              <div className="pipeline-title">{step.title}</div>
              <p className="muted">{step.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Agent roles</div>
            <h2>The same four roles shown in the dashboard.</h2>
          </div>
        </div>

        <div className="role-grid">
          {roles.map((role) => (
            <article key={role.name} className="card role-card">
              <div className="role-card-head">
                <div className="role-name">{role.name}</div>
                <StateBadge state={role.name === 'Researcher' ? 'running' : role.name === 'Coder' ? 'waiting' : 'idle'} />
              </div>
              <p className="muted">{role.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Live system snapshot</div>
            <h2>Quiet stats from the running API.</h2>
          </div>
          <p className="muted">Falls back to static values if the backend is offline.</p>
        </div>

        <div className="grid snapshot-grid">
          <MetricCard label="Active agents" value={String(snapshot.activeAgents)} detail={snapshot.modelName} />
          <MetricCard label="Tasks completed" value={String(snapshot.completedTasks)} detail={`Waiting ${snapshot.waitingAgents}`} />
          <MetricCard label="Success rate" value={`${(snapshot.successRate * 100).toFixed(1)}%`} detail={snapshot.detail} />
          <MetricCard label="Latency" value={`${snapshot.latencyMs.toFixed(0)} ms`} detail={`${snapshot.totalRequests} requests`} />
        </div>

        {!liveReady ? <p className="muted landing-live-note">Backend unavailable. The page stays readable with static values.</p> : null}
      </section>

      <section className="landing-footer section-card">
        <div>
          <div className="eyebrow">Get started</div>
          <h2>Open the live dashboard.</h2>
        </div>
        <Link to="/app/dashboard" className="primary-button landing-button">
          Open Dashboard
        </Link>
      </section>
    </main>
  );
}