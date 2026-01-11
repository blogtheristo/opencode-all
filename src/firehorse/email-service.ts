/**
 * Firehorse Omnichannel Next Pilot - Email Service
 * CustomerPilotLoop v1
 *
 * This is a simplified email service.
 * In production, integrate with:
 * - SendGrid
 * - Resend
 * - AWS SES
 * - etc.
 */

interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  lead_id: string;
}

class EmailService {
  /**
   * Send email
   * This is a stub - replace with actual email service integration
   */
  async send(payload: EmailPayload): Promise<void> {
    const { to, subject, body, lead_id } = payload;

    // Log email (for development)
    console.log('='.repeat(80));
    console.log('📧 EMAIL SEND');
    console.log('='.repeat(80));
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Lead ID: ${lead_id}`);
    console.log('-'.repeat(80));
    console.log(body);
    console.log('='.repeat(80));

    // TODO: Integrate with actual email service
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to,
      from: process.env.FROM_EMAIL,
      subject,
      text: body,
      html: body.replace(/\n/g, '<br>'),
      customArgs: {
        lead_id,
      },
    };

    await sgMail.send(msg);
    */

    // Example with Resend:
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      text: body,
      headers: {
        'X-Lead-ID': lead_id,
      },
    });
    */

    // Simulate async email send
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

export const emailService = new EmailService();
