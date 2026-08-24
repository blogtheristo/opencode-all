// Amazon SES SMTP sender for Supabase Edge Functions (Deno).
//
// Hard constraints (CLAUDE.md):
//   - SES SMTP only. No Resend, no SendGrid.
//   - No noreply@ senders.
//   - Region must be EU (eu-north-1 Finland, eu-west-1 Ireland,
//     eu-central-1 Frankfurt, or eu-south-1 Milan).
//
// Env vars (must be set on the Supabase project):
//   SMTP_HOST          e.g. email-smtp.eu-north-1.amazonaws.com
//   SMTP_PORT          587 (STARTTLS)
//   SMTP_USER          SES SMTP username (NOT a raw IAM access key)
//   SMTP_PASS          SES SMTP password
//   PLAYBOOKS_FROM     Optional override. Defaults to the already-verified
//                      "DWS Lifetime <risto@onelifetime.world>" mailbox.
//
// Implementation: Deno-port of nodemailer-style SMTP via denomailer.
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const DEFAULT_FROM = 'DWS Lifetime <risto@onelifetime.world>';

const ALLOWED_HOST_SUFFIXES = ['.eu-north-1.amazonaws.com', '.eu-west-1.amazonaws.com', '.eu-central-1.amazonaws.com', '.eu-south-1.amazonaws.com'];

function requireEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`missing required env: ${name}`);
  return v;
}

function assertEuSmtpHost(host: string): void {
  if (!ALLOWED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))) {
    throw new Error(
      `SMTP_HOST ${host} is not an EU SES endpoint — refusing to send (sovereignty rule)`,
    );
  }
}

export interface SendArgs {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail(args: SendArgs): Promise<void> {
  const host = requireEnv('SMTP_HOST');
  assertEuSmtpHost(host);
  const port = Number(Deno.env.get('SMTP_PORT') ?? '587');
  const user = requireEnv('SMTP_USER');
  const pass = requireEnv('SMTP_PASS');
  const from = Deno.env.get('PLAYBOOKS_FROM') ?? DEFAULT_FROM;

  if (from.toLowerCase().includes('noreply@')) {
    throw new Error('noreply@ senders are forbidden (CLAUDE.md rule)');
  }

  const client = new SMTPClient({
    connection: {
      hostname: host,
      port,
      tls: port === 465,
      auth: { username: user, password: pass },
    },
  });

  try {
    await client.send({
      from,
      to: args.to,
      subject: args.subject,
      content: args.text,
      html: args.html,
    });
  } finally {
    await client.close();
  }
}
