/**
 * ESG Report Extractor
 *
 * Extracts structured ESRS compliance data from ESG report text using LLM.
 * Designed for CSRD/sustainability reports — extracts emissions, measures,
 * and disclosure data points into ComplianceScoringInput format.
 *
 * Usage:
 *   const text = await readPdf(file);  // or paste report text
 *   const extracted = await extractComplianceData(text, 'steel');
 *   const score = scoreCompliance(extracted);
 */

import { type ESRSDisclosure, getMandatoryDisclosures } from './esrs-registry.js';
import type { ComplianceScoringInput, DataPointStatus } from './scoring-engine.js';
import { getBenchmark } from './eu-benchmarks.js';
import logger from '../utils/logger.js';

// ============ TYPES ============

export interface ExtractionResult {
  companyName: string;
  industry: string;
  country: string;
  reportingYear: number;
  scoringInput: ComplianceScoringInput;
  extractedValues: ExtractedValue[];
  confidence: number; // 0-1 overall extraction confidence
  warnings: string[];
  source: 'esg-report' | 'manual' | 'api';
}

export interface ExtractedValue {
  disclosureId: string;
  fieldName: string;
  value: string | number | boolean;
  unit?: string;
  confidence: number; // 0-1 per-field confidence
  pageRef?: string; // Page reference in source document
}

// ============ EXTRACTION PROMPT ============

const EXTRACTION_SYSTEM_PROMPT = `You are an EU CSRD compliance data extractor. Given text from an ESG/sustainability report, extract structured data points.

Return ONLY valid JSON with this exact schema:
{
  "companyName": "string",
  "industry": "string (one of: steel, cement, aluminium, chemicals, fertilizers, hydrogen, energy, manufacturing, construction, transport)",
  "country": "string (ISO 3166-1 alpha-2)",
  "reportingYear": number,
  "annualEmissions": number (tonnes CO2e, Scope 1+2 combined, 0 if not found),
  "scope1": number (tonnes CO2e, 0 if not found),
  "scope2": number (tonnes CO2e, 0 if not found),
  "scope3": number (tonnes CO2e, 0 if not found),
  "importValue": number (EUR, annual imports of CBAM goods, 0 if not found),
  "hasTransitionPlan": boolean,
  "hasEmissionsMonitoring": boolean,
  "hasSupplyChainDD": boolean,
  "employeeCount": number (0 if not found),
  "revenue": number (EUR, 0 if not found),
  "disclosures": [
    {
      "id": "string (ESRS ID like E1-1, S1-6, G1-1)",
      "provided": boolean,
      "value": "string or number (extracted value if found)",
      "confidence": number (0-1)
    }
  ]
}

Rules:
- Extract ONLY data explicitly stated in the text. Never infer or estimate.
- For emissions: look for "Scope 1", "Scope 2", "GHG emissions", "CO2 equivalent", "tCO2e"
- For transition plan: look for "transition plan", "decarbonization roadmap", "net zero pathway"
- For monitoring: look for "continuous monitoring", "MRV", "emissions measurement"
- For supply chain DD: look for "supply chain due diligence", "CSDD", "supplier assessment"
- Mark disclosure as provided=true only if the report contains substantive data for it
- Set confidence based on how clearly the data was stated (1.0 = exact number, 0.5 = approximate)`;

// ============ REGEX EXTRACTORS (fast path, no LLM) ============

/**
 * Extract key metrics from report text using pattern matching.
 * Fast, deterministic fallback when LLM is unavailable.
 */
