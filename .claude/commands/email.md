Send an email or manage Resend email operations for DWS IQ 6.

Usage: /email <action> [arguments]

Input: $ARGUMENTS

## Actions

### send — Send a transactional email
```
/email send to=user@example.com subject="Report ready" body="Your CSRD report is available." template=notification
```

### batch — Send multiple emails in one Resend API call (up to 100)
```
/email batch to=a@x.com,b@x.com subject="Compliance update" body="Action required."
```

### status — Check delivery status of an email by resend_email_id
```
/email status email_id=email_abc123
```

### digest — Trigger the outreach digest manually
```
/email digest
```

## Steps

1. Parse the action from $ARGUMENTS (first word)
2. For **send**: POST to `POST /api/v1/email/send-direct` with `{ to, subject, html, templateType }`
   - Use `notificationTemplate` for generic messages
   - Sender is always `risto@onelifetime.world` (DWS email rule — never noreply)
3. For **batch**: call `emailService.sendBatch()` with the list of recipients
4. For **status**: query Supabase `email_logs` where `resend_email_id = <id>`
5. For **digest**: run `npx tsx scripts/send-outreach-digest.ts` with `SKIP_TIME_CHECK=true`

## MCP Alternative

The Resend MCP server is available at `.mcp.json` — it can send emails, manage contacts,
list broadcasts, and verify domains directly from any MCP client:

```bash
# Claude Code: the MCP is pre-configured via .mcp.json
# Just ask: "Send an email to risto@lifetime.fi with subject Hello"
```

## Rules

- Sender MUST be `risto@onelifetime.world` (verified Resend domain)
- Never use noreply@ addresses
- Log all sends to Supabase `email_logs` with `resend_email_id`
- Delivery status (delivered/bounced/complained) flows via `/webhooks/resend/inbound`
