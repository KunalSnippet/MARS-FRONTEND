import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTaskHistory } from '../hooks/useTaskHistory';
import { useTask, useTaskLogs } from '../hooks/useTaskStream';
import { StateBadge } from '../components/StateBadge';
import { LogFeed } from '../components/LogFeed';
import { LiveIndicator } from '../components/LiveIndicator';

function formatDuration(createdAt: string, completedAt: string | null): string {
  if (!completedAt) return 'Running / In Progress';
  const start = new Date(createdAt).getTime();
  const end = new Date(completedAt).getTime();
  if (isNaN(start) || isNaN(end)) return 'N/A';
  const diffSec = (end - start) / 1000;
  if (diffSec < 0) return '0.0s';
  if (diffSec < 60) return `${diffSec.toFixed(1)}s`;
  const mins = Math.floor(diffSec / 60);
  const secs = Math.floor(diffSec % 60);
  return `${mins}m ${secs}s`;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function TaskHistoryPage() {
  const { taskId: routeTaskId } = useParams<{ taskId?: string }>();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const historyQuery = useTaskHistory({ status: selectedStatus });
  const selectedTaskId = routeTaskId || null;

  // Selected task detail & logs
  const taskDetail = useTask(selectedTaskId);
  const taskLogs = useTaskLogs(selectedTaskId);

  const filteredTasks = useMemo(() => {
    if (!historyQuery.data) return [];
    return historyQuery.data.filter((item) => {
      if (searchQuery.trim() === '') return true;
      return item.input_text.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [historyQuery.data, searchQuery]);

  return (
    <section className="page-stack">
      <div className="page-header">
        <div className="page-header-content">
          <span className="page-eyebrow">Operate</span>
          <h1 className="page-title">Task History</h1>
          <p className="page-description">Persisted audit record of all past multi-agent execution runs and responses.</p>
        </div>
        <LiveIndicator dataUpdatedAt={historyQuery.dataUpdatedAt} />
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search tasks by prompt or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--fg)',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="muted" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
              Status Filter:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['all', 'completed', 'failed', 'running', 'queued'].map((status) => (
                <button
                  key={status}
                  className={selectedStatus === status ? 'primary-button' : 'secondary-button'}
                  onClick={() => setSelectedStatus(status)}
                  style={{
                    fontSize: '0.78rem',
                    padding: '5px 12px',
                    textTransform: 'capitalize',
                    borderRadius: '6px',
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Task Table + Selected Detail */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedTaskId ? '1fr 1fr' : '1fr', gap: '20px' }}>
        {/* Table View */}
        <div className="card table-card">
          <div className="card-head">
            <div>
              <h2>Executions ({filteredTasks.length})</h2>
              <span className="card-subtitle">Click a row to inspect full output & log trace</span>
            </div>
          </div>

          {historyQuery.isLoading ? <div className="skeleton">Loading task history records...</div> : null}

          {historyQuery.isError ? (
            <div className="error-box" style={{ margin: '16px' }}>
              <div>Unable to fetch task history</div>
            </div>
          ) : null}

          {filteredTasks.length === 0 && !historyQuery.isLoading ? (
            <div className="empty-state">
              <div className="empty-state-title">No tasks found</div>
              <p>No tasks match the active filter or search query.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Prompt Preview</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t) => {
                    const isSelected = selectedTaskId === t.id;
                    const truncatedPrompt = t.input_text.length > 70 ? `${t.input_text.slice(0, 70)}...` : t.input_text;
                    return (
                      <tr
                        key={t.id}
                        onClick={() => navigate(`/app/history/${t.id}`)}
                        style={{
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(56, 189, 248, 0.08)' : undefined,
                        }}
                      >
                        <td className="cell-mono" style={{ fontWeight: 600, color: 'var(--accent)' }}>
                          {t.id.slice(0, 12)}
                        </td>
                        <td title={t.input_text}>{truncatedPrompt}</td>
                        <td>
                          <StateBadge state={t.status} />
                        </td>
                        <td className="muted" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                          {formatRelativeTime(t.created_at)}
                        </td>
                        <td className="cell-mono" style={{ fontSize: '0.82rem' }}>
                          {formatDuration(t.created_at, t.completed_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedTaskId ? (
          <div className="page-stack">
            <div className="card">
              <div className="card-head">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2>Task Detail</h2>
                    <span className="cell-mono" style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>
                      #{selectedTaskId}
                    </span>
                  </div>
                  <span className="card-subtitle">Stored result markdown & metadata</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {taskDetail.data?.status ? <StateBadge state={taskDetail.data.status} /> : null}
                  <button
                    className="secondary-button"
                    onClick={() => navigate('/app/history')}
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    Close
                  </button>
                </div>
              </div>

              {taskDetail.isLoading ? <div className="skeleton">Loading task detail...</div> : null}

              {taskDetail.data ? (
                <div style={{ marginTop: '12px' }}>
                  <div className="muted" style={{ fontSize: '0.82rem', marginBottom: '8px', fontWeight: 600 }}>
                    ORIGINATING PROMPT:
                  </div>
                  <div
                    style={{
                      background: 'var(--bg)',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      fontSize: '0.9rem',
                      marginBottom: '16px',
                    }}
                  >
                    {taskDetail.data.text}
                  </div>

                  <div className="muted" style={{ fontSize: '0.82rem', marginBottom: '8px', fontWeight: 600 }}>
                    SYNTHESIZED RESULT:
                  </div>
                  {taskDetail.data.result_markdown ? (
                    <div style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                      <ReactMarkdown>{taskDetail.data.result_markdown}</ReactMarkdown>
                    </div>
                  ) : taskDetail.data.error ? (
                    <div className="error-box">
                      <div style={{ fontWeight: 600 }}>Execution Error:</div>
                      <div>{taskDetail.data.error}</div>
                    </div>
                  ) : (
                    <div className="muted">Task is still running or no output generated.</div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Log feed component */}
            <div className="card">
              <div className="card-head">
                <div>
                  <h2>Event Stream</h2>
                  <span className="card-subtitle">Recorded kernel & agent log events for this task</span>
                </div>
              </div>
              {taskLogs.isLoading ? <div className="skeleton">Loading event logs...</div> : null}
              {taskLogs.data ? <LogFeed logs={taskLogs.data} /> : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
