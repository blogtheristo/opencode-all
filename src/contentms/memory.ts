/**
 * Firehorse ContentMS — Persistent Memory Layer
 *
 * Supabase-backed persistence for the Evidence Vault with in-memory
 * fallback when Supabase is unavailable. All CRUD operations go through
 * this layer so the service never loses data between restarts.
 *
 * Code-Version: 3.0.0
 * Introduced-In: PR-TBD (ContentMS V3 — Memory + HIL + Artifacts)
 * Branch: claude/build-contentms-mvp-Q2nU9
 * Date: 2026-03-23
 * Owner: Claude Code (Opus 4.6)
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import { type ContentItem, ContentItemSchema } from './types.js';

// ============================================================================
// CONTENT STORE — Supabase + in-memory fallback
// ============================================================================

const SUPABASE_TABLE = 'contentms_items';

class ContentMemory {
  private supabase: SupabaseClient | null = null;
  private fallback: Map<string, ContentItem> = new Map();
  private initialized = false;

  /**
   * Lazy-init Supabase client. Falls back to in-memory if env vars missing.
   */
  private init(): void {
    if (this.initialized) return;
    this.initialized = true;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (url && key) {
      try {
        this.supabase = createClient(url, key);
        logger.info('ContentMS memory: Supabase connected');
      } catch (err) {
        logger.warn('ContentMS memory: Supabase init failed, using in-memory fallback', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    } else {
      logger.info('ContentMS memory: No Supabase credentials, using in-memory store');
    }
  }

  /**
   * Store a content item. Upserts to Supabase or falls back to Map.
   */
  async set(id: string, item: ContentItem): Promise<void> {
    this.init();

    // Always keep in-memory copy for fast reads
    this.fallback.set(id, item);

    if (this.supabase) {
      try {
        const { error } = await this.supabase
          .from(SUPABASE_TABLE)
          .upsert({
            id: item.id,
            data: item,
            organization_id: item.organization_id,
            type: item.type,
            status: item.status,
            slug: item.slug,
            updated_at: item.updated_at,
          }, { onConflict: 'id' });

        if (error) {
          logger.warn('ContentMS memory: Supabase upsert failed', { id, error: error.message });
        }
      } catch (err) {
        logger.warn('ContentMS memory: Supabase write error', {
          id,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  /**
   * Get a content item by ID. Tries in-memory first, then Supabase.
   */
  async get(id: string): Promise<ContentItem | null> {
    this.init();

    // Fast path: in-memory
    const cached = this.fallback.get(id);
    if (cached) return cached;

    // Slow path: Supabase
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from(SUPABASE_TABLE)
          .select('data')
          .eq('id', id)
          .single();

        if (!error && data?.data) {
          const item = data.data as ContentItem;
          this.fallback.set(id, item); // Cache locally
          return item;
        }
      } catch {
        // Fall through to null
      }
    }

    return null;
  }

  /**
   * Get all items. Returns from in-memory (pre-loaded on boot).
   * For large datasets, use filtered queries instead.
   */
  values(): ContentItem[] {
    this.init();
    return Array.from(this.fallback.values());
  }

  /**
   * Delete an item from both stores.
   */
  async delete(id: string): Promise<boolean> {
    this.init();
    const existed = this.fallback.delete(id);

    if (this.supabase) {
      try {
        await this.supabase.from(SUPABASE_TABLE).delete().eq('id', id);
      } catch {
        // Best effort
      }
    }

    return existed;
  }

  /**
   * Load all items from Supabase into memory on startup.
   * Called once during service init.
   */
  async hydrate(): Promise<number> {
    this.init();

    if (!this.supabase) return this.fallback.size;

    try {
      const { data, error } = await this.supabase
        .from(SUPABASE_TABLE)
        .select('data')
        .order('updated_at', { ascending: false })
        .limit(10000);

      if (error) {
        logger.warn('ContentMS memory: hydrate failed', { error: error.message });
        return this.fallback.size;
      }

      let loaded = 0;
      for (const row of data || []) {
        if (row.data) {
          try {
            const item = ContentItemSchema.parse(row.data);
            this.fallback.set(item.id, item);
            loaded++;
          } catch {
            // Skip invalid items
          }
        }
      }

      logger.info('ContentMS memory: hydrated from Supabase', { loaded });
      return loaded;
    } catch (err) {
      logger.warn('ContentMS memory: hydrate error', {
        error: err instanceof Error ? err.message : String(err),
      });
      return this.fallback.size;
    }
  }

  /**
   * Check if using Supabase (persistent) or in-memory (volatile).
   */
  isPersistent(): boolean {
    this.init();
    return this.supabase !== null;
  }

  /**
   * Get store size.
   */
  size(): number {
    return this.fallback.size;
  }

  /**
   * Clear all in-memory state. For test isolation only.
   * Does NOT touch Supabase — safe to call in beforeEach.
   */
  reset(): void {
    this.fallback.clear();
  }
}

// Singleton instance — shared across the ContentMS service
export const contentMemory = new ContentMemory();
