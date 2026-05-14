/**
 * Seed script: Demo projects for DWS IQ Dashboard
 * Inserts sample portfolio projects for development/demo.
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_KEY in env.
 *
 * Run: npm run db:seed:projects
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

const DEMO_PROJECTS = [
  {
    name: 'Kalasatama Office Tower',
    project_code: 'PRJ-KOT-2026',
    location: 'Helsinki, Kalasatama',
    status: 'green',
    spi: 1.02,
    cpi: 0.98,
    carbon_footprint: 5200000,
    budget: 12400000,
    spent: 6200000,
    start_date: '2025-03-01',
    end_date: '2026-12-31',
    compliance_status: { csrd: true, epbd: true, ets: true, cbam: false, last_check: new Date().toISOString() },
  },
  {
    name: 'Pasila Logistics Hub',
    project_code: 'PRJ-PLH-2025',
    location: 'Helsinki, Pasila',
    status: 'amber',
    spi: 0.95,
    cpi: 1.05,
    carbon_footprint: 3200000,
    budget: 8400000,
    spent: 5200000,
    start_date: '2025-01-15',
    end_date: '2026-06-30',
    compliance_status: { csrd: true, epbd: true, ets: true, cbam: true, last_check: new Date().toISOString() },
  },
  {
    name: 'Tampere Residential Block',
    project_code: 'PRJ-TRB-2025',
    location: 'Tampere, Hervanta',
    status: 'green',
    spi: 1.08,
    cpi: 1.02,
    carbon_footprint: 2100000,
    budget: 5800000,
    spent: 2400000,
    start_date: '2025-06-01',
    end_date: '2027-03-31',
    compliance_status: { csrd: true, epbd: true, ets: true, cbam: false, last_check: new Date().toISOString() },
  },
  {
    name: 'Espoo Metro Extension',
    project_code: 'PRJ-EME-2024',
    location: 'Espoo, Kivenlahti',
    status: 'red',
    spi: 0.88,
    cpi: 0.92,
    carbon_footprint: 8900000,
    budget: 18500000,
    spent: 12000000,
    start_date: '2024-09-01',
    end_date: '2026-08-31',
    compliance_status: { csrd: true, epbd: true, ets: true, cbam: true, last_check: new Date().toISOString() },
  },
];

async function seed() {
  console.log('Seeding demo projects...');

  const { data: existing } = await supabase.from('projects').select('id').limit(1);
  if (existing && existing.length > 0 && !process.argv.includes('--force')) {
    console.log('Projects table already has data. Skipping seed (use --force to add more).');
    process.exit(0);
  }

  let { error } = await supabase.from('projects').insert(DEMO_PROJECTS);

  if (error?.code === 'PGRST204') {
    console.log('Projects table missing some columns. Run migration 042 first (npm run db:migrate:042 from repo root), or apply supabase/migrations/042_projects_dashboard.sql in Supabase SQL Editor.');
    console.log('Retrying with minimal columns (name, status)...');
    const minimal = DEMO_PROJECTS.map(({ name, status }) => ({ name, status }));
    ({ error } = await supabase.from('projects').insert(minimal));
  }

  if (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }

  console.log('Inserted', DEMO_PROJECTS.length, 'demo projects');

  console.log('Done.');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
