#!/usr/bin/env npx tsx
/**
 * Firehorse Signed Reports — CLI
 *
 * Send Firehorse reports for eSignature via DocuSign.
 * Supports compliance, carbon, investor, and custom reports.
 *
 * Usage:
 *   npx tsx scripts/sign-report.ts send <file> --signer "Name <email>" [--signer "Name2 <email2>"]
 *   npx tsx scripts/sign-report.ts status <envelope-id>
 *   npx tsx scripts/sign-report.ts download <envelope-id> [--output-dir ./signed]
 *   npx tsx scripts/sign-report.ts list
 *   npx tsx scripts/sign-report.ts void <envelope-id> --reason "Superseded"
 *
 * Code-Version: 1.0.0
 * Branch: claude/verify-nda-signatures-rdgOj
 * Date: 2026-03-21
 * Owner: risto.paarni2022@lifetime.fi
 */

import path from 'path';
import dotenv from 'dotenv';
import { SignedReportService, type ReportSigner, type ReportType } from '../src/firehorse/signed-reports';
import { DocuSignClient } from '../src/integrations/docusign/index';

// Load environment
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

// --- Helpers ---

function parseSignerArg(raw: string): ReportSigner {
  // Format: "Name <email>" or "Name <email> (role)"
  const match = raw.match(/^(.+?)\s*<([^>]+)>\s*(?:\((\w+)\))?$/);
  if (!match) {
    throw new Error(`Invalid signer format: "${raw}". Use "Name <email>" or "Name <email> (approver)"`);
  }
  const [, name, email, role] = match;
  const validRoles = ['author', 'reviewer', 'approver', 'auditor'];
  const signerRole = (role && validRoles.includes(role)) ? role as ReportSigner['role'] : 'approver';
  return { name: name.trim(), email: email.trim(), role: signerRole };
}

function getArgs(): string[] {
  return process.argv.slice(2);
}

function findFlag(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return undefined;
  return args[idx + 1];
}

function findAllFlags(args: string[], flag: string): string[] {
  const values: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag && i + 1 < args.length) {
      values.push(args[i + 1]);
      i++;
    }
  }
  return values;
}

function detectReportType(filePath: string): ReportType {
  const lower = filePath.toLowerCase();
  if (lower.includes('compliance') || lower.includes('csrd') || lower.includes('ets')) return 'compliance';
  if (lower.includes('carbon') || lower.includes('en15978') || lower.includes('lca')) return 'carbon';
  if (lower.includes('investor') || lower.includes('mrr') || lower.includes('arr')) return 'investor';
  if (lower.includes('campaign') || lower.includes('analytics')) return 'campaign';
  return 'custom';
}

// --- Commands ---

async function cmdSend(args: string[]): Promise<void> {
  const filePath = args[1];
  if (!filePath) {
    console.error('Usage: sign-report send <file> --signer "Name <email>"');
    process.exit(1);
  }

  const signerArgs = findAllFlags(args, '--signer');
  if (signerArgs.length === 0) {
    console.error('At least one --signer is required. Format: --signer "Name <email>"');
    process.exit(1);
  }

  const signers = signerArgs.map(parseSignerArg);
  const reportType = (findFlag(args, '--type') as ReportType) || detectReportType(filePath);
  const reportName = findFlag(args, '--name') || path.basename(filePath, path.extname(filePath));
  const reference = findFlag(args, '--ref');
  const emailSubject = findFlag(args, '--subject');

  console.log(`\nSending report for signature:`);
  console.log(`  File:    ${filePath}`);
  console.log(`  Name:    ${reportName}`);
  console.log(`  Type:    ${reportType}`);
  console.log(`  Signers: ${signers.map((s) => `${s.name} <${s.email}> (${s.role})`).join(', ')}`);
  if (reference) console.log(`  Ref:     ${reference}`);
  console.log('');

  const result = await SignedReportService.sendForSignature({
    reportPath: filePath,
    reportName,
    reportType,
    signers,
    emailSubject,
    reference,
  });

  console.log(`Report sent for signature!`);
  console.log(`  Envelope ID: ${result.envelopeId}`);
  console.log(`  Status:      ${result.status}`);
  console.log(`  URI:         ${result.uri}`);
  console.log(`\nCheck status: npx tsx scripts/sign-report.ts status ${result.envelopeId}`);
}

