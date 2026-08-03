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

  return (
    <section className="page-stack">
      <div className="hero card">
        <div>
          <div className="eyebrow">Task Console</div>
          <h2>Submit a request and watch the pipeline stream live.</h2>
          <p className="muted">The console uses React Query polling for both task state and structured logs.</p>
        </div>
        <div className="hero-status">{activeTaskId ? `Task ${activeTaskId.slice(0, 8)}` : 'Idle'}</div>
      </div>

      <div className="card form-card">
        <label className="field-label" htmlFor="task-input">Request</label>
        <textarea id="task-input" value={text} onChange={(event) => setText(event.target.value)} rows={7} />
        <div className="actions-row">
          <button className="primary-button" onClick={submit} disabled={createTask.isPending || !text.trim()}>
            {createTask.isPending ? 'Submitting...' : 'Run Task'}
          </button>
          {task.isError ? <div className="error-box">{task.error.message}</div> : null}
        </div>
      </div>

      <div className="grid two-up">
        <div className="card content-card">
          <div className="card-head">
            <h2>Result</h2>
            <span className="muted">{isRunning ? 'Polling...' : task.data?.status ?? 'No task yet'}</span>
          </div>
          {task.isLoading ? <div className="skeleton">Waiting for task state...</div> : null}
          {result ? <ReactMarkdown>{result}</ReactMarkdown> : <p className="muted">No output yet.</p>}
        </div>

        <div className="card content-card">
          <div className="card-head">
            <h2>Live Log Feed</h2>
            <span className="muted">Structured events</span>
          </div>
          {logs.isLoading ? <div className="skeleton">Loading logs...</div> : null}
          {logs.data ? <LogFeed logs={logs.data} /> : null}
        </div>
      </div>
    </section>
  );
}
