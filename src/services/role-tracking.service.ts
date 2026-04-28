/**
 * Admin Role Attribution Tracking Service
 * GTM Machine Phase 3b
 * Logs role separation events (CFO → Tenant Admin, auto-promotion, confirmations)
 */

import { gtmEventLogger } from './gtm-event-logger.js';
import { eventBus } from '../agents/event-bus.js';

export interface AdminRoleEvent {
  tenantId: string;
  event: 'admin_designated' | 'admin_auto_promoted' | 'admin_confirmation' | 'sod_waiver_exception';
  billingOwnerEmail: string;
  tenantAdminEmail?: string;
  designationPath?: 'PATH_A_CFO_DESIGNATED' | 'PATH_B_AUTO_PROMOTED';
  timestamp: string;
  kyaPolicy?: 'separation_of_duties_enforced' | 'separation_of_duties_waived';
  daysSinceInvoiceFinalized?: number;
  reasonForWaiver?: string;
}

class RoleTrackingService {
  /**
   * Log when CFO designates a Tenant Admin (Path A)
   */
  async logAdminDesignation(
    tenantId: string,
    billingOwnerEmail: string,
    tenantAdminEmail: string,
    daysSinceInvoiceFinalized: number,
  ): Promise<void> {
    const event: AdminRoleEvent = {
      tenantId,
      event: 'admin_designated',
      billingOwnerEmail,
      tenantAdminEmail,
      designationPath: 'PATH_A_CFO_DESIGNATED',
      timestamp: new Date().toISOString(),
      kyaPolicy: 'separation_of_duties_enforced',
      daysSinceInvoiceFinalized,
    };

    await this.logEvent(event);
    this.emitEvent(event);
  }

  /**
   * Log when system auto-promotes technical contact to Tenant Admin (Path B)
   */
  async logAdminAutoPromotion(
    tenantId: string,
    billingOwnerEmail: string,
    technicalContactEmail: string,
    daysSinceInvoiceFinalized: number,
  ): Promise<void> {
    const event: AdminRoleEvent = {
      tenantId,
      event: 'admin_auto_promoted',
      billingOwnerEmail,
      tenantAdminEmail: technicalContactEmail,
      designationPath: 'PATH_B_AUTO_PROMOTED',
      timestamp: new Date().toISOString(),
      kyaPolicy: 'separation_of_duties_enforced',
      daysSinceInvoiceFinalized,
    };

    await this.logEvent(event);
    this.emitEvent(event);
  }

  /**
   * Log when Tenant Admin completes first login and MFA enrolment (Path A)
   */
  async logAdminConfirmation(
    tenantId: string,
    billingOwnerEmail: string,
    tenantAdminEmail: string,
  ): Promise<void> {
    const event: AdminRoleEvent = {
      tenantId,
      event: 'admin_confirmation',
      billingOwnerEmail,
      tenantAdminEmail,
      timestamp: new Date().toISOString(),
      kyaPolicy: 'separation_of_duties_enforced',
    };

    await this.logEvent(event);
    this.emitEvent(event);
  }

  /**
   * Log SoD exception when CFO holds both Billing Owner and Tenant Admin roles
   */
  async logSODWaiverException(
    tenantId: string,
    billingOwnerEmail: string,
    reasonForWaiver: string,
    daysSinceInvoiceFinalized: number,
  ): Promise<void> {
    const event: AdminRoleEvent = {
      tenantId,
      event: 'sod_waiver_exception',
      billingOwnerEmail,
      tenantAdminEmail: billingOwnerEmail,
      designationPath: 'PATH_A_CFO_DESIGNATED',
      timestamp: new Date().toISOString(),
      kyaPolicy: 'separation_of_duties_waived',
      reasonForWaiver,
      daysSinceInvoiceFinalized,
    };

    await this.logEvent(event);
    this.emitEvent(event);
  }

  private async logEvent(event: AdminRoleEvent): Promise<void> {
    const eventType = `admin_role_${event.event}`;
    const sessionId = `tenant_${event.tenantId}`;

    gtmEventLogger.logEvent({
      event_type: eventType,
      source: 'backend',
      properties: {
        event_source: 'role_tracking',
        tenant_id: event.tenantId,
        billing_owner_email: event.billingOwnerEmail,
        tenant_admin_email: event.tenantAdminEmail,
        designation_path: event.designationPath,
        kya_policy: event.kyaPolicy,
        days_since_invoice: event.daysSinceInvoiceFinalized,
        reason_for_waiver: event.reasonForWaiver,
      },
      session_id: sessionId,
      user_id: event.billingOwnerEmail,
      timestamp: event.timestamp,
    });
  }

  private emitEvent(event: AdminRoleEvent): void {
    void eventBus.emit({
      type: `role.${event.event}`,
      source: 'role_tracking',
      priority: 'normal',
      orgId: event.tenantId,
      sessionId: `tenant_${event.tenantId}`,
      timestamp: event.timestamp,
      payload: {
        tenantId: event.tenantId,
        billingOwnerEmail: event.billingOwnerEmail,
        tenantAdminEmail: event.tenantAdminEmail,
        kyaPolicy: event.kyaPolicy,
        designationPath: event.designationPath,
      },
    });
  }
}

export const roleTrackingService = new RoleTrackingService();
