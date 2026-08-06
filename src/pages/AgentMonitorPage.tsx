import { AgentTable } from '../components/AgentTable';
import { useAgents } from '../hooks/usePlatformQueries';
import { LiveIndicator } from '../components/LiveIndicator';

export function AgentMonitorPage() {
  const agents = useAgents();

  return (
    <section className="page-stack">
      <div className="page-header">
        <div className="page-header-content">
          <span className="page-eyebrow">Operate</span>
          <h1 className="page-title">Agent Monitor</h1>
          <p className="page-description">Real-time Process Control Block (PCB) process states and tool token budgets.</p>
        </div>
        <LiveIndicator dataUpdatedAt={agents.dataUpdatedAt} />
      </div>

      {agents.isLoading ? (
        <div className="skeleton">Polling scheduler PCB state...</div>
      ) : null}

      {agents.isError ? (
        <div className="error-box card">
          <div>Failed to fetch agent PCB table: {agents.error.message}</div>
          <div className="error-retry-notice">Retrying poll every 2 seconds...</div>
        </div>
      ) : null}

      {agents.data ? <AgentTable agents={agents.data} /> : null}
    </section>
  );
}
