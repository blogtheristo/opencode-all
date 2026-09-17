<!--
VERSION AND AGENT HISTORY
Document: Raw signal — AI Pact Secretariat: Article 50 enforcement starts 2 Aug 2026
Version: 1.0
Date: 2026-07-31
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active (raw source — not compiled)
Agent: Claude Code, session claude/ai-pact-enforcement-transparency-gnnipk
Purpose: Raw capture of the AI Pact Secretariat's partner outreach note for later /kb compile.
         Compiled reading: docs/field-notes/2026-07-31-article-50-transparency-marking-audit.md
         Public artifact shipped this session: dws10.com/compliance/vulnerability-disclosure-policy/
-->

# Raw Signal — AI Pact Secretariat Enforcement Note (31.07.2026)

**Kind:** Regulatory signal (European Commission, first-party)
**Captured:** 2026-07-31, forwarded by the HIC as a partner outreach note from the AI Pact Secretariat

## The trigger

Commission starts enforcing AI Act rules and Article 50 transparency requirements from **2 August 2026**
(the day after this note arrived). Key facts as published:

- ~190 organisations signed the Code of Practice on Transparency of AI-generated Content ahead of the
  legal obligations entering into application.
- New enforcement tooling live: AI Act Complaints Tool, AI Act Whistleblower Tool, GPAI downstream-provider
  complaints channel.
- Penalties: up to €15M or 3% global turnover (companies); up to €750k (EU institutions/bodies/agencies);
  proportionality applies for SMEs/SMCs.
- Grace period for the marking obligation until **December 2026** for generative AI systems placed on the
  market before 2 Aug 2026 (Article 50(2), amended by the AI Omnibus).
- Deepfakes generated before 2 Aug 2026: no mandatory retroactive labelling, but encouraged.
- Three EU icons exist for optional labelling: General AI Involvement, Generated, Modified — 4 colour
  variants each (black, white, black-50%-transparent, white-50%-transparent). Icon use is optional; the
  Article 50 disclosure duty itself is mandatory regardless of icon use.

## What this triggered in the repo this session

1. Full audit of dws6.com / dws10.com / onelifetime.world for AI-generated content requiring marking —
   findings in the field note above (§3, §4). Highest-risk item found: an unlabelled, photorealistic
   AI-generated hero video on dws10.com (no grace period available for deepfake-category content).
2. Confirmed `Legal/AI LABELS_3x2_*` icon files already added to `main` by the HIC (commits `260de12`,
   `b4605a3`) before this session's audit ran.
3. Shipped `dws10.com/compliance/vulnerability-disclosure-policy/` (+ landing-pages mirror) — unrelated to
   Article 50 directly, but same session, same Compliance Hub, same "public-facing compliance surface"
   thread the HIC was working.
4. No labels have been applied to any live page/image/video yet — HIC decision pending (see field note §7).

## Compiled reading

See `docs/field-notes/2026-07-31-article-50-transparency-marking-audit.md` for the full audit, HIC
questions, and calendar entries created. See `DWS_TRUTH_STANDARD.md` §2G for the pre-existing Article 50 /
EU icons canonical entry (unchanged this session, cross-checked for duplication before writing this note).
