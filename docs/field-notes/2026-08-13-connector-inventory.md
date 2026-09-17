<!--
VERSION AND AGENT HISTORY
Document: Connector Inventory — Connected Web Integrations
Version: 1.0
Date: 2026-08-13
Change 1.0: Recorded the connector inventory supplied by the HIC. Fifteen connectors
were supplied with Type=Web and Status=Connected. The Supermetrics entry was truncated
and is retained as incomplete rather than assigned an unverified status.
Author: Risto Anton Päärni (Founder, CEO, Lifetime Oy)
Owner: Lifetime Oy
Status: ACTIVE
Source: HIC-provided connector inventory, 2026-08-13
Purpose: Preserve the current connected-integration surface for operational awareness,
access review, and future connector drift checks.
-->

# Connected Web Connector Inventory — 2026-08-13

## Source and scope

This note records the connector list supplied by the HIC on 13 August 2026. The source listed each connector's type and connection status. No permission scopes, account identities, token expiry dates, or data-flow permissions were supplied; those remain unverified.

## Inventory

| Connector | Type | Status |
|---|---|---|
| AWS Marketplace | Web | Connected |
| Bitly | Web | Connected |
| Cloudflare Developer Platform | Web | Connected |
| Figma | Web | Connected |
| Gamma | Web | Connected |
| GitHub Integration | Web | Connected |
| Gmail | Web | Connected |
| GoDaddy | Web | Connected |
| Google Calendar | Web | Connected |
| Google Drive | Web | Connected |
| Hugging Face | Web | Connected |
| Postman | Web | Connected |
| Stripe | Web | Connected |
| Supabase | Web | Connected |
| Supermetrics Marketing Analytics | Web | **Incomplete source** — the supplied entry ended after the connector name; status was not provided. |

## Interpretation

The supplied inventory establishes connection presence, not authorization scope. A `Connected` status means the connector was reported as connected by the HIC; it does not independently verify least-privilege scopes, active credentials, billing authority, write access, or recent successful use.

The Supermetrics row is intentionally not classified as connected or disconnected. The source text ended with `S` after the connector name, so assigning a status would create an unsupported fact.

## HIC Learning Outcome record

| Step | State |
|---|---|
| 1. Knowledge base | N/A — this note is the source-of-truth inventory; no separate KB record was requested or created. |
| 2. Field note | Complete — this document. |
| 3. Learn HTML | N/A — no rendered export was requested; this internal inventory remains repository-first. |
| 4. Drive export | N/A — no export was requested; the repository note remains the source of truth. |
| 5. HIC decision question | Open — confirm the missing Supermetrics status and whether a permissions/scope audit is required. |
| 6. Calendar commitments | N/A — the supplied inventory contains no dates, deadlines, expiries, or follow-up dates. |

## Next verification

For a complete connector audit, capture for each integration: owning account, granted scopes, read/write capability, token or authorization expiry, last successful use, data residency, and revocation path.
