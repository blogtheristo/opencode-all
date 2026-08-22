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
        'error',
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
        'error',
        'always',
        {
          // Remediation: Replace == with ===. Loose equality causes
          // type coercion bugs. Use === for strict comparison.
        },
      ],
      'no-throw-literal': 'error',

      // ── Legacy-debt rules (2026-08-22 bootstrap → tightened same day):
      // all of these were paid down to zero violations on 2026-08-22 and
      // promoted from 'warn' to 'error'. Remaining known debt lives in
      // no-extraneous-class / no-namespace / no-console below (kept at
      // 'warn' with documented justifications).
      'no-useless-assignment': 'error',
      'no-useless-escape': 'error',
      'preserve-caught-error': 'error',
      '@typescript-eslint/no-dynamic-delete': 'error',
      '@typescript-eslint/no-extraneous-class': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/no-invalid-void-type': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',

      // ── TypeScript strict overrides ─────────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // ── Async safety ────────────────────────────────────────────
      'no-return-await': 'off',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
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
