import { useQuery } from '@tanstack/react-query';
import { getTaskHistory } from '../api/history';

export function useTaskHistory(params?: { limit?: number; status?: string }) {
  return useQuery({
    queryKey: ['task-history', params],
    queryFn: () => getTaskHistory(params),
    refetchInterval: 5000,
  });
}
