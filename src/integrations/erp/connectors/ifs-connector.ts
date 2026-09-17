/**
 * DWS IQ 6 - IFS Cloud Connector
 *
 * Integration with IFS Cloud - leading ERP for asset-intensive and project-based manufacturing.
 *
 * Key Features:
 * - Asset lifecycle management
 * - Maintenance planning & execution
 * - Project costing & tracking
 * - Fleet management integration
 *
 * API Documentation: https://docs.ifs.com/techdocs/
 */

import { BaseERPConnector } from '../base-connector.js';
import type { InternalAxiosRequestConfig } from 'axios';
import {
  EntityType,
  ERPProvider,
  type IFSAsset,
  type IFSCloudConfig,
  type MachineData,
  type OEEMetrics,
  type SyncResult,
} from '../types.js';

export class IFSCloudConnector extends BaseERPConnector {
  private accessToken?: string;
  private tokenExpiresAt?: Date;
  private ifsConfig: IFSCloudConfig;

  constructor(config: IFSCloudConfig) {
    super(ERPProvider.IFS, config);
    this.ifsConfig = config;
    this.validateConfig(['instanceUrl', 'clientId', 'clientSecret', 'oauthTokenUrl']);
  }

  protected async authenticate(): Promise<void> {
    try {
      this.logger.info('Authenticating with IFS Cloud');

      const response = await this.httpClient.post<{
        access_token: string;
        expires_in: number;
      }>(this.ifsConfig.oauthTokenUrl, {
        grant_type: 'client_credentials',
        client_id: this.ifsConfig.clientId,
        client_secret: this.ifsConfig.clientSecret,
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = new Date(Date.now() + response.data.expires_in * 1000);

      this.logger.info('Successfully authenticated with IFS Cloud');
    } catch (error) {
      this.logger.error({ error }, 'IFS Cloud authentication failed');
      throw error;
    }
  }

  protected async addAuthHeaders(
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> {
    if (
      !this.accessToken ||
      !this.tokenExpiresAt ||
      this.tokenExpiresAt.getTime() - Date.now() < 300000
    ) {
      await this.authenticate();
    }

    config.headers['Authorization'] = `Bearer ${this.accessToken}`;
    return config;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.authenticate();
      await this.get('/main/ifsapplications/projection/v1/SystemInfo.svc/SystemInfoSet');
      return true;
    } catch (error) {
      this.logger.error({ error }, 'IFS Cloud connection test failed');
      return false;
    }
  }

  async syncProductionOrders(since?: Date): Promise<SyncResult> {
    const operation = this.createSyncOperation('default', EntityType.PRODUCTION_ORDER, 'from_erp');

    try {
      // IFS uses ShopOrderHandling projection
      // SECURITY FIX: Use params object instead of string interpolation to prevent OData injection
      const params: Record<string, string> = {
        $expand: 'ShopOrderOperations',
      };
      if (since) {
        params.$filter = `DateModified gt datetime'${since.toISOString()}'`;
      }
      const response = await this.get<{ value: unknown[] }>(
        '/main/ifsapplications/projection/v1/ShopOrderHandling.svc/ShopOrders',
        { params },
      );

      operation.recordsProcessed = response.value.length;
      this.logger.info(`Synced ${response.value.length} production orders from IFS`);

      return this.createSyncResult(operation, true);
    } catch (error) {
      this.logger.error({ error }, 'Failed to sync IFS production orders');
      return this.createSyncResult(operation, false, [
        this.createSyncError(
          EntityType.PRODUCTION_ORDER,
          'IFS_SYNC_FAILED',
          (error as Error).message,
        ),
      ]);
    }
  }

  async syncMachineData(data: MachineData[]): Promise<SyncResult> {
    const operation = this.createSyncOperation('default', EntityType.MACHINE_DATA, 'to_erp');

    try {
      // IFS stores machine data in MaintenanceObject with custom attributes
      for (const machineData of data) {
        await this.post(
          '/main/ifsapplications/projection/v1/MaintenanceObject.svc/ObjectMeasurements',
          {
            ObjectId: machineData.machineId,
            MeasurementType: 'RUNTIME_DATA',
            Value: JSON.stringify(machineData),
            DateRecorded: machineData.timestamp.toISOString(),
          },
        );
      }

      operation.recordsProcessed = data.length;
      return this.createSyncResult(operation, true);
    } catch (error) {
      this.logger.error({ error }, 'Failed to sync machine data to IFS');
      return this.createSyncResult(operation, false);
    }
  }

  async syncOEEMetrics(metrics: OEEMetrics[]): Promise<SyncResult> {
    const operation = this.createSyncOperation('default', EntityType.OEE_METRICS, 'to_erp');

    try {
      // IFS can store OEE as equipment effectiveness measurements
      for (const metric of metrics) {
        await this.post(
          '/main/ifsapplications/projection/v1/EquipmentEffectiveness.svc/Measurements',
          {
            EquipmentObjectId: metric.machineId,
            MeasurementPeriodStart: metric.periodStart.toISOString(),
            MeasurementPeriodEnd: metric.periodEnd.toISOString(),
            Availability: metric.availability,
            Performance: metric.performance,
            Quality: metric.quality,
            OEE: metric.oee,
          },
        );
      }

      operation.recordsProcessed = metrics.length;
      return this.createSyncResult(operation, true);
    } catch (error) {
      this.logger.error({ error }, 'Failed to sync OEE metrics to IFS');
      return this.createSyncResult(operation, false);
    }
  }

  async syncMaintenanceEvents(direction: 'to_erp' | 'from_erp'): Promise<SyncResult> {
    const operation = this.createSyncOperation('default', EntityType.MAINTENANCE_EVENT, direction);

    try {
      if (direction === 'to_erp') {
        // Create work orders in IFS for predictive maintenance
        // Implementation stub
        return this.createSyncResult(operation, true);
      } else {
        // Pull scheduled maintenance from IFS
        const response = await this.get<{ value: unknown[] }>(
          "/main/ifsapplications/projection/v1/ActiveWorkOrder.svc/WorkOrders?$filter=State eq 'WORKSTARTED' or State eq 'RELEASED'",
        );

        operation.recordsProcessed = response.value.length;
        return this.createSyncResult(operation, true);
      }
    } catch (error) {
      this.logger.error({ error }, 'Failed to sync maintenance events with IFS');
      return this.createSyncResult(operation, false);
    }
  }

  /**
   * Sync asset registry from IFS (critical for fleet management)
   */
  async syncAssets(): Promise<IFSAsset[]> {
    try {
      interface IFSObjectRaw {
        ObjectId: string;
        ObjectDescription: string;
        ObjectType: string;
        ObjectCategory: string;
        Manufacturer?: string;
        ModelDesignation?: string;
        SerialNo?: string;
        LocationId: string;
        OperationalStatus?: string;
        FunctionalObjectId?: string;
        MaintenanceOrganization?: string;
        Criticality?: string;
      }
      const response = await this.get<{ value: IFSObjectRaw[] }>(
        '/main/ifsapplications/projection/v1/EquipmentObject.svc/EquipmentObjects',
      );

      return response.value.map((obj) => ({
        id: obj.ObjectId,
        ifsObjectId: obj.ObjectId,
        assetNumber: obj.ObjectId,
        name: obj.ObjectDescription,
        type: obj.ObjectType,
        category: obj.ObjectCategory,
        manufacturer: obj.Manufacturer,
        model: obj.ModelDesignation,
        serialNumber: obj.SerialNo,
        location: obj.LocationId,
        status: this.mapIFSObjectStatus(obj.OperationalStatus ?? ''),
        functionalObjectId: obj.FunctionalObjectId,
        maintenanceOrganization: obj.MaintenanceOrganization,
        operationalStatus: obj.OperationalStatus,
        criticality: this.mapCriticality(obj.Criticality ?? 'C'),
      }));
    } catch (error) {
      this.logger.error({ error }, 'Failed to sync assets from IFS');
      throw error;
    }
  }

  private mapIFSObjectStatus(status: string): 'operational' | 'maintenance' | 'down' | 'retired' {
    const statusMap: Record<string, IFSAsset['status']> = {
      INOPERATION: 'operational',
      UNDERMAINTENANCE: 'maintenance',
      OUTOFOPERATION: 'down',
      SCRAPPED: 'retired',
    };
    return statusMap[status] || 'operational';
  }

  private mapCriticality(criticality: string): 'low' | 'medium' | 'high' | 'critical' {
    const criticalityMap: Record<string, IFSAsset['criticality']> = {
      A: 'critical',
      B: 'high',
      C: 'medium',
      D: 'low',
    };
    return criticalityMap[criticality] || 'medium';
  }
}
