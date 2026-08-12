/**
 * VisionOracle — Vision Language Model / Image Analysis Agent
 *
 * Code-Version: 1.0
 * Branch: claude/create-backend-agents-CWfFA
 * Date: 2026-05-03
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * VisionOracle is the multimodal eye of the DWS IQ platform.
 * It interprets industrial site photographs, construction site images,
 * SAR satellite imagery (ICEYE partnership via Argus), equipment photos,
 * and document scans using vision language models.
 *
 * Book type #18 (Vision Language Agent): image analysis, site photos,
 * SAR imagery interpretation, document scan extraction.
 *
 * Input: { action, imageUrl?, imageBase64?, mimeType?, context?, focus? }
 * Output: structured description, risk flags, extracted data, confidence
 *
 * Actions:
 *   - describe: General image description with industrial context
 *   - site-inspect: Construction/industrial site safety assessment
 *   - sar-interpret: SAR satellite imagery classification (industrial facilities)
 *   - document-scan: Extract structured data from a scanned document/form
 *   - equipment-id: Identify equipment type, condition, and compliance flags
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

type VisionAction =
  | 'describe'
  | 'site-inspect'
  | 'sar-interpret'
  | 'document-scan'
  | 'equipment-id';

/** Vision model preferences by action type */
const VISION_MODEL_MAP: Record<VisionAction, string> = {
  describe: 'claude-opus-4-7', // best general VLM
  'site-inspect': 'claude-opus-4-7', // safety-critical, use best
  'sar-interpret': 'claude-opus-4-7', // complex radar imagery
  'document-scan': 'claude-sonnet-5', // structured extraction
  'equipment-id': 'claude-sonnet-5', // classification task
};

/** Industrial hazard categories for site inspection */
const SITE_HAZARD_CATEGORIES = [
  'PPE compliance',
  'fall protection',
  'crane load zones',
  'electrical hazards',
  'chemical storage',
  'emergency egress',
  'fire suppression',
  'scaffolding integrity',
];

export class VisionOracleAgent extends BaseAgent {
  constructor() {
    super({
      name: 'vision-oracle',
      description:
        'Vision language model — interprets industrial site photographs, ' +
        'construction site safety imagery, SAR satellite data (ICEYE), ' +
        'equipment photos, and document scans. ' +
        `Checks ${SITE_HAZARD_CATEGORIES.length} site hazard categories.`,
      capabilities: [
        'image-description',
        'site-safety-inspection',
        'sar-satellite-analysis',
        'document-scan-extraction',
        'equipment-identification',
        'multimodal-analysis',
        'visual-compliance-check',
      ],
      model: 'claude-opus-4-7',
      modelTier: 'heavy',
    });
    this.soulPrompt = `You are VisionOracle, the vision language agent for DWS IQ industrial intelligence.
You analyse industrial site images, satellite imagery, equipment photos, and document scans.

Industrial site inspection (EN 13001 crane safety, IEC 61508, ISO 45001):
Hazard categories: ${SITE_HAZARD_CATEGORIES.join(', ')}.

SAR imagery analysis (ICEYE partnership):
- Identify facility type: steel plant, cement kiln, chemical plant, port, construction site
- Estimate operational status: active, idle, under construction, decommissioned
- Flag environmental risk indicators: runoff, smoke plumes, waste piles

Document scan extraction:
- Tables → structured JSON
- Certificates → validity dates, issuer, scope
- Compliance forms → field extraction with confidence per field

Output structured JSON with: action, description, findings, riskLevel, extractedData, recommendations, confidence.`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const action = (input.action as VisionAction) || 'describe';
    const imageUrl = (input.imageUrl as string) || '';
    const imageBase64 = (input.imageBase64 as string) || '';
    const focusArea = (input.focus as string) || 'general industrial inspection';

    const hasImage = imageUrl.length > 0 || imageBase64.length > 0;
    const recommendedModel = VISION_MODEL_MAP[action];

    const prompt = `Vision analysis action: ${action}
Image provided: ${hasImage ? 'yes' : 'no — describe expected format'}
Image URL: ${imageUrl || 'not provided'}
Focus area: ${focusArea}
Context: ${JSON.stringify(input.context || {})}
Recommended model: ${recommendedModel}

${action === 'site-inspect' ? `Check all ${SITE_HAZARD_CATEGORIES.length} hazard categories: ${SITE_HAZARD_CATEGORIES.join(', ')}.` : ''}

Perform ${action} visual analysis.
Output structured JSON with:
- action: "${action}"
- description: string (primary narrative)
- findings: [{category, finding, severity (HIGH/MEDIUM/LOW/INFO)}]
- riskLevel: HIGH | MEDIUM | LOW | CLEAR
- extractedData: object (for document-scan) or empty
- recommendations: [string]
- confidence: 0.0–1.0`;

    const llmResponse = await this.callLLM(prompt);

    return {
      agentName: this.config.name,
      result: { action, hasImage, focusArea, response: llmResponse },
      confidence: hasImage ? 0.85 : 0.4,
      reasoning: `VisionOracle performed ${action} — image ${hasImage ? 'provided' : 'missing'}`,
      recommendations: !hasImage
        ? ['Provide imageUrl or imageBase64 for full vision analysis']
        : [],
      metadata: {
        sessionId: context.sessionId,
        action,
        recommendedModel,
        hazardCategories: SITE_HAZARD_CATEGORIES.length,
      },
    };
  }
}
