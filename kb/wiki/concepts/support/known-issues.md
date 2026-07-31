# Known Issues

Maintained list of common issues with vetted responses. The Helpdesk agent may
cite this file directly in `citedPolicySources`.

> Update this file when a new issue is seen 3+ times. Stale items should be
> removed once the underlying bug is fixed.

## KI-001 — Email delivery shows "queued" but customer never receives

**Symptom:** Customer reports they never received the confirmation/booking email.
**Cause:** SES region (eu-north-1) cold-start delay, or recipient domain rejects
unauthenticated mail.
**Reply guidance:** Ask the customer to check spam, then confirm the
`email_queue` row for their address shows `status='sent'`. If it shows `failed`,
escalate with the error message.

## KI-002 — Agent calls return 429 mid-month

**Symptom:** "Rate limit exceeded" errors on Pro tier.
**Cause:** Plan `agent_calls_per_month` exhausted before billing reset.
**Reply guidance:** Recommend `plan-upgrade-suggest` and reference
`plan-limits.md`. Quote the current tier's allocation. Do NOT offer a temporary
override — that requires `escalate`.

## KI-003 — Booking confirmation arrives in Finnish for an English-speaking customer

**Symptom:** Customer complains the email is in Finnish.
**Cause:** Templates currently default to Finnish (fi-FI locale) regardless of
the customer's preferred language.
**Reply guidance:** Acknowledge the bug, apologise once, share the meeting
details in English in the reply itself. Flag for product backlog (do not
escalate as P1).

## KI-004 — Dashboard "Failed to load" on first sign-in after onboarding

**Symptom:** Brand new customer sees an error on their first dashboard load.
**Cause:** `customer_onboarding.completed_at` is `NULL` until the onboarding
form is submitted; dashboard guards on that field.
**Reply guidance:** Walk the customer through completing onboarding at
`/onboard`. After completion, the dashboard loads normally. No escalation.

## KI-005 — "Where is my invoice?"

**Symptom:** Customer cannot find their invoice.
**Cause:** Invoices are emailed by the payment provider (Revolut for EU,
PayPal otherwise) on the next billing date, not at signup.
**Reply guidance:** Point to the provider's portal and explain that the
first invoice arrives on `subscriptions.next_billing_date`. If the customer
needs a copy for accounting before then, escalate to finance.
