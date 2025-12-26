/**
 * Investor Reporting - Main Entry Point
 * Exports all investor reporting modules
 */

// Core services
export { metricsService, MetricsCalculationService } from './metrics-calculation';
export { reportService, ReportService } from './report-service';
export { templateGenerator, TemplateGenerator } from './template-generator';
export { integrationWrapper, IntegrationWrapper } from './integration-wrapper';

// API routes
export { default as investorReportsRouter } from './routes';

// Scheduler
export { investorReportsScheduler } from './scheduler';

// Types
export * from './types';
