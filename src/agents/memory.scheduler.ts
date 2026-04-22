/**
 * Memory Scheduler — DWS IQ 6/7
 *
 * Nightly cron jobs for memory maintenance:
 * - 03:00 Helsinki (01:00 UTC): Confidence decay (stale memories lose confidence)
 * - 03:30 Helsinki (01:30 UTC): Consolidation (near-duplicate dedup per customer)
 *
 * Decay runs first so consolidation operates on accurate confidence scores.
 * Both jobs are scoped per-org, per-customer (GDPR Art 5).
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-256 (consolidation-cron)
 * Date: 2026-03-23
 * Owner: Lifetime Oy
 */

import * as cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import { memoryService } from './memory.service.js';

// ============ MEMORY SCHEDULER ============

export class MemoryScheduler {
  private decayJob: cron.ScheduledTask | null = null;
  private consolidationJob: cron.ScheduledTask | null = null;
  private static readonly CONSOLIDATION_SCOPE_LIMIT = 500;

  /**
   * Start the memory maintenance cron jobs.
   * Decay: 03:00 Helsinki (Europe/Helsinki timezone)
   * Consolidation: 03:30 Helsinki (Europe/Helsinki timezone)
   */
  start(): void {
    logger.info('Starting Memory Scheduler...');

    // Decay: 03:00 Helsinki (Europe/Helsinki timezone)
    this.decayJob = cron.schedule(
      '0 3 * * *',
      async () => {
        logger.info('Memory decay cron started');
        try {
          const result = await memoryService.decayStaleMemories({
            halfLifeDays: 90,
            decayThreshold: 0.1,
          });
          logger.info('Memory decay cron complete', {
            decayedCount: result.decayedCount,
            forgottenCount: result.forgottenCount,
          });
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : 'Unknown error';
          logger.error('Memory decay cron failed', { error: msg });
        }
      },
      { timezone: 'Europe/Helsinki' },
    );

    // Consolidation: 03:30 Helsinki (Europe/Helsinki timezone)
    this.consolidationJob = cron.schedule(
      '30 3 * * *',
      async () => {
        logger.info('Memory consolidation cron started');
        try {
          await this.runConsolidationForAllScopes();
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : 'Unknown error';
          logger.error('Memory consolidation cron failed', { error: msg });
        }
      },
      { timezone: 'Europe/Helsinki' },
    );

    logger.info('Memory Scheduler started', {
      decay: '03:00 Helsinki (Europe/Helsinki timezone)',
      consolidation: '03:30 Helsinki (Europe/Helsinki timezone)',
    });
  }

  /**
   * Stop both cron jobs.
   */
  stop(): void {
    logger.info('Stopping Memory Scheduler...');
    if (this.decayJob) this.decayJob.stop();
    if (this.consolidationJob) this.consolidationJob.stop();
    logger.info('Memory Scheduler stopped');
  }

  /**
   * Run jobs manually (for testing or on-demand maintenance).
   */
  async runManually(job: 'decay' | 'consolidation' | 'all'): Promise<void> {
    logger.info('Running manual memory job', { job });

    if (job === 'decay' || job === 'all') {
      const result = await memoryService.decayStaleMemories({
        halfLifeDays: 90,
        decayThreshold: 0.1,
      });
      logger.info('Manual decay complete', {
        decayedCount: result.decayedCount,
        forgottenCount: result.forgottenCount,
      });
    }

    if (job === 'consolidation' || job === 'all') {
      await this.runConsolidationForAllScopes();
    }
  }

  /**
   * Iterate over all active org+customer scopes and run consolidation.
   * Batch limit: 500 pairs per scope per run.
   */
  private async runConsolidationForAllScopes(): Promise<void> {
    const scopes = await this.getActiveScopes();

    let totalPairs = 0;
    let totalConsolidated = 0;

    // Customer-scoped consolidation
    for (const scope of scopes.customerScopes) {
      const result = await memoryService.consolidateDuplicates(
        scope.orgId,
        scope.customerId,
        { limit: MemoryScheduler.CONSOLIDATION_SCOPE_LIMIT },
      );
      totalPairs += result.pairsFound;
      totalConsolidated += result.autoConsolidated;
    }

    // Org-level consolidation (customer_id IS NULL memories)
    for (const orgId of scopes.orgIds) {
      const result = await memoryService.consolidateOrgDuplicates(orgId, {
        limit: MemoryScheduler.CONSOLIDATION_SCOPE_LIMIT,
      });
      totalPairs += result.pairsFound;
      totalConsolidated += result.autoConsolidated;
    }

    logger.info('Consolidation run complete', {
      customerScopes: scopes.customerScopes.length,
      orgScopes: scopes.orgIds.length,
      totalPairs,
      totalConsolidated,
    });
  }

  /**
   * Query distinct org_id + customer_id pairs from active memories.
   * Returns separate lists for customer-scoped and org-level memories.
   */
  private async getActiveScopes(): Promise<{
    customerScopes: Array<{ orgId: string; customerId: string }>;
    orgIds: string[];
  }> {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      logger.warn('Supabase not configured, skipping scope discovery');
      return { customerScopes: [], orgIds: [] };
    }

    const client = createClient(url, key);

    // Get distinct org_id + customer_id pairs (customer-scoped)
    const { data: customerData, error: customerError } = await client
      .from('semantic_memories')
      .select('org_id, customer_id')
      .not('customer_id', 'is', null)
      .is('expired_at', null)
      .is('superseded_by', null)
      .limit(1000);

    if (customerError) {
      logger.error('Failed to fetch customer scopes', { error: customerError.message });
      return { customerScopes: [], orgIds: [] };
    }

    // Deduplicate org+customer pairs
    const seen = new Set<string>();
    const customerScopes: Array<{ orgId: string; customerId: string }> = [];
    for (const row of customerData || []) {
      const key = `${row.org_id}:${row.customer_id}`;
      if (!seen.has(key)) {
        seen.add(key);
        customerScopes.push({ orgId: row.org_id, customerId: row.customer_id });
      }
    }

    // Get distinct org_ids (for org-level memories)
    const { data: orgData, error: orgError } = await client
      .from('semantic_memories')
      .select('org_id')
      .is('customer_id', null)
      .is('expired_at', null)
      .is('superseded_by', null)
      .limit(1000);

    if (orgError) {
      logger.error('Failed to fetch org scopes', { error: orgError.message });
      return { customerScopes, orgIds: [] };
    }

    const orgIds = Array.from(new Set((orgData || []).map((r: { org_id: string }) => r.org_id)));

    logger.debug('Active scopes discovered', {
      customerScopes: customerScopes.length,
      orgIds: orgIds.length,
    });

    return { customerScopes, orgIds };
  }
}

/** Singleton instance */
export const memoryScheduler = new MemoryScheduler();
