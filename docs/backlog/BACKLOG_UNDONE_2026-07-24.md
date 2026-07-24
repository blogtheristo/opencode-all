# Backlog — Undone Things Across Sessions

_Compiled 24.07.2026 · Session `claude/dws-learning-hic-process-e70k0a` · Tool: Claude Code (claude-opus-4-8)_

## What this is

A cross-session sweep of committed-but-undone follow-ups, deferred work, and human-only (RED-zone) actions found in the per-branch handoff files (`.claude/handoffs/claude/*.md`, 27 files) and the cross-branch `HANDOFF.md` history log. This is a **read + report** artifact — nothing here is acted on by this session. Each item cites its source handoff so a HIC can open the full context.

Priority key: **P0** = correctness/production risk or a signed/legal action; **P1** = hygiene that blocks trust in prior work; **P2** = deferred build items; **P3** = nice-to-have / lower risk.

---

## A. RED-zone — human-only actions (a HIC must do these; agents cannot)

| # | Item | Source handoff | Prio |
| - | ---- | -------------- | ---- |
| A1 | **Apply KYA migration 074** (`kya_mandate_events`, append-only hash-chained evidence chain). Authored, never live-verified — sandbox had no Postgres/Docker/ssh. Verify then apply. | `kya-mandate-evidence-migration-mq7hnp`, `sessions-without-prs-dc9d06` (P2) | P0 |
| A2 | **Apply KYA migration 079** (`kya_verified_done_attestations` + `mandate.attest`, extends live 074). tsc/prettier/vitest green in-session; apply is RED-zone. Note 075–078 already exist. | `HANDOFF.md` 2026-07-22 entry | P0 |
| A3 | **Confirm attestation signing (v2.0)** — 074/079 mint credentials with `proofStatus:'unsigned'`; real signing was deferred to v2.0. Decide when v2.0 signing lands. | `kya-mandate-evidence-migration-mq7hnp` | P2 |
| A4 | **Send the LUT six-question Smolander letter** — `docs/lut/2026-07-14-letter-smolander-six-questions.md`, staged send-ready, RED-zone (founder sends). Then confirm it landed in the LUT doctoral thread. | `lut-phd-research-options-p7jskn` | P1 |
| A5 | **Send the Törngren email** — `docs/gtm/2026-07-14-email-torngren-send-ready.md`, send-ready, Broman CC'd, RED-zone. | `lut-phd-research-options-p7jskn` | P1 |
| A6 | **Send the Sarkain Oy Finnish reply** — drafted, NOT sent (outbound = RED-zone). Blocked on Sarkain confirming an email address before NDA/DPA. | `sarkain-oy-vendor-gddyf0` | P2 |
| A7 | **Return the signed Aiven NDA to Leevi Lindfors** + the Aiven partner track (platform DPA for signature, partner-org intro, UpCloud region answer, Wärtsilä public link). DocuSign needs local `.env` keys. | `aiven-dpa-contract-12iukg`, `aiven-partnership-intro-vm1fgk` | P2 |
| A8 | **IP assignment signature** — flagged as the #1 board blocker (unsigned IP assignment) alongside Gate-1 equity cure / Gate-2 items. | `revenue-investor-strategy-53q9b9` | P0 |

## B. Engineering verification & hygiene (agent-doable, needs a real toolchain)

