import { describe, expect, it } from 'vitest';

import { evaluateMandateGate, validateTenantGatingProfile } from '../identity/ats-engine.js';
import type {
  ATSResult,
  CapabilityManifest,
  MandateGateRequest,
  SpendAuthority,
  TenantGatingProfile,
} from '../identity/types.js';

function makeAuthority(overrides: Partial<SpendAuthority> = {}): SpendAuthority {
  return {
    currency: 'EUR',
    perTaskCeiling: 100,
    perDayCeiling: 500,
    allowedMerchantCategories: ['cloud-compute', 'data-services'],
    mandateTypesAllowed: ['intent', 'cart', 'payment'],
    humanNotPresent: true,
    protocols: ['ap2', 'acp', 'ucp'],
    hic: 'human-risto-verified',
    ...overrides,
  };
}

function makeManifest(spendAuthority?: SpendAuthority): CapabilityManifest {
  return {
    manifestVersion: '1.3',
    subagentId: 'agent-1',
    sessionId: 'session-1',
    signedAt: new Date().toISOString(),
    permittedPaths: ['/mock-api/'],
    deniedPaths: ['/prod-secrets/'],
    ttlSeconds: 3600,
    kyaScoreAtSign: 92,
    signature: { verified: true, algorithm: 'ed25519', signedBy: 'operator' },
    spendAuthority,
  };
}

function makeAts(score: number): ATSResult {
  return {
    score,
    kyaScore: Math.round(score * 100),
    permissionLevel: score >= 0.8 ? 'full' : score >= 0.5 ? 'restricted' : 'suspended',
    breakdown: {
      baseScore: 1.0,
      violationPenalty: 0,
      latencyPenalty: 0,
      overreachPenalty: 0,
      manifestValid: true,
      violationCount: 0,
      deniedAttemptCount: 0,
      avgLatencyMs: 50,
    },
    calculatedAt: new Date().toISOString(),
    decision: score >= 0.5 ? 'GO' : 'NO_GO',
  };
}

function makeRequest(overrides: Partial<MandateGateRequest> = {}): MandateGateRequest {
  return {
    mandateType: 'payment',
    protocol: 'ap2',
    amount: 50,
    currency: 'EUR',
    merchantCategory: 'cloud-compute',
    humanPresent: true,
    spentTodayTotal: 0,
    ...overrides,
  };
}

function makeProfile(overrides: Partial<TenantGatingProfile> = {}): TenantGatingProfile {
  return {
    profileVersion: '1.0',
    tenantId: 'tenant-1',
    hnpMinAts: 0.9,
    hnpEnabled: true,
    ...overrides,
  };
}

