/**
 * KYA Standard Trust Score Classification
 * 
 * Classifies trust scores according to KYA-S1 thresholds:
 * - >= 0.85 = NOMINAL
 * - 0.60 to < 0.85 = DEGRADED  
 * - < 0.60 = FAIL_CLOSED
 */

export type TrustState = 'NOMINAL' | 'DEGRADED' | 'FAIL_CLOSED';

/**
 * Classify a trust score according to KYA-S1 thresholds
 * @param score - The trust score to classify (0.0 to 1.0)
 * @returns The trust state classification
 */
export function classifyTrustState(score: number): TrustState {
  if (Number.isNaN(score) || score < 0 || score > 1) {
    throw new Error(`Invalid trust score: ${score}. Must be between 0 and 1.`);
  }
  
  if (score >= 0.85) {
    return 'NOMINAL';
  } else if (score >= 0.60) {
    return 'DEGRADED';
  } else {
    return 'FAIL_CLOSED';
  }
}

/**
 * Check if a trust score is sufficient for a given action type
 * @param score - The trust score to check
 * @param actionType - The type of action requiring authorization
 * @returns Whether the score is sufficient
 */
export function isTrustScoreSufficient(score: number, actionType: 'NOMINAL_ONLY' | 'DEGRADED_ALLOWED' = 'NOMINAL_ONLY'): boolean {
  const state = classifyTrustState(score);
  
  switch (actionType) {
    case 'NOMINAL_ONLY':
      return state === 'NOMINAL';
    case 'DEGRADED_ALLOWED':
      return state !== 'FAIL_CLOSED';
  }
}