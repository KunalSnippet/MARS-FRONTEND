import type { AgentState } from '../types';
import { StateBadge } from './StateBadge';

export function AgentTable({ agents }: { agents: AgentState[] }) {
  return (
    <div className="card table-card">
      <div className="card-head">
        <h2>Agent Monitor</h2>
        <p className="muted">Live PCB snapshot from the scheduler.</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Role</th>
            <th>Status</th>
            <th>Calls</th>
            <th>Limit</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id}>
              <td>{agent.id}</td>
              <td>{agent.role}</td>
              <td><StateBadge state={agent.state} /></td>
              <td>{agent.calls_made}</td>
              <td>{agent.call_limit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
