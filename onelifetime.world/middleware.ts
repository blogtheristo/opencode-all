/**
 * Edge Middleware for DWS IQ Platform
 * Performance-optimized message delivery
 *
 * @description Edge caching for sub-100ms latency
 * @deployment Cloudflare Pages / Vercel Edge Runtime
 * @compliance EU data residency, GDPR-compliant
 */

import { NextRequest, NextResponse } from 'next/server';

// Middleware configuration
export const config = {
  matcher: [
    '/',
    '/blog/:path*',
    '/buy/:path*',
    '/posts/:path*',
  ],
};

/**
 * Edge middleware function
 * Optimizes caching and adds performance headers
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Edge caching for static messaging content
  // Cache for 1 year (31536000 seconds)
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  response.headers.set('CDN-Cache-Control', 'max-age=31536000');

  // Security headers (GDPR & NIS2 compliance)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // Content Security Policy (CSP)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://calendar.google.com; " +
    "style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://*.supabase.co https://*.supabase.in; " +
    "frame-src 'self' https://calendar.google.com; " +
    "base-uri 'self'; " +
    "form-action 'self';"
  );

  // Performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // EU data residency indicator
  response.headers.set('X-Data-Region', 'EU');

  // Performance timing
  const startTime = Date.now();
  response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);

  return response;
}

/**
 * A/B Testing Cookie Assignment
 * Assigns users to message variant experiments
 */
export function assignABTestVariant(request: NextRequest, response: NextResponse): NextResponse {
  const variantCookie = request.cookies.get('ab_variant');

  if (!variantCookie) {
    // Weighted distribution: 60% default, 20% variant_a, 20% variant_b
    const variants = ['default', 'variant_a', 'variant_b'];
    const weights = [0.6, 0.2, 0.2];

    const random = Math.random();
    let cumulativeWeight = 0;
    let selectedVariant = 'default';

    for (let i = 0; i < variants.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        selectedVariant = variants[i];
        break;
      }
    }

    // Set cookie for 30 days
    response.cookies.set('ab_variant', selectedVariant, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      sameSite: 'strict',
      secure: true,
    });
  }

  return response;
}
