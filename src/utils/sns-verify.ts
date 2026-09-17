// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- src/utils/sns-verify.ts
//
// AWS SNS message signature verification (SignatureVersion 1).
//
// Contract (fail-closed):
//  - Only messages whose SigningCertURL is HTTPS on *.sns.<region>.amazonaws.com
//    are accepted — no attacker-controlled certificate hosts.
//  - The SignatureBaseString is rebuilt exactly per AWS docs per message type.
//  - Signatures are RSA-SHA1 over the base string, compared via crypto.verify
//    (not string equality).
//  - Certificates are cached for 1h; the fetcher is injectable for tests.
import crypto from 'node:crypto';

const CERT_URL_RE = /^https:\/\/sns\.[a-z0-9-]+\.amazonaws\.com\/[^"'\s]+\.pem$/;
const CERT_TTL_MS = 60 * 60 * 1000;

export interface SnsMessage {
  Type: 'Notification' | 'SubscriptionConfirmation' | 'UnsubscribeConfirmation';
  MessageId?: string;
  Message?: string;
  Timestamp?: string;
  TopicArn?: string;
  Subject?: string;
  SubscribeURL?: string;
  Token?: string;
  SignatureVersion?: string;
  Signature?: string;
  SigningCertURL?: string;
}

type CertFetcher = (url: string) => Promise<string>;
let certFetcher: CertFetcher = async (url) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`cert fetch ${res.status}`);
  return res.text();
};

/** Test hook: replace the certificate fetcher (restore with null). */
export function setCertFetcherForTests(fn: CertFetcher | null): void {
  certFetcher = fn ?? (async (url) => {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`cert fetch ${res.status}`);
    return res.text();
  });
}

const certCache = new Map<string, { pem: string; expires: number }>();

async function loadCert(url: string): Promise<string> {
  const cached = certCache.get(url);
  if (cached && cached.expires > Date.now()) return cached.pem;
  const pem = await certFetcher(url);
  // Production SNS returns an X.509 cert; tests may supply a bare SPKI key.
  // Either way it must look like a PEM, and the host is already pinned above.
  if (!/-----BEGIN (CERTIFICATE|PUBLIC KEY)-----/.test(pem)) {
    throw new Error('not a PEM certificate');
  }
  certCache.set(url, { pem, expires: Date.now() + CERT_TTL_MS });
  return pem;
}

function baseStringFor(msg: SnsMessage): string {
  // Field order and inclusion are mandated by AWS SNS signature v1 docs.
  const t = msg.Type;
  if (t === 'Notification') {
    const parts = [
      'Message', msg.Message,
      'MessageId', msg.MessageId,
      ...(msg.Subject ? ['Subject', msg.Subject] : []),
      'Timestamp', msg.Timestamp,
      'TopicArn', msg.TopicArn,
      'Type', t,
    ];
    return parts.map((p) => String(p)).join('\n');
  }
  // SubscriptionConfirmation / UnsubscribeConfirmation
  return [
    'Message', msg.Message,
    'MessageId', msg.MessageId,
    'SubscribeURL', msg.SubscribeURL,
    'Timestamp', msg.Timestamp,
    'Token', msg.Token,
    'TopicArn', msg.TopicArn,
    'Type', t,
  ].map((p) => String(p)).join('\n');
}

export type SnsVerifyResult =
  | { ok: true; message: SnsMessage }
  | { ok: false; status: number; error: string };

/**
 * Verify an inbound SNS envelope over the exact raw request bytes.
 * Returns ok:false with an HTTP status on ANY failure (fail closed).
 */
export async function verifySnsEnvelope(rawBody: Buffer): Promise<SnsVerifyResult> {
  let msg: SnsMessage;
  try {
    msg = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return { ok: false, status: 400, error: 'Body is not valid JSON' };
  }

  if (
    msg?.Type !== 'Notification' &&
    msg?.Type !== 'SubscriptionConfirmation' &&
    msg?.Type !== 'UnsubscribeConfirmation'
  ) {
    return { ok: false, status: 401, error: 'Not an SNS message' };
  }
  if (msg.SignatureVersion !== '1') {
    return { ok: false, status: 401, error: 'Unsupported SignatureVersion' };
  }
  if (!msg.Signature || !msg.SigningCertURL) {
    return { ok: false, status: 401, error: 'Missing signature or certificate URL' };
  }
  if (!CERT_URL_RE.test(msg.SigningCertURL)) {
    return { ok: false, status: 401, error: 'SigningCertURL outside amazonaws.com SNS namespace' };
  }

  let pem: string;
  try {
    pem = await loadCert(msg.SigningCertURL);
  } catch (e) {
    return { ok: false, status: 401, error: `Certificate unavailable: ${(e as Error).message}` };
  }

  const base = baseStringFor(msg);
  const ok = crypto.createVerify('SHA1').update(base).verify(pem, msg.Signature, 'base64');
  if (!ok) return { ok: false, status: 401, error: 'Invalid SNS signature' };
  return { ok: true, message: msg };
}

/**
 * Confirm a subscription by GET-ing its SubscribeURL — allowed only when the
 * URL is HTTPS on the amazonaws.com SNS namespace.
 */
export async function confirmSubscribeUrl(subscribeUrl: string | undefined): Promise<boolean> {
  if (!subscribeUrl || !/^https:\/\/sns\.[a-z0-9-]+\.amazonaws\.com\//.test(subscribeUrl)) {
    return false;
  }
  try {
    const res = await fetch(subscribeUrl, { signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}
