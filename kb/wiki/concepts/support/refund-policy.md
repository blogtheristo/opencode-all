# Refund Policy

DWS IQ refunds are handled by Lifetime Oy (FI07724079). The Helpdesk agent must
never approve a refund on its own — refund cases are always recommended for human
review via the `refund` action.

## Eligibility

- **DWS IQ subscriptions (monthly)**: pro-rated refund available within the first
  14 days of a new billing period if no agent calls have been made and the
  customer files a written request.
- **DWS IQ subscriptions (annual)**: pro-rated refund available within the first
  30 days of the initial annual term. After 30 days, no refunds; the subscription
  may be cancelled to prevent renewal.
- **One-time products (e.g. DWS-IQ-006, FH-AUTO-001)**: 14-day money-back guarantee
  from delivery date if the product has not been activated/installed.
- **Enterprise contracts**: refund terms follow the signed contract; default to
  escalation.

## Out of scope (no refund)

- Usage overages already invoiced.
- Custom development work delivered against an SOW.
- Onboarding/setup fees once onboarding has started.

## Process

1. Helpdesk agent recommends `refund`; never promises an amount.
2. Human reviewer confirms eligibility against this policy and the contract.
3. Finance (Risto) issues the refund via the original payment provider
   (Revolut for EU, PayPal otherwise) and updates `subscriptions.cancellation_reason`.

## Tone for draft replies

Acknowledge the request specifically, state that a teammate will confirm
eligibility within one business day, and avoid committing to an amount or
timeline. Do not apologise excessively.
