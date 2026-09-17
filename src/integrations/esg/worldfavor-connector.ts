/**
 * DWS IQ 6 - Worldfavor Connector
 *
 * Integration with Worldfavor for ESG data collection and sustainability reporting
 */

import axios, { type AxiosInstance } from 'axios';
import pino from 'pino';
import { type CarbonEmissionData, type ESGIntegrationConfig, type SustainabilityReport } from './types';

const logger = pino({ name: 'worldfavor-connector' });

export class WorldfavorConnector {
  private httpClient: AxiosInstance;
  private config: ESGIntegrationConfig;

  constructor(config: ESGIntegrationConfig) {
    this.config = config;

    this.httpClient = axios.create({
      baseURL: config.apiUrl || 'https://api.worldfavor.com',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      }
    });
  }

  /**
   * Submit carbon emissions data to Worldfavor
   */
  async submitEmissions(data: CarbonEmissionData): Promise<void> {
    try {
      await this.httpClient.post('/v1/emissions', {
        organization_id: this.config.organizationId,
        period_start: data.periodStart.toISOString(),
        period_end: data.periodEnd.toISOString(),
        scope1: data.scope1Emissions,
        scope2: data.scope2Emissions,
        scope3: data.scope3Emissions,
        total: data.totalEmissions,
        sources: data.emissionSources,
        compliance_standard: data.complianceStandard
      });

      logger.info('Emissions data submitted to Worldfavor', {
        facilityId: data.facilityId,
        totalEmissions: data.totalEmissions
      });
    } catch (error) {
      logger.error('Failed to submit emissions to Worldfavor', { error });
      throw error;
    }
  }

  /**
   * Generate sustainability report via Worldfavor
   */
  async generateReport(
    periodStart: Date,
    periodEnd: Date,
    reportType: string
  ): Promise<SustainabilityReport> {
    try {
      const response = await this.httpClient.post('/v1/reports/generate', {
        organization_id: this.config.organizationId,
        report_type: reportType,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString()
      });

      logger.info('Sustainability report generated', { reportId: response.data.id });

      return response.data;
    } catch (error) {
      logger.error('Failed to generate report', { error });
      throw error;
    }
  }
}
