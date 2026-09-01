export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed';

export type LogEvent = {
  ts: string;
  stage: 'input' | 'classification' | 'routing' | 'session' | 'memory' | 'agent' | 'policy' | 'response' | 'raw';
  level: 'info' | 'warning' | 'error';
  agent: string | null;
  message: string;
  meta: Record<string, unknown>;
};

export type TaskRecord = {
  task_id: string;
  text: string;
  status: TaskStatus;
  classification: string | null;
  confidence: number | null;
  pipeline: string[];
  result_markdown: string | null;
  error: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
};

export type AgentState = {
  id: string;
  role: string;
  state: string;
  calls_made: number;
  call_limit: number;
  last_updated: string;
};

export type DashboardResponse = {
  model_name: string;
  online: boolean;
  latency_ms: number;
  active_agents: number;
  waiting_agents: number;
  completed_tasks: number;
  failed_tasks: number;
  detail: string | null;
};

export type HealthResponse = {
  status: 'ok';
  requested_mode: 'auto' | 'mock' | 'real';
  runtime_mode: 'mock' | 'real';
  mock_mode: boolean;
  real_mode_ready: boolean;
  model_server_healthy: boolean | null;
  model_server_detail: string | null;
  model_server_models: string[];
  kernel_import_error: string | null;
};

export type MetricPoint = {
  ts: string;
  value: number;
};

export type MetricsResponse = {
  total_tokens: number;
  estimated_cost_usd: number;
  average_latency_ms: number;
  total_requests: number;
  success_rate: number;
  tokens_over_time: MetricPoint[];
  latency_over_time: MetricPoint[];
  requests_over_time: MetricPoint[];
};

export type TaskSummary = {
  id: string;
  input_text: string;
  status: TaskStatus;
  created_at: string;
  completed_at: string | null;
};

export type AgentRun = {
  task_id: string;
  agent_id: string;
  role: string;
  state: string;
  started_at: string;
  ended_at: string | null;
  calls_made: number;
  call_limit: number | null;
  tokens_used: number | null;
  avg_response_ms: number | null;
};

export type AgentDetail = {
  agent_id: string;
  role: string;
  recent_runs: AgentRun[];
  total_calls: number;
  avg_tokens: number | null;
  failure_count: number;
};

export type ErrorEvent = {
  task_id: string;
  input_text: string;
  ts: string;
  stage: LogEvent['stage'];
  level: LogEvent['level'];
  agent: string | null;
  message: string;
  suggested_fix: string;
  meta: Record<string, unknown>;
};

