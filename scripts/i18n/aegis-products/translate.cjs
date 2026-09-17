#!/usr/bin/env node
// Evidence: Tool=Cursor Agent Model=cursor-grok-4.6 Date=2026-09-17
// Audit trail: git log -- scripts/i18n/aegis-products/translate.cjs
/**
 * Guard: do not convert or overwrite object-section translation files.
 * Catalog HTML is built by scripts/i18n/build-i18n-pages.cjs from JSON arrays.
 */
const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'en-strings.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

if (!Array.isArray(enData) && !Array.isArray(enData.strings)) {
  console.error(
    'Refusing to run: scripts/i18n/aegis-products/*-strings.json are object-section files, not builder arrays.\n' +
      'Running this script would wipe FI/SV/DE/FR translations.\n' +
      'Use: node scripts/i18n/build-i18n-pages.cjs scripts/i18n/<target>.config.json',
  );
  process.exit(1);
}

console.error('This helper is retired. Use build-i18n-pages.cjs with JSON arrays.');
process.exit(1);
