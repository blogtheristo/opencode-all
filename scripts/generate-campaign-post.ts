#!/usr/bin/env npx tsx
/**
 * Autonomous Campaign Post Generator
 *
 * Generates 1 bilingual blog post (EN + FI) for the 800-day campaign.
 * Designed for GitHub Actions cron, manual execution, or batch runs.
 *
 * Usage:
 *   npx tsx scripts/generate-campaign-post.ts                    # auto-detect today's day
 *   npx tsx scripts/generate-campaign-post.ts --day 42           # specific day
 *   npx tsx scripts/generate-campaign-post.ts --batch 22 42      # batch: days 22-42
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY
 *
 * Optional env vars:
 *   CAMPAIGN_START_DATE (default: 2026-03-16)
 *   SKIP_GIT_MINE (default: false — set true to skip git log mining)
 */

import Anthropic from '@anthropic-ai/sdk';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

// ─── Campaign Config ───────────────────────────────────────────────
const CAMPAIGN_START = process.env.CAMPAIGN_START_DATE || '2026-03-16';
const TOTAL_DAYS = 800;

const PILLARS = [
  { id: 1, name: 'ERP Integration', nameFi: 'ERP-integraatio', layer: 'Core', keywords: 'erp|sap|visma|ifs|monitor|dynamics|jeeves', cta: 'dws10.com/contact', ctaFi: 'dws10.com/contact' },
  { id: 2, name: 'Compliance Automation', nameFi: 'Vaatimustenmukaisuuden automaatio', layer: 'Core', keywords: 'compliance|csrd|epbd|ets|cbam|fit.for.55', cta: 'dws10.com/buy', ctaFi: 'dws10.com/buy' },
  { id: 3, name: 'Legal & Governance', nameFi: 'Laki ja hallinto', layer: 'Core', keywords: 'legal|governance|kya|rls|security|gdpr|cloud.act|d&o', cta: 'dws10.com/products/sovereignty-cloud-consulting.html', ctaFi: 'dws10.com/products/sovereignty-cloud-consulting.html' },
  { id: 4, name: 'Business News', nameFi: 'Yritysmaailman uutiset', layer: 'News', keywords: 'visma|m&a|acquisition|funding|market|investor|revenue', cta: 'dws10.com/products/expert-advisory.html', ctaFi: 'dws10.com/products/expert-advisory.html' },
  { id: 5, name: 'AI News', nameFi: 'Tekoälyuutiset', layer: 'News', keywords: 'mcp|agent|swarm|orchestr|claude|llm|model|ai.act', cta: 'dws10.com/products/dwsiq.html', ctaFi: 'dws10.com/products/dwsiq.html' },
  { id: 6, name: 'Industry News', nameFi: 'Toimialauutiset', layer: 'News', keywords: 'construction|logistics|healthcare|manufacturing|steel|cement|carbon', cta: 'dws10.com/construction', ctaFi: 'dws10.com/construction' },
  { id: 7, name: 'KYA / Agent Architecture', nameFi: 'KYA / Agenttiarkkitehtuuri', layer: 'Core', keywords: 'mcp|kya|agent|pgvector|edge|firehorse|sovereign', cta: 'dws10.com/products/bundle.html', ctaFi: 'dws10.com/products/bundle.html' },
  { id: 8, name: 'Brain News (DWS IQ Platform)', nameFi: 'Aivot-uutiset (DWS IQ -alusta)', layer: 'Product', keywords: 'dashboard|platform|dws.iq|training|agent.swarm', cta: 'dws10.com/products/dwsiq.html', ctaFi: 'dws10.com/products/dwsiq.html' },
  { id: 9, name: 'Body News (Firehorse Suite)', nameFi: 'Keho-uutiset (Firehorse-sarja)', layer: 'Product', keywords: 'firehorse|report|automation|omnichannel|content.dms', cta: 'dws10.com/buy', ctaFi: 'dws10.com/buy' },
  { id: 10, name: 'Hands News (Fleet & Edge AI)', nameFi: 'Kädet-uutiset (Laivasto & Edge AI)', layer: 'Product', keywords: 'edge|jetson|nvidia|iot|fleet|acer|veriton|robot', cta: 'dws10.com/products/edge-node.html', ctaFi: 'dws10.com/products/edge-node.html' },
];

// ─── Helpers ───────────────────────────────────────────────────────

