import { Link, NavLink } from 'react-router-dom';
import { RuntimeStatusCard } from './RuntimeStatusCard';

const navGroups = [
  {
    title: 'Operate',
    items: [
      { to: '/app/tasks', label: 'Task Console' },
      { to: '/app/agents', label: 'Agent Monitor' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { to: '/app/dashboard', label: 'Model Dashboard' },
      { to: '/app/analytics', label: 'Analytics' },
      { to: '/app/logs', label: 'Logs' },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="sidebar-header">
            <Link to="/" className="wordmark-group">
              <span className="wordmark">MARS</span>
              <span className="wordmark-badge">v0.1.0</span>
            </Link>
            <p className="brand-caption">Multi-Agent Resource System</p>
          </div>

          <nav>
            {navGroups.map((group) => (
              <div key={group.title} className="nav-section">
                <div className="nav-section-title">{group.title}</div>
                <div className="nav-list">
                  {group.items.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <RuntimeStatusCard />
      </aside>

      <main className="main-panel">{children}</main>
    </div>
  );
}
