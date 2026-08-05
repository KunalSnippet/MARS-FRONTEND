import { useEffect, useState } from 'react';
import { StateBadge } from './StateBadge';

const bootLines = [
  '[KERNEL] Router online',
  '[KERNEL] Scheduler online',
  '[KERNEL] 4 agents registered: planner-01, researcher-01, coder-01, reviewer-01',
  '[KERNEL] Memory manager ready',
  'system ready.',
];

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

export function BootSequence() {
  const reducedMotion = usePrefersReducedMotion();
  const [cursor, setCursor] = useState({ line: reducedMotion ? bootLines.length : 0, char: 0 });

  useEffect(() => {
    if (reducedMotion) {
      setCursor({ line: bootLines.length, char: 0 });
      return;
    }

    if (cursor.line >= bootLines.length) {
      return;
    }

    const currentLine = bootLines[cursor.line] ?? '';
    const delay = cursor.char < currentLine.length ? 24 : 480;
    const timeout = window.setTimeout(() => {
      setCursor((current) => {
        const activeLine = bootLines[current.line] ?? '';

        if (current.line >= bootLines.length) {
          return current;
        }

        if (current.char < activeLine.length) {
          return { ...current, char: current.char + 1 };
        }

        return {
          line: Math.min(current.line + 1, bootLines.length),
          char: 0,
        };
      });
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [cursor, reducedMotion]);

  const completed = cursor.line >= bootLines.length;

  return (
    <aside className="boot-panel" aria-label="Kernel boot sequence">
      <div className="boot-panel-top">
        <div>
          <div className="boot-panel-label">SYSTEM BOOT</div>
          <div className="boot-panel-title">Live kernel snapshot</div>
        </div>
        <div className={`badge ${completed ? 'completed' : 'running'}`}>{completed ? 'ready' : 'booting'}</div>
      </div>

      <div className="boot-screen" aria-live="polite">
        {bootLines.map((line, index) => {
          const fullyVisible = index < cursor.line;
          const active = index === cursor.line;
          const visibleText = fullyVisible ? line : active ? line.slice(0, cursor.char) : '';

          return (
            <div key={line} className="boot-line">
              <span className="boot-prompt">{index === 0 ? '>' : ' '}</span>
              <span>{visibleText}</span>
              {active && !completed ? <span className="boot-cursor" aria-hidden="true">▋</span> : null}
            </div>
          );
        })}

        <div className={`boot-snapshot ${completed ? 'is-ready' : ''}`}>
          <div className="boot-snapshot-head">agent snapshot</div>
          <div className="boot-agent-row">
            <div className="boot-agent-item">
              <span className="boot-agent-id">planner-01</span>
              <StateBadge state="idle" />
            </div>
            <div className="boot-agent-item">
              <span className="boot-agent-id">researcher-01</span>
              <StateBadge state="running" />
            </div>
            <div className="boot-agent-item">
              <span className="boot-agent-id">coder-01</span>
              <StateBadge state="waiting" />
            </div>
            <div className="boot-agent-item">
              <span className="boot-agent-id">reviewer-01</span>
              <StateBadge state="idle" />
            </div>
          </div>
          <div className="boot-meta">scheduler: Priority · memory: warm · mode: local-first</div>
        </div>
      </div>
    </aside>
  );
}