function getCampaignDay(): number {
  const start = new Date(CAMPAIGN_START);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1); // Day 1 = start date
}

function getPillar(day: number) {
  const idx = ((day - 1) % 10); // 0-indexed into PILLARS array
  return PILLARS[idx];
}

function getPhase(day: number): string {
  if (day <= 100) return 'Phase 1 — Foundation';
  if (day <= 300) return 'Phase 2 — Depth';
  if (day <= 500) return 'Phase 3 — Engagement';
  return 'Phase 4 — Authority';
}

function getDateForDay(day: number): Date {
  const start = new Date(CAMPAIGN_START);
  start.setDate(start.getDate() + (day - 1));
  return start;
}

function padDay(day: number): string {
  return String(day).padStart(3, '0');
}

function mineGitCommits(keywords: string, limit = 15): string {
  if (process.env.SKIP_GIT_MINE === 'true') return '(git mining skipped)';
  try {
    const log = execFileSync('git', ['log', '--oneline', '--all', '--since=2024-01-01'], {
      encoding: 'utf-8',
      timeout: 10000,
    });
    const keywordRegex = new RegExp(keywords, 'i');
    const matches = log
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .filter(line => keywordRegex.test(line))
      .slice(0, limit);
    return matches.join('\n') || '(no matching commits found)';
  } catch {
    return '(git mining unavailable)';
  }
}

function minePRs(keywords: string, limit = 10): string {
  if (process.env.SKIP_GIT_MINE === 'true') return '(PR mining skipped)';
  try {
    const log = execFileSync('git', ['log', '--merges', '--oneline', '--all', '--since=2024-01-01'], {
      encoding: 'utf-8',
      timeout: 10000,
    });
    const keywordRegex = new RegExp(keywords, 'i');
    const matches = log
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .filter(line => keywordRegex.test(line))
      .slice(0, limit);
    return matches.join('\n') || '(no matching PRs found)';
  } catch {
    return '(PR mining unavailable)';
  }
}

function listExistingPosts(lang: 'en' | 'fi'): string[] {
  const dir = resolve(process.cwd(), `onelifetime.world/posts/${lang}`);
  if (!existsSync(dir)) return [];
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter(entry => entry.isFile())
      .map(entry => entry.name);
  } catch {
    return [];
  }
}

// ─── Ontology Tags HTML ────────────────────────────────────────────

function buildOntologyTags(activePillarId: number, lang: 'en' | 'fi'): string {
  const header = lang === 'fi' ? 'Ontologia — 10 sisältöpilaria' : 'Ontology — 10 Content Pillars';
  const tags = PILLARS.map(p => {
    const name = lang === 'fi' ? p.nameFi : p.name;
    const isActive = p.id === activePillarId;
    const style = isActive
      ? 'background: rgba(212, 168, 67, 0.2); color: #d4a843; border: 1px solid rgba(212, 168, 67, 0.4); font-weight: bold;'
      : 'background: rgba(30, 41, 59, 0.6); color: #94a3b8; border: 1px solid rgba(71, 85, 105, 0.3);';
    return `<span class="inline-block px-3 py-1 rounded-full text-xs" style="${style}">${p.id}. ${name}</span>`;
  }).join('\n                    ');

  return `
            <!-- Ontology Tags -->
            <div class="mt-12 pt-8 border-t border-gray-700">
                <p class="text-xs text-gray-500 mb-3">${header}</p>
                <div class="flex flex-wrap gap-2">
                    ${tags}
                </div>
            </div>`;
}

// ─── Like + Feedback HTML ──────────────────────────────────────────

