/**
 * DWS IQ 6 - ERP Integration Approval Gate System
 *
 * Inspired by azure-agentic-infraops sequential agent choreography with approval gates.
 *
 * This system implements human-in-the-loop validation for critical ERP operations:
 * - Production order creation/modification
 * - Cost transaction posting
 * - Material requirements changes
 * - Mass data synchronization
 *
 * Pattern: Operation → Validation → Approval → Execution → Verification
 */

import pino from 'pino';
import { EventEmitter } from 'events';
import { EntityType, type ERPProvider, type SyncResult } from './types.js';
import emailService from '../../services/email.service.js';

const logger = pino({ name: 'erp-approval-gate' });

// ============================================================================
// Types
// ============================================================================

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum OperationRiskLevel {
  LOW = 'low', // Read-only operations
  MEDIUM = 'medium', // Single record updates
  HIGH = 'high', // Production order modifications
  CRITICAL = 'critical', // Mass updates, cost transactions
}

export interface ApprovalRequest {
  id: string;
  organizationId: string;
  provider: ERPProvider;
  entityType: EntityType;
  operationType: 'create' | 'update' | 'delete' | 'sync_batch';
  riskLevel: OperationRiskLevel;
  status: ApprovalStatus;
  requestedBy: string;
  requestedAt: Date;
  expiresAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;

  // Operation details
  summary: string;
  details: {
    recordCount?: number;
    estimatedImpact?: string;
    affectedSystems?: string[];
    rollbackPlan?: string;
  };

  // Preview data
  previewData?: unknown;

  // Execution
  executionStartedAt?: Date;
  executionCompletedAt?: Date;
  executionResult?: SyncResult;
}

export interface ApprovalGateConfig {
  enabled: boolean;
  autoApproveRiskLevels: OperationRiskLevel[]; // Auto-approve these levels
  approvalTimeoutMinutes: number;
  requireDualApproval: boolean; // Require 2 approvers for CRITICAL
  notificationChannels: ('email' | 'webhook' | 'teams' | 'mcp')[];
}

// ============================================================================
// Approval Gate Manager
// ============================================================================

export class ApprovalGateManager extends EventEmitter {
  private requests: Map<string, ApprovalRequest> = new Map();
  private config: ApprovalGateConfig;

  constructor(config?: Partial<ApprovalGateConfig>) {
    super();

    this.config = {
      enabled: config?.enabled ?? true,
      autoApproveRiskLevels: config?.autoApproveRiskLevels ?? [OperationRiskLevel.LOW],
      approvalTimeoutMinutes: config?.approvalTimeoutMinutes ?? 60,
      requireDualApproval: config?.requireDualApproval ?? true,
      notificationChannels: config?.notificationChannels ?? ['email', 'mcp'],
    };

    // Cleanup expired requests every 5 minutes
    setInterval(() => this.cleanupExpiredRequests(), 5 * 60 * 1000);
  }

  /**
   * Request approval for an ERP operation
   */
  async requestApproval(
    organizationId: string,
    provider: ERPProvider,
    entityType: EntityType,
    operationType: 'create' | 'update' | 'delete' | 'sync_batch',
    requestedBy: string,
    details: {
      summary: string;
      recordCount?: number;
      estimatedImpact?: string;
      affectedSystems?: string[];
      rollbackPlan?: string;
      previewData?: unknown;
    },
  ): Promise<ApprovalRequest> {
    const riskLevel = this.assessRiskLevel(entityType, operationType, details.recordCount);

    const request: ApprovalRequest = {
      id: this.generateRequestId(),
      organizationId,
      provider,
      entityType,
      operationType,
      riskLevel,
      status: ApprovalStatus.PENDING,
      requestedBy,
      requestedAt: new Date(),
      expiresAt: new Date(Date.now() + this.config.approvalTimeoutMinutes * 60 * 1000),
      summary: details.summary,
      details: {
        recordCount: details.recordCount,
        estimatedImpact: details.estimatedImpact,
        affectedSystems: details.affectedSystems,
        rollbackPlan: details.rollbackPlan,
      },
      previewData: details.previewData,
    };

    this.requests.set(request.id, request);

    // Auto-approve low-risk operations
    if (this.config.autoApproveRiskLevels.includes(riskLevel)) {
      logger.info({ requestId: request.id }, `Auto-approving ${riskLevel} risk operation`);
      return this.approve(request.id, 'system-auto-approval');
    }

    // Emit event for notification
    this.emit('approval:requested', request);

    // Send notifications
    await this.sendApprovalNotifications(request);

    logger.info(
      {
        requestId: request.id,
        provider,
        entityType,
        riskLevel,
      },
      'Approval requested',
    );

    return request;
  }

  /**
   * Approve a pending request
   */
  async approve(requestId: string, approvedBy: string): Promise<ApprovalRequest> {
    const request = this.requests.get(requestId);

    if (!request) {
      throw new Error(`Approval request ${requestId} not found`);
    }

    if (request.status !== ApprovalStatus.PENDING) {
      throw new Error(`Request ${requestId} is not pending (status: ${request.status})`);
    }

    if (new Date() > request.expiresAt) {
      request.status = ApprovalStatus.EXPIRED;
      throw new Error(`Request ${requestId} has expired`);
    }

    request.status = ApprovalStatus.APPROVED;
    request.approvedBy = approvedBy;
    request.approvedAt = new Date();

    this.emit('approval:approved', request);

    logger.info(
      {
        requestId,
        approvedBy,
        riskLevel: request.riskLevel,
      },
      'Approval granted',
    );

    return request;
  }

