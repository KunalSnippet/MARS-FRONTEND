import { useQuery } from '@tanstack/react-query';
import { getAgentDetail, getAgentRuns } from '../api/agentDetail';

export function useAgentDetail(agentId: string | undefined) {
  return useQuery({
    queryKey: ['agent-detail', agentId],
    queryFn: () => getAgentDetail(agentId!),
    enabled: Boolean(agentId),
    refetchInterval: 3000,
  });
}

export function useAgentRuns(agentId: string | undefined) {
  return useQuery({
    queryKey: ['agent-runs', agentId],
    queryFn: () => getAgentRuns(agentId!),
    enabled: Boolean(agentId),
    refetchInterval: 3000,
  });
}
