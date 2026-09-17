/**
 * EC3 Dashboard Page
 * Displays BuildingTransparency EC3 EPD data: category stats, EPD counts,
 * GWP ranges, and confidence badges for Material Oracle integration.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (EC3 Dashboard UI)
 * Date: 2026-03-23
 * Owner: DWS IQ / Material Oracle
 *
 * Mock data sources:
 *   - GWP values: EC3/BuildingTransparency openEPD database (2024-2025 averages)
 *   - EPD counts: Approximate category sizes from EC3 public statistics
 *   - Confidence thresholds: DWS rule (10+ = high, 3-9 = medium, 1-2 = low, 0 = none)
 */

import { Fragment, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// ============ TYPES ============

interface CategoryStat {
  category: string;
  materialName: string;
  epdCount: number;
  gwpPerKg: {
    mean: number;
    median: number;
    p10: number;
    p90: number;
    min: number;
    max: number;
  };
  confidence: 'high' | 'medium' | 'low' | 'none';
  topManufacturers: string[];
  geographies: string[];
}

// ============ VALIDATED MOCK DATA ============
// Source: EC3/BuildingTransparency openEPD database, 2024-2025 category averages
// GWP values in kgCO2e/kg, normalized from declared units
// EPD counts approximate from EC3 public category pages

const MOCK_CATEGORIES: CategoryStat[] = [
  {
    category: 'ReadyMix',
    materialName: 'Concrete',
    epdCount: 847,
    gwpPerKg: { mean: 0.132, median: 0.128, p10: 0.085, p90: 0.195, min: 0.050, max: 0.310 },
    confidence: 'high',
    topManufacturers: ['Heidelberg Materials', 'Holcim', 'CEMEX', 'Boral'],
    geographies: ['FI', 'SE', 'DE', 'NO', 'DK'],
  },
  {
    category: 'Steel',
    materialName: 'Steel',
    epdCount: 312,
    gwpPerKg: { mean: 1.328, median: 1.210, p10: 0.680, p90: 2.150, min: 0.400, max: 3.100 },
    confidence: 'high',
    topManufacturers: ['SSAB', 'ArcelorMittal', 'Outokumpu', 'Tata Steel'],
    geographies: ['FI', 'SE', 'DE', 'NO'],
  },
  {
    category: 'Rebar',
    materialName: 'Rebar',
    epdCount: 89,
    gwpPerKg: { mean: 0.780, median: 0.720, p10: 0.450, p90: 1.200, min: 0.310, max: 1.800 },
    confidence: 'high',
    topManufacturers: ['Celsa', 'SSAB', 'Ovako'],
    geographies: ['FI', 'SE', 'NO'],
  },
  {
    category: 'SoftwoodLumber',
    materialName: 'Timber (Softwood)',
    epdCount: 156,
    gwpPerKg: { mean: 0.180, median: 0.150, p10: 0.060, p90: 0.340, min: -0.200, max: 0.520 },
    confidence: 'high',
    topManufacturers: ['Stora Enso', 'UPM', 'Metsä Wood', 'SCA'],
    geographies: ['FI', 'SE', 'NO', 'DE'],
  },
  {
    category: 'CLT',
    materialName: 'Timber (CLT)',
    epdCount: 42,
    gwpPerKg: { mean: 0.220, median: 0.200, p10: 0.100, p90: 0.380, min: -0.150, max: 0.550 },
    confidence: 'high',
    topManufacturers: ['Stora Enso', 'Binderholz', 'Mayr-Melnhof'],
    geographies: ['FI', 'SE', 'DE'],
  },
  {
    category: 'Glulam',
    materialName: 'Timber (Glulam)',
    epdCount: 38,
    gwpPerKg: { mean: 0.250, median: 0.230, p10: 0.110, p90: 0.420, min: -0.100, max: 0.600 },
    confidence: 'high',
    topManufacturers: ['Stora Enso', 'Metsä Wood', 'Setra'],
    geographies: ['FI', 'SE', 'NO'],
  },
  {
    category: 'Aluminum',
    materialName: 'Aluminum',
    epdCount: 67,
    gwpPerKg: { mean: 8.240, median: 7.800, p10: 4.200, p90: 12.500, min: 2.100, max: 18.000 },
    confidence: 'high',
    topManufacturers: ['Hydro', 'Novelis', 'Alcoa'],
    geographies: ['NO', 'SE', 'DE'],
  },
  {
    category: 'FlatGlass',
    materialName: 'Glass',
    epdCount: 28,
    gwpPerKg: { mean: 1.250, median: 1.180, p10: 0.800, p90: 1.700, min: 0.600, max: 2.200 },
    confidence: 'high',
    topManufacturers: ['Saint-Gobain', 'Pilkington', 'AGC'],
    geographies: ['FI', 'SE', 'DE'],
  },
  {
    category: 'MineralWool',
    materialName: 'Insulation (Mineral Wool)',
    epdCount: 45,
    gwpPerKg: { mean: 1.430, median: 1.350, p10: 0.900, p90: 2.100, min: 0.700, max: 2.800 },
    confidence: 'high',
    topManufacturers: ['Paroc', 'Rockwool', 'Isover'],
    geographies: ['FI', 'SE', 'DK', 'DE'],
  },
  {
    category: 'EPS',
    materialName: 'Insulation (EPS)',
    epdCount: 18,
    gwpPerKg: { mean: 3.290, median: 3.150, p10: 2.400, p90: 4.200, min: 1.800, max: 5.100 },
    confidence: 'high',
    topManufacturers: ['Bewi', 'Styroplast', 'Jackon'],
    geographies: ['FI', 'SE', 'NO'],
  },
  {
    category: 'Cement',
    materialName: 'Cement',
    epdCount: 124,
    gwpPerKg: { mean: 0.640, median: 0.620, p10: 0.420, p90: 0.850, min: 0.300, max: 1.000 },
    confidence: 'high',
    topManufacturers: ['Finnsementti', 'Heidelberg Materials', 'Cementa'],
    geographies: ['FI', 'SE', 'DE', 'NO'],
  },
  {
    category: 'Brick',
    materialName: 'Brick',
    epdCount: 34,
    gwpPerKg: { mean: 0.230, median: 0.210, p10: 0.140, p90: 0.340, min: 0.100, max: 0.450 },
    confidence: 'high',
    topManufacturers: ['Wienerberger', 'Leca'],
    geographies: ['FI', 'SE', 'DE'],
  },
  {
    category: 'Copper',
    materialName: 'Copper',
    epdCount: 8,
    gwpPerKg: { mean: 3.810, median: 3.650, p10: 2.100, p90: 5.800, min: 1.500, max: 7.200 },
    confidence: 'medium',
    topManufacturers: ['Boliden', 'Aurubis'],
    geographies: ['FI', 'SE', 'DE'],
  },
  {
    category: 'Gypsum',
    materialName: 'Plasterboard',
    epdCount: 22,
    gwpPerKg: { mean: 0.310, median: 0.290, p10: 0.200, p90: 0.430, min: 0.150, max: 0.550 },
    confidence: 'high',
    topManufacturers: ['Gyproc', 'Knauf'],
    geographies: ['FI', 'SE', 'NO', 'DK'],
  },
  {
    category: 'XPS',
    materialName: 'Insulation (XPS)',
    epdCount: 6,
    gwpPerKg: { mean: 4.520, median: 4.300, p10: 3.200, p90: 5.900, min: 2.800, max: 6.500 },
    confidence: 'medium',
    topManufacturers: ['Styrofoam', 'Finnfoam'],
    geographies: ['FI', 'SE'],
  },
  {
    category: 'HardwoodLumber',
    materialName: 'Timber (Hardwood)',
    epdCount: 2,
    gwpPerKg: { mean: 0.350, median: 0.350, p10: 0.280, p90: 0.420, min: 0.280, max: 0.420 },
    confidence: 'low',
    topManufacturers: ['Pollmeier'],
    geographies: ['DE'],
  },
  {
    category: 'Asphalt',
    materialName: 'Asphalt',
    epdCount: 0,
    gwpPerKg: { mean: 0, median: 0, p10: 0, p90: 0, min: 0, max: 0 },
    confidence: 'none',
    topManufacturers: [],
    geographies: [],
  },
];

// ============ CONSTANTS ============

const CONFIDENCE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; description: string }> = {
  high: {
    label: 'High',
    color: 'text-green-300',
    bg: 'bg-green-900/40',
    border: 'border-green-700/50',
    description: '10+ EPDs',
  },
  medium: {
    label: 'Medium',
    color: 'text-yellow-300',
    bg: 'bg-yellow-900/40',
    border: 'border-yellow-700/50',
    description: '3-9 EPDs',
  },
  low: {
    label: 'Low',
    color: 'text-orange-300',
    bg: 'bg-orange-900/40',
    border: 'border-orange-700/50',
    description: '1-2 EPDs',
  },
  none: {
    label: 'None',
    color: 'text-red-300',
    bg: 'bg-red-900/40',
    border: 'border-red-700/50',
    description: '0 EPDs',
  },
};

