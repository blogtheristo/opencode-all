/**
 * Investor Reporting - Integration Wrapper
 * Bridges TypeScript report generation with existing Python PDF/email/Drive infrastructure
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { InvestorReportData } from './types';
import { templateGenerator } from './template-generator';

const execAsync = promisify(exec);

// Resend API helper for investor report emails (with PDF attachment)
async function sendViaResend(
  subject: string,
  htmlBody: string,
  textBody: string,
  pdfPath: string,
  recipients: string[]
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) throw new Error('RESEND_API_KEY not configured');

  const from = process.env.EMAIL_FROM || 'risto@onelifetime.world';

  // Read PDF and base64-encode it for the Resend attachments API
  const pdfBuffer = await fs.readFile(pdfPath);
  const pdfBase64 = pdfBuffer.toString('base64');
  const filename = path.basename(pdfPath);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject,
      html: htmlBody,
      text: textBody,
      attachments: [{ filename, content: pdfBase64 }],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorBody}`);
  }
}

// ============================================================================
// INTEGRATION WRAPPER
// ============================================================================

export class IntegrationWrapper {
  private reportsDir: string;
  private pythonScriptsDir: string;

  constructor() {
    // Paths relative to project root
    this.reportsDir = path.join(process.cwd(), 'Reports');
    this.pythonScriptsDir = path.join(process.cwd(), 'Reports');
  }

  // ==========================================================================
  // PDF GENERATION
  // ==========================================================================

  /**
   * Generate PDF from investor report data
   * Uses existing Reports/generate_pdf.py infrastructure
   */
  async generatePDF(reportData: InvestorReportData): Promise<string> {
    try {
      // Generate HTML content
      const htmlContent = templateGenerator.generateHTML(reportData);

      // Create temporary HTML file
      const month = reportData.report_period.toISOString().split('T')[0];
      const tempHtmlPath = path.join('/tmp', `investor-report-${month}.html`);
      const outputPdfPath = path.join(this.reportsDir, `investor-report-${month}.pdf`);

      await fs.writeFile(tempHtmlPath, htmlContent, 'utf-8');

      // Use wkhtmltopdf or similar to convert HTML to PDF
      // For now, we'll use a simple approach (requires wkhtmltopdf installed)
      // Alternative: use Puppeteer, weasyprint, or existing PDF generation scripts

      console.log(`[PDF] Generating PDF from HTML: ${tempHtmlPath} -> ${outputPdfPath}`);

      // Check if wkhtmltopdf is available
      try {
        await execAsync('which wkhtmltopdf');

        // Generate PDF using wkhtmltopdf
        await execAsync(
          `wkhtmltopdf --enable-local-file-access --page-size A4 --margin-top 20mm --margin-bottom 20mm --margin-left 15mm --margin-right 15mm "${tempHtmlPath}" "${outputPdfPath}"`
        );

        console.log(`[PDF] ✓ PDF generated: ${outputPdfPath}`);
      } catch (error) {
        console.log('[PDF] wkhtmltopdf not found, using fallback method');

        // Fallback: Save as Markdown and use pandoc if available
        const markdownContent = templateGenerator.generateMarkdown(reportData);
        const tempMdPath = path.join('/tmp', `investor-report-${month}.md`);
        await fs.writeFile(tempMdPath, markdownContent, 'utf-8');

        try {
          await execAsync('which pandoc');
          await execAsync(
            `pandoc "${tempMdPath}" -o "${outputPdfPath}" --pdf-engine=xelatex -V geometry:margin=1in`
          );
          console.log(`[PDF] ✓ PDF generated using pandoc: ${outputPdfPath}`);
        } catch (pandocError) {
          console.log('[PDF] Neither wkhtmltopdf nor pandoc available');

          // Final fallback: Just save HTML and Markdown
          const htmlPath = path.join(this.reportsDir, `investor-report-${month}.html`);
          const mdPath = path.join(this.reportsDir, `investor-report-${month}.md`);

          await fs.writeFile(htmlPath, htmlContent, 'utf-8');
          await fs.writeFile(mdPath, markdownContent, 'utf-8');

          console.log(`[PDF] ✓ Saved HTML and Markdown: ${htmlPath}, ${mdPath}`);
          return htmlPath; // Return HTML path as fallback
        }
      }

      // Clean up temp files
      try {
        await fs.unlink(tempHtmlPath);
      } catch (e) {
        // Ignore cleanup errors
      }

      return outputPdfPath;
    } catch (error) {
      console.error('[PDF] Error generating PDF:', error);
      throw new Error(`Failed to generate PDF: ${error}`);
    }
  }

  // ==========================================================================
  // EMAIL DELIVERY
  // ==========================================================================

  /**
   * Send investor report via Resend (with PDF attachment)
   */
  async sendEmail(
    reportData: InvestorReportData,
    pdfPath: string,
    recipients: string[]
  ): Promise<void> {
    const month = reportData.report_period.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    const subject = `Monthly Investor Report - ${month}`;
    const textBody = this.generateEmailBody(reportData);
    const htmlBody = `<pre style="font-family:sans-serif;white-space:pre-wrap">${textBody}</pre>`;

    console.log(`[Email] Sending report to: ${recipients.join(', ')}`);

    await sendViaResend(subject, htmlBody, textBody, pdfPath, recipients);

    console.log('[Email] ✓ Report sent successfully via Resend');
  }

  /**
   * Generate plain-text email body
   */
  private generateEmailBody(reportData: InvestorReportData): string {
    const month = reportData.report_period.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    const { mrr_metrics, cash_metrics, customer_metrics } = reportData;

    return `
Hi,

Your monthly investor report for ${month} is attached.

Key Highlights:
- MRR: €${mrr_metrics.current_mrr.toLocaleString()} (${mrr_metrics.mrr_growth >= 0 ? '+' : ''}${mrr_metrics.mrr_growth_rate.toFixed(1)}% MoM)
- Active Customers: ${customer_metrics.active_customers}
- Churn Rate: ${customer_metrics.monthly_churn_rate.toFixed(1)}%
- Cash Balance: €${cash_metrics.current_cash.toLocaleString()}
- Runway: ${cash_metrics.runway_months.toFixed(1)} months

${reportData.executive_summary || ''}

Attachment: Monthly Investor Report PDF

---
DWS Platform
Generated: ${reportData.generated_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    `.trim();
  }

  // ==========================================================================
  // GOOGLE DRIVE UPLOAD
  // ==========================================================================

  /**
   * Upload report to Google Drive
   * Uses existing Reports/upload_to_drive.py infrastructure
   */
  async uploadToDrive(pdfPath: string): Promise<string> {
    try {
      const uploadScript = path.join(this.pythonScriptsDir, 'upload_to_drive.py');

      console.log(`[Drive] Uploading to Google Drive: ${pdfPath}`);

      // Check if upload script exists
      try {
        await fs.access(uploadScript);
      } catch (error) {
        console.log('[Drive] upload_to_drive.py not found, skipping upload');
        return '';
      }

      // Execute upload script
      const { stdout, stderr } = await execAsync(
        `python3 "${uploadScript}" --file "${pdfPath}"`
      );

      if (stderr && !stderr.includes('InsecureRequestWarning')) {
        console.error('[Drive] stderr:', stderr);
      }

      console.log('[Drive] ✓ Uploaded to Google Drive');
      console.log(stdout);

      // Extract Drive URL from stdout (assuming script outputs URL)
      const urlMatch = stdout.match(/https:\/\/drive\.google\.com\/[^\s]+/);
      const driveUrl = urlMatch ? urlMatch[0] : '';

      return driveUrl;
    } catch (error) {
      console.error('[Drive] Error uploading to Google Drive:', error);
      // Don't throw - Drive upload is optional
      return '';
    }
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  /**
   * Ensure Reports directory exists
   */
  async ensureReportsDir(): Promise<void> {
    try {
      await fs.mkdir(this.reportsDir, { recursive: true });
    } catch (error) {
      // Ignore if already exists
    }
  }
}

// Export singleton instance
export const integrationWrapper = new IntegrationWrapper();
