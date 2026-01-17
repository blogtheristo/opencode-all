/**
 * DWS IQ 6 - ERP Integration Module
 *
 * Main entry point for Nordic ERP integrations
 */

export * from './types';
export * from './base-connector';
export * from './monitor-connector';
export * from './service';
export * from './scheduler';
export * from './approval-gate';

export { default as erpRoutes } from './routes';

// Connector exports
export { IFSCloudConnector } from './connectors/ifs-connector';
export { Dynamics365Connector } from './connectors/dynamics365-connector';
export { SAPConnector } from './connectors/sap-connector';
export { VismaConnector } from './connectors/visma-connector';
export { JeevesConnector } from './connectors/jeeves-connector';

import { erpScheduler } from './scheduler';
import { approvalGate } from './approval-gate';
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
    logger.info('Approval requested', {
      requestId: request.id,
      provider: request.provider,
      riskLevel: request.riskLevel
    });
  });

  approvalGate.on('approval:approved', (request) => {
    logger.info('Approval granted', {
      requestId: request.id,
      approvedBy: request.approvedBy
    });
  });

  approvalGate.on('approval:rejected', (request) => {
    logger.warn('Approval rejected', {
      requestId: request.id,
      rejectedBy: request.rejectedBy,
      reason: request.rejectionReason
    });
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
