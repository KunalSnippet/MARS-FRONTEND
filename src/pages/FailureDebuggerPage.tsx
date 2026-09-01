import { Link } from 'react-router-dom';
import { useFailureDebugger } from '../hooks/useFailureDebugger';
import { StateBadge } from '../components/StateBadge';
import { LiveIndicator } from '../components/LiveIndicator';

export function FailureDebuggerPage() {
  const errorsQuery = useFailureDebugger();

  const errors = errorsQuery.data ?? [];

  return (
    <section className="page-stack">
      <div className="page-header">
        <div className="page-header-content">
          <span className="page-eyebrow">System Diagnostics</span>
          <h1 className="page-title">Failure Debugger</h1>
          <p className="page-description">Automated root-cause analysis, pattern matching, and fix suggestions for agent errors.</p>
        </div>
        <LiveIndicator dataUpdatedAt={errorsQuery.dataUpdatedAt} />
      </div>

      {errorsQuery.isLoading ? <div className="skeleton">Scanning task event logs for failure patterns...</div> : null}

      {errorsQuery.isError ? (
        <div className="error-box card">
          <div>Failed to fetch error diagnostics: {errorsQuery.error.message}</div>
        </div>
      ) : null}

      {errors.length === 0 && !errorsQuery.isLoading ? (
        <div className="card empty-state">
          <div className="empty-state-title">Zero failures recorded</div>
          <p>All active and past multi-agent task runs have executed cleanly without kernel exceptions.</p>
        </div>
      ) : (
        <div className="page-stack">
          {errors.map((err, idx) => (
            <div key={`${err.task_id}-${idx}`} className="card" style={{ borderLeft: '4px solid var(--badge-failed-bg)' }}>
              <div className="card-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <StateBadge state="failed" />
                  <span className="cell-mono" style={{ fontWeight: 600, color: 'var(--accent)' }}>
                    Task #{err.task_id}
                  </span>
                  {err.agent ? (
                    <span style={{ color: 'var(--accent)', fontSize: '0.86rem', fontWeight: 500 }}>@{err.agent}</span>
                  ) : null}
                  <span className="log-stage">[{err.stage}]</span>
                </div>
                <span className="muted" style={{ fontSize: '0.82rem' }}>
                  {new Date(err.ts).toLocaleString()}
                </span>
              </div>

              <div style={{ marginTop: '12px' }}>
                <div className="muted" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                  Originating Task Prompt:
                </div>
                <div
                  style={{
                    background: 'var(--bg)',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    fontSize: '0.9rem',
                    marginTop: '4px',
                    marginBottom: '14px',
                  }}
                >
                  {err.input_text}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Raw Error Trace */}
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: '8px',
                      padding: '14px',
                    }}
                  >
                    <div
                      style={{
                        color: 'var(--badge-failed-bg)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}
                    >
                      Recorded Exception Message
                    </div>
                    <div className="cell-mono" style={{ fontSize: '0.86rem', color: '#fca5a5', lineHeight: '1.5' }}>
                      {err.message}
                    </div>
                  </div>

                  {/* Automated Suggested Fix */}
                  <div
                    style={{
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      borderRadius: '8px',
                      padding: '14px',
                    }}
                  >
                    <div
                      style={{
                        color: 'var(--accent)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}
                    >
                      Automated Suggested Fix
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--fg)', lineHeight: '1.5' }}>{err.suggested_fix}</div>
                  </div>
                </div>

                <div className="actions-row" style={{ marginTop: '16px', justifyContent: 'flex-end' }}>
                  <Link
                    to={`/app/history/${err.task_id}`}
                    className="secondary-button"
                    style={{ fontSize: '0.8rem', textDecoration: 'none' }}
                  >
                    Inspect Full Task Execution Trace →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
