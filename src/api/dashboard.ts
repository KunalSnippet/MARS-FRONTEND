import { request } from './client';
import type { DashboardResponse } from '../types';

export function getDashboard() {
  return request<DashboardResponse>('/dashboard');
}
