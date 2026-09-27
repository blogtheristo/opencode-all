#!/usr/bin/env node
// Evidence: Tool=Cursor Grok 4.6 Model=Cursor Grok 4.6 Agent=cursor Date=2026-09-18
// Audit trail: git log -- scripts/check-dev-env-pins.mjs
/**
 * check-dev-env-pins.mjs — DWS Truth Standard §2I Environment Version Parity.
 *
 * Shared-role tools (Docker Engine client) MUST match on every machine that
 * runs that role. Role-unique tools (WSL, Aspire CLI, aspire-dashboard,
 * Spark Ollama) stay split.
 *
 * Usage:
 *   node scripts/check-dev-env-pins.mjs                 schema + alignment report
 *   node scripts/check-dev-env-pins.mjs --require-aligned   exit 1 if any shared pin is open-drift
 *   node scripts/check-dev-env-pins.mjs --probe         local docker --version vs pin
 *   node scripts/check-dev-env-pins.mjs --dump          JSON dump of local probe
 *   node scripts/check-dev-env-pins.mjs --compare a.json b.json
 *   flags: --pins <path> --json
 *
 * Exit: 0 aligned/ok, 1 drift or bad input, 2 probe skipped (no docker here).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const args = process.argv.slice(2);

function take(flag) {
  const i = args.indexOf(flag);
  if (i >= 0) {
    args.splice(i, 1);
    return true;
  }
  return false;
}
function takeVal(flag) {
  const i = args.indexOf(flag);
  if (i >= 0) {
    const v = args[i + 1];
    args.splice(i, 2);
    return v;
  }
  return undefined;
}

const opt = {
  json: take('--json'),
  requireAligned: take('--require-aligned'),
  probe: take('--probe'),
  dump: take('--dump'),
  compare: take('--compare'),
  pinsPath: takeVal('--pins') || 'config/truth/dev-environment-pins.json',
};
const positional = args.filter((a) => !a.startsWith('--'));

function loadPins() {
  const abs = path.isAbsolute(opt.pinsPath) ? opt.pinsPath : path.join(ROOT, opt.pinsPath);
  if (!fs.existsSync(abs)) {
    fail(`pin file missing: ${opt.pinsPath}`);
  }
  return JSON.parse(fs.readFileSync(abs, 'utf8'));
}

function fail(msg, extra) {
  if (opt.json) {
    console.log(JSON.stringify({ ok: false, error: msg, ...extra }, null, 2));
  } else {
    console.error(`check-dev-env-pins: FAIL ${msg}`);
  }
  process.exit(1);
}

function parseDockerVersion(text) {
  const m = String(text).match(/Docker version\s+(\d+\.\d+\.\d+)/i);
  return m ? m[1] : null;
}

function alignmentReport(pins) {
  const mismatches = [];
  const shared = pins.sharedPins || {};
  for (const [id, pin] of Object.entries(shared)) {
    if (!pin.pin) mismatches.push({ id, reason: 'shared pin missing pin field' });
    const observed = pin.observed || {};
    const envs = pin.environments || Object.keys(observed);
    const versions = envs.map((env) => ({
      env,
      version: observed[env]?.version,
    }));
    const missing = versions.filter((v) => !v.version);
    for (const m of missing) {
      mismatches.push({ id, env: m.env, reason: 'observed version missing' });
    }
    const present = versions.filter((v) => v.version);
    const disagree = present.filter((v) => v.version !== pin.pin);
    for (const d of disagree) {
      mismatches.push({
        id,
        env: d.env,
        observed: d.version,
        pin: pin.pin,
        reason: `observed ${d.version} ≠ pin ${pin.pin}`,
      });
    }
    const unique = [...new Set(present.map((v) => v.version))];
    if (unique.length > 1) {
      mismatches.push({
        id,
        reason: `environments disagree: ${present.map((v) => `${v.env}=${v.version}`).join(' ')}`,
        pin: pin.pin,
      });
    }
    if (pin.status === 'aligned' && disagree.length) {
      mismatches.push({
        id,
        reason: 'status is aligned but observed versions do not match the pin',
      });
    }
    if (pin.status === 'open-drift' && disagree.length === 0 && present.length === envs.length) {
      mismatches.push({
        id,
        reason: 'status is open-drift but every observed version already matches the pin',
      });
    }
  }
  return { mismatches, sharedCount: Object.keys(shared).length };
}

function printReport(pins, report) {
  if (opt.json) {
    console.log(
      JSON.stringify(
        {
          ok: report.mismatches.length === 0,
          requireAligned: opt.requireAligned,
          mismatches: report.mismatches,
          sharedPins: pins.sharedPins,
        },
        null,
        2,
      ),
    );
    return;
  }
  console.log(`check-dev-env-pins: ${opt.pinsPath}`);
  console.log(`rule: ${pins.rule}`);
  for (const [id, pin] of Object.entries(pins.sharedPins || {})) {
    const observed = Object.entries(pin.observed || {})
      .map(([env, o]) => `${env}=${o.version}`)
      .join(' ');
    console.log(`shared ${id}: pin=${pin.pin} status=${pin.status} observed ${observed}`);
    if (pin.status === 'open-drift' && pin.closeWith) {
      console.log(`  close: ${pin.closeWith}`);
    }
  }
  for (const [id, pin] of Object.entries(pins.splitPins || {})) {
    const pinVal = Array.isArray(pin.pin) ? pin.pin.join(',') : pin.pin;
    console.log(`split  ${id}: role=${pin.role} pin=${pinVal}`);
  }
  if (report.mismatches.length) {
    for (const m of report.mismatches) {
      console.log(`✖ ${m.id}${m.env ? `/${m.env}` : ''}: ${m.reason}`);
    }
  } else {
    console.log('✔ shared pins aligned');
  }
}

function runCheck() {
  const pins = loadPins();
  if (pins.structuredMirror !== true || pins.sourceOfTruth !== false) {
    fail('pin file must set structuredMirror:true sourceOfTruth:false');
  }
  if (!pins.sharedPins || typeof pins.sharedPins !== 'object') {
    fail('pin file missing sharedPins');
  }
  const report = alignmentReport(pins);
  printReport(pins, report);
  const hasDrift = report.mismatches.length > 0;
  if (hasDrift && opt.requireAligned) process.exit(1);
  if (hasDrift && pins.sharedPins['docker.client']?.status !== 'open-drift') process.exit(1);
  // Recorded open-drift is fail-loud in the report but does not block CI
  // until --require-aligned. Lying about aligned (status vs observed) already
  // lands in mismatches and exits 1 above via the status checks.
  const lying = report.mismatches.some(
    (m) => /status is aligned/.test(m.reason) || /status is open-drift but every/.test(m.reason),
  );
  if (lying) process.exit(1);
  process.exit(0);
}

function runProbe(asDump) {
  const pins = loadPins();
  const pin = pins.sharedPins['docker.client']?.pin;
  let raw;
  try {
    raw = execFileSync('docker', ['--version'], { encoding: 'utf8' }).trim();
  } catch {
    if (asDump) fail('docker --version not available on this host');
    console.log('check-dev-env-pins: SKIP docker not on PATH (Cursor Cloud is not Win11 or Spark)');
    process.exit(2);
  }
  const version = parseDockerVersion(raw);
  const dump = {
    environment: process.env.DWS_ENV_PIN_NAME || 'unknown',
    capturedAt: new Date().toISOString().slice(0, 10),
    tools: { 'docker.client': version },
    raw,
  };
  if (asDump) {
    console.log(JSON.stringify(dump, null, 2));
    process.exit(version === pin ? 0 : 1);
  }
  if (!version) fail(`could not parse docker --version: ${raw}`);
  const ok = version === pin;
  console.log(`probe docker.client local=${version} pin=${pin} ${ok ? 'OK' : 'DRIFT'}`);
  process.exit(ok ? 0 : 1);
}

function loadDump(p) {
  const abs = path.isAbsolute(p) ? p : path.join(ROOT, p);
  if (!fs.existsSync(abs)) fail(`dump missing: ${p}`);
  return JSON.parse(fs.readFileSync(abs, 'utf8'));
}

function runCompare() {
  if (positional.length < 2) fail('--compare needs two dump JSON paths');
  const pins = loadPins();
  const a = loadDump(positional[0]);
  const b = loadDump(positional[1]);
  const pin = pins.sharedPins['docker.client']?.pin;
  const va = a.tools?.['docker.client'];
  const vb = b.tools?.['docker.client'];
  const mismatches = [];
  if (!va) mismatches.push(`${positional[0]} missing tools.docker.client`);
  if (!vb) mismatches.push(`${positional[1]} missing tools.docker.client`);
  if (va && vb && va !== vb) {
    mismatches.push(`docker.client ${positional[0]}=${va} ${positional[1]}=${vb}`);
  }
  if (va && pin && va !== pin) mismatches.push(`${positional[0]} ${va} ≠ pin ${pin}`);
  if (vb && pin && vb !== pin) mismatches.push(`${positional[1]} ${vb} ≠ pin ${pin}`);
  if (opt.json) {
    console.log(
      JSON.stringify({ ok: mismatches.length === 0, pin, a: va, b: vb, mismatches }, null, 2),
    );
  } else if (mismatches.length) {
    for (const m of mismatches) console.log(`✖ ${m}`);
  } else {
    console.log(`✔ docker.client ${va} matches pin ${pin} on both dumps`);
  }
  process.exit(mismatches.length ? 1 : 0);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (isMain) {
  if (opt.compare) runCompare();
  else if (opt.dump) runProbe(true);
  else if (opt.probe) runProbe(false);
  else runCheck();
}
