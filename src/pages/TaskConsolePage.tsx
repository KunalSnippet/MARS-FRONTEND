import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateTask, useTask, useTaskLogs } from '../hooks/useTaskStream';
import { useRecentTaskIds } from '../hooks/useRecentTaskIds';
import { LogFeed } from '../components/LogFeed';

export function TaskConsolePage() {
  const [text, setText] = useState('give me bad word');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const createTask = useCreateTask();
  const task = useTask(activeTaskId);
  const logs = useTaskLogs(activeTaskId);
  const { addTaskId } = useRecentTaskIds();

  const isRunning = task.data?.status === 'queued' || task.data?.status === 'running' || createTask.isPending;
  const result = useMemo(() => task.data?.result_markdown ?? '', [task.data?.result_markdown]);

  async function submit() {
    const response = await createTask.mutateAsync(text);
    setActiveTaskId(response.task_id);
    addTaskId(response.task_id);
    queryClient.invalidateQueries({ queryKey: ['task', response.task_id] });
    queryClient.invalidateQueries({ queryKey: ['task-logs', response.task_id] });
  }

  const taskSummary = useMemo(() => {
    if (!task.data) {
      return 'No task has been run yet.';
    }

    return [
      `Status: ${task.data.status}`,
      task.data.classification ? `Classification: ${task.data.classification}` : null,
      task.data.confidence !== null ? `Confidence: ${Math.round(task.data.confidence * 100)}%` : null,
      task.data.pipeline.length ? `Pipeline: ${task.data.pipeline.join(' → ')}` : null,
    ]
      .filter(Boolean)
      .join(' • ');
  }, [task.data]);

  return (
    <section className="page-stack">
      <div className="hero card hero-accent">
        <div>
          <div className="eyebrow">Task Console</div>
          <h2>Submit a request and watch the pipeline stream live.</h2>
          <p className="muted">The console polls the API for task state and structured logs. If a route ever fails, the error boundary keeps the app visible.</p>
        </div>
        <div className="hero-status">{activeTaskId ? `Task ${activeTaskId.slice(0, 8)}` : 'Idle'}</div>
      </div>

      <div className="grid two-up task-layout">
        <div className="card form-card task-panel">
          <div className="card-head">
            <h2>Request</h2>
            <span className="muted">Default text is ready to run</span>
          </div>
          <label className="field-label" htmlFor="task-input">Prompt</label>
          <textarea id="task-input" value={text} onChange={(event) => setText(event.target.value)} rows={10} />
          <div className="actions-row">
            <button className="primary-button" onClick={submit} disabled={createTask.isPending || !text.trim()}>
              {createTask.isPending ? 'Submitting...' : 'Run Task'}
            </button>
            {task.isError ? <div className="error-box">{task.error.message}</div> : null}
          </div>
        </div>

        <div className="card content-card task-panel">
          <div className="card-head">
            <h2>Task summary</h2>
            <span className="muted">{isRunning ? 'Polling...' : task.data?.status ?? 'No task yet'}</span>
          </div>
          {task.isLoading ? <div className="skeleton">Waiting for task state...</div> : null}
          <p className="muted">{taskSummary}</p>
          {result ? <ReactMarkdown>{result}</ReactMarkdown> : <p className="muted">No output yet.</p>}
        </div>

        <div className="card content-card task-panel task-span-full">
          <div className="card-head">
            <h2>Live Log Feed</h2>
            <span className="muted">Structured events from the backend</span>
          </div>
          {logs.isLoading ? <div className="skeleton">Loading logs...</div> : null}
          {logs.data && logs.data.length > 0 ? <LogFeed logs={logs.data} /> : <p className="muted">No logs yet. Run a task to populate this feed.</p>}
        </div>
      </div>
    </section>
  );
}
