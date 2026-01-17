/**
 * DWS IQ 6 - ERP Integration Service
 *
 * Core service for managing ERP integrations
 */

import pino from 'pino';
import { BaseERPConnector } from './base-connector';
import { MonitorERPConnector } from './monitor-connector';
import { IFSCloudConnector } from './connectors/ifs-connector';
import { Dynamics365Connector } from './connectors/dynamics365-connector';
import { SAPConnector } from './connectors/sap-connector';
import { VismaConnector } from './connectors/visma-connector';
import { JeevesConnector } from './connectors/jeeves-connector';
import {
  ERPProvider,
  ERPConnectionConfig,
  ERPIntegrationSettings,
  SyncSettings,
  FieldMapping,
  SyncResult,
  SyncOperation,
  MachineData,
  OEEMetrics,
  ERPWebhookEvent
} from './types';

const logger = pino({ name: 'erp-integration-service' });

export class ERPIntegrationService {
  private connectors: Map<string, BaseERPConnector> = new Map();
  private integrationSettings: Map<string, ERPIntegrationSettings> = new Map();

  constructor() {
    logger.info('ERP Integration Service initialized');
  }

  /**
   * Configure a new ERP integration
   */
  async configureIntegration(
    organizationId: string,
    provider: ERPProvider,
    config: ERPConnectionConfig,
    syncSettings: SyncSettings,
    fieldMappings: FieldMapping[]
  ): Promise<ERPIntegrationSettings> {
    try {
      // Create connector instance
      const connector = this.createConnector(provider, config);

      // Test connection
      const isConnected = await connector.testConnection();

      if (!isConnected) {
        throw new Error(`Failed to connect to ${provider}`);
      }

      // Store connector
      const key = `${organizationId}:${provider}`;
      this.connectors.set(key, connector);

      // Create integration settings
      const settings: ERPIntegrationSettings = {
        organizationId,
        provider,
        config,
        syncSettings,
        fieldMappings,
        status: 'active',
        lastSyncAt: undefined
      };

      this.integrationSettings.set(key, settings);

      // TODO: Persist to database
      // await supabase.from('erp_integrations').insert(settings);

      logger.info('ERP integration configured', {
        organizationId,
        provider
      });

      return settings;
    } catch (error) {
      logger.error('Failed to configure ERP integration', { error });
      throw error;
    }
  }

  /**
   * Test ERP connection
   */
  async testConnection(organizationId: string, provider: ERPProvider): Promise<boolean> {
    const connector = this.getConnector(organizationId, provider);
    return await connector.testConnection();
  }

  /**
   * Get all integrations for an organization
   */
  async getIntegrations(organizationId: string): Promise<ERPIntegrationSettings[]> {
    const integrations: ERPIntegrationSettings[] = [];

    for (const [key, settings] of this.integrationSettings.entries()) {
      if (settings.organizationId === organizationId) {
        integrations.push(settings);
      }
    }

    // TODO: Load from database if not in memory
    // const dbIntegrations = await supabase
    //   .from('erp_integrations')
    //   .select('*')
    //   .eq('organization_id', organizationId);

    return integrations;
  }

  /**
   * Sync production orders from ERP
   */
  async syncProductionOrders(
    organizationId: string,
    provider: ERPProvider,
    since?: Date
  ): Promise<SyncResult> {
    try {
      const connector = this.getConnector(organizationId, provider);
      const result = await connector.syncProductionOrders(since);

      await this.updateLastSync(organizationId, provider);

      return result;
    } catch (error) {
      logger.error('Failed to sync production orders', { error });
      throw error;
    }
  }

  /**
   * Sync machine data to ERP
   */
  async syncMachineData(
    organizationId: string,
    provider: ERPProvider,
    data: MachineData[]
  ): Promise<SyncResult> {
    try {
      const connector = this.getConnector(organizationId, provider);
      const result = await connector.syncMachineData(data);

      await this.updateLastSync(organizationId, provider);

      return result;
    } catch (error) {
      logger.error('Failed to sync machine data', { error });
      throw error;
    }
  }

