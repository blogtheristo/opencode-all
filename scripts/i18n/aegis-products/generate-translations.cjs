#!/usr/bin/env node
// Evidence: Tool=Cursor Agent Model=cursor-grok-4.6 Date=2026-09-17
/**
 * Guard: a previous version wrote TRANSLATE: stubs over every language file.
 */
console.error(
  'Refusing to run generate-translations.cjs: it would overwrite FI/SV/DE/FR with stubs.\n' +
    'Extract document-order arrays from the HTML master, then fill translations.\n' +
    'Builder: node scripts/i18n/build-i18n-pages.cjs <config.json>',
);
process.exit(1);
