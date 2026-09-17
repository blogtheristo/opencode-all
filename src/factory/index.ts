/**
 * DWS Factory Router — evidence-based cheap→strong model escalation, fully offline.
 *
 * Adapted from codejunkie99/sageroute (MIT) per the adopt/adapt decision in
 * docs/field-notes/2026-08-03-agent-factory-sageroute-audit.md.
 */

export {
  classifyError,
  digest,
  extractTrajectory,
  extractTrajectoryFromBody,
  extractTrajectoryFromMessages,
  looksLikeFailure,
  outputText,
  stripSystemReminders,
} from './evidence.js';
export type { Trajectory, TrajectoryStep } from './evidence.js';

export { computeSignals, headline, renderEvidence } from './detectors.js';
export type { SignalInputs, SignalReport } from './detectors.js';

export { actionProbabilities, decide, interventionProbability } from './ladder.js';

export {
  DEFAULT_FACTORY_CONFIG,
  FACTORY_ACTIONS,
  freshLadderState,
  isFactoryAction,
} from './types.js';
export type {
  FactoryAction,
  FactoryRouterConfig,
  LadderState,
  ModelTier,
  Verdict,
} from './types.js';
