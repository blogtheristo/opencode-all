/**
 * TED Lead Sourcer — Automated Construction Lead Pipeline
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD
 * Branch: claude/improve-sales-call-script-xg1zO
 * Date: 2026-03-21
 * Owner: Lifetime Oy
 *
 * Queries the TED (Tenders Electronic Daily) Search API v3 to find
 * construction contract awards across EU countries, then outputs
 * structured lead data for the DWS sales pipeline.
 *
 * API docs: https://docs.ted.europa.eu/api/latest/search.html
 * Swagger:  https://api.ted.europa.eu/swagger
 *
 * Usage:
 *   npx tsx scripts/ted-lead-sourcer.ts
 *   npx tsx scripts/ted-lead-sourcer.ts --country=DEU --cpv=45210000 --days=7
 *   npx tsx scripts/ted-lead-sourcer.ts --min-value=5000000 --output=json
 */

import { generateSectorDM, cpvToSector, sectorLabel } from './ted-sector-hooks.js';

// ── Types ──────────────────────────────────────────────────────────────

interface TEDSearchRequest {
  query: string;
  fields: string[];
  limit: number;
  scope: 'ALL' | 'ACTIVE' | 'LATEST';
  checkQuerySyntax: boolean;
  paginationMode: 'PAGE_NUMBER' | 'ITERATION';
  pageNumber?: number;
  iterationNextToken?: string;
}

interface TEDSearchResponse {
  total: number;
  iterationNextToken?: string;
  results: TEDNotice[];
}

interface TEDNotice {
  'publication-number'?: string;
  'notice-title'?: string;
  'buyer-name'?: string;
  'buyer-country'?: string;
  'notice-type'?: string;
  'cpv'?: string;
  'estimated-total-value'?: string;
  'place-of-performance'?: string;
  'publication-date'?: string;
  'deadline-receipt-tenders'?: string;
  [key: string]: string | undefined;
}

interface ConstructionLead {
  publicationNumber: string;
  title: string;
  buyerName: string;
  buyerCountry: string;
  noticeType: string;
  cpv: string;
  estimatedValue: string;
  placeOfPerformance: string;
  publicationDate: string;
  tedUrl: string;
  dmLanguage: 'EN' | 'SV' | 'DE' | 'FI' | 'FR';
  suggestedRoles: string[];
  erpQualifier: string;
  dmPersonalization: string;
}

// ── Configuration ──────────────────────────────────────────────────────

const TED_API_BASE = 'https://api.ted.europa.eu/v3/notices/search';
const RATE_LIMIT_MS = 100; // 700 req/min = ~86ms between requests, use 100ms for safety

// Country → DM language mapping (from CONSTRUCTION_TEASER_DM.md)
const COUNTRY_TO_DM_LANGUAGE: Record<string, ConstructionLead['dmLanguage']> = {
  SWE: 'SV', DNK: 'SV', NOR: 'SV',
  DEU: 'DE', AUT: 'DE', CHE: 'DE',
  FIN: 'FI', EST: 'FI',
  FRA: 'FR', BEL: 'FR', LUX: 'FR',
  GBR: 'EN', IRL: 'EN', NLD: 'EN', POL: 'EN', ITA: 'EN', ESP: 'EN',
};

// Construction CPV codes (Section 5 of TED field note)
const CONSTRUCTION_CPV_CODES = {
  all: '45000000',           // All construction work
  sitePrep: '45100000',     // Site preparation
  civilEng: '45200000',     // Civil engineering
  buildings: '45210000',    // Building construction
  structural: '45220000',   // Structural engineering
  pipelines: '45230000',    // Pipelines, power lines
  installation: '45300000', // Building installation
  completion: '45400000',   // Building completion
  insulation: '45320000',   // Insulation (EPBD-relevant)
  hvac: '45331000',         // HVAC (EPBD-relevant)
};

