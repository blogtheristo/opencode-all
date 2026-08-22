// ESLint Flat Config for DWS6 Backend
// TypeScript + Express + Security rules
// Requires: eslint, @eslint/js, typescript-eslint, eslint-plugin-import-x, globals

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  // ── Global ignores ────────────────────────────────────────────────
  {
    ignores: [
      'dist/',
      'node_modules/',
      'landing-pages/',
      '.workflows/',
      'dws6.com/',
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
    ],
  },

  // ── Base: ESLint recommended ──────────────────────────────────────
  js.configs.recommended,

  // ── TypeScript strict ─────────────────────────────────────────────
  ...tseslint.configs.strict,

  // ── All TypeScript files in src/ ──────────────────────────────────
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ── Unused variables ────────────────────────────────────────
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // ── No console.log (use pino logger instead) ────────────────
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      // ── Security: no eval or implied eval ───────────────────────
      'no-eval': [
        'error',
        {
          // Remediation: Replace eval() with JSON.parse(), new Function(),
          // or a proper parser. eval() enables arbitrary code execution
          // and is a critical security vulnerability (DWS_SECURITY_STANDARD.md).
        },
      ],
      'no-implied-eval': 'error',
      // TypeScript version catches more cases (setTimeout/setInterval with strings)
      '@typescript-eslint/no-implied-eval': 'error',

      // ── Security: no new Function() ─────────────────────────────
      'no-new-func': 'error',

      // ── Import ordering ─────────────────────────────────────────
      // Note: If eslint-plugin-import-x is installed, uncomment the
      // import block below. Without the plugin, use IDE sort-imports.
      'sort-imports': [
        'warn',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],

      // ── Code quality ────────────────────────────────────────────
      'no-var': 'error',
      'prefer-const': 'warn',
      eqeqeq: [
        'warn',
        'always',
        {
          // Remediation: Replace == with ===. Loose equality causes
          // type coercion bugs. Use === for strict comparison.
        },
      ],
      'no-throw-literal': 'error',

      // ── Legacy-debt rules downgraded to warn (2026-08-22 bootstrap).
      // Pre-existing violations must not block CI; counts tracked in
      // Admin/ADMIN_MANUAL_SESSION_DIGEST.md §housekeeping follow-ups.
      // Tighten back to 'error' as the debt is paid off.
      'no-useless-assignment': 'warn',
      'no-useless-escape': 'warn',
      'preserve-caught-error': 'warn',
      '@typescript-eslint/no-dynamic-delete': 'warn',
      '@typescript-eslint/no-extraneous-class': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/no-invalid-void-type': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',

      // ── TypeScript strict overrides ─────────────────────────────
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // ── Async safety ────────────────────────────────────────────
      'no-return-await': 'off',
      '@typescript-eslint/return-await': ['warn', 'in-try-catch'],
      'require-await': 'off',
      '@typescript-eslint/require-await': 'off',

      // ── No restricted syntax (agent-friendly messages) ──────────
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="exec"]',
          message:
            'SECURITY: Do not use exec(). Use execFile() with argument arrays instead. See DWS_SECURITY_STANDARD.md shell command rules.',
        },
        {
          selector:
            'CallExpression[callee.property.name="exec"][callee.object.name="child_process"]',
          message:
            'SECURITY: Do not use child_process.exec(). Use child_process.execFile() with argument arrays. String interpolation in shell commands enables injection attacks.',
        },
        {
          selector:
            'CallExpression[callee.property.name="spawn"] Property[key.name="shell"][value.value=true]',
          message:
            'SECURITY: Do not use spawn with shell:true. It enables command injection. Use spawn without shell option or use execFile().',
        },
      ],
    },
  },

  // ── Dirs excluded from tsconfig.eslint.json: no typed linting ─────
  ...[
    'src/cloudflare/**/*.ts',
    'src/firehorse/**/*.ts',
    'src/integrations/**/*.ts',
    'src/investor-reports/**/*.ts',
    'src/mcp/**/*.ts',
    'src/payments/**/*.ts',
    'src/sandbox/**/*.ts',
    'src/web/**/*.ts',
    'src/database/**/*.ts',
    'src/config/**/*.ts',
  ].map((pattern) => ({
    files: [pattern],
    extends: [tseslint.configs.disableTypeChecked],
  })),

  // ── Test files: relaxed rules ─────────────────────────────────────
  {
    files: ['src/__tests__/**/*.ts', 'src/**/*.test.ts', 'src/**/*.spec.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
);
