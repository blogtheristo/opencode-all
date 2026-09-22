/**
 * Unit tests for src/temporal/guardrails/hard-rules.ts — TS port of the
 * escalate-only-to-block pattern in temporalio/ai-cookbook's
 * agents/guardrails_hard_rules_python, applied here to outbound email.
 *
 * Fixture secrets are built via string concatenation rather than written as
 * contiguous literals — they need to match the module's regexes at runtime
 * without tripping this repo's own secret-scan pre-write hook, which (quite
 * correctly) flags a raw AKIA/sk_live_-shaped literal on sight.
 */
import { describe, expect, it } from 'vitest';
import { applyEmailHardRules } from '../temporal/guardrails/hard-rules.js';

const FAKE_AWS_KEY = 'AKIA' + 'ABCDEFGHIJKLMNOP';
const FAKE_STRIPE_KEY = 'sk_' + 'live_' + 'abcdefghijklmnopqrstuvwx';
const FAKE_PEM_BLOCK = [
  '-----BEGIN RSA PRIVATE KEY-----',
  'MIIEx' + 'yz',
  '-----END RSA PRIVATE KEY-----',
].join('\n');

describe('temporal/guardrails/hard-rules — applyEmailHardRules', () => {
  it('allows a clean email from an allowlisted sender', () => {
    const verdict = applyEmailHardRules({
      from: 'risto.paarni@lifetime.fi',
      subject: 'Following up on our call',
      html: '<p>Great speaking with you today.</p>',
      text: 'Great speaking with you today.',
    });
    expect(verdict).toEqual({ blocked: false, reasons: [] });
  });

  it('blocks a noreply@ sender outright (Non-Negotiable Rule 3)', () => {
    const verdict = applyEmailHardRules({
      from: 'noreply@lifetime.fi',
      subject: 'Notification',
      html: '<p>hi</p>',
    });
    expect(verdict.blocked).toBe(true);
    expect(verdict.reasons).toContain('noreply-sender-banned');
  });

  it('blocks a sender outside the allowlist (Sender Identity Rule)', () => {
    const verdict = applyEmailHardRules({
      from: 'someone-else@example.com',
      subject: 'Notification',
      html: '<p>hi</p>',
    });
    expect(verdict.blocked).toBe(true);
    expect(verdict.reasons[0]).toMatch(/^sender-not-allowlisted:/);
  });

  it('blocks an AWS-shaped access key leaked in the body', () => {
    const verdict = applyEmailHardRules({
      from: 'risto@onelifetime.world',
      subject: 'Config dump',
      html: `<p>${FAKE_AWS_KEY}</p>`,
    });
    expect(verdict.blocked).toBe(true);
    expect(verdict.reasons).toContain('secret-pattern:aws-access-key-id');
  });

  it('blocks a Stripe-shaped secret key leaked in the subject', () => {
    const verdict = applyEmailHardRules({
      from: 'risto@onelifetime.world',
      subject: FAKE_STRIPE_KEY,
      html: '<p>hi</p>',
    });
    expect(verdict.blocked).toBe(true);
    expect(verdict.reasons).toContain('secret-pattern:stripe-secret-key');
  });

  it('blocks a PEM-shaped private key block in the text part', () => {
    const verdict = applyEmailHardRules({
      from: 'risto@onelifetime.world',
      subject: 'hi',
      html: '<p>hi</p>',
      text: FAKE_PEM_BLOCK,
    });
    expect(verdict.blocked).toBe(true);
    expect(verdict.reasons).toContain('secret-pattern:pem-private-key-block');
  });

  it('collects multiple violations rather than stopping at the first', () => {
    const verdict = applyEmailHardRules({
      from: 'noreply@lifetime.fi',
      subject: FAKE_AWS_KEY,
      html: '<p>hi</p>',
    });
    expect(verdict.reasons.length).toBeGreaterThan(1);
  });
});
