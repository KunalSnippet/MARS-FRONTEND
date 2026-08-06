import { MetricCard } from '../components/MetricCard';
import { MetricCharts } from '../components/charts/MetricCharts';
import { useMetrics } from '../hooks/usePlatformQueries';
import { LiveIndicator } from '../components/LiveIndicator';

export function AnalyticsPage() {
  const metrics = useMetrics();

  return (
    <section className="page-stack">
      <div className="page-header">
        <div className="page-header-content">
          <span className="page-eyebrow">Insights</span>
          <h1 className="page-title">Analytics</h1>
          <p className="page-description">Token usage, agent invocation counts, and latency trends.</p>
        </div>
        <LiveIndicator dataUpdatedAt={metrics.dataUpdatedAt} />
      </div>

      {metrics.isLoading ? (
        <div className="skeleton">Polling metrics snapshot...</div>
      ) : null}

      {metrics.isError ? (
        <div className="error-box card">
          <div>Failed to update analytics stream: {metrics.error.message}</div>
          <div className="error-retry-notice">Retrying poll every 4 seconds...</div>
        </div>
      ) : null}

      {metrics.data ? (
        <>
          <div className="metrics-grid">
            <MetricCard label="Total Tokens Consumed" value={metrics.data.total_tokens.toLocaleString()} />
            <MetricCard label="Average Latency" value={`${metrics.data.average_latency_ms.toFixed(0)} ms`} />
            <MetricCard label="Total Agent Requests" value={metrics.data.total_requests.toLocaleString()} />
            <MetricCard label="Success Rate" value={`${(metrics.data.success_rate * 100).toFixed(1)}%`} />
          </div>
          <MetricCharts metrics={metrics.data} />
        </>
      ) : null}
    </section>
  );
}
