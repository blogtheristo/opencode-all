# Cerebral Valley "Built with 4.7" Hackathon — Application Sent

**Date:** 2026-04-19
**Owner:** risto.paarni@lifetime.fi
**Branch:** claude/add-aegis-demo-page-QhDCV
**Status:** Application submitted, **not invited** — published the demo
publicly anyway as a standing Aegis case study (no event tie-in)

## Event

- **Name:** Built with 4.7 Hackathon
- **Host:** Cerebral Valley (San Francisco AI community)
- **Application URL:** https://cerebralvalley.ai/e/built-with-4-7-hackathon/apply
- **Model focus:** Claude Opus 4.7 (Anthropic's flagship model, released early 2026)
- **Format:** Curated/selective hackathon (acceptance-based)
- **Dates / venue / prize pool:** Not yet captured — application page is auth-gated, returned 403 to WebFetch. Confirm from the acceptance email when it arrives.

## What we applied with

**Demo:** `dws cbam-scan --company "Nordic Construction Oy"`

One command, one CBAM compliance report, zero dashboards. Live agent
chain executing in real time:

- Visma ERP connector pulls invoice lines + material codes
- 18 agents process in parallel (Firecracker MicroVM fan-out)
- KYA Engine logs every decision with EU AI Act Article 12 reasoning lineage
- Output: structured CBAM tariff exposure report, SHA-256 + Ed25519 signed,
  regulatory-submission-ready
- Total runtime: under 90 seconds

**Part two:** the same scan invoked from inside a Claude Code session via
`/compliance-check` skill + `mcp__dws__cbam_scan` MCP tool — proving the
compliance infrastructure is part of the dev workflow, not a separate
SaaS tool.

**Punchline for judges (verbal only, not on public page):** This is not a
prototype. The same stack runs in production today. Customer names available
under NDA only &mdash; do NOT print customer counts, logos, or names on any
public page. (Correction applied 2026-04-19 after the public landing page
leaked "6 paying customers incl. KELA and Uber Finland" in an earlier commit.
Removed.)

## Why Aegis fits "Built with 4.7"

1. **Claude Opus 4.7 as the reasoning brain** — every agent in the fan-out
   uses Claude as its decision layer. Article12Logger captures the full
   reasoning lineage per call.
2. **Claude Code as the dev surface** — the same `dws` CLI is exposed as
   MCP tools and Claude Code skills (`.claude/commands/*.md`), so the hackathon
   demo and the production workflow are the same code path.
3. **Sovereign + court-defensible** — Firecracker MicroVM isolation + KYA
   identity attestation is the kind of governance Anthropic's enterprise
   customers are starting to ask for.

## Public landing page

Live (after merge + deploy): https://dws10.com/aegis/hackathlon.html

Contains: hero, terminal-style live demo walkthrough, four-step "under
the hood" grid, Claude Code session terminal, production-proof punchline
with KELA + Uber Finland tags, CTA.

## Outcome

Not invited to the in-person event. No accept/reject email worth quoting
publicly. We decided to publish the demo as a standing Aegis case study
(`/aegis/hackathlon.html`) rather than waste the work. Tone of the public
page: "applied, not invited, shipped anyway" — honest, no whining at the
host, no implication that we attended.

## Open questions / next steps

- ~~Capture event date, venue, prize, judging criteria once acceptance email lands~~ &mdash; n/a, not invited
- Consider future curated AI events where Aegis fits (EU AI Act-focused
  venues likely a better audience match than SF general AI hackathons)
- Pre-record the demo as a video asset anyway — useful for the Aegis page
  and for sales calls regardless of any event
- Customer-name disclosure: **default is NDA-only** on any public surface.
  If ever approved for a specific venue (e.g. a private pitch deck),
  that approval must be captured here before it's used — and must not
  be copied to public HTML.
- Update this field note when accepted/rejected; if accepted, add a follow-up
  field note covering on-site execution

## Related

- `dws10.com/aegis/hackathlon.html` — public demo landing page
- `landing-pages/dws10-com/aegis/hackathlon.html` — Cloudflare-deployed mirror
- `dws10.com/aegis/index.html` — Aegis marketing page
- `dws10.com/products/aegis.html` — full technical specs
- `docs/field-notes/2026-02-06-brockman-agentic-software-development.md` — context on agent hackathons as adoption pattern
