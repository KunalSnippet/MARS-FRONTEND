import { request } from './client';
import type { HealthResponse } from '../types';

export function getHealth() {
  return request<HealthResponse>('/health');
}