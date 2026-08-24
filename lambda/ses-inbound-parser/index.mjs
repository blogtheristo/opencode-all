// ============================================================
// DWS IQ 6 — SES Inbound Parser Lambda
// ------------------------------------------------------------
// Code-Version: 0.1.0
// Introduced-In: PR-TBD
// Branch: claude/fix-mcp-hooks-hardening-v2
// Date: 2026-04-19
// Owner: Lifetime Oy
//
// Trigger: SNS (from SES receipt rule)
// Action:  Fetch raw .eml from S3 → parse → insert into Supabase
// Runtime: nodejs20.x
// Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (AWS Secrets Manager)
// ============================================================
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { createClient } from '@supabase/supabase-js';
import { simpleParser } from 'mailparser';

const REGION = process.env.AWS_REGION || 'eu-west-1';
const SECRET_ID = process.env.SUPABASE_SECRET_ID || 'lifetime/supabase/ses-inbound';
const s3 = new S3Client({ region: REGION });
const sm = new SecretsManagerClient({ region: REGION });

let supabase;
async function getSupabase() {
  if (supabase) return supabase;
  const out = await sm.send(new GetSecretValueCommand({ SecretId: SECRET_ID }));
  const { url, serviceRoleKey } = JSON.parse(out.SecretString);
  supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  return supabase;
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const c of stream) chunks.push(c);
  return Buffer.concat(chunks);
}

export const handler = async (event) => {
  const results = [];
  for (const record of event.Records || []) {
    const sns = JSON.parse(record.Sns.Message);
    const sesMsg = sns.mail;
    const messageId = sesMsg.messageId;
    const bucket = sns.receipt.action.bucketName;
    const key = sns.receipt.action.objectKey;

    try {
      const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      const raw = await streamToBuffer(obj.Body);
      const parsed = await simpleParser(raw);

      const db = await getSupabase();
      const { error } = await db.from('inbound_emails').insert({
        ses_message_id: messageId,
        received_at: sesMsg.timestamp,
        from_addr: parsed.from?.text ?? sesMsg.source,
        to_addrs: (parsed.to?.value || []).map((a) => a.address),
        subject: parsed.subject ?? null,
        body_text: parsed.text ?? null,
        body_html: parsed.html || null,
        s3_key: key,
        raw_headers: Object.fromEntries(parsed.headerLines.map((h) => [h.key, h.line])),
        processed_at: new Date().toISOString(),
      });
      if (error) throw error;
      results.push({ messageId, status: 'ok' });
    } catch (err) {
      console.error('parse failed', messageId, err);
      const db = await getSupabase().catch(() => null);
      if (db) {
        await db.from('inbound_emails').upsert(
          {
            ses_message_id: messageId,
            received_at: sesMsg.timestamp,
            s3_key: key,
            error: String(err?.message ?? err),
            processed_at: new Date().toISOString(),
          },
          { onConflict: 'ses_message_id' },
        );
      }
      results.push({ messageId, status: 'error', error: String(err?.message ?? err) });
    }
  }
  return { processed: results.length, results };
};
