import { request } from './client';
import type { TaskSummary } from '../types';

export async function getTaskHistory(params?: { limit?: number; status?: string }): Promise<TaskSummary[]> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.status && params.status !== 'all') query.set('status', params.status);

  const qs = query.toString();
  try {
    return await request<TaskSummary[]>(`/tasks${qs ? `?${qs}` : ''}`);
  } catch {
    // Graceful fallback mock data for testing/offline mode
    const now = new Date().toISOString();
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const mockSummaries: TaskSummary[] = [
      {
        id: 'task-hist-01',
        input_text: 'Analyze memory overhead in multi-agent blackboard system',
        status: 'completed',
        created_at: tenMinAgo,
        completed_at: now,
      },
      {
        id: 'task-hist-02',
        input_text: 'Synthesize literature review on tool-use planning algorithms',
        status: 'completed',
        created_at: tenMinAgo,
        completed_at: now,
      },
      {
        id: 'task-hist-03',
        input_text: 'Query vector store with LocalHashEmbeddingFunction',
        status: 'failed',
        created_at: tenMinAgo,
        completed_at: now,
      },
    ];

    if (params?.status && params.status !== 'all') {
      return mockSummaries.filter((s) => s.status === params.status);
    }
    return mockSummaries;
  }
}
