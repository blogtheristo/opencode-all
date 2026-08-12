import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

type SeedRecord = {
  concept_id: string;
  scope_type: string;
  scope_ref: string | null;
  platform_version: string | null;
  product_edition: string | null;
  legal_profile: string | null;
  cloud_profile: string | null;
  locale: string;
  policy_level: string;
  preferred_term: string;
  definition_override: string | null;
  source_version: string;
};

type SeedJson = {
  source_version: string;
  defaults?: Partial<Record<'platform_version' | 'product_edition' | 'legal_profile' | 'cloud_profile', string | null>>;
  records?: Array<Record<string, unknown>>;
  forbidden_rules?: Array<Record<string, unknown>>;
};

const START_MARKER = '<!-- CCP_SEED_START -->';
const END_MARKER = '<!-- CCP_SEED_END -->';

function parseCliArgs(argv: string[]) {
  let ontologyPath: string | undefined;
  let outputPath: string | undefined;

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--output') {
      outputPath = argv[i + 1];
      i += 1;
      continue;
    }
    if (!token.startsWith('--') && !ontologyPath) {
      ontologyPath = token;
    }
  }

  return { ontologyPath, outputPath };
}

function extractJsonFence(block: string): string {
  const jsonFenceStart = block.indexOf('```json');
  if (jsonFenceStart === -1) {
    throw new Error('JSON code fence not found between CCP seed markers');
  }

  const jsonStart = block.indexOf('\n', jsonFenceStart);
  if (jsonStart === -1) {
    throw new Error('Invalid JSON code fence in CCP seed block');
  }

  const fenceEnd = block.indexOf('```', jsonStart + 1);
  if (fenceEnd === -1) {
    throw new Error('Closing JSON code fence not found in CCP seed block');
  }

  return block.slice(jsonStart + 1, fenceEnd).trim();
}

function parseSeedJson(ontologyText: string): SeedJson {
  const start = ontologyText.indexOf(START_MARKER);
  const end = ontologyText.indexOf(END_MARKER);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('CCP seed markers not found in ONTOLOGY.md');
  }

  const block = ontologyText.slice(start + START_MARKER.length, end).trim();
  const jsonText = extractJsonFence(block);
  return JSON.parse(jsonText) as SeedJson;
}

