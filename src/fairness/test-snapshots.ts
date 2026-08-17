/**
 * WP3.2 Test Input Snapshots
 * 
 * Input snapshots for KYA Standard conformance testing as defined in WP3.2.
 * These snapshots provide the test data that drives behavioral validation.
 */

export interface TestSnapshot {
  id: string;
  name: string;
  description: string;
  input: any;
  expected: any;
  timestamp: string;
  version: string;
}

/**
 * KYA Standard Trust Score Test Snapshots
 * 
 * These snapshots define the input/output behavior for trust score calculations
 * and validation according to WP3.2 requirements.
 */
export const KYA_TRUST_SCORE_SNAPSHOTS: TestSnapshot[] = [
  {
    id: 'trs-001',
    name: 'High Trust Score - Nominal Authorization',
    description: 'Test case with high trust score (0.95) that should be classified as NOMINAL and allow all actions',
    input: {
      score: 0.95,
      inputs: {
        idvState: 'verified',
        behavioralBaselineDistance: 0.05,
        redTeamPosture: 'low',
        capabilityManifestScope: 'approved'
      }
    },
    expected: {
      state: 'NOMINAL',
      authorized: true,
      actionType: 'NOMINAL_ONLY'
    },
    timestamp: '2026-08-14T00:00:00Z',
    version: '1.0.0'
  },
  {
    id: 'trs-002',
    name: 'Medium Trust Score - Degraded Authorization',
    description: 'Test case with medium trust score (0.75) that should be classified as DEGRADED and allow degraded actions',
    input: {
      score: 0.75,
      inputs: {
        idvState: 'verified',
        behavioralBaselineDistance: 0.15,
        redTeamPosture: 'medium',
        capabilityManifestScope: 'approved'
      }
    },
    expected: {
      state: 'DEGRADED',
      authorized: true,
      actionType: 'DEGRADED_ALLOWED'
    },
    timestamp: '2026-08-14T00:00:00Z',
    version: '1.0.0'
  },
  {
    id: 'trs-003',
    name: 'Low Trust Score - Fail Closed',
    description: 'Test case with low trust score (0.55) that should be classified as FAIL_CLOSED and deny all actions',
    input: {
      score: 0.55,
      inputs: {
        idvState: 'verified',
        behavioralBaselineDistance: 0.30,
        redTeamPosture: 'high',
        capabilityManifestScope: 'approved'
      }
    },
    expected: {
      state: 'FAIL_CLOSED',
      authorized: false,
      actionType: 'NOMINAL_ONLY'
    },
    timestamp: '2026-08-14T00:00:00Z',
    version: '1.0.0'
  },
  {
    id: 'trs-004',
    name: 'Boundary Case - Exact 0.85',
    description: 'Test case with trust score exactly at NOMINAL boundary (0.85)',
    input: {
      score: 0.85,
      inputs: {
        idvState: 'verified',
        behavioralBaselineDistance: 0.01,
        redTeamPosture: 'low',
        capabilityManifestScope: 'approved'
      }
    },
    expected: {
      state: 'NOMINAL',
      authorized: true,
      actionType: 'NOMINAL_ONLY'
    },
    timestamp: '2026-08-14T00:00:00Z',
    version: '1.0.0'
  },
  {
    id: 'trs-005',
    name: 'Boundary Case - Exact 0.60',
    description: 'Test case with trust score exactly at DEGRADED boundary (0.60)',
    input: {
      score: 0.60,
      inputs: {
        idvState: 'verified',
        behavioralBaselineDistance: 0.10,
        redTeamPosture: 'low',
        capabilityManifestScope: 'approved'
      }
    },
    expected: {
      state: 'DEGRADED',
      authorized: true,
      actionType: 'DEGRADED_ALLOWED'
    },
    timestamp: '2026-08-14T00:00:00Z',
    version: '1.0.0'
  }
];

/**
 * KYA Standard Fault Attribution Test Snapshots
 * 
 * These snapshots define the input/output behavior for fault attribution
 * and validation according to WP3.2 requirements.
 */
