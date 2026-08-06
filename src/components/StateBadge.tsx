interface StateBadgeProps {
  state: string;
  showDot?: boolean;
}

export function StateBadge({ state, showDot = true }: StateBadgeProps) {
  const normalized = state.toLowerCase();
  
  let badgeClass = 'badge badge-idle';
  if (['waiting', 'queued', 'blocked', 'warning'].includes(normalized)) {
    badgeClass = 'badge badge-waiting';
  } else if (['running'].includes(normalized)) {
    badgeClass = 'badge badge-running';
  } else if (['completed', 'ready'].includes(normalized)) {
    badgeClass = 'badge badge-completed';
  } else if (['failed', 'error'].includes(normalized)) {
    badgeClass = 'badge badge-failed';
  } else if (['idle', 'info'].includes(normalized)) {
    badgeClass = 'badge badge-idle';
  }

  return (
    <span className={badgeClass}>
      {showDot && <span className="badge-dot" />}
      <span>{state}</span>
    </span>
  );
}