function ensureString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing or invalid required field: ${field}`);
  }
  return value;
}

function normalizeRecord(
  raw: Record<string, unknown>,
  defaults: SeedJson['defaults'],
  blockSourceVersion: string
): SeedRecord {
  const conceptId = ensureString(raw.concept_id, 'concept_id');
  const scopeType = ensureString(raw.scope_type, 'scope_type');
  const preferredTerm = ensureString(raw.preferred_term, 'preferred_term');
  const recordSourceVersion =
    typeof raw.source_version === 'string' && raw.source_version.length > 0
      ? raw.source_version
      : blockSourceVersion;

  let scopeRef = (raw.scope_ref as string | null | undefined) ?? null;
  if (scopeType === 'lwm' && scopeRef == null) {
    scopeRef = recordSourceVersion;
  }

  return {
    concept_id: conceptId,
    scope_type: scopeType,
    scope_ref: scopeRef,
    platform_version: (raw.platform_version as string | null | undefined) ?? defaults?.platform_version ?? null,
    product_edition: (raw.product_edition as string | null | undefined) ?? defaults?.product_edition ?? null,
    legal_profile: (raw.legal_profile as string | null | undefined) ?? defaults?.legal_profile ?? null,
    cloud_profile: (raw.cloud_profile as string | null | undefined) ?? defaults?.cloud_profile ?? null,
    locale: (raw.locale as string | undefined) ?? 'en',
    policy_level: (raw.policy_level as string | undefined) ?? 'preferred',
    preferred_term: preferredTerm,
    definition_override: (raw.definition_override as string | null | undefined) ?? null,
    source_version: recordSourceVersion
  };
}

function expandForbiddenRules(
  forbiddenRules: SeedJson['forbidden_rules'],
  defaults: SeedJson['defaults'],
  blockSourceVersion: string
): SeedRecord[] {
  if (!Array.isArray(forbiddenRules)) return [];
  const rows: SeedRecord[] = [];

  for (const rawRule of forbiddenRules) {
    if (!rawRule || typeof rawRule !== 'object') {
      throw new Error('Invalid forbidden rule in ontology seed block');
    }
    const rule = rawRule as Record<string, unknown>;
    const conceptId = ensureString(rule.concept_id, 'forbidden_rules[].concept_id');
    const preferredTerm = ensureString(rule.preferred_term, 'forbidden_rules[].preferred_term');
    const scopeType = (rule.scope_type as string | undefined) ?? 'customer';
    const sourceVersion =
      typeof rule.source_version === 'string' && rule.source_version.length > 0
        ? rule.source_version
        : blockSourceVersion;

    const forbiddenIn = Array.isArray(rule.forbidden_in) ? (rule.forbidden_in as unknown[]) : [];
    const locales =
      Array.isArray(rule.locales) && rule.locales.length > 0 ? (rule.locales as string[]) : ['en'];

    for (const scopeRefRaw of forbiddenIn) {
      const scopeRef = ensureString(scopeRefRaw, 'forbidden_rules[].forbidden_in[]');
      for (const localeRaw of locales) {
        const locale = ensureString(localeRaw, 'forbidden_rules[].locales[]');
        rows.push({
          concept_id: conceptId,
          scope_type: scopeType,
          scope_ref: scopeRef,
          platform_version: (rule.platform_version as string | null | undefined) ?? defaults?.platform_version ?? null,
          product_edition: (rule.product_edition as string | null | undefined) ?? defaults?.product_edition ?? null,
          legal_profile: (rule.legal_profile as string | null | undefined) ?? defaults?.legal_profile ?? null,
          cloud_profile: (rule.cloud_profile as string | null | undefined) ?? defaults?.cloud_profile ?? null,
          locale,
          policy_level: 'forbidden',
          preferred_term: preferredTerm,
          definition_override: (rule.definition_override as string | null | undefined) ?? null,
          source_version: sourceVersion
        });
      }
    }
  }

  return rows;
}

function validateNoDuplicateContext(rows: SeedRecord[]) {
  const seen = new Set<string>();
  for (const row of rows) {
    const key = [
      row.concept_id,
      row.scope_type,
      row.scope_ref ?? '__global__',
      row.platform_version ?? '__any__',
      row.product_edition ?? '__any__',
      row.legal_profile ?? '__any__',
      row.cloud_profile ?? '__any__',
      row.locale
    ].join('|');
    if (seen.has(key)) {
      throw new Error(`Duplicate ontology seed context detected: ${key}`);
    }
    seen.add(key);
  }
}

function validateForbiddenHasScopeRef(rows: SeedRecord[]) {
  for (const row of rows) {
    if (row.policy_level === 'forbidden' && row.scope_ref == null) {
      throw new Error(
        `Forbidden policy must define scope_ref (global forbidden not allowed): ${row.concept_id}/${row.scope_type}/${row.locale}`
      );
    }
  }
}

function sortDeterministically(rows: SeedRecord[]): SeedRecord[] {
  return [...rows].sort((a, b) => {
    if (a.concept_id < b.concept_id) return -1;
    if (a.concept_id > b.concept_id) return 1;
    if (a.scope_type < b.scope_type) return -1;
    if (a.scope_type > b.scope_type) return 1;
    return 0;
  });
}

function sqlLiteral(value: string | null): string {
  if (value == null) return 'NULL';
  return `'${value.replace(/'/g, "''")}'`;
}

