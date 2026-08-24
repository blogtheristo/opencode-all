/**
 * HIC Content Audit Agent — DWS Content Production Standard gate
 *
 * Binary (Approved / To be corrected) pre-publication audit of any DWS material
 * against the DWS Content Production Standard. No material reaches publication
 * without every checklist point approved. Companion to
 * `DWS_CONTENT_PRODUCTION_STANDARD_HIC_AUDIT.md` / `_EN.md`.
 *
 * The audit is rule-based and deterministic for the 13 checklist points; an LLM
 * judgment is used only for the three language/content checks (reactance,
 * two-sidedness, repetition) so the binary verdict is auditable and reproducible.
 *
 * Input:
 *   {
 *     text: string,            // the draft to audit (required)
 *     contentType?: string,    // 'blog' | 'linkedin' | 'facebook' | 'whitepaper' | 'card' | 'other'
 *     language?: string,       // ISO code of the draft (default 'en')
 *     priorPublications?: string[]  // excerpt/slug list for the repetition check
 *   }
 *
 * Output: per-point boolean verdicts, overall APPROVED / TO_BE_CORRECTED, and
 * the ordered correction list. Always requires a named HIC approver; the audit
 * is the pre-approval gate, not the approval itself.
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

export const HIC_AUDIT_POINTS = [
  'targeting',            // 1. Industry, enterprise and buyer are clearly defined
  'limitation-compliance', // 2. Compliance context and material limitation disclosed early
  'claim-map-sources',    // 3. Every claim classified (public source / company data / DWS analysis / hypothesis) + linked to evidence
  'decision-impact',      // 4. Business or decision impact described accurately
  'management-measure',   // 5. Concrete control method shown
  'residual-uncertainty', // 6. Remaining uncertainty and solution boundaries explicit
  'demo-connection',      // 7. Demo/next step follows logically from the control method, not disguised sales pressure
  'reactance-prevention', // 8. No coercive language / uncontrolled reactance
  'managed-two-sidedness',// 9. Two-sided reasoning relevant, proportionate, paired with a credible control method
  'recognized-repetition',// 10. Repetition reinforces a verified core claim without mechanical copying
  'reference-formatting', // 11. Academic and public references precise and consistently formatted
  'information-separation', // 12. Public facts, DWS analysis and product hypotheses visibly separated
  'ontology-feedback',    // 13. Ontology-feedback datapoints or questions defined
] as const;

const SOUL = `You are the HIC Content Audit Agent, the binary pre-publication gate of the
DWS Content Production Standard.

CORE RULE (verbatim): A material may be published only when every audit check is
approved. The audit status is either APPROVED or CORRECTABLE. If one or more
checks fail, set the status to CORRECTABLE, list the exact defects, and block
publication. Do not publish, localize for release, distribute, or feed
unvalidated claims into the ontology or World Model.

You judge ONLY the three content checks below; all other checks are already
resolved deterministically by the rule engine:

1. REACTANCE PREVENTION: Does the text avoid coercive language and uncontrolled
   reactance? Coercive = imperative pressure ("act now", "don't miss", "buy
   today"), superlative unverified claims, or concealed selling.
2. MANAGED TWO-SIDEDNESS: Is the two-sided reasoning relevant, proportionate,
   and paired with a credible control method? A critical limitation raised
   without a credible control method fails.
3. RECOGNIZED REPETITION: Does the repetition reinforce a verified core claim
   in a new context WITHOUT mechanical copying of prior publications (supplied
   in priorPublications)?

Return STRICT JSON:
{
  "reactance_prevention": true|false,
  "reactance_reason": "one sentence",
  "managed_two_sidedness": true|false,
  "two_sided_reason": "one sentence",
  "recognized_repetition": true|false,
  "repetition_reason": "one sentence"
}

DECISION RULE: APPROVED only if all checks pass. Otherwise CORRECTABLE. No
exceptions. Be conservative: when in doubt, return false.`;

interface ContentJudgments {
  reactance_prevention: boolean;
  reactance_reason: string;
  managed_two_sidedness: boolean;
  two_sided_reason: string;
  recognized_repetition: boolean;
  repetition_reason: string;
}

export class HicContentAuditAgent extends BaseAgent {
  constructor() {
    super({
      name: 'hic-content-audit',
      description:
        'Binary pre-publication audit against the DWS Content Production Standard — 13 checklist points, Approved/To be corrected, requires a named HIC approver',
      capabilities: [
        'dws-content-production-standard',
        'protected-argumentation-audit',
        'claim-map-verification',
        'journalistic-gate',
        'pre-publication-quality-gate',
      ],
      model: 'claude-haiku-4-5-20251001',
      modelTier: 'standard',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();

    const text = typeof input.text === 'string' ? input.text.trim() : '';
    const contentType =
      typeof input.contentType === 'string' ? input.contentType : 'other';
    const language = typeof input.language === 'string' ? input.language : 'en';
    const priorPublications = Array.isArray(input.priorPublications)
      ? (input.priorPublications as string[]).filter((p) => typeof p === 'string')
      : [];

    if (!text) {
      return {
        agentName: this.config.name,
        result: {
          verdict: 'INCOMPLETE',
          approved: false,
          errors: ['No text supplied — input.text is required'],
        },
        confidence: 0,
        reasoning: 'Cannot audit an empty draft.',
        recommendations: ['Supply the draft text in input.text'],
        metadata: { durationMs: Date.now() - startTime },
      };
    }

    // ---- Deterministic rule checks (10 of 13 points) ----
    const checks: Record<string, boolean> = {};

    // 1. Targeting: industry, enterprise size, buyer persona present.
    checks.targeting = /(industry|toimiala|branche|industrie|branches?)/i.test(text)
      && /(buyer|persona|päättäjä|decision-maker|cxo|compliance officer|purchasing)/i.test(text);

    // 2. Limitation & compliance: regulatory context + material limitation, disclosed EARLY
    //    (the limitation must appear in the first ~25% of the text, per the standard).
    const earlyPortion = text.slice(0, Math.ceil(text.length * 0.25));
    checks['limitation-compliance'] =
      /(cbam|carbon|päästö|emission|esrs|csrd|ets|edf|compliance|regulat|directive|scope\s*[123])/i.test(text)
      && /(limitation|rajoite|limit|boundary|puute|gap|does not cover|ei kata|not cover)/i.test(earlyPortion);

    // 3. Claim map & sources: claim/labeled + anchored (source/data/analysis/hypothesis).
    checks['claim-map-sources'] =
      /(source|lähde|data|analysis|analyysi|hypothesis|hypoteesi|claim|väite)/i.test(text)
      && /(according to|mukaan|reference|viite|based on|perustuu|evidence|evidenssi|report|raportti|oj|europa\.eu|europarl)/i.test(text);

    // 4. Decision impact: realistic, no exaggeration (guard against superlatives).
    checks['decision-impact'] =
      /(impact|vaikutus|risk|riski|liability|vastuu|cost|kustannus|deadline|määräaika|penalt|sakko)/i.test(text)
      && !/(100%\s*(guaranteed|accurate|compliant)|guarantee|takaa|always\s*wins)/i.test(text);

    // 5. Management measure: bounded use case / audit chain / marked data gaps.
    checks['management-measure'] =
      /(management|hallintakeino|mitigation|use\s*case|käyttötapaus|audit\s*chain|auditointiketju|control|säätö|remediation|evidence\s*chain)/i.test(text)
      || /(how (we|to) (manage|handle)|miten (hallitaan|hallinta)|mitigated)/i.test(text);

    // 6. Residual uncertainty: explicit boundaries, no "magic button".
    checks['residual-uncertainty'] =
      /(residual|jäljelle|uncertain|epävarm|not a complete|ei.*täydellinen|support|tuki|limits|rajat|beyond)/i.test(text);

    // 7. Demo connection: demo/next step as logical continuation.
    checks['demo-connection'] =
      /(demo|demonstration|next step|seuraava askel|pilot|discovery|workflow)/i.test(text)
      && !/(buy now|osta nyt|order today|tilaa nyt|limited offer)/i.test(text);

    // 8. Reactance prevention — rule pre-check, LLM confirms.
    checks['reactance-prevention'] = !/(buy now|osta nyt|act now|toimi nyt|don't miss|order today|limited time|hurry)/i.test(text);

    // 9. Managed two-sidedness — LLM confirms; rule pre-check requires a limitation
    //    and a management measure (both already needed by points 2 and 5).
    checks['managed-two-sidedness'] = checks['limitation-compliance'] && checks['management-measure'];

    // 10. Recognized repetition — LLM confirms; rule pre-check: text is not byte-identical
    //     to a prior publication.
    checks['recognized-repetition'] = !priorPublications.some((p) => p === text);

    // 11. Reference formatting: Oxford or standardized reference markers.
    checks['reference-formatting'] =
      /(\b\d+\s*[–-]\s*\d+\b|\b\d{4}\b.*[A-Z]|\(\d{4}\)|\d{4}[,.]\s*pp?\.|\bdoi:)/i.test(text)
      || /(references|viitteet|sources|lähteet|bibliography|lähdeluettelo)/i.test(text);

    // 12. Information separation: public data vs own analysis vs product hypothesis.
    checks['information-separation'] =
      /(public|julkinen|source|lähde|own|oma|analysis|analyysi|hypothesis|hypoteesi|dws)/i.test(text)
      && /(separat|erottel|distingu|labeled|classified|luokitell)/i.test(text);

    // 13. Ontology feedback readiness: defined data points / questions for World Model.
    checks['ontology-feedback'] =
      /(feedback|palautte|ontology|ontologi|world model|data points|datapiste|questions|kysymy)/i.test(text);

    // ---- LLM content judgments (3 points) ----
    let contentJudgments: ContentJudgments = {
      reactance_prevention: checks['reactance-prevention'],
      reactance_reason: 'rule pre-check only',
      managed_two_sidedness: checks['managed-two-sidedness'],
      two_sided_reason: 'rule pre-check only',
      recognized_repetition: checks['recognized-repetition'],
      repetition_reason: 'rule pre-check only',
    };
    let llmModel = 'rule-only';
    try {
      const llmResult = await this.callLLM(
        `${SOUL}

Content type: ${contentType}
Language: ${language}
Prior publications (for repetition check): ${priorPublications.length ? priorPublications.join('\n---\n') : '(none supplied)'}

DRAFT TO AUDIT:
${text.slice(0, 8000)}`,
      );
      llmModel = llmResult.model;
      const parsed = JSON.parse(llmResult.content);
      contentJudgments = {
        reactance_prevention: parsed.reactance_prevention ?? checks['reactance-prevention'],
        reactance_reason: parsed.reactance_reason ?? 'not provided',
        managed_two_sidedness: parsed.managed_two_sidedness ?? checks['managed-two-sidedness'],
        two_sided_reason: parsed.two_sided_reason ?? 'not provided',
        recognized_repetition: parsed.recognized_repetition ?? checks['recognized-repetition'],
        repetition_reason: parsed.repetition_reason ?? 'not provided',
      };
    } catch {
      // Graceful degradation: LLM judgment unavailable — keep deterministic verdicts.
    }

    // Override the three content checks with the LLM verdicts when available.
    checks['reactance-prevention'] = contentJudgments.reactance_prevention;
    checks['managed-two-sidedness'] = contentJudgments.managed_two_sidedness;
    checks['recognized-repetition'] = contentJudgments.recognized_repetition;

    // ---- Binary verdict: APPROVED only if all checks pass, otherwise CORRECTABLE. No exceptions. ----
    const failed = Object.entries(checks)
      .filter(([, pass]) => !pass)
      .map(([point]) => point);
    const approved = failed.length === 0;

    const recommendations = approved
      ? [
          'Proceed to HIC approval — all 13 DWS Content Production Standard points pass.',
          'HIC remains the final responsible approver; this audit is the pre-approval gate, not the approval itself.',
        ]
      : [
          `CORRECTABLE — ${failed.length} failing point(s); publication blocked until all pass: ${failed.join(', ')}`,
          ...Object.entries(checks)
            .filter(([, pass]) => !pass)
            .map(([point]) => `Re-audit after fixing: ${point}`),
        ];

    const reasoning = approved
      ? `All 13 DWS Content Production Standard points approved (contentType=${contentType}). Decision rule: APPROVED (all checks pass). No exceptions. HIC approval still required before publication, localization, distribution, or ontology/World Model feedback.`
      : `CORRECTABLE — blocked by ${failed.length} point(s): ${failed.join(', ')}. Decision rule: APPROVED only if all checks pass, otherwise CORRECTABLE, no exceptions. Blocked: publication, localization for release, distribution, and feeding unvalidated claims into the ontology or World Model. ${
          contentJudgments.managed_two_sidedness
            ? ''
            : `Two-sidedness: ${contentJudgments.two_sided_reason} `
        }${
          contentJudgments.reactance_prevention
            ? ''
            : `Reactance: ${contentJudgments.reactance_reason} `
        }${
          contentJudgments.recognized_repetition
            ? ''
            : `Repetition: ${contentJudgments.repetition_reason}`
        }`;

    const response: AgentResponse = {
      agentName: this.config.name,
      result: {
        verdict: approved ? 'APPROVED' : 'TO_BE_CORRECTED',
        approved,
        contentType,
        language,
        pointChecks: checks,
        failedPoints: failed,
        totalPoints: HIC_AUDIT_POINTS.length,
        llmContentJudgments: contentJudgments,
        auditStatus: 'PRE_APPROVAL_GATE',
        // The audit is the gate, not the approval: a named HIC approver is still required.
        requiresHicApprover: true,
      },
      confidence: approved ? 0.9 : 0.95,
      reasoning,
      recommendations,
      metadata: {
        durationMs: Date.now() - startTime,
        llmModel,
        auditPoints: HIC_AUDIT_POINTS.length,
        priorPublicationsChecked: priorPublications.length,
      },
    };

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input: { contentType, language, textLength: text.length },
      output: response,
      status: 'completed',
      duration_ms: Date.now() - startTime,
      created_at: new Date().toISOString(),
    });

    return response;
  }
}