/**
 * Dashboard V10 React Main Application
 * DWS IQ Climate Intelligence Dashboard with routing and AI Assistant
 */

import React, { useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MetricsHeader } from './components/MetricsHeader';
import { ProjectCard } from './components/ProjectCard';
import { ClimateAssistant } from './components/ClimateAssistant';
import { MeetingPanel } from './components/MeetingPanel';
import { AgentMonitorDashboard } from './components/agent-monitor/AgentMonitorDashboard';
import { ClaudeCodePanel } from './components/ClaudeCodePanel';
import { ComplianceScoreWidget } from './components/ComplianceScoreWidget';
import { ProfileMenu } from './components/ProfileMenu';
import { HamburgerMenu } from './components/HamburgerMenu';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProjectCardSkeleton } from './components/Skeleton';
import { EmptyState } from './components/EmptyState';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { CarbonTrackingPage } from './pages/CarbonTrackingPage';
import { ReportViewerPage } from './pages/ReportViewerPage';
import { TemplateEditorPage } from './pages/TemplateEditorPage';
import { BillingPage } from './pages/BillingPage';
import { AgentMonitorDashboard } from './components/agent-monitor/AgentMonitorDashboard';

type SidePanel = 'chat' | 'meeting' | 'repo' | null;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading...</div>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function DashboardWithPanels() {
function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidePanel, setSidePanel] = useState<SidePanel>('chat');
  const [appView, setAppView] = useState<AppView>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidePanel, setSidePanel] = useState<SidePanel>('chat');

  const handleNavigate = (view: string) => {
    switch (view) {
      case 'dashboard': navigate('/'); setSidePanel(null); break;
      case 'agents': navigate('/agents'); break;
      case 'settings': navigate('/settings'); break;
      case 'billing': navigate('/billing'); break;
      default: break;
  // Check if user needs onboarding (first login, no profile data)
  useEffect(() => {
    if (!user) return;
    const onboardingDone = user.user_metadata?.onboarding_completed
      || localStorage.getItem(`dws_onboarded_${user.id}`);
    if (!onboardingDone) {
      setShowOnboarding(true);
    }
  }, [user]);

  // Show onboarding wizard before dashboard
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

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      const data = await fetchProjects();

      // Transform Supabase data to Project type
      const transformedProjects: Project[] = data.map(p => ({
        id: p.id,
        name: p.name,
        status: p.status as 'green' | 'amber' | 'red',
        spi: p.spi || 0,
        cpi: p.cpi || 0,
        carbon_footprint: p.carbon_footprint || 0,
        compliance_status: {
          csrd: true, // TODO: Get from actual compliance data
          epbd: true,
          ets: true,
          cbam: false,
          last_check: new Date().toISOString(),
        },
        location: p.location,
        start_date: p.start_date,
        end_date: p.end_date,
        budget: p.budget,
        spent: p.spent,
      }));

      setProjects(transformedProjects);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={() => navigate('/')} role="button" tabIndex={0} aria-label="Go to dashboard">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">DWS IQ Dashboard</h1>
                <p className="text-xs text-gray-500 leading-tight">Climate Intelligence · V10</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => navigate('/agents')} className="btn-secondary">Agent Monitor</button>
              <button onClick={() => setSidePanel(sidePanel === 'chat' ? null : 'chat')} className={sidePanel === 'chat' ? 'btn-primary' : 'btn-secondary'}>AI Assistant</button>
              <button onClick={() => setSidePanel(sidePanel === 'meeting' ? null : 'meeting')} className={sidePanel === 'meeting' ? 'btn-primary' : 'btn-secondary'}>Meeting</button>
              <button onClick={() => setSidePanel(sidePanel === 'repo' ? null : 'repo')} className={sidePanel === 'repo' ? 'btn-primary' : 'btn-secondary'} title="Repo Health">⚙️ Repo Health</button>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden md:block">
                <ProfileMenu user={user} onSignOut={signOut} onNavigate={handleNavigate} />
              </div>
              <HamburgerMenu user={user} appView="dashboard" sidePanel={sidePanel} onSetAppView={() => {}} onSetSidePanel={setSidePanel} onSignOut={signOut} onNavigate={handleNavigate} />
              <div className="md:hidden">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white shadow-sm select-none">
                  {((user?.user_metadata?.full_name as string) || user?.email || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DashboardPage user={user} sidePanel={sidePanel} onSetSidePanel={setSidePanel} />
      </main>
      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>© 2026 DWS IQ · Climate Intelligence Platform</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-gray-700">Documentation</a>
              <a href="#" className="hover:text-gray-700">API</a>
              <a href="#" className="hover:text-gray-700">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAgentsView = location.pathname === '/agents';
  const [sidePanel, setSidePanel] = useState<SidePanel>('chat');

  const handleNavigate = (view: string) => {
    switch (view) {
      case 'dashboard':
        navigate('/');
        setSidePanel(null);
        break;
      case 'agents':
        navigate('/agents');
        break;
      case 'reports':
        navigate('/reports');
        break;
      case 'templates':
        navigate('/templates');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'billing':
        navigate('/billing');
        break;
      default:
        break;
    }
  };

  const isDashboardHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div
              className="flex items-center gap-3 min-w-0 cursor-pointer"
              onClick={() => navigate('/')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
              role="button"
              tabIndex={0}
              aria-label="Go to dashboard"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">DWS IQ Dashboard</h1>
                <p className="text-xs text-gray-500 leading-tight">Climate Intelligence · V10</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate(isAgentsView ? '/' : '/agents')}
                className={isAgentsView ? 'btn-primary' : 'btn-secondary'}
              >
                Agent Monitor
              </button>
              {isDashboardHome && (
                <>
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
                  <button
                    onClick={() => setSidePanel(sidePanel === 'repo' ? null : 'repo')}
                    className={sidePanel === 'repo' ? 'btn-primary' : 'btn-secondary'}
                    title="Claude Code repo engineering health & gap analysis"
                  >
                    ⚙️ Repo Health
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden md:block">
                <ProfileMenu
                  user={user}
                  onSignOut={signOut}
                  onNavigate={handleNavigate}
                />
              </div>

              <HamburgerMenu
                user={user}
                appView={isAgentsView ? 'agents' : 'dashboard'}
                sidePanel={sidePanel}
                onSetAppView={(v) => (v === 'agents' ? navigate('/agents') : navigate('/'))}
                onSetSidePanel={setSidePanel}
                onSignOut={signOut}
                onNavigate={handleNavigate}
              />

              <div className="md:hidden">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white shadow-sm select-none">
                  {((user?.user_metadata?.full_name as string | undefined) || user?.email || 'U')
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
        {children}
        {appView === 'agents' ? (
          <ErrorBoundary>
            <AgentMonitorDashboard onClose={() => setAppView('dashboard')} />
          </ErrorBoundary>
        ) : (
          <>
            {/* Metrics */}
            <ErrorBoundary>
              <MetricsHeader />
            </ErrorBoundary>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Compliance Score Widget — hidden when a side panel is open (all screens) */}
              {!sidePanel && (
                <div className="lg:col-span-1 order-first lg:order-none">
                  <ErrorBoundary>
                    <ComplianceScoreWidget onRunAssessment={() => setSidePanel('chat')} />
                  </ErrorBoundary>
                </div>
              )}

              {/* Projects Section */}
              <div className={`${sidePanel ? 'lg:col-span-2' : 'lg:col-span-2'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Projects ({projects.length})
                  </h2>
                  <div className="flex items-center gap-2">
                    <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5">
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
                      <ProjectCardSkeleton key={i} />
                    ))}
                  </div>
                ) : projects.length === 0 ? (
                  <EmptyState
                    icon="chart"
                    title="No projects yet"
                    description="Run your first compliance assessment to see your portfolio here."
                    actionLabel="Run Assessment"
                    onAction={() => setSidePanel('chat')}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map(project => (
                      <ErrorBoundary key={project.id}>
                        <ProjectCard project={project} />
                      </ErrorBoundary>
                    ))}
                  </div>
                )}
              </div>

              {/* Side Panel: AI Assistant or Meeting */}
              {sidePanel && (
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <ErrorBoundary>
                      {sidePanel === 'chat' && <ClimateAssistant />}
                      {sidePanel === 'meeting' && (
                        <MeetingPanel
                          userName={user?.user_metadata?.full_name || user?.email || 'DWS6 User'}
                          userEmail={user?.email}
                        />
                      )}
                      {sidePanel === 'repo' && <ClaudeCodePanel />}
                    </ErrorBoundary>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>© 2026 DWS IQ · Climate Intelligence Platform</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-gray-700">Documentation</a>
              <a href="#" className="hover:text-gray-700">API</a>
              <a href="#" className="hover:text-gray-700">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/reset-password" element={
        <PublicRoute>
          <ResetPasswordPage />
        </PublicRoute>
      } />

      <Route path="/" element={
        <ProtectedRoute>
          <DashboardWithPanels />
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <DashboardLayout>
            <SettingsPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/carbon" element={
        <ProtectedRoute>
          <DashboardLayout>
            <CarbonTrackingPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ReportViewerPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/templates" element={
        <ProtectedRoute>
          <DashboardLayout>
            <TemplateEditorPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/billing" element={
        <ProtectedRoute>
          <DashboardLayout>
            <BillingPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/agents" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AgentMonitorDashboard onClose={() => window.history.back()} />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
