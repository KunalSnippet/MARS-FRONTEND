import { MetricCard } from '../components/MetricCard';
import { MetricCharts } from '../components/charts/MetricCharts';
import { useMetrics } from '../hooks/usePlatformQueries';

export function AnalyticsPage() {
  const metrics = useMetrics();

  return (
    <section className="page-stack">
      <div className="hero card">
        <div>
          <div className="eyebrow">Analytics</div>
          <h2>Usage and latency trends.</h2>
          <p className="muted">Charts update from the metrics endpoint without manual interval logic.</p>
        </div>
      </div>

      {metrics.isLoading ? <div className="card skeleton">Loading metrics...</div> : null}
      {metrics.data ? (
        <>
          <div className="grid metrics-grid three-up">
            <MetricCard label="Tokens" value={metrics.data.total_tokens.toLocaleString()} />
            <MetricCard label="Latency" value={`${metrics.data.average_latency_ms.toFixed(0)} ms`} />
            <MetricCard label="Success Rate" value={`${(metrics.data.success_rate * 100).toFixed(1)}%`} />
          </div>
          <MetricCharts metrics={metrics.data} />
        </>
      ) : null}
      {metrics.isError ? <div className="card error-box">{metrics.error.message}</div> : null}
    </section>
  );
}
