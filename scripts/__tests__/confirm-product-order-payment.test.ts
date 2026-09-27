import { EventEmitter } from 'node:events';
import { describe, expect, it, vi } from 'vitest';

const spawn = vi.fn();
vi.mock('node:child_process', () => ({ spawn }));
const { validateConfirmation, runConfirmation } = await import('../confirm-product-order-payment.mjs');

const validInput = {
  orderId: '00000000-0000-4000-8000-000000000001',
  provider: 'paypal',
  reference: 'provider-ref/123',
  amountCents: '20000',
  currency: 'eur',
  actor: 'operator-1',
};

describe('local product payment confirmation', () => {
  it('normalizes valid operator input', () => {
    expect(validateConfirmation(validInput)).toEqual({
      ...validInput,
      amountCents: 20000,
      currency: 'EUR',
    });
  });

  it.each([
    [{ ...validInput, orderId: 'not-an-order' }, 'UUID'],
    [{ ...validInput, provider: 'stripe' }, 'Provider'],
    [{ ...validInput, reference: 'unsafe\nheader' }, 'reference'],
    [{ ...validInput, amountCents: '0' }, 'Amount'],
    [{ ...validInput, amountCents: '2.5' }, 'Amount'],
    [{ ...validInput, currency: 'EURO' }, 'Currency'],
    [{ ...validInput, actor: '' }, 'operator'],
  ])('refuses invalid payment evidence %#', (input, message) => {
    expect(() => validateConfirmation(input)).toThrow(message);
  });

  it('only sends confirmation to the local Docker backend without passing a key in arguments', async () => {
    const child = Object.assign(new EventEmitter(), {
      stdin: { end: vi.fn() },
    });
    spawn.mockReturnValueOnce(child);
    const done = runConfirmation(validInput);
    child.emit('close', 0);
    await done;
    const call = spawn.mock.calls.at(-1);
    if (!call) throw new Error('Docker execution was not attempted');
    const [command, args] = call;
    expect(command).toBe('docker');
    expect(args.slice(0, 5)).toEqual(['exec', '-i', 'dws-backend', 'node', '--input-type=module']);
    expect(args.join(' ')).toContain('http://127.0.0.1:8080/v1/orders/');
    expect(args.join(' ')).not.toContain(validInput.reference);
    expect(child.stdin.end).toHaveBeenCalledWith(JSON.stringify(validateConfirmation(validInput)));
  });

  it('fails when the local confirmation process rejects payment', async () => {
    const child = Object.assign(new EventEmitter(), { stdin: { end: vi.fn() } });
    spawn.mockReturnValueOnce(child);
    const done = runConfirmation(validInput);
    child.emit('close', 1);
    await expect(done).rejects.toThrow('exited 1');
  });
});
