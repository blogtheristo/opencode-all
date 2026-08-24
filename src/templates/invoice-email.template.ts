/**
 * Email template: Stripe invoice issued
 * Sent after Revolut deposit is confirmed and Stripe invoice created
 */

interface InvoiceEmailParams {
  customer_name: string;
  company_name: string;
  order_id: string;
  invoice_url: string;
  invoice_amount_eur: number;
  product_name: string;
  payment_due_date: string;
  contact_email: string;
}

export function generateInvoiceEmailHTML(params: InvoiceEmailParams): string {
  const {
    customer_name,
    company_name,
    order_id,
    invoice_url,
    invoice_amount_eur,
    product_name,
    payment_due_date,
  } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .invoice-section { background: #fff; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .amount { font-size: 24px; font-weight: bold; color: #1a73e8; }
    .cta-button { display: inline-block; background: #1a73e8; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin: 20px 0; }
    .footer { color: #666; font-size: 12px; border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Invoice Ready</h1>
      <p>Hello ${customer_name},</p>
      <p>Your DWS order has been confirmed and your invoice is ready for payment.</p>
    </div>

    <div class="invoice-section">
      <h2>Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 10px 0;"><strong>Order ID:</strong></td>
          <td style="padding: 10px 0; text-align: right;"><code>${order_id}</code></td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 10px 0;"><strong>Company:</strong></td>
          <td style="padding: 10px 0; text-align: right;">${company_name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 10px 0;"><strong>Product:</strong></td>
          <td style="padding: 10px 0; text-align: right;">${product_name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 10px 0;"><strong>Amount Due:</strong></td>
          <td style="padding: 10px 0; text-align: right;">
            <span class="amount">€${(invoice_amount_eur / 100).toFixed(2)}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0;"><strong>Due Date:</strong></td>
          <td style="padding: 10px 0; text-align: right;">${payment_due_date}</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center;">
      <a href="${invoice_url}" class="cta-button">View & Pay Invoice</a>
    </div>

    <div style="background: #f0f8ff; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Payment Methods</h3>
      <p>Pay your invoice via Stripe using:</p>
      <ul>
        <li>Credit/Debit Card (Visa, Mastercard, Amex)</li>
        <li>SEPA Bank Transfer (EU)</li>
        <li>iDEAL (Netherlands)</li>
        <li>Klarna (Germany, Sweden)</li>
      </ul>
    </div>

    <div style="background: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Questions?</h3>
      <p>If you have any questions about your invoice or need assistance with payment, reply to this email or contact our team at <strong>support@lifetime.fi</strong>.</p>
    </div>

    <div class="footer">
      <p><strong>Lifetime Oy</strong> | Business ID: 0772407-9 | VAT: FI07724079</p>
      <p>Laidunmaanraitti 2 A 25, 02330 Espoo, Finland</p>
      <p>This is an automated email. Please do not reply with sensitive information.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateInvoiceEmailPlainText(params: InvoiceEmailParams): string {
  const {
    customer_name,
    company_name,
    order_id,
    invoice_url,
    invoice_amount_eur,
    product_name,
    payment_due_date,
  } = params;

  return `
Invoice Ready

Hello ${customer_name},

Your DWS order has been confirmed and your invoice is ready for payment.

ORDER SUMMARY
─────────────
Order ID:      ${order_id}
Company:       ${company_name}
Product:       ${product_name}
Amount Due:    €${(invoice_amount_eur / 100).toFixed(2)}
Due Date:      ${payment_due_date}

VIEW & PAY INVOICE
─────────────────
${invoice_url}

PAYMENT METHODS
───────────────
You can pay your invoice via Stripe using:
- Credit/Debit Card (Visa, Mastercard, Amex)
- SEPA Bank Transfer (EU)
- iDEAL (Netherlands)
- Klarna (Germany, Sweden)

QUESTIONS?
──────────
If you have any questions about your invoice or need assistance with payment,
reply to this email or contact our team at support@lifetime.fi.

─────────────────────────────────────────────────────
Lifetime Oy
Business ID: 0772407-9 | VAT: FI07724079
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland

This is an automated email. Please do not reply with sensitive information.
  `;
}

/**
 * Email template: Invoice payment confirmation
 * Sent after Stripe payment is successful
 */

interface PaymentConfirmationParams {
  customer_name: string;
  company_name: string;
  order_id: string;
  paid_date: string;
  invoice_amount_eur: number;
  product_name: string;
}

export function generatePaymentConfirmationHTML(params: PaymentConfirmationParams): string {
  const { customer_name, company_name, order_id, paid_date, invoice_amount_eur, product_name } =
    params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .success-box { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .success-icon { font-size: 48px; margin-bottom: 10px; }
    .receipt { background: #fff; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .footer { color: #666; font-size: 12px; border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="success-box">
      <div class="success-icon">✓</div>
      <h1 style="margin-top: 0; color: #155724;">Payment Confirmed</h1>
      <p>Thank you for your payment, ${customer_name}. Your order is now active.</p>
    </div>

    <div class="receipt">
      <h2>Receipt</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 10px 0;"><strong>Order ID:</strong></td>
          <td style="padding: 10px 0; text-align: right;"><code>${order_id}</code></td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 10px 0;"><strong>Company:</strong></td>
          <td style="padding: 10px 0; text-align: right;">${company_name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 10px 0;"><strong>Product:</strong></td>
          <td style="padding: 10px 0; text-align: right;">${product_name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 10px 0;"><strong>Amount Paid:</strong></td>
          <td style="padding: 10px 0; text-align: right; font-size: 18px; font-weight: bold; color: #155724;">
            €${(invoice_amount_eur / 100).toFixed(2)}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0;"><strong>Paid Date:</strong></td>
          <td style="padding: 10px 0; text-align: right;">${paid_date}</td>
        </tr>
      </table>
    </div>

    <div style="background: #e7f3ff; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <h3 style="margin-top: 0;">What's Next?</h3>
      <p>Your DWS service is now active. You can access your platform at:</p>
      <p><strong><a href="https://dws6.com/dashboard" style="color: #1a73e8;">Login to Dashboard</a></strong></p>
    </div>

    <div class="footer">
      <p><strong>Lifetime Oy</strong> | Business ID: 0772407-9 | VAT: FI07724079</p>
      <p>Laidunmaanraitti 2 A 25, 02330 Espoo, Finland</p>
      <p>This is an automated email. Please do not reply with sensitive information.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generatePaymentConfirmationPlainText(params: PaymentConfirmationParams): string {
  const { customer_name, company_name, order_id, paid_date, invoice_amount_eur, product_name } =
    params;

  return `
Payment Confirmed

Thank you for your payment, ${customer_name}. Your order is now active.

RECEIPT
───────
Order ID:      ${order_id}
Company:       ${company_name}
Product:       ${product_name}
Amount Paid:   €${(invoice_amount_eur / 100).toFixed(2)}
Paid Date:     ${paid_date}

WHAT'S NEXT?
────────────
Your DWS service is now active. You can access your platform at:
https://dws6.com/dashboard

─────────────────────────────────────────────────────
Lifetime Oy
Business ID: 0772407-9 | VAT: FI07724079
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland

This is an automated email. Please do not reply with sensitive information.
  `;
}
