import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateTask, useTask, useTaskLogs } from '../hooks/useTaskStream';
import { useRecentTaskIds } from '../hooks/useRecentTaskIds';
import { LogFeed } from '../components/LogFeed';
import { StateBadge } from '../components/StateBadge';
import { LiveIndicator } from '../components/LiveIndicator';

export function TaskConsolePage() {
  const [text, setText] = useState('');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [showLogsManually, setShowLogsManually] = useState(false);

  const queryClient = useQueryClient();
  const createTask = useCreateTask();
  const task = useTask(activeTaskId);
  const logs = useTaskLogs(activeTaskId);
  const { addTaskId } = useRecentTaskIds();

  const isRunning = task.data?.status === 'queued' || task.data?.status === 'running' || createTask.isPending;
  const hasTaskRun = Boolean(activeTaskId || task.data || createTask.isPending);
  const result = useMemo(() => task.data?.result_markdown ?? '', [task.data?.result_markdown]);

  async function submit() {
    if (!text.trim() || createTask.isPending) return;
    const response = await createTask.mutateAsync(text);
    setActiveTaskId(response.task_id);
    addTaskId(response.task_id);
    queryClient.invalidateQueries({ queryKey: ['task', response.task_id] });
    queryClient.invalidateQueries({ queryKey: ['task-logs', response.task_id] });
  }

  const pipelineBadge = useMemo(() => {
    if (!task.data?.pipeline || task.data.pipeline.length === 0) return null;
    return task.data.pipeline.join(' → ');
  }, [task.data?.pipeline]);

  return (
    <section className="page-stack">
      <div className="page-header">
        <div className="page-header-content">
          <span className="page-eyebrow">Task Console</span>
          <h1 className="page-title">What would you like MARS to do?</h1>
          <p className="page-description">Orchestrate specialized agents locally for research, coding, and multi-step tasks.</p>
        </div>
        {hasTaskRun ? <LiveIndicator dataUpdatedAt={task.dataUpdatedAt} label={isRunning ? 'Processing...' : 'Complete'} /> : null}
      </div>

      {/* Prominent Chat-App Style Input Bar */}
      <div className="card" style={{ padding: '24px' }}>
        <textarea
          id="task-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={4}
          placeholder="Ask MARS to research, write, or build something..."
          style={{
            fontSize: '0.96rem',
            borderRadius: '10px',
            padding: '16px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
        />

        <div className="actions-row" style={{ justifyContent: 'space-between', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="primary-button" onClick={submit} disabled={createTask.isPending || !text.trim()}>
              {createTask.isPending ? 'Routing task...' : 'Run Task'}
            </button>
            <span className="muted" style={{ fontSize: '0.78rem' }}>
              Press Ctrl+Enter to run
            </span>
          </div>

          {!hasTaskRun ? (
            <button
              className="secondary-button"
              onClick={() => setShowLogsManually(!showLogsManually)}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              {showLogsManually ? 'Hide inspection feed' : 'Inspect live event feed'}
            </button>
          ) : null}
        </div>

        {createTask.isError ? (
          <div className="error-box" style={{ marginTop: '14px' }}>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>
              {createTask.error.message.includes('Failed to fetch')
                ? 'Backend Offline (Cannot connect to http://localhost:8000)'
                : `Task submission error: ${createTask.error.message}`}
            </div>
            <div className="error-retry-notice">
              {createTask.error.message.includes('Failed to fetch')
                ? 'Your Python backend server is not running. Please open a terminal in MARS-BE and run: python -m uvicorn api.main:app --reload --port 8000'
                : 'Check local server connection and try again.'}
            </div>
          </div>
        ) : null}
      </div>

      {/* Progressive Disclosure: Output, Pipeline Summary, and Logs only reveal when active */}
      {hasTaskRun ? (
        <div className="page-stack">
          {/* Response Output Panel */}
          <div className="card">
            <div className="card-head">
              <div>
                <h2>Task Result</h2>
                {pipelineBadge ? (
                  <span className="card-subtitle">Pipeline: {pipelineBadge}</span>
                ) : (
                  <span className="card-subtitle">Synthesized output</span>
                )}
              </div>
              {task.data?.status ? <StateBadge state={task.data.status} /> : null}
            </div>

            {task.isLoading ? (
              <div className="skeleton">Orchestrating agents and generating response...</div>
            ) : null}

            {task.isError ? (
              <div className="error-box">
                <div>Unable to retrieve task response.</div>
                <div className="error-retry-notice">Retrying automatically...</div>
              </div>
            ) : null}

            {result ? (
              <div style={{ fontSize: '0.94rem', lineHeight: '1.6', marginTop: '8px' }}>
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : null}
          </div>

          {/* Structured Event Stream */}
          <div className="card">
            <div className="card-head">
              <div>
                <h2>Live Event Stream</h2>
                <span className="card-subtitle">Kernel logs & agent execution events</span>
              </div>
            </div>

            {logs.isLoading ? <div className="skeleton">Streaming log events...</div> : null}
            {logs.data ? <LogFeed logs={logs.data} /> : null}
          </div>
        </div>
      ) : showLogsManually ? (
        <div className="card">
          <div className="card-head">
            <div>
              <h2>Live Event Stream</h2>
              <span className="card-subtitle">Recent task log history</span>
            </div>
          </div>
          {logs.data ? <LogFeed logs={logs.data} /> : <div className="muted">No task logs recorded yet.</div>}
        </div>
      ) : null}
    </section>
  );
}
