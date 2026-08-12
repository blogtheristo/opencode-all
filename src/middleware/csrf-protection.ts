import { type Request, type Response, type NextFunction } from 'express';
import logger from '../utils/logger.js';

/**
 * Modern CSRF Protection
 * 
 * CSRF protection using Sec-Fetch-Site header (94.18% browser support).
 * Falls back to Origin/Host comparison for legacy browsers.
 * 
 * Based on:
 * - Simon Willison: "A modern approach to preventing CSRF in Go" (2025-10-15)
 * - https://simonwillison.net/2025/Oct/15/csrf-in-go/
 */
export class ModernCSRFProtection {
  private static readonly SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE']);
  private static readonly TRUSTED_ORIGINS = (
    process.env.CORS_ORIGIN ||
    'https://dws6.com,https://www.dws6.com,https://dws10.com,https://www.dws10.com,http://localhost:3000,http://localhost:5173'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  private static hasExplicitAuth(req: Request): boolean {
    return Boolean(req.get('Authorization') || req.get('X-Admin-Key') || req.get('X-Outreach-Key'));
  }

  private static looksLikeBrowserRequest(req: Request): boolean {
    return Boolean(
      req.get('Sec-Fetch-Site') || req.get('Origin') || req.get('Referer') || req.get('Cookie'),
    );
  }

  /**
   * Express middleware for CSRF protection
   */
  public static validateRequest(req: Request, res: Response, next: NextFunction): void {
    // Skip CSRF check for safe methods
    if (this.SAFE_METHODS.has(req.method)) {
      return next();
    }

    // Token-authenticated or admin-key requests are not subject to browser-driven CSRF.
    if (this.hasExplicitAuth(req)) {
      return next();
    }

    // Browser-backed flows should pass CSRF checks, but API clients without browser
    // headers must still be able to use token/bootstrap endpoints.
    if (!this.looksLikeBrowserRequest(req)) {
      return next();
    }

    const error = this.checkCSRF(req);
    if (error) {
      logger.warn('CSRF validation failed', { 
        error, 
        path: req.path, 
        method: req.method,
        origin: req.get('Origin'),
        secFetchSite: req.get('Sec-Fetch-Site')
      });
      res.status(403).json({ error: 'CSRF validation failed', message: error });
      return;
    }

    next();
  }

  /**
   * Internal logic for CSRF validation
   */
  private static checkCSRF(req: Request): string | null {
    const secFetchSite = req.get('Sec-Fetch-Site');

    // 1. Check Sec-Fetch-Site header (Modern Browsers)
    if (secFetchSite) {
      // Allow only same-origin, same-site, or none (direct navigation)
      if (['same-origin', 'same-site', 'none'].includes(secFetchSite)) {
        return null;
      }
      return `Invalid Sec-Fetch-Site: ${secFetchSite}`;
    }

    // 2. Fallback to Origin header (Legacy Browsers)
    const origin = req.get('Origin');
    if (origin) {
      try {
        const originUrl = new URL(origin);
        const host = req.get('Host');
        
        if (
          (host && originUrl.host === host) ||
          this.TRUSTED_ORIGINS.includes(originUrl.origin)
        ) {
          return null;
        }
        return `Origin not allowed for CSRF-protected request: ${originUrl.origin}`;
      } catch (e) {
        return 'Invalid Origin header format';
      }
    }

    // 3. Fallback to Referer header as last resort
    const referer = req.get('Referer');
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        const host = req.get('Host');

        if (
          (host && refererUrl.host === host) ||
          this.TRUSTED_ORIGINS.includes(refererUrl.origin)
        ) {
          return null;
        }
        return `Referer not allowed for CSRF-protected request: ${refererUrl.origin}`;
      } catch (e) {
        return 'Invalid Referer header format';
      }
    }

    return 'Missing CSRF protection headers (Sec-Fetch-Site, Origin, or Referer)';
  }
}

export const csrfProtectionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  ModernCSRFProtection.validateRequest(req, res, next);
};
