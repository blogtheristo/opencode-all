import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const { runWeeklyTedLearning } = await import('../src/construction-leads/ted-outreach.js');

const result = await runWeeklyTedLearning();
console.log(JSON.stringify({ ok: true, ...result }, null, 2));
