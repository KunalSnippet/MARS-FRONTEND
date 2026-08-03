import { useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { getTaskLogs } from '../api/tasks';
import { LogFeed } from '../components/LogFeed';
import { useRecentTaskIds } from '../hooks/useRecentTaskIds';
import type { LogEvent } from '../types';

const stageOptions: Array<LogEvent['stage'] | 'all'> = ['all', 'input', 'classification', 'routing', 'session', 'memory', 'agent', 'policy', 'response', 'raw'];
const levelOptions: Array<LogEvent['level'] | 'all'> = ['all', 'info', 'warning', 'error'];

export function LogsPage() {
  const { taskIds } = useRecentTaskIds();
  const [stage, setStage] = useState<(typeof stageOptions)[number]>('all');
  const [level, setLevel] = useState<(typeof levelOptions)[number]>('all');

  const queries = useQueries({
    queries: taskIds.slice(0, 6).map((taskId) => ({
      queryKey: ['task-logs', taskId],
      queryFn: () => getTaskLogs(taskId),
      refetchInterval: 2000,
    })),
  });

  const logs = useMemo(() => {
    return queries.flatMap((query) => query.data ?? []).filter((item) => {
      const stageMatch = stage === 'all' || item.stage === stage;
      const levelMatch = level === 'all' || item.level === level;
      return stageMatch && levelMatch;
    });
  }, [queries, stage, level]);

  return (
    <section className="page-stack">
      <div className="hero card">
        <div>
          <div className="eyebrow">Logs</div>
          <h2>Cross-task event stream.</h2>
          <p className="muted">Filters apply across the recent task history stored in the browser.</p>
        </div>
      </div>

      <div className="card form-card">
        <div className="filters-row">
          <label>
            Stage
            <select value={stage} onChange={(event) => setStage(event.target.value as typeof stage)}>
              {stageOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label>
            Level
            <select value={level} onChange={(event) => setLevel(event.target.value as typeof level)}>
              {levelOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        </div>
      </div>

      {taskIds.length === 0 ? <div className="card skeleton">Run a task to populate recent logs.</div> : null}
      <div className="card content-card">
        <LogFeed logs={logs} />
      </div>
    </section>
  );
}
