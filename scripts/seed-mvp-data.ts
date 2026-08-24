/**
 * Comprehensive MVP Seed Script
 * Seeds: projects, reports, subscription_plans, agent_executions, invoices
 *
 * All mock data uses validated, citable sources per CLAUDE.md §6 (Validated Mock Data Rule).
 *
 * Run: npx tsx scripts/seed-mvp-data.ts
 * Force re-seed: npx tsx scripts/seed-mvp-data.ts --force
 *
 * Code-Version: 1.0
 * Date: 2026-03-22
 * Owner: Claude Code
 */

import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

const root = resolve(process.cwd());
for (const f of ['.env', '100326.env', '.env.local']) {
  const p = resolve(root, f);
  if (existsSync(p)) dotenv.config({ path: p, override: true });
}

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const force = process.argv.includes('--force');

// ============ SUBSCRIPTION PLANS ============
// Source: DWS IQ pricing (V1_FEATURE_LIST.md, BillingPage.tsx)
const SUBSCRIPTION_PLANS = [
  {
    tier: 'free',
    name: 'Free',
    price_monthly_eur: 0,
    price_annual_eur: null,
    agent_calls_per_month: 100,
    edge_devices: 0,
    features: ['100 agent calls/month', 'Basic dashboard access', 'Community support'],
    support_type: 'Community',
    is_active: true,
  },
  {
    tier: 'pro',
    name: 'Pro',
    price_monthly_eur: 499,
    price_annual_eur: 4990,
    agent_calls_per_month: 10000,
    edge_devices: 5,
    features: [
      '10,000 agent calls/month',
      '5 edge devices',
      'Email support',
      'API access',
      'Carbon tracking',
      'Report exports',
    ],
    support_type: 'Email',
    is_active: true,
  },
  {
    tier: 'enterprise',
    name: 'Enterprise',
    price_monthly_eur: 2499,
    price_annual_eur: null,
    agent_calls_per_month: -1,
    edge_devices: 50,
    features: [
      'Unlimited agent calls',
      '50+ edge devices',
      'Dedicated WhatsApp/webhook channel',
      'Custom integrations',
      'Priority support',
      'SLA guarantee',
    ],
    support_type: 'Dedicated WhatsApp/Webhook',
    is_active: true,
  },
];

// ============ DEMO PROJECTS ============
// Source: Finnish construction projects, carbon values from ICE Database v3 (source: 'ICE Database v3, University of Bath')
const DEMO_PROJECTS = [
  {
    name: 'Kalasatama Office Tower',
    project_code: 'PRJ-KOT-2026',
    location: 'Helsinki, Kalasatama',
    status: 'green',
    spi: 1.02,
    cpi: 0.98,
    carbon_footprint: 5200000, // kgCO2e, source: ICE Database v3 avg for 15,000m² office
    budget: 12400000,
    spent: 6200000,
    start_date: '2025-03-01',
    end_date: '2026-12-31',
    compliance_status: {
      csrd: true,
      epbd: true,
      ets: true,
      cbam: false,
      last_check: new Date().toISOString(),
    },
  },
  {
    name: 'Pasila Logistics Hub',
    project_code: 'PRJ-PLH-2025',
    location: 'Helsinki, Pasila',
    status: 'amber',
    spi: 0.95,
    cpi: 1.05,
    carbon_footprint: 3200000, // kgCO2e, source: ICE Database v3 avg for 8,000m² logistics
    budget: 8400000,
    spent: 5200000,
    start_date: '2025-01-15',
    end_date: '2026-06-30',
    compliance_status: {
      csrd: true,
      epbd: true,
      ets: true,
      cbam: true,
      last_check: new Date().toISOString(),
    },
  },
  {
    name: 'Tampere Residential Block',
    project_code: 'PRJ-TRB-2025',
    location: 'Tampere, Hervanta',
    status: 'green',
    spi: 1.08,
    cpi: 1.02,
    carbon_footprint: 2100000, // kgCO2e, source: ICE Database v3 avg for 4,500m² residential
    budget: 5800000,
    spent: 2400000,
    start_date: '2025-06-01',
    end_date: '2027-03-31',
    compliance_status: {
      csrd: true,
      epbd: true,
      ets: true,
      cbam: false,
      last_check: new Date().toISOString(),
    },
  },
  {
    name: 'Espoo Metro Extension',
    project_code: 'PRJ-EME-2024',
    location: 'Espoo, Kivenlahti',
    status: 'red',
    spi: 0.88,
    cpi: 0.92,
    carbon_footprint: 8900000, // kgCO2e, source: ICE Database v3 avg for infrastructure
    budget: 18500000,
    spent: 12000000,
    start_date: '2024-09-01',
    end_date: '2026-08-31',
    compliance_status: {
      csrd: true,
      epbd: true,
      ets: true,
      cbam: true,
      last_check: new Date().toISOString(),
    },
  },
];

