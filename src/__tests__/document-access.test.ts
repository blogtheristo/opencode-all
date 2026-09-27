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
const CUSTOMER_ADMIN = 'admin@dws10.com';
const END_USER = 'user@dws10.com';

const ALL_CLASSES = ['public', 'user', 'customer', 'internal', 'confidential'];

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
      expect(grantsFor(email)).toEqual(ALL_CLASSES);
      expect(highestGrant(email)).toBe('confidential');
    }
  });

  it('matches a principal regardless of case or padding', () => {
    expect(grantsFor('  Admin@DWS6.com ')).toContain('confidential');
  });

  it('limits the DWS10 customer administrator to customer level', () => {
    expect(grantsFor(CUSTOMER_ADMIN)).toEqual(['public', 'user', 'customer']);
    expect(highestGrant(CUSTOMER_ADMIN)).toBe('customer');
  });

  it('limits the DWS10 end user to the user manual', () => {
    expect(grantsFor(END_USER)).toEqual(['public', 'user']);
    expect(highestGrant(END_USER)).toBe('user');
  });

  it('lets the customer administrator open a whitepaper but not the cap table', () => {
    expect(
      canOpen('Learn/2026-03-17-shufti-kya-whitepaper_v1.0.html', CUSTOMER_ADMIN).allowed,
    ).toBe(true);
    expect(
      canOpen('Learn/022c_LT_InvestorQA_CapTable_SAFE_IP_2026.html', CUSTOMER_ADMIN).allowed,
    ).toBe(false);
    expect(canOpen('Learn/ADMIN_MANUAL.html', CUSTOMER_ADMIN).allowed).toBe(false);
  });

  // The whole point of splitting 'user' out of 'customer': the end user reads
  // the manual, the customer admin also reads how to administer the platform.
  it('separates the end user from the customer administrator', () => {
    expect(classifyDocument('docs/USER_MANUAL.md').class).toBe('user');
    expect(classifyDocument('Admin/CUSTOMER_ADMIN_MANUAL.md').class).toBe('customer');

    expect(canOpen('docs/USER_MANUAL.md', END_USER).allowed).toBe(true);
    expect(canOpen('Admin/CUSTOMER_ADMIN_MANUAL.md', END_USER).allowed).toBe(false);

    expect(canOpen('docs/USER_MANUAL.md', CUSTOMER_ADMIN).allowed).toBe(true);
    expect(canOpen('Admin/CUSTOMER_ADMIN_MANUAL.md', CUSTOMER_ADMIN).allowed).toBe(true);
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

  it('refuses traversal that lands back inside the repo', () => {
    // One level up normalises to '.env' — the root check must see that, not 'Learn/…'.
    expect(resolveDocumentPath(ROOT, 'Learn/../.env')).toBeNull();
    expect(resolveDocumentPath(ROOT, 'Learn/foo/../../secret.env')).toBeNull();
    // Hopping between allowed roots would read Admin/ under Learn/'s class.
    expect(resolveDocumentPath(ROOT, 'Learn/x/../../Admin/ADMIN_MANUAL.md')).toBeNull();
    expect(resolveDocumentPath(ROOT, 'Learn/./start.html')).toBeNull();
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
