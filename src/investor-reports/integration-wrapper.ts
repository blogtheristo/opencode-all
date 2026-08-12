/**
 * Investor Reporting - Integration Wrapper
 * Bridges TypeScript report generation with existing Python PDF/email/Drive infrastructure
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { InvestorReportData } from './types';
import { templateGenerator } from './template-generator';

const execFileAsync = promisify(execFile);

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

  private resolveSafePath(baseDir: string, targetPath: string): string {
    const resolvedBase = path.resolve(baseDir);
    const resolvedTarget = path.resolve(targetPath);

    if (resolvedTarget !== resolvedBase && !resolvedTarget.startsWith(`${resolvedBase}${path.sep}`)) {
      throw new Error(`Unsafe path detected: ${targetPath}`);
    }

    return resolvedTarget;
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
      const tempHtmlPath = path.join(this.reportsDir, `investor-report-${month}.html`);
      const outputPdfPath = path.join(this.reportsDir, `investor-report-${month}.pdf`);

      await fs.writeFile(tempHtmlPath, htmlContent, 'utf-8');

      // Use wkhtmltopdf or similar to convert HTML to PDF
      // For now, we'll use a simple approach (requires wkhtmltopdf installed)
      // Alternative: use Puppeteer, weasyprint, or existing PDF generation scripts

      console.log(`[PDF] Generating PDF from HTML: ${tempHtmlPath} -> ${outputPdfPath}`);

      // Check if wkhtmltopdf is available
      try {
        // Generate PDF using wkhtmltopdf
        await execFileAsync('wkhtmltopdf', [
          '--enable-local-file-access',
          '--page-size',
          'A4',
          '--margin-top',
          '20mm',
          '--margin-bottom',
          '20mm',
          '--margin-left',
          '15mm',
          '--margin-right',
          '15mm',
          this.resolveSafePath(this.reportsDir, tempHtmlPath),
          this.resolveSafePath(this.reportsDir, outputPdfPath),
        ]);

        console.log(`[PDF] ✓ PDF generated: ${outputPdfPath}`);
      } catch (error) {
        console.log('[PDF] wkhtmltopdf not found, using fallback method');

        // Fallback: Save as Markdown and use pandoc if available
        const markdownContent = templateGenerator.generateMarkdown(reportData);
        const tempMdPath = path.join(this.reportsDir, `investor-report-${month}.md`);
        await fs.writeFile(tempMdPath, markdownContent, 'utf-8');

        try {
          await execFileAsync('pandoc', [
            this.resolveSafePath(this.reportsDir, tempMdPath),
            '-o',
            this.resolveSafePath(this.reportsDir, outputPdfPath),
            '--pdf-engine=xelatex',
            '-V',
            'geometry:margin=1in',
          ]);
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
   * Send investor report via email
   * Uses existing Reports/send_weekly_report.py infrastructure
   */
  async sendEmail(
    reportData: InvestorReportData,
    pdfPath: string,
    recipients: string[]
  ): Promise<void> {
    try {
      const month = reportData.report_period.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });

      const subject = `Monthly Investor Report - ${month}`;

      // Create email body
      const emailBody = this.generateEmailBody(reportData);

      // Save email body to temp file
      const bodyPath = path.join(this.reportsDir, 'investor-report-email-body.txt');
      await fs.writeFile(bodyPath, emailBody, 'utf-8');

      // Use existing send_weekly_report.py script (adapted for investor reports)
      // For now, we'll create a custom Python email sender

      const pythonScript = this.generateEmailSenderScript(
        subject,
        emailBody,
        this.resolveSafePath(this.reportsDir, pdfPath),
        recipients
      );

      const scriptPath = path.join(this.reportsDir, 'send-investor-report.py');
      await fs.writeFile(scriptPath, pythonScript, 'utf-8');

      console.log(`[Email] Sending report to: ${recipients.join(', ')}`);
      console.log(`[Email] Subject: ${subject}`);
      console.log(`[Email] Attachment: ${pdfPath}`);

      // Execute Python script
      const { stdout, stderr } = await execFileAsync('python3', [
        this.resolveSafePath(this.reportsDir, scriptPath),
      ]);

      if (stderr && !stderr.includes('InsecureRequestWarning')) {
        console.error('[Email] stderr:', stderr);
      }

      console.log('[Email] ✓ Report sent successfully');
      console.log(stdout);

      // Clean up
      try {
        await fs.unlink(scriptPath);
        await fs.unlink(bodyPath);
      } catch (e) {
        // Ignore cleanup errors
      }
    } catch (error) {
      console.error('[Email] Error sending email:', error);
      throw new Error(`Failed to send email: ${error}`);
    }
  }

  /**
   * Generate email body text
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

📊 Key Highlights:
- MRR: €${mrr_metrics.current_mrr.toLocaleString()} (${mrr_metrics.mrr_growth >= 0 ? '+' : ''}${mrr_metrics.mrr_growth_rate.toFixed(1)}% MoM)
- Active Customers: ${customer_metrics.active_customers}
- Churn Rate: ${customer_metrics.monthly_churn_rate.toFixed(1)}%
- Cash Balance: €${cash_metrics.current_cash.toLocaleString()}
- Runway: ${cash_metrics.runway_months.toFixed(1)} months

${reportData.executive_summary || ''}

📎 Attachment: Monthly Investor Report PDF

---
DWS Platform
Generated: ${reportData.generated_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    `.trim();
  }

  /**
   * Generate Python email sender script
   */
  private generateEmailSenderScript(
    subject: string,
    body: string,
    pdfPath: string,
    recipients: string[]
  ): string {
    return `#!/usr/bin/env python3
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

# Email configuration
sender_email = os.getenv("SMTP_SENDER", "risto@onelifetime.world")
sender_password = os.getenv("SMTP_PASSWORD")
smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
smtp_port = int(os.getenv("SMTP_PORT", "587"))

if not sender_password:
    print("❌ SMTP_PASSWORD environment variable not set")
    exit(1)

recipients = ${JSON.stringify(recipients)}

# Create email
msg = MIMEMultipart()
msg['From'] = sender_email
msg['To'] = ", ".join(recipients)
msg['Subject'] = ${JSON.stringify(subject)}

# Email body
body = ${JSON.stringify(body)}
msg.attach(MIMEText(body, 'plain'))

# Attach PDF
try:
    with open(${JSON.stringify(pdfPath)}, 'rb') as f:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(f.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename=Investor_Report.pdf')
        msg.attach(part)
except Exception as e:
    print(f"❌ Failed to attach PDF: {e}")
    exit(1)

# Send email
try:
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(sender_email, sender_password)
    text = msg.as_string()
    server.sendmail(sender_email, recipients, text)
    server.quit()
    print(f"📧 INVESTOR REPORT SENT: From: {sender_email} | To: {', '.join(recipients)} | Subject: {msg['Subject']}")
except Exception as e:
    print(f"❌ Failed to send email: {e}")
    exit(1)
`;
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
      const safeUploadScript = this.resolveSafePath(this.pythonScriptsDir, uploadScript);
      const safePdfPath = this.resolveSafePath(this.reportsDir, pdfPath);

      const { stdout, stderr } = await execFileAsync('python3', [
        safeUploadScript,
        '--file',
        safePdfPath,
      ]);

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
