# Learning note — how DWS IQ delivers payable pilots: Claude Code leads, the DGX loop builds, 60 days

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/festive-cerf-87wf67 | Date: 28.09.2026 | Changes: HIC decision recorded: the payable pilot products are delivered by opencode-loop and opencode-all on the DGX, led by Claude Code, in 60 days, ready for deployment to cloud and to customer-owned infrastructure.

Document Status:

- Created: 28.09.2026
- Language: English
- Classification: INTERNAL
- Status: ACTIVE — HIC decision 28.09.2026

---

## 1. The decision

**HIC 28.09.2026:** "This is how we will deliver pilots. The opencode-all and opencode-loop led by
Claude Code will deliver the payable pilot products in 60 days, ready to deployments to cloud and
own infra devices."

- **Start:** Monday 28.09.2026. **Day 30:** Wednesday 28.10.2026. **Day 60:** Friday 27.11.2026.
- **Scope:** the five payable pilot SKUs of price list v1.33, in the order of
  `docs/plans/PILOT_PRODUCT_READINESS_PRIORITY.md` (at most three active at a time).

| Priority | SKU                   | Price (v1.33)               | Readiness 28.09 | Deployment targets                                         |
| -------- | --------------------- | --------------------------- | --------------- | ---------------------------------------------------------- |
| P0       | `DWS-AEGIS-PILOT-001` | €19,990 / 3 months          | 56%             | Customer-owned infrastructure (DGX / edge device, offline) |
| P0       | `AIS-OUTCOME-PILOT`   | €9,990 / 6 weeks            | 55%             | Cloud (EU)                                                 |
| P0       | `DWS-EU-PILOT`        | €1,499/month + €3,990 setup | 55%             | EU sovereign cloud                                         |
| P1       | `DWS-US-PILOT`        | €799/month + €2,490 setup   | 55%             | US cloud                                                   |
| P2       | `LF-ONTOLOGY-PILOT`   | €15,000–25,000 / site       | Not scored      | Last — active ontology still maturing                      |

## 2. What "ready to deploy" means on day 60

Measured on the G0–G10 gates of `docs/plans/PRODUCT_PRODUCTION_READINESS_PROGRAM.md`:

- **Gates G0–G9 pass** for each pilot in scope: lifecycle truth, buyer and outcome, commercial
  contract, working delivery, agent access, security and sovereignty, verification, operations,
  fulfilment, product surface.
- **G10 is split.** The _staging rehearsal_ part of G10 is done on both targets — a cloud tenant and
  a customer-owned device (DGX Spark / edge node) — with rollback and an evidence pack. _Customer
  acceptance sign-off_ needs a signed customer and happens in the pilot itself, after day 60.
- **Conflict to know about:** the priority plan (merged 28.09) estimates 8–10 weeks for G0–G9 on all
  five pilots and 14–18 weeks to deployment evidence. The 60-day target fits G0–G9 plus the staging
  rehearsal for the first four; it does not fit customer sign-off, and it does not fit
  `LF-ONTOLOGY-PILOT`, which the HIC placed last (maturation hold).

## 3. The delivery model — who does what

| Role       | Who                                                       | Does                                                                                                                                                                               | Never does                                  |
| ---------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Decides    | HIC                                                       | Priorities, pricing, what ships, blog/public text, merges of policy and blog PRs                                                                                                   | Code                                        |
| Leads      | Claude Code (paid)                                        | Breaks each gate into task specs with checks that fail today (`scripts/loop-task.mjs`), reviews loop PRs, fixes CI, watches and merges loop PRs hourly, RED-zone and security work | Multi-file coding the loop can do           |
| Builds     | `opencode-loop` on the DGX (local models, no paid tokens) | Works one spec at a time until `scripts/agent-done-gate.mjs --full` says DONE, then opens a PR                                                                                     | Merging; editing the public site; blog text |
| Catches up | `opencode-all`                                            | Clears the open-PR backlog after days of Claude/Copilot sessions (`--status`, `--prs`)                                                                                             | New feature work                            |
| Gatekeeper | `agent-done-gate` + CI                                    | "Done" is a command result: committed, pushed, formatted, typecheck, lint, tests, the task's own checks                                                                            | —                                           |

The loop of one gate: **spec (Claude Code) → loop builds (DGX) → gate DONE → PR → CI → review and
merge (Claude Code, hourly) → next spec.** The HIC sees merges, blocks and questions only.

## 4. What the first day taught us (28.09.2026)

- **It works at volume.** In the first day the loop delivered verification suites for four agents
  (schedule-genius, material-oracle, seo-audit, sitesense), a KYA audit-record feature and two
  planning/operations changes; #2209, #2211, #2216, #2219, #2221 and #2222 were merged. Tests written
  by the loop found three real bugs in `schedule-genius`.
- **"Done" is only as strong as the gate.** The first two loop PRs passed the gate and failed CI
  lint; the gate did not run ESLint. Lint was added the same day. Rule: the gate must be at least as
  strict as CI.
- **Checks cannot see scope.** One loop PR changed the base agent class outside its task and passed
  every check. Scope stays a Claude Code review item on every PR.
- **One bad merge blocks everything.** A PR merged with lint errors turned `main` red, and every open
  PR failed with it until the fix was ported. The hourly watch finds and fixes this; it must keep
  running for the 60 days.
- **Local models build; they do not advise.** The same afternoon a local Qwen session in the
  `opencode/estimate` worktree recommended "wait" on hunting the Aegis owner, misreading Boardy's
  pinned order (owners first; M2 needs the buyer's risk owner; M3 is that owner's decision). The
  advice was confident, well formatted and wrong, and nothing checks advice. Judgment — strategy,
  sales, priorities — stays with the HIC and the paid session (CLAUDE.md Coding Delegation Rule);
  the DGX loop gets work that a command can verify.
- **Specs must fail first.** A check that already passes proves nothing; `loop-task.mjs` refuses it.
- **The CI runner is on the DGX**, where a local LLM is reachable — tests that assume "no LLM" must
  pin it, or they pass locally and fail in CI.

## 5. How we keep the 60 days honest

- **One number per pilot, weekly:** gates passed out of G0–G10, from the readiness scorer — not a
  model's summary. Reported every Sunday HIC batch.
- **Every gate has a spec** in `.claude/done/<branch>.json` before the loop starts it.
- **Stop rule:** if the loop reports BLOCKED twice on the same spec, Claude Code codes it or the HIC
  reshapes the gate (CLAUDE.md Coding Delegation Rule).
- **Day 30 check (28.10.2026):** the three P0 pilots at G0–G6 (the plan's 4–6 week estimate). If not,
  the HIC decides whether to cut scope (e.g. `DWS-US-PILOT` moves after day 60) rather than slip the date.
- **Deployment rehearsal needs hardware:** the own-infrastructure target needs a DGX Spark or edge
  node reserved for staging from about day 45 (12.11.2026).

## 6. Session Learning Outcome

1. KB: N/A — internal operating decision; this note and the pilot plan carry it.
2. Field note: this file.
3. Learn HTML: rendered to `Learn/` with `scripts/render-doc.sh`.
4. Drive export: N/A — cloud session; the repository is the source of truth.
5. HIC decision question: does "ready to deploy" on day 60 mean G0–G9 plus the G10 staging rehearsal
   (this note), or do you expect customer-signed acceptance by 27.11.2026 (which needs signed pilot
   customers within about 4 weeks)?
6. Calendar: day 30 check 28.10.2026, hardware reservation 12.11.2026, day 60 27.11.2026.
