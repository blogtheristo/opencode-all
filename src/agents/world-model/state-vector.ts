/**
 * Perception layer — "The Anchor".
 *
 * Deterministic normalization of raw multi-modal telemetry into a governed
 * StateVector. No LLM is involved: severity is computed from each channel's
 * nominal operating band (12-Rule #5 — deterministic transforms stay in code).
 *
 * The nominal bands are a reference set for a generic industrial control room.
 * A real deployment would load per-site bands from configuration; the shape and
 * the math stay identical.
 */

import type { StateSignal, StateVector, TelemetryReading } from './types.js';

/** Inclusive nominal operating band per channel. Outside the band = severity. */
interface NominalBand {
  min: number;
  max: number;
  /** Value at/over which severity saturates to 1 (distance past the band edge). */
  saturation: number;
}

/**
 * Reference nominal bands. Unknown channels fall back to a permissive band and
 * contribute zero severity, so unexpected feeds never silently raise alarms.
 */
const NOMINAL_BANDS: Record<string, NominalBand> = {
  temperature: { min: 0, max: 80, saturation: 40 },
  vibration: { min: 0, max: 5, saturation: 10 },
  wind_speed: { min: 0, max: 17, saturation: 15 },
  pressure: { min: 90, max: 110, saturation: 20 },
  humidity: { min: 10, max: 90, saturation: 20 },
  load: { min: 0, max: 85, saturation: 30 },
};

/** Default severity threshold above which a signal counts as an anomaly. */
export const DEFAULT_ANOMALY_THRESHOLD = 0.6;

/**
 * Deterministic severity 0..1 for a reading: 0 while inside the nominal band,
 * ramping linearly to 1 as the value moves `saturation` units past the nearest
 * band edge.
 */
export function computeSeverity(channel: string, value: number): number {
  const band = NOMINAL_BANDS[channel];
  if (!band) return 0;

  let distance = 0;
  if (value < band.min) distance = band.min - value;
  else if (value > band.max) distance = value - band.max;

  if (distance <= 0) return 0;
  return Math.min(1, distance / band.saturation);
}

/**
 * Build a governed StateVector from raw telemetry. Pure function — same input
 * always yields the same snapshot (capturedAt is supplied by the caller for
 * determinism in tests).
 */
export function buildStateVector(
  telemetry: TelemetryReading[],
  opts: { capturedAt?: string; anomalyThreshold?: number } = {},
): StateVector {
  const capturedAt = opts.capturedAt ?? new Date().toISOString();
  const threshold = opts.anomalyThreshold ?? DEFAULT_ANOMALY_THRESHOLD;

  const signals: Record<string, StateSignal> = {};
  const anomalies: string[] = [];
  let maxSeverity = 0;

  for (const reading of telemetry) {
    const severity = computeSeverity(reading.channel, reading.value);
    const signal: StateSignal = {
      channel: reading.channel,
      value: reading.value,
      unit: reading.unit,
      source: reading.source ?? 'unknown',
      severity,
    };
    // Last reading for a channel wins; a control room dedupes to current state.
    signals[reading.channel] = signal;
    if (severity > maxSeverity) maxSeverity = severity;
  }

  for (const [channel, signal] of Object.entries(signals)) {
    if (signal.severity >= threshold) anomalies.push(channel);
  }
  anomalies.sort();

  return { capturedAt, signals, maxSeverity, anomalies };
}
