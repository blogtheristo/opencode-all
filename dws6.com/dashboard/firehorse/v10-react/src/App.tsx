/**
 * Dashboard V10 React Main Application
 * DWS IQ Climate Intelligence Dashboard with AI Assistant
 */

import { useEffect, useState } from 'react';
import { MetricsHeader } from './components/MetricsHeader';
import { ProjectCard } from './components/ProjectCard';
import { ClimateAssistant } from './components/ClimateAssistant';
import { MeetingPanel } from './components/MeetingPanel';
import { AgentMonitorDashboard } from './components/agent-monitor/AgentMonitorDashboard';
import { ClaudeCodePanel } from './components/ClaudeCodePanel';
import { ProfileMenu } from './components/ProfileMenu';
import { HamburgerMenu } from './components/HamburgerMenu';
import { useAuth } from './hooks/useAuth';
import { fetchProjects } from './lib/supabase';
import type { Project } from './types/dashboard';

type SidePanel = 'chat' | 'meeting' | 'repo' | null;
type AppView = 'dashboard' | 'agents';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidePanel, setSidePanel] = useState<SidePanel>('chat');
  const [appView, setAppView] = useState<AppView>('dashboard');
  const { user, signOut } = useAuth();

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

    loadProjects();

    // Refresh every 30 seconds
    const interval = setInterval(loadProjects, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">

            {/* Logo + brand */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">DWS IQ Dashboard</h1>
                <p className="text-xs text-gray-500 leading-tight">Climate Intelligence · V10</p>
              </div>
            </div>

            {/* Desktop nav buttons — hidden on mobile */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setAppView(appView === 'agents' ? 'dashboard' : 'agents')}
                className={appView === 'agents' ? 'btn-primary' : 'btn-secondary'}
              >
                Agent Monitor
              </button>
              <button
                onClick={() => { setAppView('dashboard'); setSidePanel(sidePanel === 'chat' ? null : 'chat'); }}
                className={sidePanel === 'chat' && appView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}
              >
                AI Assistant
              </button>
              <button
                onClick={() => { setAppView('dashboard'); setSidePanel(sidePanel === 'meeting' ? null : 'meeting'); }}
                className={sidePanel === 'meeting' && appView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}
              >
                Meeting
              </button>
              <button
                onClick={() => { setAppView('dashboard'); setSidePanel(sidePanel === 'repo' ? null : 'repo'); }}
                className={sidePanel === 'repo' && appView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}
                title="Claude Code repo engineering health & gap analysis"
              >
                ⚙️ Repo Health
              </button>
            </div>

            {/* Right side: profile avatar (desktop) + hamburger (mobile) */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Profile menu — desktop and mobile */}
              <div className="hidden md:block">
                <ProfileMenu
                  user={user}
                  onSignOut={signOut}
                  onNavigate={(view) => {
                    if (view === 'dashboard') { setAppView('dashboard'); setSidePanel(null); }
                    if (view === 'agents') setAppView('agents');
                  }}
                />
              </div>

              {/* Hamburger — mobile only */}
              <HamburgerMenu
                user={user}
                appView={appView}
                sidePanel={sidePanel}
                onSetAppView={setAppView}
                onSetSidePanel={setSidePanel}
                onSignOut={signOut}
                onNavigate={(view) => {
                  if (view === 'dashboard') { setAppView('dashboard'); setSidePanel(null); }
                  if (view === 'agents') setAppView('agents');
                }}
              />

              {/* Profile avatar visible on mobile too (without dropdown — hamburger handles it) */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {appView === 'agents' ? (
          <AgentMonitorDashboard onClose={() => setAppView('dashboard')} />
        ) : (
          <>
            {/* Metrics */}
            <MetricsHeader />

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Projects Section */}
              <div className={`${sidePanel ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
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
                      <div key={i} className="card animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : projects.length === 0 ? (
                  <div className="card text-center py-12">
                    <p className="text-gray-500 mb-4">No projects found</p>
                    <p className="text-sm text-gray-400">
                      Connect to Supabase to view your portfolio
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </div>

              {/* Side Panel: AI Assistant or Meeting */}
              {sidePanel && (
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    {sidePanel === 'chat' && <ClimateAssistant />}
                    {sidePanel === 'meeting' && (
                      <MeetingPanel
                        userName={user?.user_metadata?.full_name || user?.email || 'DWS6 User'}
                        userEmail={user?.email}
                      />
                    )}
                    {sidePanel === 'repo' && <ClaudeCodePanel />}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
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

export default App;
