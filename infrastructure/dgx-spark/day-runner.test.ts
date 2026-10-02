// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=undisclosed-by-runtime-policy Agent=copilot Date=2026-09-27
// Audit trail: git log -- infrastructure/dgx-spark/day-runner.test.ts

import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const RUNNER = join(TEST_DIR, 'day-runner.sh');
const REPO_ROOT = resolve(TEST_DIR, '../..');
const ARTIFACT_ROOT = join(REPO_ROOT, 'node_modules', '.cache');
const SCHEDULES = ['daily', 'weekly', 'hourly'] as const;

let fixtureRoot: string;

function writeExecutable(path: string, content: string): void {
  writeFileSync(path, content);
  chmodSync(path, 0o755);
}

function runDayRunner() {
  return spawnSync('bash', [RUNNER], {
    cwd: fixtureRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      DWS_REPO_DIR: fixtureRoot,
      PATH: `${join(fixtureRoot, 'bin')}:${process.env.PATH}`,
    },
  });
}

beforeEach(() => {
  mkdirSync(ARTIFACT_ROOT, { recursive: true });
  fixtureRoot = mkdtempSync(join(ARTIFACT_ROOT, 'day-runner-'));

  for (const path of [
    'bin',
    'infrastructure/dgx-spark',
    'scripts/daily',
    'scripts/hourly',
    'scripts/weekly',
    'scripts/on-deploy',
  ]) {
    mkdirSync(join(fixtureRoot, path), { recursive: true });
  }

  writeExecutable(
    join(fixtureRoot, 'bin', 'date'),
    `#!/usr/bin/env bash
case "\${*: -1}" in
  +%H:%M) echo "04:00" ;;
  +%Y-%m-%d) echo "2026-09-27" ;;
  +%Y-%m-%d-%H) echo "2026-09-27-04" ;;
  +%H) echo "04" ;;
  +%Y-W%V) echo "2026-W39" ;;
  +%u) echo "7" ;;
  *) /usr/bin/date "$@" ;;
esac
`,
  );
  writeExecutable(
    join(fixtureRoot, 'bin', 'git'),
    `#!/usr/bin/env bash
case "$1 $2" in
  "rev-parse HEAD"|"rev-parse origin/main") echo "1111111111111111111111111111111111111111" ;;
  "fetch origin") exit 0 ;;
  *) exit 0 ;;
esac
`,
  );
  writeExecutable(
    join(fixtureRoot, 'bin', 'docker'),
    `#!/usr/bin/env bash
exit 0
`,
  );

  for (const schedule of SCHEDULES) {
    writeExecutable(
      join(fixtureRoot, `scripts/${schedule}/01-fails.sh`),
      `#!/usr/bin/env bash
count_file="${join(fixtureRoot, `${schedule}-failed-count`)}"
count=$(cat "$count_file" 2>/dev/null || echo 0)
echo $((count + 1)) > "$count_file"
echo "intentional failure"
exit 7
`,
    );
    writeExecutable(
      join(fixtureRoot, `scripts/${schedule}/02-succeeds.sh`),
      `#!/usr/bin/env bash
count_file="${join(fixtureRoot, `${schedule}-success-count`)}"
count=$(cat "$count_file" 2>/dev/null || echo 0)
echo $((count + 1)) > "$count_file"
echo "success"
`,
    );
  }
});

afterEach(() => {
  rmSync(fixtureRoot, { recursive: true, force: true });
});

describe('DGX day runner scheduled job state', () => {
  it('marks successes, leaves failures retryable, continues later scripts, and exits nonzero', () => {
    const first = runDayRunner();

    expect(first.status).toBe(1);
    expect(first.stdout).toContain('FAILED: 01-fails.sh (exit 7)');
    expect(first.stdout).toContain(
      'Done with 3 failed script(s); failed scheduled jobs remain eligible for retry.',
    );

    const firstState = JSON.parse(
      readFileSync(join(fixtureRoot, 'logs/day-runner-state.json'), 'utf8'),
    ) as Record<string, string>;
    const periods = {
      daily: '2026-09-27',
      weekly: '2026-W39',
      hourly: '2026-09-27-04',
    };
    for (const schedule of SCHEDULES) {
      expect(readFileSync(join(fixtureRoot, `${schedule}-failed-count`), 'utf8').trim()).toBe('1');
      expect(readFileSync(join(fixtureRoot, `${schedule}-success-count`), 'utf8').trim()).toBe('1');
      expect(firstState[`${schedule}:02-succeeds.sh`]).toBe(periods[schedule]);
      expect(firstState).not.toHaveProperty(`${schedule}:01-fails.sh`);
    }

    const second = runDayRunner();

    expect(second.status).toBe(1);
    for (const schedule of SCHEDULES) {
      expect(readFileSync(join(fixtureRoot, `${schedule}-failed-count`), 'utf8').trim()).toBe('2');
      expect(readFileSync(join(fixtureRoot, `${schedule}-success-count`), 'utf8').trim()).toBe('1');
    }
  });
});