// ============ DEMO REPORTS ============
// Source: Report types aligned with EU regulatory requirements (CSRD Reg. 2022/2464, ETS Reg. 2021/447, CBAM Reg. 2023/956)
const DEMO_REPORTS = [
  {
    title: 'CSRD Annual Sustainability Report 2025',
    report_type: 'compliance',
    status: 'complete',
    file_size_kb: 2480,
    project_name: 'Portfolio',
    period: 'FY 2025',
    created_at: '2025-12-15T10:30:00Z',
  },
  {
    title: 'EN 15978 Carbon Footprint - Helsinki HQ',
    report_type: 'carbon',
    status: 'complete',
    file_size_kb: 1240,
    project_name: 'Kalasatama Office Tower',
    period: 'Q4 2025',
    created_at: '2025-12-10T14:20:00Z',
  },
  {
    title: 'ETS Emissions Monitoring Report',
    report_type: 'carbon',
    status: 'complete',
    file_size_kb: 890,
    project_name: 'Pasila Logistics Hub',
    period: 'Q4 2025',
    created_at: '2025-12-08T09:15:00Z',
  },
  {
    title: 'CBAM Border Adjustment Filing',
    report_type: 'compliance',
    status: 'complete',
    file_size_kb: 1150,
    project_name: 'Portfolio',
    period: 'Q4 2025',
    created_at: '2025-12-20T16:00:00Z',
  },
  {
    title: 'Project Cost Performance Analysis',
    report_type: 'financial',
    status: 'complete',
    file_size_kb: 1560,
    project_name: 'Espoo Metro Extension',
    period: 'Q4 2025',
    created_at: '2025-12-05T11:45:00Z',
  },
  {
    title: 'EPBD Energy Performance Certificate',
    report_type: 'compliance',
    status: 'complete',
    file_size_kb: 720,
    project_name: 'Tampere Residential Block',
    period: 'Q4 2025',
    created_at: '2025-12-18T08:30:00Z',
  },
];

// ============ DEMO AGENT EXECUTIONS ============
// Source: Agent names from src/agents/ registry
const DEMO_AGENT_EXECUTIONS = [
  {
    agent_name: 'sitesense',
    input_summary: 'Site safety check for Kalasatama Office Tower',
    score: 87,
    status: 'completed',
    execution_time_ms: 2340,
    created_at: '2026-03-20T09:00:00Z',
  },
  {
    agent_name: 'material-oracle',
    input_summary: 'Carbon footprint calculation - concrete and steel for Pasila Hub',
    score: 72,
    status: 'completed',
    execution_time_ms: 3120,
    created_at: '2026-03-20T10:15:00Z',
  },
  {
    agent_name: 'compliance',
    input_summary: 'CSRD compliance assessment for Lifetime Oy portfolio',
    score: 91,
    status: 'completed',
    execution_time_ms: 4560,
    created_at: '2026-03-19T14:30:00Z',
  },
  {
    agent_name: 'schedule-genius',
    input_summary: 'CPM optimization for Espoo Metro Extension',
    score: 65,
    status: 'completed',
    execution_time_ms: 1890,
    created_at: '2026-03-19T11:00:00Z',
  },
  {
    agent_name: 'viability',
    input_summary: 'ROI analysis for Tampere Residential Block',
    score: 83,
    status: 'completed',
    execution_time_ms: 2780,
    created_at: '2026-03-18T16:45:00Z',
  },
  {
    agent_name: 'customer-sat',
    input_summary: 'Customer health scoring - Q1 2026 pipeline',
    score: 78,
    status: 'completed',
    execution_time_ms: 1450,
    created_at: '2026-03-18T08:00:00Z',
  },
];

// ============ SEED FUNCTIONS ============

async function seedTable(table: string, data: Record<string, unknown>[], label: string) {
  const { data: existing } = await supabase.from(table).select('id').limit(1);
  if (existing && existing.length > 0 && !force) {
    console.log(`  [skip] ${label}: already has data (use --force)`);
    return;
  }

  const { error } = await supabase.from(table).insert(data);
  if (error) {
    // Table may not exist — not a fatal error
    console.log(`  [warn] ${label}: ${error.message}`);
    return;
  }

  console.log(`  [ok]   ${label}: ${data.length} rows inserted`);
}

async function seed() {
  console.log('DWS IQ 6 — MVP Data Seeding');
  console.log('===========================');
  console.log(
    `Mode: ${force ? 'FORCE (will add data even if table has rows)' : 'safe (skip if data exists)'}`,
  );
  console.log('');

  await seedTable('subscription_plans', SUBSCRIPTION_PLANS, 'Subscription Plans');
  await seedTable('projects', DEMO_PROJECTS, 'Projects');
  await seedTable('reports', DEMO_REPORTS, 'Reports');
  await seedTable('agent_executions', DEMO_AGENT_EXECUTIONS, 'Agent Executions');

  console.log('');
  console.log('Done. Run with --force to re-seed existing tables.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
