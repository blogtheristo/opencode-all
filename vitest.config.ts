import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: [
        'src/__tests__/**',
        'src/**/*.d.ts',
        'src/**/types.ts',
        'src/**/index.ts',
      ],
      thresholds: {
        // Baseline 2026-04-13: ~28/21/29/28%. Raise incrementally as tests expand.
        statements: 28,
        branches: 20,
        functions: 28,
        lines: 28,
      },
    },
  },
});