| # | Item | Source handoff | Prio |
| - | ---- | -------------- | ---- |
| B1 | **Machine-verify the 67-branch TS merges** — `npm install && npx tsc --noEmit && npm test` on `main`. Riskiest: `src/agents/tools.ts` (hand-merged `query_database`/`fetch_external` + `authorizeToolCall` gate + `send_notification`), `src/agents/index.ts` (50+ agent registrations from ~15 branches), `src/mcp/security/tool-colors.ts`. Never had a real `tsc`/`npm test` pass (no node_modules in that sandbox). | `sessions-without-prs-dc9d06` (P0) | P0 |
| B2 | **Confirm the KYA-verdict-in-traces wiring** — `d235f6ee` ("span-stamped KYA authorization verdict", #1642) should close the loop from "`authorizeToolCall` gate exists" to "verdict observed in traces". Verify it wires into `executeTool()`'s dispatch path in `tools.ts`, not just a span helper. | `sessions-without-prs-dc9d06` (P0) | P0 |
| B3 | **Fix the broken `cli/` build** — `cli/ npm run build` (tsc) broken pre-existing (`dws kb` / `dws eu-data`). | `european-datasets-lab-note-8mlg9u` | P1 |
| B4 | **Close the CI type-check gap** — only `test-on-pr.yml` runs `tsc`, scoped to root `src/**`. No CI `tsc` gate on `cli/`, `mcp-hub-ts/`, `cloud-run-gateway-ts/`, `src/cloudflare/`, or either dashboard (5+ packages). | `typescript-7-repo-impact-u4ec7m` | P1 |
| B5 | **skills/manifest drift check** — run `node scripts/skill-manifest-sync.mjs --check`. `docs/DWS_SKILLS_GUIDE.md` counts/Quick-Reference were hand-edited across ~6 PR resolutions without the sync tool. | `sessions-without-prs-dc9d06` (P1) | P1 |
| B6 | **Decide the 13 orphaned gbrain skills** — real `SKILL.md` files (`signal-detector`, `brain-ops`, `ingest`, `query`, `enrich`, `maintain`, `citation-fixer`, `briefing`, `daily-task-manager`, `cron-scheduler`, `skill-creator`, `skillpack-check`, `soul-audit`) exist but are not in `skills/manifest.json` and were dropped from the guide/RESOLVER during conflict resolution. Register (Agent Productization Rule) or archive to `_OLD`. Currently in limbo. | `sessions-without-prs-dc9d06` (P1) | P1 |

## C. Knowledge / docs process

| # | Item | Source handoff | Prio |
| - | ---- | -------------- | ---- |
| C1 | **Regenerate `Learn/` thesis HTML** — PhD v3.77–v3.81 + master's V3Thesis lockstep bumps logged "Learn/ HTML regeneration required — needs Pandoc build". Do it in one pass. | `sessions-without-prs-dc9d06` (P1) | P1 |
| ~~C2~~ | ~~Build the session-stop learning-outcome hook~~ — **DONE 24.07.2026**: `.claude/hooks/session-stop.sh` Check 6 now blocks (block-don't-ask, loop-safe, escape-hatched) when a substantive session skips the field note + `Learn/` HTML. See `DWS_LEARNING_STANDARD.md` §6. | This session | ✅ |
| C3 | **`***` vs `---` VERSION-block delimiter mismatch** — the Prettier PostToolUse hook rewrites `***`→`---`, silently reverting the Document Standard delimiter rule on every Edit/Write. Needs a `.prettierignore` exception or hook fix; today the fix must be a final Bash/sed pass before commit. | `ngi-sargasso-gber-i2l47d`, `DWS_DOCUMENT_STANDARD.md` v2.11 entry | P2 |
| C4 | **Run `dws eu-data status` from an unrestricted machine** — verify live upstreams (PRH/FMI/EDP were network-policy-blocked). | `european-datasets-lab-note-8mlg9u` | P3 |

## D. Security

| # | Item | Source handoff | Prio |
| - | ---- | -------------- | ---- |
| D1 | **Dependabot: 425 vulnerabilities** flagged on every push (12 critical, 164 high, 183 moderate, 66 low) — untouched, visible on every merge. | `sessions-without-prs-dc9d06` (P3) | P1 |
| D2 | **Aegis deferred dependency upgrades** — bumblebee OTel deps re-verify (OTLP path); `starlette` advisories with no direct pin to bump; `mcp-hub/requirements.txt` FastAPI 0.115.12 compatibility. Deferred, not force-fixed. | `aegis-dependency-security-g9xcfo` | P2 |
| D3 | **Reconcile local-scan vs GitHub vuln gap** — near-zero local vs GitHub's flags; transitive resolution differs run to run. Needs a locked/pinned resolution to close. | `aegis-dependency-security-g9xcfo` | P2 |

## E. Lower-priority sweeps

| # | Item | Source handoff | Prio |
| - | ---- | -------------- | ---- |
| E1 | **Second pass on 247 "had-historical-PR" branches** — carry trailing commits (mostly `main` merge-backs, not individually verified). Lighter branch-hygiene sweep. See `docs/SESSIONS_WITHOUT_PRS_AUDIT_2026-07-06.md`. | `sessions-without-prs-dc9d06` (P3) | P3 |
| E2 | **Re-check open-PR list fresh** — prior `search_pull_requests` sweeps are stale; several PRs seen open have since merged. Re-list rather than trust any handoff's open/closed claim. | `sessions-without-prs-dc9d06` (P2) | P3 |

---

## F. Monday-gating triage (24.07.2026) — 15-min scan before the weekend

**Result: no catastrophic Monday-critical item is buried/undocumented.** The canonical Monday list — `docs/investor/boardy-2026-07-29/BOARDY_MONDAY_PRIORITIES_V3.md` (v3, actuals-anchored) — is comprehensive and covers the P0s: IP assignment (LUT free IPR review → sign), 3 board sheets, Finnvera repayment holiday + rantalainen.fi R&D-cap Phase 2 (Gate-1 equity cure), staggered INTRO sends, ORK tracking. One sharpening and two minor flags:

| # | Finding | Prio |
| - | ------- | ---- |
| F1 | **IP assignment is not sign-ready as-is** — `Legal/IP_ASSIGNMENT_FOUNDER_LIFETIME_OY_2026.md` is a **DRAFT template** (created session `claude/tutki-lifetime-sales-69g53v`, 11.06.2026, no handoff) with (a) blank founder henkilötunnus + address, and (b) an **undecided consideration clause** (line 106: `[☐ no cash / ☐ nominal €__ / ☐ other]`), plus "DRAFT — counsel review required." Monday's P0 "review → sign" is really **review → decide consideration (tax/valuation-sensitive, the reason for the LUT review) → fill fields → sign**. Board minutes (`Legal/BOARD_MINUTES_IP_ASSIGNMENT_2026.md`) exist alongside. Sharpens backlog A8. | **P0 (Mon)** |
| F2 | **Duplicate Monday-priorities location** — both `docs/investor/boardy-2026-07-29/…MONDAY_PRIORITIES_V3.md` and `docs/board/2026-07-29-boardy/monday-priorities.csv` exist. Confirm which is canonical before Monday to avoid working off a stale copy. | P2 |
| F3 | Gate-1 equity cure (Finnvera + rantalainen.fi R&D-cap Phase 2 €494k) and the board sheets are documented in the Boardy V3 pack — no missing artifact found; execution is human/RED-zone (founder + accountant + bank). | (tracked) |

**Scope note:** this was a 15-minute targeted scan for Monday-gating legal/IP/investor items, not the full multi-session learning backlog (deferred to Tuesday). It reads committed work products + the Boardy pack; it cannot see sessions whose only trace was an uncommitted transcript.

## Method & caveats

- **Sources:** the 27 per-branch handoff files under `.claude/handoffs/claude/` + the `HANDOFF.md` cross-branch history log. These are the git-committed working memory of prior ephemeral cloud sessions.
- **Not exhaustive:** a handoff only records what its author chose to write down; work with no handoff (or captured only in a merged PR body) is not visible here. Item E1's 247-branch sweep is the known blind spot.
- **Freshness:** several items may already be closed on `main` since their handoff was written (e.g. B2's `d235f6ee` looks like it closes an earlier follow-up). Verify current state before acting — do not trust an open/undone claim from a handoff without a fresh check.
- **This is a report, not an action log.** Per the DWS Learning Standard, the next step is the HIC deciding which of these to schedule — see the HIC question in this session's field note.

---

_© Lifetime Oy — all rights reserved. Business Confidential. Compiled 24.07.2026._
