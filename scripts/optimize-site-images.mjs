#!/usr/bin/env node
// Optimize heavy raster images for a public site folder and keep its dual-folder
// mirror byte-identical. Re-encodes PNG/JPEG (palette/mozjpeg) and caps very large
// dimensions. Only rewrites a file when the result is actually smaller.
//
// Usage: node scripts/optimize-site-images.mjs <srcDir> <mirrorDir> [minKB] [maxWidth]
// Example: node scripts/optimize-site-images.mjs \
//            dws10.com/static/images landing-pages/dws10-com/static/images 400 1920

import sharp from 'sharp';
import { readdirSync, statSync, renameSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const [, , SRC_DIR, MIRROR_DIR, minKB = '400', maxWidth = '1920'] = process.argv;
if (!SRC_DIR) {
  console.error(
    'Usage: node scripts/optimize-site-images.mjs <srcDir> <mirrorDir> [minKB] [maxWidth]',
  );
  process.exit(1);
}
const THRESHOLD = Number(minKB) * 1024;
const MAX_W = Number(maxWidth);

const files = readdirSync(SRC_DIR).filter((f) => /\.(png|jpe?g)$/i.test(f));
let before = 0,
  after = 0,
  changed = 0;
const rows = [];

for (const f of files) {
  const p = join(SRC_DIR, f);
  const sz = statSync(p).size;
  if (sz < THRESHOLD) continue;
  before += sz;
  const isPng = /\.png$/i.test(f);
  const meta = await sharp(p).metadata();
  let pipe = sharp(p).rotate();
  if (meta.width && meta.width > MAX_W)
    pipe = pipe.resize({ width: MAX_W, withoutEnlargement: true });
  pipe = isPng
    ? pipe.png({ palette: true, quality: 82, compressionLevel: 9, effort: 8 })
    : pipe.jpeg({ quality: 82, mozjpeg: true });
  const tmp = p + '.opt';
  await pipe.toFile(tmp);
  const nsz = statSync(tmp).size;
  if (nsz < sz) {
    renameSync(tmp, p);
    after += nsz;
    changed++;
    if (MIRROR_DIR && existsSync(MIRROR_DIR)) {
      const mp = join(MIRROR_DIR, f);
      mkdirSync(dirname(mp), { recursive: true });
      copyFileSync(p, mp);
    }
    rows.push(
      `  ${(sz / 1024).toFixed(0)}KB -> ${(nsz / 1024).toFixed(0)}KB  (-${(100 * (1 - nsz / sz)).toFixed(0)}%)  ${f}`,
    );
  } else {
    after += sz;
    renameSync(tmp, p + '.discard-opt');
    rows.push(`  ${(sz / 1024).toFixed(0)}KB  KEPT (no gain)  ${f}`);
  }
}
rows.sort();
console.log(rows.join('\n'));
console.log(
  `\n>>> ${changed} images optimized · ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB  (saved ${((before - after) / 1048576).toFixed(1)}MB)`,
);
