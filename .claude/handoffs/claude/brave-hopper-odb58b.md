# Handoff — claude/brave-hopper-odb58b (2026-09-27)

HIC: "240 USD on Claude Code — finish pilot products first so we can deliver them."

## Done

- Verified checkout fails closed: `dws10.com/checkout/index.html` awaits durable intake before `safeRedirect`; `/v1/orders/notify` returns 503 on failure and is schema-gated. 22/22 order/checkout tests pass. No code change needed.
- Added `docs/runbooks/PILOT_KICKOFF_PACK.md` for DWS-AEGIS-PILOT-001 and AIS-OUTCOME-PILOT.

## Open (HIC)

1. Apply production migration 100 (RED zone).
2. Stripe vs Revolut/PayPal-only for pilots.
3. Approve the AIS-OUTCOME-PILOT `acceptanceKpi` correction (pack §5.1).
4. Queue the `queued → fulfilled` operator path (pack §5.2), needed within 6 weeks of the first pilot order.
