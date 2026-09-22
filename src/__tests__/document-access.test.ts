import { describe, expect, it } from 'vitest';
import {
  canOpen,
  classifyDocument,
  grantsFor,
  highestGrant,
  resolveDocumentPath,
} from '../services/document-access.js';

const FULL = 'admin@dws6.com';
const FOUNDER = 'risto.paarni2024@lifetime.fi';
const CUSTOMER_VIEW = 'admin@dws10.com';

describe('document classification', () => {
  it('marks investor and cap-table material confidential', () => {
    expect(classifyDocument('Learn/022c_LT_InvestorQA_CapTable_SAFE_IP_2026.html').class).toBe(
      'confidential',
    );
    expect(classifyDocument('Learn/022_LT_DueDiligence_CleanReport_2026.html').class).toBe(
      'confidential',
    );
  });

  it('marks board minutes, salary and time records confidential', () => {
    expect(classifyDocument('Learn/F_Liite0_Hallituksen_Poytakirja_31122025.html').class).toBe(
      'confidential',
    );
    expect(classifyDocument('Learn/F_Liite8_Palkkavertailu_Viite.html').class).toBe('confidential');
    expect(classifyDocument('Learn/F_Liite_Tuntikirjaukset.html').class).toBe('confidential');
  });

  it('marks live bid material confidential', () => {
    expect(classifyDocument('bids/KEMIRA/KEMIRA_HINTALOMAKE.md').class).toBe('confidential');
  });

  it('marks whitepapers public', () => {
    expect(classifyDocument('Learn/2026-03-17-shufti-kya-whitepaper_v1.0.html').class).toBe(
      'public',
    );
  });

  it('marks admin manuals and standards internal', () => {
    expect(classifyDocument('Learn/ADMIN_MANUAL.html').class).toBe('internal');
    expect(classifyDocument('Admin/ADMIN_MANUAL_DWS6_COM.md').class).toBe('internal');
  });

  // The property that matters most: a new file nobody classified is withheld,
  // not published.
  it('defaults an unmatched path to confidential', () => {
    expect(classifyDocument('Learn/some-brand-new-thing.html').class).toBe('confidential');
  });
});

describe('entitlements', () => {
  it('grants both named administrators every class', () => {
    for (const email of [FULL, FOUNDER]) {
      expect(grantsFor(email)).toEqual(['public', 'customer', 'internal', 'confidential']);
      expect(highestGrant(email)).toBe('confidential');
    }
  });

  it('matches a principal regardless of case or padding', () => {
    expect(grantsFor('  Admin@DWS6.com ')).toContain('confidential');
  });

  it('limits the DWS10 customer view to public and customer material', () => {
    expect(grantsFor(CUSTOMER_VIEW)).toEqual(['public', 'customer']);
    expect(highestGrant(CUSTOMER_VIEW)).toBe('customer');
  });

  it('lets the customer view open a whitepaper but not the cap table', () => {
    expect(canOpen('Learn/2026-03-17-shufti-kya-whitepaper_v1.0.html', CUSTOMER_VIEW).allowed).toBe(
      true,
    );
    expect(
      canOpen('Learn/022c_LT_InvestorQA_CapTable_SAFE_IP_2026.html', CUSTOMER_VIEW).allowed,
    ).toBe(false);
    expect(canOpen('Learn/ADMIN_MANUAL.html', CUSTOMER_VIEW).allowed).toBe(false);
  });

  it('lets the named administrators open the cap table', () => {
    expect(canOpen('Learn/022c_LT_InvestorQA_CapTable_SAFE_IP_2026.html', FULL).allowed).toBe(true);
    expect(canOpen('Learn/022c_LT_InvestorQA_CapTable_SAFE_IP_2026.html', FOUNDER).allowed).toBe(
      true,
    );
  });

  // An org owner is not the founder: role alone never reaches confidential.
  it('never grants confidential by role alone', () => {
    for (const role of ['owner', 'admin', 'member', 'viewer']) {
      expect(grantsFor('someone@example.com', role)).not.toContain('confidential');
    }
    expect(
      canOpen('Learn/F_Liite8_Palkkavertailu_Viite.html', 'someone@example.com', 'owner').allowed,
    ).toBe(false);
  });

  it('grants nothing to an unknown user with no role', () => {
    expect(grantsFor('stranger@example.com')).toEqual([]);
    expect(grantsFor(null)).toEqual([]);
    expect(highestGrant(null)).toBeNull();
  });
});

describe('path resolution', () => {
  const ROOT = '/repo';

  it('accepts a path under an allowed root', () => {
    expect(resolveDocumentPath(ROOT, 'Learn/start.html')).toBe('/repo/Learn/start.html');
  });

  it('refuses traversal out of the repo', () => {
    expect(resolveDocumentPath(ROOT, '../../etc/passwd')).toBeNull();
    expect(resolveDocumentPath(ROOT, 'Learn/../../.env')).toBeNull();
  });

  it('refuses roots that were never opened up', () => {
    expect(resolveDocumentPath(ROOT, '.env')).toBeNull();
    expect(resolveDocumentPath(ROOT, 'src/config/supabase.ts')).toBeNull();
    expect(resolveDocumentPath(ROOT, 'bids/KEMIRA/KEMIRA_HINTALOMAKE.md')).toBeNull();
  });

  it('refuses absolute paths and null bytes', () => {
    expect(resolveDocumentPath(ROOT, '/etc/passwd')).toBeNull();
    expect(resolveDocumentPath(ROOT, 'C:/Windows/win.ini')).toBeNull();
    expect(resolveDocumentPath(ROOT, 'Learn/start.html\0.txt')).toBeNull();
  });
});
