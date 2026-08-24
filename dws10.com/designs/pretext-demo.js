/**
 * DWS Designs — Pretext-powered editorial text engine
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD
 * Date: 2026-03-28
 * Owner: Claude Code
 *
 * Uses @chenglou/pretext for zero-DOM text measurement & layout.
 * Text flows around animated golden orbs. ASCII particle field
 * renders proportional characters by brightness.
 */

import {
  prepareWithSegments,
  layoutNextLine,
  walkLineRanges,
} from 'https://esm.sh/@chenglou/pretext@0.0.5';

// ── Constants ──────────────────────────────────────────────
const BODY_FONT = '18px "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif';
const BODY_LINE_HEIGHT = 28;
const HEADLINE_FONT_FAMILY =
  '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif';

const EDITORIAL_TEXT = `Design is the silent ambassador of your brand. At DWS, every pixel serves a purpose — from the sovereign dark navy of our enterprise dashboards to the golden accents that whisper trust and precision. Our design systems — Gamma, Ultra, and Industrial Preview — each tell a story of EU-first engineering, where compliance meets craft and data meets delight. The Ironclad navigation, the Ultra design tokens, the responsive grids — all flow from a single conviction: industrial AI deserves industrial-grade beauty. We build for the humans who build the future. Every interaction, every animation, every carefully chosen typeface is a small act of respect for the operator staring at a screen at 3 AM, making decisions that shape cities, supply chains, and the carbon footprint of nations. This is design with weight. This is DWS.`;

const HEADLINE_TEXT = 'DWS DESIGN SYSTEMS';

// ── Orb state ──────────────────────────────────────────────
const orbs = [
  { x: 0, y: 0, radius: 28, color: 'rgba(212, 168, 67, 0.40)', phase: 0, speed: 0.000025 },
  { x: 0, y: 0, radius: 20, color: 'rgba(59, 130, 246, 0.30)', phase: Math.PI, speed: 0.000035 },
  { x: 0, y: 0, radius: 14, color: 'rgba(212, 168, 67, 0.25)', phase: Math.PI / 2, speed: 0.00003 },
];

// ── DOM refs ───────────────────────────────────────────────
const stage = document.getElementById('editorial-stage');
const hint = document.getElementById('editorial-hint');
if (!stage) throw new Error('#editorial-stage not found');

// DOM pools
let headlinePool = [];
let bodyPool = [];
let orbPool = [];

// ── Pretext caches ─────────────────────────────────────────
const preparedByKey = new Map();

function getPrepared(text, font) {
  const key = `${font}::${text}`;
  if (preparedByKey.has(key)) return preparedByKey.get(key);
  const p = prepareWithSegments(text, font);
  preparedByKey.set(key, p);
  return p;
}

function getSingleLineWidth(prepared) {
  let w = 0;
  walkLineRanges(prepared, 100000, (line) => {
    w = line.width;
  });
  return w;
}

// ── Headline font size fitting ─────────────────────────────
function headlineBreaks(prepared, maxWidth) {
  let breaks = false;
  walkLineRanges(prepared, maxWidth, (line) => {
    if (line.end.graphemeIndex !== 0) breaks = true;
  });
  return breaks;
}

function fitHeadlineSize(width, pageWidth) {
  let lo = Math.ceil(Math.max(20, pageWidth * 0.022));
  let hi = Math.floor(Math.min(80, Math.max(40, pageWidth * 0.05)));
  let best = lo;
  while (lo <= hi) {
    const size = Math.floor((lo + hi) / 2);
    const font = `700 ${size}px ${HEADLINE_FONT_FAMILY}`;
    const p = getPrepared(HEADLINE_TEXT, font);
    if (!headlineBreaks(p, width)) {
      best = size;
      lo = size + 1;
    } else {
      hi = size - 1;
    }
  }
  return best;
}

// ── Pool management ────────────────────────────────────────
function syncPool(pool, count, className, parent) {
  while (pool.length < count) {
    const el = document.createElement('div');
    el.className = className;
    pool.push(el);
    parent.appendChild(el);
  }
  while (pool.length > count) {
    pool.pop().remove();
  }
}

