import type { LogEvent } from '../types';

export function LogFeed({ logs }: { logs: LogEvent[] }) {
  return (
    <div className="log-feed">
      {logs.map((log, index) => (
        <div key={`${log.ts}-${index}`} className={`log-line level-${log.level} stage-${log.stage}`}>
          <div className="log-meta">
            <span>{new Date(log.ts).toLocaleTimeString()}</span>
            <span>{log.stage}</span>
            <span>{log.level}</span>
            {log.agent ? <span>{log.agent}</span> : null}
          </div>
          <div className="log-message">{log.message}</div>
        </div>
      ))}
    </div>
  );
}
