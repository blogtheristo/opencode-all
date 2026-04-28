/**
 * ERP Integration Tracking Service
 * GTM Machine Phase 3a
 * Logs ERP connection events (SAP, Dynamics 365, IFS, Procountor, etc.)
 */

import { gtmEventLogger } from './gtm-event-logger.js';
import { eventBus } from '../agents/event-bus.js';

export interface ERPConnectionEvent {
  tenantId: string;
  erpSystem: string;
  event:
    | 'connection_started'
    | 'connection_test_success'
    | 'connection_test_failed'
    | 'field_mapping_complete'
    | 'sync_activated'
    | 'sync_error';
  adminEmail: string;
  timestamp: string;
  properties: {
    authMethod?: string;
    fieldMappingComplete?: boolean;
    syncSchedule?: 'realtime' | 'hourly' | 'daily' | 'weekly';
    syncDataTypes?: string[];
    responseTimeMs?: number;
    errorMessage?: string;
    errorCode?: string;
  };
}

class ERPTrackingService {
  async logERPConnectionStarted(
    tenantId: string,
    erpSystem: string,
    adminEmail: string,
  ): Promise<void> {
    const event: ERPConnectionEvent = {
      tenantId,
      erpSystem,
      event: 'connection_started',
      adminEmail,
      timestamp: new Date().toISOString(),
      properties: {
        authMethod: 'pending',
      },
    };

    await this.logEvent(event);
    this.emitEvent(event);
  }

  async logERPConnectionTestSuccess(
    tenantId: string,
    erpSystem: string,
    adminEmail: string,
    responseTimeMs: number,
    authMethod: string,
  ): Promise<void> {
    const event: ERPConnectionEvent = {
      tenantId,
      erpSystem,
      event: 'connection_test_success',
      adminEmail,
      timestamp: new Date().toISOString(),
      properties: {
        authMethod,
        responseTimeMs,
      },
    };

    await this.logEvent(event);
    this.emitEvent(event);
  }

  async logERPConnectionTestFailed(
    tenantId: string,
    erpSystem: string,
    adminEmail: string,
    errorCode: string,
    errorMessage: string,
    responseTimeMs: number,
  ): Promise<void> {
    const event: ERPConnectionEvent = {
      tenantId,
      erpSystem,
      event: 'connection_test_failed',
      adminEmail,
      timestamp: new Date().toISOString(),
      properties: {
        errorCode,
        errorMessage,
        responseTimeMs,
      },
    };

    await this.logEvent(event);
    this.emitEvent(event);
  }

  async logFieldMappingComplete(
    tenantId: string,
    erpSystem: string,
    adminEmail: string,
    dataTypes: string[],
  ): Promise<void> {
    const event: ERPConnectionEvent = {
      tenantId,
      erpSystem,
      event: 'field_mapping_complete',
      adminEmail,
      timestamp: new Date().toISOString(),
      properties: {
        fieldMappingComplete: true,
        syncDataTypes: dataTypes,
      },
    };

    await this.logEvent(event);
    this.emitEvent(event);
  }

  async logSyncActivated(
    tenantId: string,
    erpSystem: string,
    adminEmail: string,
    schedule: 'realtime' | 'hourly' | 'daily' | 'weekly',
    dataTypes: string[],
  ): Promise<void> {
    const event: ERPConnectionEvent = {
      tenantId,
      erpSystem,
      event: 'sync_activated',
      adminEmail,
      timestamp: new Date().toISOString(),
      properties: {
        syncSchedule: schedule,
        syncDataTypes: dataTypes,
        fieldMappingComplete: true,
      },
    };

    await this.logEvent(event);
    this.emitEvent(event);
  }

  async logERPError(
    tenantId: string,
    erpSystem: string,
    adminEmail: string,
    errorCode: string,
    errorMessage: string,
  ): Promise<void> {
    const event: ERPConnectionEvent = {
      tenantId,
      erpSystem,
      event: 'sync_error',
      adminEmail,
      timestamp: new Date().toISOString(),
      properties: {
        errorCode,
        errorMessage,
      },
    };

    await this.logEvent(event);
    this.emitEvent(event);
  }

  private async logEvent(event: ERPConnectionEvent): Promise<void> {
    const eventType = `erp_${event.event}`;
    const sessionId = `tenant_${event.tenantId}`;

    gtmEventLogger.logEvent({
      event_type: eventType,
      source: 'backend',
      properties: {
        event_source: 'erp_tracking',
        tenant_id: event.tenantId,
        erp_system: event.erpSystem,
        admin_email: event.adminEmail,
        ...event.properties,
      },
      session_id: sessionId,
      user_id: event.adminEmail,
      timestamp: event.timestamp,
    });
  }

  private emitEvent(event: ERPConnectionEvent): void {
    void eventBus.emit({
      type: `erp.${event.event}`,
      source: 'erp_tracking',
      priority: 'normal',
      orgId: event.tenantId,
      sessionId: `tenant_${event.tenantId}`,
      timestamp: event.timestamp,
      payload: {
        tenantId: event.tenantId,
        erpSystem: event.erpSystem,
        adminEmail: event.adminEmail,
        ...event.properties,
      },
    });
  }
}

export const erpTrackingService = new ERPTrackingService();
