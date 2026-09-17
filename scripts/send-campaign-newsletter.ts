#!/usr/bin/env npx tsx
/**
 * Weekly Campaign Newsletter Sender
 *
 * Collects this week's posts, generates a digest email, sends to subscribers.
 * Separate EN and FI editions.
 *
 * Usage:
 *   npx tsx scripts/send-campaign-newsletter.ts
 *
 * Required env vars:
 *   SMTP_* / AWS_SES_SMTP_* (Amazon SES email transport)
 *   SUPABASE_URL + SUPABASE_SERVICE_KEY (for subscriber list)
 */

import dotenv from 'dotenv';
dotenv.config();

import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sendEmail } from '../src/utils/send-email.js';
import { createClient } from '@supabase/supabase-js';

const CAMPAIGN_START = process.env.CAMPAIGN_START_DATE || '2026-03-16';
const BASE_URL = 'https://onelifetime.world/posts';

interface PostMeta {
  filename: string;
  title: string;
  description: string;
  category: string;
  dayNumber: string;
  date: string;
  lang: 'en' | 'fi';
  url: string;
}

function extractMeta(filepath: string, lang: 'en' | 'fi'): PostMeta | null {
  try {
    const html = readFileSync(filepath, 'utf-8');
    const titleMatch = html.match(/<title>(.*?)\s*—/);
    const descMatch = html.match(/<meta name="description" content="(.*?)"/);
    const categoryMatch = html.match(/<meta property="article:section" content="(.*?)"/);
    const dateMatch = html.match(/<meta property="article:published_time" content="(.*?)"/);
    const dayMatch = html.match(/Day (\d+)/i) || html.match(/Paiva (\d+)/i);
    const filename = filepath.split('/').pop() || '';

    return {
      filename,
      title: titleMatch?.[1] || filename,
      description: descMatch?.[1] || '',
      category: categoryMatch?.[1] || '',
      dayNumber: dayMatch?.[1] || '0',
      date: dateMatch?.[1] || '',
      lang,
      url: `${BASE_URL}/${lang}/${filename}`,
    };
  } catch {
    return null;
  }
}

function getWeekPosts(lang: 'en' | 'fi'): PostMeta[] {
  const dir = resolve(process.cwd(), `onelifetime.world/posts/${lang}`);
  const files = readdirSync(dir).filter(f => f.startsWith('day-') && f.endsWith('.html'));

  // Get posts from the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const posts: PostMeta[] = [];
  for (const file of files) {
    const meta = extractMeta(resolve(dir, file), lang);
    if (meta && meta.date) {
      const postDate = new Date(meta.date);
      if (postDate >= oneWeekAgo) {
        posts.push(meta);
      }
    }
  }

  // Sort by day number
  posts.sort((a, b) => parseInt(a.dayNumber) - parseInt(b.dayNumber));
  return posts;
}

