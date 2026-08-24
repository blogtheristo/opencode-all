/**
 * InsightsDashboard Component
 * Analytics and insights view for DWS IQ Climate Intelligence Dashboard
 */

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { fetchInsightsData } from '../lib/supabase';
import type {
  InsightsData,
  CarbonTrendData,
  ComplianceTrendData,
  PerformanceTrendData,
  ProjectStatusDistribution,
} from '../types/dashboard';

const RAG_COLORS = {
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
};

/* Color-blind-safe chart palette (DESIGN_SYSTEM.md §Charts) */
const CHART_COLORS = {
  primary: '#0066cc',
  secondary: '#e8871a',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#00a3a3',
};

export function InsightsDashboard() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const insightsData = await fetchInsightsData();
      setData(insightsData);
      setLoading(false);
    }
    loadData();

    // Refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Carbon Savings"
          value={`${data.carbonTrends[data.carbonTrends.length - 1]?.savings || 0} t`}
          change="+12%"
          positive
          icon="🌱"
        />
        <SummaryCard
          title="Avg Compliance"
          value={`${Math.round((
            (data.complianceTrends[data.complianceTrends.length - 1]?.csrd ?? 0) +
            (data.complianceTrends[data.complianceTrends.length - 1]?.epbd ?? 0) +
            (data.complianceTrends[data.complianceTrends.length - 1]?.ets ?? 0) +
            (data.complianceTrends[data.complianceTrends.length - 1]?.cbam ?? 0)
          ) / 4)}%`}
          change="+5%"
          positive
          icon="✓"
        />
        <SummaryCard
          title="Schedule Performance"
          value={data.performanceTrends[data.performanceTrends.length - 1]?.spi.toFixed(2) || '0.00'}
          change={data.performanceTrends[data.performanceTrends.length - 1]?.spi >= 1 ? 'On Track' : 'Behind'}
          positive={data.performanceTrends[data.performanceTrends.length - 1]?.spi >= 1}
          icon="📅"
        />
        <SummaryCard
          title="Cost Performance"
          value={data.performanceTrends[data.performanceTrends.length - 1]?.cpi.toFixed(2) || '0.00'}
          change={data.performanceTrends[data.performanceTrends.length - 1]?.cpi >= 1 ? 'Under Budget' : 'Over Budget'}
          positive={data.performanceTrends[data.performanceTrends.length - 1]?.cpi >= 1}
          icon="💰"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CarbonTrendsChart data={data.carbonTrends} />
        <ComplianceTrendsChart data={data.complianceTrends} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PerformanceTrendsChart data={data.performanceTrends} />
        <StatusDistributionChart data={data.statusDistribution} />
        <TopCarbonProjectsList projects={data.topCarbonProjects} />
      </div>

      {/* Risk Alerts */}
      {data.riskAlerts.length > 0 && (
        <RiskAlertsPanel alerts={data.riskAlerts} />
      )}
    </div>
  );
}

// Summary Card Component
function SummaryCard({
  title,
  value,
  change,
  positive,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-fg-muted mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className={`text-sm mt-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

// Carbon Trends Chart
function CarbonTrendsChart({ data }: { data: CarbonTrendData[] }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Carbon Emissions Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--fg-muted)', fontFamily: 'IBM Plex Mono, monospace' }} stroke="var(--fg-muted)" />
          <YAxis tick={{ fontSize: 12, fill: 'var(--fg-muted)', fontFamily: 'IBM Plex Mono, monospace' }} stroke="var(--fg-muted)" />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
            formatter={(value, name) => [`${value} t CO₂e`, name as string]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="emissions"
            stroke={CHART_COLORS.danger}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.danger }}
            name="Emissions"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: CHART_COLORS.primary }}
            name="Target"
          />
          <Line
            type="monotone"
            dataKey="savings"
            stroke={CHART_COLORS.success}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.success }}
            name="Savings"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Compliance Trends Chart
function ComplianceTrendsChart({ data }: { data: ComplianceTrendData[] }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Compliance Progress</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--fg-muted)', fontFamily: 'IBM Plex Mono, monospace' }} stroke="var(--fg-muted)" />
          <YAxis tick={{ fontSize: 12, fill: 'var(--fg-muted)', fontFamily: 'IBM Plex Mono, monospace' }} stroke="var(--fg-muted)" domain={[0, 100]} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
            formatter={(value) => [`${value}%`]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="csrd"
            stackId="1"
            stroke={CHART_COLORS.primary}
            fill={CHART_COLORS.primary}
            fillOpacity={0.6}
            name="CSRD"
          />
          <Area
            type="monotone"
            dataKey="epbd"
            stackId="2"
            stroke={CHART_COLORS.success}
            fill={CHART_COLORS.success}
            fillOpacity={0.6}
            name="EPBD"
          />
          <Area
            type="monotone"
            dataKey="ets"
            stackId="3"
            stroke={CHART_COLORS.secondary}
            fill={CHART_COLORS.secondary}
            fillOpacity={0.6}
            name="ETS"
          />
          <Area
            type="monotone"
            dataKey="cbam"
            stackId="4"
            stroke={CHART_COLORS.warning}
            fill={CHART_COLORS.warning}
            fillOpacity={0.6}
            name="CBAM"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Performance Trends Chart
function PerformanceTrendsChart({ data }: { data: PerformanceTrendData[] }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Performance Indices</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--fg-muted)', fontFamily: 'IBM Plex Mono, monospace' }} stroke="var(--fg-muted)" />
          <YAxis tick={{ fontSize: 12, fill: 'var(--fg-muted)', fontFamily: 'IBM Plex Mono, monospace' }} stroke="var(--fg-muted)" domain={[0, 1.5]} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
          />
          <Legend />
          <Bar dataKey="spi" fill={CHART_COLORS.primary} name="SPI" radius={[4, 4, 0, 0]} />
          <Bar dataKey="cpi" fill={CHART_COLORS.success} name="CPI" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-fg-muted text-center mt-2">SPI/CPI &gt; 1.0 indicates ahead of schedule/under budget</p>
    </div>
  );
}

// Status Distribution Chart
function StatusDistributionChart({ data }: { data: ProjectStatusDistribution[] }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Project Status Distribution</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ payload }) => `${payload.status}: ${payload.percentage}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={RAG_COLORS[entry.status]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `${value} projects`,
              String(name).charAt(0).toUpperCase() + String(name).slice(1),
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: RAG_COLORS[item.status] }}
            />
            <span className="text-sm text-fg-muted capitalize">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Top Carbon Projects List
function TopCarbonProjectsList({ projects }: { projects: InsightsData['topCarbonProjects'] }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Top Carbon Impact Projects</h3>
      {projects.length === 0 ? (
        <p className="text-sm text-fg-muted text-center py-8">No projects found</p>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-fg-muted w-5">{index + 1}</span>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: RAG_COLORS[project.status] }}
                />
                <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                  {project.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {project.carbon_footprint.toLocaleString()} kg CO2e
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Risk Alerts Panel
function RiskAlertsPanel({ alerts }: { alerts: InsightsData['riskAlerts'] }) {
  const severityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Active Risk Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border ${severityColors[alert.severity]}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase">{alert.type}</span>
                <p className="text-sm mt-1">{alert.message}</p>
              </div>
              <span className="text-xs opacity-70">
                {new Date(alert.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-fg-muted/20 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-fg-muted/20 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-fg-muted/20 rounded w-1/4"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-fg-muted/20 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-fg-muted/20 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
