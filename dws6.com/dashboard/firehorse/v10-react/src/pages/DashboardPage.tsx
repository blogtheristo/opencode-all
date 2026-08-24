/**
 * DashboardPage - Main portfolio view with projects, metrics, AI assistant
 * Extracted from App.tsx for router-based navigation
 */

import { useEffect, useState } from 'react';
import { MetricsHeader } from '../components/MetricsHeader';
import { ProjectCard } from '../components/ProjectCard';
import { ClimateAssistant } from '../components/ClimateAssistant';
import { MeetingPanel } from '../components/MeetingPanel';
import { ClaudeCodePanel } from '../components/ClaudeCodePanel';
import { QuickActions } from '../components/QuickActions';
import { ActivityFeed } from '../components/ActivityFeed';
import { fetchProjects } from '../lib/supabase';
import type { Project } from '../types/dashboard';
import type { User } from '@supabase/supabase-js';

type SidePanel = 'chat' | 'meeting' | 'repo' | null;

interface DashboardPageProps {
  user: User | null;
  sidePanel: SidePanel;
  onSetSidePanel: (panel: SidePanel) => void;
}

export function DashboardPage({ user, sidePanel, onSetSidePanel: _onSetSidePanel }: DashboardPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      const data = await fetchProjects();

      const transformedProjects: Project[] = data.map((p: Record<string, unknown>) => ({
        id: p.id as string,
        name: (p.name ?? p.project_name ?? '') as string,
        status: (p.status ?? 'green') as 'green' | 'amber' | 'red',
        spi: (p.spi as number) || 0,
        cpi: (p.cpi as number) || 0,
        carbon_footprint: (p.carbon_footprint as number) || 0,
        compliance_status: {
          csrd: true,
          epbd: true,
          ets: true,
          cbam: false,
          last_check: new Date().toISOString(),
        },
        location: p.location as string,
        start_date: p.start_date as string,
        end_date: p.end_date as string,
        budget: p.budget as number,
        spent: p.spent as number,
      }));

      setProjects(transformedProjects);
      setLoading(false);
    }

    loadProjects();

    const interval = setInterval(loadProjects, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <MetricsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${sidePanel ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Projects ({projects.length})
            </h2>
            <div className="flex items-center gap-2">
              <select className="text-sm border border-border rounded-lg px-3 py-1.5">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* Quick Actions + Activity Feed below projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <QuickActions />
            <ActivityFeed />
          </div>
        </div>

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
  );
}