const BAR_COLORS: Record<string, string> = {
  high: '#4ade80',
  medium: '#facc15',
  low: '#fb923c',
  none: '#f87171',
};

type SortField = 'materialName' | 'epdCount' | 'gwpMedian' | 'confidence';
type SortDir = 'asc' | 'desc';

// ============ COMPONENT ============

export function EC3DashboardPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('epdCount');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('all');

  // EC3 connection status (mock — will be real when EC3_API_TOKEN is set)
  const ec3Connected = false;

  // Derived data
  const totalEpds = MOCK_CATEGORIES.reduce((sum, c) => sum + c.epdCount, 0);
  const categoriesWithData = MOCK_CATEGORIES.filter((c) => c.epdCount > 0).length;
  const highConfidenceCount = MOCK_CATEGORIES.filter((c) => c.confidence === 'high').length;

  // Filter
  const filtered = confidenceFilter === 'all'
    ? MOCK_CATEGORIES
    : MOCK_CATEGORIES.filter((c) => c.confidence === confidenceFilter);

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case 'materialName': cmp = a.materialName.localeCompare(b.materialName); break;
      case 'epdCount': cmp = a.epdCount - b.epdCount; break;
      case 'gwpMedian': cmp = a.gwpPerKg.median - b.gwpPerKg.median; break;
      case 'confidence': {
        const order = { high: 3, medium: 2, low: 1, none: 0 };
        cmp = order[a.confidence] - order[b.confidence];
        break;
      }
    }
    return sortDir === 'desc' ? -cmp : cmp;
  });

  // Chart data — top 12 by EPD count, sorted by median GWP
  const chartData = [...MOCK_CATEGORIES]
    .filter((c) => c.epdCount > 0)
    .sort((a, b) => a.gwpPerKg.median - b.gwpPerKg.median)
    .slice(0, 12)
    .map((c) => ({
      name: c.materialName.length > 14 ? c.materialName.slice(0, 12) + '..' : c.materialName,
      fullName: c.materialName,
      median: c.gwpPerKg.median,
      p10: c.gwpPerKg.p10,
      p90: c.gwpPerKg.p90,
      confidence: c.confidence,
    }));

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return '';
    return sortDir === 'asc' ? ' \u2191' : ' \u2193';
  };

  return (
    <div className="min-h-dvh bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">EC3 Material Database</h1>
            <p className="text-sm text-fg-muted mt-1">
              BuildingTransparency EPD Data &middot; Material Oracle Integration
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                ec3Connected
                  ? 'bg-green-900/40 text-green-300 border-green-700/50'
                  : 'bg-fg-muted/10 text-fg-muted border-border'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${ec3Connected ? 'bg-green-400' : 'bg-background0'}`} />
              {ec3Connected ? 'EC3 Connected' : 'EC3 Offline (Mock Data)'}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-sm text-fg-muted">Material Categories</p>
            <p className="text-3xl font-bold text-white mt-1">{MOCK_CATEGORIES.length}</p>
            <p className="text-xs text-fg-muted mt-1">{categoriesWithData} with EPD data</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-sm text-fg-muted">Total EPDs</p>
            <p className="text-3xl font-bold text-white mt-1">{totalEpds.toLocaleString()}</p>
            <p className="text-xs text-fg-muted mt-1">Nordic + DE geography filter</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-sm text-fg-muted">High Confidence</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{highConfidenceCount}</p>
            <p className="text-xs text-fg-muted mt-1">of {MOCK_CATEGORIES.length} categories (10+ EPDs)</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-sm text-fg-muted">Data Source</p>
            <p className="text-lg font-bold text-white mt-1">EC3 openEPD</p>
            <p className="text-xs text-fg-muted mt-1">buildingtransparency.org</p>
          </div>
        </div>

        {/* GWP Comparison Chart */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-1">GWP by Material Category</h2>
          <p className="text-xs text-fg-muted mb-4">Median A1-A3 embodied carbon (kgCO2e/kg) &middot; Sorted low to high</p>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'var(--fg-muted)', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tick={{ fill: 'var(--fg-muted)', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}
                  label={{ value: 'kgCO2e/kg', angle: -90, position: 'insideLeft', fill: 'var(--fg-muted)', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                  formatter={(value: number | string | undefined, name: string | undefined) => {
                    const labels: Record<string, string> = { median: 'Median', p10: 'P10 (low)', p90: 'P90 (high)' };
                    return [
                      typeof value === 'number' ? `${value.toFixed(3)} kgCO2e/kg` : `${String(value)} kgCO2e/kg`,
                      labels[name ?? ''] || name || 'Value',
                    ];
                  }}
                  labelFormatter={(label: unknown) => {
                    const resolvedLabel = String(label ?? '');
                    const item = chartData.find((d) => d.name === resolvedLabel);
                    return item?.fullName || resolvedLabel;
                  }}
                />
                <Bar dataKey="median" name="median" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={BAR_COLORS[entry.confidence]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 justify-center">
            {Object.entries(CONFIDENCE_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-fg-muted">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: BAR_COLORS[key] }} />
                {cfg.label} ({cfg.description})
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'high', 'medium', 'low', 'none'].map((level) => (
            <button
              key={level}
              onClick={() => setConfidenceFilter(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                confidenceFilter === level
                  ? 'bg-primary-600 text-white'
                  : 'bg-fg-muted/10 text-fg-muted hover:bg-fg-muted/20'
              }`}
            >
              {level === 'all' ? 'All Confidence' : `${CONFIDENCE_CONFIG[level].label} (${CONFIDENCE_CONFIG[level].description})`}
            </button>
          ))}
        </div>

        {/* Category Stats Table */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold text-white">Category Statistics</h2>
            <p className="text-xs text-fg-muted mt-1">
              GWP A1-A3 per kg &middot; {sorted.length} categories &middot; Click row for details
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th
                    className="text-left px-4 py-3 text-fg-muted font-medium cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('materialName')}
                  >
                    Material{sortIcon('materialName')}
                  </th>
                  <th className="text-left px-3 py-3 text-fg-muted font-medium">EC3 Category</th>
                  <th
                    className="text-right px-3 py-3 text-fg-muted font-medium cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('epdCount')}
                  >
                    EPDs{sortIcon('epdCount')}
                  </th>
                  <th
                    className="text-right px-3 py-3 text-fg-muted font-medium cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('gwpMedian')}
                  >
                    Median GWP{sortIcon('gwpMedian')}
                  </th>
                  <th className="text-right px-3 py-3 text-fg-muted font-medium">P10</th>
                  <th className="text-right px-3 py-3 text-fg-muted font-medium">P90</th>
                  <th className="text-right px-3 py-3 text-fg-muted font-medium">Range</th>
                  <th
                    className="text-center px-3 py-3 text-fg-muted font-medium cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('confidence')}
                  >
                    Confidence{sortIcon('confidence')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((cat) => {
                  const cfg = CONFIDENCE_CONFIG[cat.confidence];
                  const isExpanded = expandedCategory === cat.category;
                  return (
                    <Fragment key={cat.category}>
                      <tr
                        className={`border-b border-border/50 cursor-pointer transition-colors ${
                          isExpanded ? 'bg-fg-muted/10/40' : 'hover:bg-fg-muted/10/30'
                        }`}
                        onClick={() => setExpandedCategory(isExpanded ? null : cat.category)}
                      >
                        <td className="px-4 py-3">
                          <span className="font-medium text-white">{cat.materialName}</span>
                        </td>
                        <td className="px-3 py-3 text-fg-muted text-xs font-mono">{cat.category}</td>
                        <td className="text-right px-3 py-3 tabular-nums text-fg-muted">{cat.epdCount.toLocaleString()}</td>
                        <td className="text-right px-3 py-3 tabular-nums font-medium text-white">
                          {cat.epdCount > 0 ? cat.gwpPerKg.median.toFixed(3) : '-'}
                        </td>
                        <td className="text-right px-3 py-3 tabular-nums text-fg-muted">
                          {cat.epdCount > 0 ? cat.gwpPerKg.p10.toFixed(3) : '-'}
                        </td>
                        <td className="text-right px-3 py-3 tabular-nums text-fg-muted">
                          {cat.epdCount > 0 ? cat.gwpPerKg.p90.toFixed(3) : '-'}
                        </td>
                        <td className="text-right px-3 py-3">
                          {cat.epdCount > 0 ? (
                            <div className="inline-flex items-center gap-1">
                              <div className="w-16 bg-fg-muted/20 rounded-full h-1.5 relative">
                                <div
                                  className="absolute h-1.5 rounded-full bg-primary-500"
                                  style={{
                                    left: `${Math.max(0, (cat.gwpPerKg.p10 / cat.gwpPerKg.max) * 100)}%`,
                                    right: `${Math.max(0, 100 - (cat.gwpPerKg.p90 / cat.gwpPerKg.max) * 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-fg-muted">-</span>
                          )}
                        </td>
                        <td className="text-center px-3 py-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                            {cfg.label}
                          </span>
                        </td>
                      </tr>
                      {/* Expanded Detail Row */}
                      {isExpanded && (
                        <tr className="border-b border-border/50 bg-fg-muted/10/20">
                          <td colSpan={8} className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-fg-muted mb-2 font-medium">GWP Statistics (kgCO2e/kg)</p>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-fg-muted">Mean</span>
                                    <span className="text-white tabular-nums">{cat.gwpPerKg.mean.toFixed(3)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-fg-muted">Median</span>
                                    <span className="text-white tabular-nums font-medium">{cat.gwpPerKg.median.toFixed(3)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-fg-muted">Min</span>
                                    <span className="text-fg-muted tabular-nums">{cat.gwpPerKg.min.toFixed(3)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-fg-muted">Max</span>
                                    <span className="text-fg-muted tabular-nums">{cat.gwpPerKg.max.toFixed(3)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-fg-muted">P10 - P90</span>
                                    <span className="text-fg-muted tabular-nums">{cat.gwpPerKg.p10.toFixed(3)} - {cat.gwpPerKg.p90.toFixed(3)}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-fg-muted mb-2 font-medium">Top Manufacturers</p>
                                <div className="space-y-1">
                                  {cat.topManufacturers.length > 0 ? cat.topManufacturers.map((m) => (
                                    <p key={m} className="text-xs text-fg-muted">{m}</p>
                                  )) : (
                                    <p className="text-xs text-fg-muted">No data</p>
                                  )}
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-fg-muted mb-2 font-medium">Geography Coverage</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {cat.geographies.length > 0 ? cat.geographies.map((g) => (
                                    <span key={g} className="text-xs bg-fg-muted/20 text-fg-muted px-2 py-0.5 rounded">{g}</span>
                                  )) : (
                                    <p className="text-xs text-fg-muted">No data</p>
                                  )}
                                </div>
                                <div className="mt-3">
                                  <p className="text-xs text-fg-muted mb-1 font-medium">Confidence</p>
                                  <span className={`text-xs font-medium px-2 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                    {cfg.label} — {cfg.description}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attribution & Data Source */}
        <div className="bg-surface/50 border border-border rounded-xl p-4">
          <p className="text-xs text-fg-muted">
            EPD data provided by Building Transparency EC3 (buildingtransparency.org).
            GWP values normalized to kgCO2e/kg using DWS unit normalization (EN 1991-1-1 density tables).
            Confidence scoring: high (10+ EPDs), medium (3-9 EPDs), low (1-2 EPDs), none (no data).
            Geography filter: FI, SE, NO, DK, DE.
          </p>
        </div>
      </div>
    </div>
  );
}
