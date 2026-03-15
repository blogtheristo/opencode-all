/**
 * Vitest global setup — sets environment variables required by modules
 * that fail-fast at import time (e.g. auth.service.ts requires JWT_SECRET).
 */

// Provide a test-only JWT secret (≥32 chars) so auth.service.ts can load
process.env.JWT_SECRET ??= 'test-jwt-secret-for-vitest-minimum-32-chars!!';
