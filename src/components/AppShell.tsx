import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Task Console' },
  { to: '/agents', label: 'Agent Monitor' },
  { to: '/dashboard', label: 'Model Dashboard' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/logs', label: 'Logs' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="eyebrow">MARS</div>
          <h1>Multi-Agent Resource System</h1>
          <p className="muted">Local-first orchestration dashboard with live task streaming.</p>
        </div>
        <nav className="nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-panel">{children}</main>
    </div>
  );
}
