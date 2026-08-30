/**
 * Logger Utility
 * Pino-based logging for DWS IQ Backend
 *
 * Supports both patterns:
 * - logger.info("message", { data })
 * - logger.info({ data }, "message")
 */

import '../config/env.js';
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
type LogFn = (msgOrObj: unknown, data?: unknown) => void;

interface Logger {
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  debug: LogFn;
  trace: LogFn;
  fatal: LogFn;
}

type PinoLevelFn = (obj: unknown, msg?: string, ...args: unknown[]) => void;
const createLogFn = (level: keyof pino.Logger): LogFn => {
  const log = (baseLogger[level] as unknown as PinoLevelFn).bind(baseLogger);
  return (msgOrObj: unknown, data?: unknown) => {
    if (typeof msgOrObj === 'string' && data !== undefined) {
      // Pattern: logger.info("message", { data })
      log(data, msgOrObj);
    } else if (typeof msgOrObj === 'object' && typeof data === 'string') {
      // Pattern: logger.info({ data }, "message")
      log(msgOrObj, data);
    } else if (typeof msgOrObj === 'string') {
      // Pattern: logger.info("message")
      log(msgOrObj);
    } else {
      // Pattern: logger.info({ data })
      log(msgOrObj);
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
