/**
 * DWS IQ 6 - ERP Integration Types
 *
 * Type definitions for Nordic ERP integrations:
 * - Monitor ERP (Nordic SME market leader)
 * - IFS Cloud (Asset-intensive manufacturing)
 * - Microsoft Dynamics 365 (Business Central & F&O)
 * - SAP S/4HANA (Enterprise)
 * - Visma (Net/Enterprise)
 * - Jeeves ERP (Swedish market)
 */

// ============================================================================
// Common Types
// ============================================================================

export enum ERPProvider {
  MONITOR = 'monitor',
  IFS = 'ifs',
  DYNAMICS_365 = 'dynamics365',
  SAP = 'sap',
  VISMA = 'visma',
  JEEVES = 'jeeves',
}

export enum SyncDirection {
  TO_ERP = 'to_erp',
  FROM_ERP = 'from_erp',
  BIDIRECTIONAL = 'bidirectional',
}

export enum SyncStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PARTIALLY_SYNCED = 'partially_synced',
}

export enum EntityType {
  PRODUCTION_ORDER = 'production_order',
  WORK_ORDER = 'work_order',
  MATERIAL_REQUIREMENT = 'material_requirement',
  INVENTORY_TRANSACTION = 'inventory_transaction',
  MACHINE_DATA = 'machine_data',
  OEE_METRICS = 'oee_metrics',
  MAINTENANCE_EVENT = 'maintenance_event',
  QUALITY_INSPECTION = 'quality_inspection',
  COST_TRANSACTION = 'cost_transaction',
  EMPLOYEE_TIME = 'employee_time',
  ASSET = 'asset',
  ESG_METRIC = 'esg_metric',
}

// ============================================================================
// Base Integration Configuration
// ============================================================================

export interface ERPConnectionConfig {
  provider: ERPProvider;
  enabled: boolean;
  apiUrl: string;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  tenantId?: string;
  username?: string;
  password?: string;
  additionalConfig?: Record<string, unknown>;
}

export interface ERPIntegrationSettings {
  organizationId: string;
  provider: ERPProvider;
  config: ERPConnectionConfig;
  syncSettings: SyncSettings;
  fieldMappings: FieldMapping[];
  webhookUrl?: string;
  lastSyncAt?: Date;
  status: 'active' | 'inactive' | 'error';
  errorMessage?: string;
}

export interface SyncSettings {
  enabled: boolean;
  direction: SyncDirection;
  entities: EntityType[];
  scheduleCron?: string; // e.g., "0 */6 * * *" for every 6 hours
  batchSize: number;
  retryAttempts: number;
  retryDelayMs: number;
}

export interface FieldMapping {
  dwsField: string;
  erpField: string;
  entityType: EntityType;
  transformFunction?: string; // Name of transformation function
  required: boolean;
}

// ============================================================================
// Sync Operation Types
// ============================================================================

export interface SyncOperation {
  id: string;
  organizationId: string;
  provider: ERPProvider;
  direction: SyncDirection;
  entityType: EntityType;
  status: SyncStatus;
  startedAt: Date;
  completedAt?: Date;
  recordsProcessed: number;
  recordsFailed: number;
  errorMessages?: string[];
  metadata?: Record<string, unknown>;
}

export interface SyncResult {
  success: boolean;
  operation: SyncOperation;
  processedRecords: number;
  failedRecords: number;
  errors: SyncError[];
  warnings: string[];
}

export interface SyncError {
  recordId?: string;
  entityType: EntityType;
  /**
   * Machine-readable error identifier (e.g. 'SAP_SYNC_FAILED').
   * Both `errorCode` (legacy) and `code` (standardized) are emitted so
   * downstream callers and assertions can migrate at their own pace.
   */
  errorCode: string;
  code: string;
  errorMessage: string;
  timestamp: Date;
  retryable: boolean;
}

// ============================================================================
// Data Models - Production & Manufacturing
// ============================================================================

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  scheduledStartDate: Date;
  scheduledEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  status: 'planned' | 'released' | 'in_progress' | 'completed' | 'cancelled';
  priority: number;
  workCenterId?: string;
  materialRequirements?: MaterialRequirement[];
  costEstimate?: number;
  actualCost?: number;
  metadata?: Record<string, unknown>;
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  productionOrderId?: string;
  assetId?: string;
  assetName?: string;
  workType: 'production' | 'maintenance' | 'quality_control' | 'setup';
  description: string;
  assignedTo?: string;
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours?: number;
  actualHours?: number;
  scheduledDate?: Date;
  completedDate?: Date;
  metadata?: Record<string, unknown>;
}

export interface MaterialRequirement {
  id: string;
  productionOrderId?: string;
  materialId: string;
  materialName: string;
  requiredQuantity: number;
  unit: string;
  availableQuantity?: number;
  allocatedQuantity?: number;
  requiredDate: Date;
  status: 'pending' | 'allocated' | 'issued' | 'completed';
  warehouseLocation?: string;
}

// ============================================================================
// Machine Data & OEE
// ============================================================================

export interface MachineData {
  id: string;
  machineId: string;
  machineName: string;
  timestamp: Date;
  status: 'running' | 'idle' | 'down' | 'maintenance';
  productionCount?: number;
  rejectCount?: number;
  cycleTime?: number;
  temperature?: number;
  pressure?: number;
  energyConsumption?: number; // kWh
  vibration?: number;
  metadata?: Record<string, unknown>;
}

