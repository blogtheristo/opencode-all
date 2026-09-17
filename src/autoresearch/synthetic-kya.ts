/**
 * Synthetic KYA Session Generator — Proxy Metric for Autoresearch
 *
 * Generates synthetic agent sessions for KYA parameter tuning.
 * This is the "prepare.py" equivalent — immutable, generates test data.
 *
 * Session profiles:
 *   - Legitimate agents: clean operations with occasional noise
 *   - Malicious agents: elevated violations, denied access, short sessions
 *   - Edge cases: borderline agents that test parameter sensitivity
 *
 * Requirements:
 *   - Deterministic given seed (reproducible experiments)
 *   - Realistic distribution matching production Firehorse logs
 *   - Sufficient variety to prevent overfitting
 */

// ============================================================================
// SESSION TYPE
// ============================================================================

export interface SyntheticKyaSession {
  /** Unique session identifier */
  sessionId: string;

  /** Number of KYA violations in this session */
  violations: number;

  /** Legacy compatibility field. Latency penalty (0.0 = within SLA, 1.0 = severe latency) no longer affects ATS. */
  latencyPenalty: number;

  /** Number of denied access attempts */
  deniedAccessAttempts: number;

  /** Autoresearch improvement factor (0.0 – 1.0) */
  autoresearchImprovement: number;

  /** Session duration in hours */
  sessionDurationHours: number;

  /** Ground truth: is this a legitimate agent session? */
  isLegitimate: boolean;

  /** Agent profile category */
  profile: 'clean' | 'noisy' | 'malicious' | 'edge';
}

// ============================================================================
// SEEDED RANDOM (deterministic for reproducibility)
// ============================================================================

class SeededRandom {
  private state: number;

  constructor(seed: number) {
    // Ensure seed is treated as a 32-bit integer
    this.state = seed | 0;
  }

  /** Returns a float in [0, 1) */
  next(): number {
    // xorshift32 on 32-bit integer state
    this.state ^= this.state << 13;
    this.state ^= this.state >> 17;
    this.state ^= this.state << 5;
    // Coerce to 32-bit signed int, then normalize unsigned to [0, 1)
    this.state |= 0;
    return (this.state >>> 0) / 0x100000000;
  }

  /** Returns a float in [min, max) */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Returns an integer in [min, max] inclusive */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
}

// ============================================================================
// PROFILE GENERATORS
// ============================================================================

function generateCleanSession(rng: SeededRandom, id: number): SyntheticKyaSession {
  return {
    sessionId: `syn-clean-${id}`,
    violations: rng.next() < 0.1 ? 1 : 0, // 10% chance of 1 violation (noise)
    latencyPenalty: rng.range(0, 0.05), // Very low latency
    deniedAccessAttempts: 0,
    autoresearchImprovement: rng.range(0, 0.3),
    sessionDurationHours: rng.range(1, 24),
    isLegitimate: true,
    profile: 'clean',
  };
}

function generateNoisySession(rng: SeededRandom, id: number): SyntheticKyaSession {
  return {
    sessionId: `syn-noisy-${id}`,
    violations: rng.int(0, 2), // 0–2 violations (legitimate but messy)
    latencyPenalty: rng.range(0.02, 0.15), // Moderate latency
    deniedAccessAttempts: rng.int(0, 3), // Some denied attempts (misconfigured)
    autoresearchImprovement: rng.range(0, 0.5),
    sessionDurationHours: rng.range(0.5, 12),
    isLegitimate: true,
    profile: 'noisy',
  };
}

function generateMaliciousSession(rng: SeededRandom, id: number): SyntheticKyaSession {
  return {
    sessionId: `syn-malicious-${id}`,
    violations: rng.int(2, 6), // Multiple violations
    latencyPenalty: rng.range(0.1, 0.5), // High latency (suspicious)
    deniedAccessAttempts: rng.int(3, 15), // Many denied access attempts
    autoresearchImprovement: rng.range(0, 0.1), // Low improvement (not productive)
    sessionDurationHours: rng.range(0.01, 2), // Short sessions (probing)
    isLegitimate: false,
    profile: 'malicious',
  };
}

function generateEdgeSession(rng: SeededRandom, id: number): SyntheticKyaSession {
  // Edge cases: agents that are borderline — tests parameter sensitivity
  const isLegitimate = rng.next() < 0.5;
  return {
    sessionId: `syn-edge-${id}`,
    violations: rng.int(1, 3),
    latencyPenalty: rng.range(0.05, 0.2),
    deniedAccessAttempts: rng.int(1, 5),
    autoresearchImprovement: rng.range(0.1, 0.6),
    sessionDurationHours: rng.range(0.5, 8),
    isLegitimate,
    profile: 'edge',
  };
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

/**
 * Generate synthetic KYA sessions for autoresearch experiments.
 *
 * Distribution (matches expected production mix):
 *   - 50% clean legitimate agents
 *   - 20% noisy but legitimate agents
 *   - 15% malicious agents
 *   - 15% edge cases (borderline)
 *
 * @param count Total number of sessions to generate
 * @param seed Random seed for reproducibility (default: 42)
 */
export function generateSyntheticSessions(
  count: number = 1000,
  seed: number = 42,
): SyntheticKyaSession[] {
  const rng = new SeededRandom(seed);
  const sessions: SyntheticKyaSession[] = [];

  const cleanCount = Math.floor(count * 0.50);
  const noisyCount = Math.floor(count * 0.20);
  const maliciousCount = Math.floor(count * 0.15);
  const edgeCount = count - cleanCount - noisyCount - maliciousCount;

  for (let i = 0; i < cleanCount; i++) {
    sessions.push(generateCleanSession(rng, i));
  }
  for (let i = 0; i < noisyCount; i++) {
    sessions.push(generateNoisySession(rng, i));
  }
  for (let i = 0; i < maliciousCount; i++) {
    sessions.push(generateMaliciousSession(rng, i));
  }
  for (let i = 0; i < edgeCount; i++) {
    sessions.push(generateEdgeSession(rng, i));
  }

  // Shuffle to prevent ordering bias
  for (let i = sessions.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [sessions[i], sessions[j]] = [sessions[j], sessions[i]];
  }

  return sessions;
}

/**
 * Get session distribution stats for logging.
 */
export function getSessionStats(sessions: SyntheticKyaSession[]): {
  total: number;
  legitimate: number;
  malicious: number;
  byProfile: Record<string, number>;
} {
  const byProfile: Record<string, number> = {};
  let legitimate = 0;
  let malicious = 0;

  for (const s of sessions) {
    byProfile[s.profile] = (byProfile[s.profile] || 0) + 1;
    if (s.isLegitimate) legitimate++;
    else malicious++;
  }

  return { total: sessions.length, legitimate, malicious, byProfile };
}
