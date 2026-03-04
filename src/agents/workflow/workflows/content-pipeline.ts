/**
 * Content Pipeline Workflow — Climate IQ
 *
 * Full B2B content and outreach pipeline:
 * Iris gathers market and keyword intelligence → Apollo builds content strategy
 * and outreach sequences targeting regulatory compliance buyers.
 *
 * Workflow: Iris (market + SEO intel) → Apollo (content brief + outreach)
 *
 * Use when launching a new content campaign for a specific industry or
 * regulatory trigger (e.g., CBAM, CSRD deadline approaching).
 */

import type { WorkflowDefinition } from '../../workflows.js';

export const CONTENT_PIPELINE_WORKFLOW: WorkflowDefinition = {
  name: 'content-pipeline',
  description: 'Climate IQ content pipeline: Iris gathers market and SEO intelligence → Apollo builds content briefs and outreach sequences for regulatory compliance buyers',
  version: '1.0.0',
  timeoutMs: 600_000, // 10 minutes (LLM-heavy)
  steps: [
    {
      id: 'market-intel',
      type: 'agent',
      agent: 'iris',
      description: 'Iris gathers competitor positioning, keyword intent, and regulatory landscape for the target industry',
    },
    {
      id: 'content-strategy',
      type: 'agent',
      agent: 'apollo',
      description: 'Apollo builds content brief, outreach sequence, and SEO strategy from Iris intelligence',
      inputFrom: {
        marketIntelligence: 'market-intel.result',
        keyFindings: 'market-intel.result.keyFindings',
        seoData: 'market-intel.result.rawIntelligence',
      },
    },
    {
      id: 'notify-pipeline-ready',
      type: 'emit-event',
      eventType: 'workflow.content_pipeline_complete',
      description: 'Emit completion event for content publishing and CRM systems',
    },
  ],
};
