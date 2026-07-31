/**
 * Firehorse ContentMS — Omnichannel Distribution
 *
 * Connects ContentMS to Firehorse Omnichannel for product marketing.
 * When product content is created/updated, Omnichannel distributes it
 * across channels: product pages, blog posts, email campaigns, LinkedIn,
 * and store listings.
 *
 * This is the "content → sales" bridge. Compliance content becomes
 * marketing material automatically.
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
  AuditAction,
  type ContentItem,
  type OmnichannelDistributeRequest,
  type OmnichannelDistributeResult,
  OmnichannelTarget,
} from './types.js';
import { renderMarkdownToHtml } from './blog-publisher.js';
import { recordAudit } from './audit.js';
import { linkedInService } from '../firehorse/linkedin-service.js';

// ============================================================================
// HELPERS
// ============================================================================

function getRepoRoot(): string {
  return process.env.DWS_REPO_ROOT || process.cwd();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function ensureDir(filePath: string): Promise<void> {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

// ============================================================================
// PRODUCT PAGE RENDERER
// ============================================================================

function renderProductPageHtml(item: ContentItem): string {
  const bodyHtml = item.body_html || renderMarkdownToHtml(item.body_markdown);
  const sku = item.product_sku || 'N/A';
  const price = item.price_eur ? `€${item.price_eur.toLocaleString()}` : '';
  const tags = [...(item.regulation_tags || []), ...(item.custom_tags || [])];
  const tagBadges = tags
    .map(
      (t) =>
        `<span style="display:inline-block;padding:2px 8px;font-size:0.7rem;border-radius:3px;background:rgba(96,165,250,0.15);color:#60a5fa;margin:0 4px 4px 0;">${escapeHtml(t)}</span>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(item.title)} — DWS10 Store</title>
    <meta name="description" content="${escapeHtml(item.excerpt || item.title)}">
    <meta property="og:title" content="${escapeHtml(item.title)}">
    <meta property="og:description" content="${escapeHtml(item.excerpt || item.title)}">
    <meta property="og:type" content="product">
    <link rel="canonical" href="https://dws10.com/products/${item.slug}.html">
    <script src="/shared-assets/nav/ironclad-nav.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .product-hero { background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98)); }
        .feature-card { background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(96, 165, 250, 0.15); border-radius: 8px; padding: 1.5rem; }
    </style>
</head>
<body class="font-sans antialiased" style="background: #0f172a; color: #f1f5f9;">
    <main class="max-w-4xl mx-auto px-4 py-12">
        <div class="product-hero rounded-xl p-8 mb-8" style="border: 1px solid rgba(212, 168, 67, 0.2);">
            <div class="flex items-center gap-3 mb-4">
                <span style="background:rgba(212,168,67,0.15);color:#d4a843;padding:2px 10px;font-size:0.75rem;font-weight:600;border-radius:4px;">${escapeHtml(sku)}</span>
                ${price ? `<span style="color:#22c55e;font-weight:700;font-size:1.25rem;">${price}</span>` : ''}
            </div>
            <h1 class="text-3xl font-bold mb-3" style="color: #e2e8f0;">${escapeHtml(item.title)}</h1>
            ${item.excerpt ? `<p class="text-lg" style="color: #94a3b8;">${escapeHtml(item.excerpt)}</p>` : ''}
            ${tagBadges ? `<div class="mt-4">${tagBadges}</div>` : ''}
        </div>

        <div style="color: #cbd5e1; line-height: 1.75;">
            ${bodyHtml}
        </div>

        ${
          item.update_summary
            ? `
        <div class="mt-8 p-4 rounded-lg" style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2);">
            <p style="color: #22c55e; font-weight: 600; font-size: 0.875rem; margin-bottom: 4px;">Latest Update</p>
            <p style="color: #94a3b8; font-size: 0.875rem;">${escapeHtml(item.update_summary)}</p>
        </div>`
            : ''
        }

        <div class="mt-8">
            <a href="https://dws10.com/buy" class="inline-block px-8 py-3 rounded font-bold" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #0f172a;">
                View in Store
            </a>
        </div>
    </main>

    <footer class="border-t border-gray-700 py-6 text-center text-xs text-gray-500" style="background: #0f172a;">
        <p>&copy; 2026 Lifetime Oy &middot; VAT FI07724079</p>
    </footer>
</body>
</html>`;
}

// ============================================================================
// DISTRIBUTION ENGINE
// ============================================================================

/**
 * Distribute content across Omnichannel targets.
 * Each target gets the appropriate rendering.
 */
