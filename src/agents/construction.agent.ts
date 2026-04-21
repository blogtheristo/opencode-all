/**
 * Construction Agent - Construction Project Compliance Orchestrator
 *
 * The first orchestration agent in DWS IQ 6. Ties together existing utility agents
 * (SiteSense, MaterialOracle, ScheduleGenius, Viability) into construction-specific
 * workflows for EU-regulated construction projects.
 *
 * Handles:
 * - Project compliance assessment (combines safety + materials + schedule + viability)
 * - YTJ company verification (Finnish business registry)
 * - Subcontractor vetting (ADR, Tilaajavastuu, Vastuu Group)
 * - Building permit status tracking
 * - BIM-to-carbon pipeline coordination
 * - EN 15978 lifecycle compliance checking
 *
 * Target customers: NCC, YIT, SRV, T2H, Kela construction, Senaatti-kiinteistöt
 *
 * Input: {
 *   projectId:     Construction project identifier
 *   action:        "compliance-check" | "subcontractor-vet" | "material-assessment" |
 *                  "schedule-risk" | "full-assessment"
 *   project:       { name, location, type, phase, budget, startDate, endDate }
 *   site?:         SiteSense metrics (if action involves safety)
 *   materials?:    MaterialOracle input (if action involves carbon)
 *   tasks?:        ScheduleGenius input (if action involves schedule)
 *   subcontractor?: { ytunnus, name, role } (if action involves vetting)
 * }
 *
 * Output: Unified compliance report combining all sub-agent results
 *
 * Tier: 2 (supervised - produces compliance reports that affect project decisions)
 * Cognitive pattern: ReAct + Chain-of-Thought (multi-system reasoning)
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// Lazy import to avoid circular dependency (construction is registered in index.ts)
let _registry: {
  executeAgent: (
    name: string,
    context: AgentContext,
    input: Record<string, unknown>,
  ) => Promise<AgentResponse>;
} | null = null;
async function getRegistry() {
  if (!_registry) {
    const mod = await import('./index.js');
    _registry = mod.agentRegistry;
  }
  return _registry;
}

// ============ INPUT INTERFACES ============

interface ConstructionProject {
  name: string;
  location: string;
  type: 'residential' | 'commercial' | 'infrastructure' | 'industrial' | 'renovation';
  phase:
    | 'planning'
    | 'permitting'
    | 'foundation'
    | 'structure'
    | 'envelope'
    | 'mep'
    | 'finishing'
    | 'handover';
  budget: number;
  startDate: string;
  endDate: string;
}

interface SubcontractorInfo {
  /** Finnish business ID (Y-tunnus) format: 1234567-8 */
  ytunnus: string;
  name: string;
  role: string;
}

interface ConstructionInput {
  projectId: string;
  action:
    | 'compliance-check'
    | 'subcontractor-vet'
    | 'material-assessment'
    | 'schedule-risk'
    | 'full-assessment';
  project: ConstructionProject;
  site?: Record<string, unknown>;
  materials?: Record<string, unknown>;
  tasks?: Record<string, unknown>;
  subcontractor?: SubcontractorInfo;
}

// ============ FINNISH CONSTRUCTION COMPLIANCE ============

/** Building phases mapped to required permits/inspections (Finnish MRL) */
const PHASE_REQUIREMENTS: Record<string, string[]> = {
  planning: [
    'Asemakaava (zoning plan) verification',
    'Environmental impact assessment if >10,000 m²',
  ],
  permitting: [
    'Rakennuslupa (building permit) from municipality',
    'Pääsuunnittelija (lead designer) appointment',
  ],
  foundation: [
    'Aloituskokous (kick-off meeting) with building inspector',
    'Pohjatutkimus (geotechnical survey)',
  ],
  structure: ['Rakennekatselmus (structural inspection)', 'Raudoituskatselmus (rebar inspection)'],
  envelope: ['Vedeneristyskatselmus (waterproofing inspection)', 'Energy performance verification'],
  mep: ['LVI-katselmus (HVAC inspection)', 'Sähkökatselmus (electrical inspection)'],
  finishing: ['Palotarkastus (fire inspection)', 'Esteettömyystarkastus (accessibility check)'],
  handover: [
    'Loppukatselmus (final inspection)',
    'Energiatodistus (energy certificate)',
    'Käyttöönottotarkastus (commissioning)',
  ],
};

