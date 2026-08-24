/**
 * Supabase Client Configuration
 * PostgreSQL real-time database integration
 */

import { createClient } from '@supabase/supabase-js';

// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env (see repo .env.example).
// Non-secret fallbacks only so the app builds; replace via env for any real project.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'configure-vite-supabase-anon-key';

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

  // Calculate compliance rate from project statuses (green = compliant)
  const compliance_rate = total_projects > 0
    ? Math.round((projects_green / total_projects) * 100)
    : 0;

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

/**
 * Generate demo insights data for visualization
 * Used when database doesn't have historical data
 */
function generateDemoInsightsData() {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

  const carbonTrends = months.map((month, i) => ({
    month,
    emissions: Math.round(1200 - i * 80 + Math.random() * 50),
    target: Math.round(1100 - i * 70),
    savings: Math.round(100 + i * 30 + Math.random() * 20),
  }));

  const complianceTrends = months.map((month, i) => ({
    month,
    csrd: Math.min(100, 65 + i * 6 + Math.round(Math.random() * 5)),
    epbd: Math.min(100, 70 + i * 5 + Math.round(Math.random() * 5)),
    ets: Math.min(100, 75 + i * 4 + Math.round(Math.random() * 5)),
    cbam: Math.min(100, 50 + i * 8 + Math.round(Math.random() * 5)),
  }));

  const performanceTrends = months.map((month, i) => ({
    month,
    spi: Number((0.85 + i * 0.02 + Math.random() * 0.05).toFixed(2)),
    cpi: Number((0.88 + i * 0.015 + Math.random() * 0.04).toFixed(2)),
  }));

  const statusDistribution = [
    { status: 'green' as const, count: 8, percentage: 53 },
    { status: 'amber' as const, count: 5, percentage: 33 },
    { status: 'red' as const, count: 2, percentage: 14 },
  ];

  return {
    carbonTrends,
    complianceTrends,
    performanceTrends,
    statusDistribution,
  };
}

/**
 * Fetch insights data for dashboard analytics
 */
export async function fetchInsightsData() {
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .order('carbon_footprint', { ascending: false });

  const { data: alerts, error: alertsError } = await supabase
    .from('alerts')
    .select('*')
    .eq('acknowledged', false)
    .order('created_at', { ascending: false })
    .limit(5);

  if (projectsError) {
    console.error('Error fetching projects for insights:', projectsError);
  }
  if (alertsError) {
    console.error('Error fetching alerts for insights:', alertsError);
  }

  // Generate demo trend data (in production, this would come from historical tables)
  const demoData = generateDemoInsightsData();

  // Helper to calculate status distribution with percentages summing to 100
  const calculateStatusDistribution = (
    greenCount: number,
    amberCount: number,
    redCount: number,
    totalCount: number,
  ): { status: 'green' | 'amber' | 'red'; count: number; percentage: number }[] => {
    if (totalCount === 0) {
      return [
        { status: 'green', count: 0, percentage: 0 },
        { status: 'amber', count: 0, percentage: 0 },
        { status: 'red', count: 0, percentage: 0 },
      ];
    }

    const items: {
      status: 'green' | 'amber' | 'red';
      count: number;
      raw: number;
      floor: number;
      frac: number;
    }[] = [
      {
        status: 'green',
        count: greenCount,
        raw: (greenCount / totalCount) * 100,
        floor: 0,
        frac: 0,
      },
      {
        status: 'amber',
        count: amberCount,
        raw: (amberCount / totalCount) * 100,
        floor: 0,
        frac: 0,
      },
      {
        status: 'red',
        count: redCount,
        raw: (redCount / totalCount) * 100,
        floor: 0,
        frac: 0,
      },
    ];

    let sumFloors = 0;
    for (const item of items) {
      const floored = Math.floor(item.raw);
      item.floor = floored;
      item.frac = item.raw - floored;
      sumFloors += floored;
    }

    let remainder = 100 - sumFloors;

    if (remainder > 0) {
      // Distribute remaining percentage points to items with largest fractional parts
      const sortedByFrac = [...items].sort((a, b) => b.frac - a.frac);
      let index = 0;
      while (remainder > 0) {
        sortedByFrac[index % sortedByFrac.length].floor += 1;
        remainder -= 1;
        index += 1;
      }
    }

    // Map back to the original order: green, amber, red
    const floorsByStatus: Record<'green' | 'amber' | 'red', number> = {
      green: 0,
      amber: 0,
      red: 0,
    };
    for (const item of items) {
      floorsByStatus[item.status] = item.floor;
    }

    return [
      { status: 'green', count: greenCount, percentage: floorsByStatus.green },
      { status: 'amber', count: amberCount, percentage: floorsByStatus.amber },
      { status: 'red', count: redCount, percentage: floorsByStatus.red },
    ];
  };

  // Calculate actual status distribution if we have projects
  let statusDistribution = demoData.statusDistribution;
  if (projects && projects.length > 0) {
    const green = projects.filter(p => p.status === 'green').length;
    const amber = projects.filter(p => p.status === 'amber').length;
    const red = projects.filter(p => p.status === 'red').length;
    const total = projects.length;

    statusDistribution = calculateStatusDistribution(green, amber, red, total);
  }

  // Get top carbon projects
  const topCarbonProjects = (projects || []).slice(0, 5).map(p => ({
    id: p.id,
    name: p.name,
    status: p.status as 'green' | 'amber' | 'red',
    spi: p.spi || 0,
    cpi: p.cpi || 0,
    carbon_footprint: p.carbon_footprint || 0,
    compliance_status: {
      csrd: true,
      epbd: true,
      ets: true,
      cbam: false,
      last_check: new Date().toISOString(),
    },
    location: p.location,
    budget: p.budget,
    spent: p.spent,
  }));

  return {
    carbonTrends: demoData.carbonTrends,
    complianceTrends: demoData.complianceTrends,
    performanceTrends: demoData.performanceTrends,
    statusDistribution,
    topCarbonProjects,
    riskAlerts: (alerts || []).map(a => ({
      id: a.id,
      type: a.type as 'compliance' | 'carbon' | 'schedule' | 'cost',
      severity: a.severity as 'high' | 'medium' | 'low',
      message: a.message,
      project_id: a.project_id,
      created_at: a.created_at,
      acknowledged: a.acknowledged,
    })),
  };
}
