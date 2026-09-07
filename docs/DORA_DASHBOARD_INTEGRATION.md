# DORA Metrics Dashboard Integration Design

**Author:** Claude Haiku 4.5  
**Date:** 2026-09-03  
**Status:** Design Proposal  
**Audience:** HIC, product team, dashboard developers

---

## Executive Summary

This document proposes integration of four DORA (DevOps Research & Assessment) metrics into the dws6 admin dashboard (`dws6.com/dashboard`). DORA metrics measure delivery speed, stability, and reliability — directly aligned with the engineering discipline improvements delivered in the AI+SWE gap-closure program.

**Recommendation:** Add a dedicated "Delivery & Reliability" section to the admin dashboard featuring:

1. **Lead Time for Changes** (median days, p95 days)
2. **Deployment Frequency** (commits/week)
3. **Change Failure Rate** (% reverted)
4. **Mean Time to Recovery** (median hours)

---

## Current Dashboard Landscape

### Existing Gauge Patterns (dws6.com/dashboard)

**Dashboard Components:** `src/components/MetricsHeader.tsx`, `InsightsDashboard.tsx`

#### Pattern 1: Summary Card (KPI Gauge)

- **Location:** MetricsHeader, 4-column grid on lg screens
- **Layout:** Icon + title + large value + secondary stat (colored pill)
- **Examples:** Total Projects, Avg SPI, Avg CPI, Carbon Impact
- **Refresh:** 30 seconds
- **Data Source:** Supabase `fetchPortfolioMetrics()`

```tsx
<div className="metric-card hover:shadow-md transition-shadow">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-fg-muted font-medium">Metric Name</p>
      <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
    </div>
    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
      <span className="text-2xl">📊</span>
    </div>
  </div>
  <div className="mt-3 flex gap-2 text-xs">
    <span className="text-green-600">● {secondary_stat}</span>
  </div>
</div>
```

**Strengths:** At-a-glance KPIs, responsive, emoji-driven visual language, color-blind safe

#### Pattern 2: Trend Chart (Line/Area Chart)

