/**
 * Smart Factory for Sales — unit tests (pure logic: catalog, match, channels).
 * No Supabase/network access required.
 */

import { describe, expect, it } from 'vitest';
import {
  normalizeCatalog,
  normalizeProduct,
  parseCatalog,
  tokenize,
} from '../smart-factory/catalog.js';
import {
  dedupKeyFor,
  MATCH_THRESHOLD,
  matchAll,
  scoreProspectForProduct,
} from '../smart-factory/match.js';
import { composeMessage, planChannels } from '../smart-factory/channels.js';
import type { MatchedProspect, ProspectCandidate } from '../smart-factory/types.js';

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

describe('smart-factory catalog', () => {
  const raw = [
    {
      id: 'P1',
      name: 'CBAM Reporting Tool',
      description: 'Carbon Border Adjustment reporting for steel importers under CBAM and ETS',
      features: ['Emission accounting', 'Audit trail'],
    },
    { id: 'P2', name: 'Fleet GLEC Tracker' },
  ];

  it('parses array shape', () => {
    expect(parseCatalog(raw)).toHaveLength(2);
  });

  it('parses { products: [...] } shape', () => {
    expect(parseCatalog({ products: raw })).toHaveLength(2);
  });

  it('parses DWS store map shape', () => {
    const map = { products: { SKU1: { id: 'SKU1', name: 'X' }, SKU2: { name: 'Y' } } };
    const parsed = parseCatalog(map);
    expect(parsed).toHaveLength(2);
    expect(parsed[1].id).toBe('SKU2'); // falls back to map key
  });

  it('throws on unusable shape (fail loud)', () => {
    expect(() => parseCatalog({ nope: true })).toThrow(/Unsupported catalog format/);
  });

  it('tokenizes with stopwords + short tokens removed', () => {
    expect(tokenize('The Carbon Reporting for you and me')).toEqual(['carbon', 'reporting']);
  });

  it('normalizes product into keywords, industries, regulations', () => {
    const p = normalizeProduct({
      id: 'P1',
      name: 'CBAM Reporting Tool',
      description: 'carbon border adjustment reporting for steel importers under CBAM',
    });
    expect(p.keywords).toContain('cbam');
    expect(p.keywords).toContain('steel');
    expect(p.regulations).toContain('CBAM');
    expect(p.industries).toContain('steel');
  });

  it('skips products without id or name', () => {
    const out = normalizeCatalog([{ id: '', name: 'x' }, { id: 'ok', name: 'OK' }] as never);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('ok');
  });
});

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

describe('smart-factory matching', () => {
  const product = normalizeProduct({
    id: 'P1',
    name: 'CBAM Compliance Suite',
    description: 'CBAM carbon reporting for steel importers, ETS emissions accounting',
    features: ['audit trail'],
  });

  const prospect: ProspectCandidate = {
    orgName: 'Nord Steel Oy',
    domain: 'nordsteel.fi',
    industry: 'steel',
    countryCode: 'FI',
    signals: ['CBAM reporting obligations for imported steel', 'ETS phase 4 exposure'],
    source: 'test',
  };

  it('scores strong signal overlap above threshold with reason', () => {
    const m = scoreProspectForProduct(prospect, product);
    expect(m).not.toBeNull();
    expect(m!.score).toBeGreaterThanOrEqual(MATCH_THRESHOLD);
    expect(m!.productId).toBe('P1');
    expect(m!.reason.toLowerCase()).toMatch(/match|regulation|industry/);
  });

  it('returns null below threshold', () => {
    const m = scoreProspectForProduct(
      { orgName: 'Bakery Zante', industry: 'food', source: 't' },
      product,
    );
    expect(m).toBeNull();
  });

  it('dedupKey prefers domain over email over orgName', () => {
    expect(dedupKeyFor({ orgName: 'A', domain: 'a.com', email: 'b@c.de', source: 's' })).toBe('a.com');
    expect(dedupKeyFor({ orgName: 'A', email: 'B@C.DE', source: 's' })).toBe('b@c.de');
    expect(dedupKeyFor({ orgName: 'Org Name', source: 's' })).toBe('org name');
  });

  it('matchAll keeps only matched prospects sorted by fit', () => {
    const matched = matchAll([prospect, { orgName: 'No Fit GmbH', source: 't' }], [product]);
    expect(matched).toHaveLength(1);
    expect(matched[0].orgName).toBe('Nord Steel Oy');
    expect(matched[0].dedupKey).toBe('nordsteel.fi');
  });
});

// ---------------------------------------------------------------------------
// Channels
// ---------------------------------------------------------------------------

function makeMatched(partial: Partial<ProspectCandidate>): MatchedProspect {
  return {
    orgName: partial.orgName || 'Test Org',
    source: 'test',
    dedupKey: 'test',
    matches: [
      {
        productId: 'P1',
        productName: 'CBAM Compliance Suite',
        score: 0.8,
        reason: 'matches: cbam, steel · regulation exposure: CBAM',
      },
    ],
    fitScore: 0.8,
    ...partial,
  } as MatchedProspect;
}

describe('smart-factory channels', () => {
  const enabled: Array<'email' | 'whatsapp' | 'linkedin' | 'facebook'> = [
    'email',
    'whatsapp',
    'linkedin',
    'facebook',
  ];

  it('routes only channels with contact info; linkedin/facebook never automatable', () => {
    const plan = planChannels(
      makeMatched({ email: 'a@b.fi', phone: '+358401234567', linkedinUrl: 'https://linkedin.com/in/x' }),
      enabled,
    );
    const byChannel = new Map(plan.map((p) => [p.channel, p]));
    expect(byChannel.get('email')?.automatable).toBe(true);
    expect(byChannel.get('linkedin')?.automatable).toBe(false);
    expect(byChannel.has('facebook')).toBe(false); // no facebookUrl
  });

  it('respects campaign-enabled channel subset', () => {
    const plan = planChannels(makeMatched({ email: 'a@b.fi' }), ['email']);
    expect(plan.map((p) => p.channel)).toEqual(['email']);
  });

  it('composes English message anchored to best match', () => {
    const msg = composeMessage(
      makeMatched({ contactName: 'Maija Meikäläinen', countryCode: 'US', signals: ['CSRD gap'] }),
      'prospect-1',
      'campaign-1',
      'email',
    );
    expect(msg).not.toBeNull();
    expect(msg!.prospectId).toBe('prospect-1');
    expect(msg!.channel).toBe('email');
    expect(msg!.subject).toContain('CBAM Compliance Suite');
    expect(msg!.body).toMatch(/^Hi Maija,/);
    expect(msg!.body).toContain('20-minute call');
  });

  it('composes Finnish message for FI prospects', () => {
    const msg = composeMessage(
      makeMatched({ contactName: 'Matti Virtanen', countryCode: 'FI' }),
      'prospect-2',
      'campaign-1',
      'email',
    );
    expect(msg!.subject).toContain('ajankohtainen');
    expect(msg!.body).toMatch(/^Hei Matti,/);
  });
});