  /**
   * Reject a pending request
   */
  async reject(requestId: string, rejectedBy: string, reason: string): Promise<ApprovalRequest> {
    const request = this.requests.get(requestId);

    if (!request) {
      throw new Error(`Approval request ${requestId} not found`);
    }

    if (request.status !== ApprovalStatus.PENDING) {
      throw new Error(`Request ${requestId} is not pending`);
    }

    request.status = ApprovalStatus.REJECTED;
    request.rejectedBy = rejectedBy;
    request.rejectedAt = new Date();
    request.rejectionReason = reason;

    this.emit('approval:rejected', request);

    logger.info(
      {
        requestId,
        rejectedBy,
        reason,
      },
      'Approval rejected',
    );

    return request;
  }

  /**
   * Get approval request by ID
   */
  getRequest(requestId: string): ApprovalRequest | undefined {
    return this.requests.get(requestId);
  }

  /**
   * Get all pending requests for an organization
   */
  getPendingRequests(organizationId: string): ApprovalRequest[] {
    return Array.from(this.requests.values()).filter(
      (req) => req.organizationId === organizationId && req.status === ApprovalStatus.PENDING,
    );
  }

  /**
   * Record execution result
   */
  recordExecution(requestId: string, result: SyncResult): void {
    const request = this.requests.get(requestId);

    if (request) {
      request.executionCompletedAt = new Date();
      request.executionResult = result;
      this.emit('approval:executed', request);
    }
  }

  /**
   * Wait for approval (used in synchronous workflows)
   */
  async waitForApproval(requestId: string, timeoutMs?: number): Promise<ApprovalRequest> {
    const request = this.requests.get(requestId);

    if (!request) {
      throw new Error(`Request ${requestId} not found`);
    }

    if (request.status === ApprovalStatus.APPROVED) {
      return request;
    }

    if (request.status === ApprovalStatus.REJECTED) {
      throw new Error(`Request ${requestId} was rejected: ${request.rejectionReason}`);
    }

    // Wait for approval event
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => {
          reject(new Error(`Approval timeout for request ${requestId}`));
        },
        timeoutMs || this.config.approvalTimeoutMinutes * 60 * 1000,
      );

      const approvalHandler = (approvedRequest: ApprovalRequest) => {
        if (approvedRequest.id === requestId) {
          clearTimeout(timeout);
          this.removeListener('approval:approved', approvalHandler);
          this.removeListener('approval:rejected', rejectionHandler);
          resolve(approvedRequest);
        }
      };

      const rejectionHandler = (rejectedRequest: ApprovalRequest) => {
        if (rejectedRequest.id === requestId) {
          clearTimeout(timeout);
          this.removeListener('approval:approved', approvalHandler);
          this.removeListener('approval:rejected', rejectionHandler);
          reject(new Error(`Request rejected: ${rejectedRequest.rejectionReason}`));
        }
      };

      this.on('approval:approved', approvalHandler);
      this.on('approval:rejected', rejectionHandler);
    });
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private assessRiskLevel(
    entityType: EntityType,
    operationType: string,
    recordCount?: number,
  ): OperationRiskLevel {
    // CRITICAL: Mass operations or cost transactions
    if (recordCount && recordCount > 100) {
      return OperationRiskLevel.CRITICAL;
    }

    if (entityType === EntityType.COST_TRANSACTION && operationType !== 'create') {
      return OperationRiskLevel.CRITICAL;
    }

    // HIGH: Production orders, deletes
    if (entityType === EntityType.PRODUCTION_ORDER || operationType === 'delete') {
      return OperationRiskLevel.HIGH;
    }

    // MEDIUM: Inventory, maintenance
    if (
      entityType === EntityType.INVENTORY_TRANSACTION ||
      entityType === EntityType.MAINTENANCE_EVENT
    ) {
      return OperationRiskLevel.MEDIUM;
    }

    // LOW: Read-only, OEE metrics
    return OperationRiskLevel.LOW;
  }

  private async sendApprovalNotifications(request: ApprovalRequest): Promise<void> {
    if (this.config.notificationChannels.includes('email')) {
      const recipient =
        process.env.ERP_APPROVAL_EMAIL || process.env.ALERT_EMAIL_RECIPIENT || 'risto@lifetime.fi';
      await emailService.sendNotificationEmail(
        recipient,
        `ERP Approval Required: ${request.operationType} [${request.riskLevel}]`,
        `An ERP operation requires approval.\n\nOperation: ${request.operationType}\nRisk Level: ${request.riskLevel}\nProvider: ${request.provider}\nRequest ID: ${request.id}\n\nPlease review and approve or reject this operation.`,
      );
    }

    if (this.config.notificationChannels.includes('webhook')) {
      logger.info({ requestId: request.id }, 'Webhook approval notification (not yet connected)');
    }

    if (this.config.notificationChannels.includes('teams')) {
      logger.info({ requestId: request.id }, 'Teams approval notification (not yet connected)');
    }

    if (this.config.notificationChannels.includes('mcp')) {
      logger.info({ requestId: request.id }, 'MCP approval notification');
    }
  }

  private cleanupExpiredRequests(): void {
    const now = new Date();
    let expiredCount = 0;

    for (const [id, request] of this.requests.entries()) {
      if (request.status === ApprovalStatus.PENDING && request.expiresAt < now) {
        request.status = ApprovalStatus.EXPIRED;
        this.emit('approval:expired', request);
        expiredCount++;
      }

      // Remove old completed/rejected requests (older than 7 days)
      if (
        request.status !== ApprovalStatus.PENDING &&
        request.requestedAt.getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000
      ) {
        this.requests.delete(id);
      }
    }

    if (expiredCount > 0) {
      logger.info(`Expired ${expiredCount} approval requests`);
    }
  }

  private generateRequestId(): string {
    return `apr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const approvalGate = new ApprovalGateManager();
