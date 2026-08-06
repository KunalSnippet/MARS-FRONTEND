import { useEffect, useState } from 'react';

interface LiveIndicatorProps {
  label?: string;
  dataUpdatedAt?: number;
}

export function LiveIndicator({ label = 'Live stream', dataUpdatedAt }: LiveIndicatorProps) {
  const [secondsAgo, setSecondsAgo] = useState<number>(0);

  useEffect(() => {
    if (!dataUpdatedAt) return;

    function updateDiff() {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((now - (dataUpdatedAt ?? now)) / 1000));
      setSecondsAgo(diff);
    }

    updateDiff();
    const interval = setInterval(updateDiff, 1000);
    return () => clearInterval(interval);
  }, [dataUpdatedAt]);

  const displayTime = dataUpdatedAt
    ? secondsAgo === 0
      ? 'updated just now'
      : `updated ${secondsAgo}s ago`
    : label;

  return (
    <div className="live-indicator" title="Data polling active">
      <span className="live-dot" />
      <span>{displayTime}</span>
    </div>
  );
}