function buildLikeFeedback(day: number, lang: 'en' | 'fi'): string {
  const likeLabel = lang === 'fi' ? 'Hyödyllinen artikkeli' : 'Useful article';
  const likedLabel = lang === 'fi' ? 'Kiitos palautteesta!' : 'Thanks for the feedback!';
  const feedbackHeader = lang === 'fi' ? 'Anna palautetta' : 'Give Feedback';
  const buttons = lang === 'fi'
    ? [
        { label: 'Samaa mieltä', subject: `Samaa mieltä — Day ${padDay(day)}` },
        { label: 'Eri mieltä', subject: `Eri mieltä — Day ${padDay(day)}` },
        { label: 'Tarvitsen lisää dataa', subject: `Lisää dataa — Day ${padDay(day)}` },
      ]
    : [
        { label: 'Agree', subject: `Agree — Day ${padDay(day)}` },
        { label: 'Disagree', subject: `Disagree — Day ${padDay(day)}` },
        { label: 'Need more data', subject: `Need more data — Day ${padDay(day)}` },
      ];

  const feedbackBtns = buttons.map(b =>
    `<a href="https://dws10.com/contact/?subject=${encodeURIComponent(b.subject)}" class="px-4 py-2 rounded text-xs font-medium" style="background: rgba(30, 41, 59, 0.8); color: #94a3b8; border: 1px solid rgba(71, 85, 105, 0.4);">${b.label}</a>`
  ).join('\n                    ');

  return `
            <!-- Like + Feedback -->
            <div class="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button onclick="toggleLike(this, 'day-${padDay(day)}')" class="like-btn px-4 py-2 rounded text-sm font-medium transition-all" style="background: rgba(30, 41, 59, 0.8); color: #94a3b8; border: 1px solid rgba(71, 85, 105, 0.4);" data-liked="false">
                    👍 ${likeLabel}
                </button>
                <div class="flex flex-wrap gap-2">
                    <span class="text-xs text-gray-500 mr-1">${feedbackHeader}:</span>
                    ${feedbackBtns}
                </div>
            </div>
            <script>
            function toggleLike(btn, key) {
                var liked = localStorage.getItem('like-' + key);
                if (liked) { localStorage.removeItem('like-' + key); btn.style.borderColor = 'rgba(71,85,105,0.4)'; btn.style.color = '#94a3b8'; }
                else { localStorage.setItem('like-' + key, '1'); btn.style.borderColor = '#d4a843'; btn.style.color = '#d4a843'; }
            }
            (function() {
                var btns = document.querySelectorAll('.like-btn');
                btns.forEach(function(btn) {
                    var key = btn.getAttribute('onclick').match(/'(day-\\d+)'/);
                    if (key && localStorage.getItem('like-' + key[1])) { btn.style.borderColor = '#d4a843'; btn.style.color = '#d4a843'; }
                });
            })();
            </script>`;
}

// ─── Main Generator ────────────────────────────────────────────────

async function generatePost(day: number): Promise<void> {
  const pillar = getPillar(day);
  const phase = getPhase(day);
  const date = getDateForDay(day);
  const dateISO = date.toISOString().split('T')[0];
  const dateDisplay = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const dateFiDisplay = date.toLocaleDateString('fi-FI', { year: 'numeric', month: 'long', day: 'numeric' });

  // Mine git data for this pillar
  const commits = mineGitCommits(pillar.keywords);
  const prs = minePRs(pillar.keywords);
  const existingEN = listExistingPosts('en');
  const existingFI = listExistingPosts('fi');

  console.log(`\n📝 Day ${padDay(day)} | ${pillar.name} | ${phase}`);
  console.log(`   Git commits: ${commits.split('\n').length} matches`);
  console.log(`   PRs: ${prs.split('\n').length} matches`);

  const client = new Anthropic();

  // Generate EN post
  const enPrompt = buildPrompt('en', day, pillar, phase, dateISO, commits, prs, existingEN);
  const enResponse = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{ role: 'user', content: enPrompt }],
  });

  const enContent = (enResponse.content[0] as { type: string; text: string }).text;
  const enParsed = parseGeneratedPost(enContent);

  // Generate FI post
  const fiPrompt = buildPrompt('fi', day, pillar, phase, dateISO, commits, prs, existingFI);
  const fiResponse = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{ role: 'user', content: fiPrompt }],
  });

  const fiContent = (fiResponse.content[0] as { type: string; text: string }).text;
  const fiParsed = parseGeneratedPost(fiContent);

  // Build full HTML from templates
  const enSlug = `day-${padDay(day)}-${enParsed.slug}`;
  const fiSlug = `day-${padDay(day)}-${fiParsed.slug}`;
  const enFilename = `${enSlug}.html`;
  const fiFilename = `${fiSlug}.html`;

  const enHTML = buildHTML('en', {
    title: enParsed.title,
    description: enParsed.description,
    category: pillar.name,
    dayNumber: padDay(day),
    dateISO,
    dateDisplay,
    filename: enFilename,
    altFilename: fiFilename,
    content: enParsed.body,
    pillarId: pillar.id,
    day,
  });

  const fiHTML = buildHTML('fi', {
    title: fiParsed.title,
    description: fiParsed.description,
    category: pillar.nameFi,
    dayNumber: padDay(day),
    dateISO,
    dateDisplay: dateFiDisplay,
    filename: fiFilename,
    altFilename: enFilename,
    content: fiParsed.body,
    pillarId: pillar.id,
    day,
  });

  // Write files
  const baseDir = resolve(process.cwd(), 'onelifetime.world/posts');
  const lpDir = resolve(process.cwd(), 'landing-pages/onelifetime-world/posts');

  for (const dir of [`${baseDir}/en`, `${baseDir}/fi`, `${lpDir}/en`, `${lpDir}/fi`]) {
    mkdirSync(dir, { recursive: true });
  }

  const enPath = resolve(baseDir, 'en', enFilename);
  const fiPath = resolve(baseDir, 'fi', fiFilename);
  writeFileSync(enPath, enHTML, 'utf-8');
  writeFileSync(fiPath, fiHTML, 'utf-8');

  // Sync to landing-pages
  copyFileSync(enPath, resolve(lpDir, 'en', enFilename));
  copyFileSync(fiPath, resolve(lpDir, 'fi', fiFilename));

  console.log(`   ✅ EN: ${enFilename}`);
  console.log(`   ✅ FI: ${fiFilename}`);
}

