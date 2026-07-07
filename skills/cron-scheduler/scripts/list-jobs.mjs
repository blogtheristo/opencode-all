#!/usr/bin/env node
// cron-scheduler / list-jobs.mjs
// Enumerates scripts in scripts/{hourly,daily,weekly,on-deploy}/ and emits
// a JSON inventory.

import { readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..', '..');
const CADENCES = ['hourly', 'daily', 'weekly', 'on-deploy'];

function listCadence(cadence) {
  const dir = join(REPO_ROOT, 'scripts', cadence);
  try {
    return readdirSync(dir)
      .filter((f) => !f.startsWith('_') && !f.startsWith('.'))
      .filter((f) => {
        try {
          return statSync(join(dir, f)).isFile();
        } catch {
          return false;
        }
      })
      .sort()
      .map((f) => `scripts/${cadence}/${f}`);
  } catch {
    return [];
  }
}

const out = {};
let total = 0;
for (const c of CADENCES) {
  out[c] = listCadence(c);
  total += out[c].length;
}

process.stdout.write(JSON.stringify({ total, jobs: out }, null, 2) + '\n');
