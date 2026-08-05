import { Link, NavLink } from 'react-router-dom';
import { RuntimeStatusCard } from './RuntimeStatusCard';

const links = [
  { to: '/app/tasks', label: 'Task Console' },
  { to: '/app/agents', label: 'Agent Monitor' },
  { to: '/app/dashboard', label: 'Model Dashboard' },
  { to: '/app/analytics', label: 'Analytics' },
  { to: '/app/logs', label: 'Logs' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <Link to="/" className="brand-link">
            <div className="eyebrow">MARS</div>
            <h1>Multi-Agent Resource System</h1>
          </Link>
          <p className="muted">Local-first orchestration dashboard with live task streaming.</p>
        </div>
        <nav className="nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <RuntimeStatusCard />
      </aside>
      <main className="main-panel">{children}</main>
    </div>
  );
}
