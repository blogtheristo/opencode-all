/**
 * KYA-S1 ATS permission bands from standards/kya-open/SPEC.md section 2.2.
 */
export type AtsPermission = 'FULL_SANDBOX' | 'RESTRICTED' | 'SUSPENDED';

export type AtsAction = 'FULL_SANDBOX_ONLY' | 'RESTRICTED_ALLOWED';

export function classifyTrustState(score: number): AtsPermission {
  if (!Number.isFinite(score) || score < 0 || score > 1) {
    throw new RangeError(`Invalid trust score: ${score}. Must be a finite number between 0 and 1.`);
  }

  if (score >= 0.8) {
    return 'FULL_SANDBOX';
  }

  if (score >= 0.5) {
    return 'RESTRICTED';
  }

  return 'SUSPENDED';
}

export function isTrustScoreSufficient(
  score: number,
  actionType: AtsAction = 'FULL_SANDBOX_ONLY',
): boolean {
  const permission = classifyTrustState(score);

  switch (actionType) {
    case 'FULL_SANDBOX_ONLY':
      return permission === 'FULL_SANDBOX';
    case 'RESTRICTED_ALLOWED':
      return permission !== 'SUSPENDED';
  }
}
