/**
 * Deterministic KYA-S1 ATS fixtures for the executable conformance baseline.
 */
export interface TestSnapshot<TInput = unknown, TExpected = unknown> {
  id: string;
  name: string;
  description: string;
  input: TInput;
  expected: TExpected;
  timestamp: string;
  version: string;
}

interface TrustScoreInput {
  score: number;
}

interface TrustScoreExpected {
  permission: 'FULL_SANDBOX' | 'RESTRICTED' | 'SUSPENDED';
  fullSandboxAuthorized: boolean;
  restrictedActionAuthorized: boolean;
}

type TrustScoreSnapshot = TestSnapshot<TrustScoreInput, TrustScoreExpected>;

export const KYA_TRUST_SCORE_SNAPSHOTS: TrustScoreSnapshot[] = [
  {
    id: 'trs-001',
    name: 'High ATS - Full Sandbox',
    description: 'ATS 0.95 receives full-sandbox permission.',
    input: { score: 0.95 },
    expected: {
      permission: 'FULL_SANDBOX',
      fullSandboxAuthorized: true,
      restrictedActionAuthorized: true,
    },
    timestamp: '2026-08-14T00:00:00Z',
    version: '1.1.0',
  },
  {
    id: 'trs-002',
    name: 'Medium ATS - Restricted',
    description: 'ATS 0.75 receives restricted permission.',
    input: { score: 0.75 },
    expected: {
      permission: 'RESTRICTED',
      fullSandboxAuthorized: false,
      restrictedActionAuthorized: true,
    },
    timestamp: '2026-08-14T00:00:00Z',
    version: '1.1.0',
  },
  {
    id: 'trs-003',
    name: 'Low ATS - Suspended',
    description: 'ATS 0.49 is suspended and denied authorization.',
    input: { score: 0.49 },
    expected: {
      permission: 'SUSPENDED',
      fullSandboxAuthorized: false,
      restrictedActionAuthorized: false,
    },
    timestamp: '2026-08-14T00:00:00Z',
    version: '1.1.0',
  },
  {
    id: 'trs-004',
    name: 'Full-Sandbox Boundary',
    description: 'ATS 0.80 is the inclusive full-sandbox boundary.',
    input: { score: 0.8 },
    expected: {
      permission: 'FULL_SANDBOX',
      fullSandboxAuthorized: true,
      restrictedActionAuthorized: true,
    },
    timestamp: '2026-08-14T00:00:00Z',
    version: '1.1.0',
  },
  {
    id: 'trs-005',
    name: 'Restricted Boundary',
    description: 'ATS 0.50 is the inclusive restricted boundary.',
    input: { score: 0.5 },
    expected: {
      permission: 'RESTRICTED',
      fullSandboxAuthorized: false,
      restrictedActionAuthorized: true,
    },
    timestamp: '2026-08-14T00:00:00Z',
    version: '1.1.0',
  },
];

export function getSnapshotById(id: string): TrustScoreSnapshot | null {
  return KYA_TRUST_SCORE_SNAPSHOTS.find((snapshot) => snapshot.id === id) ?? null;
}

export function getSnapshotsByCategory(category: string): TrustScoreSnapshot[] {
  return category === 'trs' ? KYA_TRUST_SCORE_SNAPSHOTS : [];
}
