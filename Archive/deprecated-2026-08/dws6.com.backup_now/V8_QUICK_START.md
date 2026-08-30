# 🚀 Quick Start - Activate V8 Dashboard with Real Data

## 1️⃣ Open Supabase Dashboard

Go to: https://app.supabase.com/project/kpucuwwfhuwurdxyjjtz

## 2️⃣ Create Projects Table

Click **SQL Editor** → **New Query** and paste:

```sql
-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT 'Nordics',
  phase TEXT NOT NULL DEFAULT 'Execution',
  spi NUMERIC(5,2) NOT NULL DEFAULT 1.0,
  cpi NUMERIC(5,2) NOT NULL DEFAULT 1.0,
  percent_complete INTEGER DEFAULT 0 CHECK (percent_complete >= 0 AND percent_complete <= 100),
  safety_rag TEXT DEFAULT 'green' CHECK (safety_rag IN ('green', 'amber', 'red')),
  budget BIGINT DEFAULT 0,
  spent BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT budget_positive CHECK (budget >= 0),
  CONSTRAINT spent_positive CHECK (spent >= 0),
  CONSTRAINT spent_less_than_budget CHECK (spent <= budget)
);

CREATE INDEX idx_projects_region ON public.projects(region);
CREATE INDEX idx_projects_phase ON public.projects(phase);
CREATE INDEX idx_projects_updated_at ON public.projects(updated_at);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users to read projects"
  ON public.projects FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admins to manage projects"
  ON public.projects FOR ALL TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
```

Click **RUN** ✅

## 3️⃣ Create Alerts Table

Click **SQL Editor** → **New Query** and paste:

```sql
-- Create alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'schedule' CHECK (type IN ('schedule', 'cost', 'safety', 'quality')),
  severity TEXT NOT NULL DEFAULT 'yellow' CHECK (severity IN ('green', 'yellow', 'red')),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_alerts_project_id ON public.alerts(project_id);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users to read alerts"
  ON public.alerts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admins to manage alerts"
  ON public.alerts FOR ALL TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
```

Click **RUN** ✅

## 4️⃣ Insert Sample Data

Click **SQL Editor** → **New Query** and paste:

```sql
-- Insert sample projects
INSERT INTO public.projects (name, region, phase, spi, cpi, percent_complete, safety_rag, budget, spent) VALUES
  ('HQ Expansion', 'Nordics', 'Execution', 0.94, 0.96, 58, 'amber', 5000000::BIGINT * 100, 3500000::BIGINT * 100),
  ('Residential Complex', 'Nordics', 'Execution', 1.02, 0.98, 72, 'green', 8000000::BIGINT * 100, 5800000::BIGINT * 100),
  ('Industrial Plant', 'Continental', 'Procurement', 0.89, 0.91, 34, 'red', 12000000::BIGINT * 100, 5000000::BIGINT * 100),
  ('Office Tower', 'Nordics', 'Planning', 1.00, 1.00, 5, 'green', 15000000::BIGINT * 100, 750000::BIGINT * 100),
  ('Retail Center', 'Continental', 'Execution', 0.97, 0.95, 45, 'amber', 6000000::BIGINT * 100, 2800000::BIGINT * 100)
ON CONFLICT DO NOTHING;

-- Insert sample alerts
INSERT INTO public.alerts (project, message, type, severity, created_at) VALUES
  ('HQ Expansion', 'Critical path slip: Steel erection delayed by 5 days', 'schedule', 'red', now() - interval '2 hours'),
  ('Industrial Plant', 'Safety incident: Minor cut reported, 2 actions pending', 'safety', 'red', now() - interval '4 hours'),
  ('Office Tower', 'Material delivery: Concrete scheduled for next week', 'schedule', 'yellow', now() - interval '6 hours'),
  ('Retail Center', 'Budget variance: 8% over estimate for electrical work', 'cost', 'yellow', now() - interval '12 hours'),
  ('Residential Complex', 'Quality inspection: Minor defects in units 5-8', 'quality', 'yellow', now() - interval '24 hours')
ON CONFLICT DO NOTHING;
```

Click **RUN** ✅

## 5️⃣ Verify Setup

Click **SQL Editor** → **New Query** and paste:

```sql
-- Verify tables exist
SELECT COUNT(*) as project_count FROM public.projects;
SELECT COUNT(*) as alert_count FROM public.alerts;

-- Check data
SELECT name, spi, cpi, percent_complete FROM public.projects LIMIT 5;
SELECT project, message, severity FROM public.alerts LIMIT 5;
```

Click **RUN** ✅

You should see:
- `project_count`: 5
- `alert_count`: 5
- Projects list with metrics
- Alerts list with messages

## 6️⃣ View Your Dashboard

Open: **http://localhost:8080/dashboard/dws-iq-v8-enhanced/**

The dashboard will now:
- ✅ Fetch real data from Supabase
- ✅ Display 5 active projects
- ✅ Show 5 critical alerts
- ✅ Calculate portfolio metrics:
  - Average SPI: ~0.96
  - Average CPI: ~0.96
  - Active Projects: 5
  - Budget at Risk: ~$29.5M

## 📊 Expected Portfolio Results

| Metric | Value |
|--------|-------|
| Portfolio SPI | 0.96 |
| Portfolio CPI | 0.96 |
| Active Projects | 5 |
| Budget at Risk | $29.5M |
| Avg Completion | 42.8% |

## 🎯 Quick Features to Try

1. **Click Refresh** - Fetches latest data from Supabase
2. **Click Export** - Downloads all data as JSON
3. **Click Debug Icon** (top right) - Shows connection status
4. **Scroll Down** - See all projects and alerts

## 🔍 Debug Panel

Look for the blue bug icon in top-right corner. Click it to see:
- DB: Connection status
- Projects: Count of loaded projects
- Alerts: Count of loaded alerts
- Last update: When data was fetched

## ⚡ Live Updates

Once data is in Supabase:
- Edit project SPI/CPI in Supabase
- Refresh dashboard to see changes
- Portfolio metrics update automatically
- No code changes needed!

---

**Time to Complete**: 5 minutes  
**Prerequisites**: Supabase account + local dev server running
**Result**: Fully functional V8 dashboard with real data
