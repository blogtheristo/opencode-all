/**
 * DWS IQ 6 - Trade & Import Integration Types
 *
 * Type definitions for international trade product management,
 * with focus on EU compliance (CBAM, GSP+, EU Deforestation Regulation).
 *
 * Initial scope: Philippine climate & food product imports to EU.
 */

// ============================================================================
// Enums
// ============================================================================

export enum TradeProductCategory {
  FOOD = 'food',
  CLIMATE_MATERIAL = 'climate_material',
  SUSTAINABLE_FIBER = 'sustainable_fiber',
  CIRCULAR_ECONOMY = 'circular_economy',
}

export enum TradeProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DISCONTINUED = 'discontinued',
}

export enum ImportComplianceStatus {
  NOT_ASSESSED = 'not_assessed',
  COMPLIANT = 'compliant',
  PENDING_REVIEW = 'pending_review',
  NON_COMPLIANT = 'non_compliant',
}

export enum TariffScheme {
  GSP_PLUS = 'gsp_plus',
  MFN = 'mfn',
  FTA = 'fta',
  ZERO = 'zero',
}

export enum CBAMStatus {
  NOT_APPLICABLE = 'not_applicable',
  MONITORING = 'monitoring',
  REPORTING_REQUIRED = 'reporting_required',
  DECLARATION_FILED = 'declaration_filed',
}

export enum CarbonImpactRating {
  CARBON_NEGATIVE = 'carbon_negative',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum OriginCountry {
  PH = 'PH',
  ID = 'ID',
  TH = 'TH',
  VN = 'VN',
  MY = 'MY',
  IN = 'IN',
  LK = 'LK',
}

// ============================================================================
// Core Product Model
// ============================================================================

export interface TradeProduct {
  id: string;
  productCode: string;
  name: string;
  description: string;
  category: TradeProductCategory;
  status: TradeProductStatus;

  // Origin
  originCountry: OriginCountry;
  originRegion?: string;
  supplierName?: string;
  supplierCertifications?: string[];

  // Trade classification
  hsCode: string;
  cnCode?: string;
  taricCode?: string;

  // Tariff & pricing
  tariffScheme: TariffScheme;
  tariffRate: number;
  mfnTariffRate: number;
  unitPrice?: number;
  currency: string;
  unit: string;

  // Carbon & climate
  carbonFootprintKgCO2ePerUnit: number;
  carbonImpactRating: CarbonImpactRating;
  cbamStatus: CBAMStatus;
  lifecycleStages?: LifecycleCarbon;
  climateNotes?: string;

  // EU compliance
  euCompliance: EUComplianceInfo;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Carbon & Lifecycle
// ============================================================================

/** EN 15978 lifecycle stage carbon breakdown */
export interface LifecycleCarbon {
  a1_a3_production: number;
  a4_transport: number;
  a5_installation?: number;
  b_use?: number;
  c_endOfLife: number;
  d_beyondBoundary?: number;
  unit: string;
}

// ============================================================================
// EU Compliance
// ============================================================================

export interface EUComplianceInfo {
  importComplianceStatus: ImportComplianceStatus;
  gspPlusEligible: boolean;
  euDeforestationRegulation: boolean;
  euOrganicCertified: boolean;
  euOrganicCertBody?: string;
  reachCompliant?: boolean;
  sanitaryPhytosanitaryCert?: boolean;
  certificateOfOrigin?: boolean;
  requiredDocuments: string[];
  notes?: string;
}

// ============================================================================
// Import Shipment Tracking
// ============================================================================

export enum ShipmentStatus {
  PLANNED = 'planned',
  IN_TRANSIT = 'in_transit',
  AT_CUSTOMS = 'at_customs',
  CLEARED = 'cleared',
  DELIVERED = 'delivered',
  REJECTED = 'rejected',
}

export interface ImportShipment {
  id: string;
  shipmentNumber: string;
  productId: string;
  quantity: number;
  unit: string;
  totalWeightKg: number;

  // Logistics
  originPort: string;
  destinationPort: string;
  shippingLine?: string;
  containerNumber?: string;
  estimatedDepartureDate: Date;
  estimatedArrivalDate: Date;
  actualArrivalDate?: Date;

  // Costs
  fobValueEur: number;
  cifValueEur: number;
  dutyAmountEur: number;
  vatAmountEur?: number;

  // Carbon tracking
  transportCO2eKg: number;
  transportMode: 'sea' | 'air' | 'rail' | 'road';
  transportDistanceKm: number;

  // Status
  status: ShipmentStatus;
  customsDeclarationNumber?: string;
  cbamDeclarationId?: string;

  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Supplier Model
// ============================================================================

export interface TradeSupplier {
  id: string;
  name: string;
  country: OriginCountry;
  region?: string;
  contactEmail?: string;
  contactPhone?: string;
  certifications: string[];
  sustainabilityScore?: number;
  lastAuditDate?: Date;
  status: 'active' | 'pending_audit' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}
