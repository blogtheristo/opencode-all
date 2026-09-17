/**
 * DWS IQ 6 - Base ERP Connector
 *
 * Abstract base class for all ERP integrations.
 * Provides common functionality for authentication, rate limiting, error handling, and logging.
 */

import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import pino from 'pino';
import {
  type EntityType,
  type ERPConnectionConfig,
  type ERPProvider,
  type MachineData,
  type OEEMetrics,
  type SyncDirection,
  type SyncError,
  type SyncOperation,
  type SyncResult,
  SyncStatus,
} from './types.js';

export abstract class BaseERPConnector {
  protected provider: ERPProvider;
  protected config: ERPConnectionConfig;
  protected logger: pino.Logger;
  protected httpClient: AxiosInstance;
  protected rateLimitRemaining: number = 1000;
  protected rateLimitResetAt?: Date;

  constructor(provider: ERPProvider, config: ERPConnectionConfig) {
    this.provider = provider;
    this.config = config;
    this.logger = pino({
      name: `erp-connector-${provider}`,
      level: process.env.LOG_LEVEL || 'info',
    });

    // Initialize HTTP client with base configuration
    this.httpClient = axios.create({
      baseURL: config.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DWS-IQ-6/1.0',
      },
    });

    // Add request interceptor for authentication
    this.httpClient.interceptors.request.use(
      (config) => this.addAuthHeaders(config),
      (error) => Promise.reject(error),
    );

