// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=lane-c-coverage Date=2026-09-27
// Audit trail: git log -- src/__tests__/billing.service.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  axiosPost: vi.fn(),
  invoiceItemCreate: vi.fn(),
  invoiceCreate: vi.fn(),
  invoiceRetrieve: vi.fn(),
  invoiceSend: vi.fn(),
  invoiceVoid: vi.fn(),
  refundCreate: vi.fn(),
  from: vi.fn(),
  rpc: vi.fn(),
  sendEmail: vi.fn(),
}));

vi.mock('axios', () => ({ default: { post: mocks.axiosPost } }));
vi.mock('stripe', () => ({
  default: class StripeMock {
    invoiceItems = { create: mocks.invoiceItemCreate };
    invoices = {
      create: mocks.invoiceCreate,
      retrieve: mocks.invoiceRetrieve,
      sendInvoice: mocks.invoiceSend,
      voidInvoice: mocks.invoiceVoid,
    };
    refunds = { create: mocks.refundCreate };
  },
}));
vi.mock('../services/supabase.service.js', () => ({
  supabase: { from: mocks.from, rpc: mocks.rpc },
}));
vi.mock('../utils/send-email.js', () => ({ sendEmail: mocks.sendEmail }));

const billing = await import('../services/billing.service.js');

function queryResult(result: Record<string, unknown>) {
  const builder: Record<string, ReturnType<typeof vi.fn>> = {};
  builder.select = vi.fn(() => builder);
  builder.eq = vi.fn(() => builder);
  builder.single = vi.fn().mockResolvedValue(result);
  return builder;
}

describe('billing service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = 'sk_test_billing';
  });

  it('validates VAT response behavior and preserves the requested number', async () => {
    mocks.axiosPost.mockResolvedValueOnce({ status: 200 });
    await expect(billing.validateVATNumber('fi12345678')).resolves.toEqual({
      valid: true,
      country: 'FI',
      vat_number: 'fi12345678',
    });

    mocks.axiosPost.mockRejectedValueOnce(new Error('VIES unavailable'));
    await expect(billing.validateVATNumber('DE123')).resolves.toEqual({
      valid: false,
      country: 'DE',
      vat_number: 'DE123',
    });
  });

  it('creates balanced invoice items and a due-date invoice', async () => {
    mocks.invoiceItemCreate.mockResolvedValue({});
    mocks.invoiceCreate.mockResolvedValue({ id: 'in_1' });
    const due = new Date('2026-10-31T00:00:00.000Z');

    const invoice = await billing.createStripeInvoice({
      order_id: 'order-1',
      user_id: 'user-1',
      company_name: 'Example Oy',
      vat_number: 'FI12345678',
      billing_address: 'Testikatu 1',
      city: 'Helsinki',
      postal_code: '00100',
      country: 'FI',
      contact_email: 'billing@example.com',
      product_id: 'product-1',
      remainder_amount_cents: 7500,
      product_price_cents: 10000,
      deposit_amount_cents: 2500,
      payment_due_date: due,
    });

    expect(invoice).toEqual({ id: 'in_1' });
    expect(mocks.invoiceItemCreate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ customer: 'user-1', amount: 10000 }),
    );
    expect(mocks.invoiceItemCreate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ customer: 'user-1', amount: -2500 }),
    );
    expect(mocks.invoiceCreate).toHaveBeenCalledWith(
      expect.objectContaining({ customer: 'user-1', due_date: due.getTime() / 1000 }),
    );
  });

  it('marks the matching order paid and sends its confirmation', async () => {
    const order = {
      id: 'order-2',
      company_billing_profile_id: 'profile-1',
      product_id: 'product-1',
      product_price_cents: 12000,
    };
    const orderBuilder = queryResult({ data: order, error: null });
    const profileBuilder = queryResult({
      data: { company_name: 'Example Oy', contact_email: 'billing@example.com' },
      error: null,
    });
    mocks.from.mockImplementation((table: string) =>
      table === 'orders' ? orderBuilder : profileBuilder,
    );
    mocks.rpc.mockResolvedValue({ error: null });
    mocks.sendEmail.mockResolvedValue({ ok: true, transport: 'test' });

    await billing.handleInvoicePaymentSucceeded('in_paid');

    expect(mocks.rpc).toHaveBeenCalledWith('mark_order_paid', { p_order_id: 'order-2' });
    expect(mocks.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'billing@example.com',
        subject: expect.stringContaining('order-2'),
      }),
    );
  });

  it('never returns a negative invoice remainder', () => {
    expect(billing.getInvoicePreview(1000, 1200)).toEqual({
      subtotal: 1000,
      deposit: 1200,
      remainder: 0,
    });
  });
});
