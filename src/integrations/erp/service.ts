/**
 * DWS IQ 6 - ERP Integration Service
 *
 * Core service for managing ERP integrations
 */

import pino from 'pino';
import { getSupabaseClient } from '../../config/supabase.js';
import { gtmEventLogger } from '../../services/gtm-event-logger.js';
import { BaseERPConnector } from './base-connector.js';
import { MonitorERPConnector } from './monitor-connector.js';
import { IFSCloudConnector } from './connectors/ifs-connector.js';
import { Dynamics365Connector } from './connectors/dynamics365-connector.js';
import { SAPConnector } from './connectors/sap-connector.js';
import { VismaConnector } from './connectors/visma-connector.js';
import { JeevesConnector } from './connectors/jeeves-connector.js';
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
  ERPWebhookEvent,
} from './types.js';
import {
  resolveCompanyERP,
  resolveCompanyERPBatch,
  getCompaniesByProvider,
  getAllRegisteredCompanies,
  CompanyLookupResult,
  CompanyERPEntry,
} from './company-registry.js';

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
    fieldMappings: FieldMapping[],
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
        lastSyncAt: undefined,
      };

      this.integrationSettings.set(key, settings);

      // Persist to Supabase (graceful fallback to in-memory only)
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error: dbError } = await supabase.from('erp_integrations').upsert(
          {
            organization_id: organizationId,
            provider,
            config: JSON.parse(JSON.stringify(config)),
            sync_settings: JSON.parse(JSON.stringify(syncSettings)),
            field_mappings: JSON.parse(JSON.stringify(fieldMappings)),
            status: 'active',
          },
          { onConflict: 'organization_id,provider' },
        );
        if (dbError) {
          logger.warn(
            {
              error: dbError.message,
            },
            'Failed to persist ERP integration to database — using in-memory',
          );
        }
      }

      logger.info(
        {
          organizationId,
          provider,
        },
        'ERP integration configured',
      );

      // Step 13: ERP first-sync activated — customer has connected their ERP
      gtmEventLogger.logEvent({
        event_type: 'erp_sync_activated',
        source: 'backend',
        properties: {
          organization_id: organizationId,
          provider,
        },
        timestamp: new Date().toISOString(),
      });

      return settings;
    } catch (error) {
      logger.error({ error }, 'Failed to configure ERP integration');
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

    for (const [, settings] of this.integrationSettings.entries()) {
      if (settings.organizationId === organizationId) {
        integrations.push(settings);
      }
    }

    // Load from database if not in memory
    if (integrations.length === 0) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('erp_integrations')
          .select('*')
          .eq('organization_id', organizationId);
        if (!error && data) {
          for (const row of data) {
            integrations.push({
              organizationId: row.organization_id,
              provider: row.provider,
              config: row.config,
              syncSettings: row.sync_settings,
              fieldMappings: row.field_mappings,
              status: row.status,
              lastSyncAt: row.last_sync_at ? new Date(row.last_sync_at) : undefined,
            });
          }
        }
      }
    }

    return integrations;
  }

  /**
   * Sync production orders from ERP
   */
  async syncProductionOrders(
    organizationId: string,
    provider: ERPProvider,
    since?: Date,
  ): Promise<SyncResult> {
    try {
      const connector = this.getConnector(organizationId, provider);
      const result = await connector.syncProductionOrders(since);

      await this.updateLastSync(organizationId, provider);

      return result;
    } catch (error) {
      logger.error({ error }, 'Failed to sync production orders');
      throw error;
    }
  }

  /**
   * Sync machine data to ERP
   */
  async syncMachineData(
    organizationId: string,
    provider: ERPProvider,
    data: MachineData[],
  ): Promise<SyncResult> {
    try {
      const connector = this.getConnector(organizationId, provider);
      const result = await connector.syncMachineData(data);

      await this.updateLastSync(organizationId, provider);

      return result;
    } catch (error) {
      logger.error({ error }, 'Failed to sync machine data');
      throw error;
    }
  }

  /**
   * Sync OEE metrics to ERP
   */
  async syncOEEMetrics(
    organizationId: string,
    provider: ERPProvider,
    metrics: OEEMetrics[],
  ): Promise<SyncResult> {
    try {
      const connector = this.getConnector(organizationId, provider);
      const result = await connector.syncOEEMetrics(metrics);

      await this.updateLastSync(organizationId, provider);

      return result;
    } catch (error) {
      logger.error({ error }, 'Failed to sync OEE metrics');
      throw error;
    }
  }

  /**
   * Sync maintenance events
   */
  async syncMaintenanceEvents(
    organizationId: string,
    provider: ERPProvider,
    direction: 'to_erp' | 'from_erp',
  ): Promise<SyncResult> {
    try {
      const connector = this.getConnector(organizationId, provider);
      const result = await connector.syncMaintenanceEvents(direction);

      await this.updateLastSync(organizationId, provider);

      return result;
    } catch (error) {
      logger.error({ error }, 'Failed to sync maintenance events');
      throw error;
    }
  }

  /**
   * Handle webhook events from ERP systems
   */
  async handleWebhook(provider: ERPProvider, event: any): Promise<void> {
    try {
      logger.info({ provider, eventType: event.type }, 'Received ERP webhook');

      // Validate and persist webhook event, then mark for downstream processing
      const webhookEvent: ERPWebhookEvent = {
        id: this.generateId(),
        provider,
        eventType: event.type,
        entityType: event.entityType,
        entityId: event.entityId,
        timestamp: new Date(),
        payload: event,
        processed: false,
      };

      // Persist webhook event to Supabase
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error: dbError } = await supabase.from('erp_webhook_events').insert({
          id: webhookEvent.id,
          provider: webhookEvent.provider,
          event_type: webhookEvent.eventType,
          entity_type: webhookEvent.entityType,
          entity_id: webhookEvent.entityId,
          timestamp: webhookEvent.timestamp.toISOString(),
          payload: webhookEvent.payload,
          processed: webhookEvent.processed,
        });
        if (dbError) {
          logger.warn({ error: dbError.message }, 'Failed to persist webhook event');
        }
      }

      logger.info({ eventId: webhookEvent.id }, 'Webhook event processed');
    } catch (error) {
      logger.error({ error }, 'Failed to handle webhook');
      throw error;
    }
  }

  /**
   * Get sync history
   */
  async getSyncHistory(
    organizationId: string,
    provider?: ERPProvider,
    limit: number = 50,
  ): Promise<SyncOperation[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    let query = supabase
      .from('erp_sync_operations')
      .select('*')
      .eq('organization_id', organizationId)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (provider) {
      query = query.eq('provider', provider);
    }

    const { data, error } = await query;
    if (error) {
      logger.warn({ error: error.message }, 'Failed to load sync history');
      return [];
    }
    return data ?? [];
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
  private createConnector(provider: ERPProvider, config: ERPConnectionConfig): BaseERPConnector {
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
      // Persist last sync timestamp
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase
          .from('erp_integrations')
          .update({ last_sync_at: settings.lastSyncAt.toISOString() })
          .eq('organization_id', organizationId)
          .eq('provider', provider);
      }
    }
  }

  // ============================================================================
  // Company → ERP Resolution
  // ============================================================================

  /**
   * Resolve a company name to its ERP provider.
   * Returns null provider for unknown companies (manual check required).
   */
  resolveCompanyERP(companyName: string): CompanyLookupResult {
    const result = resolveCompanyERP(companyName);

    if (result.found) {
      logger.info(
        {
          company: companyName,
          provider: result.provider,
          confidence: result.confidence,
        },
        'Company ERP resolved',
      );
    } else {
      logger.warn(
        {
          company: companyName,
        },
        'Company ERP not found — manual check required',
      );
    }

    return result;
  }

  /**
   * Batch-resolve multiple company names to ERP providers.
   */
  resolveCompanyERPBatch(companyNames: string[]): CompanyLookupResult[] {
    const results = resolveCompanyERPBatch(companyNames);

    const found = results.filter((r) => r.found).length;
    const notFound = results.filter((r) => !r.found).length;

    logger.info(
      {
        total: companyNames.length,
        found,
        notFound,
      },
      'Batch company ERP resolution',
    );

    return results;
  }

  /**
   * List all companies registered for a specific ERP provider.
   */
  getCompaniesByProvider(provider: ERPProvider): CompanyERPEntry[] {
    return getCompaniesByProvider(provider);
  }

  /**
   * List all registered companies in the ERP registry.
   */
  getAllRegisteredCompanies(): CompanyERPEntry[] {
    return getAllRegisteredCompanies();
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
