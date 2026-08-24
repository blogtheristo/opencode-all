#!/usr/bin/env tsx
/**
 * Firehorse Omnichannel Next Pilot - CSV Lead Import Script
 *
 * Import leads from CSV file to Firehorse database
 *
 * CSV Format:
 * email,first_name,last_name,company,title,country,linkedin_url,segment,notes
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

// ============================================================================
// CONFIG
// ============================================================================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================================================
// TYPES
// ============================================================================

interface CSVLead {
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  title: string;
  country: 'FI' | 'SE' | 'NO' | 'DK' | 'DE';
  linkedin_url?: string;
  segment?: string;
  notes?: string;
}

// ============================================================================
// MAIN IMPORT FUNCTION
// ============================================================================

async function importLeadsFromCSV(csvFilePath: string): Promise<void> {
  console.log('📂 Reading CSV file:', csvFilePath);

  // Read CSV file
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

  // Parse CSV
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CSVLead[];

  console.log(`📊 Found ${records.length} leads in CSV`);

  // Validate and import leads
  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (const record of records) {
    try {
      // Validate required fields
      if (!record.email || !record.country) {
        throw new Error(`Missing required fields (email or country)`);
      }

      // Validate country
      const validCountries = ['FI', 'SE', 'NO', 'DK', 'DE'];
      if (!validCountries.includes(record.country)) {
        throw new Error(`Invalid country: ${record.country}. Must be one of: ${validCountries.join(', ')}`);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(record.email)) {
        throw new Error(`Invalid email format: ${record.email}`);
      }

      // Insert lead
      const { data, error } = await supabase
        .from('firehorse_leads')
        .insert({
          email: record.email.toLowerCase().trim(),
          first_name: record.first_name?.trim() || null,
          last_name: record.last_name?.trim() || null,
          company: record.company?.trim() || null,
          title: record.title?.trim() || null,
          country: record.country,
          linkedin_url: record.linkedin_url?.trim() || null,
          segment: record.segment?.trim() || 'Infra/Construction',
          state: 'New',
        })
        .select()
        .single();

      if (error) {
        // Check if email already exists
        if (error.code === '23505') {
          console.log(`⚠️  Lead already exists: ${record.email}`);
          errorCount++;
          errors.push(`${record.email}: Already exists`);
          continue;
        }
        throw error;
      }

      console.log(`✅ Imported: ${record.email} (${record.company})`);
      successCount++;
    } catch (err: any) {
      console.error(`❌ Error importing ${record.email}:`, err.message);
      errorCount++;
      errors.push(`${record.email}: ${err.message}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(80));
  console.log(`✅ Successfully imported: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);

  if (errors.length > 0) {
    console.log('\n🔍 ERROR DETAILS:');
    errors.forEach((err) => console.log(`  - ${err}`));
  }

  console.log('='.repeat(80));
}

// ============================================================================
// CLI
// ============================================================================

const csvFilePath = process.argv[2];

if (!csvFilePath) {
  console.error('❌ Usage: tsx scripts/import-leads-csv.ts <path-to-csv-file>');
  console.error('\nExample:');
  console.error('  tsx scripts/import-leads-csv.ts data/leads.csv');
  process.exit(1);
}

const fullPath = path.resolve(csvFilePath);

if (!fs.existsSync(fullPath)) {
  console.error(`❌ File not found: ${fullPath}`);
  process.exit(1);
}

// Run import
importLeadsFromCSV(fullPath)
  .then(() => {
    console.log('\n✅ Import complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Import failed:', err);
    process.exit(1);
  });