// Compliance-signal search terms — companies tendering for these are already in buying mode
const COMPLIANCE_KEYWORDS = [
  'CSRD',
  'sustainability reporting',
  'carbon footprint',
  'Fit for 55',
  'EPBD compliance',
  'EN 15978',
  'lifecycle assessment',
];

// ERP qualifier — native integration angle increases conversion
const DWS_ERP_INTEGRATIONS = ['SAP', 'IFS', 'Monitor', 'Visma', 'Dynamics'] as const;

// ── CLI Args ───────────────────────────────────────────────────────────

function parseArgs(): {
  country: string;
  cpv: string;
  days: number;
  minValue: number;
  output: 'table' | 'json';
  limit: number;
} {
  const args = process.argv.slice(2);
  const get = (key: string, fallback: string): string => {
    const arg = args.find(a => a.startsWith(`--${key}=`));
    return arg ? arg.split('=')[1] : fallback;
  };

  return {
    country: get('country', ''),              // e.g., FIN, DEU, SWE (empty = all)
    cpv: get('cpv', CONSTRUCTION_CPV_CODES.all),
    days: parseInt(get('days', '30'), 10),    // Look back N days
    minValue: parseInt(get('min-value', '0'), 10),
    output: get('output', 'table') as 'table' | 'json',
    limit: parseInt(get('limit', '50'), 10),
  };
}

// ── API Client ─────────────────────────────────────────────────────────

async function searchTED(request: TEDSearchRequest): Promise<TEDSearchResponse> {
  const response = await fetch(TED_API_BASE, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`TED API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<TEDSearchResponse>;
}

function buildQuery(opts: ReturnType<typeof parseArgs>): string {
  const parts: string[] = [];

  // CPV filter — construction codes
  parts.push(`cpv=${opts.cpv}`);

  // Country filter
  if (opts.country) {
    parts.push(`buyer-country=${opts.country}`);
  }

  // Date filter — last N days
  const since = new Date();
  since.setDate(since.getDate() - opts.days);
  const dateStr = since.toISOString().slice(0, 10).replace(/-/g, '');
  parts.push(`publication-date>=${dateStr}`);

  return parts.join(' AND ');
}

// ── Transform ──────────────────────────────────────────────────────────

// DM personalization templates — reference the specific TED tender
// This turns cold outreach into a warm signal response
// DM personalization now uses sector-aware hooks from ted-sector-hooks.ts
// CPV code → sector → regulation-specific hook → localized DM with referral handoff

function noticeToLead(notice: TEDNotice): ConstructionLead {
  const country = notice['buyer-country'] || '';
  const pubNumber = notice['publication-number'] || '';
  const buyerName = notice['buyer-name'] || '(unknown buyer)';
  const title = notice['notice-title'] || '(no title)';
  const dmLang = COUNTRY_TO_DM_LANGUAGE[country] || 'EN';

  // Generate sector-aware DM opener (CPV → sector → regulation hook)
  const cpv = notice['cpv'] || '';
  const dmPersonalization = generateSectorDM(buyerName, title, cpv, dmLang);

  return {
    publicationNumber: pubNumber,
    title,
    buyerName,
    buyerCountry: country,
    noticeType: notice['notice-type'] || '',
    cpv: notice['cpv'] || '',
    estimatedValue: notice['estimated-total-value'] || '(not disclosed)',
    placeOfPerformance: notice['place-of-performance'] || country,
    publicationDate: notice['publication-date'] || '',
    tedUrl: `https://ted.europa.eu/en/notice/-/detail/${pubNumber}`,
    dmLanguage: dmLang,
    suggestedRoles: [
      'Head of Sustainability',
      'Chief Sustainability Officer',
      'Compliance Officer',
      'Head of Innovation',
      'CTO',
    ],
    erpQualifier: '(check LinkedIn/annual report for SAP, IFS, Monitor, Visma, Dynamics)',
    dmPersonalization,
  };
}

// ── Output ─────────────────────────────────────────────────────────────

