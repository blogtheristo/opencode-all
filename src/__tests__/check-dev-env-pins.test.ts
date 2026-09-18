import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SCRIPT = path.resolve('scripts/check-dev-env-pins.mjs');
const PINS = path.resolve('config/truth/dev-environment-pins.json');

function run(args: string[], opts?: { pins?: string }) {
  const pins = opts?.pins ?? PINS;
  try {
    const out = execFileSync('node', [SCRIPT, '--pins', pins, ...args], {
      encoding: 'utf8',
    });
    return { code: 0, out };
  } catch (err: unknown) {
    const e = err as { status?: number; stdout?: string; stderr?: string };
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

function writeDump(dir: string, name: string, version: string) {
  const p = path.join(dir, name);
  fs.writeFileSync(
    p,
    JSON.stringify({ environment: name.replace('.json', ''), tools: { 'docker.client': version } }),
  );
  return p;
}

describe('check-dev-env-pins', () => {
  it('records Docker 29.8.0 as the shared pin and Spark 29.2.1 as open drift', () => {
    const pins = JSON.parse(fs.readFileSync(PINS, 'utf8'));
    expect(pins.sharedPins['docker.client'].pin).toBe('29.8.0');
    expect(pins.sharedPins['docker.client'].status).toBe('open-drift');
    expect(pins.sharedPins['docker.client'].observed.win11.version).toBe('29.8.0');
    expect(pins.sharedPins['docker.client'].observed.spark.version).toBe('29.2.1');
    expect(pins.splitPins.aspireCli.pin).toBe('13.5.4');
    expect(pins.splitPins.aspireDashboard.pin).toBe('13.4.2');
  });

  it('exits 0 on the live pin file while open-drift is recorded honestly', () => {
    const r = run([]);
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/open-drift/);
    expect(r.out).toMatch(/spark=29\.2\.1/);
  });

  it('--require-aligned exits 1 while Spark is still 29.2.1', () => {
    const r = run(['--require-aligned']);
    expect(r.code).toBe(1);
  });

  it('--compare of matching 29.8.0 dumps passes', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'env-pins-'));
    try {
      const a = writeDump(dir, 'win11.json', '29.8.0');
      const b = writeDump(dir, 'spark.json', '29.8.0');
      const r = run(['--compare', a, b]);
      expect(r.code).toBe(0);
      expect(r.out).toMatch(/29\.8\.0/);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('--compare of 29.8.0 vs 29.2.1 fails', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'env-pins-'));
    try {
      const a = writeDump(dir, 'win11.json', '29.8.0');
      const b = writeDump(dir, 'spark.json', '29.2.1');
      const r = run(['--compare', a, b]);
      expect(r.code).toBe(1);
      expect(r.out).toMatch(/29\.2\.1/);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('fails when status is aligned but observed versions disagree', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'env-pins-'));
    try {
      const live = JSON.parse(fs.readFileSync(PINS, 'utf8'));
      live.sharedPins['docker.client'].status = 'aligned';
      const fake = path.join(dir, 'pins.json');
      fs.writeFileSync(fake, JSON.stringify(live));
      const r = run([], { pins: fake });
      expect(r.code).toBe(1);
      expect(r.out).toMatch(/status is aligned/);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
