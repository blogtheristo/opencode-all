/**
 * TED fetch + ERP enrichment + compliance filter → construction_leads (ted_leads view).
 * Intended for cron at 06:00 UTC (GitHub Actions).
 */
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const { fetchAndProcessLeads } = await import('../src/construction-leads/lead-processor.js');
const { DEFAULT_QUERY_CONFIG } = await import('../src/construction-leads/ted-api.js');

const result = await fetchAndProcessLeads(DEFAULT_QUERY_CONFIG);
console.log(JSON.stringify({ ok: true, ...result }, null, 2));
