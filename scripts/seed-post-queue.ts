#!/usr/bin/env npx tsx
/**
 * Social Scheduler — Seed Post Queue
 *
 * Seeds the LinkedIn post queue with the full post library.
 * Posts are staggered one per weekday starting tomorrow.
 *
 * Usage:
 *   npx tsx scripts/seed-post-queue.ts             # seed all 10 posts
 *   npx tsx scripts/seed-post-queue.ts --dry-run   # print without inserting
 *   npx tsx scripts/seed-post-queue.ts --slug captain-origin-story  # single post
 *
 * Required env vars:
 *   SUPABASE_URL + SUPABASE_SERVICE_KEY
 */

import dotenv from 'dotenv';
dotenv.config();

import { POST_LIBRARY, buildDrafts } from '../src/social-scheduler/post-library.js';
import { enqueueDraft } from '../src/social-scheduler/queue.js';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  // Parse --slug flag (supports "--slug=value" and "--slug value").
  const slugEqArg = args.find(a => a.startsWith('--slug='));
  let slugArg: string | null = null;

  if (slugEqArg) {
    const value = slugEqArg.split('=')[1];
    if (!value) {
      console.error('Error: --slug flag provided without a value.');
      console.error('Usage: npx tsx scripts/seed-post-queue.ts --slug <slug>');
      process.exit(1);
    }
    slugArg = value;
  } else if (args.includes('--slug')) {
    const slugIndex = args.indexOf('--slug');
    const nextArg = args[slugIndex + 1];

    if (!nextArg || nextArg.startsWith('--')) {
      console.error('Error: --slug flag provided without a value.');
      console.error('Usage: npx tsx scripts/seed-post-queue.ts --slug <slug>');
      process.exit(1);
    }

    slugArg = nextArg;
  }
  let posts = POST_LIBRARY;
  if (slugArg) {
    posts = POST_LIBRARY.filter(p => p.slug === slugArg);
    if (posts.length === 0) {
      console.error(`No post found with slug: ${slugArg}`);
      console.error('Available slugs:', POST_LIBRARY.map(p => p.slug).join(', '));
      process.exit(1);
    }
  }

  const drafts = buildDrafts(posts);

  console.log(`\n📋 LinkedIn Post Queue Seed`);
  console.log(`Posts: ${drafts.length}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN (no insert)' : 'INSERT to Supabase'}\n`);

  let inserted = 0;
  let failed = 0;

  for (const [i, draft] of drafts.entries()) {
    const post = posts[i];
    const scheduledDate = draft.scheduled_at
      ? new Date(draft.scheduled_at).toLocaleDateString('en-GB', {
          weekday: 'short', month: 'short', day: 'numeric',
        })
      : 'unscheduled';

    console.log(`[${i + 1}/${drafts.length}] ${post.title}`);
    console.log(`  Category: ${draft.category} | Scheduled: ${scheduledDate}`);
    console.log(`  Slug: ${post.slug}`);

    if (dryRun) {
      console.log(`  → DRY RUN: would insert`);
      console.log(`  Preview: ${draft.content.slice(0, 100).replace(/\n/g, ' ')}...`);
    } else {
      const id = await enqueueDraft(draft);
      if (id) {
        console.log(`  → Inserted: ${id}`);
        inserted++;
      } else {
        console.log(`  → FAILED (check SUPABASE_URL and SUPABASE_SERVICE_KEY)`);
        failed++;
      }
    }

    console.log();
  }

  if (!dryRun) {
    console.log(`\nDone. Inserted: ${inserted} | Failed: ${failed}`);
    if (failed > 0) process.exit(1);
  }
}

main().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