- **Location:** InsightsDashboard, 2-column or 3-column grid
- **Tools:** Recharts (LineChart, AreaChart, BarChart)
- **Height:** 280px (ResponsiveContainer)
- **Examples:** Carbon Emissions Trend, Compliance Progress, Performance Trends
- **Refresh:** 60 seconds
- **Colors:** CHART_COLORS palette (primary: #0066cc, success: #10b981, danger: #ef4444)

```tsx
<ResponsiveContainer width="100%" height={280}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip contentStyle={{...}} />
    <Legend />
    <Line type="monotone" dataKey="key" stroke="#color" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>
```

**Strengths:** Rich historical context, multi-series support (stacked areas), responsive sizing

#### Pattern 3: Status Distribution (Pie/Donut Chart)

- **Purpose:** Show breakdown of states (e.g., project RAG distribution)
- **Colors:** RAG_COLORS = { green: #10b981, amber: #f59e0b, red: #ef4444 }

---

## Proposed DORA Integration

### Option A: Dedicated "Delivery & Reliability" Section (Recommended)

**Placement:** New section in admin dashboard below MetricsHeader, before InsightsDashboard  
**Grid Layout:** 4-column summary cards + 2-row trend charts

#### Row 1: DORA Summary Cards

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Lead Time   │ Deployment  │  Change     │   MTTR      │
│ (Median)    │ Frequency   │ Failure     │ (Median)    │
│ 2.3 days    │ 59 commits/ │ Rate        │ 5.2 hours   │
│ p95: 4.1    │ week        │ 0%          │ p95: 18h    │
│ ↓ 0.5 days  │ ↑ +3/week   │ ✓ Green     │ ↓ -2 hrs    │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Card Structure:**

- Title: "Lead Time for Changes" / "Deployment Frequency" / etc.
- Main Value: Median or frequency in appropriate unit
- Secondary: p95 (for lead time), trend arrow with delta, or status (Green/Amber/Red)
- Icon: 🚀 (deployment), ⏱️ (lead time), 📊 (frequency), ⚡ (MTTR)

#### Row 2: Trend Charts (2-column grid on lg)

1. **Lead Time Trend** (Line chart, days over time)
   - Lines: Median, P95, Target (dashed baseline 1 day)
   - X-axis: Week starting date
   - Y-axis: Days

2. **Deployment Frequency Trend** (Bar chart, commits/week)
   - Bar: Weekly commit count to main
   - X-axis: Week
   - Y-axis: Commits/week
   - Target line: >10 commits/week

#### Row 3: Change Failure & Recovery (2-column grid)

1. **Change Failure Rate Trend** (Line chart, % reverted)
   - Lines: CFR %, Target (15%)
   - X-axis: Week
   - Y-axis: Percentage

2. **MTTR Distribution** (Box plot or histogram)
   - Shows median, p95, recovery time distribution
   - Histogram of incident resolution times

---

### Data Structure Addition

**New Types** (extend `src/types/dashboard.ts`):

```typescript
export interface DoraMetrics {
  week: string; // ISO 8601 week starting date
  leadTimeMedianDays: number;
  leadTimeP95Days: number;
  deploymentFrequency: number; // commits/week
  changeFailureRate: number; // percentage
  mttrMedianHours: number;
  mttrP95Hours: number;
}

export interface DoraWeeklyReport {
  currentWeek: DoraMetrics;
  previousWeek?: DoraMetrics;
  trend: {
    leadTimeTrend: DoraMetrics[]; // last 12 weeks
    frequencyTrend: DoraMetrics[];
    cfrTrend: DoraMetrics[];
    mttrTrend: DoraMetrics[];
  };
}

export interface DeliveryHealthStatus {
  leadTimeRating: "elite" | "high" | "medium" | "low";
  frequencyRating: "elite" | "high" | "medium" | "low";
  reliabilityRating: "green" | "amber" | "red";
  overallScore: number; // 0-100
}
```

**DORA Rating Scale** (per DORA research):

- **Lead Time:** Elite <1 day, High 1-7 days, Medium 1-4 weeks, Low >4 weeks
- **Deployment Frequency:** Elite daily+, High weekly, Medium monthly, Low <yearly
- **Change Failure Rate:** Elite 0-15%, High 16-30%, Medium 31-45%, Low >45%
- **MTTR:** Elite <1 hour, High <1 day, Medium 1-7 days, Low 1+ weeks

---

## Implementation Roadmap

### Phase 1: Data Pipeline (Week 1-2)

**Status:** ✅ In Progress (`scripts/dora-metrics.ts` exists)

1. ✅ Create `scripts/dora-metrics.ts` — already implemented
2. ✅ Create GitHub Actions workflow `dora-weekly.yml` — already implemented
3. ✅ Generate `docs/dora-dashboard.md` — baseline established
4. **Add Supabase table** `dora_weekly_reports`:
   ```sql
   CREATE TABLE public.dora_weekly_reports (
     id uuid PRIMARY KEY,
     week date NOT NULL UNIQUE,
     lead_time_median_days numeric,
     lead_time_p95_days numeric,
     deployment_frequency numeric,
     change_failure_rate numeric,
     mttr_median_hours numeric,
     mttr_p95_hours numeric,
     created_at timestamp DEFAULT now(),
     GRANT SELECT, INSERT ON public.dora_weekly_reports TO service_role, authenticated;
   );
   ```

### Phase 2: Dashboard Components (Week 2-3)

1. **DoraMetricsHeader** component (new)
   - Fetch latest metrics from Supabase
   - Display 4 summary cards (Lead Time, Frequency, CFR, MTTR)
   - Refresh every 60 seconds
2. **DoraDeliveryCharts** component (new)
   - Row 1: Lead Time Trend + Deployment Frequency Trend
   - Row 2: CFR Trend + MTTR Distribution
   - Use Recharts with CHART_COLORS palette

3. **DeliveryHealthGauge** component (new)
   - Overall delivery health score (0-100)
   - DORA tier badges (Elite/High/Medium/Low)
   - Radar chart showing all 4 dimensions

### Phase 3: Integration & Polish (Week 3-4)

1. Integrate components into main dashboard layout
2. Add filtering (by week, by team/service)
3. Mobile-responsive refinement
4. Performance tuning (cache trends, lazy-load charts)

---

## Component Specifications

### DoraMetricsHeader.tsx

**Location:** `dws6.com/dashboard/firehorse/v10-react/src/components/DoraMetricsHeader.tsx`

```typescript
interface DoraMetricsHeaderProps {
  latestWeek?: DoraMetrics;
  previousWeek?: DoraMetrics;
  loading?: boolean;
}

export function DoraMetricsHeader({
  latestWeek,
  previousWeek,
  loading = false,
}: DoraMetricsHeaderProps) {
  const getRating = (value: number, type: 'leadTime' | 'frequency' | 'cfr' | 'mttr'): string => {
    // DORA rating logic
  };

  const getTrendDirection = (current: number, previous: number): { symbol: string; color: string } => {
    // ↑ ↓ → based on improvement/regression
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Lead Time for Changes"
        value={`${latestWeek?.leadTimeMedianDays.toFixed(1)}d`}
        secondary={`p95: ${latestWeek?.leadTimeP95Days.toFixed(1)}d`}
        trend={getTrendDirection(latestWeek?.leadTimeMedianDays, previousWeek?.leadTimeMedianDays)}
        icon="⏱️"
        rating={getRating(latestWeek?.leadTimeMedianDays, 'leadTime')}
      />
      {/* Similar for Frequency, CFR, MTTR */}
    </div>
  );
}
```

**Props:**

- `latestWeek`: Current week's DORA metrics
- `previousWeek`: Previous week for trend comparison
- `loading`: Skeleton state

**Refresh:** 60 seconds via `fetchDoraMetrics()`

---

### DoraDeliveryCharts.tsx

**Location:** `dws6.com/dashboard/firehorse/v10-react/src/components/DoraDeliveryCharts.tsx`

**Row 1:** Lead Time + Frequency

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <LeadTimeTrendChart data={trends.leadTime} />
  <DeploymentFrequencyChart data={trends.frequency} />
</div>
```

**Row 2:** CFR + MTTR

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <ChangeFailureRateChart data={trends.cfr} />
  <MTTRDistributionChart data={trends.mttr} />
</div>
```

**Chart Dimensions:** 280px height (matching InsightsDashboard pattern)

---

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│ Weekly GitHub Actions Trigger (dora-weekly.yml)         │
├─────────────────────────────────────────────────────────┤
│ 1. scripts/dora-metrics.ts (calculates metrics)         │
│ 2. Outputs JSON to docs/dora-dashboard.md               │
│ 3. Commits results to repo                              │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│ Supabase dora_weekly_reports table (row inserted)       │
├──────────────────────────────────────────────────────────┤
│ INSERT: (week, lead_time_median_days, ...)              │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│ Dashboard Fetch (every 60s)                              │
├──────────────────────────────────────────────────────────┤
│ fetchDoraMetrics() -> Supabase query                    │
│ Returns: last 12 weeks of DORA data                     │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│ Components Render (React)                                │
├──────────────────────────────────────────────────────────┤
│ DoraMetricsHeader (cards)                               │
│ DoraDeliveryCharts (trend charts)                        │
│ DeliveryHealthGauge (overall score)                      │
└──────────────────────────────────────────────────────────┘
```

---

## Gauge Presentation Patterns

### Pattern 1: Summary Card + Trend Arrow

**Best for:** Lead Time, MTTR (day/hour values with target)

```
┌─────────────────────────┐
│ ⏱️ Lead Time            │
│ 2.3 days                │
│ p95: 4.1 days           │
│ ↓ -0.5d vs last week    │ (green for improvement)
│ Elite tier              │
└─────────────────────────┘
```

### Pattern 2: Frequency Gauge + Growth Rate

**Best for:** Deployment Frequency (commits/week)

```
┌─────────────────────────┐
│ 🚀 Deployment Freq      │
│ 59 commits/week         │
│ ↑ +3 vs last week       │ (green if >10/week target)
│ High tier               │
└─────────────────────────┘
```

### Pattern 3: Health Status Indicator

**Best for:** Change Failure Rate (go/no-go)

```
┌─────────────────────────┐
│ 📊 Change Failure Rate  │
│ 0%                      │
│ ✓ Green (target <15%)   │
│ Elite tier              │
└─────────────────────────┘
```

### Pattern 4: Dual Metric (Median + P95)

**Best for:** MTTR, Lead Time (percentile distribution)

```
┌─────────────────────────┐
│ ⚡ MTTR                  │
│ 5.2 hours (median)      │
│ 18 hours (p95)          │
│ ↓ -2h vs last week      │
│ High tier               │
└─────────────────────────┘
```

---

## Gauge Design Reference

### Chart Color Palette (DWS Brand)

From `InsightsDashboard.tsx`:

```javascript
const CHART_COLORS = {
  primary: "#0066cc", // Lead time, deployments
  secondary: "#e8871a", // Warnings, secondary metrics
  success: "#10b981", // CFR passing, improvements
  warning: "#f59e0b", // CFR warning zone (15-30%)
  danger: "#ef4444", // CFR danger zone (>30%), issues
  info: "#00a3a3", // Additional context
};
```

### RAG Status Colors (Existing Pattern)

```javascript
const RAG_COLORS = {
  green: "#10b981", // Elite or on-target performance
  amber: "#f59e0b", // Medium tier, needs attention
  red: "#ef4444", // Low tier, intervention needed
};
```

### Icons (Emoji Pattern)

- ⏱️ Lead Time (clock)
- 🚀 Deployment Frequency (rocket)
- 📊 Change Failure Rate (chart)
- ⚡ MTTR (lightning, energy)
- 💚 Green/healthy status
- 📈 Upward trend
- 📉 Downward trend

---

## Adjacent Dashboard Gauge Opportunities

Beyond DORA, the admin dashboard could expand with these complementary gauges:

### Engineering Discipline Gauges (from Gap 5 audit)

1. **Rule Compliance Score** — % of model calls that are judgment-only (Rule 5)
   - Current: 8/122 correct = 6.6% (indicates heavy refactor needed)
   - Target: >95%
   - Display: Gauge meter 0-100%

2. **Decision Log Signal Mix** — Distribution of judgment/routing/transform/routine
   - Donut chart with 4 segments
   - Flags when routing or transform exceeds threshold
   - Auto-alert on anomalies

### Quality Gauges

3. **Test Coverage Trend** — % statement/function coverage
   - Line chart, target >80%
   - Auto-flag regression >2% drop

4. **Skipped Test Alerts** — Count of `it.skip()` or `test.skip()` in main
   - Number card with red badge if >0
   - Links to CI logs for debugging

### Release Gauges

5. **Deployment Safety Score** — Blend of CFR + MTTR + test coverage
   - Single 0-100 gauge meter
   - Green >80, Amber 50-80, Red <50

### Operational Gauges

6. **API Latency p50/p95** — Dashboard backend response time
   - Dual-value card
   - Target: <200ms p95

7. **Feature Flag Adoption** — % of new features behind flags
   - Percentage card
   - Tracks gradual rollout safety

---

## Recommendations for HIC

1. **Start with Phase 1 data pipeline** (Week 1):
   - Baseline DORA metrics already collected via `scripts/dora-metrics.ts`
   - Add Supabase table to enable dashboard queries
   - Minimal engineering lift

2. **Build Phase 2 dashboard components** (Week 2-3):
   - Reuse existing component patterns (MetricsHeader, InsightsDashboard)
   - 4 summary cards + 4 trend charts = standard admin dashboard section
   - ~3-4 days frontend work

3. **Polish and iterate** (Week 3-4):
   - Mobile responsiveness testing
   - Performance optimization (lazy-load charts)
   - Alerting rules (auto-flag when CFR spikes)

4. **Future expansions** (post-ship):
   - Integrate engineering discipline gauges (Rule 5 audit compliance)
   - Add decision logging visualizations
   - Expand to test coverage, deployment safety scoring

---

## Design Rationale

**Why these 4 metrics?**

- Directly measure engineering speed + stability
- Complement existing portfolio/project metrics (SPI, CPI, carbon)
- Aligned with dws6's AI+SWE discipline improvements
- Industry-standard DORA framework (DevOps community benchmark)

**Why summary cards + trend charts?**

- Cards show current state at-a-glance (like MetricsHeader)
- Charts show historical context + trajectory (like InsightsDashboard)
- Combined pattern used successfully in existing dashboard
- Responsive to mobile (cards stack, charts auto-scale)

**Why weekly cadence?**

- GitHub Actions cron runs every Monday 09:00 UTC
- Enough data points for meaningful trends (13+ weeks = quarter of history)
- Matches engineering sprint cadence
- Aligns with product review cycles

---

## References

- Current DORA Report: `docs/dora-dashboard.md` (baseline metrics established)
- Scripts: `scripts/dora-metrics.ts`, `.github/workflows/dora-weekly.yml`
- Dashboard Components: `dws6.com/dashboard/firehorse/v10-react/src/components/`
- Types: `dws6.com/dashboard/firehorse/v10-react/src/types/dashboard.ts`
- DORA Research: https://dora.dev (Google Cloud DevOps Research & Assessment)

---

**Next Step:** HIC decision on Phase 1 → data pipeline implementation priority.
