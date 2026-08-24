/**
 * Full daily pipeline: TED fetch → (optional) initial outreach batch.
 * Set TED_DAILY_RUN_OUTREACH=false to fetch only.
 */
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const { fetchAndProcessLeads } = await import('../src/construction-leads/lead-processor.js');
const { DEFAULT_QUERY_CONFIG } = await import('../src/construction-leads/ted-api.js');
const { runTedOutreachInitialBatch } = await import('../src/construction-leads/ted-outreach.js');

const fetchResult = await fetchAndProcessLeads(DEFAULT_QUERY_CONFIG);
console.log('fetch', JSON.stringify(fetchResult, null, 2));

const runOutreach = (process.env.TED_DAILY_RUN_OUTREACH || 'true').toLowerCase() !== 'false';
if (runOutreach) {
  const outreach = await runTedOutreachInitialBatch();
  console.log('outreach', JSON.stringify(outreach, null, 2));
}
