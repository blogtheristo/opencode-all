/**
 * Smart Factory for Sales — daily pipeline entrypoint (cron / GitHub Actions).
 *
 * Usage:
 *   node --import tsx scripts/smart-factory-daily.ts
 *   SMART_FACTORY_NO_SEND=true node --import tsx scripts/smart-factory-daily.ts  # compose only
 *
 * Env:
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY        — required to persist/send
 *   SMART_FACTORY_CATALOG_PATH                — optional custom catalog JSON (default dws10.com/config/products.json)
 *   SMART_FACTORY_CAMPAIGN_NAME               — optional campaign name (default smart-factory-<date>)
 *   SMART_FACTORY_CHANNELS                    — comma list, default "email"
 *   SMART_FACTORY_DAILY_CAP                   — atomic daily send cap, default 30
 *   SMART_FACTORY_QUEUE_MANUAL=true           — also queue LinkedIn/Facebook drafts for humans
 */

import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const { runSmartFactoryPipeline } = await import('../src/smart-factory/pipeline.js');
const { supabaseConfigured } = await import('../src/smart-factory/supabase.js');
import type { Channel } from '../src/smart-factory/types.js';

const channels = (process.env.SMART_FACTORY_CHANNELS || 'email')
  .split(',')
  .map((c) => c.trim())
  .filter((c): c is Channel => ['email', 'whatsapp', 'linkedin', 'facebook'].includes(c));

const campaignName =
  process.env.SMART_FACTORY_CAMPAIGN_NAME || `smart-factory-${new Date().toISOString().slice(0, 10)}`;

if (!supabaseConfigured()) {
  console.error(
    JSON.stringify({ ok: false, error: 'SUPABASE_URL / SUPABASE_SERVICE_KEY not set — cannot run' }),
  );
  process.exit(1);
}

const summary = await runSmartFactoryPipeline({
  campaignName,
  channels,
  dailyCap: process.env.SMART_FACTORY_DAILY_CAP
    ? parseInt(process.env.SMART_FACTORY_DAILY_CAP, 10)
    : undefined,
  noSend: process.env.SMART_FACTORY_NO_SEND === 'true',
});

console.log(JSON.stringify({ ok: true, ...summary }, null, 2));
