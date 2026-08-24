/**
 * DWS IQ 6 - ESG Integration Types
 *
 * Type definitions for sustainability and ESG reporting integrations:
 * - Worldfavor (Nordic ESG platform)
 * - Position Green (Nordic sustainability reporting)
 */

export enum ESGProvider {
  WORLDFAVOR = 'worldfavor',
  POSITION_GREEN = 'position_green'
}

export interface ESGIntegrationConfig {
  provider: ESGProvider;
  enabled: boolean;
  apiUrl: string;
  apiKey: string;
  organizationId?: string;
}

export interface CarbonEmissionData {
  id: string;
  facilityId: string;
  facilityName: string;
  periodStart: Date;
  periodEnd: Date;
  scope1Emissions: number; // Direct emissions (tCO2e)
  scope2Emissions: number; // Indirect emissions from electricity (tCO2e)
  scope3Emissions?: number; // Other indirect emissions (tCO2e)
  totalEmissions: number;
  emissionSources: EmissionSource[];
  verificationStatus: 'unverified' | 'pending' | 'verified';
  verifiedBy?: string;
  verifiedAt?: Date;
  complianceStandard: string; // e.g., "GHG Protocol", "ISO 14064"
}

export interface EmissionSource {
  sourceType: 'energy' | 'transport' | 'production' | 'waste';
  sourceName: string;
  emissions: number; // tCO2e
  activityData: number;
  activityUnit: string;
  emissionFactor: number;
}

export interface EnergyConsumptionData {
  id: string;
  assetId?: string;
  assetName?: string;
  timestamp: Date;
  energyType: 'electricity' | 'natural_gas' | 'diesel' | 'hydrogen' | 'renewable';
  consumption: number; // kWh
  cost?: number;
  carbonIntensity?: number; // gCO2e/kWh
  renewablePercentage?: number;
}

export interface SustainabilityReport {
  id: string;
  organizationId: string;
  reportType: 'monthly' | 'quarterly' | 'annual' | 'csrd';
  periodStart: Date;
  periodEnd: Date;
  totalEmissions: number;
  energyConsumption: number;
  renewableEnergyPercentage: number;
  wasteGenerated?: number;
  waterConsumption?: number;
  targets: SustainabilityTarget[];
  generatedAt: Date;
  reportUrl?: string;
}

export interface SustainabilityTarget {
  targetType: 'emissions' | 'energy' | 'renewable' | 'waste' | 'water';
  targetValue: number;
  targetUnit: string;
  targetDate: Date;
  currentValue: number;
  progressPercentage: number;
}
