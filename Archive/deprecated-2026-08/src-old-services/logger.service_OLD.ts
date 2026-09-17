import baseLogger from '../utils/logger.js';

export const logger = {
  info: (message: string, data?: unknown) => baseLogger.info(message, data),
  warn: (message: string, data?: unknown) => console.warn(`[WARN] ${message}`, data),
  error: (message: string, data?: unknown) => console.error(`[ERROR] ${message}`, data),
  debug: (message: string, data?: unknown) => baseLogger.debug(message, data),
};