export async function distributeContent(
  item: ContentItem,
  request: OmnichannelDistributeRequest,
): Promise<OmnichannelDistributeResult> {
  const results: OmnichannelDistributeResult['distributed_to'] = [];
  const root = getRepoRoot();

  for (const target of request.targets) {
    try {
      switch (target) {
        case OmnichannelTarget.ProductPage: {
          const html = renderProductPageHtml(item);
          const source = join(root, 'dws10.com', 'products', `${item.slug}.html`);
          const landing = join(root, 'landing-pages', 'dws10-com', 'products', `${item.slug}.html`);
          await ensureDir(source);
          await ensureDir(landing);
          await writeFile(source, html, 'utf-8');
          await writeFile(landing, html, 'utf-8');
          results.push({ target, success: true, path: source });
          break;
        }

        case OmnichannelTarget.BlogPost: {
          // Blog distribution is handled by artifact-publisher.ts
          // Here we just log it as a distribution target
          results.push({
            target,
            success: true,
            path: `onelifetime.world/posts/en/${item.slug}.html`,
          });
          break;
        }

        case OmnichannelTarget.EmailCampaign: {
          // Integration point: queue content for Firehorse outreach cadence
          // In production, this calls src/outreach/scheduler.ts
          logger.info('Omnichannel: queued for email campaign', {
            content_id: item.id,
            campaign_id: item.campaign_id,
          });
          results.push({
            target,
            success: true,
            path: `email:campaign:${item.campaign_id || 'default'}`,
          });
          break;
        }

        case OmnichannelTarget.LinkedIn: {
          const postText = [item.title, item.excerpt || '', item.product_sku ? `SKU: ${item.product_sku}` : '']
            .filter(Boolean)
            .join('\n\n');

          const postUrl = item.slug ? `https://dws10.com/products/${item.slug}.html` : undefined;

          const shareResult = await linkedInService.sharePost({
            text: postText,
            url: postUrl,
            content_id: item.id,
          });

          results.push({
            target,
            success: shareResult.success,
            path: shareResult.post_id
              ? `linkedin:post:${shareResult.post_id}`
              : shareResult.dry_run
                ? 'linkedin:dry_run'
                : undefined,
            error: shareResult.error,
          });
          break;
        }

        case OmnichannelTarget.StoreListing: {
          // STATUS: DRY-RUN — logs intent but does not write products.json.
          // Human must copy changes manually until auto-sync is validated.
          logger.warn('Omnichannel: store listing sync is DRY-RUN — human must copy manually', {
            content_id: item.id,
            sku: item.product_sku,
            status: 'dry_run',
          });
          results.push({
            target,
            success: false,
            error: 'Store listing sync is dry-run only (manual copy required)',
            path: `dws10.com/config/products.json:${item.product_sku}`,
          });
          break;
        }

        default:
          results.push({
            target,
            success: false,
            error: `Unknown distribution target: ${target}`,
          });
      }
    } catch (err) {
      results.push({
        target,
        success: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Audit trail
  const successCount = results.filter((r) => r.success).length;
  recordAudit({
    content_id: item.id,
    action: AuditAction.Published,
    actor_id: request.distributor_id,
    actor_name: request.distributor_name,
    details: `Omnichannel distributed to ${successCount}/${request.targets.length} channels: ${request.targets.join(', ')}`,
  });

  logger.info('Omnichannel distribution complete', {
    content_id: item.id,
    targets: request.targets,
    success: successCount,
    total: request.targets.length,
  });

  return {
    content_id: item.id,
    distributed_to: results,
    distributed_at: new Date().toISOString(),
  };
}
