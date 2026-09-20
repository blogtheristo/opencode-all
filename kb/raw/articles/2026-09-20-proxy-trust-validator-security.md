# Proxy Trust Validator — IPv4-Mapped IPv6 CIDR Spoofing Prevention

**Date:** 2026-09-20  
**Type:** Security Vulnerability Fix  
**Status:** Implementation Complete

## Summary

Implemented a middleware validation layer (`src/middleware/proxy-trust-validator.middleware.ts`) to prevent IP spoofing attacks via misconfigured IPv4-mapped IPv6 trust subnets in the DWS IQ Express backend.

**Vulnerability:** The `proxy-addr` npm package accepts IPv4-mapped IPv6 CIDR notation with undersized prefixes (e.g., `::ffff:10.0.0.0/8` instead of the correct `::ffff:10.0.0.0/104`). Such misconfiguration treats the socket peer as hop 0, trusting all IPv4 addresses and allowing unauthenticated clients to spoof IP via `X-Forwarded-For` headers.

## Technical Details

- **IPv4-mapped IPv6 format:** IPv4 /N → IPv6 /(96+N). Example: `10.0.0.0/8` → `::ffff:10.0.0.0/104`.
- **Misconfiguration risk:** Prefix < 96 bits allows entire IPv4 space to be trusted.
- **Impact:** IP-based access control (`trust proxy` + `req.ip`) is bypassed, granting unauthenticated access to internal IPs.

## Implementation Status

- ✅ Validation middleware: 228 lines, handles dotted-decimal and hex IPv4-mapped formats
- ✅ Test suite: 27/27 tests passing, including security case (rejects undersized prefixes)
- ✅ Integration: Import added to `src/app.ts`; ready for middleware stack
- ✅ Design: Non-blocking (logs errors on startup, doesn't reject requests)

## Configuration Options (Pending HIC Decision)

**Option A (Recommended):** Add to Express middleware stack immediately after helmet/cors  
**Option B:** Separate "security startup" module (startup-only logging, non-blocking)  
**Option C:** Opt-in via environment variable (`VALIDATE_TRUST_PROXY=true`)

## Next Steps

1. **Audit:** Scan prod/staging trust proxy config for undersized IPv4-mapped prefixes
2. **Integrate:** Choose integration option (A/B/C) and deploy to staging
3. **Monitor:** Watch for "Invalid trust subnet detected" logs in first 24 hours
4. **Document:** Create operator runbook for correct IPv4-mapped IPv6 CIDR configuration

## References

- Implementation: `src/middleware/proxy-trust-validator.middleware.ts`
- Tests: `src/__tests__/proxy-trust-validator.test.ts`
- Field note: `docs/field-notes/2026-09-20-proxy-trust-validator-security-fix.md`
- Standards: DWS Engineering Discipline (Rules 1, 2, 3, 9, 12); OWASP A01:2021 (Broken Access Control)
