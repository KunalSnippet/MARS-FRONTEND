import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, getTask, getTaskLogs } from '../api/tasks';

export function useCreateTask() {
  return useMutation({ mutationFn: createTask });
}

export function useTask(taskId: string | null) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTask(taskId as string),
    enabled: Boolean(taskId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'completed' || status === 'failed' ? false : 2000;
    },
  });
}

export function useTaskLogs(taskId: string | null) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['task-logs', taskId],
    queryFn: () => getTaskLogs(taskId as string),
    enabled: Boolean(taskId),
    refetchInterval: (query) => {
      const status =
        query.state.data?.status ?? queryClient.getQueryData<{ status?: string }>(['task', taskId])?.status;
      return status === 'completed' || status === 'failed' ? false : 2000;
    },
  });
}
