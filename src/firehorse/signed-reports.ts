/**
 * Firehorse Signed Reports Service
 *
 * Sends Firehorse reports (compliance, carbon, investor) for eSignature
 * via DocuSign. Reports are converted to PDF, sent to designated signers,
 * and tracked through completion. Signed copies can be downloaded.
 *
 * Pricing: €199/year add-on (DocuSign cost: €10/month = €120/year)
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD
 * Branch: claude/verify-nda-signatures-rdgOj
 * Date: 2026-03-21
 * Owner: risto.paarni2022@lifetime.fi
 */

import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { DocuSignClient, type EnvelopeResult, type EnvelopeStatusResult } from '../integrations/docusign/index';
import logger from '../utils/logger.js';

const execFileAsync = promisify(execFile);

// --- Types ---

export type ReportType = 'compliance' | 'carbon' | 'investor' | 'campaign' | 'custom';

export interface ReportSigner {
  email: string;
  name: string;
  role: 'author' | 'reviewer' | 'approver' | 'auditor';
}

export interface SignReportRequest {
  /** Path to the report file (PDF, MD, or DOCX) */
  reportPath: string;
  /** Human-readable report name */
  reportName: string;
  /** Report type for tracking */
  reportType: ReportType;
  /** Signers in signing order (first signer signs first) */
  signers: ReportSigner[];
  /** Optional custom email subject */
  emailSubject?: string;
  /** Optional custom email body */
  emailBlurb?: string;
  /** Project or company reference */
  reference?: string;
}

export interface SignedReportRecord {
  envelopeId: string;
  reportName: string;
  reportType: ReportType;
  reference?: string;
  signers: ReportSigner[];
  status: string;
  sentAt: string;
  completedAt?: string;
}

// In-memory tracking (Supabase integration is Phase 2)
const signedReports = new Map<string, SignedReportRecord>();

// --- PDF Conversion ---

/**
 * Convert markdown to PDF using pandoc (primary) or markdown-pdf (fallback).
 * Returns path to the generated PDF.
 */
async function convertToPdf(inputPath: string): Promise<string> {
  const ext = path.extname(inputPath).toLowerCase();

  // Already a PDF
  if (ext === '.pdf') return inputPath;

  const outputPath = inputPath.replace(/\.[^.]+$/, '.pdf');

  // Try pandoc first
  try {
    await execFileAsync('pandoc', [
      inputPath,
      '-o', outputPath,
      '--pdf-engine=xelatex',
      '-V', 'geometry:margin=1in',
      '-V', 'mainfont:DejaVu Sans',
    ]);
    logger.info('PDF converted via pandoc', { inputPath, outputPath });
    return outputPath;
  } catch {
    logger.warn('pandoc not available, trying markdown-pdf');
  }

  // Fallback: markdown-pdf (for .md files)
  if (ext === '.md') {
    try {
      await execFileAsync('npx', ['markdown-pdf', inputPath, '-o', outputPath]);
      logger.info('PDF converted via markdown-pdf', { inputPath, outputPath });
      return outputPath;
    } catch (err) {
      throw new Error(`PDF conversion failed: ${err}`, { cause: err });
    }
  }

  throw new Error(`Cannot convert ${ext} to PDF — unsupported format`);
}

// --- Service ---

export const SignedReportService = {
  /**
   * Send a report for eSignature via DocuSign.
   * Converts non-PDF files to PDF automatically.
   */
  async sendForSignature(request: SignReportRequest): Promise<EnvelopeResult> {
    if (!fs.existsSync(request.reportPath)) {
      throw new Error(`Report file not found: ${request.reportPath}`);
    }

    if (request.signers.length === 0) {
      throw new Error('At least one signer is required');
    }

    if (request.signers.length > 4) {
      throw new Error('Maximum 4 signers per report');
    }

    // Convert to PDF if needed
    const pdfPath = await convertToPdf(request.reportPath);

    // Build DocuSign client
    const client = DocuSignClient.fromEnv();

    // Send for signature
    const result = await client.sendReport({
      documentPath: pdfPath,
      documentName: request.reportName,
      signers: request.signers.map((s) => ({
        email: s.email,
        name: s.name,
        role: s.role,
      })),
      emailSubject: request.emailSubject,
      emailBlurb: request.emailBlurb,
    });

    // Track the signed report
    const record: SignedReportRecord = {
      envelopeId: result.envelopeId,
      reportName: request.reportName,
      reportType: request.reportType,
      reference: request.reference,
      signers: request.signers,
      status: result.status as string,
      sentAt: new Date().toISOString(),
    };

    signedReports.set(result.envelopeId, record);
    logger.info('Report sent for signature', {
      envelopeId: result.envelopeId,
      reportName: request.reportName,
      signerCount: request.signers.length,
    });

    return result;
  },

  /**
   * Check signature status of a report envelope.
   */
  async getStatus(envelopeId: string): Promise<EnvelopeStatusResult> {
    const client = DocuSignClient.fromEnv();
    const status = await client.getEnvelopeStatus(envelopeId);

    // Update local record
    const record = signedReports.get(envelopeId);
    if (record) {
      record.status = status.status as string;
      if (status.completedDateTime) {
        record.completedAt = status.completedDateTime;
      }
    }

    return status;
  },

  /**
   * Download the signed report PDF.
   */
  async downloadSigned(
    envelopeId: string,
    outputDir: string,
  ): Promise<string> {
    const client = DocuSignClient.fromEnv();
    const record = signedReports.get(envelopeId);
    const baseName = record
      ? record.reportName.replace(/[^a-zA-Z0-9-_]/g, '_')
      : 'signed-report';
    const outputPath = path.join(outputDir, `${baseName}_signed.pdf`);

    return client.downloadDocument(envelopeId, '1', outputPath);
  },

  /**
   * List all tracked signed reports.
   */
  listReports(): SignedReportRecord[] {
    return Array.from(signedReports.values())
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
  },

  /**
   * Void (cancel) a report signature request.
   */
  async voidReport(envelopeId: string, reason: string): Promise<void> {
    const client = DocuSignClient.fromEnv();
    await client.voidEnvelope(envelopeId, reason);

    const record = signedReports.get(envelopeId);
    if (record) {
      record.status = 'voided';
    }

    logger.info('Report signature voided', { envelopeId, reason });
  },
};

export default SignedReportService;
