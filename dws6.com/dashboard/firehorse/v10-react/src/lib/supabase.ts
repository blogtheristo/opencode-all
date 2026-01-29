/**
 * Supabase Client Configuration
 * PostgreSQL real-time database integration
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sdebezbsygcldklwlvmj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkZWJlemJzeWdjbGRrbHdsdm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NzA5MzIsImV4cCI6MjA1MTI0NjkzMn0.mP4Z1vGbNBrZHYYyqR5j_Gp4yD_oVz5nYHcZz4_vZ_Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Fetch portfolio metrics
 */
export async function fetchPortfolioMetrics() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*');

  if (error) {
    console.error('Error fetching projects:', error);
    return null;
  }

  if (!projects || projects.length === 0) {
    return {
      total_projects: 0,
      avg_spi: 0,
      avg_cpi: 0,
      total_carbon_saved: 0,
      compliance_rate: 0,
      projects_green: 0,
      projects_amber: 0,
      projects_red: 0,
    };
  }

  const total_projects = projects.length;
  const avg_spi = projects.reduce((sum, p) => sum + (p.spi || 0), 0) / total_projects;
  const avg_cpi = projects.reduce((sum, p) => sum + (p.cpi || 0), 0) / total_projects;
  const total_carbon_saved = projects.reduce((sum, p) => sum + (p.carbon_footprint || 0), 0);

  const projects_green = projects.filter(p => p.status === 'green').length;
  const projects_amber = projects.filter(p => p.status === 'amber').length;
  const projects_red = projects.filter(p => p.status === 'red').length;

  const compliance_rate = 85; // TODO: Calculate from actual compliance data

  return {
    total_projects,
    avg_spi: Math.round(avg_spi * 100) / 100,
    avg_cpi: Math.round(avg_cpi * 100) / 100,
    total_carbon_saved: Math.round(total_carbon_saved),
    compliance_rate,
    projects_green,
    projects_amber,
    projects_red,
  };
}

/**
 * Fetch all projects
 */
export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch alerts
 */
export async function fetchAlerts() {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('acknowledged', false)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }

  return data || [];
}

/**
 * Subscribe to real-time project updates
 */
export function subscribeToProjects(callback: (payload: unknown) => void) {
  return supabase
    .channel('projects_channel')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'projects' },
      callback
    )
    .subscribe();
}

/**
 * Subscribe to real-time alert updates
 */
export function subscribeToAlerts(callback: (payload: unknown) => void) {
  return supabase
    .channel('alerts_channel')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'alerts' },
      callback
    )
    .subscribe();
}
