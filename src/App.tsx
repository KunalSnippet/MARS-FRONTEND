import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { AppShell } from './components/AppShell';
import { LandingPage } from './pages/LandingPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AgentMonitorPage } from './pages/AgentMonitorPage';
import { LogsPage } from './pages/LogsPage';
import { ModelDashboardPage } from './pages/ModelDashboardPage';
import { TaskConsolePage } from './pages/TaskConsolePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Navigate to="tasks" replace />} />
              <Route path="tasks" element={<TaskConsolePage />} />
              <Route path="agents" element={<AgentMonitorPage />} />
              <Route path="dashboard" element={<ModelDashboardPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="logs" element={<LogsPage />} />
            </Route>
            <Route path="/tasks" element={<Navigate to="/app/tasks" replace />} />
            <Route path="/agents" element={<Navigate to="/app/agents" replace />} />
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/analytics" element={<Navigate to="/app/analytics" replace />} />
            <Route path="/logs" element={<Navigate to="/app/logs" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppErrorBoundary>
    </QueryClientProvider>
  );
}
