// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- src/__tests__/email-webhook.routes.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import crypto from 'crypto';
import express from 'express';
import supertest from 'supertest';

const { default: emailRouter } = await import('../routes/email-webhook.routes.js');
const { setCertFetcherForTests } = await import('../utils/sns-verify.js');
const emailTracking = await import('../services/email-tracking.service.js');

vi.mock('../services/email-tracking.service.js', () => ({
  emailTrackingService: {
    logEmailBounced: vi.fn(async () => ({})),
    logEmailOpened: vi.fn(async () => ({})),
    logEmailClicked: vi.fn(async () => ({})),
    logEmailComplained: vi.fn(async () => ({})),
  },
}));

vi.mock('../config/supabase.js', () => ({ getSupabaseClient: () => null }));

// ---- RSA keypair + self-signed cert stand-in for the SNS signing cert ----
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
// The verifier extracts a public key from a PEM cert; for tests we hand back a
// PEM public key — Node's createVerify().verify accepts either.
const CERT_PEM = publicKey.export({ type: 'spki', format: 'pem' }).toString();
setCertFetcherForTests(async () => CERT_PEM);

function signSns(msg: Record<string, unknown>): string {
  const parts: string[] = [];
  const t = msg.Type as string;
  if (t === 'Notification') {
    parts.push('Message', msg.Message as string, 'MessageId', msg.MessageId as string);
    if (msg.Subject) parts.push('Subject', msg.Subject as string);
    parts.push('Timestamp', msg.Timestamp as string, 'TopicArn', msg.TopicArn as string, 'Type', t);
  } else {
    parts.push(
      'Message', msg.Message as string,
      'MessageId', msg.MessageId as string,
      'SubscribeURL', msg.SubscribeURL as string,
      'Timestamp', msg.Timestamp as string,
      'Token', msg.Token as string,
      'TopicArn', msg.TopicArn as string,
      'Type', t,
    );
  }
  return crypto.createSign('SHA1').update(parts.map(String).join('\n')).sign(privateKey, 'base64');
}

function snsEnvelope(msg: Record<string, unknown>) {
  return {
    ...msg,
    SignatureVersion: '1',
    Signature: signSns(msg),
    SigningCertURL: 'https://sns.eu-north-1.amazonaws.com/SimpleNotificationService-test.pem',
  };
}

function buildApp() {
  const app = express();
  app.use(express.json({
    limit: '10kb',
    verify: (req, _res, buf) => { (req as express.Request & { rawBody?: Buffer }).rawBody = buf; },
  }));
  app.use('/webhooks/email', emailRouter);
  return app;
}

const sesEvent = JSON.stringify({
  eventType: 'Bounce',
  messageId: 'mid-1',
  bounce: { bounceType: 'Permanent', bouncedRecipients: [{ emailAddress: 'a@b.c' }] },
});

describe('SES webhook: fail-closed SNS verification', () => {
  beforeEach(() => vi.clearAllMocks());

  it('rejects a bare forged SES event with no SNS envelope (401)', async () => {
    // Attacker's dream from before this patch: direct POST of an SES event body.
    const res = await supertest(buildApp()).post('/webhooks/email/ses').send(JSON.parse(sesEvent));
    expect(res.status).toBe(401);
    expect(emailTracking.emailTrackingService.logEmailBounced).not.toHaveBeenCalled();
  });

  it('rejects a signed envelope whose signature does not cover the body (401)', async () => {
    const envelope = snsEnvelope({ Type: 'Notification', MessageId: 'm1', Message: sesEvent, Timestamp: new Date().toISOString(), TopicArn: 'arn:aws:sns:eu-north-1:1:t' });
    const tampered = { ...envelope, Message: sesEvent.replace('Bounce', 'Complaint') };
    const res = await supertest(buildApp()).post('/webhooks/email/ses').set('Content-Type', 'application/json').send(tampered);
    expect(res.status).toBe(401);
    expect(emailTracking.emailTrackingService.logEmailBounced).not.toHaveBeenCalled();
  });

  it('rejects a SigningCertURL outside the amazonaws.com SNS namespace (401)', async () => {
    const msg = { Type: 'Notification', MessageId: 'm2', Message: sesEvent, Timestamp: new Date().toISOString(), TopicArn: 'arn:x', SignatureVersion: '1', Signature: 'aa', SigningCertURL: 'https://evil.example.com/cert.pem' };
    const res = await supertest(buildApp()).post('/webhooks/email/ses').set('Content-Type', 'application/json').send(msg);
    expect(res.status).toBe(401);
  });

  it('accepts a correctly signed Notification and processes the bounce', async () => {
    const envelope = snsEnvelope({ Type: 'Notification', MessageId: 'm3', Message: sesEvent, Timestamp: new Date().toISOString(), TopicArn: 'arn:aws:sns:eu-north-1:1:t' });
    const res = await supertest(buildApp()).post('/webhooks/email/ses').set('Content-Type', 'application/json').send(envelope);
    console.log('DEBUG-BODY', JSON.stringify(res.body));
    expect(res.status).toBe(200);
    expect(res.body.processed).toBe(1);
    expect(emailTracking.emailTrackingService.logEmailBounced).toHaveBeenCalledOnce();
  });
});
