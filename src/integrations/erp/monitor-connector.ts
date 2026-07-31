/**
 * DWS IQ 6 - Monitor ERP Connector
 *
 * Integration with Monitor ERP - the market leader for manufacturing SMEs in the Nordics.
 *
 * Features:
 * - Production order synchronization
 * - Material requirements planning (MRP) integration
 * - Real-time shop floor data → ERP costing
 * - OEE metrics → production schedule updates
 * - Predictive maintenance → work order creation
 *
 * API Documentation: https://www.monitor.se/api-docs
 */

import { BaseERPConnector } from './base-connector.js';
import {
  ERPProvider,
  MonitorERPConfig,
  SyncResult,
  EntityType,
  ProductionOrder,
  MonitorProductionOrder,
  MaterialRequirement,
  MachineData,
  OEEMetrics,
  MaintenanceEvent,
  InventoryTransaction,
  CostTransaction,
} from './types.js';
import { getSupabaseClient } from '../../config/supabase.js';

export class MonitorERPConnector extends BaseERPConnector {
  private accessToken?: string;
  private tokenExpiresAt?: Date;
  private monitorConfig: MonitorERPConfig;

  constructor(config: MonitorERPConfig) {
    super(ERPProvider.MONITOR, config);
    this.monitorConfig = config;
    this.validateConfig(['apiUrl', 'clientId', 'clientSecret', 'companyId']);
  }

  // ============================================================================
  // Authentication
  // ============================================================================

