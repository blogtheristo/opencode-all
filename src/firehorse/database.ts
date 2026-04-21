/**
 * Firehorse Omnichannel Next Pilot - Database Layer
 * CustomerPilotLoop v1
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { type EmailTemplate, EventType, type Lead, type LeadState, type ReplyIntent, type TaskType } from './types';

// ============================================================================
// DATABASE CLIENT
// ============================================================================

class FirehorseDatabase {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // ==========================================================================
  // LEAD QUERIES
  // ==========================================================================

  async getLeadById(leadId: string): Promise<Lead | null> {
    const { data, error } = await this.supabase
      .from('firehorse_leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (error) {
      console.error('Error fetching lead:', error);
      return null;
    }

    return data as Lead;
  }

  async getNewLeadsForToday(limit: number = 30): Promise<Lead[]> {
    const { data, error } = await this.supabase
      .from('firehorse_daily_new_leads')
      .select('*')
      .limit(limit);

    if (error) {
      console.error('Error fetching new leads:', error);
      return [];
    }

    return data as Lead[];
  }

  async getCold2Candidates(): Promise<Lead[]> {
    const { data, error } = await this.supabase.from('firehorse_cold2_candidates').select('*');

    if (error) {
      console.error('Error fetching Cold 2 candidates:', error);
      return [];
    }

    return data as Lead[];
  }

  async getCold3Candidates(): Promise<Lead[]> {
    const { data, error } = await this.supabase.from('firehorse_cold3_candidates').select('*');

    if (error) {
      console.error('Error fetching Cold 3 candidates:', error);
      return [];
    }

    return data as Lead[];
  }

  // ==========================================================================
  // LEAD UPDATES
  // ==========================================================================

  async updateLeadState(leadId: string, newState: LeadState): Promise<void> {
    const { error } = await this.supabase
      .from('firehorse_leads')
      .update({ state: newState })
      .eq('id', leadId);

    if (error) {
      throw new Error(`Failed to update lead state: ${error.message}`);
    }
  }

  async updateLastEngagement(leadId: string, timestamp: Date): Promise<void> {
    const { error } = await this.supabase
      .from('firehorse_leads')
      .update({ last_engagement_at: timestamp.toISOString() })
      .eq('id', leadId);

    if (error) {
      throw new Error(`Failed to update last engagement: ${error.message}`);
    }
  }

  async updateCold1SentAt(leadId: string, timestamp: Date): Promise<void> {
    const { error } = await this.supabase
      .from('firehorse_leads')
      .update({ cold_1_sent_at: timestamp.toISOString() })
      .eq('id', leadId);

    if (error) {
      throw new Error(`Failed to update cold_1_sent_at: ${error.message}`);
    }
  }

  async updateCold2SentAt(leadId: string, timestamp: Date): Promise<void> {
    const { error } = await this.supabase
      .from('firehorse_leads')
      .update({ cold_2_sent_at: timestamp.toISOString() })
      .eq('id', leadId);

    if (error) {
      throw new Error(`Failed to update cold_2_sent_at: ${error.message}`);
    }
  }

  async updateCold3SentAt(leadId: string, timestamp: Date): Promise<void> {
    const { error } = await this.supabase
      .from('firehorse_leads')
      .update({ cold_3_sent_at: timestamp.toISOString() })
      .eq('id', leadId);

    if (error) {
      throw new Error(`Failed to update cold_3_sent_at: ${error.message}`);
    }
  }

  // ==========================================================================
  // EVENT MANAGEMENT
  // ==========================================================================

  async createEvent(params: {
    lead_id: string;
    event_type: EventType;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const { lead_id, event_type, metadata = {} } = params;

    const { error } = await this.supabase.from('firehorse_events').insert({
      lead_id,
      event_type,
      metadata,
    });

    if (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }
  }

  // ==========================================================================
  // TASK MANAGEMENT
  // ==========================================================================

  async createTask(params: {
    lead_id: string;
    owner: string;
    task_type: TaskType;
    description?: string;
  }): Promise<void> {
    const { lead_id, owner, task_type, description } = params;

    const { error } = await this.supabase.from('firehorse_tasks').insert({
      lead_id,
      owner,
      task_type,
      description,
    });

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  // ==========================================================================
  // EMAIL TEMPLATES
  // ==========================================================================

  async getEmailTemplate(templateId: string): Promise<EmailTemplate | null> {
    const { data, error } = await this.supabase
      .from('firehorse_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error) {
      console.error('Error fetching template:', error);
      return null;
    }

    return data as EmailTemplate;
  }

  /**
   * Get country-specific context text for email personalization
   */
  async getCountryContext(countryCode: string): Promise<string> {
    const { data, error } = await this.supabase.rpc('get_country_context', {
      country_code: countryCode,
    });

    if (error) {
      console.error('Error fetching country context:', error);
      return '';
    }

    return data as string;
  }

  // ==========================================================================
  // DAILY SEND TRACKING
  // ==========================================================================

  /**
   * Get total outbound sends for today (UTC)
   */
  async getTodaySendCount(): Promise<number> {
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const { count, error } = await this.supabase
      .from('firehorse_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', EventType.EmailSent)
      .gte('created_at', todayStart.toISOString());

    if (error) {
      console.error('Error fetching today send count:', error);
      throw new Error(`Failed to fetch today's send count: ${error.message}`);
    }

    return count ?? 0;
  }

  // ==========================================================================
  // REPLY MANAGEMENT
  // ==========================================================================

  async createReply(params: {
    lead_id: string;
    reply_text: string;
    intent?: ReplyIntent;
    confidence?: number;
  }): Promise<void> {
    const { lead_id, reply_text, intent, confidence } = params;

    const { error } = await this.supabase.from('firehorse_replies').insert({
      lead_id,
      reply_text,
      intent,
      confidence,
    });

    if (error) {
      throw new Error(`Failed to create reply: ${error.message}`);
    }
  }
}

// Export lazy singleton — defers construction until first use so that
// importing this module doesn't throw when SUPABASE_URL is unset (e.g. tests).
let _db: FirehorseDatabase | null = null;
export const db = new Proxy({} as FirehorseDatabase, {
  get(_target, prop, receiver) {
    if (!_db) {
      _db = new FirehorseDatabase();
    }
    const val = Reflect.get(_db, prop, receiver);
    return typeof val === 'function' ? val.bind(_db) : val;
  },
});
