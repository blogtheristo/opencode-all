/**
 * Firehorse ContentMS — Learning Article Publisher
 *
 * Renders learning/blog content to HTML for the customer's internal portal.
 * Customers create knowledge articles for their team — onboarding,
 * compliance training, sustainability guides, safety procedures.
 *
 * Note: File kept as blog-publisher.ts for import compatibility.
 *
 * Code-Version: 2.0.0
 * Introduced-In: PR-TBD (ContentMS V1 — Customer-Facing)
 * Branch: claude/build-contentms-mvp-Q2nU9
 * Date: 2026-03-22
 * Owner: Claude Code (Opus 4.6)
 */

import logger from '../utils/logger.js';
import {
  type ContentItem,
  ContentLanguage,
  ContentStatus,
  ContentType,
  type PublishResult,
} from './types.js';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'isomorphic-dompurify';

// ============================================================================
// MARKDOWN → HTML (secure parsing + sanitization)
// ============================================================================

/**
 * Convert markdown to basic HTML.
 * Handles: headings, paragraphs, bold, italic, links, lists, code blocks.
 *
 * Security:
 * - Uses markdown-it with `html: false` so raw HTML in markdown is not rendered.
 * - Output is sanitized with DOMPurify to prevent XSS.
 * - `linkify` is OFF: linkify-it's fuzzy-match scan is O(N^2) on inputs with many
 *   email/URL-like substrings (unpatched upstream, no GHSA/OSV entry as of 08.07.2026;
 *   ~2.5s CPU per 64KB of repeated "a@b.com" on this synchronous request path with no
 *   body_markdown length cap). Explicit markdown links `[text](url)` are unaffected.
 */
export function renderMarkdownToHtml(markdown: string): string {
  // Configure markdown-it parser
  const md = new MarkdownIt({
    html: false, // do not render raw HTML from markdown
    linkify: false, // see security note above — do not re-enable without an upstream fix
    breaks: true,
  });

  // Add Tailwind-style classes to links to preserve existing behavior
  const defaultLinkOpen =
    md.renderer.rules.link_open ||
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];

    // Ensure href is present; markdown-it already escapes attributes.
    const hrefIndex = token.attrIndex('href');
    if (hrefIndex >= 0) {
      // Preserve href; just augment attributes.
      token.attrPush(['class', 'text-blue-400 hover:underline']);
      token.attrSet('rel', 'noopener noreferrer');
      // Do NOT force target for internal portals unless desired;
      // keep default behavior (no target) to avoid changing UX semantics.
    }

    return defaultLinkOpen(tokens, idx, options, env, self);
  };

  // Add Tailwind-style classes to unordered lists to preserve styling
  const defaultBulletListOpen =
    md.renderer.rules.bullet_list_open ||
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

  md.renderer.rules.bullet_list_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    token.attrPush(['class', 'list-disc pl-6 space-y-1']);
    return defaultBulletListOpen(tokens, idx, options, env, self);
  };

  const unsafeHtml = md.render(markdown);

  // Sanitize the generated HTML to prevent XSS
  const safeHtml = DOMPurify.sanitize(unsafeHtml, {
    ALLOWED_TAGS: [
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'strong',
      'em',
      'a',
      'ul',
      'ol',
      'li',
      'code',
      'pre',
      'blockquote',
      'br',
      'hr',
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class'],
  });

  return safeHtml;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================================
// LEARNING ARTICLE RENDERING
// ============================================================================

/**
 * Render a learning article into a full HTML page.
 * Customer-branded template — their logo, colors, footer.
 */
export function renderLearningHtml(item: ContentItem): string {
  const dateISO = item.published_at || item.created_at;
  const dateDisplay = new Date(dateISO).toLocaleDateString(
    item.language === ContentLanguage.FI ? 'fi-FI' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );

  const bodyHtml = item.body_html || renderMarkdownToHtml(item.body_markdown);
  const tags = [...(item.regulation_tags || []), ...(item.custom_tags || [])]
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join(' ');

  const lang = item.language === ContentLanguage.FI ? 'fi' : 'en';

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(item.title)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: #0f172a; color: #f1f5f9; margin: 0; padding: 0; line-height: 1.7; }
    main { max-width: 720px; margin: 0 auto; padding: 48px 24px; }
    h1 { font-size: 2rem; color: #e2e8f0; margin-bottom: 8px; }
    h2 { font-size: 1.5rem; color: #60a5fa; margin-top: 2rem; }
    h3 { font-size: 1.25rem; color: #93c5fd; margin-top: 1.5rem; }
    .meta { font-size: 0.875rem; color: #94a3b8; margin-bottom: 32px; }
    .category { display: inline-block; padding: 2px 10px; font-size: 0.75rem; font-weight: 600; border-radius: 4px; background: rgba(212,168,67,0.15); color: #d4a843; margin-bottom: 12px; }
    .tag { display: inline-block; padding: 1px 8px; font-size: 0.7rem; border-radius: 3px; background: rgba(96,165,250,0.15); color: #60a5fa; margin: 0 4px 4px 0; }
    .tags { margin-bottom: 24px; }
    .content { color: #cbd5e1; }
    .content p { margin-bottom: 1rem; }
    .content ul { padding-left: 1.5rem; }
    .content li { margin-bottom: 0.5rem; }
    .content pre { background: #1e293b; padding: 16px; border-radius: 8px; overflow-x: auto; }
    .content code { font-size: 0.875rem; }
    .content a { color: #60a5fa; text-decoration: underline; }
    footer { border-top: 1px solid #334155; padding: 24px; text-align: center; font-size: 0.75rem; color: #64748b; }
  </style>
</head>
<body>
  <main>
    <span class="category">${escapeHtml(item.category)}</span>
    <h1>${escapeHtml(item.title)}</h1>
    <div class="meta">${dateDisplay} · ${escapeHtml(item.author)}</div>
    ${tags ? `<div class="tags">${tags}</div>` : ''}
    <div class="content">${bodyHtml}</div>
  </main>
  <footer>
    Firehorse ContentMS · Evidence Vault
  </footer>
</body>
</html>`;
}

// ============================================================================
// PUBLISH LEARNING ARTICLE
// ============================================================================

/**
 * Publish a learning article. In MVP, returns the rendered HTML.
 * In production, this writes to the customer's portal/CDN.
 */
export async function publishLearningArticle(item: ContentItem): Promise<PublishResult> {
  if (item.type !== ContentType.Learning) {
    return {
      content_id: item.id,
      success: false,
      error: `Only learning articles can be published to the portal (type: ${item.type})`,
      published_at: new Date().toISOString(),
    };
  }

  if (item.status !== ContentStatus.Approved && item.status !== ContentStatus.Published) {
    return {
      content_id: item.id,
      success: false,
      error: `Content must be approved before publishing (status: ${item.status})`,
      published_at: new Date().toISOString(),
    };
  }

  try {
    void renderLearningHtml(item);

    // MVP: HTML is rendered and ready. In production, this writes to
    // the customer's portal storage (Supabase Storage or CDN).
    const url = `/learning/${item.language}/${item.slug}`;

    logger.info('Learning article published', { id: item.id, slug: item.slug, url });

    return {
      content_id: item.id,
      success: true,
      url,
      published_at: new Date().toISOString(),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('Learning publish failed', { id: item.id, error: msg });
    return {
      content_id: item.id,
      success: false,
      error: msg,
      published_at: new Date().toISOString(),
    };
  }
}