// ── Orb circle collision ───────────────────────────────────
function getOrbIntervals(orbObj, bandTop, bandBottom, padding) {
  const cy = orbObj.y;
  const r = orbObj.radius + padding;
  if (bandBottom < cy - r || bandTop > cy + r) return null;
  const midY = (bandTop + bandBottom) / 2;
  const dy = Math.abs(midY - cy);
  if (dy >= r) return null;
  const half = Math.sqrt(r * r - dy * dy);
  return { left: orbObj.x - half, right: orbObj.x + half };
}

// ── Column layout with obstacles ───────────────────────────
function layoutColumn(prepared, startCursor, region, lineHeight, obstacles) {
  let cursor = { ...startCursor };
  let lineTop = region.y;
  const lines = [];

  while (lineTop + lineHeight <= region.y + region.height) {
    const bandTop = lineTop;
    const bandBottom = lineTop + lineHeight;

    // Compute available width after carving out obstacles
    let availLeft = region.x;
    let availRight = region.x + region.width;

    for (const orb of obstacles) {
      const interval = getOrbIntervals(orb, bandTop, bandBottom, 10);
      if (!interval) continue;

      // If orb overlaps the left side, push left in
      if (interval.left < availLeft + (availRight - availLeft) / 2) {
        availLeft = Math.max(availLeft, interval.right);
      } else {
        // Otherwise shrink from right
        availRight = Math.min(availRight, interval.left);
      }
    }

    const width = availRight - availLeft;
    if (width < 40) {
      lineTop += lineHeight;
      continue;
    }

    const line = layoutNextLine(prepared, cursor, width);
    if (line === null) break;

    lines.push({
      x: Math.round(availLeft),
      y: Math.round(lineTop),
      width: line.width,
      text: line.text,
    });

    cursor = line.end;
    lineTop += lineHeight;
  }

  return { lines, cursor };
}

// ── Render orb DOM ─────────────────────────────────────────
function renderOrbs(orbData) {
  syncPool(orbPool, orbData.length, 'editorial-orb', stage);
  for (let i = 0; i < orbData.length; i++) {
    const orb = orbData[i];
    const el = orbPool[i];
    const r = orb.radius;
    el.style.left = `${orb.x - r}px`;
    el.style.top = `${orb.y - r}px`;
    el.style.width = `${r * 2}px`;
    el.style.height = `${r * 2}px`;
    el.style.background = `radial-gradient(circle, ${orb.color}, transparent 70%)`;
  }
}

// ── Drag interaction ───────────────────────────────────────
let dragIndex = -1;
let dragOffsetX = 0;
let dragOffsetY = 0;

function hitTestOrb(px, py) {
  for (let i = 0; i < orbs.length; i++) {
    const orb = orbs[i];
    const dx = px - orb.x;
    const dy = py - orb.y;
    if (dx * dx + dy * dy < (orb.radius + 16) * (orb.radius + 16)) return i;
  }
  return -1;
}

function getPointerPos(e, rect) {
  const touch = e.touches ? e.touches[0] : e;
  return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
}

stage.addEventListener('mousedown', (e) => {
  const rect = stage.getBoundingClientRect();
  const pos = getPointerPos(e, rect);
  const hit = hitTestOrb(pos.x, pos.y);
  if (hit >= 0) {
    dragIndex = hit;
    dragOffsetX = orbs[hit].x - pos.x;
    dragOffsetY = orbs[hit].y - pos.y;
    stage.style.cursor = 'grabbing';
    e.preventDefault();
  }
});

stage.addEventListener(
  'touchstart',
  (e) => {
    const rect = stage.getBoundingClientRect();
    const pos = getPointerPos(e, rect);
    const hit = hitTestOrb(pos.x, pos.y);
    if (hit >= 0) {
      dragIndex = hit;
      dragOffsetX = orbs[hit].x - pos.x;
      dragOffsetY = orbs[hit].y - pos.y;
      e.preventDefault();
    }
  },
  { passive: false },
);

