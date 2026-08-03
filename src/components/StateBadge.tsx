const palette: Record<string, string> = {
  queued: 'badge queued',
  running: 'badge running',
  completed: 'badge completed',
  failed: 'badge failed',
  ready: 'badge queued',
  waiting: 'badge waiting',
  idle: 'badge idle',
  blocked: 'badge blocked',
};

export function StateBadge({ state }: { state: string }) {
  return <span className={palette[state.toLowerCase()] ?? 'badge'}>{state}</span>;
}