describe('evaluateMandateGate — deny-by-default (§14.3)', () => {
  it('denies when the manifest has no spend_authority block', () => {
    const decision = evaluateMandateGate(makeManifest(undefined), makeAts(0.95), makeRequest());
    expect(decision.allowed).toBe(false);
    expect(decision.kyaViolation).toBe(false);
    expect(decision.reason).toContain('deny-by-default');
  });

  it('denies anonymous spend authority (missing HIC binding)', () => {
    const decision = evaluateMandateGate(
      makeManifest(makeAuthority({ hic: '  ' })),
      makeAts(0.95),
      makeRequest(),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toContain('HIC');
  });
});

describe('evaluateMandateGate — ATS bands (§14.2)', () => {
  it('denies all mandates below ATS 0.50 and flags a KYA Violation', () => {
    const decision = evaluateMandateGate(
      makeManifest(makeAuthority()),
      makeAts(0.4),
      makeRequest({ mandateType: 'intent' }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.kyaViolation).toBe(true);
  });

  it('allows intent and cart but not payment in the 0.50–0.79 band', () => {
    const manifest = makeManifest(makeAuthority());
    const ats = makeAts(0.65);

    expect(evaluateMandateGate(manifest, ats, makeRequest({ mandateType: 'intent' })).allowed).toBe(
      true,
    );
    expect(evaluateMandateGate(manifest, ats, makeRequest({ mandateType: 'cart' })).allowed).toBe(
      true,
    );

    const payment = evaluateMandateGate(manifest, ats, makeRequest({ mandateType: 'payment' }));
    expect(payment.allowed).toBe(false);
    // In-band limitation, not a violation — the agent asked, the gate said no
    expect(payment.kyaViolation).toBe(false);
  });

  it('allows payment with human present in the 0.80–0.89 band, but denies HNP', () => {
    const manifest = makeManifest(makeAuthority());
    const ats = makeAts(0.85);

    expect(evaluateMandateGate(manifest, ats, makeRequest()).allowed).toBe(true);

    const hnp = evaluateMandateGate(manifest, ats, makeRequest({ humanPresent: false }));
    expect(hnp.allowed).toBe(false);
    expect(hnp.reason).toContain('Human Not Present');
  });

  it('allows Human Not Present at ATS >= 0.90 within ceilings', () => {
    const decision = evaluateMandateGate(
      makeManifest(makeAuthority()),
      makeAts(0.95),
      makeRequest({ humanPresent: false }),
    );
    expect(decision.allowed).toBe(true);
    expect(decision.requiresHumanConfirmation).toBe(false);
  });

  it('denies HNP when spend_authority itself does not grant it', () => {
    const decision = evaluateMandateGate(
      makeManifest(makeAuthority({ humanNotPresent: false })),
      makeAts(0.95),
      makeRequest({ humanPresent: false }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toContain('not granted by spend_authority');
  });
});

describe('evaluateMandateGate — authority scope and ceilings (§14.2/§14.3)', () => {
  it('flags a KYA Violation for a mandate type outside the signed authority', () => {
    const decision = evaluateMandateGate(
      makeManifest(makeAuthority({ mandateTypesAllowed: ['intent', 'cart'] })),
      makeAts(0.95),
      makeRequest({ mandateType: 'payment' }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.kyaViolation).toBe(true);
  });

  it('flags a KYA Violation for an unlisted protocol rail', () => {
    const decision = evaluateMandateGate(
      makeManifest(makeAuthority({ protocols: ['ap2'] })),
      makeAts(0.95),
      makeRequest({ protocol: 'acp' }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.kyaViolation).toBe(true);
  });

  it('flags a KYA Violation on currency mismatch', () => {
    const decision = evaluateMandateGate(
      makeManifest(makeAuthority()),
      makeAts(0.95),
      makeRequest({ currency: 'USD' }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.kyaViolation).toBe(true);
  });

  it('flags a KYA Violation for a disallowed merchant category', () => {
    const decision = evaluateMandateGate(
      makeManifest(makeAuthority()),
      makeAts(0.95),
      makeRequest({ merchantCategory: 'luxury-goods' }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.kyaViolation).toBe(true);
  });

  it('flags a KYA Violation above the per-task ceiling', () => {
    const decision = evaluateMandateGate(
      makeManifest(makeAuthority({ perTaskCeiling: 100 })),
      makeAts(0.95),
      makeRequest({ amount: 101 }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.kyaViolation).toBe(true);
  });

  it('flags a KYA Violation when the day total would breach the per-day ceiling', () => {
    const decision = evaluateMandateGate(
      makeManifest(makeAuthority({ perDayCeiling: 500 })),
      makeAts(0.95),
      makeRequest({ amount: 60, spentTodayTotal: 450 }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.kyaViolation).toBe(true);
  });
});

describe('evaluateMandateGate — tenant policy profiles (§14.2.1)', () => {
  it('rejects a loosening profile (hnpMinAts below the 0.90 floor)', () => {
    const decision = evaluateMandateGate(
      makeManifest(makeAuthority()),
      makeAts(0.95),
      makeRequest(),
      makeProfile({ hnpMinAts: 0.85 }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toContain('profile');
  });

  it('applies a raised tenant HNP minimum (tighten-only)', () => {
    const profile = makeProfile({ hnpMinAts: 0.95 });
    const belowRaisedFloor = evaluateMandateGate(
      makeManifest(makeAuthority()),
      makeAts(0.92),
      makeRequest({ humanPresent: false }),
      profile,
    );
    expect(belowRaisedFloor.allowed).toBe(false);

    const aboveRaisedFloor = evaluateMandateGate(
      makeManifest(makeAuthority()),
      makeAts(0.97),
      makeRequest({ humanPresent: false }),
      profile,
    );
    expect(aboveRaisedFloor.allowed).toBe(true);
  });

  it('denies HNP entirely when the tenant profile disables it (Aegis default), even at high ATS', () => {
    const decision = evaluateMandateGate(
      makeManifest(makeAuthority()),
      makeAts(0.99),
      makeRequest({ humanPresent: false }),
      makeProfile({ hnpEnabled: false }),
    );
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toContain('disabled by tenant gating profile');
  });

  it('requires human confirmation above the tenant confirm threshold in the 0.80–0.89 band', () => {
    const profile = makeProfile({ confirmAbove: 50 });
    const decision = evaluateMandateGate(
      makeManifest(makeAuthority()),
      makeAts(0.85),
      makeRequest({ amount: 75 }),
      profile,
    );
    expect(decision.allowed).toBe(true);
    expect(decision.requiresHumanConfirmation).toBe(true);

    const small = evaluateMandateGate(
      makeManifest(makeAuthority()),
      makeAts(0.85),
      makeRequest({ amount: 25 }),
      profile,
    );
    expect(small.allowed).toBe(true);
    expect(small.requiresHumanConfirmation).toBe(false);
  });

  it('does not require confirmation above the tenant threshold once in the HNP band', () => {
    const decision = evaluateMandateGate(
      makeManifest(makeAuthority()),
      makeAts(0.95),
      makeRequest({ amount: 75 }),
      makeProfile({ confirmAbove: 50 }),
    );
    expect(decision.allowed).toBe(true);
    expect(decision.requiresHumanConfirmation).toBe(false);
  });
});

describe('validateTenantGatingProfile — tighten-only rule (§14.2.1)', () => {
  it('accepts a valid profile at or above the floors', () => {
    expect(() => validateTenantGatingProfile(makeProfile({ hnpMinAts: 0.9 }))).not.toThrow();
    expect(() => validateTenantGatingProfile(makeProfile({ hnpMinAts: 0.99 }))).not.toThrow();
  });

  it('throws on a profile attempting to lower the HNP floor', () => {
    expect(() => validateTenantGatingProfile(makeProfile({ hnpMinAts: 0.8 }))).toThrow(
      /platform floor/,
    );
  });

  it('throws on a malformed profile', () => {
    expect(() => validateTenantGatingProfile({ tenantId: '' })).toThrow();
  });
});
