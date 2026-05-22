#!/usr/bin/env tsx
/**
 * Import 80_construction_CEO.md contacts to Supabase investor_outreach_contacts
 *
 * Usage: tsx scripts/import-80-construction-CEO.ts
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_KEY (from .env or env)
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// CONFIG
// ============================================================================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  console.error('   Set via .env or: SUPABASE_URL=... SUPABASE_SERVICE_KEY=... tsx scripts/import-80-construction-CEO.ts');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================================================
// TYPES
// ============================================================================

interface ParsedContact {
  company: string;
  name: string;
  title: string;
  role_type: string;
  division: string;
  country: string;
  linkedin_url: string | null;
  contact_email: string | null;
  contact_other: string | null;
  notes: string;
  priority_rank: number | null;
  tags: string[];
}

// ============================================================================
// PARSING
// ============================================================================

function stripBold(text: string): string {
  return text.replace(/\*\*/g, '').trim();
}

function extractEmail(contact: string): string | null {
  const match = contact.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

function extractLinkedInUrl(contact: string): string | null {
  const match = contact.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/);
  if (match) {
    const slug = match[0].replace('linkedin.com/in/', '');
    return `https://www.linkedin.com/in/${slug}`;
  }
  return null;
}

function parseContactRow(
  cells: string[],
  company: string,
  priorityMap: Map<string, number>
): ParsedContact | null {
  if (cells.length < 8) return null;
  const num = cells[1]?.trim();
  const nameRaw = cells[2]?.trim() || '';
  const title = cells[3]?.trim() || '';
  const contactCol = cells[4]?.trim() || '';
  const country = (cells[5]?.trim() || '').split('/')[0].trim(); // First if "Austria/Germany"
  const roleType = cells[6]?.trim() || '';
  const division = cells[7]?.trim() || '';
  const notes = cells[8]?.trim() || '';

  const name = stripBold(nameRaw);
  if (!name || name.startsWith('[')) return null; // Skip placeholder rows like [Sustainability Director]

  const linkedin_url = extractLinkedInUrl(contactCol);
  const contact_email = extractEmail(contactCol);
  let contact_other: string | null = null;
  if (!linkedin_url && !contact_email && contactCol) {
    contact_other = contactCol.length > 500 ? contactCol.slice(0, 500) : contactCol;
  }

  // Match priority: "Skanska AB" -> try "Skanska", "NCC AB" -> "NCC"
  const companyShort = company.split(/\s+/)[0];
  const priority_rank =
    priorityMap.get(`${name}|${company}`) ??
    priorityMap.get(`${name}|${companyShort}`) ??
    null;

  const tags: string[] = [];
  if (priority_rank !== null) tags.push('priority');
  if (notes.toLowerCase().includes('multi-agent') || notes.toLowerCase().includes('multi agent')) tags.push('multi_agent');
  if (notes.toLowerCase().includes('esg') || notes.toLowerCase().includes('sustainability')) tags.push('esg');
  if (notes.toLowerCase().includes('compliance') || notes.toLowerCase().includes('nis2')) tags.push('compliance');
  if (notes.toLowerCase().includes('digital') || notes.toLowerCase().includes('cdo') || notes.toLowerCase().includes('cto')) tags.push('digital');

  return {
    company,
    name,
    title,
    role_type: roleType,
    division,
    country,
    linkedin_url,
    contact_email,
    contact_other,
    notes,
    priority_rank,
    tags,
  };
}

function parseMarkdown(content: string): { contacts: ParsedContact[]; priorityMap: Map<string, number> } {
  const priorityMap = new Map<string, number>();
  const contacts: ParsedContact[] = [];
  const lines = content.split('\n');

  let currentCompany = '';
  let inTable = false;
  const tableColumns: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Company section: ## NCC AB (Sweden) — 8 Contacts
    const companyMatch = line.match(/^## (.+?) \([^)]+\)/);
    if (companyMatch) {
      currentCompany = companyMatch[1].trim();
      inTable = false;
      continue;
    }

    // Priority table: | 1 | **Lena Hök** | Skanska | EVP Sustainability...
    if (line.includes('| Rank |') || line.includes('| # | Name |')) {
      inTable = false;
    }
    if (line.match(/^\| \d+ \| \*\*[^|]+\*\* \| [^|]+ \| [^|]+ \| [^|]+ \|/)) {
      // Priority table format
      const cells = line.split('|').map((c) => c.trim());
      if (cells.length >= 5) {
        const rank = parseInt(cells[1], 10);
        const name = stripBold(cells[2] || '');
        const company = cells[3]?.trim() || '';
        if (name && company && !isNaN(rank)) {
          priorityMap.set(`${name}|${company}`, rank);
        }
      }
      continue;
    }

    // Data table: | 1 | **Tomas Carlsson** | President and CEO | ...
    if (line.startsWith('|') && line.includes('|') && currentCompany) {
      const cells = line.split('|').map((c) => c.trim());
      if (cells[1] && /^\d+$/.test(cells[1]) && cells[2] && cells[2].includes('**')) {
        const contact = parseContactRow(cells, currentCompany, priorityMap);
        if (contact) contacts.push(contact);
      }
    }
  }

  return { contacts, priorityMap };
}

// ============================================================================
// IMPORT
// ============================================================================

async function runImport(): Promise<void> {
  const mdPath = path.resolve(__dirname, '../investor-outreach/80_construction_CEO.md');
  if (!fs.existsSync(mdPath)) {
    console.error(`❌ File not found: ${mdPath}`);
    process.exit(1);
  }

  console.log('📂 Reading:', mdPath);
  const content = fs.readFileSync(mdPath, 'utf-8');
  const { contacts } = parseMarkdown(content);

  console.log(`📊 Parsed ${contacts.length} contacts`);

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (const c of contacts) {
    try {
      const { error } = await supabase.from('investor_outreach_contacts').upsert(
        {
          source_document: '80_construction_CEO',
          company: c.company,
          name: c.name,
          title: c.title || null,
          role_type: c.role_type || null,
          division: c.division || null,
          country: c.country || null,
          linkedin_url: c.linkedin_url,
          contact_email: c.contact_email,
          contact_other: c.contact_other,
          notes: c.notes || null,
          priority_rank: c.priority_rank,
          tags: c.tags.length > 0 ? c.tags : null,
        },
        {
          onConflict: 'source_document,company,name',
          ignoreDuplicates: false,
        }
      );

      if (error) {
        throw error;
      }
      successCount++;
      if (successCount <= 5 || successCount % 20 === 0) {
        console.log(`  ✅ ${successCount}: ${c.name} (${c.company})`);
      }
    } catch (err: any) {
      errorCount++;
      errors.push(`${c.name} (${c.company}): ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Upserted: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  if (errors.length > 0) {
    console.log('\n🔍 ERROR DETAILS:');
    errors.slice(0, 10).forEach((e) => console.log(`  - ${e}`));
    if (errors.length > 10) console.log(`  ... and ${errors.length - 10} more`);
  }
  console.log('='.repeat(60));
}

// ============================================================================
// RUN
// ============================================================================

runImport()
  .then(() => {
    console.log('\n✅ Import complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Import failed:', err);
    process.exit(1);
  });