  /**
   * Sync OEE metrics to ERP
   */
  async syncOEEMetrics(
    organizationId: string,
    provider: ERPProvider,
    metrics: OEEMetrics[]
  ): Promise<SyncResult> {
    try {
      const connector = this.getConnector(organizationId, provider);
      const result = await connector.syncOEEMetrics(metrics);

      await this.updateLastSync(organizationId, provider);

      return result;
    } catch (error) {
      logger.error('Failed to sync OEE metrics', { error });
      throw error;
    }
  }

  /**
   * Sync maintenance events
   */
  async syncMaintenanceEvents(
    organizationId: string,
    provider: ERPProvider,
    direction: 'to_erp' | 'from_erp'
  ): Promise<SyncResult> {
    try {
      const connector = this.getConnector(organizationId, provider);
      const result = await connector.syncMaintenanceEvents(direction);

      await this.updateLastSync(organizationId, provider);

      return result;
    } catch (error) {
      logger.error('Failed to sync maintenance events', { error });
      throw error;
    }
  }

  /**
   * Handle webhook events from ERP systems
   */
  async handleWebhook(provider: ERPProvider, event: any): Promise<void> {
    try {
      logger.info('Received ERP webhook', { provider, eventType: event.type });

      // TODO: Process webhook event
      // - Validate signature
      // - Parse event data
      // - Update DWS database
      // - Trigger downstream actions

      const webhookEvent: ERPWebhookEvent = {
        id: this.generateId(),
        provider,
        eventType: event.type,
        entityType: event.entityType,
        entityId: event.entityId,
        timestamp: new Date(),
        payload: event,
        processed: false
      };

      // TODO: Store in database
      // await supabase.from('erp_webhook_events').insert(webhookEvent);

      logger.info('Webhook event processed', { eventId: webhookEvent.id });
    } catch (error) {
      logger.error('Failed to handle webhook', { error });
      throw error;
    }
  }

  /**
   * Get sync history
   */
  async getSyncHistory(
    organizationId: string,
    provider?: ERPProvider,
    limit: number = 50
  ): Promise<SyncOperation[]> {
    // TODO: Load from database
    // const query = supabase
    //   .from('erp_sync_operations')
    //   .select('*')
    //   .eq('organization_id', organizationId)
    //   .order('started_at', { ascending: false })
    //   .limit(limit);
    //
    // if (provider) {
    //   query.eq('provider', provider);
    // }
    //
    // const { data } = await query;
    // return data;

    return [];
  }

  /**
   * Get or create connector for organization + provider
   */
  private getConnector(organizationId: string, provider: ERPProvider): BaseERPConnector {
    const key = `${organizationId}:${provider}`;
    const connector = this.connectors.get(key);

    if (!connector) {
      throw new Error(`No ${provider} integration configured for organization ${organizationId}`);
    }

    return connector;
  }

  /**
   * Create connector instance based on provider
   */
  private createConnector(
    provider: ERPProvider,
    config: ERPConnectionConfig
  ): BaseERPConnector {
    switch (provider) {
      case ERPProvider.MONITOR:
        return new MonitorERPConnector(config as any);

      case ERPProvider.IFS:
        return new IFSCloudConnector(config as any);

      case ERPProvider.DYNAMICS_365:
        return new Dynamics365Connector(config as any);

      case ERPProvider.SAP:
        return new SAPConnector(config as any);

      case ERPProvider.VISMA:
        return new VismaConnector(config as any);

      case ERPProvider.JEEVES:
        return new JeevesConnector(config as any);

      default:
        throw new Error(`Unsupported ERP provider: ${provider}`);
    }
  }

  /**
   * Update last sync timestamp
   */
  private async updateLastSync(organizationId: string, provider: ERPProvider): Promise<void> {
    const key = `${organizationId}:${provider}`;
    const settings = this.integrationSettings.get(key);

    if (settings) {
      settings.lastSyncAt = new Date();
      // TODO: Update in database
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
