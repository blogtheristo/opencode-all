/**
 * Proxy Trust Validator Middleware
 *
 * Validates and sanitizes trust subnet configuration to prevent IP spoofing
 * vulnerabilities via misconfigured IPv4-mapped IPv6 CIDR notation.
 *
 * VULNERABILITY: proxy-addr accepts IPv4-mapped IPv6 subnets with undersized
 * prefixes, e.g., `::ffff:10.0.0.0/8` instead of `::ffff:10.0.0.0/104`.
 * Such configuration treats the socket peer as hop 0 and trusts all IPv4
 * addresses, allowing unauthenticated clients to spoof IP via X-Forwarded-For.
 *
 * FIX: Validate that IPv4-mapped IPv6 subnets have correct prefix lengths:
 *   - IPv4 /8  → ::ffff:x.0.0.0/104     (IPv4 /8 = 8 bits; IPv6 = 96 + 8)
 *   - IPv4 /16 → ::ffff:x.y.0.0/112     (IPv4 /16 = 16 bits; IPv6 = 96 + 16)
 *   - IPv4 /24 → ::ffff:x.y.z.0/120     (IPv4 /24 = 24 bits; IPv6 = 96 + 24)
 *   - IPv4 /32 → ::ffff:x.y.z.w/128     (IPv4 /32 = 32 bits; IPv6 = 96 + 32)
 */

import { type NextFunction, type Request, type Response } from 'express';
import logger from '../utils/logger.js';

export interface TrustSubnet {
  original: string;
  isIPv4MappedIPv6: boolean;
  ipv4Prefix?: number;
  ipv6Prefix: number;
  isValid: boolean;
  invalidReason?: string;
}

/**
 * Parse a CIDR subnet string and validate IPv4-mapped IPv6 prefix length.
 *
 * Returns validation result including whether the subnet should be trusted.
 */
export function validateTrustSubnet(subnet: string): TrustSubnet {
  const result: TrustSubnet = {
    original: subnet,
    isIPv4MappedIPv6: false,
    ipv6Prefix: 0,
    isValid: false,
  };

  if (typeof subnet !== 'string' || !subnet) {
    result.invalidReason = 'Empty or non-string subnet';
    return result;
  }

  const [address, prefixStr] = subnet.split('/');
  if (!address || !prefixStr) {
    result.invalidReason = 'Missing CIDR prefix (format: address/prefix)';
    return result;
  }

  const prefix = parseInt(prefixStr, 10);
  if (Number.isNaN(prefix) || prefix < 0 || prefix > 128) {
    result.invalidReason = `Invalid IPv6 prefix: ${prefixStr} (prefix out of range: must be 0-128)`;
    return result;
  }

  const lower = address.toLowerCase();

  // Detect IPv4-mapped IPv6 in dotted decimal form: ::ffff:a.b.c.d
  const mappedDecimal = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mappedDecimal) {
    const ipv4 = mappedDecimal[1];
    const parts = ipv4.split('.').map(Number);

    // Validate IPv4 address
    if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
      result.invalidReason = `Invalid IPv4 address in ::ffff:${ipv4}`;
      return result;
    }

    result.isIPv4MappedIPv6 = true;
    result.ipv6Prefix = prefix;

    // Minimum useful IPv6 prefix for ::ffff:x.y.z.w is 96 (full ::ffff: prefix).
    // An undersized prefix (e.g. /8) treats socket peer as hop 0 and trusts all IPv4.
    if (prefix < 96) {
      result.invalidReason = `IPv4-mapped IPv6 prefix too small: /${prefix} < /96`;
      return result;
    }

    const ipv4Prefix = prefix - 96;
    result.ipv4Prefix = ipv4Prefix;

    if (ipv4Prefix !== 0 && ipv4Prefix % 8 !== 0 && ipv4Prefix % 16 !== 0) {
      // Warn on non-standard IPv4 prefixes, but allow them
      logger.warn('Unusual IPv4 prefix in trust subnet', {
        subnet,
        ipv4Prefix,
      });
    }

    result.isValid = true;
    return result;
  }

  // Detect IPv4-mapped IPv6 in hex form: ::ffff:HHHH:HHHH
  const mappedHex = lower.match(/^::ffff:([0-9a-f]+):([0-9a-f]+)$/);
  if (mappedHex) {
    const high = parseInt(mappedHex[1], 16);
    const low = parseInt(mappedHex[2], 16);

    // Reconstruct as IPv4
    const a = (high >> 8) & 0xff;
    const b = high & 0xff;
    const c = (low >> 8) & 0xff;
    const d = low & 0xff;

    result.isIPv4MappedIPv6 = true;
    result.ipv4Prefix = prefix;
    result.ipv6Prefix = prefix;

    // For hex form, still enforce that the prefix is within IPv4 range
    if (prefix > 128) {
      result.invalidReason = `IPv6 prefix out of range: ${prefix} > 128`;
      return result;
    }

    // If it's an IPv4-mapped address (starts with ::ffff:), the meaningful
    // prefix is in the lower 32 bits, so the IPv6 prefix should reflect that
    // Minimum useful IPv6 prefix for ::ffff:x.y.z.w is 96 (full ::ffff: part)
    if (prefix < 96 && prefix > 0) {
      result.invalidReason = `IPv4-mapped IPv6 prefix too small: /${prefix} < /96`;
      return result;
    }

    result.isValid = true;
    return result;
  }

  // Regular IPv4 or IPv6, not IPv4-mapped — validate as-is
  // This file focuses on IPv4-mapped IPv6, so we allow regular addresses
  result.isIPv4MappedIPv6 = false;
  result.ipv6Prefix = prefix;

  // For non-mapped addresses, just ensure prefix is in valid IPv4/IPv6 range
  if (lower.includes(':')) {
    // IPv6
    if (prefix > 128) {
      result.invalidReason = `IPv6 prefix out of range: ${prefix} > 128`;
      return result;
    }
  } else {
    // IPv4
    if (prefix > 32) {
      result.invalidReason = `IPv4 prefix out of range: ${prefix} > 32`;
      return result;
    }
  }

  result.isValid = true;
  return result;
}

