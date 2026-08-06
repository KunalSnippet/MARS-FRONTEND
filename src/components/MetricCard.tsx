export function MetricCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  // Hardening: If value is an unexpectedly long string (> 24 chars), truncate with ellipsis and show full text in title
  const isLongValue = value.length > 24;
  const displayValue = isLongValue ? `${value.slice(0, 22)}...` : value;

  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div
        className="metric-value"
        title={isLongValue ? value : undefined}
        style={{
          fontSize: isLongValue ? '1.1rem' : '1.5rem',
          whiteSpace: isLongValue ? 'nowrap' : 'normal',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {displayValue}
      </div>
      {detail ? <div className="metric-detail">{detail}</div> : null}
    </div>
  );
}
