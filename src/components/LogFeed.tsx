import type { LogEvent } from '../types';

export function LogFeed({ logs }: { logs: LogEvent[] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">No log events recorded</div>
        <p>Run a task in the console to stream live kernel events into this feed.</p>
      </div>
    );
  }

  return (
    <div className="log-feed">
      {logs.map((log, index) => (
        <div key={`${log.ts}-${index}`} className={`log-line level-${log.level} stage-${log.stage}`}>
          <div className="log-meta">
            <span>{new Date(log.ts).toLocaleTimeString()}</span>
            <span className="log-stage">[{log.stage}]</span>
            <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{log.level}</span>
            {log.agent ? <span style={{ color: 'var(--accent)' }}>@{log.agent}</span> : null}
          </div>
          <div className="log-message">{log.message}</div>
        </div>
      ))}
    </div>
  );
}
