// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-29
// Audit trail: git log -- src/aegis/pilot/index.ts
/**
 * DWS IQ Aegis Pilot (DWS-AEGIS-PILOT-001) — local-first substrate and
 * severed-uplink acceptance test. See docs/runbooks/AEGIS_PILOT_RUNBOOK.md.
 */
export * from './scope.js';
export * from './identity.js';
export * from './evidence-ledger.js';
export * from './ledger-segments.js';
export * from './kill-authority.js';
export * from './uplink-probe.js';
export * from './workflow-runner.js';
export * from './acceptance.js';
export * from './isolated-handlers.js';
export * from './openshell-handlers.js';
export { stepPolicy } from './openshell-policy.js';
export { stepSandboxManifest } from './gke-sandbox-policy.js';
export * from './openshell-prover.js';
export * from './authority.js';
export { createReferenceRegistry, evaluateLimits } from './reference-workflow.js';
export { generateEd25519, keyId, privateKeyFromPem, publicKeyFromPem } from './crypto.js';
export * from './doctor.js';
