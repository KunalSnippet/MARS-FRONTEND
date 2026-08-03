import { MetricCard } from '../components/MetricCard';
import { useDashboard } from '../hooks/usePlatformQueries';

export function ModelDashboardPage() {
  const dashboard = useDashboard();

  return (
    <section className="page-stack">
      <div className="hero card">
        <div>
          <div className="eyebrow">Model Dashboard</div>
          <h2>Operational health at a glance.</h2>
          <p className="muted">Model status, queue counts, and completed totals from the API.</p>
        </div>
      </div>

      {dashboard.isLoading ? <div className="card skeleton">Loading dashboard...</div> : null}
      {dashboard.data ? (
        <div className="grid metrics-grid">
          <MetricCard label="Model" value={dashboard.data.model_name} detail={dashboard.data.detail ?? undefined} />
          <MetricCard label="Status" value={dashboard.data.online ? 'Online' : 'Offline'} detail={`Latency ${dashboard.data.latency_ms.toFixed(0)} ms`} />
          <MetricCard label="Active Agents" value={String(dashboard.data.active_agents)} />
          <MetricCard label="Waiting Agents" value={String(dashboard.data.waiting_agents)} />
          <MetricCard label="Completed" value={String(dashboard.data.completed_tasks)} />
          <MetricCard label="Failed" value={String(dashboard.data.failed_tasks)} />
        </div>
      ) : null}
      {dashboard.isError ? <div className="card error-box">{dashboard.error.message}</div> : null}
    </section>
  );
}
