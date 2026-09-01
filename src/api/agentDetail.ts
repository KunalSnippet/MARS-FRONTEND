import { request } from './client';
import type { AgentDetail, AgentRun } from '../types';

export function getAgentDetail(agentId: string) {
  return request<AgentDetail>(`/agents/${agentId}`);
}

export function getAgentRuns(agentId: string, taskId?: string) {
  const query = taskId ? `?task_id=${taskId}` : '';
  return request<AgentRun[]>(`/agents/${agentId}/runs${query}`);
}