/** Construction safety thresholds (Finnish VNa 205/2009 + EU Directive 92/57/EEC)
 * Retained for future SiteSense agent integration.
 */
// const SAFETY_THRESHOLDS = {
//   maxWorkersWithoutCoordinator: 10,
//   maxFallHeight_m: 2.0,
//   minTemperature_c: -25,
//   maxWindForCrane_ms: 17,
//   requiredFirstAiders_per50: 1,
//   noiseLimit_dB: 85,
// };

/** Tilaajavastuu checks for subcontractor vetting */
const SUBCONTRACTOR_CHECKS = [
  'Kaupparekisteriote (trade register extract)',
  'Ennakkoperintärekisteri (prepayment register)',
  'Työnantajarekisteri (employer register)',
  'ALV-rekisteri (VAT register)',
  'Verovelkatodistus (tax debt certificate)',
  'Tapaturmavakuutus (accident insurance)',
  'TES (collective agreement compliance)',
  'Rakentamisen tiedonantovelvollisuus (construction reporting obligation)',
];

/** Y-tunnus validation (Finnish business ID) */
function validateYtunnus(ytunnus: string): { valid: boolean; reason: string } {
  const match = ytunnus.match(/^(\d{7})-(\d)$/);
  if (!match) {
    return { valid: false, reason: 'Invalid format. Expected: 1234567-8' };
  }
  const digits = match[1].split('').map(Number);
  const weights = [7, 9, 10, 5, 8, 4, 2];
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0);
  const remainder = sum % 11;
  const checkDigit = remainder === 0 ? 0 : remainder === 1 ? -1 : 11 - remainder;
  if (checkDigit === -1 || checkDigit !== Number(match[2])) {
    return { valid: false, reason: 'Check digit mismatch - Y-tunnus may be invalid' };
  }
  return { valid: true, reason: 'Y-tunnus format and check digit valid' };
}

// ============ AGENT IMPLEMENTATION ============

export class ConstructionAgent extends BaseAgent {
  constructor() {
    super({
      name: 'construction',
      description:
        'Orchestrates construction project compliance by coordinating SiteSense, MaterialOracle, ScheduleGenius, and Viability agents with Finnish/EU construction regulations',
      capabilities: [
        'construction-compliance',
        'subcontractor-vetting',
        'building-permit-tracking',
        'bim-carbon-pipeline',
        'en15978-assessment',
        'ytj-verification',
        'tilaajavastuu',
        'finnish-mrl-compliance',
      ],
      model: 'llama-3.1-70b-versatile',
      modelTier: 'standard',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input,
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    try {
      const validated = this.validateInput(input);

      let result: Record<string, unknown>;
      let reasoning: string;
      let recommendations: string[];

      switch (validated.action) {
        case 'compliance-check':
          ({ result, reasoning, recommendations } = this.runComplianceCheck(validated));
          break;
        case 'subcontractor-vet':
          ({ result, reasoning, recommendations } = this.runSubcontractorVet(validated));
          break;
        case 'material-assessment':
          ({ result, reasoning, recommendations } = this.runMaterialAssessment(validated));
          break;
        case 'schedule-risk':
          ({ result, reasoning, recommendations } = this.runScheduleRisk(validated));
          break;
        case 'full-assessment':
          ({ result, reasoning, recommendations } = await this.runFullAssessment(
            validated,
            context,
          ));
          break;
        default:
          throw new Error(`Unknown action: ${validated.action}`);
      }

      // Enhance with LLM if available
      const llmEnhancement = await this.enhanceWithLLM(validated, result);
      if (llmEnhancement) {
        recommendations.push(...llmEnhancement);
      }

      const confidence = this.calculateConfidence(validated);

      const response: AgentResponse = {
        agentName: this.config.name,
        result,
        confidence,
        reasoning,
        recommendations,
        metadata: {
          durationMs: Date.now() - startTime,
          model: this.config.model,
          action: validated.action,
          projectPhase: validated.project.phase,
          projectType: validated.project.type,
        },
      };

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: response,
        status: 'completed',
        duration_ms: Date.now() - startTime,
        created_at: new Date().toISOString(),
      });

      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const durationMs = Date.now() - startTime;

      logger.error('Construction agent failed', { agent: this.config.name, error: errorMessage });

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: null,
        status: 'error',
        error_message: errorMessage,
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });

