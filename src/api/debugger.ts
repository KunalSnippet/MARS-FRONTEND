import { request } from './client';
import type { ErrorEvent } from '../types';

export function getErrorEvents(limit: number = 20) {
  return request<ErrorEvent[]>(`/events/errors?limit=${limit}`);
}
