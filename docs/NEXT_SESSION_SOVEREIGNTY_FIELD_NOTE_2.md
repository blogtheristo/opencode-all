# Next Session Prompt — Sovereignty Field Note #2 Follow-Up

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-opus-4-7) | Session: claude/sovereignty-field-note-2-R0Un5 | Date: 28.05.2026 | Changes: Initial next-session prompt capturing the CEO review verdict (RESHAPE) and the remaining punch list for the Sovereignty Field Note #2 work stream. Self-contained — a new Claude Code session can pick up directly from this file.

Document Status:

- Created: 28.05.2026
- Last Modified: 28.05.2026
- Publication Status: ACTIVE — copy-paste into a new Claude Code session to continue
- Document Type: Session Handoff / Punch List

***

## Use this file

1. Open a new Claude Code session on the `claude/sovereignty-field-note-2-R0Un5` branch (or a fresh branch from `main`).
2. Paste everything between `--- HANDOFF BEGIN ---` and `--- HANDOFF END ---` as the first user message.
3. The session has full context to continue. No discovery needed.

***

## --- HANDOFF BEGIN ---

You are continuing the Sovereignty Field Note #2 work stream. The previous session shipped two commits (`bc3532c` and `86fe066`) on branch `claude/sovereignty-field-note-2-R0Un5`. The CEO planning review (`/plan-review ROLE=ceo`) returned **RESHAPE** with a specific punch list. Your job is to execute the reshape.

### What is already done (do not redo)

- `docs/field-notes/2026-05-28-three-pillars-sovereignty-global.md` — bilingual source-of-truth field note.
- `onelifetime.world/posts/sovereignty-field-note-2-three-pillars.{html,fi.html}` + landing-pages mirrors.
- `scripts/inject-blog-nav.cjs` — both blog variants registered and injected.
- `docs/PHD_FIREHORSE_{EN,FI}.md` — §14.23 (eight subsections), §1.2 restructured with Sovereignty as item #1, §1.2.1 reordered, §1.6 supervisor letter refreshed, "mahdolliset patentit" framing, version 3.61.
- `docs/metropolia/master-thesis/{en,fi}/V3Thesis_{EN,FI}.md` — Oxford notes-bibliography (22 footnotes) + chapter index + version 3.61.
- `DWS_TRUTH_STANDARD.md` — Row 16 registering the three-pillar model.
- `DWS_STANDARDS_LIBRARY.md` §3.6 — cross-reference paragraph distinguishing pillars from vendor tiers.
- `docs/sales/2026-05-28-rightful-oy-partnership-proposal.md` — draft to Tatu Heiskanen, CEO Rightful Oy.
- `partners-outreach/Shufti/SHUFTI_PARTNERSHIP_APPROVAL_2026-05-28.md` — draft with four named approval asks.
- `prompts/gemini-sovereignty-showcase.md` — copy-paste Gemini prompt.
- `dws10.com/products/{aegis,dws-iq-006,dwsiq}.html` + landing-pages mirrors — pillar-coverage panel inserted (started in the prior session; verify all three are mirrored and complete).
- `docs/PRODUCT_TIERS.md` v1.3 — positioning statement updated to cross-reference the three-pillar model.

### Remaining punch list (in priority order — CEO RESHAPE verdict)

#### P1 — Build the `/sovereignty-pillars-assess` skill (highest leverage)

The model is published but not yet *operationalized*. Today a buyer reading the blog post cannot do anything different tomorrow. Build the skill that turns a customer architecture description into a scored `(SIB, CSB, EAB)` triple per `(EU, US, SG)` jurisdiction.

**Reference:** existing `/sovereignty-assess` skill at `.claude/commands/sovereignty-assess.md` (scores PostgreSQL on 8 dimensions, 4 tiers). The new skill extends the same shape but for *enterprise architecture*, not just databases.

**Skill file:** `.claude/commands/sovereignty-pillars-assess.md`

**Input contract (parameterised):**

```
ARCHITECTURE — JSON or natural-language description of the customer's stack:
  - data layer (database vendor, residency, encryption posture, key custody locus)
  - compute layer (cloud vendor, residency, on-prem fraction, GPU substrate)
  - identity layer (IDV provider, IdP, MFA posture)
  - PQC posture (algorithms in use, migration plan status, R-Sac² stage if applicable)

JURISDICTION — primary jurisdiction (EU | US | SG); optional `markets` array for secondary.

CUSTOMER_ORIGIN — EU | US | SG (sets emphasis profile per Sovereignty Field Note #2).
```

**Output contract:**

```
{
  "scores": {
    "EU": { "SIB": 0-100, "CSB": 0-100, "EAB": 0-100 },
    "US": { ... },
    "SG": { ... }
  },
  "overall_tier_recommendation": "Aegis" | "Sovereign Infra" | "Connect",
  "next_step_attestation": "<one-line specific KYA track to unblock>",
  "quantum_readiness": "ready | roadmap | not-started",
  "rsac2_referral_recommended": boolean,
  "rationale": "<3–5 sentence summary>"
}
```

**DWS Standard application:** load `DWS_SECURITY_STANDARD.md`, `DWS_TRUTH_STANDARD.md` Row 16, `DWS_DEPLOYMENT_STANDARD.md` lines 165–172, `DWS_SOVEREIGNTY_STANDARD.md`. Register in `docs/DWS_SKILLS_GUIDE.md`. Expose via the `dws` CLI as `dws sovereignty-pillars-assess <input-file>` (per Agent Productization Rule in `CLAUDE.md`).

**Test plan:** three fixture customer architectures (one EU-origin Aegis-tier, one US-origin sovereign-cloud-engineering, one SG-origin neutrality play). Run the skill on each; assert the tier recommendation matches the human-judged correct answer.

