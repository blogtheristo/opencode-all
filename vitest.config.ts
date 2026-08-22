import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    // Isolation guards: restore spies and unstub env/globals after every
    // test so cross-file pollution can't produce order-dependent flakes
    // (see STATUS.md follow-up history on error-middleware.test.ts).
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.claude/worktrees/**',
      // Stale PR-snapshot worktrees checked into the repo. They carry their
      // own outdated tests/mocks and must not run as part of main CI.
      'artifacts/**',
      // Same class of stale PR-snapshot worktrees, gitignored (local-only) —
      // present on dev machines, absent on CI.
      '**/.copilot-worktrees/**',
      // Standalone package with its own package.json + jest runner, not an
      // npm workspace member — root `npm ci` never installs its deps
      // (react, @reduxjs/toolkit, etc.), so Vitest picking these up fails
      // with ERR_MODULE_NOT_FOUND rather than actually running them.
      'Firehorse/mobile-app/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: ['src/__tests__/**', 'src/**/*.d.ts', 'src/**/types.ts'],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 55,
        lines: 60,
      },
    },
  },
});
