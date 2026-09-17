/**
 * Dashboard V10 React Main Application
 * DWS IQ Climate Intelligence Dashboard with routing and AI Assistant
 */

import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MotionConfig, motion } from 'motion/react';
import { useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { MetricsHeader } from './components/MetricsHeader';
import { ProjectCard } from './components/ProjectCard';
import { ClimateAssistant } from './components/ClimateAssistant';
import { InsightsDashboard } from './components/InsightsDashboard';
import { CommandPalette } from './components/CommandPalette';
import { ProfileMenu } from './components/ProfileMenu';
import { HamburgerMenu } from './components/HamburgerMenu';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { LoginPage } from './pages/LoginPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { FirehorsePipelinePage } from './pages/FirehorsePipelinePage';
import { MemoryDashboard } from './components/MemoryDashboard';
import { EC3DashboardPage } from './pages/EC3DashboardPage';
import { fetchProjects } from './lib/supabase';
import type { Project } from './types/dashboard';

// Lazy-loaded pages — only fetched when user navigates to them
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const CarbonTrackingPage = lazy(() =>
  import('./pages/CarbonTrackingPage').then((m) => ({ default: m.CarbonTrackingPage })),
);
const ReportViewerPage = lazy(() =>
  import('./pages/ReportViewerPage').then((m) => ({ default: m.ReportViewerPage })),
);
const TemplateEditorPage = lazy(() =>
  import('./pages/TemplateEditorPage').then((m) => ({ default: m.TemplateEditorPage })),
);
const BillingPage = lazy(() =>
  import('./pages/BillingPage').then((m) => ({ default: m.BillingPage })),
);
const HealthPage = lazy(() =>
  import('./pages/HealthPage').then((m) => ({ default: m.HealthPage })),
);
const AgentMonitorDashboard = lazy(() =>
  import('./components/agent-monitor/AgentMonitorDashboard').then((m) => ({
    default: m.AgentMonitorDashboard,
  })),
);
const PaymentSuccessPage = lazy(() =>
  import('./pages/PaymentSuccessPage').then((m) => ({ default: m.PaymentSuccessPage })),
);
const PaymentCancelPage = lazy(() =>
  import('./pages/PaymentCancelPage').then((m) => ({ default: m.PaymentCancelPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20" role="status" aria-label="Loading page">
      <div className="animate-pulse text-fg-muted">Loading...</div>
    </div>
  );
}

type ViewMode = 'projects' | 'insights';
type SidePanel = 'chat' | 'meeting' | 'repo' | null;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="animate-pulse text-fg-muted">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="animate-pulse text-fg-muted">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function DashboardFooter() {
  return (
    <footer className="mt-12 py-6 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-sm text-fg-muted">
          <p>&copy; 2026 DWS IQ &middot; Climate Intelligence Platform</p>
          <div className="flex items-center gap-4">
            <a
              href="https://dws10.com/get-started/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              Documentation
            </a>
            <a href="/api" className="hover:text-foreground">
              API
            </a>
            <a href="https://dws10.com/contact/" className="hover:text-foreground">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidePanel, setSidePanel] = useState<SidePanel>(null);

  const handleNavigate = (view: string) => {
    switch (view) {
      case 'dashboard':
        navigate('/');
        break;
      case 'agents':
        navigate('/agents');
        break;
      case 'memory':
        navigate('/memory');
        break;
      case 'firehorse':
        navigate('/firehorse');
        break;
      case 'health':
        navigate('/health');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'billing':
        navigate('/billing');
        break;
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      <header className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div
              className="flex items-center gap-3 min-w-0 cursor-pointer"
              onClick={() => navigate('/')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/');
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Go to dashboard"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-foreground leading-tight">DWS IQ Dashboard</h1>
                <p className="text-xs text-fg-muted leading-tight">Climate Intelligence · V10</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => navigate('/agents')} className="btn-secondary">
                Agent Monitor
              </button>
              <button onClick={() => navigate('/memory')} className="btn-secondary">
                Memory
              </button>
              <button onClick={() => navigate('/ec3')} className="btn-secondary">
                EC3 Materials
              </button>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggle />
              <div className="hidden md:block">
                <ProfileMenu user={user} onSignOut={signOut} onNavigate={handleNavigate} />
              </div>
              <HamburgerMenu
                user={user}
                appView="dashboard"
                sidePanel={sidePanel}
                onSetAppView={() => {}}
                onSetSidePanel={setSidePanel}
                onSignOut={signOut}
                onNavigate={handleNavigate}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>

      <DashboardFooter />
    </div>
  );
}

function DashboardWithPanels() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('projects');
  const [sidePanel, setSidePanel] = useState<SidePanel>('chat');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleNavigate = (view: string) => {
    switch (view) {
      case 'dashboard':
        navigate('/');
        setSidePanel(null);
        break;
      case 'agents':
        navigate('/agents');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'billing':
        navigate('/billing');
        break;
    }
  };

  useEffect(() => {
    if (!user) return;
    const onboardingDone =
      user.user_metadata?.onboarding_completed || localStorage.getItem(`dws_onboarded_${user.id}`);
    if (!onboardingDone) {
      setShowOnboarding(true);
    }
  }, [user]);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (showOnboarding && user) {
    return (
      <OnboardingWizard
        userEmail={user.email || ''}
        onComplete={() => {
          localStorage.setItem(`dws_onboarded_${user.id}`, 'true');
          setShowOnboarding(false);
        }}
        onSkip={() => {
          localStorage.setItem(`dws_onboarded_${user.id}`, 'true');
          setShowOnboarding(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div
              className="flex items-center gap-3 min-w-0 cursor-pointer"
              onClick={() => navigate('/')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/');
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Go to dashboard"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-foreground leading-tight">DWS IQ Dashboard</h1>
                <p className="text-xs text-fg-muted leading-tight">Climate Intelligence · V10</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => navigate('/agents')} className="btn-secondary">
                Agent Monitor
              </button>
              <button onClick={() => navigate('/memory')} className="btn-secondary">
                Memory
              </button>
              <button onClick={() => navigate('/ec3')} className="btn-secondary">
                EC3 Materials
              </button>
              <button onClick={() => navigate('/firehorse')} className="btn-secondary">
                Firehorse
              </button>
              <button
                onClick={() => setSidePanel(sidePanel === 'chat' ? null : 'chat')}
                className={sidePanel === 'chat' ? 'btn-primary' : 'btn-secondary'}
              >
                AI Assistant
              </button>
              <button
                onClick={() => setSidePanel(sidePanel === 'meeting' ? null : 'meeting')}
                className={sidePanel === 'meeting' ? 'btn-primary' : 'btn-secondary'}
              >
                Meeting
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('projects')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'projects'
                      ? 'bg-surface text-foreground shadow-sm'
                      : 'text-fg-muted hover:text-foreground'
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setViewMode('insights')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'insights'
                      ? 'bg-surface text-foreground shadow-sm'
                      : 'text-fg-muted hover:text-foreground'
                  }`}
                >
                  Insights
                </button>
              </div>

              <button onClick={() => setShowChat(!showChat)} className="btn-primary">
                {showChat ? 'Hide Assistant' : 'AI Assistant'}
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggle />
              <div className="hidden md:block">
                <ProfileMenu user={user} onSignOut={signOut} onNavigate={handleNavigate} />
              </div>
              <HamburgerMenu
                user={user}
                appView="dashboard"
                sidePanel={sidePanel}
                onSetAppView={() => {}}
                onSetSidePanel={setSidePanel}
                onSignOut={signOut}
                onNavigate={handleNavigate}
              />
              <div className="md:hidden">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white shadow-sm select-none">
                  {((user?.user_metadata?.full_name as string) || user?.email || 'U')
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorBoundary>
          <MetricsHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${showChat ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              {viewMode === 'projects' ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      Projects ({projects.length})
                    </h2>
                    <div className="flex items-center gap-2">
                      <select className="text-sm border border-border rounded-lg bg-surface px-3 py-1.5">
                        <option>All Status</option>
                        <option>Green</option>
                        <option>Amber</option>
                        <option>Red</option>
                      </select>
                    </div>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="card animate-pulse">
                          <div className="h-4 bg-fg-muted/20 rounded w-3/4 mb-4"></div>
                          <div className="h-20 bg-fg-muted/20 rounded mb-4"></div>
                          <div className="h-4 bg-fg-muted/20 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="card text-center py-12">
                      <p className="text-fg-muted mb-4">No projects found</p>
                      <p className="text-sm text-fg-muted">
                        Connect to Supabase to view your portfolio
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </motion.div>
                  )}
                </>
              ) : (
                <InsightsDashboard />
              )}
            </div>

            {showChat && (
              <div className="lg:col-span-1">
                <ClimateAssistant />
              </div>
            )}
          </div>
        </ErrorBoundary>
      </main>

      <DashboardFooter />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <ErrorBoundary>
          <CommandPalette />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardWithPanels />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<PageLoader />}>
                  <SettingsPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/carbon"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<PageLoader />}>
                  <CarbonTrackingPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<PageLoader />}>
                  <ReportViewerPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<PageLoader />}>
                  <TemplateEditorPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<PageLoader />}>
                  <BillingPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<PageLoader />}>
                  <AgentMonitorDashboard onClose={() => window.history.back()} />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/health"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense fallback={<PageLoader />}>
                  <HealthPage />
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/firehorse"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <FirehorsePipelinePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/memory"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MemoryDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ec3"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <EC3DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Payment return routes — no DashboardLayout, payment providers redirect here */}
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <PaymentSuccessPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/cancel"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <PaymentCancelPage />
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
      </ErrorBoundary>
      </MotionConfig>
    </ThemeProvider>
  );
}

export default App;
