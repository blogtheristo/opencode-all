/**
 * Logger Utility
 * Pino-based logging for DWS IQ Backend
 *
 * Supports both patterns:
 * - logger.info("message", { data })
 * - logger.info({ data }, "message")
 */

import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

const baseLogger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  base: {
    service: 'dws-iq-backend',
    version: '1.0.0',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Wrapper to support logger.info("message", { data }) pattern
type LogFn = (msgOrObj: any, data?: any) => void;

interface Logger {
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  debug: LogFn;
  trace: LogFn;
  fatal: LogFn;
}

const createLogFn = (level: keyof pino.Logger): LogFn => {
  return (msgOrObj: any, data?: any) => {
    if (typeof msgOrObj === 'string' && data !== undefined) {
      // Pattern: logger.info("message", { data })
      (baseLogger[level] as any)(data, msgOrObj);
    } else if (typeof msgOrObj === 'object' && typeof data === 'string') {
      // Pattern: logger.info({ data }, "message")
      (baseLogger[level] as any)(msgOrObj, data);
    } else if (typeof msgOrObj === 'string') {
      // Pattern: logger.info("message")
      (baseLogger[level] as any)(msgOrObj);
    } else {
      // Pattern: logger.info({ data })
      (baseLogger[level] as any)(msgOrObj);
    }
  };
};

const logger: Logger = {
  info: createLogFn('info'),
  warn: createLogFn('warn'),
  error: createLogFn('error'),
  debug: createLogFn('debug'),
  trace: createLogFn('trace'),
  fatal: createLogFn('fatal'),
};

export default logger;
