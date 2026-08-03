import { request } from './client';
import type { AgentState } from '../types';

export function getAgents() {
  return request<AgentState[]>('/agents');
}