function buildValuesSql(rows: SeedRecord[]): string {
  return rows
    .map(
      (row) =>
        `      (${[
          sqlLiteral(row.concept_id),
          `${sqlLiteral(row.scope_type)}::scope_type_enum`,
          sqlLiteral(row.scope_ref),
          sqlLiteral(row.platform_version),
          sqlLiteral(row.product_edition),
          sqlLiteral(row.legal_profile),
          sqlLiteral(row.cloud_profile),
          sqlLiteral(row.locale),
          `${sqlLiteral(row.policy_level)}::policy_level_enum`,
          sqlLiteral(row.preferred_term),
          sqlLiteral(row.definition_override)
        ].join(', ')})`
    )
    .join(',\n');
}

function buildSql(sourceVersion: string, rows: SeedRecord[]): string {
  return `-- Seed 059: concept_context_policy generated from ONTOLOGY.md
-- Source version: ${sourceVersion}
-- Generated by: scripts/parse-ontology.ts
-- Do not edit manually. Update ONTOLOGY.md CCP seed block and regenerate.

BEGIN;

WITH seed_rows AS (
  SELECT * FROM (
    VALUES
${buildValuesSql(rows)}
  ) AS v(
    concept_id,
    scope_type,
    scope_ref,
    platform_version,
    product_edition,
    legal_profile,
    cloud_profile,
    locale,
    policy_level,
    preferred_term,
    definition_override
  )
)
INSERT INTO concept_context_policy (
  concept_id,
  scope_type,
  scope_ref,
  platform_version,
  product_edition,
  legal_profile,
  cloud_profile,
  locale,
  policy_level,
  preferred_term,
  definition_override
)
SELECT
  concept_id,
  scope_type,
  scope_ref,
  platform_version,
  product_edition,
  legal_profile,
  cloud_profile,
  locale,
  policy_level,
  preferred_term,
  definition_override
FROM seed_rows
ON CONFLICT (
  concept_id,
  scope_type,
  (COALESCE(scope_ref, '__global__')),
  (COALESCE(platform_version, '__any__')),
  (COALESCE(product_edition, '__any__')),
  (COALESCE(legal_profile, '__any__')),
  (COALESCE(cloud_profile, '__any__')),
  locale
)
DO UPDATE SET
  policy_level = EXCLUDED.policy_level,
  preferred_term = EXCLUDED.preferred_term,
  definition_override = EXCLUDED.definition_override,
  updated_at = NOW();

COMMIT;
`;
}

export async function generateOntologySeed(ontologyFilePath: string, outputPath?: string): Promise<string> {
  const ontologyText = await readFile(ontologyFilePath, 'utf8');
  const parsed = parseSeedJson(ontologyText);

  const blockSourceVersion = ensureString(parsed.source_version, 'source_version');
  const defaults = parsed.defaults ?? {};
  const recordsRaw = Array.isArray(parsed.records) ? parsed.records : [];

  const normalized = recordsRaw.map((r) =>
    normalizeRecord(r as Record<string, unknown>, defaults, blockSourceVersion)
  );
  normalized.push(...expandForbiddenRules(parsed.forbidden_rules, defaults, blockSourceVersion));

  if (normalized.length === 0) {
    throw new Error('No seed rows parsed from ONTOLOGY.md');
  }

  validateNoDuplicateContext(normalized);
  validateForbiddenHasScopeRef(normalized);
  const sortedRows = sortDeterministically(normalized);
  const sql = buildSql(blockSourceVersion, sortedRows);

  if (outputPath) {
    const outDir = path.dirname(outputPath);
    await mkdir(outDir, { recursive: true });
    await writeFile(outputPath, sql, 'utf8');
  }

  return sql;
}

async function main() {
  const { ontologyPath, outputPath } = parseCliArgs(process.argv.slice(2));
  const resolvedOntologyPath = path.resolve(process.cwd(), ontologyPath ?? 'ONTOLOGY.md');
  const resolvedOutputPath = outputPath
    ? path.resolve(process.cwd(), outputPath)
    : undefined;

  const sql = await generateOntologySeed(resolvedOntologyPath, resolvedOutputPath);
  if (resolvedOutputPath) {
    process.stdout.write(`Generated ${resolvedOutputPath}\n`);
  } else {
    process.stdout.write(sql);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  });
}
