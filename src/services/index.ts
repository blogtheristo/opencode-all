/**
 * Services Index
 * Central export for all DWS6 services
 *
 * @module services
 */

// Authentication & Security
export { default as AuthService } from './auth.service.js';
export * as RedisTokenBlacklist from './redis-token-blacklist.service.js';
export * as RedisRateLimiter from './redis-rate-limiter.service.js';

// Climate Assistant
export { default as ClimateAssistantService } from './climate-assistant.service.js';
export { default as GatedService } from './climate-assistant-gated.service.js';

// Email
export { default as EmailService } from './email.service.js';
export { emailQueue as EmailQueue } from './email-queue.service.js';
export type { QueuedEmail } from './email-queue.service.js';

// Re-export types
export type {
  // Add types as needed
} from './auth.service.js';
