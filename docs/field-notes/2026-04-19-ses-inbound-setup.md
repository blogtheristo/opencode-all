# SES Inbound (eu-west-1) — Setup Runbook

**Date:** 2026-04-19
**Owner:** risto.paarni@lifetime.fi
**Branch:** claude/fix-mcp-hooks-hardening-v2

## Goal

Receive email at `*@agents.onelifetime.world`, parse, and store in Supabase
`inbound_emails` for agent consumption.

## Architecture

```
Sender → MX(agents.onelifetime.world) → SES eu-west-1
   → S3 (lifetime-inbound-mail-euw1, prefix inbound/)
   → SNS (lifetime-ses-inbound-euw1)
   → Lambda (ses-inbound-parser, nodejs20.x)
   → Supabase public.inbound_emails
```

Why eu-west-1: SES inbound is unsupported in eu-north-1 (Stockholm).
Sending stays in eu-north-1 unchanged.

## Prereqs

- AWS CLI v2 + `jq`
- AWS profile with admin in account `406223549445` (env: `AWS_PROFILE=lifetime`)
- Cloudflare DNS access for `onelifetime.world`
- Supabase project URL + service-role key

## Steps

### 1. Run AWS bootstrap (dry-run first)

```bash
./scripts/aws/setup-ses-inbound-euw1.sh             # dry-run, prints plan
./scripts/aws/setup-ses-inbound-euw1.sh --apply     # execute
```

This creates: SES domain identity, S3 bucket (encrypted, public-blocked),
S3 bucket policy, SNS topic, SES receipt rule set + rule.

### 2. Add DNS records in Cloudflare (`onelifetime.world` zone)

The script prints the exact records. Add:

- `agents.onelifetime.world` MX 10 → `inbound-smtp.eu-west-1.amazonaws.com`
- 3× DKIM CNAMEs (`*._domainkey.agents.onelifetime.world`)
- TXT verification record (from SES console after `create-email-identity`)

Wait for `aws sesv2 get-email-identity --email-identity agents.onelifetime.world`
to show `VerifiedForSendingStatus: true` and DKIM `SUCCESS`.

### 3. Apply Supabase migration

```bash
psql "$SUPABASE_DB_URL" -f supabase/migrations/061_inbound_emails.sql
# or via Supabase CLI / dashboard SQL editor
```

### 4. Store Supabase creds in AWS Secrets Manager

```bash
aws secretsmanager create-secret \
  --name lifetime/supabase/ses-inbound \
  --secret-string '{"url":"https://<proj>.supabase.co","serviceRoleKey":"<key>"}' \
  --region eu-west-1
```

### 5. Deploy Lambda

See `lambda/ses-inbound-parser/README.md`. Build, create IAM role,
create function. Capture function ARN.

### 6. Wire Lambda to SNS

```bash
./scripts/aws/setup-ses-inbound-euw1.sh --apply \
  --lambda-arn=arn:aws:lambda:eu-west-1:406223549445:function:ses-inbound-parser
```

### 7. End-to-end test

```bash
# From any external mailbox
echo "test body" | mail -s "ses inbound smoke test" hello@agents.onelifetime.world

# Verify
psql "$SUPABASE_DB_URL" -c \
  "SELECT received_at, from_addr, subject FROM inbound_emails ORDER BY received_at DESC LIMIT 5;"
```

## Cost (steady-state estimate)

- SES inbound: $0.10 / 1000 emails
- S3 storage: ~$0.023/GB-month (raw .eml)
- SNS: free at this volume
- Lambda: free tier covers <1M invocations
- Secrets Manager: $0.40/month per secret
- **Total at 1k inbound/month:** ~$0.50/month

## Hardening (later, not on first pass)

- S3 lifecycle: archive to Glacier after 90 days, expire after 2 years
- DLQ on Lambda for parse failures
- CloudWatch alarm: SNS DeliveryFailureRate > 0
- SES receipt rule: spam (SpamVerdict) and virus (VirusVerdict) gating
- Per-agent receiving subaddresses (`agent-name+token@agents.onelifetime.world`)
- Refine RLS once agent ownership model is decided

## Banned

- Resend SDK / resend.com — see CLAUDE.md "Email Rules" (post-Clawdbot incident)
- Production sending in any region other than eu-north-1 (already verified)
