/**
 * Firehorse ContentMS — Artifact Publisher (Blog & Legal)
 *
 * Publishes ContentMS items as site artifacts:
 *   - Blog posts → onelifetime.world/posts/ (+ landing-pages sync)
 *   - Legal docs → onelifetime.world/legal/ or terms/ (+ landing-pages sync)
 *
 * Follows the Dual Folder Structure Rule: root folder first, then landing-pages.
 * All output is HTML (never .md to public sites per CLAUDE.md rules).
 *
 * Code-Version: 3.0.0
 * Introduced-In: PR-TBD (ContentMS V3 — Memory + HIL + Artifacts)
 * Branch: claude/build-contentms-mvp-Q2nU9
 * Date: 2026-03-23
 * Owner: Claude Code (Opus 4.6)
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import logger from '../utils/logger.js';
import {
  type ArtifactPublishRequest,
  type ArtifactPublishResult,
  ArtifactType,
  AuditAction,
  type ContentItem,
  ContentLanguage,
  ContentStatus,
  ContentType,
} from './types.js';
import { renderMarkdownToHtml } from './blog-publisher.js';
import { recordAudit } from './audit.js';

// ============================================================================
// PATHS — Dual folder structure (root = source of truth, landing = production)
// ============================================================================

function getRepoRoot(): string {
  return process.env.DWS_REPO_ROOT || process.cwd();
}

function getBlogPaths(slug: string, lang: string): { source: string; landing: string } {
  const root = getRepoRoot();
  const subdir = lang === 'fi' ? 'fi' : 'en';
  return {
    source: join(root, 'onelifetime.world', 'posts', subdir, `${slug}.html`),
    landing: join(root, 'landing-pages', 'onelifetime-world', 'posts', subdir, `${slug}.html`),
  };
}

function getLegalPaths(slug: string): { source: string; landing: string } {
  const root = getRepoRoot();
  return {
    source: join(root, 'onelifetime.world', 'legal', `${slug}.html`),
    landing: join(root, 'landing-pages', 'onelifetime-world', 'legal', `${slug}.html`),
  };
}

// ============================================================================
// HTML RENDERING — Blog Post (follows _template-en.html pattern)
// ============================================================================

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderBlogPostHtml(item: ContentItem): string {
  const dateISO = item.published_at || item.created_at;
  const dateDisplay = new Date(dateISO).toLocaleDateString(
    item.language === ContentLanguage.FI ? 'fi-FI' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );
  const lang = item.language === ContentLanguage.FI ? 'fi' : 'en';
  const bodyHtml = item.body_html || renderMarkdownToHtml(item.body_markdown);
  const tags = [
    ...(item.regulation_tags || []),
    ...(item.custom_tags || []),
  ];
  const tagBadges = tags
    .map((t) => `<span class="inline-block px-2 py-0.5 text-xs rounded" style="background: rgba(96,165,250,0.15); color: #60a5fa;">${escapeHtml(t)}</span>`)
    .join(' ');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(item.title)} — Lifetime Scope Journal</title>
    <meta name="description" content="${escapeHtml(item.excerpt || item.title)}">
    <meta name="author" content="${escapeHtml(item.author)}">
    <meta name="date" content="${dateISO}">
    <meta property="og:title" content="${escapeHtml(item.title)}">
    <meta property="og:description" content="${escapeHtml(item.excerpt || item.title)}">
    <meta property="og:type" content="article">
    <meta property="og:locale" content="${lang === 'fi' ? 'fi_FI' : 'en_US'}">
    <meta property="og:url" content="https://onelifetime.world/posts/${lang}/${item.slug}.html">
    <meta property="og:site_name" content="Lifetime Scope Journal">
    <meta property="article:published_time" content="${dateISO}">
    <meta property="article:author" content="${escapeHtml(item.author)}">
    <meta property="article:section" content="${escapeHtml(item.category)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(item.title)}">
    <meta name="twitter:description" content="${escapeHtml(item.excerpt || item.title)}">
    <link rel="canonical" href="https://onelifetime.world/posts/${lang}/${item.slug}.html">
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${escapeHtml(item.title)}",
        "description": "${escapeHtml(item.excerpt || item.title)}",
        "author": { "@type": "Person", "name": "${escapeHtml(item.author)}" },
        "publisher": { "@type": "Organization", "name": "Lifetime Oy", "url": "https://dws10.com" },
        "datePublished": "${dateISO}",
        "inLanguage": "${lang}"
    }
    </script>
    <style>
        .prose h2 { color: #60a5fa; font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; }
        .prose h3 { color: #93c5fd; font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .prose p { margin-bottom: 1rem; line-height: 1.75; }
        .prose ul { padding-left: 1.5rem; margin-bottom: 1rem; }
        .prose li { margin-bottom: 0.5rem; }
        .prose a { color: #60a5fa; text-decoration: underline; }
        .prose pre { background: #1e293b; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 1rem 0; }
        .prose code { font-size: 0.875rem; }
    </style>
</head>
<body class="font-sans antialiased flex flex-col min-h-screen" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%); color: #f1f5f9;">
    <script>
        function toggleMobileMenu() {
            var menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }
    </script>

    <nav style="background: #1e293b; box-shadow: 0 1px 3px rgba(0,0,0,0.3);" class="sticky top-0 z-50 border-b border-gray-700">
        <div class="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto w-full">
            <button onclick="toggleMobileMenu()" class="flex flex-col gap-1.5" aria-label="Menu">
                <span class="w-6 h-0.5 bg-gray-400 block"></span>
                <span class="w-6 h-0.5 bg-gray-400 block"></span>
                <span class="w-6 h-0.5 bg-gray-400 block"></span>
            </button>
            <a href="/" class="flex items-center">
                <span class="text-lg font-bold" style="color: #e2e8f0;">OneLifetime</span>
            </a>
            <a href="https://dws10.com/buy" class="text-xs font-bold px-3 py-1 rounded" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #0f172a;">
                Store
            </a>
        </div>
        <div id="mobileMenu" class="hidden bg-slate-800 border-t border-gray-700 px-4 py-3 space-y-2">
            <a href="/blog/" class="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">Blog</a>
            <a href="https://dws10.com" target="_blank" class="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">DWS IQ Platform</a>
            <a href="https://dws10.com/buy" target="_blank" class="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">Store</a>
        </div>
    </nav>

    <main class="flex-1">
        <article class="max-w-3xl mx-auto px-4 py-12">
            <div class="flex items-center gap-3 mb-6">
                <span class="inline-block px-3 py-1 text-xs font-bold rounded" style="background: rgba(212, 168, 67, 0.15); color: #d4a843; border: 1px solid rgba(212, 168, 67, 0.25);">
                    ${escapeHtml(item.category)}
                </span>
            </div>

            <h1 class="text-3xl md:text-4xl font-bold mb-4" style="color: #e2e8f0;">${escapeHtml(item.title)}</h1>

            <div class="flex items-center gap-4 mb-4 text-sm text-gray-400">
                <span>${dateDisplay}</span>
                <span>&middot;</span>
                <span>${escapeHtml(item.author)}</span>
                <span>&middot;</span>
                <span>Lifetime Oy</span>
            </div>

            ${tagBadges ? `<div class="flex flex-wrap gap-2 mb-8">${tagBadges}</div>` : ''}

            <div class="w-16 h-0.5 mb-8" style="background: linear-gradient(90deg, #06b6d4, #2563eb);"></div>

            <div class="prose max-w-none" style="color: #cbd5e1;">
                ${bodyHtml}
            </div>
        </article>
    </main>

    <footer class="border-t border-gray-700 py-8 text-center text-xs text-gray-500" style="background: #0f172a;">
        <p>&copy; 2026 Lifetime Oy &middot; VAT FI07724079 &middot; Helsinki, Finland</p>
        <p class="mt-1">
            <a href="https://dws10.com" class="text-blue-400 hover:underline">DWS IQ Platform</a> &middot;
            <a href="https://dws10.com/buy" class="text-blue-400 hover:underline">Store</a> &middot;
            <a href="/blog/" class="text-blue-400 hover:underline">Blog</a>
        </p>
    </footer>
</body>
</html>`;
}

// ============================================================================
// HTML RENDERING — Legal Document
// ============================================================================

function renderLegalHtml(item: ContentItem): string {
  const dateISO = item.published_at || item.updated_at;
  const dateDisplay = new Date(dateISO).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const bodyHtml = item.body_html || renderMarkdownToHtml(item.body_markdown);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(item.title)} — Lifetime Oy</title>
    <meta name="description" content="${escapeHtml(item.excerpt || item.title)}">
    <meta property="og:title" content="${escapeHtml(item.title)}">
    <meta property="og:type" content="website">
    <link rel="canonical" href="https://onelifetime.world/legal/${item.slug}.html">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .legal-content h2 { color: #93c5fd; font-size: 1.5rem; font-weight: bold; margin-top: 2rem; margin-bottom: 0.75rem; }
        .legal-content h3 { color: #60a5fa; font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .legal-content p { margin-bottom: 1rem; line-height: 1.75; }
        .legal-content ul { padding-left: 1.5rem; margin-bottom: 1rem; }
        .legal-content li { margin-bottom: 0.5rem; }
        .legal-content a { color: #60a5fa; text-decoration: underline; }
    </style>
</head>
<body class="font-sans antialiased flex flex-col min-h-screen" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%); color: #f1f5f9;">
    <nav style="background: #1e293b;" class="sticky top-0 z-50 border-b border-gray-700">
        <div class="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
            <a href="/" class="text-lg font-bold" style="color: #e2e8f0;">OneLifetime</a>
            <a href="/legal/" class="text-sm text-gray-400 hover:text-gray-200">Legal</a>
        </div>
    </nav>

    <main class="flex-1">
        <article class="max-w-3xl mx-auto px-4 py-12">
            <div class="mb-8 pb-4 border-b border-gray-700">
                <span class="inline-block px-3 py-1 text-xs font-bold rounded mb-3" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.25);">
                    Legal Document
                </span>
                <h1 class="text-3xl font-bold mb-2" style="color: #e2e8f0;">${escapeHtml(item.title)}</h1>
                <p class="text-sm text-gray-400">Last updated: ${dateDisplay} &middot; Lifetime Oy &middot; Y-tunnus: 0772407-9</p>
            </div>

            <div class="legal-content" style="color: #cbd5e1;">
                ${bodyHtml}
            </div>

            <div class="mt-12 pt-4 border-t border-gray-700 text-sm text-gray-500">
                <p>Lifetime Oy &middot; Laidunmaanraitti 2 A 25, 02330 Espoo, Finland</p>
                <p>VAT: FI07724079 &middot; Contact: risto.paarni@lifetime.fi</p>
            </div>
        </article>
    </main>

    <footer class="border-t border-gray-700 py-6 text-center text-xs text-gray-500" style="background: #0f172a;">
        <p>&copy; 2026 Lifetime Oy &middot; <a href="/legal/" class="text-blue-400 hover:underline">Legal</a> &middot; <a href="/privacy-policy/" class="text-blue-400 hover:underline">Privacy</a></p>
    </footer>
</body>
</html>`;
}

// ============================================================================
// PUBLISH ARTIFACT — Write HTML to both root + landing-pages
// ============================================================================

async function writeArtifact(sourcePath: string, landingPath: string, html: string): Promise<void> {
  // Ensure directories exist
  const sourceDir = dirname(sourcePath);
  const landingDir = dirname(landingPath);

  if (!existsSync(sourceDir)) {
    await mkdir(sourceDir, { recursive: true });
  }
  if (!existsSync(landingDir)) {
    await mkdir(landingDir, { recursive: true });
  }

  // Write to both locations (Dual Folder Structure Rule)
  await writeFile(sourcePath, html, 'utf-8');
  await writeFile(landingPath, html, 'utf-8');

  logger.info('Artifact written', { source: sourcePath, landing: landingPath });
}

/**
 * Publish a content item as a site artifact (blog post or legal document).
 *
 * Requirements:
 *   - Content must be type Blog or Legal
 *   - Content must be Approved or Published status
 *   - HIL approval is checked (caller should verify via audit.isHilApproved)
 *   - Writes to root folder + landing-pages (Dual Folder Rule)
 */
