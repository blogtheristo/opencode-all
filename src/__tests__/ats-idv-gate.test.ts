import { describe, expect, it } from 'vitest';

import { calculateATS } from '../identity/ats-engine.js';
import type { CapabilityManifest, IdvState, TelemetryEntry } from '../identity/types.js';

/**
 * KYA-S1 v1.3 TRS-1 — IDV state is a required input to the trust score.
 *
 * These tests assert the intent, not just the arithmetic: revoking the human
 * principal must collapse the score even when the agent's own conduct is
 * spotless and its manifest is valid. Before this gate existed, an IDV
 * revocation left the score untouched — the authorization chain appeared to
 * break in the architecture diagram while continuing to authorize action in
 * fact (`Legal/KYA_S1_REVIEW_v1.3_PROPOSAL.md` Part B, finding B1).
 */

function makeManifest(overrides: Partial<CapabilityManifest> = {}): CapabilityManifest {
  return {
    manifestVersion: '1.3',
    subagentId: 'agent-quality-01',
    sessionId: 'session-abc',
    signedAt: new Date().toISOString(),
    permittedPaths: ['/data/quality'],
    deniedPaths: ['/etc'],
    ttlSeconds: 3600,
    kyaScoreAtSign: 90,
    signature: { verified: true, algorithm: 'ed25519', signedBy: 'operator-risto' },
    ...overrides,
  };
}

function makeIdv(overrides: Partial<IdvState> = {}): IdvState {
  return {
    status: 'verified',
    humanPrincipalId: 'human-risto',
    verifiedAt: new Date().toISOString(),
    ttlSeconds: 900,
    provider: 'signicat',
    levelOfAssurance: 'high',
    ...overrides,
  };
}

/** Clean telemetry: no violations, no denials, fast — nothing the agent did is at fault. */
function cleanTelemetry(): TelemetryEntry[] {
  return [
    {
      timestamp: new Date().toISOString(),
      sessionId: 'session-abc',
      subagentId: 'agent-quality-01',
      event: 'PATH_ACCESS',
      path: '/data/quality/batch-402',
      status: 'ALLOWED',
      latency: 40,
    },
  ];
}

describe('calculateATS — IDV gate (TRS-1)', () => {
  it('grants full permission when the principal is verified and the manifest is valid', () => {
    const result = calculateATS(makeManifest(), cleanTelemetry(), makeIdv());

    expect(result.score).toBe(1.0);
    expect(result.decision).toBe('GO');
    expect(result.permissionLevel).toBe('full');
    expect(result.breakdown.idvValid).toBe(true);
    expect(result.breakdown.idvStatus).toBe('verified');
    expect(result.breakdown.humanPrincipalId).toBe('human-risto');
  });

  it('collapses the score to zero when the human principal is revoked', () => {
    // The acceptance criterion for finding B1: valid manifest, blameless agent,
    // revoked human. The score must not survive this.
    const result = calculateATS(makeManifest(), cleanTelemetry(), makeIdv({ status: 'revoked' }));

    expect(result.score).toBe(0);
    expect(result.decision).toBe('NO_GO');
    expect(result.permissionLevel).toBe('frozen');
    expect(result.breakdown.idvValid).toBe(false);
    expect(result.breakdown.idvStatus).toBe('revoked');
    // The manifest was never the problem — the breakdown must say so, or the
    // operator will chase the wrong cause.
    expect(result.breakdown.manifestValid).toBe(true);
  });

  it('collapses the score when the attestation is stale, and reports it as expired', () => {
    const staleAt = new Date(Date.now() - 3600 * 1000).toISOString();
    const result = calculateATS(
      makeManifest(),
      cleanTelemetry(),
      makeIdv({ status: 'verified', verifiedAt: staleAt, ttlSeconds: 60 }),
    );

    expect(result.score).toBe(0);
    expect(result.decision).toBe('NO_GO');
    expect(result.breakdown.idvValid).toBe(false);
    // A lapsed re-attestation (IDV-3) must be distinguishable from a
    // revocation (IDV-4) — they call for different operator responses.
    expect(result.breakdown.idvStatus).toBe('expired');
  });

  it('fails closed on an unknown IDV status', () => {
    const result = calculateATS(makeManifest(), cleanTelemetry(), makeIdv({ status: 'unknown' }));

    expect(result.score).toBe(0);
    expect(result.decision).toBe('NO_GO');
    expect(result.breakdown.idvValid).toBe(false);
    expect(result.breakdown.idvStatus).toBe('unknown');
  });

  it('fails closed on a malformed verification timestamp rather than treating it as fresh', () => {
    const result = calculateATS(
      makeManifest(),
      cleanTelemetry(),
      makeIdv({ verifiedAt: 'not-a-date' }),
    );

    expect(result.score).toBe(0);
    expect(result.breakdown.idvValid).toBe(false);
    expect(result.breakdown.idvStatus).toBe('expired');
  });

  it('fails closed on a zero or negative TTL instead of granting unbounded validity', () => {
    for (const ttlSeconds of [0, -1]) {
      const result = calculateATS(makeManifest(), cleanTelemetry(), makeIdv({ ttlSeconds }));
      expect(result.score).toBe(0);
      expect(result.breakdown.idvValid).toBe(false);
    }
  });

  it('still kills an invalid manifest, and reports both limbs independently', () => {
    const result = calculateATS(
      makeManifest({ signature: { verified: false, algorithm: 'ed25519', signedBy: 'unknown' } }),
      cleanTelemetry(),
      makeIdv(),
    );

    expect(result.score).toBe(0);
    expect(result.breakdown.manifestValid).toBe(false);
    // IDV was fine — conflating the two would hide which control fired.
    expect(result.breakdown.idvValid).toBe(true);
  });

  it('scores agent conduct normally once both hard kills pass', () => {
    const telemetry: TelemetryEntry[] = [
      ...cleanTelemetry(),
      {
        timestamp: new Date().toISOString(),
        sessionId: 'session-abc',
        subagentId: 'agent-quality-01',
        event: 'KYA_VIOLATION',
        status: 'DENIED',
        latency: 20,
      },
    ];

    const result = calculateATS(makeManifest(), telemetry, makeIdv());

    // 1.0 − (1 violation × 0.25) − (1 denied × 0.05) = 0.70
    expect(result.score).toBeCloseTo(0.7, 10);
    expect(result.breakdown.violationCount).toBe(1);
    expect(result.breakdown.deniedAttemptCount).toBe(1);
    expect(result.breakdown.idvValid).toBe(true);
  });
});
