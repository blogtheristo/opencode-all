#!/usr/bin/env npx tsx
/**
 * Blog → Facebook Page pool scheduler
 *
 * Posts blog entries to the Lifetime Group Facebook page at a steady rate so
 * all entries fit within the Page token's validity window (60 days by default).
 *
 * Pool design:
 *   - All published blog posts are sorted newest-first.
 *   - Each run posts up to N posts (default = ceil(pending / daysLeft)) so the
 *     whole pool drains within the token window.
 *   - A state file tracks which posts were already published (idempotent).
 *
 * State:  config/blog-facebook-pool.json  (gitignored — no secrets, but keeps
 *         the publish log local; content is only slugs/URLs/timestamps).
 *
 * Usage:
 *   npx tsx scripts/backfill-blogs-to-facebook.ts            # normal run
 *   npx tsx scripts/backfill-blogs-to-facebook.ts --dry-run  # preview only
 *   npx tsx scripts/backfill-blogs-to-facebook.ts --limit 5  # cap posts this run
 *   npx tsx scripts/backfill-blogs-to-facebook.ts --reset    # ignore prior state
 *   npx tsx scripts/backfill-blogs-to-facebook.ts --plan     # print schedule only
 *
 * Env (from .env):
 *   FACEBOOK_PAGE_ID, FACEBOOK_PAGE_TOKEN
 */

import fs from 'node:fs';
import path from 'node:path';
import { publishToFacebook, isFacebookConfigured } from '../src/social-scheduler/facebook-publisher.js';

const POSTS_DIR = path.join(process.cwd(), 'onelifetime.world', 'posts');
const SITE_URL = 'https://onelifetime.world/posts/';
const STATE_FILE = path.join(process.cwd(), 'config', 'blog-facebook-pool.json');
const TOKEN_DAYS = 60;
const MIN_INTERVAL_MS = 15_000; // polite 15s between posts

interface BlogPost {
  slug: string;
  url: string;
  title: string;
  description: string;
  image: string | null;
  /** Blog classification: 1 = serious (posted to FB/LSJ), 2 = not posted. */
  cls: number;
}

interface PoolState {
  published: Array<{ slug: string; url: string; publishedAt: string; postId?: string }>;
  windowExpiresAt: string;
}

function extractOg(html: string, property: string): string | null {
  const re = new RegExp(`property="og:${property}"\\s+content="([^"]*)"`, 'i');
  const m = html.match(re);
  if (m) return m[1].trim();
  const m2 = html.match(new RegExp(`content="([^"]*)"\\s+property="og:${property}"`, 'i'));
  return m2 ? m2[1].trim() : null;
}

function isDraftSlug(slug: string): boolean {
  return /DRAFT|_RETIRED|RETIRED_/i.test(slug);
}

function collectBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];
  const files: string[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) files.push(full);
    }
  }
  walk(POSTS_DIR);

  for (const file of files) {
    const rel = path.relative(POSTS_DIR, file).replace(/\\/g, '/');
    const slug = rel.replace(/\.html$/, '');
    if (isDraftSlug(slug)) continue;

    const html = fs.readFileSync(file, 'utf8');
    const title = extractOg(html, 'title') ?? html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim();
    const description = extractOg(html, 'description');
    const url = extractOg(html, 'url') ?? `${SITE_URL}${rel}`;
    const image = extractOg(html, 'image');
    const cls = parseInt(html.match(/article:class" content="([12])"/)?.[1] ?? '2', 10);

    if (!title) continue;
    posts.push({ slug, url, title, description: description ?? '', image, cls });
  }

  return posts;
}

function loadState(): PoolState {
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) as PoolState;
    } catch {
      /* fall through to fresh state */
    }
  }
  return { published: [], windowExpiresAt: new Date(Date.now() + TOKEN_DAYS * 86400_000).toISOString() };
}

function saveState(state: PoolState) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

function buildPostContent(p: BlogPost): string {
  const desc = p.description ? `\n\n${p.description}` : '';
  return `${p.title}${desc}\n\n${p.url}`;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const planOnly = args.includes('--plan');
  const reset = args.includes('--reset');

  let limit: number | null = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit') limit = parseInt(args[i + 1] ?? '', 10);
  }

  if (!dryRun && !planOnly && !isFacebookConfigured()) {
    console.error('ERROR: FACEBOOK_PAGE_ID / FACEBOOK_PAGE_TOKEN not set.');
    process.exit(1);
  }

  let state = reset ? { published: [], windowExpiresAt: new Date(Date.now() + TOKEN_DAYS * 86400_000).toISOString() } : loadState();

  const posts = collectBlogPosts();
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  const publishedSlugs = new Set(state.published.map((p) => p.slug));
  // Only class 1 (serious) posts go to the Facebook page / LSJ LinkedIn.
  const pending = posts.filter((p) => !publishedSlugs.has(p.slug) && p.cls === 1);

  // Sort newest-first by mtime of the source HTML
  pending.sort((a, b) => {
    const ta = fs.statSync(path.join(POSTS_DIR, `${a.slug}.html`)).mtimeMs;
    const tb = fs.statSync(path.join(POSTS_DIR, `${b.slug}.html`)).mtimeMs;
    return tb - ta;
  });

  const now = Date.now();
  const daysLeft = Math.max(1, Math.ceil((Date.parse(state.windowExpiresAt) - now) / 86400_000));
  let perRun = Math.ceil(pending.length / daysLeft);
  if (limit && limit > 0) perRun = Math.min(perRun, limit);

  console.log(`Pool: ${pending.length} pending / ${daysLeft} days left → ${perRun} per run`);
  console.log(`Window expires: ${state.windowExpiresAt}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : planOnly ? 'PLAN' : 'LIVE'}\n`);

  const batch = pending.slice(0, perRun);

  if (planOnly || dryRun) {
    for (const p of batch) {
      console.log(`  - ${p.slug}\n    ${p.title}\n    ${p.url}`);
    }
    console.log(`\nNext run would post ${batch.length}. Remaining after: ${pending.length - batch.length}.`);
    return;
  }

  let ok = 0;
  let failed = 0;
  for (const p of batch) {
    const content = buildPostContent(p);
    console.log(`- ${p.slug}`);

    const result = await publishToFacebook({
      id: `blog-${p.slug}`,
      platform: 'linkedin',
      category: 'product_update',
      status: 'approved',
      content,
      image_url: p.image,
      scheduled_at: null,
      source: 'blog-pool',
      approval_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (result.success) {
      console.log(`  ✓ ${result.postUrl ?? result.postId}`);
      state.published.push({
        slug: p.slug,
        url: p.url,
        publishedAt: new Date().toISOString(),
        postId: result.postId,
      });
      saveState(state);
      ok++;
    } else {
      console.error(`  ✗ FAILED: ${result.error}`);
      failed++;
    }

    await new Promise((r) => setTimeout(r, MIN_INTERVAL_MS));
  }

  console.log(`\nDone. OK=${ok} Failed=${failed} Published total=${state.published.length}/${posts.length}`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});