export const KYA_FAULT_ATTRIBUTION_SNAPSHOTS: TestSnapshot[] = [
  {
    id: 'flt-001',
    name: 'Model Fault Attribution',
    description: 'Test case for model fault attribution with proper taxonomy',
    input: {
      faultType: 'model_fault',
      incidentDetails: {
        timestamp: '2026-08-14T10:00:00Z',
        agentId: 'agent-model-001',
        decision: 'rejected',
        reason: 'incorrect model output'
      }
    },
    expected: {
      taxonomyClass: 'model_fault',
      attributionComplete: true,
      timeToAttribution: '<72h'
    },
    timestamp: '2026-08-14T00:00:00Z',
    version: '1.0.0'
  },
  {
    id: 'flt-002',
    name: 'Operator Fault Attribution',
    description: 'Test case for operator fault attribution with human decision provenance',
    input: {
      faultType: 'operator_fault',
      incidentDetails: {
        timestamp: '2026-08-14T11:00:00Z',
        agentId: 'agent-operator-001',
        humanId: 'user-123',
        decision: 'approved',
        rationale: 'human override of model recommendation'
      }
    },
    expected: {
      taxonomyClass: 'operator_fault',
      attributionComplete: true,
      timeToAttribution: '<72h',
      humanDecisionCaptured: true
    },
    timestamp: '2026-08-14T00:00:00Z',
    version: '1.0.0'
  }
];

/**
 * KYA Standard Identity Verification Test Snapshots
 * 
 * These snapshots define the input/output behavior for identity verification
 * and validation according to WP3.2 requirements.
 */
export const KYA_IDV_SNAPSHOTS: TestSnapshot[] = [
  {
    id: 'idv-001',
    name: 'Valid Identity Verification',
    description: 'Test case for valid identity verification with biometric liveness',
    input: {
      humanId: 'user-123',
      identityProvider: 'shufti',
      verificationMethod: 'face-scan',
      biometricLiveness: true,
      timestamp: '2026-08-14T12:00:00Z'
    },
    expected: {
      verified: true,
      bindingCreated: true,
      revocationPropagationTime: '<15min'
    },
    timestamp: '2026-08-14T00:00:00Z',
    version: '1.0.0'
  }
];

/**
 * KYA Standard Behavioral Modeling Test Snapshots
 * 
 * These snapshots define the input/output behavior for behavioral modeling
 * and validation according to WP3.2 requirements.
 */
export const KYA_BHM_SNAPSHOTS: TestSnapshot[] = [
  {
    id: 'bhm-001',
    name: 'Normal Behavioral Pattern',
    description: 'Test case for normal behavioral pattern with expected tool call distribution',
    input: {
      agentId: 'agent-normal-001',
      behavioralProfile: {
        toolCallDistribution: { api_call: 0.3, file_read: 0.2, database_query: 0.5 },
        decisionTreeShape: { depth: 3, branches: 5 },
        tokenUsage: { prompt: 1200, completion: 800 }
      }
    },
    expected: {
      baselineMatch: true,
      deviationScore: 0.15,
      redTeamSimulation: 'passed'
    },
    timestamp: '2026-08-14T00:00:00Z',
    version: '1.0.0'
  }
];

/**
 * Get snapshot by ID
 * @param id - The snapshot ID to retrieve
 * @returns The test snapshot or null if not found
 */
export function getSnapshotById(id: string): TestSnapshot | null {
  const allSnapshots = [
    ...KYA_TRUST_SCORE_SNAPSHOTS,
    ...KYA_FAULT_ATTRIBUTION_SNAPSHOTS,
    ...KYA_IDV_SNAPSHOTS,
    ...KYA_BHM_SNAPSHOTS
  ];
  
  return allSnapshots.find(snapshot => snapshot.id === id) || null;
}

/**
 * Get all snapshots for a specific category
 * @param category - The category to retrieve snapshots for
 * @returns Array of test snapshots for that category
 */
export function getSnapshotsByCategory(category: string): TestSnapshot[] {
  switch (category) {
    case 'trs':
      return KYA_TRUST_SCORE_SNAPSHOTS;
    case 'flt':
      return KYA_FAULT_ATTRIBUTION_SNAPSHOTS;
    case 'idv':
      return KYA_IDV_SNAPSHOTS;
    case 'bhm':
      return KYA_BHM_SNAPSHOTS;
    default:
      return [];
  }
}