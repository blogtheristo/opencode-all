/**
 * Dashboard V10 React Main Application
 * DWS IQ Climate Intelligence Dashboard with routing and AI Assistant
 */

import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AgentMonitorDashboard } from './components/agent-monitor/AgentMonitorDashboard';
import { ProfileMenu } from './components/ProfileMenu';
import { HamburgerMenu } from './components/HamburgerMenu';
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidePanel, setSidePanel] = useState<SidePanel>('chat');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleNavigate = (view: string) => {
    switch (view) {
      case 'dashboard': navigate('/'); setSidePanel(null); break;
      case 'agents': navigate('/agents'); break;
      case 'settings': navigate('/settings'); break;
      case 'billing': navigate('/billing'); break;
      default: break;
    }
  };

  useEffect(() => {
    if (!user) return;
    const onboardingDone = user.user_metadata?.onboarding_completed
      || localStorage.getItem(`dws_onboarded_${user.id}`);
    if (!onboardingDone) {
      setShowOnboarding(true);
    }
  }, [user]);

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
              <button onClick={() => setSidePanel(sidePanel === 'repo' ? null : 'repo')} className={sidePanel === 'repo' ? 'btn-primary' : 'btn-secondary'} title="Repo Health">Repo Health</button>
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
            <p>&copy; 2026 DWS IQ &middot; Climate Intelligence Platform</p>
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
                    Repo Health
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
      </main>

      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>&copy; 2026 DWS IQ &middot; Climate Intelligence Platform</p>
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
