import { AgentTable } from '../components/AgentTable';
import { useAgents } from '../hooks/usePlatformQueries';

export function AgentMonitorPage() {
  const agents = useAgents();

  return (
    <section className="page-stack">
      <div className="hero card">
        <div>
          <div className="eyebrow">Agent Monitor</div>
          <h2>Follow the scheduler's PCB snapshot.</h2>
          <p className="muted">Polls every two seconds and shows current queue state for each agent.</p>
        </div>
      </div>
      {agents.isLoading ? <div className="card skeleton">Loading agents...</div> : null}
      {agents.data ? <AgentTable agents={agents.data} /> : null}
      {agents.isError ? <div className="card error-box">{agents.error.message}</div> : null}
    </section>
  );
}
