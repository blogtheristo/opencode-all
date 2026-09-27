// Evidence: Tool=Claude Code 2.1.281 Model=anthropic/undisclosed-by-runtime-policy Agent=claude-code-standby Date=2026-09-24
// Audit trail: git log -- src/__tests__/discover-observations-verdict.test.ts
/**
 * DISCOVER intake — ownership verdict whitelist (regression, HIC 24.09.2026).
 *
 * Intent: an unknown verdict is ignored at the door, so "garbage in" can never
 * become immutable garbage after the Decision Journey bridge (migration 093).
 * A known verdict is kept, because it is the evidence for "transfer recommended".
 * Both the dws10.com Pages Function and its landing-pages mirror are checked.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

const MIRRORS = [
  '../../dws10.com/functions/api/observations.js',
  '../../landing-pages/dws10-com/functions/api/observations.js',
];

async function postOwnership(modulePath: string, ownership: unknown) {
  const mod = await import(modulePath);
  let stored: Record<string, unknown> | null = null;
  vi.stubGlobal('fetch', async (_url: string, init: { body: string }) => {
    stored = JSON.parse(init.body);
    return new Response(null, { status: 201 });
  });
  const request = new Request('https://dws10.com/api/observations', {
    method: 'POST',
    headers: { origin: 'https://dws10.com', 'content-type': 'application/json' },
    body: JSON.stringify({ event: 'ownership', id: 'obs-1', ownership }),
  });
  await mod.onRequestPost({
    request,
    env: { SUPABASE_URL: 'https://example.invalid', SUPABASE_SERVICE_KEY: 'test' },
  });
  return stored as unknown as { ownership_map: Record<string, unknown> | null };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe.each(MIRRORS)('DISCOVER observations intake (%s)', (modulePath) => {
  it('keeps a whitelisted verdict (evidence for "transfer recommended")', async () => {
    const row = await postOwnership(modulePath, {
      known: 'partly',
      map: { owner: 'coo', decision: 'cfo' },
      verdict: 'transfer',
    });
    expect(row.ownership_map).toEqual({
      known: 'partly',
      map: { owner: 'coo', decision: 'cfo' },
      verdict: 'transfer',
    });
  });

  it('drops an unknown verdict: unknown -> ignored -> nothing to emit', async () => {
    const row = await postOwnership(modulePath, {
      known: 'partly',
      map: { owner: 'coo', decision: 'cfo' },
      verdict: 'drop_table_hack',
    });
    expect(row.ownership_map?.verdict).toBeNull();
    expect(JSON.stringify(row)).not.toContain('drop_table_hack');
  });

  it('drops unknown roles and dimensions from the ownership map', async () => {
    const row = await postOwnership(modulePath, {
      known: 'yes',
      map: { owner: 'coo', ceo_name: 'Jane Doe', decision: 'not_a_role' },
      verdict: 'aligned',
    });
    expect(row.ownership_map).toEqual({ known: 'yes', map: { owner: 'coo' }, verdict: 'aligned' });
  });
});
