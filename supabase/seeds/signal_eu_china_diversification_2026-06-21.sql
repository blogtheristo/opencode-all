-- Seed: EU supply-chain diversification law — ULTRA sales signal
-- Source radar: reports/regulatory-radar/dws-portfolio_eu-china-diversification_2026-06-21.md
-- Outreach pack: sales-outreach/SIGNAL_EU_CHINA_DIVERSIFICATION_2026-06-21.md
--
-- Wires the diversification-law regulatory signal into firehorse_signals
-- (schema: supabase/migrations/012_firehorse_signals.sql) as an ULTRA
-- (correlation_score = 5) entry, queued for human approval.
--
-- APPLY POLICY: authoring this file is GREEN (reviewable text artifact).
-- APPLYING it to a database is the human-gated RED step — do NOT run
-- `supabase db push` / psql against prod from an agent session.
--
-- Idempotency: guarded by a NOT EXISTS check on (company_name, signal_date,
-- correlation_reason) so re-running does not duplicate the row.

INSERT INTO firehorse_signals (
  signal_source,
  signal_type,
  signal_date,
  company_name,
  contact_name,
  contact_title,
  contact_email,
  signal_content,
  signal_url,
  signal_metadata,
  correlation_score,
  correlation_reason,
  dws6_feature_match,
  keywords_matched,
  status,
  message_draft
)
SELECT
  'web',
  'press_release',
  TIMESTAMPTZ '2026-06-05',  -- Šefčovič "dedicated instrument" statement
  'Outokumpu Oyj',
  'Ari Hirvonen',
  'Patent IP Director',
  'ari.hirvonen@outokumpu.com',  -- verify before send (rule: recipient verification)
  'EU Commission flagged a supply-chain diversification instrument (Trade Commissioner Šefčovič, 2026-06-05), tied to the Q3 2026 trade-defence review. Proposed mechanism: cap single-country supply at ~30-40% and require >=3 sources for critical inputs; named sectors include advanced manufacturing and industrial machinery. For steel, China-dependent manganese ferroalloys and graphite electrodes enter the same origin-disclosure surface as CBAM. Driver: EU-China goods deficit EUR 359.8bn in 2025 (Eurostat).',
  'https://moderndiplomacy.eu/2026/05/18/eu-moves-to-reduce-china-dependency-with-new-supply-chain-diversification-rules/',
  jsonb_build_object(
    'instrument', 'EU Supply-Chain Diversification Instrument (working title)',
    'instrument_status', 'pre-proposal',
    'next_milestone', 'Commission proposal Q3 2026 (trade-defence review)',
    'industry_id', 2,
    'captain_hat', 'IRON_STEEL',
    'related_in_force', jsonb_build_array('CBAM', 'CRM Act'),
    'radar_report', 'reports/regulatory-radar/dws-portfolio_eu-china-diversification_2026-06-21.md',
    'roles_door_1', 'R02 IP Director',
    'roles_bridge', 'R20 CPO'
  ),
  5,  -- ULTRA: dated regulatory milestone (Q3 2026) on a named-sector instrument
  'Regulatory-mention signal (ULTRA): pending binding obligation with dated Q3 2026 milestone; overlaps existing Outokumpu CBAM-disclosure-as-IP motion.',
  ARRAY['CBAM', 'CRM_Act', 'supply_chain_diversification', 'origin_disclosure'],
  ARRAY['diversification law', 'single-country cap', 'three sources', 'manganese', 'graphite electrodes', 'CBAM'],
  'queued',
  'See sales-outreach/LETTER_ARI_HIRVONEN_OUTOKUMPU_DIVERSIFICATION.md for the approved draft body. Subject: "EU diversification law — origin disclosure as IP risk". Second-wedge follow-up to the CBAM-disclosure motion; assumes prior Outokumpu context.'
WHERE NOT EXISTS (
  SELECT 1 FROM firehorse_signals f
  WHERE f.company_name = 'Outokumpu Oyj'
    AND f.signal_date = TIMESTAMPTZ '2026-06-05'
    AND f.correlation_reason LIKE 'Regulatory-mention signal (ULTRA)%'
);