function printTable(leads: ConstructionLead[]): void {
  console.log('\n=== TED Construction Leads ===\n');
  console.log(`Found ${leads.length} notices\n`);

  for (const lead of leads) {
    console.log(`--- ${lead.publicationNumber} ---`);
    console.log(`   Title:    ${lead.title}`);
    console.log(`   Buyer:    ${lead.buyerName} (${lead.buyerCountry})`);
    console.log(`   Type:     ${lead.noticeType}`);
    console.log(`   Value:    ${lead.estimatedValue}`);
    console.log(`   Date:     ${lead.publicationDate}`);
    console.log(`   DM Lang:  ${lead.dmLanguage}`);
    console.log(`   TED URL:  ${lead.tedUrl}`);
    console.log(`   ERP:      ${lead.erpQualifier}`);
    console.log(`   DM opener: "${lead.dmPersonalization}"`);
    console.log(`   Next:     Find "${lead.buyerName}" sustainability lead on LinkedIn`);
    console.log('');
  }
}

function printJson(leads: ConstructionLead[]): void {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    total: leads.length,
    source: 'TED API v3',
    query: buildQuery(parseArgs()),
    leads,
  }, null, 2));
}

// ── Main ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const opts = parseArgs();

  console.log('TED Lead Sourcer — DWS IQ 6');
  console.log('============================');
  console.log(`CPV:     ${opts.cpv} (${Object.entries(CONSTRUCTION_CPV_CODES).find(([, v]) => v === opts.cpv)?.[0] || 'custom'}) → ${sectorLabel(cpvToSector(opts.cpv))}`);
  console.log(`Country: ${opts.country || 'ALL'}`);
  console.log(`Days:    ${opts.days}`);
  console.log(`Limit:   ${opts.limit}`);
  console.log('');

  const query = buildQuery(opts);
  console.log(`Query: ${query}\n`);

  const fields = [
    'publication-number',
    'notice-title',
    'buyer-name',
    'buyer-country',
    'notice-type',
    'cpv',
    'estimated-total-value',
    'place-of-performance',
    'publication-date',
  ];

  try {
    const response = await searchTED({
      query,
      fields,
      limit: opts.limit,
      scope: 'ALL',
      checkQuerySyntax: false,
      paginationMode: 'PAGE_NUMBER',
      pageNumber: 1,
    });

    console.log(`TED returned ${response.total} total matches\n`);

    const leads = response.results.map(noticeToLead);

    if (opts.output === 'json') {
      printJson(leads);
    } else {
      printTable(leads);
    }

    // Summary by country
    const byCountry = leads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.buyerCountry] = (acc[lead.buyerCountry] || 0) + 1;
      return acc;
    }, {});

    console.log('\n--- Leads by Country ---');
    for (const [country, count] of Object.entries(byCountry).sort((a, b) => b[1] - a[1])) {
      const lang = COUNTRY_TO_DM_LANGUAGE[country] || 'EN';
      console.log(`  ${country}: ${count} leads → use ${lang} DM template`);
    }

    console.log('\n--- Next Steps ---');
    console.log('1. For each lead, search LinkedIn: "[Company] Head of Sustainability"');
    console.log('2. Check ERP: does the company use SAP, IFS, Monitor, Visma, or Dynamics?');
    console.log('   → If yes: mention native integration in DM ("we connect directly to your SAP")');
    console.log('   → If no: still a lead, but harder sell — focus on standalone value');
    console.log('3. Use the pre-generated DM opener (references the specific TED tender)');
    console.log('4. Use matching language DM template from CONSTRUCTION_TEASER_DM.md');
    console.log('5. Follow-up: one nudge on Day 3, then stop');
    console.log('6. Log in campaign tracking (see CONSTRUCTION_TEASER_DM.md § Campaign Tracking)');

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      if (error.message.includes('fetch')) {
        console.error('\nTip: Make sure you have internet access and api.ted.europa.eu is reachable.');
        console.error('The TED API is free and requires no authentication for search.');
      }
    }
    process.exit(1);
  }
}

main();
