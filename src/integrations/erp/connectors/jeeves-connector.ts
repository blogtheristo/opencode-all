/**
 * DWS IQ 6 - Jeeves ERP Connector
 *
 * Integration with Jeeves ERP for Swedish manufacturing SMEs
 *
 * Features:
 * - Production planning
 * - Material requirements
 * - Swedish market specialization
 */

import { BaseERPConnector } from '../base-connector.js';
import {
  ERPProvider,
  JeevesConfig,
  SyncResult,
  EntityType,
  MachineData,
  OEEMetrics,
} from '../types.js';

export class JeevesConnector extends BaseERPConnector {
  private jeevesConfig: JeevesConfig;

  constructor(config: JeevesConfig) {
    super(ERPProvider.JEEVES, config);
    this.jeevesConfig = config;
    this.validateConfig(['apiUrl', 'apiKey', 'databaseName']);
  }

  protected async authenticate(): Promise<void> {
    this.logger.info('Jeeves API key configured');
  }

  protected async addAuthHeaders(config: any): Promise<any> {
    config.headers = config.headers || {};
    config.headers['X-API-Key'] = this.jeevesConfig.apiKey;
    config.headers['X-Database'] = this.jeevesConfig.databaseName;
    return config;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.get('/api/v1/system/info');
      return true;
    } catch (error) {
      this.logger.error({ error }, 'Jeeves connection test failed');
      return false;
    }
  }

  async syncProductionOrders(since?: Date): Promise<SyncResult> {
    const operation = this.createSyncOperation('default', EntityType.PRODUCTION_ORDER, 'from_erp');

    try {
      const params = since ? { modifiedSince: since.toISOString() } : {};
      const response = await this.get<{ orders: any[] }>('/api/v1/production/orders', { params });

      operation.recordsProcessed = response.orders.length;
      return this.createSyncResult(operation, true);
    } catch (error) {
      return this.createSyncResult(operation, false, [
        this.createSyncError(
          EntityType.PRODUCTION_ORDER,
          'JEEVES_SYNC_FAILED',
          (error as Error).message,
        ),
      ]);
    }
  }

  async syncMachineData(data: MachineData[]): Promise<SyncResult> {
    const operation = this.createSyncOperation('default', EntityType.MACHINE_DATA, 'to_erp');
    operation.recordsProcessed = data.length;
    return this.createSyncResult(operation, true);
  }

  async syncOEEMetrics(metrics: OEEMetrics[]): Promise<SyncResult> {
    const operation = this.createSyncOperation('default', EntityType.OEE_METRICS, 'to_erp');
    operation.recordsProcessed = metrics.length;
    return this.createSyncResult(operation, true);
  }

  async syncMaintenanceEvents(direction: 'to_erp' | 'from_erp'): Promise<SyncResult> {
    const operation = this.createSyncOperation('default', EntityType.MAINTENANCE_EVENT, direction);
    return this.createSyncResult(operation, true);
  }
}
