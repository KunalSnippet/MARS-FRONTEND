import { request } from './client';
import type { LogEvent, TaskRecord } from '../types';

export function createTask(text: string) {
  return request<{ task_id: string; status: string }>('/tasks', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export function getTask(taskId: string) {
  return request<TaskRecord>(`/tasks/${taskId}`);
}

export function getTaskLogs(taskId: string) {
  return request<LogEvent[]>(`/tasks/${taskId}/logs`);
}
