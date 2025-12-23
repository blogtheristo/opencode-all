/**
 * Supabase Integration for A/B Testing
 * DWS IQ Messaging Experiments
 *
 * @description Tracks message variant performance for conversion optimization
 * @performance Edge-compatible, lightweight client
 * @compliance EU data residency, GDPR-compliant
 */

import { createClient } from '@supabase/supabase-js';
import { MESSAGING_CONFIG } from './messaging';

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Experiment Assignment Interface
 */
export interface ExperimentAssignment {
  session_id: string;
  variant_id: string;
  assigned_at: string;
  user_agent?: string;
  ip_country?: string;
}

/**
 * Experiment Event Interface
 */
export interface ExperimentEvent {
  session_id: string;
  variant_id: string;
  event_type: 'impression' | 'click' | 'conversion' | 'bounce';
  event_timestamp: string;
  page_url?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Assign user to message variant using weighted distribution
 * @param sessionId - Unique session identifier
 * @param userAgent - User agent string
 * @param ipCountry - IP-based country code
 * @returns Variant ID
 */
export async function assignMessageVariant(
  sessionId: string,
  userAgent?: string,
  ipCountry?: string
): Promise<string> {
  // Weighted distribution: 60% default, 20% variant_a, 20% variant_b
  const variants = ['default', 'variant_a', 'variant_b'];
  const weights = [0.6, 0.2, 0.2];

  const random = Math.random();
  let cumulativeWeight = 0;
  let selectedVariant = 'default';

  for (let i = 0; i < variants.length; i++) {
    cumulativeWeight += weights[i];
    if (random <= cumulativeWeight) {
      selectedVariant = variants[i];
      break;
    }
  }

  // Record assignment in Supabase
  try {
    await supabase.from('messaging_experiments').insert({
      session_id: sessionId,
      variant_id: selectedVariant,
      assigned_at: new Date().toISOString(),
      user_agent: userAgent,
      ip_country: ipCountry,
    });
  } catch (error) {
    console.error('Failed to record experiment assignment:', error);
  }

  return selectedVariant;
}

/**
 * Track experiment event (impression, click, conversion, bounce)
 * @param sessionId - Session identifier
 * @param variantId - Variant identifier
 * @param eventType - Type of event
 * @param metadata - Additional event metadata
 */
export async function trackExperimentEvent(
  sessionId: string,
  variantId: string,
  eventType: 'impression' | 'click' | 'conversion' | 'bounce',
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await supabase.from('experiment_events').insert({
      session_id: sessionId,
      variant_id: variantId,
      event_type: eventType,
      event_timestamp: new Date().toISOString(),
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      metadata: metadata || {},
    });
  } catch (error) {
    console.error('Failed to track experiment event:', error);
  }
}

/**
 * Get experiment results (aggregated metrics)
 * @returns Experiment performance metrics
 */
export async function getExperimentResults() {
  try {
    const { data, error } = await supabase
      .from('experiment_results_view')
      .select('*')
      .order('variant_id', { ascending: true });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Failed to fetch experiment results:', error);
    return null;
  }
}

/**
 * Calculate conversion rate for a variant
 * @param variantId - Variant identifier
 * @returns Conversion rate (0-1)
 */
export async function getConversionRate(variantId: string): Promise<number> {
  try {
    const { data: impressions } = await supabase
      .from('experiment_events')
      .select('session_id', { count: 'exact', head: true })
      .eq('variant_id', variantId)
      .eq('event_type', 'impression');

    const { data: conversions } = await supabase
      .from('experiment_events')
      .select('session_id', { count: 'exact', head: true })
      .eq('variant_id', variantId)
      .eq('event_type', 'conversion');

    const impressionCount = impressions?.length || 0;
    const conversionCount = conversions?.length || 0;

    return impressionCount > 0 ? conversionCount / impressionCount : 0;
  } catch (error) {
    console.error('Failed to calculate conversion rate:', error);
    return 0;
  }
}

/**
 * Initialize Supabase tables (SQL schema)
 * Run this once in Supabase SQL Editor
 */
export const SUPABASE_SCHEMA = `
-- Messaging Experiments Table
CREATE TABLE IF NOT EXISTS messaging_experiments (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  ip_country TEXT,
  UNIQUE(session_id)
);

-- Experiment Events Table
CREATE TABLE IF NOT EXISTS experiment_events (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'click', 'conversion', 'bounce')),
  event_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  page_url TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  FOREIGN KEY (session_id) REFERENCES messaging_experiments(session_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messaging_experiments_session ON messaging_experiments(session_id);
CREATE INDEX IF NOT EXISTS idx_messaging_experiments_variant ON messaging_experiments(variant_id);
CREATE INDEX IF NOT EXISTS idx_experiment_events_session ON experiment_events(session_id);
CREATE INDEX IF NOT EXISTS idx_experiment_events_variant ON experiment_events(variant_id);
CREATE INDEX IF NOT EXISTS idx_experiment_events_type ON experiment_events(event_type);
CREATE INDEX IF NOT EXISTS idx_experiment_events_timestamp ON experiment_events(event_timestamp DESC);

-- Materialized view for experiment results
CREATE MATERIALIZED VIEW IF NOT EXISTS experiment_results_view AS
SELECT
  e.variant_id,
  COUNT(DISTINCT CASE WHEN ev.event_type = 'impression' THEN ev.session_id END) AS impressions,
  COUNT(DISTINCT CASE WHEN ev.event_type = 'click' THEN ev.session_id END) AS clicks,
  COUNT(DISTINCT CASE WHEN ev.event_type = 'conversion' THEN ev.session_id END) AS conversions,
  COUNT(DISTINCT CASE WHEN ev.event_type = 'bounce' THEN ev.session_id END) AS bounces,
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN ev.event_type = 'conversion' THEN ev.session_id END) /
    NULLIF(COUNT(DISTINCT CASE WHEN ev.event_type = 'impression' THEN ev.session_id END), 0),
    2
  ) AS conversion_rate
FROM messaging_experiments e
LEFT JOIN experiment_events ev ON e.session_id = ev.session_id
GROUP BY e.variant_id;

-- Refresh materialized view daily
CREATE OR REPLACE FUNCTION refresh_experiment_results()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY experiment_results_view;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh view
DROP TRIGGER IF EXISTS refresh_results_trigger ON experiment_events;
CREATE TRIGGER refresh_results_trigger
AFTER INSERT ON experiment_events
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_experiment_results();

-- Enable Row Level Security (RLS)
ALTER TABLE messaging_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from authenticated and anon users
CREATE POLICY "Allow public inserts on messaging_experiments"
  ON messaging_experiments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public inserts on experiment_events"
  ON experiment_events FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Allow reads for authenticated users only
CREATE POLICY "Allow authenticated reads on messaging_experiments"
  ON messaging_experiments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated reads on experiment_events"
  ON experiment_events FOR SELECT
  TO authenticated
  USING (true);
`;

export default supabase;
