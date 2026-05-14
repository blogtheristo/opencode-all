/**
 * Signal Token System — Type 2 Universal Event Signals
 *
 * Code-Version: 1.0
 * Branch: claude/record-contact-response-MFTP7
 * Date: 2026-04-06
 * Owner: claude-code
 */

export {
  generateSignalToken,
  isValidToken,
  formatToken,
  extractToken,
  resolveStatus,
} from './signal-token.js';

export type { SignalDomain, SignalStatus, OutreachStatus, SignalToken } from './signal-token.js';

export { parseSignalText } from './signal-parser.js';

export type { SignalCommand, SignalParseResult } from './signal-parser.js';