function onPointerMove(e) {
  if (dragIndex < 0) {
    // Show grab cursor on hover
    const rect = stage.getBoundingClientRect();
    const pos = getPointerPos(e, rect);
    stage.style.cursor = hitTestOrb(pos.x, pos.y) >= 0 ? 'grab' : '';
    return;
  }
  const rect = stage.getBoundingClientRect();
  const pos = getPointerPos(e, rect);
  orbs[dragIndex].x = pos.x + dragOffsetX;
  orbs[dragIndex].y = pos.y + dragOffsetY;
  scheduleRender();
  e.preventDefault();
}

document.addEventListener('mousemove', onPointerMove);
document.addEventListener('touchmove', onPointerMove, { passive: false });

function onPointerUp() {
  if (dragIndex >= 0) {
    stage.style.cursor = '';
    dragIndex = -1;
  }
}

document.addEventListener('mouseup', onPointerUp);
document.addEventListener('touchend', onPointerUp);

// ── Main render ────────────────────────────────────────────
let scheduled = false;

function render(now) {
  scheduled = false;

  const rect = stage.getBoundingClientRect();
  const W = rect.width;
  const H = rect.height;

  if (W < 10 || H < 10) return;

  const gutter = Math.round(Math.max(24, W * 0.05));

  // Animate orbs (skip dragged orb)
  for (let i = 0; i < orbs.length; i++) {
    if (i === dragIndex) continue;
    const orb = orbs[i];
    orb.x = W * 0.5 + Math.cos(now * orb.speed + orb.phase) * W * 0.12;
    orb.y = H * 0.45 + Math.sin(now * orb.speed * 1.1 + orb.phase) * H * 0.1;
  }

  renderOrbs(orbs);

  // ── Headline ───
  const headlineWidth = W - gutter * 2;
  const headlineFontSize = fitHeadlineSize(headlineWidth, W);
  const headlineLineHeight = Math.round(headlineFontSize * 0.95);
  const headlineFont = `700 ${headlineFontSize}px ${HEADLINE_FONT_FAMILY}`;
  const headlinePrepared = getPrepared(HEADLINE_TEXT, headlineFont);

  const headlineRegion = {
    x: gutter,
    y: Math.max(24, H * 0.06),
    width: headlineWidth,
    height: headlineLineHeight * 3,
  };

  const headlineResult = layoutColumn(
    headlinePrepared,
    { segmentIndex: 0, graphemeIndex: 0 },
    headlineRegion,
    headlineLineHeight,
    orbs,
  );

  syncPool(headlinePool, headlineResult.lines.length, 'editorial-headline-line', stage);
  for (let i = 0; i < headlineResult.lines.length; i++) {
    const line = headlineResult.lines[i];
    const el = headlinePool[i];
    el.textContent = line.text;
    el.style.left = `${line.x}px`;
    el.style.top = `${line.y}px`;
    el.style.font = headlineFont;
    el.style.lineHeight = `${headlineLineHeight}px`;
  }

  // ── Body text ───
  const headlineBottom =
    headlineResult.lines.length > 0
      ? Math.max(...headlineResult.lines.map((l) => l.y + headlineLineHeight))
      : headlineRegion.y + headlineLineHeight;

  const bodyTop = headlineBottom + Math.round(H * 0.04);
  const columnGap = Math.round(W * 0.04);
  const isTwoCol = W > 640;
  const colWidth = isTwoCol ? Math.round((W - gutter * 2 - columnGap) / 2) : W - gutter * 2;

  const bodyPrepared = getPrepared(EDITORIAL_TEXT, BODY_FONT);
  const bodyRegion1 = {
    x: gutter,
    y: bodyTop,
    width: colWidth,
    height: H - bodyTop - gutter,
  };

  const leftResult = layoutColumn(
    bodyPrepared,
    { segmentIndex: 0, graphemeIndex: 0 },
    bodyRegion1,
    BODY_LINE_HEIGHT,
    orbs,
  );

  let rightLines = [];
  if (isTwoCol) {
    const bodyRegion2 = {
      x: gutter + colWidth + columnGap,
      y: bodyTop,
      width: colWidth,
      height: H - bodyTop - gutter,
    };
    const rightResult = layoutColumn(
      bodyPrepared,
      leftResult.cursor,
      bodyRegion2,
      BODY_LINE_HEIGHT,
      orbs,
    );
    rightLines = rightResult.lines;
  }

  const allBodyLines = [...leftResult.lines, ...rightLines];
  syncPool(bodyPool, allBodyLines.length, 'editorial-body-line', stage);
  for (let i = 0; i < allBodyLines.length; i++) {
    const line = allBodyLines[i];
    const el = bodyPool[i];
    el.textContent = line.text;
    el.style.left = `${line.x}px`;
    el.style.top = `${line.y}px`;
    el.style.font = BODY_FONT;
    el.style.lineHeight = `${BODY_LINE_HEIGHT}px`;
  }

  // Keep animating
  requestAnimationFrame(render);
}

