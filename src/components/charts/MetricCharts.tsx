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
  return (
    <div className="grid two-up">
      <div className="card chart-card">
        <h2>Tokens Over Time</h2>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={metrics.tokens_over_time}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ts" tickFormatter={(value: string | number) => new Date(value).toLocaleTimeString()} />
            <YAxis />
            <Tooltip labelFormatter={(value: string | number) => new Date(value).toLocaleTimeString()} />
            <Area type="monotone" dataKey="value" stroke="var(--accent-1)" fill="var(--accent-1-soft)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card chart-card">
        <h2>Latency Trend</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={metrics.latency_over_time}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ts" tickFormatter={(value: string | number) => new Date(value).toLocaleTimeString()} />
            <YAxis />
            <Tooltip labelFormatter={(value: string | number) => new Date(value).toLocaleTimeString()} />
            <Line type="monotone" dataKey="value" stroke="var(--accent-2)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
