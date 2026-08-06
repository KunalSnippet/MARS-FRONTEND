import { MetricCard } from '../components/MetricCard';
import { useDashboard } from '../hooks/usePlatformQueries';
import { LiveIndicator } from '../components/LiveIndicator';
import { StateBadge } from '../components/StateBadge';

export function ModelDashboardPage() {
  const dashboard = useDashboard();

  // Data level sanitization: Never pass raw exception messages into stat card values
  const isOnline = Boolean(dashboard.data?.online);
  const modelName = isOnline && dashboard.data?.model_name ? dashboard.data.model_name : 'LM Studio (Offline)';
  const modelDetail = isOnline ? 'Live local model server' : 'Local mock fallback active';

  return (
    <section className="page-stack">
      <div className="page-header">
        <div className="page-header-content">
          <span className="page-eyebrow">Insights</span>
          <h1 className="page-title">Model Dashboard</h1>
          <p className="page-description">Model status, queue counts, and task completion metrics.</p>
        </div>
        <LiveIndicator dataUpdatedAt={dashboard.dataUpdatedAt} />
      </div>

      {dashboard.isLoading ? (
        <div className="skeleton">Polling dashboard stats...</div>
      ) : null}

      {dashboard.isError ? (
        <div className="error-box card">
          <div>Unable to fetch model status.</div>
          <div className="error-retry-notice">Retrying automatically...</div>
        </div>
      ) : null}

      {dashboard.data ? (
        <div className="metrics-grid">
          <MetricCard
            label="Model Target"
            value={modelName}
            detail={modelDetail}
          />
          <div className="metric-card">
            <div className="metric-label">Model Server Status</div>
            <div style={{ marginTop: '2px' }}>
              <StateBadge state={isOnline ? 'ready' : 'idle'} />
            </div>
            <div className="metric-detail" style={{ marginTop: '4px' }}>
              {isOnline ? `Latency ~${dashboard.data.latency_ms.toFixed(0)} ms` : 'Backend offline'}
            </div>
          </div>
          <MetricCard label="Active Agents" value={String(dashboard.data.active_agents)} detail="Ready / Running" />
          <MetricCard label="Waiting Agents" value={String(dashboard.data.waiting_agents)} detail="Scheduler queue" />
          <MetricCard label="Tasks Completed" value={String(dashboard.data.completed_tasks)} detail="Successful runs" />
          <MetricCard label="Tasks Failed" value={String(dashboard.data.failed_tasks)} detail="Execution errors" />
        </div>
      ) : null}
    </section>
  );
}
