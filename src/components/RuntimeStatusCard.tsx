import { useHealth } from '../hooks/usePlatformQueries';

function statusLabel(runtimeMode: string, healthy: boolean | null) {
  if (runtimeMode === 'mock') {
    return 'Mock mode';
  }

  if (healthy) {
    return 'Real mode ready';
  }

  return 'Real mode blocked';
}

export function RuntimeStatusCard() {
  const health = useHealth();

  const runtimeMode = health.data?.runtime_mode ?? 'mock';
  const healthy = health.data?.model_server_healthy ?? null;
  const badgeClass = runtimeMode === 'real' && healthy ? 'completed' : runtimeMode === 'mock' ? 'running' : 'failed';

  return (
    <div className="runtime-card">
      <div className="runtime-card-header">
        <div>
          <div className="eyebrow">Runtime</div>
          <div className="runtime-title">Backend mode</div>
        </div>
        <span className={`badge ${badgeClass}`}>{statusLabel(runtimeMode, healthy)}</span>
      </div>

      {health.isLoading ? <div className="muted runtime-detail">Checking health...</div> : null}

      {health.data ? (
        <div className="runtime-detail">
          <div>Requested: {health.data.requested_mode}</div>
          <div>Running: {health.data.runtime_mode}</div>
          <div>LM Studio: {health.data.model_server_healthy ? 'Online' : 'Offline'}</div>
          {health.data.model_server_detail ? <div>{health.data.model_server_detail}</div> : null}
          {health.data.kernel_import_error ? <div>Import note: {health.data.kernel_import_error}</div> : null}
        </div>
      ) : null}

      {health.isError ? <div className="error-box">{health.error.message}</div> : null}
    </div>
  );
}