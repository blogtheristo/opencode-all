/**
 * Metrics Header Component
 * Portfolio-level KPIs and statistics
 */

import { useEffect, useState } from 'react';
import { fetchPortfolioMetrics } from '../lib/supabase';
import type { PortfolioMetrics } from '../types/dashboard';

export function MetricsHeader() {
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true);
      const data = await fetchPortfolioMetrics();
      setMetrics(data);
      setLoading(false);
    }

    loadMetrics();

    // Refresh every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="metric-card animate-pulse">
            <div className="h-4 bg-fg-muted/20 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-fg-muted/20 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Projects */}
      <div className="metric-card hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-fg-muted font-medium">Total Projects</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {metrics.total_projects}
            </p>
          </div>
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🏗️</span>
          </div>
        </div>
        <div className="mt-3 flex gap-2 text-xs">
          <span className="text-green-600">● {metrics.projects_green} Green</span>
          <span className="text-yellow-600">● {metrics.projects_amber} Amber</span>
          <span className="text-red-600">● {metrics.projects_red} Red</span>
        </div>
      </div>

      {/* Average SPI */}
      <div className="metric-card hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-fg-muted font-medium">Avg SPI</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {metrics.avg_spi.toFixed(2)}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
        </div>
        <p className="text-xs text-fg-muted mt-3">
          Schedule Performance Index
        </p>
      </div>

      {/* Average CPI */}
      <div className="metric-card hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-fg-muted font-medium">Avg CPI</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {metrics.avg_cpi.toFixed(2)}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>
        <p className="text-xs text-fg-muted mt-3">
          Cost Performance Index
        </p>
      </div>

      {/* Carbon Savings */}
      <div className="metric-card hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-fg-muted font-medium">Carbon Impact</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {(metrics.total_carbon_saved / 1000).toFixed(1)}t
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🌍</span>
          </div>
        </div>
        <p className="text-xs text-fg-muted mt-3">
          CO₂e tracked (EN 15978)
        </p>
      </div>
    </div>
  );
}
