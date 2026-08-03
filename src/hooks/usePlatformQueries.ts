import { useQuery } from '@tanstack/react-query';
import { getAgents } from '../api/agents';
import { getDashboard } from '../api/dashboard';
import { getMetrics } from '../api/metrics';

export function useAgents() {
  return useQuery({ queryKey: ['agents'], queryFn: getAgents, refetchInterval: 2000 });
}

export function useDashboard() {
  return useQuery({ queryKey: ['dashboard'], queryFn: getDashboard, refetchInterval: 2000 });
}

export function useMetrics() {
  return useQuery({ queryKey: ['metrics'], queryFn: getMetrics, refetchInterval: 4000 });
}
