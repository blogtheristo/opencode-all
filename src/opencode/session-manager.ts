import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface FailureDetail {
  [key: string]: string | number | boolean | null | undefined;
}

export interface OpenCodeSession {
  id: string;
  title: string;
  source: 'detect' | 'manual';
  state: 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED';
  status: 'pending' | 'running' | 'completed';
  idempotency_key?: string;
  baseline_commit?: string;
  branch?: string;
  worktree_path?: string;
  handoff_path?: string;
  attempts: number;
  max_attempts: number;
  stop_reason?: string;
  failure_code?: string;
  failure_detail?: FailureDetail;
  worktree_state?: string;
  worktree_resumed?: boolean;
  last_run?: string;
  reconciled_at?: string;
  legacy?: boolean;
}

export class SessionManager {
  async createSession(session: Partial<OpenCodeSession>): Promise<OpenCodeSession> {
    const { data, error } = await supabase
      .from('opencode_sessions')
      .insert([
        {
          ...session,
          state: session.state || 'PENDING',
          status: session.status || 'pending',
          attempts: 0,
          max_attempts: 5,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getSession(id: string): Promise<OpenCodeSession | null> {
    const { data, error } = await supabase
      .from('opencode_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data || null;
  }

  async updateSession(id: string, updates: Partial<OpenCodeSession>): Promise<OpenCodeSession> {
    const { data, error } = await supabase
      .from('opencode_sessions')
      .update({
        ...updates,
        last_run: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async failSession(
    id: string,
    failureCode: string,
    failureDetail: FailureDetail,
  ): Promise<OpenCodeSession> {
    const session = await this.getSession(id);
    if (!session) throw new Error(`Session ${id} not found`);

    const attempts = session.attempts + 1;
    const newState: 'FAILED' | 'PENDING' = attempts >= session.max_attempts ? 'FAILED' : 'PENDING';

    return this.updateSession(id, {
      state: newState,
      status: 'pending',
      attempts,
      failure_code: failureCode,
      failure_detail: failureDetail,
      stop_reason: attempts >= session.max_attempts ? 'max_attempts_exceeded' : 'failed',
    });
  }

  async completeSession(id: string): Promise<OpenCodeSession> {
    return this.updateSession(id, {
      state: 'DONE',
      status: 'completed',
      stop_reason: 'success',
    });
  }

  async getPendingSessions(limit = 10): Promise<OpenCodeSession[]> {
    const { data, error } = await supabase
      .from('opencode_sessions')
      .select('*')
      .eq('state', 'PENDING')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getFailedSessions(limit = 10): Promise<OpenCodeSession[]> {
    const { data, error } = await supabase
      .from('opencode_sessions')
      .select('*')
      .eq('state', 'FAILED')
      .order('last_run', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getStaleWorktrees(olderThanHours = 24): Promise<OpenCodeSession[]> {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('opencode_sessions')
      .select('*')
      .eq('worktree_state', 'removed-no-diff')
      .lt('last_run', cutoff)
      .limit(100);

    if (error) throw error;
    return data || [];
  }

  async deleteStaleWorktrees(olderThanHours = 72): Promise<number> {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000).toISOString();
    const { error, count } = await supabase
      .from('opencode_sessions')
      .delete()
      .eq('worktree_state', 'removed-no-diff')
      .lt('last_run', cutoff);

    if (error) throw error;
    return count || 0;
  }

  async getSessionStats(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('opencode_sessions')
      .select('state, count')
      .order('state');

    if (error) throw error;

    const stats: Record<string, number> = {};
    for (const row of data || []) {
      stats[row.state] = row.count;
    }
    return stats;
  }
}

export const sessionManager = new SessionManager();
