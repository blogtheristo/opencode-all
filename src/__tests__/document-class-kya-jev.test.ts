import { describe, expect, it, vi } from 'vitest';
import { type DocumentClassAdvisory, reviewPriority } from '../agents/document-class-kya-jev.js';

vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

function advisory(
  enforced: DocumentClassAdvisory['enforced'],
  decision: string,
  abstained = false,
): DocumentClassAdvisory {
  return {
    path: 'Learn/whatever.html',
    enforced,
    unclassified: false,
    result: {
      decision,
      probabilities: {},
      confidence: 0.9,
      calibration: 'self-reported-uncalibrated',
      abstained,
    },
    actionable: false,
  };
}

describe('document-class advisory', () => {
  it('flags a proposal stricter than the policy as a possible leak', () => {
    // Policy says customers may read it; the model thinks it is founder-only.
    expect(reviewPriority(advisory('customer', 'confidential'))).toBe('possible-leak');
    expect(reviewPriority(advisory('public', 'internal'))).toBe('possible-leak');
  });

  it('flags a looser proposal as over-restriction, not a leak', () => {
    expect(reviewPriority(advisory('confidential', 'public'))).toBe('possible-over-restriction');
  });

  it('reports agreement when the classes match', () => {
    expect(reviewPriority(advisory('internal', 'internal'))).toBe('agrees');
  });

  it('treats an abstention as no signal rather than disagreement', () => {
    expect(reviewPriority(advisory('confidential', '__ABSTAIN__', true))).toBe('agrees');
  });

  // The property that keeps §7 satisfied: nothing here is executable.
  it('is never actionable', () => {
    expect(advisory('internal', 'public').actionable).toBe(false);
    expect(advisory('internal', 'public').result.calibration).toBe('self-reported-uncalibrated');
  });
});