export interface OEEMetrics {
  id: string;
  machineId: string;
  machineName: string;
  periodStart: Date;
  periodEnd: Date;
  availability: number; // 0-100%
  performance: number; // 0-100%
  quality: number; // 0-100%
  oee: number; // 0-100%
  plannedProductionTime: number; // minutes
  actualProductionTime: number; // minutes
  downtime: number; // minutes
  idealCycleTime: number; // seconds
  totalPieces: number;
  goodPieces: number;
  rejectedPieces: number;
}

// ============================================================================
// Maintenance & Asset Management
// ============================================================================

export interface MaintenanceEvent {
  id: string;
  assetId: string;
  assetName: string;
  eventType: 'preventive' | 'predictive' | 'corrective' | 'breakdown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: Date;
  reportedAt?: Date;
  scheduledMaintenanceDate?: Date;
  actualMaintenanceDate?: Date;
  resolvedAt?: Date;
  downtime?: number; // minutes
  estimatedCost?: number;
  actualCost?: number;
  assignedTechnician?: string;
  status: 'detected' | 'scheduled' | 'in_progress' | 'resolved' | 'deferred';
  rootCause?: string;
  corrective_action?: string;
  metadata?: Record<string, unknown>;
}

export interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  type: string;
  category: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installationDate?: Date;
  warrantyExpiration?: Date;
  location: string;
  department?: string;
  status: 'operational' | 'maintenance' | 'down' | 'retired';
  purchaseCost?: number;
  currentValue?: number;
  lastMaintenanceDate?: Date;
  nextScheduledMaintenance?: Date;
  maintenanceScheduleCron?: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Inventory & Cost Management
// ============================================================================

export interface InventoryTransaction {
  id: string;
  transactionNumber: string;
  transactionType: 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'consumption';
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  fromLocation?: string;
  toLocation?: string;
  relatedOrderId?: string;
  relatedOrderType?: 'production' | 'purchase' | 'sales';
  timestamp: Date;
  performedBy?: string;
  cost?: number;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface CostTransaction {
  id: string;
  transactionNumber: string;
  costCenter: string;
  costType: 'material' | 'labor' | 'overhead' | 'energy' | 'maintenance';
  amount: number;
  currency: string;
  relatedOrderId?: string;
  relatedAssetId?: string;
  timestamp: Date;
  description?: string;
  actualVsPlanned?: {
    planned: number;
    actual: number;
    variance: number;
    variancePercentage: number;
  };
  metadata?: Record<string, unknown>;
}

// ============================================================================
// ESG & Sustainability
// ============================================================================

export interface ESGMetric {
  id: string;
  metricType: 'energy' | 'emissions' | 'water' | 'waste' | 'safety' | 'social';
  category: string;
  value: number;
  unit: string;
  periodStart: Date;
  periodEnd: Date;
  facilityId?: string;
  facilityName?: string;
  assetId?: string;
  assetName?: string;
  scope?: 'scope1' | 'scope2' | 'scope3'; // For emissions
  verificationStatus?: 'unverified' | 'pending' | 'verified';
  verifiedBy?: string;
  verifiedAt?: Date;
  complianceStandard?: string; // e.g., "GHG Protocol", "ISO 14064"
  targetValue?: number;
  targetDate?: Date;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Webhook Events
// ============================================================================

export interface ERPWebhookEvent {
  id: string;
  provider: ERPProvider;
  eventType: string;
  entityType: EntityType;
  entityId: string;
  timestamp: Date;
  payload: unknown;
  processed: boolean;
  processedAt?: Date;
  error?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ERPApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata?: {
    timestamp: Date;
    requestId?: string;
    rateLimit?: {
      limit: number;
      remaining: number;
      resetAt: Date;
    };
  };
}

// ============================================================================
// Monitor ERP Specific Types
// ============================================================================

export interface MonitorERPConfig extends ERPConnectionConfig {
  provider: ERPProvider.MONITOR;
  companyId: string;
  apiVersion?: string; // e.g., "v1", "v2"
}

export interface MonitorProductionOrder extends ProductionOrder {
  monitorOrderId: string;
  articleNumber: string;
  customerOrderNumber?: string;
}

// ============================================================================
// IFS Cloud Specific Types
// ============================================================================

export interface IFSCloudConfig extends ERPConnectionConfig {
  provider: ERPProvider.IFS;
  instanceUrl: string;
  oauthTokenUrl: string;
}

export interface IFSAsset extends Asset {
  ifsObjectId: string;
  functionalObjectId?: string;
  maintenanceOrganization?: string;
  operationalStatus?: string;
}

// ============================================================================
// Dynamics 365 Specific Types
// ============================================================================

export interface Dynamics365Config extends ERPConnectionConfig {
  provider: ERPProvider.DYNAMICS_365;
  environment: string; // e.g., "org123.crm4.dynamics.com"
  version: 'business_central' | 'finance_operations';
  authEndpoint?: string;
}

// ============================================================================
// SAP S/4HANA Specific Types
// ============================================================================

export interface SAPConfig extends ERPConnectionConfig {
  provider: ERPProvider.SAP;
  systemId: string;
  client: string;
  language?: string;
  odataVersion?: 'v2' | 'v4';
}

// ============================================================================
// Visma Specific Types
// ============================================================================

export interface VismaConfig extends ERPConnectionConfig {
  provider: ERPProvider.VISMA;
  product: 'net' | 'enterprise';
  companyId: string;
}

// ============================================================================
// Jeeves Specific Types
// ============================================================================

export interface JeevesConfig extends ERPConnectionConfig {
  provider: ERPProvider.JEEVES;
  databaseName: string;
  customApiEndpoint?: string;
}
