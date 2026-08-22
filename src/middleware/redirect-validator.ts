/**
 * Redirect Validator Middleware
 *
 * Validate redirect URLs to prevent open redirect vulnerabilities.
 * TypeScript port of legacy redirect_validator.py (Nov 2025).
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-1368
 * Date: 2026-05-20
 * Owner: Claude Code
 */

import { type NextFunction, type Request, type Response } from 'express';
import logger from '../utils/logger.js';

export class RedirectValidator {
  /**
   * Allowed domains for absolute redirects.
   */
  private static readonly BASE_ALLOWED_DOMAINS = new Set([
    'dws10.com',
    'onelifetime.world',
  ]);

  private static readonly LOOPBACK_DOMAINS = new Set(['localhost', '127.0.0.1']);

  private static getAllowedDomains(): Set<string> {
    const allowed = new Set(this.BASE_ALLOWED_DOMAINS);
    const allowLoopback =
      process.env.NODE_ENV !== 'production' || process.env.ALLOW_LOOPBACK_REDIRECTS === 'true';

    if (allowLoopback) {
      for (const domain of this.LOOPBACK_DOMAINS) {
        allowed.add(domain);
      }
    }

    return allowed;
  }

  /**
   * Check if redirect URL is safe.
   */
  static isSafeRedirect(url: string | null | undefined): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    // Allow relative URLs (same-origin)
    // Must start with / but NOT with // (protocol-relative URLs are dangerous)
    if (url.startsWith('/') && !url.startsWith('//')) {
      return true;
    }

    try {
      const parsed = new URL(url);

      // Scheme must be http or https
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        logger.warn(`Blocked redirect with dangerous scheme: ${parsed.protocol}`);
        return false;
      }

      // Domain must be in allow-list
      const domain = parsed.hostname.toLowerCase();
      if (!this.getAllowedDomains().has(domain)) {
        logger.warn(`Blocked redirect to non-whitelisted domain: ${domain}`);
        return false;
      }

      return true;
    } catch (error) {
      logger.warn(`Failed to parse redirect URL ${url}:`, error);
      return false;
    }
  }

  /**
   * Sanitize redirect URL, returning default if unsafe.
   */
  static sanitizeRedirect(url: string | null | undefined, defaultValue = '/'): string {
    if (url && this.isSafeRedirect(url)) {
      return url;
    }
    return defaultValue;
  }

  static addAllowedDomain(domain: string): void {
    this.BASE_ALLOWED_DOMAINS.add(domain.trim().toLowerCase());
  }

  static removeAllowedDomain(domain: string): void {
    this.BASE_ALLOWED_DOMAINS.delete(domain.trim().toLowerCase());
  }
}

/**
 * Express middleware to validate 'next' query parameter.
 */
export const validateRedirectMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const nextValue = req.query.next;
  if (typeof nextValue === 'string') {
    const nextUrl = nextValue;
    if (!RedirectValidator.isSafeRedirect(nextUrl)) {
      logger.warn(`Invalid redirect URL blocked: ${nextUrl}`);
      req.query.next = '/';
    }
  } else if (nextValue !== undefined) {
    logger.warn('Invalid redirect payload blocked', { nextType: typeof nextValue });
    req.query.next = '/';
  }
  next();
};