function scheduleRender() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(render);
}

// ── ASCII particle field for hero badge ────────────────────
const ASCII_RAMP = ' .:-=+*#%@';
const PARTICLE_COUNT = 60;
const asciiCanvas = document.getElementById('ascii-canvas');

if (asciiCanvas) {
  const COLS = 52;
  const ROWS = 14;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * COLS,
      y: Math.random() * ROWS,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.15,
    });
  }

  const field = new Float32Array(COLS * ROWS);

  function renderAscii(now) {
    // Attractors
    const ax1 = COLS * 0.5 + Math.cos(now * 0.0006) * COLS * 0.3;
    const ay1 = ROWS * 0.5 + Math.sin(now * 0.0009) * ROWS * 0.3;
    const ax2 = COLS * 0.5 + Math.cos(now * 0.001 + Math.PI) * COLS * 0.2;
    const ay2 = ROWS * 0.5 + Math.sin(now * 0.0007 + Math.PI) * ROWS * 0.2;

    // Decay
    for (let i = 0; i < field.length; i++) field[i] *= 0.78;

    // Move particles
    for (const p of particles) {
      const d1 = Math.hypot(ax1 - p.x, ay1 - p.y) + 1;
      const d2 = Math.hypot(ax2 - p.x, ay2 - p.y) + 1;
      const closer = d1 < d2;
      const tx = closer ? ax1 : ax2;
      const ty = closer ? ay1 : ay2;
      const d = closer ? d1 : d2;

      p.vx += ((tx - p.x) / d) * 0.12 + (Math.random() - 0.5) * 0.08;
      p.vy += ((ty - p.y) / d) * 0.12 + (Math.random() - 0.5) * 0.08;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x += COLS;
      if (p.x >= COLS) p.x -= COLS;
      if (p.y < 0) p.y += ROWS;
      if (p.y >= ROWS) p.y -= ROWS;

      // Splat
      const gx = Math.round(p.x);
      const gy = Math.round(p.y);
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = gx + dx;
          const ny = gy + dy;
          if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 2.5) continue;
          const val = Math.max(0, 1 - dist / 2.5) * 0.5;
          const idx = ny * COLS + nx;
          field[idx] = Math.min(1, field[idx] + val);
        }
      }
    }

    // Render
    let html = '';
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const b = field[row * COLS + col];
        const ci = Math.min(ASCII_RAMP.length - 1, Math.round(b * (ASCII_RAMP.length - 1)));
        const alpha = Math.max(0.05, b);
        const char = ASCII_RAMP[ci];
        if (char === ' ') {
          html += ' ';
        } else {
          html += `<span style="color:rgba(212,168,67,${alpha.toFixed(2)})">${char}</span>`;
        }
      }
      html += '\n';
    }
    asciiCanvas.innerHTML = html;
    requestAnimationFrame(renderAscii);
  }

  requestAnimationFrame(renderAscii);
}

// ── Boot ───────────────────────────────────────────────────
await document.fonts.ready;
window.addEventListener('resize', scheduleRender);
scheduleRender();
