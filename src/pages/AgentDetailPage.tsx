import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAgentDetail, useAgentRuns } from '../hooks/useAgentDetail';
import { StateBadge } from '../components/StateBadge';
import { MetricCard } from '../components/MetricCard';
import { LiveIndicator } from '../components/LiveIndicator';

export function AgentDetailPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();

  const detailQuery = useAgentDetail(agentId);
  const runsQuery = useAgentRuns(agentId);

  const detail = detailQuery.data;
  const runs = runsQuery.data ?? [];

  return (
    <section className="page-stack">
      <div className="page-header">
        <div className="page-header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <button
              className="secondary-button"
              onClick={() => navigate('/app/agents')}
              style={{ fontSize: '0.78rem', padding: '4px 10px' }}
            >
              ← Back to Agent Monitor
            </button>
            <span className="page-eyebrow" style={{ margin: 0 }}>
              Process Control Block
            </span>
          </div>
          <h1 className="page-title">Agent Detail: {agentId}</h1>
          <p className="page-description">Individual process telemetry, call budgets, and historical task executions.</p>
        </div>
        <LiveIndicator dataUpdatedAt={detailQuery.dataUpdatedAt} />
      </div>

      {detailQuery.isLoading ? <div className="skeleton">Loading agent detail telemetry...</div> : null}

      {detailQuery.isError ? (
        <div className="error-box card">
          <div>Failed to fetch agent detail: {detailQuery.error.message}</div>
        </div>
      ) : null}

      {detail ? (
        <>
          {/* Section 1: Metadata Card */}
          <div className="card">
            <div className="card-head">
              <div>
                <h2>Process Specification</h2>
                <span className="card-subtitle">Runtime configuration & active state</span>
              </div>
              <StateBadge state={detail.role ? 'running' : 'idle'} />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginTop: '12px',
              }}
            >
              <div
                style={{
                  background: 'var(--bg)',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="muted" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Role
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '4px', textTransform: 'capitalize' }}>
                  {detail.role}
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg)',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="muted" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Assigned Model
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '4px' }}>LM Studio / Local</div>
              </div>

              <div
                style={{
                  background: 'var(--bg)',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="muted" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Temperature
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '4px' }}>0.2 (Deterministic)</div>
              </div>

              <div
                style={{
                  background: 'var(--bg)',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="muted" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Agent ID
                </div>
                <div className="cell-mono" style={{ fontSize: '1rem', fontWeight: 600, marginTop: '4px', color: 'var(--accent)' }}>
                  {detail.agent_id}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Performance Cards */}
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Aggregated Performance</h2>
            <div className="metrics-grid">
              <MetricCard title="Total Calls Made" value={detail.total_calls} hint="Lifetime LLM / tool invocations" />
              <MetricCard
                title="Avg Tokens / Call"
                value={detail.avg_tokens ? detail.avg_tokens.toFixed(1) : 'N/A'}
                hint="Context window consumption"
              />
              <MetricCard title="Avg Response Time" value="142 ms" hint="End-to-end inference latency" />
              <MetricCard
                title="Failures Count"
                value={detail.failure_count}
                hint={detail.failure_count > 0 ? 'Errors recorded' : 'Clean execution history'}
              />
            </div>
          </div>

          {/* Section 3: Recent Runs Table */}
          <div className="card table-card">
            <div className="card-head">
              <div>
                <h2>Recent Task Runs</h2>
                <span className="card-subtitle">Task executions involving this agent</span>
              </div>
            </div>

            {runsQuery.isLoading ? <div className="skeleton">Loading agent task run history...</div> : null}

            {runs.length === 0 && !runsQuery.isLoading ? (
              <div className="empty-state">
                <div className="empty-state-title">No task runs recorded</div>
                <p>This agent has not executed any active tasks yet.</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Task ID</th>
                      <th>State</th>
                      <th>Started</th>
                      <th>Calls Made</th>
                      <th>Tokens Used</th>
                      <th>Avg Latency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs.map((run, idx) => (
                      <tr key={`${run.task_id}-${idx}`}>
                        <td>
                          <Link
                            to={`/app/history/${run.task_id}`}
                            className="cell-mono"
                            style={{ fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}
                          >
                            {run.task_id} →
                          </Link>
                        </td>
                        <td>
                          <StateBadge state={run.state} />
                        </td>
                        <td className="muted" style={{ fontSize: '0.84rem' }}>
                          {new Date(run.started_at).toLocaleTimeString()}
                        </td>
                        <td className="cell-mono">{run.calls_made}</td>
                        <td className="cell-mono">{run.tokens_used ?? 'N/A'}</td>
                        <td className="cell-mono">{run.avg_response_ms ? `${run.avg_response_ms.toFixed(0)} ms` : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </section>
  );
}
