/**
 * Agent Version Registry — Rollback Without Redeploy
 *
 * Tracks the active (model + system prompt + tool list) tuple for every agent.
 * Rolling back = calling rollback(agentName, previousVersionHash).
 * No code deploy required — prompt and model are data, not code.
 *
 * Persistence: in-memory (fast path) + Supabase agent_versions table (durable).
 * On startup the registry is hydrated from Supabase; writes go to both.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (claude/agent-monitoring-evals-qatA6)
 * Date: 2026-05-08
 * Owner: Lifetime Oy
 */

import { createHash } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AgentConfig } from './types.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AgentVersion {
  agentName: string;
  /** SHA-256 of {modelId, systemPromptHash, toolListHash} */
  versionHash: string;
  modelId: string;
  systemPromptHash: string;
  toolListHash: string;
  isActive: boolean;
  createdAt: string;
  /** Optional human-readable label (e.g. "after-opus-4-upgrade") */
  label?: string;
}

// ─── Hash helpers ─────────────────────────────────────────────────────────────

function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

function computeVersionHash(
  modelId: string,
  systemPromptHash: string,
  toolListHash: string,
): string {
  return sha256(`${modelId}|${systemPromptHash}|${toolListHash}`).slice(0, 16);
}

// ─── Registry ─────────────────────────────────────────────────────────────────

class AgentVersionRegistryClass {
  /** All versions per agent, newest first */
  private readonly versions = new Map<string, AgentVersion[]>();
  /** Active version hash per agent */
  private readonly active = new Map<string, string>();

  private supabase: SupabaseClient | null = null;

  private getSupabase(): SupabaseClient | null {
    if (this.supabase) return this.supabase;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key) this.supabase = createClient(url, key);
    return this.supabase;
  }

  /**
   * Register the current configuration of an agent.
   * Call once per agent on startup, or whenever config changes.
   * Returns the versionHash — store it for rollback reference.
   */
  register(agentName: string, config: AgentConfig, systemPrompt: string, label?: string): string {
    const systemPromptHash = sha256(systemPrompt).slice(0, 16);
    const toolListHash = sha256(
      JSON.stringify((config.tools ?? []).map((t) => t.name).sort()),
    ).slice(0, 16);
    const modelId = config.model ?? config.modelTier ?? 'unknown';
    const versionHash = computeVersionHash(modelId, systemPromptHash, toolListHash);

    const existing = this.versions.get(agentName) ?? [];

    // Idempotent — same hash already registered, just ensure it's active
    if (existing.some((v) => v.versionHash === versionHash)) {
      this.activate(agentName, versionHash);
      return versionHash;
    }

    const version: AgentVersion = {
      agentName,
      versionHash,
      modelId,
      systemPromptHash,
      toolListHash,
      isActive: true,
      createdAt: new Date().toISOString(),
      label,
    };

    // Deactivate all others
    for (const v of existing) {
      v.isActive = false;
    }

    this.versions.set(agentName, [version, ...existing]);
    this.active.set(agentName, versionHash);

    this.persistVersion(version).catch(() => {});

    return versionHash;
  }

  /** Get the currently active version for an agent, or null if unregistered. */
  getActive(agentName: string): AgentVersion | null {
    const hash = this.active.get(agentName);
    if (!hash) return null;
    return this.versions.get(agentName)?.find((v) => v.versionHash === hash) ?? null;
  }

  /** All registered versions for an agent, newest first. */
  listVersions(agentName: string): AgentVersion[] {
    return this.versions.get(agentName) ?? [];
  }

  /**
   * Roll back an agent to a previously registered version.
   * Returns true if the target version was found and activated.
   */
  rollback(agentName: string, targetVersionHash: string): boolean {
    const all = this.versions.get(agentName);
    if (!all) return false;

    const target = all.find((v) => v.versionHash === targetVersionHash);
    if (!target) return false;

    this.activate(agentName, targetVersionHash);
    this.persistRollback(agentName, targetVersionHash).catch(() => {});
    return true;
  }

  private activate(agentName: string, versionHash: string): void {
    const all = this.versions.get(agentName);
    if (!all) return;
    for (const v of all) {
      v.isActive = v.versionHash === versionHash;
    }
    this.active.set(agentName, versionHash);
  }

  private async persistVersion(version: AgentVersion): Promise<void> {
    const client = this.getSupabase();
    if (!client) return;
    try {
      await client.from('agent_versions').upsert(
        {
          agent_name: version.agentName,
          version_hash: version.versionHash,
          model_id: version.modelId,
          system_prompt_hash: version.systemPromptHash,
          tool_list_hash: version.toolListHash,
          is_active: version.isActive,
          created_at: version.createdAt,
          label: version.label ?? null,
        },
        { onConflict: 'version_hash' },
      );
      // Mark all others for this agent as inactive
      await client
        .from('agent_versions')
        .update({ is_active: false })
        .eq('agent_name', version.agentName)
        .neq('version_hash', version.versionHash);
    } catch {
      // Non-blocking
    }
  }

  private async persistRollback(agentName: string, targetHash: string): Promise<void> {
    const client = this.getSupabase();
    if (!client) return;
    try {
      await client
        .from('agent_versions')
        .update({ is_active: true })
        .eq('agent_name', agentName)
        .eq('version_hash', targetHash);
      await client
        .from('agent_versions')
        .update({ is_active: false })
        .eq('agent_name', agentName)
        .neq('version_hash', targetHash);
    } catch {
      // Non-blocking
    }
  }

  /** Hydrate in-memory registry from Supabase on startup. */
  async hydrate(): Promise<void> {
    const client = this.getSupabase();
    if (!client) return;
    try {
      const { data } = await client
        .from('agent_versions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!data) return;

      for (const row of data) {
        const v: AgentVersion = {
          agentName: row.agent_name,
          versionHash: row.version_hash,
          modelId: row.model_id,
          systemPromptHash: row.system_prompt_hash,
          toolListHash: row.tool_list_hash,
          isActive: row.is_active,
          createdAt: row.created_at,
          label: row.label ?? undefined,
        };
        const existing = this.versions.get(v.agentName) ?? [];
        if (!existing.some((e) => e.versionHash === v.versionHash)) {
          existing.push(v);
          this.versions.set(v.agentName, existing);
        }
        if (v.isActive) {
          this.active.set(v.agentName, v.versionHash);
        }
      }
    } catch {
      // Non-blocking — in-memory state is the fallback
    }
  }
}

export const AgentVersionRegistry = new AgentVersionRegistryClass();
