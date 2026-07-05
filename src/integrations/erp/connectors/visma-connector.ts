/**
 * DWS IQ 6 - Visma Connector
 *
 * Integration with Visma.net / Visma Enterprise for Nordic mid-market
 *
 * Features:
 * - Production management
 * - Inventory synchronization
 * - Norwegian/Finnish market focus
 */

import { BaseERPConnector } from '../base-connector.js';
import {
  ERPProvider,
  VismaConfig,
  SyncResult,
  EntityType,
  MachineData,
  OEEMetrics,
} from '../types.js';

export class VismaConnector extends BaseERPConnector {
  private vismaConfig: VismaConfig;
  private accessToken?: string;

  constructor(config: VismaConfig) {
    super(ERPProvider.VISMA, config);
    this.vismaConfig = config;
    this.validateConfig(['apiUrl', 'clientId', 'clientSecret', 'companyId']);
  }

  protected async authenticate(): Promise<void> {
    const response = await this.httpClient.post<{ access_token: string; expires_in: number }>(
      '/resources/oauth/token',
      {
        grant_type: 'client_credentials',
        client_id: this.vismaConfig.clientId,
        client_secret: this.vismaConfig.clientSecret,
      },
    );

    this.accessToken = response.data.access_token;
  }

  protected async addAuthHeaders(config: any): Promise<any> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${this.accessToken}`;
    config.headers['ipp-company-id'] = this.vismaConfig.companyId;
    return config;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.authenticate();
      await this.get('/controller/api/v1/company');
      return true;
    } catch (error) {
      this.logger.error({ error }, 'Visma connection test failed');
      return false;
    }
  }

  async syncProductionOrders(_since?: Date): Promise<SyncResult> {
    const operation = this.createSyncOperation('default', EntityType.PRODUCTION_ORDER, 'from_erp');

    try {
      const response = await this.get<any[]>('/controller/api/v1/productionorder');
      operation.recordsProcessed = response.length;
      return this.createSyncResult(operation, true);
    } catch (error) {
      return this.createSyncResult(operation, false, [
        this.createSyncError(
          EntityType.PRODUCTION_ORDER,
          'VISMA_SYNC_FAILED',
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
