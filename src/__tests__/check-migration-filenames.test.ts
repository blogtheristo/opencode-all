import { describe, expect, it } from 'vitest';
import {
  lintMigrationBasenames,
  parseMigrationFilename,
} from '../../scripts/check-migration-filenames.mjs';

describe('parseMigrationFilename (§4.5)', () => {
  it('accepts NNN_DDMMYY_snake_name.sql', () => {
    expect(parseMigrationFilename('088_190926_advisor_security_linter.sql').ok).toBe(true);
    expect(parseMigrationFilename('002_190126_firehorse_pilot.sql').ok).toBe(true);
  });

  it('rejects legacy number-only names (must be grandfathered, not newly added)', () => {
    expect(parseMigrationFilename('076_revoke_anon_legacy_grants.sql').ok).toBe(false);
    expect(parseMigrationFilename('0095_semantic_graph_schema.sql').ok).toBe(false);
    expect(parseMigrationFilename('run-pending-030-037.sql').ok).toBe(false);
  });

  it('rejects impossible DDMMYY', () => {
    expect(parseMigrationFilename('089_320126_bad_day.sql').reason).toBe('date');
    expect(parseMigrationFilename('089_001326_bad_month.sql').reason).toBe('date');
  });
});

describe('lintMigrationBasenames', () => {
  it('reports only invalid names', () => {
    const failures = lintMigrationBasenames([
      '088_190926_advisor_security_linter.sql',
      '076_revoke_anon_legacy_grants.sql',
    ]);
    expect(failures.map((f) => f.name)).toEqual(['076_revoke_anon_legacy_grants.sql']);
  });
});