      return {
        agentName: this.config.name,
        result: { error: errorMessage },
        confidence: 0,
        reasoning: `Construction assessment failed: ${errorMessage}`,
        recommendations: ['Verify input format matches the expected schema'],
        metadata: { durationMs, model: this.config.model },
      };
    }
  }

  // ============ ACTION HANDLERS ============

  private runComplianceCheck(input: ConstructionInput): {
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  } {
    const { project } = input;
    const phaseReqs = PHASE_REQUIREMENTS[project.phase] || [];
    const recommendations: string[] = [];
    const flags: string[] = [];

    // Phase-specific requirements
    for (const req of phaseReqs) {
      recommendations.push(`[${project.phase}] Required: ${req}`);
    }

    // Budget checks
    if (project.budget > 500000) {
      flags.push(
        'Project >EUR 500k: Rakentamisen tiedonantovelvollisuus (construction reporting obligation) applies',
      );
    }
    if (project.budget > 10000000) {
      flags.push(
        'Project >EUR 10M: Enhanced safety coordination required (EU Directive 92/57/EEC)',
      );
    }

    // Timeline assessment
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (durationDays > 500) {
      flags.push(
        'Project duration >500 days: Prior notice to occupational safety authority required',
      );
    }

    // Location-based checks (Finland-specific)
    if (
      project.location.toLowerCase().includes('helsinki') ||
      project.location.toLowerCase().includes('espoo') ||
      project.location.toLowerCase().includes('vantaa')
    ) {
      recommendations.push(
        'Pääkaupunkiseutu (capital region): Check municipal-specific zoning requirements',
      );
    }

    // CSRD reporting check
    if (project.budget > 1000000) {
      recommendations.push(
        'EU CSRD: Include this project in corporate sustainability reporting (ESRS E1 Climate Change)',
      );
    }

    // EN 15978 lifecycle assessment
    if (project.type === 'residential' || project.type === 'commercial') {
      recommendations.push(
        'EN 15978: Whole-life carbon assessment required. Use MaterialOracle agent for A1-A5, B, C, D stages',
      );
    }

    return {
      result: {
        projectId: input.projectId,
        project: project.name,
        phase: project.phase,
        phaseRequirements: phaseReqs,
        complianceFlags: flags,
        durationDays,
        budgetEur: project.budget,
        regulationsApplicable: this.identifyApplicableRegulations(project),
      },
      reasoning: `Compliance check for "${project.name}" (${project.type}, ${project.phase} phase). ${phaseReqs.length} phase requirements identified. ${flags.length} compliance flag(s) raised. Budget EUR ${project.budget.toLocaleString()}, duration ${durationDays} days.`,
      recommendations,
    };
  }

  private runSubcontractorVet(input: ConstructionInput): {
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  } {
    const sub = input.subcontractor;
    if (!sub) {
      throw new Error('subcontractor field required for subcontractor-vet action');
    }

    const ytunnusCheck = validateYtunnus(sub.ytunnus);
    const recommendations: string[] = [];
    const checks: Array<{ check: string; status: 'required' | 'pending' | 'pass' }> = [];

    // Y-tunnus validation
    if (!ytunnusCheck.valid) {
      recommendations.push(`Y-tunnus ${sub.ytunnus} validation failed: ${ytunnusCheck.reason}`);
    }

    // Tilaajavastuu checks
    for (const check of SUBCONTRACTOR_CHECKS) {
      checks.push({ check, status: 'required' });
    }

    // Role-specific checks
    if (sub.role.toLowerCase().includes('demolition') || sub.role.toLowerCase().includes('purku')) {
      checks.push({ check: 'Purkutyölupa (demolition permit)', status: 'required' });
      checks.push({ check: 'Asbestiselvitys (asbestos survey)', status: 'required' });
    }
    if (sub.role.toLowerCase().includes('electric') || sub.role.toLowerCase().includes('sähkö')) {
      checks.push({
        check: 'Sähköurakointioikeus (electrical contracting license)',
        status: 'required',
      });
    }
    if (sub.role.toLowerCase().includes('crane') || sub.role.toLowerCase().includes('nosturi')) {
      checks.push({
        check: 'Nosturinkuljettajan pätevyys (crane operator certification)',
        status: 'required',
      });
    }

    recommendations.push(
      `Verify all ${checks.length} checks via Tilaajavastuu/Vastuu Group for ${sub.name}`,
    );
    recommendations.push(
      'Request valid certificates before work begins (Tilaajavastuulaki 1233/2006)',
    );

    return {
      result: {
        subcontractor: sub,
        ytunnusValid: ytunnusCheck.valid,
        ytunnusReason: ytunnusCheck.reason,
        requiredChecks: checks,
        checkCount: checks.length,
        passed: 0,
        pending: checks.length,
      },
      reasoning: `Subcontractor vetting for "${sub.name}" (Y-tunnus: ${sub.ytunnus}, role: ${sub.role}). Y-tunnus ${ytunnusCheck.valid ? 'valid' : 'INVALID'}. ${checks.length} compliance checks required including ${SUBCONTRACTOR_CHECKS.length} Tilaajavastuu checks.`,
      recommendations,
    };
  }

  private runMaterialAssessment(input: ConstructionInput): {
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    const { project } = input;

    recommendations.push(
      'Run MaterialOracle agent with full material list for EN 15978 lifecycle assessment',
    );
    recommendations.push(
      'Ensure EPD (Environmental Product Declaration) available for each material',
    );

    // CBAM check for imported materials
    recommendations.push(
      'Check CBAM applicability: cement, steel, aluminium imports from non-EU require CBAM certificates',
    );

    // Phase-specific material guidance
    if (project.phase === 'structure') {
      recommendations.push(
        'Structural phase: Consider low-carbon concrete (30% GGBS) and EAF steel for significant carbon reduction',
      );
      recommendations.push('HYBRIT green hydrogen steel available from SSAB (Nordic supply chain)');
    }
    if (project.phase === 'envelope') {
      recommendations.push(
        'Envelope phase: Wood fiber insulation offers 80% carbon reduction vs EPS',
      );
      recommendations.push('Recycled-content glass (50%) widely available in EU market');
    }

    return {
      result: {
        projectId: input.projectId,
        phase: project.phase,
        materialInputProvided: !!input.materials,
        agentChain: ['construction → material-oracle → viability'],
        en15978Stages: [
          'A1-A3 (product)',
          'A4 (transport)',
          'A5 (construction)',
          'B (use)',
          'C (end-of-life)',
          'D (beyond boundary)',
        ],
      },
      reasoning: `Material assessment for "${project.name}" (${project.phase} phase). ${input.materials ? 'Material data provided - ready for MaterialOracle analysis.' : 'No material data provided - request material list for full EN 15978 assessment.'}`,
      recommendations,
    };
  }

  private runScheduleRisk(input: ConstructionInput): {
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  } {
    const { project } = input;
    const recommendations: string[] = [];

    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    // Finnish weather risk by month
    const startMonth = start.getMonth();
    const endMonth = end.getMonth();
    const winterMonths = [10, 11, 0, 1, 2]; // Nov-Mar
    const winterOverlap = winterMonths.some((m) => {
      if (startMonth <= endMonth) return m >= startMonth && m <= endMonth;
      return m >= startMonth || m <= endMonth;
    });

    if (winterOverlap) {
      recommendations.push(
        'Finnish winter overlap detected: Plan for talvibetonointi (winter concreting), heated enclosures, reduced daylight hours',
      );
      recommendations.push(
        'Wind/temperature monitoring critical Oct-Mar: Integrate SiteSense agent for daily site safety checks',
      );
    }

    // Phase transition risks
    const phaseOrder = [
      'planning',
      'permitting',
      'foundation',
      'structure',
      'envelope',
      'mep',
      'finishing',
      'handover',
    ];
    const currentPhaseIdx = phaseOrder.indexOf(project.phase);
    const remainingPhases = phaseOrder.length - currentPhaseIdx - 1;
    const daysPerPhase = durationDays / (remainingPhases + 1);

    if (daysPerPhase < 30) {
      recommendations.push(
        `WARNING: Only ${Math.round(daysPerPhase)} days per remaining phase (${remainingPhases} phases left). Schedule is compressed.`,
      );
    }

    recommendations.push('Run ScheduleGenius agent with task list for critical path analysis');

    return {
      result: {
        projectId: input.projectId,
        durationDays,
        currentPhase: project.phase,
        remainingPhases,
        daysPerPhase: Math.round(daysPerPhase),
        winterOverlap,
        taskDataProvided: !!input.tasks,
        agentChain: ['construction → schedule-genius → sitesense'],
      },
      reasoning: `Schedule risk for "${project.name}": ${durationDays} days total, ${remainingPhases} phases remaining (~${Math.round(daysPerPhase)} days each). ${winterOverlap ? 'Finnish winter overlap - increased weather risk.' : 'No winter overlap.'}`,
      recommendations,
    };
  }

  private async runFullAssessment(
    input: ConstructionInput,
    context: AgentContext,
  ): Promise<{
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  }> {
    // Run local sub-assessments (always available, fast)
    const compliance = this.runComplianceCheck(input);
    const schedule = this.runScheduleRisk(input);
    const materials = this.runMaterialAssessment(input);
    const subcontractor = input.subcontractor ? this.runSubcontractorVet(input) : null;

    // Delegate to real sub-agents for deeper analysis (graceful fallback)
    const delegatedResults: Record<string, AgentResponse | null> = {};
    try {
      const registry = await getRegistry();
      if (registry) {
        const delegations = [];

        // SiteSense: site safety scoring (if site data provided)
        if (input.site) {
          delegations.push(
            registry
              .executeAgent('sitesense', context, {
                siteId: input.projectId,
                siteName: input.project.name,
                ...input.site,
              })
              .then((r) => {
                delegatedResults.sitesense = r;
              })
              .catch((e) => {
                logger.warn('SiteSense delegation failed', { error: (e as Error).message });
                delegatedResults.sitesense = null;
              }),
          );
        }

        // MaterialOracle: carbon assessment (if materials provided)
        if (input.materials) {
          delegations.push(
            registry
              .executeAgent('material-oracle', context, {
                projectId: input.projectId,
                ...input.materials,
              })
              .then((r) => {
                delegatedResults['material-oracle'] = r;
              })
              .catch((e) => {
                logger.warn('MaterialOracle delegation failed', { error: (e as Error).message });
                delegatedResults['material-oracle'] = null;
              }),
          );
        }

        // Run delegations in parallel
        await Promise.all(delegations);
      }
    } catch (err) {
      logger.warn('Sub-agent delegation unavailable — using local results only', {
        error: (err as Error).message,
      });
    }

    const allRecommendations = [
      ...compliance.recommendations,
      ...schedule.recommendations,
      ...materials.recommendations,
      ...(subcontractor?.recommendations || []),
    ];

    // Merge sub-agent recommendations
    for (const [agentName, response] of Object.entries(delegatedResults)) {
      if (response?.recommendations) {
        allRecommendations.push(...response.recommendations.map((r) => `[${agentName}] ${r}`));
      }
    }

    // Deduplicate
    const uniqueRecs = [...new Set(allRecommendations)];

    // Overall risk score
    const flags = (compliance.result.complianceFlags as string[]) || [];
    const winterOverlap = schedule.result.winterOverlap as boolean;
    const compressed = (schedule.result.daysPerPhase as number) < 30;
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (flags.length > 2 || (compressed && winterOverlap)) riskLevel = 'critical';
    else if (flags.length > 0 || winterOverlap) riskLevel = 'high';
    else if (compressed) riskLevel = 'medium';

    // Lower risk if sub-agents provided good confidence
    const sitesenseConfidence = delegatedResults.sitesense?.confidence;
    if (sitesenseConfidence && sitesenseConfidence > 0.8 && riskLevel === 'high') {
      riskLevel = 'medium'; // Sub-agent data improves assessment
    }

    const orchestrated = Object.entries(delegatedResults)
      .filter(([, r]) => r !== null)
      .map(([name, r]) => `${name} (confidence: ${r!.confidence})`);

    return {
      result: {
        projectId: input.projectId,
        overallRiskLevel: riskLevel,
        compliance: compliance.result,
        schedule: schedule.result,
        materials: materials.result,
        subcontractor: subcontractor?.result || null,
        delegatedAgents: orchestrated,
        delegatedResults: Object.fromEntries(
          Object.entries(delegatedResults)
            .filter(([, r]) => r !== null)
            .map(([name, r]) => [name, { confidence: r!.confidence, result: r!.result }]),
        ),
        recommendationCount: uniqueRecs.length,
      },
      reasoning: `Full assessment for "${input.project.name}": Overall risk ${riskLevel.toUpperCase()}. ${flags.length} compliance flags, ${winterOverlap ? 'winter overlap' : 'no winter issues'}, ${compressed ? 'compressed schedule' : 'adequate schedule'}. ${orchestrated.length} sub-agents delegated. ${uniqueRecs.length} recommendations generated.`,
      recommendations: uniqueRecs,
    };
  }

  // ============ HELPERS ============

  private validateInput(input: Record<string, unknown>): ConstructionInput {
    const actions = [
      'compliance-check',
      'subcontractor-vet',
      'material-assessment',
      'schedule-risk',
      'full-assessment',
    ];
    if (!actions.includes(input.action as string)) {
      throw new Error(`action must be one of: ${actions.join(', ')}`);
    }
    if (!input.project || typeof input.project !== 'object') {
      throw new Error('project object is required');
    }
    const project = input.project as ConstructionProject;
    if (!project.name || !project.phase || !project.type) {
      throw new Error('project must have name, phase, and type');
    }
    return {
      projectId: (input.projectId as string) || 'unknown',
      action: input.action as ConstructionInput['action'],
      project,
      site: input.site as Record<string, unknown>,
      materials: input.materials as Record<string, unknown>,
      tasks: input.tasks as Record<string, unknown>,
      subcontractor: input.subcontractor as SubcontractorInfo,
    };
  }

  private identifyApplicableRegulations(project: ConstructionProject): string[] {
    const regs = [
      'MRL (Maankäyttö- ja rakennuslaki) - Finnish Land Use and Building Act',
      'EU Construction Products Regulation (305/2011)',
      'VNa 205/2009 - Construction safety',
    ];
    if (project.budget > 1000000) {
      regs.push('CSRD - Corporate Sustainability Reporting Directive');
    }
    if (project.type === 'residential' || project.type === 'commercial') {
      regs.push('EPBD - Energy Performance of Buildings Directive (recast 2024)');
      regs.push('EN 15978 - Sustainability assessment of buildings');
    }
    if (project.budget > 10000000) {
      regs.push('EU Directive 92/57/EEC - Construction site safety');
      regs.push('EU Taxonomy Regulation - Sustainable construction activities');
    }
    return regs;
  }

  private async enhanceWithLLM(
    input: ConstructionInput,
    result: Record<string, unknown>,
  ): Promise<string[] | null> {
    const prompt = [
      `You are a Finnish construction compliance expert.`,
      `Project: ${input.project.name} (${input.project.type}, ${input.project.phase} phase)`,
      `Location: ${input.project.location}`,
      `Budget: EUR ${input.project.budget}`,
      `Action: ${input.action}`,
      `Current findings: ${JSON.stringify(result).slice(0, 500)}`,
      ``,
      `Provide 2-3 additional recommendations as JSON: {"recommendations": ["...", "..."]}`,
    ].join('\n');

    const llm = await this.callLLM(prompt);
    try {
      const parsed = JSON.parse(llm.content);
      return Array.isArray(parsed.recommendations) ? parsed.recommendations : null;
    } catch {
      return null;
    }
  }

  private calculateConfidence(input: ConstructionInput): number {
    let confidence = 0.75;
    if (input.action === 'full-assessment') confidence += 0.1;
    if (input.site) confidence += 0.05;
    if (input.materials) confidence += 0.05;
    if (input.tasks) confidence += 0.05;
    return Math.max(0, Math.min(1, confidence));
  }
}
