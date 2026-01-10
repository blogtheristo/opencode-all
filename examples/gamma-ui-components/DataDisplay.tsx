/**
 * Data Display Components - Gamma UI Guidelines
 *
 * Demonstrates:
 * - text-balance for headings
 * - text-pretty for paragraphs
 * - tabular-nums for numeric data
 * - Fixed z-index scale
 * - Skeleton loading states
 * - Empty states with clear action
 */

import { cn } from '@/lib/utils';
import { Button } from './Button';

// ============================================================================
// MetricCard - For displaying key metrics
// ============================================================================

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function MetricCard({
  label,
  value,
  change,
  trend = 'neutral',
  icon,
  isLoading = false,
}: MetricCardProps) {
  if (isLoading) {
    return <MetricCardSkeleton />;
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-slate-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      {/* Metric value - MUST use tabular-nums for alignment */}
      <div className="text-3xl font-bold tabular-nums text-slate-900">
        {value}
      </div>

      {/* Trend indicator */}
      {change && (
        <div className={cn('text-sm font-medium mt-2', trendColors[trend])}>
          <span className="tabular-nums">{change}</span>
          {trend === 'up' && ' ↑'}
          {trend === 'down' && ' ↓'}
        </div>
      )}
    </div>
  );
}

// Skeleton for loading state
export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
      <div className="h-8 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-1/4" />
    </div>
  );
}

// ============================================================================
// DashboardGrid - For portfolio dashboard
// ============================================================================

interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface DashboardGridProps {
  metrics: DashboardMetric[];
  isLoading?: boolean;
}

export function DashboardGrid({ metrics, isLoading = false }: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
        : metrics.map((metric) => (
            <MetricCard key={metric.id} {...metric} />
          ))}
    </div>
  );
}

// ============================================================================
// DataTable - For tabular data with proper typography
// ============================================================================

interface Column {
  key: string;
  label: string;
  numeric?: boolean; // Use tabular-nums for numeric columns
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  isLoading?: boolean;
}

export function DataTable({ columns, data, isLoading = false }: DataTableProps) {
  if (isLoading) {
    return <DataTableSkeleton columnCount={columns.length} rowCount={5} />;
  }

  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  'px-6 py-3 text-sm font-semibold text-slate-900',
                  column.align === 'right' && 'text-right',
                  column.align === 'center' && 'text-center',
                  !column.align && 'text-left'
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'px-6 py-4 text-sm text-slate-900',
                    // CRITICAL: Use tabular-nums for numeric data
                    column.numeric && 'tabular-nums',
                    column.align === 'right' && 'text-right',
                    column.align === 'center' && 'text-center',
                    !column.align && 'text-left'
                  )}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DataTableSkeleton({
  columnCount,
  rowCount,
}: {
  columnCount: number;
  rowCount: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {Array.from({ length: columnCount }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <div className="h-4 bg-slate-200 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <div className="h-4 bg-slate-200 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// EmptyState - With clear next action
// ============================================================================

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No projects yet',
  description = 'Get started by creating your first project.',
  actionLabel = 'Create Project',
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon ? (
        <div className="text-slate-400 flex justify-center mb-4">{icon}</div>
      ) : (
        <svg
          className="mx-auto size-12 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
      )}
      <h3 className="text-balance mt-4 text-lg font-medium text-slate-900">
        {title}
      </h3>
      <p className="text-pretty mt-2 text-sm text-slate-500 max-w-md mx-auto">
        {description}
      </p>
      {onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Usage Examples
// ============================================================================

export function DataDisplayExamples() {
  const mockMetrics: DashboardMetric[] = [
    {
      id: '1',
      label: 'LTV per Customer',
      value: '€161,000',
      change: '+12.5%',
      trend: 'up',
    },
    {
      id: '2',
      label: 'Retention Rate',
      value: '100%',
      change: '0%',
      trend: 'neutral',
    },
    {
      id: '3',
      label: 'Growth Score',
      value: '91/100',
      change: '+5 pts',
      trend: 'up',
    },
    {
      id: '4',
      label: 'Monthly Revenue',
      value: '€7,000',
      change: '-2.3%',
      trend: 'down',
    },
  ];

  const columns: Column[] = [
    { key: 'project', label: 'Project', align: 'left' },
    { key: 'spi', label: 'SPI', numeric: true, align: 'right' },
    { key: 'cpi', label: 'CPI', numeric: true, align: 'right' },
    { key: 'carbon', label: 'Carbon Saved (tCO2e)', numeric: true, align: 'right' },
    { key: 'status', label: 'Status', align: 'center' },
  ];

  const data = [
    { project: 'Office Building A', spi: '1.08', cpi: '1.04', carbon: '2,340', status: '✓ On Track' },
    { project: 'Warehouse B', spi: '0.95', cpi: '1.12', carbon: '1,890', status: '⚠ Attention' },
    { project: 'Retail Center C', spi: '1.15', cpi: '0.98', carbon: '3,120', status: '✓ On Track' },
  ];

  return (
    <div className="space-y-12 p-8 bg-slate-50 min-h-dvh">
      <section>
        <h1 className="text-balance text-4xl font-bold mb-2 text-slate-900">
          Data Display Components
        </h1>
        <p className="text-pretty text-lg text-slate-600 max-w-3xl">
          Demonstrating Gamma UI guidelines for data-heavy interfaces with proper
          typography and accessibility.
        </p>
      </section>

      <section>
        <h2 className="text-balance text-2xl font-bold mb-4 text-slate-900">
          Dashboard Metrics (tabular-nums)
        </h2>
        <DashboardGrid metrics={mockMetrics} />
      </section>

      <section>
        <h2 className="text-balance text-2xl font-bold mb-4 text-slate-900">
          Loading State (Skeletons)
        </h2>
        <DashboardGrid metrics={[]} isLoading />
      </section>

      <section>
        <h2 className="text-balance text-2xl font-bold mb-4 text-slate-900">
          Data Table (tabular-nums for numbers)
        </h2>
        <DataTable columns={columns} data={data} />
      </section>

      <section>
        <h2 className="text-balance text-2xl font-bold mb-4 text-slate-900">
          Empty State (clear next action)
        </h2>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <EmptyState
            title="No compliance reports yet"
            description="Generate your first CSRD compliance report to track your sustainability performance."
            actionLabel="Generate Report"
            onAction={() => alert('Creating report...')}
          />
        </div>
      </section>
    </div>
  );
}