// ─── Prompt Builder ────────────────────────────────────────────────

function buildPrompt(
  lang: 'en' | 'fi',
  day: number,
  pillar: typeof PILLARS[0],
  phase: string,
  dateISO: string,
  commits: string,
  prs: string,
  existingPosts: string[]
): string {
  const langLabel = lang === 'en' ? 'English' : 'Finnish';
  const pillarName = lang === 'en' ? pillar.name : pillar.nameFi;
  const recentPosts = existingPosts.slice(-5).join(', ');

  return `You are a senior technical writer for Lifetime Oy (DWS IQ Platform).
Write a blog post in ${langLabel} for the 800-day campaign.

REQUIREMENTS:
- Day: ${day} / ${TOTAL_DAYS}
- Pillar: ${pillarName} (${pillar.layer} layer)
- Phase: ${phase}
- Date: ${dateISO}
- Minimum 1,500 words, target 2,000+
- New York Times depth — no filler
- Include at least 1 Oxford notation citation with a real, verifiable URL
- Include cross-links to DWS products (https://${pillar.cta})
- Honest competition: acknowledge good competitor solutions where relevant
- "What this means for your business" section
- End with specific, actionable next step

GIT COMMIT DATA (real engineering decisions — use as content seeds):
${commits}

PR MERGE DATA:
${prs}

RECENT POSTS (avoid topic overlap):
${recentPosts}

${lang === 'fi' ? 'Write ENTIRELY in Finnish. Use Finnish technical terminology.' : ''}

RESPONSE FORMAT (CRITICAL — follow exactly):
---TITLE---
[Post title here]
---SLUG---
[url-slug-no-spaces-lowercase]
---DESCRIPTION---
[1-2 sentence meta description for SEO]
---BODY---
[Full HTML body content — use <h2>, <h3>, <p>, <ul>, <li>, <blockquote>, <sup>, <a> tags]
[Include Oxford citation at end: <footer class="mt-8 pt-4 border-t border-gray-700"><h4>References</h4><ol class="text-xs text-gray-500"><li>...</li></ol></footer>]
---END---`;
}

// ─── Parse Response ────────────────────────────────────────────────

interface ParsedPost {
  title: string;
  slug: string;
  description: string;
  body: string;
}

function parseGeneratedPost(text: string): ParsedPost {
  const titleMatch = text.match(/---TITLE---\s*([\s\S]*?)---SLUG---/);
  const slugMatch = text.match(/---SLUG---\s*([\s\S]*?)---DESCRIPTION---/);
  const descMatch = text.match(/---DESCRIPTION---\s*([\s\S]*?)---BODY---/);
  const bodyMatch = text.match(/---BODY---\s*([\s\S]*?)---END---/);

  return {
    title: titleMatch?.[1]?.trim() || 'Untitled Post',
    slug: (slugMatch?.[1]?.trim() || 'untitled').replace(/[^a-z0-9-]/g, '').slice(0, 60),
    description: descMatch?.[1]?.trim() || '',
    body: bodyMatch?.[1]?.trim() || '<p>Content generation failed.</p>',
  };
}

// ─── HTML Builder ──────────────────────────────────────────────────

