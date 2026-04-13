import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    // E2E smoke test starts a real Express server — app startup takes ~10-15s
    // in this environment (bcrypt, module transforms, port binding).
    hookTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: ['src/__tests__/**', 'src/**/*.d.ts', 'src/**/types.ts', 'src/**/index.ts'],
      thresholds: {
        // Baseline 2026-04-13: ~28/21/29/28%. Raise incrementally as tests expand.
        statements: 28,
        branches: 20,
        functions: 28,
        lines: 28,
        // Higher bar for security-critical code (PR #936)
        'src/middleware/auth.middleware.ts': {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
        'src/routes/auth.routes.ts': {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
        'src/routes/compliance.routes.ts': {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
        'src/services/redis-rate-limiter.service.ts': {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
  },
});
