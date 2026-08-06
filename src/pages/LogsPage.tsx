import { useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { getTaskLogs } from '../api/tasks';
import { LogFeed } from '../components/LogFeed';
import { useRecentTaskIds } from '../hooks/useRecentTaskIds';
import { LiveIndicator } from '../components/LiveIndicator';
import type { LogEvent } from '../types';

const stageOptions: Array<LogEvent['stage'] | 'all'> = [
  'all',
  'input',
  'classification',
  'routing',
  'session',
  'memory',
  'agent',
  'policy',
  'response',
  'raw',
];

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

  const isFetching = queries.some((q) => q.isFetching);
  const latestUpdatedAt = useMemo(() => {
    return Math.max(...queries.map((q) => q.dataUpdatedAt || 0), 0) || undefined;
  }, [queries]);

  const logs = useMemo(() => {
    return queries
      .flatMap((query) => query.data ?? [])
      .filter((item) => {
        const stageMatch = stage === 'all' || item.stage === stage;
        const levelMatch = level === 'all' || item.level === level;
        return stageMatch && levelMatch;
      });
  }, [queries, stage, level]);

  return (
    <section className="page-stack">
      <div className="page-header">
        <div className="page-header-content">
          <span className="page-eyebrow">Insights</span>
          <h1 className="page-title">Logs</h1>
          <p className="page-description">Cross-task event stream color-coded by severity level and pipeline stage.</p>
        </div>
        <LiveIndicator dataUpdatedAt={latestUpdatedAt} label={isFetching ? 'Streaming logs' : 'Idle'} />
      </div>

      <div className="card">
        <div className="filters-row">
          <label>
            Pipeline Stage
            <select value={stage} onChange={(event) => setStage(event.target.value as typeof stage)}>
              {stageOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            Log Level
            <select value={level} onChange={(event) => setLevel(event.target.value as typeof level)}>
              {levelOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {taskIds.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-title">No task history in browser</div>
          <p>Run a task in the Task Console to populate live cross-task logs.</p>
        </div>
      ) : (
        <div className="card">
          <LogFeed logs={logs} />
        </div>
      )}
    </section>
  );
}
