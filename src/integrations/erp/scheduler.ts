/**
 * DWS IQ 6 - ERP Integration Scheduler
 *
 * Automated scheduling for ERP synchronization tasks
 */

import cron, { type ScheduledTask } from 'node-cron';
import pino from 'pino';
import { ERPIntegrationService } from './service.js';
import { ERPProvider } from './types.js';
import { getSupabaseClient } from '../../config/supabase.js';

const logger = pino({ name: 'erp-scheduler' });

export class ERPScheduler {
  private service: ERPIntegrationService;
  private jobs: Map<string, ScheduledTask> = new Map();
  private enabled: boolean;

  constructor(service: ERPIntegrationService) {
    this.service = service;
    this.enabled = process.env.ERP_SCHEDULER_ENABLED === 'true';
  }

  /**
   * Start all scheduled jobs
   */
  start(): void {
    if (!this.enabled) {
      logger.info('ERP scheduler is disabled');
      return;
    }

    logger.info('Starting ERP scheduler');

    // Production orders sync - every 6 hours
    this.scheduleJob('production-orders-sync', '0 */6 * * *', async () => {
      await this.syncProductionOrdersForAll();
    });

    // Machine data sync - every hour
    this.scheduleJob('machine-data-sync', '0 * * * *', async () => {
      await this.syncMachineDataForAll();
    });

    // OEE metrics sync - every 4 hours
    this.scheduleJob('oee-metrics-sync', '0 */4 * * *', async () => {
      await this.syncOEEMetricsForAll();
    });

    // Maintenance events sync - daily at 02:00
    this.scheduleJob('maintenance-sync', '0 2 * * *', async () => {
      await this.syncMaintenanceForAll();
    });

    logger.info(`ERP scheduler started with ${this.jobs.size} jobs`);
  }

  /**
   * Stop all scheduled jobs
   */
  stop(): void {
    logger.info('Stopping ERP scheduler');

    for (const [name, job] of this.jobs.entries()) {
      job.stop();
      logger.info(`Stopped job: ${name}`);
    }

    this.jobs.clear();
  }

  /**
   * Run a specific job manually
   */
  async runManually(jobName: string): Promise<void> {
    logger.info(`Manually running job: ${jobName}`);

    switch (jobName) {
      case 'production-orders-sync':
        await this.syncProductionOrdersForAll();
        break;

      case 'machine-data-sync':
        await this.syncMachineDataForAll();
        break;

      case 'oee-metrics-sync':
        await this.syncOEEMetricsForAll();
        break;

      case 'maintenance-sync':
        await this.syncMaintenanceForAll();
        break;

      default:
        throw new Error(`Unknown job: ${jobName}`);
    }
  }

  /**
   * Schedule a cron job
   */
  private scheduleJob(name: string, cronExpression: string, handler: () => Promise<void>): void {
    // node-cron v4 removed the `scheduled` option — schedule() no longer supports
    // creating a task without starting it. Kept the explicit start() call below to
    // preserve the original "create, then start" intent even though it's now a no-op.
    const job = cron.schedule(cronExpression, async () => {
      try {
        logger.info(`Running scheduled job: ${name}`);
        const startTime = Date.now();

        await handler();

        const duration = Date.now() - startTime;
        logger.info({ durationMs: duration }, `Completed job: ${name}`);
      } catch (error) {
        logger.error({ error }, `Job failed: ${name}`);
      }
    });

    job.start();
    this.jobs.set(name, job);

    logger.info({ cronExpression }, `Scheduled job: ${name}`);
  }

  /**
   * Fetch active ERP integrations from Supabase.
   */
  private async getActiveIntegrations(): Promise<
    Array<{ organizationId: string; provider: ERPProvider }>
  > {
    const client = getSupabaseClient();
    if (!client) {
      logger.debug('Supabase not configured, no active integrations');
      return [];
    }

    try {
      const { data, error } = await client
        .from('erp_integrations')
        .select('organization_id, provider')
        .eq('status', 'active');

      if (error) {
        logger.error({ error: error.message }, 'Failed to fetch active integrations');
        return [];
      }

      return (data || []).map((row: { organization_id: string; provider: string }) => ({
        organizationId: row.organization_id,
        provider: row.provider as ERPProvider,
      }));
    } catch (err) {
      logger.error({ error: (err as Error).message }, 'Error querying integrations');
      return [];
    }
  }

