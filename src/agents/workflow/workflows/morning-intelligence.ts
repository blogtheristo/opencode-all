/**
 * Morning Intelligence Workflow — Climate IQ
 *
 * Daily briefing workflow that runs compliance, field, and market intelligence
 * in parallel, then synthesizes into an executive morning brief via Atlas.
 *
 * Workflow: [Athena + Hephaestus + Iris] (parallel) → Atlas synthesis
 *
 * Designed to run on a daily schedule (e.g., 06:00 EU time) and deliver
 * a concise actionable briefing to operations leads and compliance officers.
 */

import type { WorkflowDefinition } from '../../workflows.js';

export const MORNING_INTELLIGENCE_WORKFLOW: WorkflowDefinition = {
  name: 'morning-intelligence',
  description: 'Daily Climate IQ briefing: parallel compliance status (Athena), site conditions (Hephaestus), and market intel (Iris) — synthesized by Atlas into an executive morning brief',
  version: '1.0.0',
  timeoutMs: 300_000, // 5 minutes
  steps: [
    {
      id: 'parallel-intelligence',
      type: 'parallel',
      agents: ['athena', 'hephaestus', 'iris'],
      description: 'Run compliance assessment, field conditions, and market intelligence concurrently',
    },
    {
      id: 'atlas-synthesis',
      type: 'agent',
      agent: 'atlas',
      description: 'Atlas synthesizes parallel intelligence into a ranked executive morning briefing',
      inputFrom: {
        complianceIntel: 'parallel-intelligence.0.result',
        fieldIntel: 'parallel-intelligence.1.result',
        marketIntel: 'parallel-intelligence.2.result',
      },
    },
    {
      id: 'notify-briefing-ready',
      type: 'emit-event',
      eventType: 'workflow.morning_intelligence_complete',
      description: 'Emit completion event for dashboard and notification systems',
    },
  ],
};
