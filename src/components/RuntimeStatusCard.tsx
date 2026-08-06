import { useEffect, useState } from 'react';
import { useHealth } from '../hooks/usePlatformQueries';
import { StateBadge } from './StateBadge';

export function RuntimeStatusCard() {
  const health = useHealth();
  const [showDetails, setShowDetails] = useState(false);

  const runtimeMode = health.data?.runtime_mode ?? 'mock';
  const healthy = health.data?.model_server_healthy ?? null;
  const isLive = runtimeMode === 'real' && healthy;

  // Log raw technical errors silently to console for developers
  useEffect(() => {
    if (health.data?.model_server_detail && !healthy) {
      console.debug('[MARS Runtime] Backend health detail:', health.data.model_server_detail);
    }
  }, [health.data, healthy]);

  return (
    <div className="runtime-card">
      <div className="runtime-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="runtime-title">Backend</span>
          <button
            className="info-toggle-btn"
            onClick={() => setShowDetails(!showDetails)}
            title="Toggle technical runtime details"
            aria-label="Toggle details"
          >
            {showDetails ? '✕' : 'ℹ️'}
          </button>
        </div>
        <StateBadge state={isLive ? 'ready' : 'idle'} showDot={false} />
      </div>

      {showDetails ? (
        <div className="runtime-detail">
          <div>Engine: {isLive ? 'LM Studio' : 'Local Mock'}</div>
          <div>Mode: {runtimeMode} ({health.data?.requested_mode ?? 'auto'})</div>
          <div>Status: {healthy ? 'Online' : 'Offline (Example Data)'}</div>
        </div>
      ) : null}
    </div>
  );
}