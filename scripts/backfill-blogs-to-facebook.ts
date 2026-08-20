#!/usr/bin/env npx tsx
/**
 * Blog → Facebook Page Backfill
 *
 * Sends every published blog post on onelifetime.world to the configured
 * Facebook Page, using the shared facebook-publisher transport.
 *
 * Usage:
 *   FACEBOOK_PAGE_ID=133022958190 FACEBOOK_PAGE_TOKEN=<token> \
 *     npx tsx scripts/backfill-blogs-to-facebook.ts
 *
 * Optional flags:
 *   --dry-run    Print what would be posted without posting
 *   --limit N    Only process N posts (for testing)
 *   --since DATE Only posts newer than ISO date (e.g. 2026-01-01)
 *   --post ID    Only post the specific blog slug
 *   --reverse    Oldest first (default newest first)
 */

import fs from 'node:fs';
import path from 'node:path';
import { publishToFacebook, isFacebookConfigured } from '../src/social-scheduler/facebook-publisher.js';

const POSTS_DIR = path.join(process.cwd(), 'onelifetime.world', 'posts');
const SITE_URL = 'https://onelifetime.world/posts/';

interface BlogPost {
  slug: string;
  url: string;
  title: string;
  description: string;
  image: string | null;
  sourceHtml: string;
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
    const title = extractOg(html, 'title') ?? extractTitle(html);
    const description = extractOg(html, 'description');
    const url = extractOg(html, 'url') ?? `${SITE_URL}${rel}`;
    const image = extractOg(html, 'image');

    if (!title) continue;

    posts.push({ slug, url, title, description: description ?? '', image, sourceHtml: html });
  }

  return posts;
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : null;
}

function buildPostContent(p: BlogPost): string {
  const desc = p.description ? `\n\n${p.description}` : '';
  return `${p.title}${desc}\n\n${p.url}`;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const reverse = args.includes('--reverse');

  let limit: number | null = null;
  let since: string | null = null;
  let onlySlug: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit') limit = parseInt(args[i + 1] ?? '', 10);
    if (args[i] === '--since') since = args[i + 1] ?? null;
    if (args[i] === '--post') onlySlug = args[i + 1] ?? null;
  }

  if (!dryRun && !isFacebookConfigured()) {
    console.error('ERROR: FACEBOOK_PAGE_ID / FACEBOOK_PAGE_TOKEN not set.');
    console.error('Set them or run with --dry-run to preview.');
    process.exit(1);
  }

  let posts = collectBlogPosts();
  if (onlySlug) {
    posts = posts.filter((p) => p.slug === onlySlug || p.slug.endsWith(`/${onlySlug}`) || p.slug === `${onlySlug}.html`);
  }
  if (since) {
    const sinceTs = Date.parse(since);
    posts = posts.filter((p) => {
      const ts = fs.statSync(path.join(POSTS_DIR, `${p.slug}.html`)).mtimeMs;
      return ts >= sinceTs;
    });
  }
  posts.sort((a, b) => {
    const ta = fs.statSync(path.join(POSTS_DIR, `${a.slug}.html`)).mtimeMs;
    const tb = fs.statSync(path.join(POSTS_DIR, `${b.slug}.html`)).mtimeMs;
    return reverse ? ta - tb : tb - ta;
  });
  if (limit && limit > 0) posts = posts.slice(0, limit);

  console.log(`Blog posts found: ${posts.length}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN (nothing posted)' : 'LIVE'}\n`);

  let ok = 0;
  let failed = 0;

  for (const p of posts) {
    const content = buildPostContent(p);
    console.log(`- [${p.slug}]`);
    console.log(`  ${p.title}`);
    console.log(`  ${p.url}`);

    if (dryRun) {
      ok++;
      continue;
    }

    const result = await publishToFacebook({
      id: `blog-${p.slug}`,
      platform: 'linkedin',
      category: 'product_update',
      status: 'approved',
      content,
      image_url: p.image,
      scheduled_at: null,
      source: 'blog-backfill',
      approval_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (result.success) {
      console.log(`  ✓ published: ${result.postUrl ?? result.postId}`);
      ok++;
    } else {
      console.error(`  ✗ FAILED: ${result.error}`);
      failed++;
    }

    // Be polite to Graph API rate limits
    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log(`\nDone. OK=${ok} Failed=${failed}`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});