    // Add response interceptor for rate limit tracking and error handling
    this.httpClient.interceptors.response.use(
      (response) => {
        this.updateRateLimitInfo(response);
        return response;
      },
      (error) => this.handleApiError(error),
    );
  }

  // ============================================================================
  // Abstract Methods - Must be implemented by each ERP connector
  // ============================================================================

  /**
   * Test the connection to the ERP system
   */
  abstract testConnection(): Promise<boolean>;

  /**
   * Authenticate with the ERP system
   */
  protected abstract authenticate(): Promise<void>;

  /**
   * Sync production orders from ERP to DWS
   */
  abstract syncProductionOrders(since?: Date): Promise<SyncResult>;

  /**
   * Sync machine data from DWS to ERP
   */
  abstract syncMachineData(data: MachineData[]): Promise<SyncResult>;

  /**
   * Sync OEE metrics from DWS to ERP
   */
  abstract syncOEEMetrics(metrics: OEEMetrics[]): Promise<SyncResult>;

  /**
   * Sync maintenance events bidirectionally
   */
  abstract syncMaintenanceEvents(direction: 'to_erp' | 'from_erp'): Promise<SyncResult>;

  // ============================================================================
  // Common Methods
  // ============================================================================

  /**
   * Add authentication headers to requests
   */
  protected async addAuthHeaders(
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> {
    // Default implementation - override in subclasses for specific auth methods
    if (this.config.apiKey) {
      config.headers.set('Authorization', `Bearer ${this.config.apiKey}`);
    }
    return config;
  }

  /**
   * Update rate limit information from response headers
   */
  protected updateRateLimitInfo(response: AxiosResponse): void {
    const remaining = response.headers['x-ratelimit-remaining'];
    const reset = response.headers['x-ratelimit-reset'];

    if (remaining !== undefined) {
      this.rateLimitRemaining = parseInt(remaining, 10);
    }

    if (reset !== undefined) {
      this.rateLimitResetAt = new Date(parseInt(reset, 10) * 1000);
    }
  }

  /**
   * Check if rate limit allows making another request
   */
  protected async checkRateLimit(): Promise<void> {
    if (this.rateLimitRemaining <= 0) {
      const waitTime = this.rateLimitResetAt ? this.rateLimitResetAt.getTime() - Date.now() : 60000; // Default to 1 minute

      if (waitTime > 0) {
        this.logger.warn(
          `Rate limit exceeded. Waiting ${waitTime}ms until ${this.rateLimitResetAt}`,
        );
        await this.sleep(waitTime);
      }
    }
  }

  /**
   * Handle API errors with retry logic
   */
  protected async handleApiError(error: AxiosError): Promise<AxiosResponse> {
    const status = error.response?.status;
    const data = error.response?.data as unknown;

    this.logger.error(
      {
        provider: this.provider,
        status,
        message: error.message,
        data,
      },
      'API error occurred',
    );

    // Handle specific error codes
    if (status === 401 || status === 403) {
      this.logger.warn('Authentication failed, attempting to re-authenticate');
      await this.authenticate();
      // Retry the request once
      if (error.config) {
        return this.httpClient.request(error.config);
      }
    }

    if (status === 429) {
      // Rate limit exceeded
      const retryAfter = error.response?.headers['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 60000;
      this.logger.warn(`Rate limited. Waiting ${waitTime}ms before retry`);
      await this.sleep(waitTime);
      if (error.config) {
        return this.httpClient.request(error.config);
      }
    }

    if (status && status >= 500) {
      // Server error - may be transient
      this.logger.warn('Server error, marking as retryable');
    }

    return Promise.reject(error);
  }

  /**
   * Make a GET request with retry logic
   */
  protected async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    await this.checkRateLimit();
    const response = await this.httpClient.get<T>(endpoint, config);
    return response.data;
  }

  /**
   * Make a POST request with retry logic
   */
  protected async post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    await this.checkRateLimit();
    const response = await this.httpClient.post<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * Make a PUT request with retry logic
   */
  protected async put<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    await this.checkRateLimit();
    const response = await this.httpClient.put<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request with retry logic
   */
  protected async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    await this.checkRateLimit();
    const response = await this.httpClient.delete<T>(endpoint, config);
    return response.data;
  }

  /**
   * Create a sync operation record
   */
  protected createSyncOperation(
    organizationId: string,
    entityType: EntityType,
    direction: 'to_erp' | 'from_erp',
  ): SyncOperation {
    return {
      id: this.generateId(),
      organizationId,
      provider: this.provider,
      direction: direction as SyncDirection,
      entityType,
      status: SyncStatus.IN_PROGRESS,
      startedAt: new Date(),
      recordsProcessed: 0,
      recordsFailed: 0,
    };
  }

  /**
   * Create a sync result
   */
  protected createSyncResult(
    operation: SyncOperation,
    success: boolean,
    errors: SyncError[] = [],
    warnings: string[] = [],
  ): SyncResult {
    return {
      success,
      operation: {
        ...operation,
        status: success ? SyncStatus.COMPLETED : SyncStatus.FAILED,
        completedAt: new Date(),
      },
      processedRecords: operation.recordsProcessed,
      failedRecords: operation.recordsFailed,
      errors,
      warnings,
    };
  }

  /**
   * Create a sync error
   */
  protected createSyncError(
    entityType: EntityType,
    errorCode: string,
    errorMessage: string,
    recordId?: string,
    retryable: boolean = false,
  ): SyncError {
    return {
      recordId,
      entityType,
      errorCode,
      code: errorCode,
      errorMessage,
      timestamp: new Date(),
      retryable,
    };
  }

  /**
   * Batch process records with error handling
   */
  protected async batchProcess<T, R>(
    records: T[],
    batchSize: number,
    processFunction: (batch: T[]) => Promise<R[]>,
  ): Promise<{ results: R[]; errors: Error[] }> {
    const results: R[] = [];
    const errors: Error[] = [];

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      try {
        const batchResults = await processFunction(batch);
        results.push(...batchResults);
        this.logger.info(
          `Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)}`,
        );
      } catch (error) {
        this.logger.error({ error }, `Batch processing failed for batch starting at index ${i}`);
        errors.push(error as Error);
      }
    }

    return { results, errors };
  }

  /**
   * Retry a function with exponential backoff
   */
  protected async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelayMs: number = 1000,
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          const delay = initialDelayMs * Math.pow(2, attempt);
          this.logger.warn({ error }, `Attempt ${attempt + 1} failed, retrying in ${delay}ms`);
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  /**
   * Sleep for specified milliseconds
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generate a unique ID
   */
  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Validate required configuration
   */
  protected validateConfig(requiredFields: string[]): void {
    const missingFields = requiredFields.filter(
      (field) => !(this.config as unknown as Record<string, unknown>)[field],
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required configuration fields for ${this.provider}: ${missingFields.join(', ')}`,
      );
    }
  }

  /**
   * Log sync operation status
   */
  protected logSyncStatus(operation: SyncOperation): void {
    this.logger.info(
      {
        provider: this.provider,
        operationId: operation.id,
        entityType: operation.entityType,
        status: operation.status,
        processed: operation.recordsProcessed,
        failed: operation.recordsFailed,
        duration: operation.completedAt
          ? operation.completedAt.getTime() - operation.startedAt.getTime()
          : undefined,
      },
      'Sync operation status',
    );
  }

  /**
   * Get connector status
   */
  public getStatus(): {
    provider: ERPProvider;
    enabled: boolean;
    rateLimitRemaining: number;
    rateLimitResetAt?: Date;
  } {
    return {
      provider: this.provider,
      enabled: this.config.enabled,
      rateLimitRemaining: this.rateLimitRemaining,
      rateLimitResetAt: this.rateLimitResetAt,
    };
  }
}
