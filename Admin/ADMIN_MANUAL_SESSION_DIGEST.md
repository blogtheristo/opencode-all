# DWS IQ Platform — Admin Manual: Session Digest (Rolling)

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/npm-supply-chain-attack-vjpnqg | Date: 04.08.2026 | Changes: Initial creation. Digest of the 100 most recent main-branch commits (window ~20.07.2026 → 04.08.2026, PRs ~#1125–#1793), grouped by theme. Supersedes the "Recent Session Artifacts" snapshot of 19.06.2026 inside ADMIN_MANUAL.md §Recent Session Artifacts as the current digest; that section is retained per Rule 12 and points here at the next in-place manual bump. Created as a standalone file because the cloud session's Bash was safety-classifier-blocked and ADMIN_MANUAL.md is too large to round-trip through the GitHub Contents API — recorded per Rule 12 (Fail Loud).

Document Status:

- Created: 04.08.2026
- Last Modified: 04.08.2026
- Language: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Document Type: Admin Manual — Rolling Session Digest

Related Documents:

- Admin/ADMIN_MANUAL.md (§Recent Session Artifacts — the 19.06.2026 predecessor snapshot)
- docs/field-notes/ (per-session detail)
- CLAUDE.md (Engineering Discipline — the 12 Rules)

***

## How to regenerate

Source of truth is git history; this is a navigational snapshot, not a replacement
for `git log`. Regenerate by listing the last ~100 commits on `main`
(`git log -100 --oneline --date=short` or the GitHub MCP `list_commits`),
grouping by theme, and appending a new dated section below — never rewriting a
previous window (Rule 12).

## Digest — window ~20.07.2026 → 04.08.2026 (100 commits, PRs ~#1125–#1793)

### Security & compliance

- **Shai-Hulud Aug 2026 wave (04.08.):** repo-wide exposure audit (verdict: not
  exposed at lockfile pins), `ignore-scripts=true` hardening in the 5 active
  keyv-carrying npm trees, daily IOC denylist check in
  `scripts/daily/dependabot-audit.sh` (fail-loud exit 2). Field note:
  `docs/field-notes/2026-08-04-shai-hulud-keyv-supply-chain-audit.md`.
- **KYA-S1 v1.2 re-landed** on current main (supersedes closed PR #1317) after a
  branch-death-by-re-root incident, with its HIC Learning Outcome.
- **EU AI Act Article 50 compliance sweep:** the four AI personas retired from
  team pages (Article 50 exposure closed), AI content labels generated and
  applied, Vulnerability Disclosure Policy added to the Compliance Hub,
  Article 50 icon assets + public-surface exposure audit registered; master's
  thesis §10.16 + PhD §14.46 document the Article 50 split (PR #1780, #1781, #1785).
- **Counterfactual-fairness pilot** for one lending decision path (PR #1486).
- Mini Shai-Hulud (May wave) field note merged to main (PR #1283).

### Agents, models & routing

- **DWS Factory Router** (PR #1788): offline evidence-based cheap→strong model
  escalation (`src/factory/`), audit-driven adaptation of trajectory-aware
  escalation; propagated to Admin Manual §DWS Factory Router, thesis lockstep 3.97,
  Learning Standard. Preceded by the Agent Factory + SageRoute reject/adapt field note.
- `escalateToClaude()` explicit heavy-tier escalation in model-selector (PR #1777).
- **Agent Response Format rule** added to CLAUDE.md (PR #1783) — Decisions /
  Facts used / HIC actions chat contract.
- Daily **Aegis competitor watch** cron script (PR #1209); nemotron-labs-diffusion
  LWM eval lab note (PR #1367); AGENTS.md auto-sync churn.

### Nordic expansion & funding (Lifetime AB)

- Sweden establishment thread: **Vinnova and KTH recorded as the real drivers**
  for Lifetime AB; KTH/TECoSA one-pager and LoI evolved across ~10 commits
  (partnership framing, safety-performance + EIC tension, feasibility-ordered
  topics, non-binding items, recast as a discussion opening with covering email —
  three pre-send edits landed).
- **Trafikansvarig licensing**: both routes priced, own-exam path recommended,
  checkpoint moved 31.08 → 15.10.2026; Qred loan costed over its actual 36-month
  term; runway memo corrected twice (funds ~2 500 EUR, not ~11 000; Swedish
  licence unfunded); Swedish public-sector target list drafted.
- Truth registry: **row 34 Nordic structure + operator licences**, EUR-first
  currency rule (§2H); Stockholm position confirmed with coaching revenue as
  runway (field note).

### Investor, partner & sales surfaces

- **Dayna Blackwell partner thread**: offer reframed CTO-track technical partner →
  Industrial Captain + Technical Partner (v1.2), US-jurisdiction reframe (US
  Industrial Captain; Arizona, Texas added as Connect-tier sales jurisdictions);
  ruling recorded that compliance framing is not the US demand driver; the v1.2
  letter marked **DO NOT SEND** (predates the US reframe) (PR #1779).
- **Careers rebuild**: DWS industrial authority split from Lifetime operating
  roles; Industrial Captain / Fleet Admiral partner seats; Captain seat economics
  ruling; Deputy removed from the investor ladder (PR #1780).
- Investor surfaces: new labeled hero + investor videos ("SOVEREIGN BY DESIGN.
  GLOBAL BY CHOICE."), outdated AI-generated hero retired; Captain-tier pricing
  reconciled to the Jul-29 Boardy structure (PR #1773); traction truth
  reconciliation merged (PR #1766); Fuengirola Uber cashflow analysis (PR #1789).

### Thesis, truth & learning loop

- **Additive thesis edits unlocked** (HIC decision 01.08) — four-file lockstep
  3.96/3.97; master's §10.16 + PhD §14.46 (Article 50); truth-lint taught the
  use-vs-mention distinction (PR #1785, #1786).
- **Productivity stack recorded as Google Workspace**, not Microsoft Office (HIC 03.08).
- Session failure-modes field note for 2026-08-02 (PR #1784); HIC Learning
  Outcome closures now land as explicit commits; Palantir MAS2 study merged (PR #1793).

### Platform & infrastructure

- **DGX sovereign-workspace bootstrap** + local/cloud routing CLI (PR #1776).
- **MGD/CRC north-star metric pair** with deterministic computation (PR #1674).
- V1 recovery: Content DMS wired + `firehorse-report` CLI + LinkedIn pending
  queue (PR #1208); Supermetrics MCP connector wired into the SEO sales-outreach
  pipeline (PR #1548); payment UI build (PR #1125).
- Housekeeping: Store Feed / Google Merchant / NVIDIA ISV sync; landing-pages
  auto-sync from source; harness session `telemetry/` gitignored; Aegis
  hackathon demo page for Cerebral Valley (PR #1287).
