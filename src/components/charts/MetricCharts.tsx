import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MetricsResponse } from '../../types';

export function MetricCharts({ metrics }: { metrics: MetricsResponse }) {
  const tokenPoints = metrics.tokens_over_time ?? [];
  const latencyPoints = metrics.latency_over_time ?? [];

  const hasEnoughTokenData = tokenPoints.length >= 3;
  const hasEnoughLatencyData = latencyPoints.length >= 3;

  return (
    <div className="two-up">
      <div className="card">
        <div className="card-head">
          <h2>Tokens Over Time</h2>
          <span className="card-subtitle">Cumulative token consumption</span>
        </div>

        {hasEnoughTokenData ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={tokenPoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--text-faint)" dataKey="ts" tickFormatter={(value: string | number) => new Date(value).toLocaleTimeString()} />
              <YAxis stroke="var(--text-faint)" />
              <Tooltip
                contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: '8px' }}
                labelFormatter={(value: string | number) => new Date(value).toLocaleTimeString()}
              />
              <Area type="monotone" dataKey="value" stroke="var(--accent)" fill="var(--accent-soft)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state" style={{ padding: '48px 20px' }}>
            <div className="empty-state-title">Not enough data yet</div>
            <p>Run a few tasks in the Task Console to populate token usage trends.</p>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-head">
          <h2>Latency Trend</h2>
          <span className="card-subtitle">Average latency per request (ms)</span>
        </div>

        {hasEnoughLatencyData ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={latencyPoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--text-faint)" dataKey="ts" tickFormatter={(value: string | number) => new Date(value).toLocaleTimeString()} />
              <YAxis stroke="var(--text-faint)" />
              <Tooltip
                contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: '8px' }}
                labelFormatter={(value: string | number) => new Date(value).toLocaleTimeString()}
              />
              <Line type="monotone" dataKey="value" stroke="var(--status-waiting)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state" style={{ padding: '48px 20px' }}>
            <div className="empty-state-title">Not enough data yet</div>
            <p>Run a few tasks in the Task Console to populate latency trends.</p>
          </div>
        )}
      </div>
    </div>
  );
}