#### P2 — "Sovereignty is segmentation" artefact sweep (user explicitly asked)

Eight files already surfaced by `grep`:

- `docs/PRODUCT_TIERS.md` — **done in prior session**
- `docs/field-notes/2026-04-25-cohere-aleph-alpha-sovereign-ai-merger.md`
- `docs/field-notes/2026-04-15-dws-iq-aegis-lwm-strategy.md`
- `docs/field-notes/2026-04-23-eu-ai-act-compliance-layer-research.md`
- `docs/field-notes/2026-04-23-sovereign-cloud-providers-aegis-partner-research.md`
- `onelifetime.world/posts/six-notes-to-the-commission.html` — public blog post; needs dual-folder mirror
- `onelifetime.world/posts/sovereignty-is-not-solitude-cohere-aleph-alpha-themis.html` — public blog post; needs dual-folder mirror
- `dws10.com/partners/index.html` + landing-pages mirror
- `dws10.com/products/themis.html` + landing-pages mirror

**Update pattern (surgical, 5–10 lines per file):**

Where the file says "Aegis / Sovereign Infra / Connect" or "three tier" in a sovereignty context, append a sentence:

> *"This three-tier product segmentation is the EU-origin enterprise's operational expression of the universal three-pillar (Data / Technology / Operational) × three-jurisdiction (EU / US / Singapore) sovereignty model. See Sovereignty Field Note #2 (`https://onelifetime.world/posts/sovereignty-field-note-2-three-pillars.html`) for the taxonomy."*

Field notes do not need dual-folder mirroring; blog posts and `dws10.com` pages do (CLAUDE.md non-negotiable #5 + dual-folder rule).

#### P3 — Send the partnership letters (user action; agent prepares dispatch)

The Rightful and Shufti drafts are inventory in the repo. Two follow-ups for the agent:

1. **Convert both `.md` drafts to a dispatch-ready format**: produce HTML email versions in `Learn/` (per the Downloadable HTML Rule, Base64 inline images) and clean plaintext fallbacks. Email transport is Amazon SES per CLAUDE.md non-negotiable #4. Do **not** send automatically; produce the artefacts, surface the URLs, ask user to dispatch.
2. **Track recipients in `docs/sales/contact-details.md`** (already exists) with date sent, channel, and follow-up date.

#### P4 — Companion script `scripts/bundle-whitepapers-for-llm.cjs`

A small Node script that concatenates the whitepaper inventory (paths in `prompts/gemini-sovereignty-showcase.md` §"Canonical sources") into a single Markdown bundle suitable for upload to LLMs with large context windows (Gemini 2.0 Pro: 2M tokens; Claude Opus 4.7: 200k+).

**Behaviour:** read the paths from a YAML manifest at the top of the script; concatenate with H1 separators (`# === <filename> ===`); write to `out/whitepaper-bundle-YYYY-MM-DD.md`. Token count check (warn if > 1M characters).

#### P5 — `Learn/` HTML regeneration of theses (Pandoc build)

The four thesis files are at v3.61 but the `Learn/` HTML outputs are still at v3.60. Run `pandoc` against each `.md` to regenerate. Reference the existing build incantation in the repo (search for `pandoc` in `scripts/` or the V3Thesis VERSION block notes).

### Constraints / non-negotiables (carry over from prior session)

- `CLAUDE.md` Standards Resolver fires multiple triggers; load all matched standards.
- Dual-folder mirror rule: `dws10.com/` and `onelifetime.world/` changes must sync to `landing-pages/<site>/` in the same commit.
- VERSION block delimiter is `***` not `---` (Pandoc rule).
- Email transport is Amazon SES, never Resend.
- No PR creation unless the user explicitly asks.
- Branch: `claude/sovereignty-field-note-2-R0Un5` (or a fresh branch from `main` if the user prefers).
- Push pattern: `git push -u origin <branch>` with up to 4 exponential-backoff retries on network failure.

### How to verify when done

1. `grep -ril 'sovereignty-pillars-assess' .claude/commands/ docs/DWS_SKILLS_GUIDE.md` returns the new skill and its registry entry.
2. Three fixture architectures produce the expected tier recommendations.
3. `grep -ril 'three-pillar' onelifetime.world/posts/six-notes-to-the-commission.html dws10.com/partners/index.html dws10.com/products/themis.html` returns at least one hit per file.
4. `diff -r dws10.com/products landing-pages/dws10-com/products` and `diff -r onelifetime.world/posts landing-pages/onelifetime-world/posts` both return empty.
5. `Learn/` HTML files for the four theses show version `3.61` in their generated metadata.

### Start prompt for the new session

When you are ready, say:

*"Continuing Sovereignty Field Note #2 reshape — P1 first: build `.claude/commands/sovereignty-pillars-assess.md` against the input/output contract above. Use the `/sovereignty-assess` skill at `.claude/commands/sovereignty-assess.md` as the structural reference. Register in `docs/DWS_SKILLS_GUIDE.md` and add the `dws sovereignty-pillars-assess` CLI command (Agent Productization Rule). After P1 ships, run the three fixture tests, then move to P2."*

## --- HANDOFF END ---

***

## Notes for the user (not part of the handoff)

- The handoff is self-contained — no need to re-explain context.
- If the new session starts on a fresh branch (not `claude/sovereignty-field-note-2-R0Un5`), it should still find all the canonical files because they are merged to the branch and the next agent can checkout the branch first or rebase from it.
- The CEO review verdict (RESHAPE) is the *frame* — the agent should not re-publish the field note or re-edit the theses. Those are done.
- The P1 skill is the highest leverage. If only one item ships in the next session, ship P1.
