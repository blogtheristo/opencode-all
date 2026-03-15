/**
 * Investor Reporting - Main Entry Point
 * Exports all investor reporting modules
 */

// Core services
export { metricsService, MetricsCalculationService } from './metrics-calculation';
export { reportService, ReportService } from './report-service';
export { templateGenerator, TemplateGenerator } from './template-generator';
export { integrationWrapper, IntegrationWrapper } from './integration-wrapper';

// Cap table & financials (Peachscore Accelerator)
export { capTableService, CapTableService } from './cap-table-service.js';
export { default as capTableRouter } from './cap-table-routes.js';
export * from './cap-table-types.js';

// API routes
export { default as investorReportsRouter } from './routes';

// Scheduler
export { investorReportsScheduler } from './scheduler';

// Types
export * from './types';