function buildDigestHTML(posts: PostMeta[], lang: 'en' | 'fi'): string {
  const header = lang === 'fi'
    ? 'Lifetime Scope Journal — Viikkokatsaus'
    : 'Lifetime Scope Journal — Weekly Digest';
  const intro = lang === 'fi'
    ? 'Tässä viikon parhaat artikkelit EU-sääntelystä, tekoälystä ja teollisesta murroksesta.'
    : 'This week\'s best articles on EU compliance, AI agents, and industrial transformation.';
  const readMore = lang === 'fi' ? 'Lue lisää →' : 'Read more →';
  const footer = lang === 'fi'
    ? 'Saat tämän viestin koska olet tilannut Lifetime Scope Journal -uutiskirjeen.'
    : 'You received this email because you subscribed to Lifetime Scope Journal.';
  const unsub = lang === 'fi' ? 'Peruuta tilaus' : 'Unsubscribe';

  // Top 3 posts get full excerpts, rest get link + 1-line summary
  const featured = posts.slice(0, 3);
  const remaining = posts.slice(3);

  const featuredHTML = featured.map(p => `
    <tr><td style="padding: 16px 0; border-bottom: 1px solid #334155;">
      <span style="display: inline-block; padding: 2px 8px; background: rgba(212,168,67,0.15); color: #d4a843; border-radius: 4px; font-size: 11px; margin-bottom: 8px;">${p.category}</span>
      <span style="color: #64748b; font-size: 11px; margin-left: 8px;">Day ${p.dayNumber}</span>
      <h3 style="margin: 4px 0 8px; color: #e2e8f0; font-size: 18px;"><a href="${p.url}" style="color: #60a5fa; text-decoration: none;">${p.title}</a></h3>
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 8px;">${p.description}</p>
      <a href="${p.url}" style="color: #06b6d4; font-size: 13px; text-decoration: none;">${readMore}</a>
    </td></tr>
  `).join('');

  const remainingHTML = remaining.map(p => `
    <tr><td style="padding: 8px 0;">
      <a href="${p.url}" style="color: #60a5fa; text-decoration: none; font-size: 14px;">${p.title}</a>
      <span style="color: #64748b; font-size: 12px;"> — ${p.description.slice(0, 80)}...</span>
    </td></tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 0; background: #0f172a; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #1e293b;">
    <tr><td style="padding: 32px 24px; text-align: center; border-bottom: 1px solid #334155;">
      <h1 style="margin: 0; color: #e2e8f0; font-size: 22px;">${header}</h1>
      <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">${intro}</p>
    </td></tr>
    <tr><td style="padding: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${featuredHTML}
        ${remaining.length > 0 ? `
        <tr><td style="padding: 16px 0 8px;"><h4 style="color: #d4a843; margin: 0; font-size: 14px;">${lang === 'fi' ? 'Lisää tällä viikolla' : 'Also this week'}</h4></td></tr>
        ${remainingHTML}
        ` : ''}
      </table>
    </td></tr>
    <tr><td style="padding: 24px; text-align: center; border-top: 1px solid #334155;">
      <p style="color: #64748b; font-size: 12px; margin: 0 0 8px;">${footer}</p>
      <a href="https://dws10.com/contact" style="color: #64748b; font-size: 11px;">${unsub}</a>
      <p style="color: #475569; font-size: 11px; margin: 12px 0 0;">© 2026 Lifetime Oy · Helsinki, Finland</p>
    </td></tr>
  </table>
</body>
</html>`;
}

async function main(): Promise<void> {
  console.log('📧 Sending weekly campaign newsletter...\n');

  // Collect this week's posts
  const enPosts = getWeekPosts('en');
  const fiPosts = getWeekPosts('fi');

  console.log(`EN posts this week: ${enPosts.length}`);
  console.log(`FI posts this week: ${fiPosts.length}`);

  if (enPosts.length === 0 && fiPosts.length === 0) {
    console.log('No posts published this week. Skipping newsletter.');
    return;
  }

  // Get subscribers from Supabase
  let enSubscribers: string[] = ['risto@lifetime.fi']; // Default fallback
  let fiSubscribers: string[] = ['risto@lifetime.fi'];

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
      );

      const { data: subs } = await supabase
        .from('newsletter_subscribers')
        .select('email, lang')
        .eq('active', true);

      if (subs && subs.length > 0) {
        enSubscribers = subs.filter(s => s.lang === 'en').map(s => s.email);
        fiSubscribers = subs.filter(s => s.lang === 'fi').map(s => s.email);
        console.log(`Subscribers: ${enSubscribers.length} EN, ${fiSubscribers.length} FI`);
      }
    } catch (err) {
      console.warn('Supabase subscriber fetch failed, using fallback:', (err as Error).message);
    }
  }

  // Send EN edition
  if (enPosts.length > 0 && enSubscribers.length > 0) {
    const enHTML = buildDigestHTML(enPosts, 'en');
    for (const email of enSubscribers) {
      try {
        await sendEmail({
          to: email,
          from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
          subject: `Lifetime Scope Journal — Week of ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          html: enHTML,
          text: enPosts.map(p => `${p.title}: ${p.url}`).join('\n'),
        });
        console.log(`  ✅ EN sent to ${email}`);
      } catch (err) {
        console.error(`  ❌ EN failed for ${email}:`, (err as Error).message);
      }
    }
  }

  // Send FI edition
  if (fiPosts.length > 0 && fiSubscribers.length > 0) {
    const fiHTML = buildDigestHTML(fiPosts, 'fi');
    for (const email of fiSubscribers) {
      try {
        await sendEmail({
          to: email,
          from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
          subject: `Lifetime Scope Journal — Viikko ${new Date().toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric' })}`,
          html: fiHTML,
          text: fiPosts.map(p => `${p.title}: ${p.url}`).join('\n'),
        });
        console.log(`  ✅ FI sent to ${email}`);
      } catch (err) {
        console.error(`  ❌ FI failed for ${email}:`, (err as Error).message);
      }
    }
  }

  console.log('\n✅ Newsletter complete');
}

main().catch(console.error);