export async function publishArtifact(
  item: ContentItem,
  request: ArtifactPublishRequest,
): Promise<ArtifactPublishResult> {
  const now = new Date().toISOString();

  // Validate content type matches artifact type
  if (request.artifact_type === ArtifactType.BlogPost && item.type !== ContentType.Blog) {
    return {
      content_id: item.id,
      artifact_type: request.artifact_type,
      success: false,
      error: `Content type must be 'blog' for blog post artifacts (got: ${item.type})`,
      published_at: now,
    };
  }

  if (request.artifact_type === ArtifactType.LegalDocument && item.type !== ContentType.Legal) {
    return {
      content_id: item.id,
      artifact_type: request.artifact_type,
      success: false,
      error: `Content type must be 'legal' for legal document artifacts (got: ${item.type})`,
      published_at: now,
    };
  }

  // Must be approved or published
  if (item.status !== ContentStatus.Approved && item.status !== ContentStatus.Published) {
    return {
      content_id: item.id,
      artifact_type: request.artifact_type,
      success: false,
      error: `Content must be approved before publishing as artifact (status: ${item.status})`,
      published_at: now,
    };
  }

  try {
    let sourcePath: string;
    let landingPath: string;
    let html: string;

    if (request.artifact_type === ArtifactType.BlogPost) {
      const lang = item.language === ContentLanguage.FI ? 'fi' : 'en';
      const paths = getBlogPaths(item.slug, lang);
      sourcePath = paths.source;
      landingPath = paths.landing;
      html = renderBlogPostHtml(item);
    } else {
      const paths = getLegalPaths(item.slug);
      sourcePath = paths.source;
      landingPath = paths.landing;
      html = renderLegalHtml(item);
    }

    await writeArtifact(sourcePath, landingPath, html);

    // Record audit trail
    recordAudit({
      content_id: item.id,
      action: AuditAction.ArtifactPublished,
      actor_id: request.publisher_id,
      actor_name: request.publisher_name,
      details: `Published ${request.artifact_type} to ${sourcePath}`,
      artifact_path: sourcePath,
    });

    logger.info('Artifact published', {
      content_id: item.id,
      type: request.artifact_type,
      source: sourcePath,
      landing: landingPath,
    });

    return {
      content_id: item.id,
      artifact_type: request.artifact_type,
      success: true,
      source_path: sourcePath,
      landing_path: landingPath,
      published_at: now,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('Artifact publish failed', { content_id: item.id, error: msg });
    return {
      content_id: item.id,
      artifact_type: request.artifact_type,
      success: false,
      error: msg,
      published_at: now,
    };
  }
}