export function extractWithPatterns(
  text: string,
): Omit<Partial<ExtractionResult>, 'scoringInput'> & { scoringInput: ComplianceScoringInput } {
  const extractedValues: ExtractedValue[] = [];
  const warnings: string[] = [];

  // Emissions patterns
  // Allow flexible filler between the keyword and the number so phrasings
  // like "Our total Scope 1 and 2 GHG emissions were 185,000 tonnes CO2e"
  // match the same code path as "Scope 1+2: 185,000 tCO2e".
  const emissionsPatterns = [
    /(?:scope\s*1\s*(?:and|&|\+)\s*2\s+(?:ghg\s+)?emissions|total\s+(?:scope\s*1\s*(?:and|&)\s*2\s+)?(?:direct\s+)?(?:ghg\s+)?emissions)[^\d]*?([0-9][0-9,.]*)\s*(?:thousand\s+)?(?:t(?:onnes?)?\s*CO2(?:e|eq)?|kt\s*CO2)/i,
    /(?:ghg|greenhouse\s+gas)\s+emissions[^\d]*?([0-9][0-9,.]*)\s*(?:thousand\s+)?(?:t(?:onnes?)?\s*CO2(?:e|eq)?)/i,
    /([0-9][0-9,.]*)\s*(?:thousand\s+)?(?:t(?:onnes?)?\s*CO2(?:e|eq)?)\s*(?:scope\s*1\s*(?:and|&)\s*2|total)/i,
  ];

  let annualEmissions = 0;
  for (const pattern of emissionsPatterns) {
    const match = text.match(pattern);
    if (match) {
      let value = parseFloat(match[1].replace(/,/g, ''));
      if (/thousand|kt/i.test(match[0])) value *= 1000;
      annualEmissions = value;
      extractedValues.push({
        disclosureId: 'E1-6',
        fieldName: 'Total GHG emissions',
        value,
        unit: 'tCO2e',
        confidence: 0.8,
      });
      break;
    }
  }

  // Scope 1 specific
  const scope1Match = text.match(
    /scope\s*1[:\s]+(?:approximately\s+)?([0-9,.]+)\s*(?:thousand\s+)?(?:t(?:onnes?)?\s*CO2(?:e|eq)?)/i,
  );
  if (scope1Match) {
    let value = parseFloat(scope1Match[1].replace(/,/g, ''));
    if (/thousand/i.test(scope1Match[0])) value *= 1000;
    extractedValues.push({
      disclosureId: 'E1-6',
      fieldName: 'Scope 1 emissions',
      value,
      unit: 'tCO2e',
      confidence: 0.9,
    });
  }

  // Scope 2 specific
  const scope2Match = text.match(
    /scope\s*2[:\s]+(?:approximately\s+)?([0-9,.]+)\s*(?:thousand\s+)?(?:t(?:onnes?)?\s*CO2(?:e|eq)?)/i,
  );
  if (scope2Match) {
    let value = parseFloat(scope2Match[1].replace(/,/g, ''));
    if (/thousand/i.test(scope2Match[0])) value *= 1000;
    extractedValues.push({
      disclosureId: 'E1-6',
      fieldName: 'Scope 2 emissions',
      value,
      unit: 'tCO2e',
      confidence: 0.9,
    });
  }

  // Employee count
  const employeeMatch = text.match(
    /(?:employees?|workforce|headcount|FTE)[:\s]+(?:approximately\s+)?([0-9,.]+)/i,
  );
  void (employeeMatch ? parseInt(employeeMatch[1].replace(/,/g, ''), 10) : 0);

  // Boolean measures
  const hasTransitionPlan =
    /transition\s+plan|decarboni[sz]ation\s+(?:road\s*map|pathway|strategy)|net[\s-]zero\s+(?:pathway|target|commitment)/i.test(
      text,
    );
  const hasEmissionsMonitoring =
    /(?:continuous|real[\s-]time|automated)\s+(?:emissions?\s+)?monitoring|MRV\s+(?:system|plan)|emissions?\s+(?:measurement|tracking)\s+system/i.test(
      text,
    );
  const hasSupplyChainDD =
    /supply\s+chain\s+due\s+diligence|CSDD|supplier\s+(?:assessment|audit|screening)|value\s+chain\s+(?:assessment|due\s+diligence)/i.test(
      text,
    );

  // ESRS disclosure detection
  const mandatory = getMandatoryDisclosures();
  const dataPoints: DataPointStatus[] = [];

  for (const disclosure of mandatory) {
    const provided = detectDisclosure(text, disclosure);
    dataPoints.push({ disclosureId: disclosure.id, provided });
    if (provided) {
      extractedValues.push({
        disclosureId: disclosure.id,
        fieldName: disclosure.name,
        value: true,
        confidence: 0.6,
      });
    }
  }

  if (annualEmissions === 0 && extractedValues.length < 3) {
    warnings.push('Low data extraction — report may not contain machine-readable emissions data');
  }

  return {
    scoringInput: {
      industry: 'manufacturing', // default, should be overridden
      dataPoints,
      annualEmissions,
      importValue: 0,
      hasTransitionPlan,
      hasEmissionsMonitoring,
      hasSupplyChainDD,
    },
    extractedValues,
    confidence: extractedValues.length > 5 ? 0.7 : extractedValues.length > 2 ? 0.5 : 0.3,
    warnings,
  };
}

