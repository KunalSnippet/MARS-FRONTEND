import { request } from './client';
import type { MetricsResponse } from '../types';

export function getMetrics() {
  return request<MetricsResponse>('/metrics');
}