/**
 * Middleware factory that validates trust proxy configuration.
 *
 * Call this early in middleware stack, before any IP-dependent logic.
 * On startup, logs warnings for invalid trust subnets.
 * Does NOT reject requests—this is a validation & logging layer.
 *
 * Usage:
 *   app.use(createProxyTrustValidator(['10.0.0.0/8', '::1', '::ffff:127.0.0.1/128']));
 */
export function createProxyTrustValidator(trustSubnets?: string | string[]) {
  const subnets: string[] = [];

  // Parse trust subnets from parameter or app.get('trust proxy')
  if (trustSubnets) {
    if (typeof trustSubnets === 'string') {
      subnets.push(trustSubnets);
    } else if (Array.isArray(trustSubnets)) {
      subnets.push(...trustSubnets);
    }
  }

  // Validate all trust subnets on middleware creation
  const validatedSubnets: TrustSubnet[] = [];
  for (const subnet of subnets) {
    const validated = validateTrustSubnet(subnet);
    validatedSubnets.push(validated);

    if (!validated.isValid) {
      logger.error('Invalid trust subnet detected', {
        subnet,
        reason: validated.invalidReason,
        impact: 'This subnet will be ignored by proxy-addr; IP-based access control may be bypassed',
      });
    } else if (validated.isIPv4MappedIPv6 && validated.ipv4Prefix! > 0) {
      logger.info('Validated IPv4-mapped IPv6 trust subnet', {
        subnet,
        ipv4Prefix: validated.ipv4Prefix,
        expectedIPv6Prefix: 96 + validated.ipv4Prefix,
      });
    }
  }

  // Return middleware
  return (_req: Request, _res: Response, next: NextFunction): void => {
    // This middleware only validates on startup; it doesn't block requests.
    next();
  };
}

/**
 * Utility: Get human-readable explanation of why a trust subnet is invalid.
 */
export function getTrustSubnetExplanation(validation: TrustSubnet): string {
  if (validation.isValid) {
    if (validation.isIPv4MappedIPv6) {
      return `Valid IPv4-mapped IPv6: ${validation.original} (IPv4 /${validation.ipv4Prefix} → IPv6 /${96 + validation.ipv4Prefix!})`;
    }
    return `Valid trust subnet: ${validation.original}`;
  }

  return `Invalid trust subnet: ${validation.original} — ${validation.invalidReason}`;
}