async function cmdStatus(args: string[]): Promise<void> {
  const envelopeId = args[1];
  if (!envelopeId) {
    console.error('Usage: sign-report status <envelope-id>');
    process.exit(1);
  }

  const status = await SignedReportService.getStatus(envelopeId);

  console.log(`\nReport Signature Status:`);
  console.log(`  Envelope: ${status.envelopeId}`);
  console.log(`  Status:   ${status.status}`);
  console.log(`  Created:  ${status.createdDateTime}`);
  if (status.completedDateTime) {
    console.log(`  Completed: ${status.completedDateTime}`);
  }

  console.log(`\n  Signers:`);
  for (const r of status.recipients) {
    const signerStatus = r.signedDateTime
      ? `SIGNED (${r.signedDateTime})`
      : r.declinedDateTime
        ? `DECLINED: ${r.declinedReason || 'no reason'}`
        : r.deliveredDateTime
          ? `DELIVERED (awaiting signature)`
          : r.status;
    console.log(`    ${r.name} <${r.email}> — ${signerStatus}`);
  }
}

async function cmdDownload(args: string[]): Promise<void> {
  const envelopeId = args[1];
  if (!envelopeId) {
    console.error('Usage: sign-report download <envelope-id> [--output-dir ./signed]');
    process.exit(1);
  }

  const outputDir = findFlag(args, '--output-dir') || './signed-reports';
  const outputPath = await SignedReportService.downloadSigned(envelopeId, outputDir);
  console.log(`Signed report downloaded: ${outputPath}`);
}

async function cmdList(): Promise<void> {
  // List from DocuSign API (last 30 days)
  const client = DocuSignClient.fromEnv();
  await client.authenticate();

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 30);

  const envelopes = await client.listEnvelopes(fromDate.toISOString());

  console.log(`\nRecent report envelopes (last 30 days):`);
  console.log(`${'ID'.padEnd(38)} ${'Status'.padEnd(12)} Created`);
  console.log('-'.repeat(70));

  for (const env of envelopes) {
    console.log(
      `${env.envelopeId.padEnd(38)} ${(env.status as string).padEnd(12)} ${env.createdDateTime || ''}`,
    );
  }

  console.log(`\nTotal: ${envelopes.length} envelope(s)`);
}

async function cmdVoid(args: string[]): Promise<void> {
  const envelopeId = args[1];
  const reason = findFlag(args, '--reason') || 'Voided via CLI';

  if (!envelopeId) {
    console.error('Usage: sign-report void <envelope-id> --reason "Reason"');
    process.exit(1);
  }

  await SignedReportService.voidReport(envelopeId, reason);
  console.log(`Envelope ${envelopeId} voided: ${reason}`);
}

// --- Main ---

async function main(): Promise<void> {
  const args = getArgs();
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    console.log(`
Firehorse Signed Reports — CLI

Commands:
  send <file> --signer "Name <email>"    Send report for eSignature
    --signer "Name <email> (role)"       Add signer (role: author|reviewer|approver|auditor)
    --type <type>                        Report type (compliance|carbon|investor|campaign|custom)
    --name "Report Name"                 Custom report name
    --ref "PROJECT-001"                  Reference ID
    --subject "Custom subject"           Custom email subject

  status <envelope-id>                   Check signature status
  download <envelope-id>                 Download signed report PDF
    --output-dir ./path                  Output directory (default: ./signed-reports)
  list                                   List recent envelopes
  void <envelope-id> --reason "..."      Cancel signature request

Examples:
  npx tsx scripts/sign-report.ts send reports/carbon-Q1.pdf --signer "Risto Päärni <risto@lifetime.fi>"
  npx tsx scripts/sign-report.ts send reports/compliance.md --signer "Author <a@co.fi> (author)" --signer "Auditor <b@co.fi> (auditor)"
  npx tsx scripts/sign-report.ts status abc-123-def
  npx tsx scripts/sign-report.ts download abc-123-def --output-dir ./signed
`);
    return;
  }

  switch (command) {
    case 'send':
      await cmdSend(args);
      break;
    case 'status':
      await cmdStatus(args);
      break;
    case 'download':
      await cmdDownload(args);
      break;
    case 'list':
      await cmdList();
      break;
    case 'void':
      await cmdVoid(args);
      break;
    default:
      console.error(`Unknown command: ${command}. Run with --help for usage.`);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
