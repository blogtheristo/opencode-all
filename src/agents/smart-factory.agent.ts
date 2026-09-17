/**
 * Smart Factory Agent — Firehorse Omnichannel "Smart Factory for Sales".
 *
 * Wraps the src/smart-factory pipeline as a first-class DWS agent:
 * takes a product catalog (any number of products), finds prospects who
 * need them, routes outreach across email / WhatsApp / LinkedIn / Facebook
 * (LinkedIn + Facebook always human-in-the-loop), and books calls into the
 * existing DWS booking system on request.
 *
 * Actions:
 *   run   — full daily pipeline (source → match → persist → capped dispatch)
 *   book  — book a call for a prospect (inserts booking_reservations)
 *
 * Tier: 2 (sends outbound communication — dispatch is rate-capped and
 * respects SMART_FACTORY_* env gates; LinkedIn/Facebook never auto-sent)
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';
import { normalizeCatalog } from '../smart-factory/catalog.js';
import { runSmartFactoryPipeline } from '../smart-factory/pipeline.js';
import { bookCall } from '../smart-factory/booker.js';
import { supabaseConfigured } from '../smart-factory/supabase.js';

interface RunInput {
  campaignName: string;
  catalogRaw?: unknown;
  channels?: string[];
  dailyCap?: number;
  noSend?: boolean;
}

export class SmartFactoryAgent extends BaseAgent {
  constructor() {
    super({
      name: 'smart-factory',
      description:
        'Smart Factory for Sales: matches any-size product catalog to prospects, runs rate-capped multi-channel outreach (email/WhatsApp/LinkedIn/Facebook), books calls. Powered by DGX Spark.',
      capabilities: [
        'product-prospect-matching',
        'multi-channel-outreach',
        'rate-capped-sending',
        'call-booking',
        'sales-pipeline',
      ],
      model: 'llama3.3:70b',
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
      const action = typeof input.action === 'string' ? input.action : 'run';
      const result =
        action === 'book' ? await this.runBook(input) : await this.runPipeline(input);

      const response: AgentResponse = {
        agentName: this.config.name,
        result,
        confidence: result.ok === false ? 0.3 : 0.85,
        reasoning: String(result.summary || result.error || 'done'),
        recommendations: [
          'Review smart_factory_prospects for match quality',
          'Check smart_factory_messages for channel outcomes',
          'Set SMART_FACTORY_QUEUE_MANUAL=true to also queue LinkedIn/Facebook drafts',
        ],
        metadata: { durationMs: Date.now() - startTime, model: this.config.model, action },
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
      logger.error('smart-factory agent failed', { error: errorMessage });

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
        duration_ms: Date.now() - startTime,
        created_at: new Date().toISOString(),
      });

      return {
        agentName: this.config.name,
        result: { error: errorMessage, ok: false },
        confidence: 0,
        reasoning: `Smart Factory failed: ${errorMessage}`,
        recommendations: [
          'Verify SUPABASE_URL / SUPABASE_SERVICE_KEY are set',
          'Apply migration 083_smart_factory_sales.sql',
          'Check SMART_FACTORY_CATALOG_PATH points to a valid catalog JSON',
        ],
        metadata: { durationMs: Date.now() - startTime, model: this.config.model },
      };
    }
  }

  // ── action: run ─────────────────────────────────────────────────────────

  private async runPipeline(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    if (!supabaseConfigured()) {
      return {
        ok: false,
        error: 'SUPABASE_URL / SUPABASE_SERVICE_KEY not configured — cannot persist or send',
        summary: 'Configure Supabase env or use the dry-run script instead',
      };
    }

    const runInput: RunInput = {
      campaignName:
        typeof input.campaignName === 'string' && input.campaignName.trim()
          ? input.campaignName.trim()
          : `smart-factory-${new Date().toISOString().slice(0, 10)}`,
      catalogRaw: input.catalog ?? input.products,
      channels: Array.isArray(input.channels)
        ? (input.channels.filter((c): c is string => typeof c === 'string') as string[])
        : undefined,
      dailyCap: typeof input.dailyCap === 'number' ? input.dailyCap : undefined,
      noSend: input.noSend === true || input.dryRun === true,
    };

    const validChannels = new Set(['email', 'whatsapp', 'linkedin', 'facebook']);
    const summary = await runSmartFactoryPipeline({
      campaignName: runInput.campaignName,
      // undefined → pipeline loads the default DWS store catalog itself
      catalogRaw: runInput.catalogRaw,
      channels: runInput.channels?.filter((c) => validChannels.has(c)) as
        | Array<'email' | 'whatsapp' | 'linkedin' | 'facebook'>
        | undefined,
      dailyCap: runInput.dailyCap,
      noSend: runInput.noSend,
    });

    return {
      ok: true,
      ...summary,
      summary: `${summary.prospectsMatched} prospects matched across ${Object.values(summary.messagesSent).reduce((a, b) => a + b, 0)} sends`,
    };
  }

  // ── action: book ────────────────────────────────────────────────────────

  private async runBook(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const campaignId = typeof input.campaignId === 'string' ? input.campaignId : '';
    const prospectId = typeof input.prospectId === 'string' ? input.prospectId : '';
    const customerName = typeof input.customerName === 'string' ? input.customerName.trim() : '';
    const customerEmail = typeof input.customerEmail === 'string' ? input.customerEmail.trim() : '';

    if (!campaignId || !prospectId || !customerName || !customerEmail) {
      return {
        ok: false,
        error: 'book requires campaignId, prospectId, customerName, customerEmail',
      };
    }

    const result = await bookCall({
      campaignId,
      prospectId,
      customerName,
      customerEmail,
      customerPhone: typeof input.customerPhone === 'string' ? input.customerPhone : undefined,
      customerCompany: typeof input.customerCompany === 'string' ? input.customerCompany : undefined,
      notes: typeof input.notes === 'string' ? input.notes : undefined,
      bookingServiceId: typeof input.bookingServiceId === 'string' ? input.bookingServiceId : undefined,
    });

    return result.ok
      ? { ok: true, reservationId: result.reservationId, reservedAt: result.reservedAt, summary: `call booked at ${result.reservedAt}` }
      : { ok: false, error: result.error };
  }
}

// Re-export for API/route consumers.
export { normalizeCatalog };
