import { useQuery } from '@tanstack/react-query';
import { getErrorEvents } from '../api/debugger';

export function useFailureDebugger(limit: number = 20) {
  return useQuery({
    queryKey: ['error-events', limit],
    queryFn: () => getErrorEvents(limit),
    refetchInterval: 4000,
  });
}
