/**
 * Centralized Error Handler Middleware
 *
 * Replaces scattered try/catch blocks with consistent error responses.
 * All errors flow through here for uniform shape and logging.
 */

import { type NextFunction, type Request, type Response } from 'express';
import logger from '../utils/logger.js';

/** Standard error response shape for all API errors */
interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
  correlationId?: string;
  stack?: string;
}

/** Application error with status code and error code */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/** Common error factory methods */
export const Errors = {
  badRequest: (message: string, code = 'BAD_REQUEST') =>
    new AppError(message, 400, code),
  unauthorized: (message = 'Authentication required', code = 'UNAUTHORIZED') =>
    new AppError(message, 401, code),
  forbidden: (message = 'Insufficient permissions', code = 'FORBIDDEN') =>
    new AppError(message, 403, code),
  notFound: (resource: string, code = 'NOT_FOUND') =>
    new AppError(`${resource} not found`, 404, code),
  conflict: (message: string, code = 'CONFLICT') =>
    new AppError(message, 409, code),
  tooManyRequests: (message = 'Too many requests', code = 'RATE_LIMITED') =>
    new AppError(message, 429, code),
  internal: (message = 'An unexpected error occurred', code = 'INTERNAL_ERROR') =>
    new AppError(message, 500, code, false),
};

/**
 * Global error handling middleware.
 * Must be registered LAST (after all routes).
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const correlationId = (req.headers['x-correlation-id'] as string) || undefined;

  // Determine status code
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const code = 'code' in err ? (err as AppError).code : 'INTERNAL_ERROR';
  const isOperational = 'isOperational' in err ? (err as AppError).isOperational : false;

  // Log error (full details for 5xx, summary for 4xx)
  if (statusCode >= 500) {
    logger.error('Server error', {
      error: err.message,
      code,
      stack: err.stack,
      path: req.path,
      method: req.method,
      correlationId,
      isOperational,
    });
  } else {
    logger.warn('Client error', {
      error: err.message,
      code,
      statusCode,
      path: req.path,
      method: req.method,
      correlationId,
    });
  }

  const response: ErrorResponse = {
    error: statusCode >= 500 ? 'Internal Server Error' : err.name || 'Error',
    message: isOperational || statusCode < 500 ? err.message : 'An unexpected error occurred',
    code,
    correlationId,
  };

  // Include stack trace in development only
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

/**
 * 404 handler for unmatched routes.
 * Must be registered after all routes but before errorHandler.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Route ${req.method} ${req.path} not found`, 404, 'ROUTE_NOT_FOUND'));
}
