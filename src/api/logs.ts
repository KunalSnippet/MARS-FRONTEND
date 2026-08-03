import { getTaskLogs } from './tasks';

export function getRecentLogs(taskIds: string[]) {
  return Promise.all(taskIds.map((taskId) => getTaskLogs(taskId)));
}