  protected async authenticate(): Promise<void> {
    try {
      this.logger.info('Authenticating with Monitor ERP');

      const response = await this.httpClient.post<{
        access_token: string;
        expires_in: number;
        token_type: string;
      }>('/oauth/token', {
        grant_type: 'client_credentials',
        client_id: this.monitorConfig.clientId,
        client_secret: this.monitorConfig.clientSecret,
        scope: 'production inventory costing',
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = new Date(Date.now() + response.data.expires_in * 1000);

      this.logger.info(
        {
          expiresAt: this.tokenExpiresAt,
        },
        'Successfully authenticated with Monitor ERP',
      );
    } catch (error) {
      this.logger.error({ error }, 'Authentication failed');
      throw new Error('Failed to authenticate with Monitor ERP');
    }
  }

  protected async addAuthHeaders(config: any): Promise<any> {
    // Check if token is expired or about to expire (within 5 minutes)
    if (
      !this.accessToken ||
      !this.tokenExpiresAt ||
      this.tokenExpiresAt.getTime() - Date.now() < 300000
    ) {
      await this.authenticate();
    }

    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${this.accessToken}`;
    config.headers['X-Monitor-Company-Id'] = this.monitorConfig.companyId;

    return config;
  }

  // ============================================================================
  // Connection Testing
  // ============================================================================

  async testConnection(): Promise<boolean> {
    try {
      await this.authenticate();
      const response = await this.get<{ status: string; company: any }>('/api/v1/company/info');
      this.logger.info({ company: response.company }, 'Connection test successful');
      return true;
    } catch (error) {
      this.logger.error({ error }, 'Connection test failed');
      return false;
    }
  }

  // ============================================================================
  // Production Orders
  // ============================================================================

  async syncProductionOrders(since?: Date): Promise<SyncResult> {
    const operation = this.createSyncOperation(
      this.monitorConfig.companyId,
      EntityType.PRODUCTION_ORDER,
      'from_erp',
    );

    try {
      this.logger.info({ since }, 'Syncing production orders from Monitor ERP');

      // Build query parameters
      const params: any = {
        limit: 100,
        status: 'released,in_progress', // Only sync active orders
      };

      if (since) {
        params.modifiedSince = since.toISOString();
      }

      // Fetch production orders from Monitor
      const response = await this.get<{
        data: MonitorProductionOrder[];
        pagination: { total: number; hasMore: boolean };
      }>('/api/v1/production/orders', { params });

      const orders = response.data;
      operation.recordsProcessed = orders.length;

      // Transform and store orders
      const transformedOrders = orders.map((order) => this.transformProductionOrder(order));

      // Persist to Supabase
      const client = getSupabaseClient();
      if (client && transformedOrders.length > 0) {
        const { error } = await client.from('erp_production_orders').upsert(
          transformedOrders.map((o) => ({
            id: o.id,
            erp_provider: ERPProvider.MONITOR,
            organization_id: this.monitorConfig.companyId,
            order_data: o,
            synced_at: new Date().toISOString(),
          })),
          { onConflict: 'id' },
        );

        if (error) {
          this.logger.error({ error: error.message }, 'Failed to persist production orders');
        }
      }

      this.logger.info(`Successfully synced ${orders.length} production orders`);

      return this.createSyncResult(operation, true);
    } catch (error) {
      this.logger.error({ error }, 'Failed to sync production orders');
      operation.recordsFailed = operation.recordsProcessed;
      return this.createSyncResult(operation, false, [
        this.createSyncError(
          EntityType.PRODUCTION_ORDER,
          'SYNC_FAILED',
          (error as Error).message,
          undefined,
          true,
        ),
      ]);
    }
  }

  /**
   * Create or update a production order in Monitor ERP
   */
  async createProductionOrder(order: ProductionOrder): Promise<string> {
    try {
      const monitorOrder = this.transformToMonitorOrder(order);

      const response = await this.post<{ orderId: string }>(
        '/api/v1/production/orders',
        monitorOrder,
      );

      this.logger.info(
        {
          orderId: response.orderId,
        },
        'Created production order in Monitor ERP',
      );

      return response.orderId;
    } catch (error) {
      this.logger.error({ error }, 'Failed to create production order');
      throw error;
    }
  }

  /**
   * Update production order status in Monitor ERP
   */
  async updateProductionOrderStatus(
    orderId: string,
    status: string,
    actualData?: {
      actualStartDate?: Date;
      actualEndDate?: Date;
      actualQuantity?: number;
      actualCost?: number;
    },
  ): Promise<void> {
    try {
      await this.put(`/api/v1/production/orders/${orderId}/status`, {
        status,
        ...actualData,
      });

      this.logger.info({ orderId, status }, 'Updated production order status');
    } catch (error) {
      this.logger.error({ error }, 'Failed to update production order status');
      throw error;
    }
  }

  // ============================================================================
  // Machine Data & OEE Metrics
  // ============================================================================

  async syncMachineData(data: MachineData[]): Promise<SyncResult> {
    const operation = this.createSyncOperation(
      this.monitorConfig.companyId,
      EntityType.MACHINE_DATA,
      'to_erp',
    );

    try {
      this.logger.info(`Syncing ${data.length} machine data records to Monitor ERP`);

      // Batch process machine data
      const { results, errors } = await this.batchProcess(
        data,
        50, // Batch size
        async (batch) => {
          return await this.post<any[]>('/api/v1/production/machine-data/batch', {
            data: batch.map((d) => this.transformMachineData(d)),
          });
        },
      );

      operation.recordsProcessed = results.length;
      operation.recordsFailed = errors.length;

      this.logger.info(
        {
          processed: operation.recordsProcessed,
          failed: operation.recordsFailed,
        },
        'Machine data sync completed',
      );

      return this.createSyncResult(operation, errors.length === 0);
    } catch (error) {
      this.logger.error({ error }, 'Failed to sync machine data');
      return this.createSyncResult(operation, false, [
        this.createSyncError(EntityType.MACHINE_DATA, 'SYNC_FAILED', (error as Error).message),
      ]);
    }
  }

  async syncOEEMetrics(metrics: OEEMetrics[]): Promise<SyncResult> {
    const operation = this.createSyncOperation(
      this.monitorConfig.companyId,
      EntityType.OEE_METRICS,
      'to_erp',
    );

    try {
      this.logger.info(`Syncing ${metrics.length} OEE metrics to Monitor ERP`);

      // Send OEE metrics to Monitor for production analysis
      await this.post('/api/v1/production/oee/batch', {
        metrics: metrics.map((m) => ({
          machine_id: m.machineId,
          period_start: m.periodStart.toISOString(),
          period_end: m.periodEnd.toISOString(),
          availability: m.availability,
          performance: m.performance,
          quality: m.quality,
          oee: m.oee,
          total_pieces: m.totalPieces,
          good_pieces: m.goodPieces,
          rejected_pieces: m.rejectedPieces,
          downtime_minutes: m.downtime,
        })),
      });

      operation.recordsProcessed = metrics.length;

      this.logger.info(
        {
          processed: operation.recordsProcessed,
        },
        'OEE metrics sync completed',
      );

      return this.createSyncResult(operation, true);
    } catch (error) {
      this.logger.error({ error }, 'Failed to sync OEE metrics');
      return this.createSyncResult(operation, false, [
        this.createSyncError(EntityType.OEE_METRICS, 'SYNC_FAILED', (error as Error).message),
      ]);
    }
  }

  // ============================================================================
  // Maintenance Events
  // ============================================================================

  async syncMaintenanceEvents(direction: 'to_erp' | 'from_erp'): Promise<SyncResult> {
    const operation = this.createSyncOperation(
      this.monitorConfig.companyId,
      EntityType.MAINTENANCE_EVENT,
      direction,
    );

    try {
      if (direction === 'to_erp') {
        // Push predictive maintenance events to Monitor as work orders
        return await this.pushMaintenanceToERP(operation);
      } else {
        // Pull scheduled maintenance from Monitor
        return await this.pullMaintenanceFromERP(operation);
      }
    } catch (error) {
      this.logger.error({ error }, 'Failed to sync maintenance events');
      return this.createSyncResult(operation, false, [
        this.createSyncError(EntityType.MAINTENANCE_EVENT, 'SYNC_FAILED', (error as Error).message),
      ]);
    }
  }

  private async pushMaintenanceToERP(operation: any): Promise<SyncResult> {
    // Fetch pending maintenance events from DWS database
    let events: MaintenanceEvent[] = [];
    const client = getSupabaseClient();
    if (client) {
      const { data, error } = await client
        .from('maintenance_events')
        .select('*')
        .eq('organization_id', this.monitorConfig.companyId)
        .eq('sync_status', 'pending')
        .limit(50);

      if (!error && data) {
        events = data as MaintenanceEvent[];
      } else if (error) {
        this.logger.error({ error: error.message }, 'Failed to fetch maintenance events');
      }
    }

    for (const event of events) {
      try {
        await this.post('/api/v1/maintenance/work-orders', {
          asset_id: event.assetId,
          asset_name: event.assetName,
          type: event.eventType,
          severity: event.severity,
          description: event.description,
          scheduled_date: event.scheduledMaintenanceDate?.toISOString(),
          estimated_cost: event.estimatedCost,
        });

        operation.recordsProcessed++;
      } catch (error) {
        operation.recordsFailed++;
        this.logger.error({ event, error }, 'Failed to create work order');
      }
    }

    return this.createSyncResult(operation, operation.recordsFailed === 0);
  }

  private async pullMaintenanceFromERP(operation: any): Promise<SyncResult> {
    const response = await this.get<{ data: any[] }>('/api/v1/maintenance/work-orders', {
      params: { status: 'scheduled,in_progress' },
    });

    operation.recordsProcessed = response.data.length;

    // Store maintenance work orders in DWS database
    const client = getSupabaseClient();
    if (client && response.data.length > 0) {
      const { error } = await client.from('erp_maintenance_orders').upsert(
        response.data.map((wo: any) => ({
          external_id: wo.id || wo.work_order_id,
          provider: 'monitor',
          status: wo.status,
          data: wo,
          synced_at: new Date().toISOString(),
        })),
        { onConflict: 'external_id,provider' },
      );
      if (error) {
        this.logger.warn({ error: error.message }, 'Failed to store maintenance orders');
        operation.recordsFailed = response.data.length;
      }
    }

    return this.createSyncResult(operation, operation.recordsFailed === 0);
  }

  // ============================================================================
  // Material Requirements & Inventory
  // ============================================================================

  /**
   * Sync material requirements for production orders
   */
  async syncMaterialRequirements(productionOrderId: string): Promise<MaterialRequirement[]> {
    try {
      const response = await this.get<{ data: any[] }>(
        `/api/v1/production/orders/${productionOrderId}/materials`,
      );

      return response.data.map((item) => ({
        id: item.id,
        productionOrderId,
        materialId: item.material_id,
        materialName: item.material_name,
        requiredQuantity: item.required_quantity,
        unit: item.unit,
        availableQuantity: item.available_quantity,
        allocatedQuantity: item.allocated_quantity,
        requiredDate: new Date(item.required_date),
        status: item.status,
        warehouseLocation: item.warehouse_location,
      }));
    } catch (error) {
      this.logger.error({ error }, 'Failed to sync material requirements');
      throw error;
    }
  }

  /**
   * Post inventory transaction to Monitor ERP
   */
  async postInventoryTransaction(transaction: InventoryTransaction): Promise<void> {
    try {
      await this.post('/api/v1/inventory/transactions', {
        transaction_type: transaction.transactionType,
        material_id: transaction.materialId,
        quantity: transaction.quantity,
        unit: transaction.unit,
        from_location: transaction.fromLocation,
        to_location: transaction.toLocation,
        related_order_id: transaction.relatedOrderId,
        timestamp: transaction.timestamp.toISOString(),
      });

      this.logger.info({ transaction }, 'Posted inventory transaction');
    } catch (error) {
      this.logger.error({ error }, 'Failed to post inventory transaction');
      throw error;
    }
  }

  // ============================================================================
  // Cost Transactions
  // ============================================================================

  /**
   * Sync actual costs from shop floor to Monitor ERP
   */
  async syncCostTransactions(costs: CostTransaction[]): Promise<SyncResult> {
    const operation = this.createSyncOperation(
      this.monitorConfig.companyId,
      EntityType.COST_TRANSACTION,
      'to_erp',
    );

    try {
      this.logger.info(`Syncing ${costs.length} cost transactions to Monitor ERP`);

      for (const cost of costs) {
        try {
          await this.post('/api/v1/costing/transactions', {
            cost_center: cost.costCenter,
            cost_type: cost.costType,
            amount: cost.amount,
            currency: cost.currency,
            related_order_id: cost.relatedOrderId,
            related_asset_id: cost.relatedAssetId,
            timestamp: cost.timestamp.toISOString(),
            description: cost.description,
            actual_vs_planned: cost.actualVsPlanned,
          });

          operation.recordsProcessed++;
        } catch (error) {
          operation.recordsFailed++;
          this.logger.error({ cost, error }, 'Failed to post cost transaction');
        }
      }

      return this.createSyncResult(operation, operation.recordsFailed === 0);
    } catch (error) {
      this.logger.error({ error }, 'Failed to sync cost transactions');
      return this.createSyncResult(operation, false, [
        this.createSyncError(EntityType.COST_TRANSACTION, 'SYNC_FAILED', (error as Error).message),
      ]);
    }
  }

  // ============================================================================
  // Data Transformation Methods
  // ============================================================================

  private transformProductionOrder(monitorOrder: any): ProductionOrder {
    return {
      id: monitorOrder.id,
      orderNumber: monitorOrder.order_number,
      productId: monitorOrder.article_number,
      productName: monitorOrder.article_name,
      quantity: monitorOrder.quantity,
      unit: monitorOrder.unit,
      scheduledStartDate: new Date(monitorOrder.scheduled_start),
      scheduledEndDate: new Date(monitorOrder.scheduled_end),
      actualStartDate: monitorOrder.actual_start ? new Date(monitorOrder.actual_start) : undefined,
      actualEndDate: monitorOrder.actual_end ? new Date(monitorOrder.actual_end) : undefined,
      status: this.mapMonitorStatus(monitorOrder.status),
      priority: monitorOrder.priority || 0,
      workCenterId: monitorOrder.work_center_id,
      costEstimate: monitorOrder.estimated_cost,
      actualCost: monitorOrder.actual_cost,
      metadata: {
        monitorOrderId: monitorOrder.id,
        customerOrderNumber: monitorOrder.customer_order_number,
      },
    };
  }

  private transformToMonitorOrder(order: ProductionOrder): any {
    return {
      article_number: order.productId,
      quantity: order.quantity,
      unit: order.unit,
      scheduled_start: order.scheduledStartDate.toISOString(),
      scheduled_end: order.scheduledEndDate.toISOString(),
      work_center_id: order.workCenterId,
      priority: order.priority,
    };
  }

  private transformMachineData(data: MachineData): any {
    return {
      machine_id: data.machineId,
      timestamp: data.timestamp.toISOString(),
      status: data.status,
      production_count: data.productionCount,
      reject_count: data.rejectCount,
      cycle_time: data.cycleTime,
      energy_consumption: data.energyConsumption,
      metadata: data.metadata,
    };
  }

  private mapMonitorStatus(
    status: string,
  ): 'planned' | 'released' | 'in_progress' | 'completed' | 'cancelled' {
    const statusMap: Record<string, any> = {
      planned: 'planned',
      released: 'released',
      started: 'in_progress',
      in_progress: 'in_progress',
      completed: 'completed',
      finished: 'completed',
      cancelled: 'cancelled',
      closed: 'completed',
    };

    return statusMap[status.toLowerCase()] || 'planned';
  }
}
