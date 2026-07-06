/**
 * DWS IQ 6 - Email HTML Templates
 *
 * Branded, responsive email templates for transactional emails.
 * Dark/professional theme consistent with the DWS IQ 6 platform.
 * Tested for compatibility with Outlook, Gmail, and Apple Mail.
 */

// ============================================================
// BASE LAYOUT
// ============================================================

/**
 * Wraps email body content in a branded layout with header and footer.
 * Uses table-based layout for maximum email client compatibility.
 */
function baseLayout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .email-bg { background-color: #0a0f1a !important; }
      .card-bg { background-color: #111827 !important; }
    }
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 0 16px !important; }
      .card { padding: 24px 20px !important; }
      .btn { width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0f1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Preheader (hidden preview text) -->
  <div style="display: none; max-height: 0; overflow: hidden;">${title}</div>

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0a0f1a;" class="email-bg">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" class="container" style="max-width: 600px; width: 100%;">

          <!-- Header with Logo -->
          <tr>
            <td align="center" style="padding: 0 0 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size: 28px; font-weight: 700; color: #60a5fa; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    <!-- Replace with <img> when logo URL is available -->
                    DWS IQ 6
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1.5px; padding-top: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    Climate Intelligence Platform
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Card -->
          <tr>
            <td>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border-radius: 12px; border: 1px solid #1f2937;" class="card-bg">
                <tr>
                  <td class="card" style="padding: 40px 36px;">
                    ${bodyHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 0 0 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size: 12px; color: #6b7280; line-height: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    <p style="margin: 0 0 8px 0;">DWS IQ 6 &mdash; Enterprise Climate Intelligence &amp; Compliance</p>
                    <p style="margin: 0 0 8px 0;">DWS Group Oy &bull; Helsinki, Finland &bull; EU</p>
                    <p style="margin: 0; color: #4b5563;">
                      This is a transactional email from DWS IQ 6. You received it because of an action on your account.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================================
// TEMPLATE FUNCTIONS
// ============================================================

/**
 * Welcome email sent to new users after registration.
 */
export function welcomeTemplate(name: string): string {
  const escapedName = escapeHtml(name);
  const body = `
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Welcome to DWS IQ 6
    </h1>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #d1d5db; line-height: 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Hi ${escapedName},
    </p>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #d1d5db; line-height: 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Your account has been created. DWS IQ 6 is your enterprise climate intelligence platform for
      EU regulatory compliance &mdash; covering Fit for 55, ETS, CBAM, and CSRD across 16 industries.
    </p>
    <p style="margin: 0 0 32px 0; font-size: 16px; color: #d1d5db; line-height: 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Here is what you can do next:
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
      <tr>
        <td style="padding: 12px 16px; background-color: #1e293b; border-radius: 8px; border-left: 3px solid #60a5fa;">
          <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">1. Set up your organization profile</p>
          <p style="margin: 0; font-size: 13px; color: #9ca3af; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Add your company details and industry classification.</p>
        </td>
      </tr>
      <tr><td style="height: 8px;"></td></tr>
      <tr>
        <td style="padding: 12px 16px; background-color: #1e293b; border-radius: 8px; border-left: 3px solid #60a5fa;">
          <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">2. Run your first compliance check</p>
          <p style="margin: 0; font-size: 13px; color: #9ca3af; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Use the Climate Assistant to assess your regulatory obligations.</p>
        </td>
      </tr>
      <tr><td style="height: 8px;"></td></tr>
      <tr>
        <td style="padding: 12px 16px; background-color: #1e293b; border-radius: 8px; border-left: 3px solid #60a5fa;">
          <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">3. Invite your team</p>
          <p style="margin: 0; font-size: 13px; color: #9ca3af; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Collaborate with colleagues on compliance reporting.</p>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="background-color: #2563eb; border-radius: 8px;">
          <a href="https://dws6.com/dashboard" target="_blank" class="btn" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            Go to Dashboard
          </a>
        </td>
      </tr>
    </table>
  `;
  return baseLayout('Welcome to DWS IQ 6', body);
}

/**
 * Password reset email with a secure reset link.
 */
export function passwordResetTemplate(resetLink: string): string {
  const escapedLink = escapeHtml(resetLink);
  const body = `
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Reset Your Password
    </h1>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #d1d5db; line-height: 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      We received a request to reset the password for your DWS IQ 6 account.
      Click the button below to choose a new password.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr>
        <td align="center" style="background-color: #2563eb; border-radius: 8px;">
          <a href="${escapedLink}" target="_blank" class="btn" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            Reset Password
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #9ca3af; line-height: 22px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border-radius: 8px; border: 1px solid #374151;">
      <tr>
        <td style="padding: 12px 16px;">
          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            Direct link (if button does not work):
          </p>
          <p style="margin: 0; font-size: 12px; color: #60a5fa; word-break: break-all; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            ${escapedLink}
          </p>
        </td>
      </tr>
    </table>
  `;
  return baseLayout('Reset Your Password - DWS IQ 6', body);
}

/**
 * Report delivery notification with a download link.
 */
export function reportDeliveryTemplate(reportName: string, downloadUrl: string): string {
  const escapedName = escapeHtml(reportName);
  const escapedUrl = escapeHtml(downloadUrl);
  const body = `
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Your Report Is Ready
    </h1>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #d1d5db; line-height: 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Your report has been generated and is ready for download.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border-radius: 8px; border: 1px solid #374151; margin-bottom: 24px;">
      <tr>
        <td style="padding: 16px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Report</span>
              </td>
            </tr>
            <tr>
              <td>
                <span style="font-size: 18px; font-weight: 600; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${escapedName}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr>
        <td align="center" style="background-color: #2563eb; border-radius: 8px;">
          <a href="${escapedUrl}" target="_blank" class="btn" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            Download Report
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 22px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      This download link will expire in 7 days. You can also access all your reports from the
      <a href="https://dws6.com/dashboard/reports" style="color: #60a5fa; text-decoration: underline;">Reports Dashboard</a>.
    </p>
  `;
  return baseLayout(`Report Ready: ${reportName} - DWS IQ 6`, body);
}

/**
 * General notification email with custom subject and body.
 */
export function notificationTemplate(subject: string, body: string): string {
  const escapedSubject = escapeHtml(subject);
  const escapedBody = escapeHtml(body);
  // Convert newlines in body text to <br> for HTML rendering
  const htmlBody = escapedBody.replace(/\n/g, '<br>');
  const content = `
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      ${escapedSubject}
    </h1>
    <div style="margin: 0 0 24px 0; font-size: 16px; color: #d1d5db; line-height: 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      ${htmlBody}
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="background-color: #2563eb; border-radius: 8px;">
          <a href="https://dws6.com/dashboard" target="_blank" class="btn" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            Open Dashboard
          </a>
        </td>
      </tr>
    </table>
  `;
  return baseLayout(`${subject} - DWS IQ 6`, content);
}

/**
 * Invoice email with payment details.
 */
export function invoiceTemplate(invoiceId: string, amount: number, currency: string): string {
  const escapedId = escapeHtml(invoiceId);
  const escapedCurrency = escapeHtml(currency.toUpperCase());
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  const body = `
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Invoice
    </h1>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #d1d5db; line-height: 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      A new invoice has been generated for your DWS IQ 6 subscription.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border-radius: 8px; border: 1px solid #374151; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding-bottom: 16px; border-bottom: 1px solid #374151;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Invoice ID</td>
                    <td align="right" style="font-size: 14px; color: #f9fafb; font-weight: 500; font-family: monospace, 'Courier New', Courier;">${escapedId}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 16px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Amount Due</td>
                    <td align="right" style="font-size: 24px; font-weight: 700; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${escapedCurrency} ${formattedAmount}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr>
        <td align="center" style="background-color: #2563eb; border-radius: 8px;">
          <a href="https://dws6.com/dashboard/billing" target="_blank" class="btn" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            View Invoice
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 22px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      If you have questions about this invoice, contact our billing team at
      <a href="mailto:billing@dws6.com" style="color: #60a5fa; text-decoration: underline;">billing@dws6.com</a>.
    </p>
  `;
  return baseLayout(`Invoice ${invoiceId} - DWS IQ 6`, body);
}

// ============================================================
// CAPTAIN PRE-BRIEFING
// ============================================================

/**
 * Pre-briefing email sent to a captain prospect when their inquiry
 * status changes to "booked". Arrives prepared → closes faster.
 */
export function captainPreBriefingTemplate(
  name: string,
  industry: string,
  seatLevel: string,
): string {
  const escapedName = escapeHtml(name);
  const escapedIndustry = escapeHtml(industry);
  const seatLabel = seatLevel === 'platinum' ? 'Platinum (€50,000)' : 'Deputy (€25,000)';
  const seatColor = seatLevel === 'platinum' ? '#d4a843' : '#60a5fa';

  const body = `
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Your Captain Briefing Is Confirmed
    </h1>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #d1d5db; line-height: 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Hi ${escapedName}, your briefing call with Risto Anton Päärni (Founder, CEO, Lifetime Oy) is confirmed.
      Here's what to review before the call so we can make the most of our time together.
    </p>

    <!-- Seat summary card -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border-radius: 8px; border: 1px solid #374151; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding-bottom: 12px; border-bottom: 1px solid #374151;">
                <span style="font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Your Industry</span><br>
                <span style="font-size: 16px; font-weight: 600; color: #f9fafb;">${escapedIndustry}</span>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 12px;">
                <span style="font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Seat Level</span><br>
                <span style="font-size: 16px; font-weight: 700; color: ${seatColor};">${seatLabel}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Pre-reading section -->
    <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Pre-Reading (10 min)
    </h2>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #1f2937;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="width: 32px; vertical-align: top; color: #d4a843; font-size: 16px; font-weight: 700;">1.</td>
              <td>
                <a href="https://dws10.com/captain/deck/" style="color: #60a5fa; font-size: 15px; font-weight: 600; text-decoration: none;">Captain Deck &amp; Term Sheet</a>
                <div style="font-size: 13px; color: #9ca3af; margin-top: 4px;">SAFE terms, seat structure, financial projections, and the full term sheet. This is the document we'll walk through on the call.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #1f2937;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="width: 32px; vertical-align: top; color: #d4a843; font-size: 16px; font-weight: 700;">2.</td>
              <td>
                <a href="https://dws10.com/captain/" style="color: #60a5fa; font-size: 15px; font-weight: 600; text-decoration: none;">Captain Programme Overview</a>
                <div style="font-size: 13px; color: #9ca3af; margin-top: 4px;">The full captain model — architecture, benefits, seat table, and the Brain-Memory-Body-Hands ecosystem you'll be orchestrating.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="width: 32px; vertical-align: top; color: #d4a843; font-size: 16px; font-weight: 700;">3.</td>
              <td>
                <span style="color: #f9fafb; font-size: 15px; font-weight: 600;">Think about your industry</span>
                <div style="font-size: 13px; color: #9ca3af; margin-top: 4px;">What are the top 2-3 compliance pain points in ${escapedIndustry}? Which companies would be your first design partner introductions? This is the kind of domain knowledge that makes a Captain invaluable.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- What to expect -->
    <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      What to Expect on the Call
    </h2>
    <p style="margin: 0 0 24px 0; font-size: 14px; color: #d1d5db; line-height: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      30 minutes. No slides — this is a conversation. We'll cover the platform demo (Situation Room for your industry),
      the SAFE terms, and your questions. If it's a mutual fit, we'll send the SAFE agreement for legal review.
    </p>

    <!-- CTA button -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr>
        <td align="center" style="background: linear-gradient(135deg, #b8860b, #d4a843); border-radius: 8px;">
          <a href="https://dws10.com/captain/deck/" target="_blank" class="btn" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 700; color: #0f172a; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            Review the Captain Deck
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Questions before the call? Reply directly to this email — it goes to Risto.<br>
      Lifetime Oy &middot; Helsinki, Finland &middot; <a href="https://dws10.com" style="color: #60a5fa; text-decoration: none;">dws10.com</a>
    </p>
  `;
  return baseLayout('Your Captain Briefing Is Confirmed — DWS IQ 6', body);
}

// ============================================================
// INVESTOR OUTREACH
// ============================================================

/**
 * Investor outreach email template for initial contact.
 * Supports multiple investor profiles (VC, angel, family office).
 */
export function investorOutreachTemplate(
  name: string,
  investorType: 'vc' | 'angel' | 'family_office' | 'operator',
  industry?: string,
): string {
  const escapedName = escapeHtml(name);
  const escapedIndustry = industry ? escapeHtml(industry) : 'EU-regulated industries';

  const typeLabels: Record<string, string> = {
    vc: 'Climate / Industrial VC',
    angel: 'Operator Angel',
    family_office: 'Family Office',
    operator: 'Industry Executive',
  };
  const typeLabel = typeLabels[investorType] || 'Investor';

  const body = `
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      DWS IQ 6 — Investor Introduction
    </h1>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #d1d5db; line-height: 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Hi ${escapedName},
    </p>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #d1d5db; line-height: 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      I'm Risto Anton Päärni, Founder, CEO of Lifetime Oy. We're building DWS IQ 6 — the AI compliance
      platform for ${escapedIndustry}. We have €7k MRR, 5 paying customers with 100% retention,
      and are raising a SAFE round at a €3.8M cap.
    </p>

    <!-- Key metrics card -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border-radius: 8px; border: 1px solid #374151; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding-bottom: 12px; border-bottom: 1px solid #374151;">
                <span style="font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Investor Profile</span><br>
                <span style="font-size: 16px; font-weight: 600; color: #60a5fa;">${escapeHtml(typeLabel)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 12px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="width: 33%; text-align: center; padding: 8px 0;">
                      <span style="font-size: 24px; font-weight: 700; color: #f9fafb;">€7k</span><br>
                      <span style="font-size: 11px; color: #9ca3af; text-transform: uppercase;">MRR</span>
                    </td>
                    <td style="width: 33%; text-align: center; padding: 8px 0; border-left: 1px solid #374151; border-right: 1px solid #374151;">
                      <span style="font-size: 24px; font-weight: 700; color: #f9fafb;">100%</span><br>
                      <span style="font-size: 11px; color: #9ca3af; text-transform: uppercase;">Retention</span>
                    </td>
                    <td style="width: 33%; text-align: center; padding: 8px 0;">
                      <span style="font-size: 24px; font-weight: 700; color: #f9fafb;">20</span><br>
                      <span style="font-size: 11px; color: #9ca3af; text-transform: uppercase;">Industries</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Why Now
    </h2>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
      <tr>
        <td style="padding: 10px 16px; background-color: #1e293b; border-radius: 8px; border-left: 3px solid #60a5fa; margin-bottom: 8px;">
          <p style="margin: 0; font-size: 14px; color: #d1d5db; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <strong style="color: #f9fafb;">CSRD + Fit for 55</strong> mandate compliance spend for 50,000+ EU companies
          </p>
        </td>
      </tr>
      <tr><td style="height: 6px;"></td></tr>
      <tr>
        <td style="padding: 10px 16px; background-color: #1e293b; border-radius: 8px; border-left: 3px solid #60a5fa;">
          <p style="margin: 0; font-size: 14px; color: #d1d5db; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <strong style="color: #f9fafb;">KYA Standard</strong> creates structural switching costs (agent governance, not just SaaS)
          </p>
        </td>
      </tr>
      <tr><td style="height: 6px;"></td></tr>
      <tr>
        <td style="padding: 10px 16px; background-color: #1e293b; border-radius: 8px; border-left: 3px solid #60a5fa;">
          <p style="margin: 0; font-size: 14px; color: #d1d5db; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <strong style="color: #f9fafb;">SaaS + API pricing</strong> — predictable monthly cost that scales with your usage
          </p>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr>
        <td align="center" style="background-color: #2563eb; border-radius: 8px;">
          <a href="https://dws10.com/investor-relations/" target="_blank" class="btn" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            View Investor Materials
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 16px 0; font-size: 14px; color: #d1d5db; line-height: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Happy to send the full deck or schedule a 30-minute call at your convenience.
    </p>

    <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Risto Anton Päärni &middot; Founder, CEO, Lifetime Oy &middot; Helsinki, Finland<br>
      <a href="https://dws10.com" style="color: #60a5fa; text-decoration: none;">dws10.com</a> &middot;
      <a href="https://www.crunchbase.com/organization/lifetime-oy" style="color: #60a5fa; text-decoration: none;">Crunchbase</a>
    </p>
  `;
  return baseLayout('DWS IQ 6 — Investor Introduction', body);
}

// ============================================================
// BOOKING CONFIRMATION
// ============================================================

export function bookingConfirmationTemplate(variables: {
  customerName: string;
  serviceName: string;
  dateTime: string;
  durationMinutes: number;
  company: string;
  notes: string;
  cancelLink: string;
  meetLink?: string;
}): string {
  const body = `
    <h1 style="margin: 0 0 24px 0; font-size: 28px; font-weight: 700; color: #f9fafb; line-height: 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Varaus vahvistettu ✓
    </h1>

    <p style="margin: 0 0 24px 0; font-size: 16px; color: #d1d5db; line-height: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Hei ${escapeHtml(variables.customerName)},
    </p>

    <p style="margin: 0 0 24px 0; font-size: 15px; color: #d1d5db; line-height: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Kiitos, varaus on vahvistettu!
    </p>

    <!-- Booking Details Card -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px; background-color: #1f2937; border-radius: 8px; border: 1px solid #374151;">
      <tr>
        <td style="padding: 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Palvelu</td>
              <td align="right" style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Kesto</td>
            </tr>
            <tr>
              <td style="font-size: 18px; font-weight: 600; color: #f9fafb; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${escapeHtml(variables.serviceName)}</td>
              <td align="right" style="font-size: 18px; font-weight: 600; color: #f9fafb; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${variables.durationMinutes} min</td>
            </tr>
            <tr>
              <td colspan="2" style="border-top: 1px solid #374151; padding-top: 16px;"></td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; padding-top: 16px; padding-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">📅 Aika</td>
            </tr>
            <tr>
              <td style="font-size: 16px; color: #60a5fa; font-weight: 500; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${escapeHtml(variables.dateTime)}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">💼 Yritys</td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #d1d5db; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${escapeHtml(variables.company)}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">📝 Lisätiedot</td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #d1d5db; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${escapeHtml(variables.notes)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr>
        ${
          variables.meetLink
            ? `<td align="center" style="background-color: #0ea5e9; border-radius: 8px; padding-right: 8px;">
          <a href="${escapeHtml(variables.meetLink)}" target="_blank" class="btn" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 500; color: #ffffff; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            Liity Jitsi-tapaamiseen
          </a>
        </td>`
            : ''
        }
        <td align="center" style="background-color: #2563eb; border-radius: 8px;">
          <a href="${variables.cancelLink}" target="_blank" class="btn" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 500; color: #ffffff; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            Peruuta varaus
          </a>
        </td>
      </tr>
    </table>
    ${
      variables.meetLink
        ? `<p style="margin: 0 0 20px 0; font-size: 13px; color: #9ca3af; line-height: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Jitsi-linkki: <a href="${escapeHtml(variables.meetLink)}" style="color: #60a5fa; text-decoration: none;">${escapeHtml(variables.meetLink)}</a>
    </p>`
        : ''
    }

    <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Risto Anton Päärni · Lifetime Oy · Helsinki<br>
      <a href="https://dws10.com" style="color: #60a5fa; text-decoration: none;">dws10.com</a>
    </p>
  `;
  return baseLayout('Varaus vahvistettu — Risto Anton Päärni', body);
}

// ============================================================
// BOOKING ADMIN NOTIFICATION
// ============================================================

export function bookingAdminNotificationTemplate(variables: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  dateTime: string;
  durationMinutes: number;
  company: string;
  notes: string;
  adminLink: string;
  meetLink?: string;
}): string {
  const body = `
    <h1 style="margin: 0 0 24px 0; font-size: 28px; font-weight: 700; color: #f9fafb; line-height: 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Uusi varaus 🎉
    </h1>

    <p style="margin: 0 0 24px 0; font-size: 15px; color: #d1d5db; line-height: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Sinulle on tullut uusi varaus.
    </p>

    <!-- Booking Details Card -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px; background-color: #1f2937; border-radius: 8px; border: 1px solid #374151;">
      <tr>
        <td style="padding: 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Asiakas</td>
            </tr>
            <tr>
              <td style="font-size: 16px; font-weight: 600; color: #f9fafb; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${escapeHtml(variables.customerName)}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Sähköposti</td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #60a5fa; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <a href="mailto:${variables.customerEmail}" style="color: #60a5fa; text-decoration: none;">${escapeHtml(variables.customerEmail)}</a>
              </td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Puhelin</td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #d1d5db; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${escapeHtml(variables.customerPhone)}</td>
            </tr>
            <tr>
              <td style="border-top: 1px solid #374151; padding-top: 16px;"></td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; padding-top: 16px; padding-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Palvelu</td>
            </tr>
            <tr>
              <td style="font-size: 16px; font-weight: 600; color: #f9fafb; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${escapeHtml(variables.serviceName)}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">📅 Aika</td>
            </tr>
            <tr>
              <td style="font-size: 16px; color: #60a5fa; font-weight: 500; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${escapeHtml(variables.dateTime)}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">💼 Yritys</td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #d1d5db; padding-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${escapeHtml(variables.company)}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">📝 Lisätiedot</td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #d1d5db; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${escapeHtml(variables.notes)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr>
        ${
          variables.meetLink
            ? `<td align="center" style="background-color: #0ea5e9; border-radius: 8px; padding-right: 8px;">
          <a href="${escapeHtml(variables.meetLink)}" target="_blank" class="btn" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 500; color: #ffffff; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            Avaa Jitsi
          </a>
        </td>`
            : ''
        }
        <td align="center" style="background-color: #2563eb; border-radius: 8px;">
          <a href="${variables.adminLink}" target="_blank" class="btn" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 500; color: #ffffff; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            Avaa varaus
          </a>
        </td>
      </tr>
    </table>
    ${
      variables.meetLink
        ? `<p style="margin: 0 0 20px 0; font-size: 13px; color: #9ca3af; line-height: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Jitsi-linkki: <a href="${escapeHtml(variables.meetLink)}" style="color: #60a5fa; text-decoration: none;">${escapeHtml(variables.meetLink)}</a>
    </p>`
        : ''
    }

    <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      Risto Anton Päärni · Lifetime Oy · Helsinki<br>
      <a href="https://dws10.com" style="color: #60a5fa; text-decoration: none;">dws10.com</a>
    </p>
  `;
  return baseLayout('Uusi varaus — DWS IQ', body);
}

// ============================================================
// UTILITIES
// ============================================================

/**
 * Escapes HTML special characters to prevent XSS in email content.
 */
function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
}
