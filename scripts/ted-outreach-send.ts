import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const { runTedOutreachInitialBatch } = await import('../src/construction-leads/ted-outreach.js');

const result = await runTedOutreachInitialBatch();
console.log(JSON.stringify({ ok: true, ...result }, null, 2));