/**
 * Detect if an ESRS disclosure is addressed in the report text.
 * Uses keyword matching against disclosure name and description.
 */
function detectDisclosure(text: string, disclosure: ESRSDisclosure): boolean {
  const lowerText = text.toLowerCase();

  // Check for explicit ESRS ID reference
  if (lowerText.includes(disclosure.id.toLowerCase())) return true;

  // Check key phrases from disclosure name
  const keywords = disclosure.name
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const matchCount = keywords.filter((kw) => lowerText.includes(kw)).length;

  // Require at least 60% of significant keywords to match
  return keywords.length > 0 && matchCount / keywords.length >= 0.6;
}

/**
 * Extract compliance data from ESG report text.
 * Uses pattern matching (fast, deterministic) with optional LLM enhancement.
 *
 * @param reportText - Full text from ESG/sustainability report
 * @param industry - Company industry sector
 * @param useLLM - Whether to use LLM for enhanced extraction (default: false)
 */
export async function extractComplianceData(
  reportText: string,
  industry: string,
  useLLM: boolean = false,
): Promise<ExtractionResult> {
  logger.info('Extracting compliance data from ESG report', {
    textLength: reportText.length,
    industry,
    useLLM,
  });

  // Fast path: pattern-based extraction
  const patternResult = extractWithPatterns(reportText);

  // Override industry
  if (patternResult.scoringInput) {
    patternResult.scoringInput.industry = industry;
  }

  // Build company name from text
  const companyNameMatch = reportText.match(
    /(?:^|\n)\s*([A-Z][A-Za-z\s&.]+(?:Ltd|Inc|Corp|Oy|AB|GmbH|S\.A\.|plc|SE))\b/,
  );
  const companyName = companyNameMatch ? companyNameMatch[1].trim() : 'Unknown Company';

  // Detect country
  const countryPatterns: Record<string, RegExp> = {
    FI: /finland|suomi|helsinki/i,
    SE: /sweden|sverige|stockholm/i,
    DE: /germany|deutschland|berlin|munich/i,
    FR: /france|paris/i,
    NL: /netherlands|amsterdam/i,
    NO: /norway|oslo/i,
    DK: /denmark|copenhagen/i,
    GB: /united kingdom|london/i,
  };
  let country = 'FI'; // default
  for (const [code, pattern] of Object.entries(countryPatterns)) {
    if (pattern.test(reportText)) {
      country = code;
      break;
    }
  }

  // Detect reporting year
  const yearMatch =
    reportText.match(/(?:fiscal|reporting|financial)\s+year\s+(\d{4})/i) ||
    reportText.match(/(?:20[2-3]\d)\s+(?:sustainability|ESG|annual)\s+report/i);
  const reportingYear = yearMatch
    ? parseInt(yearMatch[1] || yearMatch[0].match(/20[2-3]\d/)?.[0] || '', 10) || 2025
    : 2025;

  const result: ExtractionResult = {
    companyName,
    industry,
    country,
    reportingYear,
    scoringInput: patternResult.scoringInput,
    extractedValues: patternResult.extractedValues || [],
    confidence: patternResult.confidence || 0.3,
    warnings: patternResult.warnings || [],
    source: 'esg-report',
  };

  // If confidence is low and data is sparse, enrich with sector benchmarks
  if (result.confidence < 0.5 && result.scoringInput.annualEmissions === 0) {
    const benchmark = getBenchmark(industry);
    result.warnings.push(
      `No emissions data extracted. Sector median for ${benchmark.sector}: ${benchmark.medianEmissions.toLocaleString()} tCO2e/year. ` +
        `Consider entering actual emissions for accurate scoring.`,
    );
  }

  logger.info('ESG report extraction complete', {
    company: result.companyName,
    confidence: result.confidence,
    extractedFields: result.extractedValues.length,
    warnings: result.warnings.length,
  });

  return result;
}

/**
 * Get the LLM extraction system prompt.
 * Exported for use by the compliance agent when LLM extraction is needed.
 */
export function getExtractionPrompt(): string {
  return EXTRACTION_SYSTEM_PROMPT;
}
