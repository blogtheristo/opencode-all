/**
 * EU Construction Lead Sources Registry
 *
 * Catalogs known sources of European construction project leads:
 * public procurement databases, commercial platforms, and industry directories.
 *
 * Active sources have automated fetchers; reference sources are manual/future.
 *
 * Sources:
 *   - TED (Tenders Electronic Daily) — EU official, free, automated
 *   - DTAD — AI-powered, German-focused, commercial
 *   - Building Radar — Europe-wide, commercial
 *   - Mercell — Nordic + EU tenders, commercial
 *   - GlobalTenders — EU construction aggregator, commercial
 *   - Tendersinfo — EU government tenders, commercial
 */

// ============================================================================
// TYPES
// ============================================================================

export type LeadSourceStatus = 'active' | 'planned' | 'reference';
export type LeadSourceAccess = 'free' | 'freemium' | 'paid';
export type LeadSourceCoverage = 'eu-wide' | 'nordic' | 'dach' | 'uk' | 'global';

export interface LeadSource {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Website URL */
  url: string;
  /** Whether we have automated integration */
  status: LeadSourceStatus;
  /** Access model */
  access: LeadSourceAccess;
  /** Geographic coverage */
  coverage: LeadSourceCoverage[];
  /** What kind of leads it provides */
  leadTypes: string[];
  /** CPV or category filters available */
  hasConstructionFilter: boolean;
  /** API available for automated fetching */
  hasApi: boolean;
  /** Notes for the CEO briefing */
  briefingNote: string | null;
}

// ============================================================================
// SOURCE REGISTRY
// ============================================================================

export const LEAD_SOURCES: LeadSource[] = [
  {
    id: 'ted',
    name: 'TED (Tenders Electronic Daily)',
    description: 'EU official portal for public procurement notices. Free, anonymous API.',
    url: 'https://ted.europa.eu/en',
    status: 'active',
    access: 'free',
    coverage: ['eu-wide'],
    leadTypes: ['public tenders', 'contract notices', 'contract awards', 'prior information'],
    hasConstructionFilter: true,
    hasApi: true,
    briefingNote: 'Primary source. Automated daily fetch at 05:30 Helsinki.',
  },
  {
    id: 'dtad',
    name: 'DTAD Platform',
    description: 'AI-powered B2B lead platform. Decision-maker contacts, project stages, DACH focus.',
    url: 'https://www.dtad.com/en/construction',
    status: 'planned',
    access: 'paid',
    coverage: ['dach', 'eu-wide'],
    leadTypes: ['B2B leads', 'decision-maker contacts', 'project pipelines', 'planning-stage projects'],
    hasConstructionFilter: true,
    hasApi: true,
    briefingNote: 'Best for German/Austrian markets. API integration planned.',
  },
  {
    id: 'building-radar',
    name: 'Building Radar',
    description: 'Europe-wide construction project tracking. Infrastructure, commercial, industrial, residential.',
    url: 'https://buildingradar.com/',
    status: 'planned',
    access: 'paid',
    coverage: ['eu-wide', 'global'],
    leadTypes: ['planned projects', 'pre-construction', 'infrastructure', 'commercial', 'residential'],
    hasConstructionFilter: true,
    hasApi: true,
    briefingNote: 'Covers early-stage private projects not on TED.',
  },
  {
    id: 'mercell',
    name: 'Mercell',
    description: 'Comprehensive tender database. Strong Nordic and EU coverage. Used by many public entities.',
    url: 'https://info.mercell.com/en/public-tenders',
    status: 'planned',
    access: 'freemium',
    coverage: ['nordic', 'eu-wide'],
    leadTypes: ['public tenders', 'framework agreements', 'dynamic purchasing systems'],
    hasConstructionFilter: true,
    hasApi: true,
    briefingNote: 'Strong Nordic coverage. Many Finnish public tenders appear here before TED.',
  },
  {
    id: 'globaltenders',
    name: 'GlobalTenders',
    description: 'Dedicated European construction tender aggregator. RFPs and bids.',
    url: 'https://www.globaltenders.com/eu/europe-construction-work-tenders',
    status: 'reference',
    access: 'freemium',
    coverage: ['eu-wide', 'global'],
    leadTypes: ['construction tenders', 'RFPs', 'bids'],
    hasConstructionFilter: true,
    hasApi: false,
    briefingNote: null,
  },
  {
    id: 'tendersinfo',
    name: 'Tendersinfo',
    description: 'Large database of EU government and public tenders, including construction sector.',
    url: 'https://www.tendersinfo.com/europe-projects.php',
    status: 'reference',
    access: 'paid',
    coverage: ['eu-wide'],
    leadTypes: ['government tenders', 'public projects', 'construction contracts'],
    hasConstructionFilter: true,
    hasApi: false,
    briefingNote: null,
  },
];

// ============================================================================
// HELPERS
// ============================================================================

/** Get only active (automated) sources */
export function getActiveSources(): LeadSource[] {
  return LEAD_SOURCES.filter((s) => s.status === 'active');
}

/** Get sources planned for future integration */
export function getPlannedSources(): LeadSource[] {
  return LEAD_SOURCES.filter((s) => s.status === 'planned');
}

/** Get all source names with status for briefing display */
export function getSourcesSummary(): string {
  const active = getActiveSources();
  const planned = getPlannedSources();
  const parts: string[] = [];
  if (active.length > 0) {
    parts.push(`Active: ${active.map((s) => s.name.split(' (')[0]).join(', ')}`);
  }
  if (planned.length > 0) {
    parts.push(`Planned: ${planned.map((s) => s.name.split(' (')[0]).join(', ')}`);
  }
  return parts.join(' | ');
}

/** Get total source count by status */
export function getSourceCounts(): { active: number; planned: number; reference: number; total: number } {
  return {
    active: LEAD_SOURCES.filter((s) => s.status === 'active').length,
    planned: LEAD_SOURCES.filter((s) => s.status === 'planned').length,
    reference: LEAD_SOURCES.filter((s) => s.status === 'reference').length,
    total: LEAD_SOURCES.length,
  };
}
