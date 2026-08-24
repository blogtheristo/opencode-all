/**
 * Generate PWA icons (192x192, 512x512) for DWS IQ Dashboard
 * Run: npx vite-plugin-pwa-icons-generator --preset minimal-2023
 *   Or: node scripts/gen-pwa-icons.mjs (requires: npm i pngjs)
 *
 * For quick setup, placeholder icons are created. Replace with branded icons.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
mkdirSync(publicDir, { recursive: true });

// Minimal 1x1 PNG - valid placeholder (replace with 192x192/512x512 for production)
const MINIMAL = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQzwAEhQGAhK4QBwAAAABJRU5ErkJggg==';
const buf = Buffer.from(MINIMAL, 'base64');

writeFileSync(join(publicDir, 'pwa-192.png'), buf);
writeFileSync(join(publicDir, 'pwa-512.png'), buf);
console.log('Created pwa-192.png and pwa-512.png (placeholders - add 192x192/512x512 for production)');
