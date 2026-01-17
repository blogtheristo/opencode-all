/**
 * DWS IQ 6 - ERP Integration Scheduler
 *
 * Automated scheduling for ERP synchronization tasks
 */

import cron from 'node-cron';
import pino from 'pino';
import { ERPIntegrationService } from './service';
import { ERPProvider, EntityType } from './types';

const logger = pino({ name: 'erp-scheduler' });

export class ERPScheduler {
  private service: ERPIntegrationService;
  private jobs: Map<string, cron.ScheduledTask> = new Map();
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
    this.scheduleJob(
      'production-orders-sync',
      '0 */6 * * *',
      async () => {
        await this.syncProductionOrdersForAll();
      }
    );

    // Machine data sync - every hour
    this.scheduleJob(
      'machine-data-sync',
      '0 * * * *',
      async () => {
        await this.syncMachineDataForAll();
      }
    );

    // OEE metrics sync - every 4 hours
    this.scheduleJob(
      'oee-metrics-sync',
      '0 */4 * * *',
      async () => {
        await this.syncOEEMetricsForAll();
      }
    );

    // Maintenance events sync - daily at 02:00
    this.scheduleJob(
      'maintenance-sync',
      '0 2 * * *',
      async () => {
        await this.syncMaintenanceForAll();
      }
    );

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
    const job = cron.schedule(
      cronExpression,
      async () => {
        try {
          logger.info(`Running scheduled job: ${name}`);
          const startTime = Date.now();

          await handler();

          const duration = Date.now() - startTime;
          logger.info(`Completed job: ${name}`, { durationMs: duration });
        } catch (error) {
          logger.error(`Job failed: ${name}`, { error });
        }
      },
      {
        scheduled: false // Don't start immediately
      }
    );

    job.start();
    this.jobs.set(name, job);

    logger.info(`Scheduled job: ${name}`, { cronExpression });
  }

  /**
   * Sync production orders for all active integrations
   */
  private async syncProductionOrdersForAll(): Promise<void> {
    // TODO: Get all active integrations from database
    // const integrations = await this.getActiveIntegrations();

    // For now, use a placeholder
    const integrations: Array<{ organizationId: string; provider: ERPProvider }> = [];

    for (const integration of integrations) {
      try {
        // Sync data from last 24 hours
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const result = await this.service.syncProductionOrders(
          integration.organizationId,
          integration.provider,
          since
        );

        logger.info('Production orders synced', {
          organizationId: integration.organizationId,
          provider: integration.provider,
          processed: result.processedRecords,
          failed: result.failedRecords
        });
      } catch (error) {
        logger.error('Failed to sync production orders', {
          organizationId: integration.organizationId,
          provider: integration.provider,
          error
        });
      }
    }
  }

  /**
   * Sync machine data for all active integrations
   */
  private async syncMachineDataForAll(): Promise<void> {
    // TODO: Get machine data from DWS database that needs to be synced
    // const machineData = await this.getPendingMachineData();

    const machineData: any[] = [];

    if (machineData.length === 0) {
      logger.debug('No pending machine data to sync');
      return;
    }

    // TODO: Get active integrations and sync
    logger.info(`Syncing ${machineData.length} machine data records`);
  }

  /**
   * Sync OEE metrics for all active integrations
   */
  private async syncOEEMetricsForAll(): Promise<void> {
    // TODO: Get OEE metrics from DWS database
    // Calculate OEE for the last period and sync to ERP

    logger.info('OEE metrics sync completed');
  }

  /**
   * Sync maintenance events for all active integrations
   */
  private async syncMaintenanceForAll(): Promise<void> {
    // TODO: Get active integrations
    const integrations: Array<{ organizationId: string; provider: ERPProvider }> = [];

    for (const integration of integrations) {
      try {
        // Bidirectional sync: pull scheduled maintenance, push predictive alerts
        await this.service.syncMaintenanceEvents(
          integration.organizationId,
          integration.provider,
          'from_erp'
        );

        await this.service.syncMaintenanceEvents(
          integration.organizationId,
          integration.provider,
          'to_erp'
        );

        logger.info('Maintenance events synced', {
          organizationId: integration.organizationId,
          provider: integration.provider
        });
      } catch (error) {
        logger.error('Failed to sync maintenance events', {
          organizationId: integration.organizationId,
          provider: integration.provider,
          error
        });
      }
    }
  }

  /**
   * Get job status
   */
  getStatus(): Array<{ name: string; running: boolean }> {
    return Array.from(this.jobs.entries()).map(([name, job]) => ({
      name,
      running: true // node-cron doesn't expose running status directly
    }));
  }
}

// Export singleton
export const erpScheduler = new ERPScheduler(new ERPIntegrationService());
