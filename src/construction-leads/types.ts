/**
 * Construction Leads Types
 *
 * Types for TED API responses and construction lead processing.
 * Maps TED (Tenders Electronic Daily) notice data to DWS outreach pipeline.
 */

/** Raw TED search API response structure */
export interface TedSearchResponse {
  total: number;
  results: TedNotice[];
}

/** Individual TED notice from search results */
export interface TedNotice {
  /** TED notice number (e.g., "2026/S 038-123456") */
  ND: string;
  /** Document number */
  documentNumber?: string;
  /** Publication date */
  PD: string;
  /** Title */
  TI?: string;
  /** Title in original language */
  titleOriginalLanguage?: string;
  /** Country code */
  CY?: string;
  /** Country name */
  countryName?: string;
  /** Town */
  TW?: string;
  /** Contracting authority / buyer name */
  AA?: string;
  /** CPV code */
  CPV?: string;
  /** CPV description */
  cpvDescription?: string;
  /** NUTS code */
  NUTS?: string;
  /** Contract type: W (works), S (supplies), V (services) */
  NC?: string;
  /** Procedure type */
  PR?: string;
  /** Notice type */
  TD?: string;
  /** Deadline date */
  DT?: string;
  /** Total value */
  TV?: string;
  /** Currency */
  TVL?: string;
  /** URL to TED notice */
  TED_NOTICE_URL?: string;
  /** Full XML/JSON content */
  CONTENT?: string;
  /** Raw data catch-all */
  [key: string]: unknown;
}

/** Processed construction lead ready for database */
export interface ConstructionLead {
  ted_notice_id: string;
  document_number: string | null;
  title: string;
  description: string | null;
  cpv_code: string | null;
  cpv_description: string | null;
  country_code: string | null;
  country_name: string | null;
  nuts_code: string | null;
  place_of_performance: string | null;
  buyer_name: string | null;
  buyer_url: string | null;
  contract_type: string | null;
  procedure_type: string | null;
  notice_type: string | null;
  estimated_value: number | null;
  currency: string;
  publication_date: string | null;
  deadline_date: string | null;
  ted_url: string | null;
  status: ConstructionLeadStatus;
  relevance_score: number;
  raw_data: Record<string, unknown>;
  source: string;
  created_by: string;

  /**
   * Dedup key with tender_id — must match DB (migration 047).
   * company_name = normalized buyer; tender_id = ted_notice_id for TED.
   */
  company_name: string;
  tender_id: string;

  /** Heuristic ERP (company-erp-resolver) */
  resolved_erp?: string | null;
  /** Matched compliance/climate keywords from TED text */
  compliance_keywords?: string[] | null;
}

export type ConstructionLeadStatus =
  | 'new'
  | 'reviewed'
  | 'qualified'
  | 'outreach_started'
  | 'contacted'
  | 'passed'
  | 'won';

/** Database row for construction_leads table */
export interface ConstructionLeadRow extends ConstructionLead {
  id: string;
  org_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  outreach_sent?: boolean;
  sent_at?: string | null;
  follow_up_sent?: boolean;
  follow_up_sent_at?: string | null;
  opened?: boolean;
  replied?: boolean;
  bounced?: boolean;
  unsubscribed?: boolean;
  open_rate_lang?: string | null;
  hil_feedback?: string | null;
  template_flag?: string | null;
}

/** Summary for morning briefing */
export interface ConstructionLeadsSummary {
  total: number;
  new_count: number;
  reviewed_count: number;
  qualified_count: number;
  outreach_count: number;
  contacted_count: number;
  deadlines_this_week: number;
}

/** Lead with deadline for briefing display */
export interface ConstructionLeadDeadline {
  id: string;
  title: string;
  buyer_name: string | null;
  country_code: string | null;
  estimated_value: number | null;
  currency: string;
  deadline_date: string;
  ted_url: string | null;
  status: ConstructionLeadStatus;
  relevance_score: number;
}

/** New lead for briefing display */
export interface ConstructionLeadNew {
  id: string;
  title: string;
  buyer_name: string | null;
  country_code: string | null;
  cpv_code: string | null;
  estimated_value: number | null;
  currency: string;
  publication_date: string | null;
  deadline_date: string | null;
  ted_url: string | null;
  relevance_score: number;
}

/** TED API query configuration */
export interface TedQueryConfig {
  /** CPV codes to search (default: 45000000 for construction) */
  cpvCodes: string[];
  /** Country codes to filter (ISO 3166-1 alpha-2) */
  countryCodes: string[];
  /** Number of days to look back for new notices */
  lookbackDays: number;
  /** Max results per query */
  maxResults: number;
}