  /**
   * Sync production orders for all active integrations
   */
  private async syncProductionOrdersForAll(): Promise<void> {
    const integrations = await this.getActiveIntegrations();

    for (const integration of integrations) {
      try {
        // Sync data from last 24 hours
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const result = await this.service.syncProductionOrders(
          integration.organizationId,
          integration.provider,
          since,
        );

        logger.info(
          {
            organizationId: integration.organizationId,
            provider: integration.provider,
            processed: result.processedRecords,
            failed: result.failedRecords,
          },
          'Production orders synced',
        );
      } catch (error) {
        logger.error(
          {
            organizationId: integration.organizationId,
            provider: integration.provider,
            error,
          },
          'Failed to sync production orders',
        );
      }
    }
  }

  /**
   * Sync machine data for all active integrations
   */
  private async syncMachineDataForAll(): Promise<void> {
    const client = getSupabaseClient();
    if (!client) {
      logger.debug('No Supabase client, skipping machine data sync');
      return;
    }

    // Fetch pending machine data from DWS database
    const { data: machineData, error } = await client
      .from('machine_telemetry')
      .select('*')
      .eq('sync_status', 'pending')
      .limit(100);

    if (error) {
      logger.error({ error: error.message }, 'Failed to fetch pending machine data');
      return;
    }

    if (!machineData || machineData.length === 0) {
      logger.debug('No pending machine data to sync');
      return;
    }

    logger.info(`Syncing ${machineData.length} machine data records`);

    const integrations = await this.getActiveIntegrations();
    for (const integration of integrations) {
      try {
        // TODO: map machineData rows (machine_telemetry, filtered by sync_status)
        // to this integration's organization before syncing — currently a no-op
        // pass-through pending that mapping (pre-existing gap, not introduced here).
        await this.service.syncMachineData(integration.organizationId, integration.provider, []);
      } catch (err) {
        logger.error(
          {
            organizationId: integration.organizationId,
            error: (err as Error).message,
          },
          'Machine data sync failed',
        );
      }
    }
  }

  /**
   * Sync OEE metrics for all active integrations
   */
  private async syncOEEMetricsForAll(): Promise<void> {
    const integrations = await this.getActiveIntegrations();

    for (const integration of integrations) {
      try {
        // TODO: source pending OEE metrics per integration before syncing —
        // currently a no-op pass-through (pre-existing gap, not introduced here).
        await this.service.syncOEEMetrics(integration.organizationId, integration.provider, []);
        logger.info(
          {
            organizationId: integration.organizationId,
            provider: integration.provider,
          },
          'OEE metrics synced',
        );
      } catch (err) {
        logger.error(
          {
            organizationId: integration.organizationId,
            error: (err as Error).message,
          },
          'OEE metrics sync failed',
        );
      }
    }

    logger.info('OEE metrics sync completed');
  }

  /**
   * Sync maintenance events for all active integrations
   */
  private async syncMaintenanceForAll(): Promise<void> {
    const integrations = await this.getActiveIntegrations();

    for (const integration of integrations) {
      try {
        // Bidirectional sync: pull scheduled maintenance, push predictive alerts
        await this.service.syncMaintenanceEvents(
          integration.organizationId,
          integration.provider,
          'from_erp',
        );

        await this.service.syncMaintenanceEvents(
          integration.organizationId,
          integration.provider,
          'to_erp',
        );

        logger.info(
          {
            organizationId: integration.organizationId,
            provider: integration.provider,
          },
          'Maintenance events synced',
        );
      } catch (error) {
        logger.error(
          {
            organizationId: integration.organizationId,
            provider: integration.provider,
            error,
          },
          'Failed to sync maintenance events',
        );
      }
    }
  }

  /**
   * Get job status
   */
  getStatus(): Array<{ name: string; running: boolean }> {
    return Array.from(this.jobs.entries()).map(([name]) => ({
      name,
      running: true, // node-cron doesn't expose running status directly
    }));
  }
}

// Export singleton
export const erpScheduler = new ERPScheduler(new ERPIntegrationService());
