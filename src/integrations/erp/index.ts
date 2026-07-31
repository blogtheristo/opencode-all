/**
 * DWS IQ 6 - ERP Integration Module
 *
 * Main entry point for Nordic ERP integrations
 */

export * from './types.js';
export * from './base-connector.js';
export * from './monitor-connector.js';
export * from './service.js';
export * from './company-registry.js';
export * from './scheduler.js';
export * from './approval-gate.js';
// company-erp-registry / company-erp-resolver are NOT re-exported here — they're
// a separate company->ERP mapping used directly by src/construction-leads/, and
// their names (CompanyERPEntry, COMPANY_ERP_REGISTRY, resolveCompanyERP,
// resolveCompanyERPBatch) collide with company-registry.ts's own exports, which
// is the implementation service.ts actually uses.

export { default as erpRoutes } from './routes.js';

// Connector exports
export { IFSCloudConnector } from './connectors/ifs-connector.js';
export { Dynamics365Connector } from './connectors/dynamics365-connector.js';
export { SAPConnector } from './connectors/sap-connector.js';
export { VismaConnector } from './connectors/visma-connector.js';
export { JeevesConnector } from './connectors/jeeves-connector.js';

import { erpScheduler } from './scheduler.js';
import { approvalGate } from './approval-gate.js';
import pino from 'pino';

const logger = pino({ name: 'erp-integration-module' });

/**
 * Initialize ERP integration module
 */
export function initializeERPIntegrations(): void {
  logger.info('Initializing ERP integration module');

  // Start scheduler if enabled
  if (process.env.ERP_SCHEDULER_ENABLED === 'true') {
    erpScheduler.start();
  }

  // Setup approval gate event listeners
  approvalGate.on('approval:requested', (request) => {
    logger.info(
      {
        requestId: request.id,
        provider: request.provider,
        riskLevel: request.riskLevel,
      },
      'Approval requested',
    );
  });

  approvalGate.on('approval:approved', (request) => {
    logger.info(
      {
        requestId: request.id,
        approvedBy: request.approvedBy,
      },
      'Approval granted',
    );
  });

  approvalGate.on('approval:rejected', (request) => {
    logger.warn(
      {
        requestId: request.id,
        rejectedBy: request.rejectedBy,
        reason: request.rejectionReason,
      },
      'Approval rejected',
    );
  });

  logger.info('ERP integration module initialized');
}

/**
 * Shutdown ERP integration module
 */
export function shutdownERPIntegrations(): void {
  logger.info('Shutting down ERP integration module');
  erpScheduler.stop();
}