interface HTMLParams {
  title: string;
  description: string;
  category: string;
  dayNumber: string;
  dateISO: string;
  dateDisplay: string;
  filename: string;
  altFilename: string;
  content: string;
  pillarId: number;
  day: number;
}

function buildHTML(lang: 'en' | 'fi', params: HTMLParams): string {
  const templatePath = resolve(process.cwd(), `onelifetime.world/posts/_template-${lang}.html`);
  let html = readFileSync(templatePath, 'utf-8');

  // Replace template placeholders
  html = html.replace(/\{\{TITLE\}\}/g, params.title);
  html = html.replace(/\{\{DESCRIPTION\}\}/g, params.description);
  html = html.replace(/\{\{CATEGORY\}\}/g, params.category);
  html = html.replace(/\{\{DAY_NUMBER\}\}/g, params.dayNumber);
  html = html.replace(/\{\{DATE_ISO\}\}/g, params.dateISO);
  html = html.replace(/\{\{DATE_DISPLAY\}\}/g, params.dateDisplay);
  html = html.replace(/\{\{FILENAME\}\}/g, params.filename);
  html = html.replace(/\{\{FI_FILENAME\}\}/g, params.altFilename);
  html = html.replace(/\{\{EN_FILENAME\}\}/g, params.altFilename);
  html = html.replace(/\{\{CONTENT\}\}/g, params.content);

  // Inject ontology tags + like/feedback before </article>
  const ontologyHTML = buildOntologyTags(params.pillarId, lang);
  const likeFeedbackHTML = buildLikeFeedback(params.day, lang);
  html = html.replace('</article>', `${likeFeedbackHTML}\n${ontologyHTML}\n        </article>`);

  // Replace related posts placeholder with auto-generated links
  const relatedHTML = buildRelatedPosts(params.day, lang);
  html = html.replace('{{RELATED_POSTS}}', relatedHTML);

  return html;
}

function buildRelatedPosts(day: number, lang: 'en' | 'fi'): string {
  // Link to adjacent pillar posts
  const related: number[] = [];
  if (day > 10) related.push(day - 10); // Same pillar, previous cycle
  if (day > 1) related.push(day - 1);   // Previous day
  if (day < TOTAL_DAYS) related.push(day + 1); // Next day
  if (day + 10 <= TOTAL_DAYS) related.push(day + 10); // Same pillar, next cycle

  return related.slice(0, 4).map(d => {
    const p = getPillar(d);
    const name = lang === 'fi' ? p.nameFi : p.name;
    const prefix = lang === 'fi' ? 'Päivä' : 'Day';
    return `<a href="#" class="pillar-card p-4 rounded-lg block">
                        <span class="text-xs text-gray-500">${prefix} ${padDay(d)} · ${name}</span>
                    </a>`;
  }).join('\n                    ');
}

// ─── CLI Entry Point ───────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set');
    process.exit(1);
  }

  let days: number[] = [];

  if (args.includes('--batch')) {
    const batchIdx = args.indexOf('--batch');
    const start = parseInt(args[batchIdx + 1], 10);
    const end = parseInt(args[batchIdx + 2], 10);
    if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > TOTAL_DAYS) {
      console.error(`❌ Invalid batch range: ${start}-${end}`);
      process.exit(1);
    }
    for (let d = start; d <= end; d++) days.push(d);
  } else if (args.includes('--day')) {
    const dayIdx = args.indexOf('--day');
    const d = parseInt(args[dayIdx + 1], 10);
    if (isNaN(d) || d < 1 || d > TOTAL_DAYS) {
      console.error(`❌ Invalid day: ${d}`);
      process.exit(1);
    }
    days = [d];
  } else {
    days = [getCampaignDay()];
  }

  console.log(`🚀 Generating ${days.length} post(s) for days: ${days[0]}${days.length > 1 ? `-${days[days.length - 1]}` : ''}`);
  console.log(`   Campaign start: ${CAMPAIGN_START}`);
  console.log(`   Using model: claude-sonnet-4-6\n`);

  for (const day of days) {
    try {
      await generatePost(day);
    } catch (err) {
      console.error(`❌ Day ${padDay(day)} failed:`, (err as Error).message);
    }
  }

  console.log(`\n✅ Done. Generated ${days.length * 2} files (${days.length} EN + ${days.length} FI)`);
}

main().catch(console.error);
