import { useEffect, useRef, useState } from 'react';
import type { AgentState } from '../types';
import { StateBadge } from './StateBadge';

export function AgentTable({ agents }: { agents: AgentState[] }) {
  const prevAgentsRef = useRef<Record<string, string>>({});
  const [flashingIds, setFlashingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const updated: Record<string, boolean> = {};
    agents.forEach((agent) => {
      const prevKey = prevAgentsRef.current[agent.id];
      const currKey = `${agent.state}-${agent.calls_made}`;
      if (prevKey && prevKey !== currKey) {
        updated[agent.id] = true;
      }
      prevAgentsRef.current[agent.id] = currKey;
    });

    if (Object.keys(updated).length > 0) {
      setFlashingIds(updated);
      const timer = setTimeout(() => setFlashingIds({}), 300);
      return () => clearTimeout(timer);
    }
  }, [agents]);

  if (!agents || agents.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-state-title">No agents active</div>
        <p>No agent process control blocks are currently registered on the scheduler.</p>
      </div>
    );
  }

  return (
    <div className="card table-card">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Agent ID</th>
              <th>Role</th>
              <th>Status</th>
              <th>Calls Made</th>
              <th>Call Limit</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} className={flashingIds[agent.id] ? 'row-flash' : ''}>
                <td className="cell-mono" style={{ fontWeight: 600 }}>{agent.id}</td>
                <td style={{ textTransform: 'capitalize' }}>{agent.role}</td>
                <td><StateBadge state={agent.state} /></td>
                <td className="cell-mono">{agent.calls_made}</td>
                <td className="cell-mono">{agent.call_limit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
