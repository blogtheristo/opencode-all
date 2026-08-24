# Field Note — Recommendations: Overlap Clusters, Dust List, External Repo Strategy

Date: 2026-08-20

## 1. Recommendation — the 3 "overlap" clusters from the usage audit

Re-read the actual content (not just mention counts) of each pair. Verdict changed on inspection:

- **cron 4-way** (`cron`, `cron-command`, `cron-pack`, `cron-scheduler-pack`) — **not overlap.** `cron`/`cron-pack` manage/audit _all_ scheduled work across DGX+GHA. `cron-scheduler` is narrower and different: registers individual scripts into `scripts/daily|weekly|hourly|on-deploy` per the Script Automation Rule, and is explicitly called _from_ `maintain`'s SKILL.md ("Register it in `scripts/weekly/` via `cron-scheduler`"). It's a real cross-dependency, not a duplicate — the "0 mentions" that flagged it earlier was a name-matching artifact, not evidence of disuse.
  **Recommendation: no consolidation.** Optional: rename `cron-scheduler` to something less easily confused with `cron` (e.g. `script-register`), or cross-link the two SKILL.md files so the split is obvious on read. Not urgent.

- **compliance-check (slash) vs compliance (pack)** — **intentional dual-transport pair**, same pattern as every other command+pack split in the manifest (thin CLI wrapper + full domain skill). The mention-count gap (62 vs 2) reflects informal chat phrasing ("/compliance") outrunning the literal command name, not redundancy.
  **Recommendation: no action.**

- **sovereignty-assess vs sovereignty-pillars-assess** — **not overlap, explicit extension.** `sovereignty-pillars-assess`'s own SKILL.md states it "Extends `/sovereignty-assess` from database-only to enterprise-architecture scope." Different scope by design.
  **Recommendation: no action.**

**Bottom line: none of the 3 flagged clusters need consolidation.** The mention-count proxy from the usage audit produced false positives here — a useful data point on the method's own limit, consistent with the caveat already recorded in that audit.

## 2. Recommendation — the 24 "likely-dust" skills

Given (a) no real usage telemetry exists, (b) the mention-count proxy just produced 3 false positives on the overlap question above, and (c) Non-Negotiable Rule 6 (no destructive file action without explicit HIC intent) — **do not delete or archive any of the 24 based on this evidence alone.** The method has now been shown unreliable enough on a related question that acting on it here would be premature.

**Recommended action instead:** instrument real usage before deciding.

1. Add a one-line append to a `logs/skill-usage.log` (or similar) on invocation — this is exactly the kind of deterministic, low-judgment logging the "model only for judgment calls" rule (Engineering Discipline #5) says code should handle, not agent judgment.
2. Revisit the 24-item list in ~90 days with real counts.
3. Only then, for genuinely zero-count entries, archive to `_<name>_OLD` (never hard-delete) per the repo's existing convention (`firehorse-report-annual_DEPRECATED`).

This is deliberately conservative: the cost of keeping an unused skill a while longer is a few hundred prompt-budget tokens (skill-cleaner showed the _total_ budget impact is real but currently manageable at 93.4%, and each individual entry is small); the cost of deleting something in real quarterly/occasional use because it never got written into a field note is a lost capability discovered only when someone needs it.

## 3. External repository strategy — Aspire, gstack/gbrain, sageroute, DGX sync

### What's actually in place today (researched this session)

- **Aspire** (a runtime dependency, not vendored source): pinned by image tag in `infrastructure/dgx-spark/docker-compose.yml`, never `:latest`. Upgrades are manual, field-note-driven: research the release, build a per-breaking-change applicability table against what DWS actually runs (dashboard-only, no AppHost), bump only the tag, log provenance. No automation — and that's appropriate for a runtime dependency.
- **gbrain**: `Admin/ADMIN_MANUAL.md:130-137` documents `git clone blogtheristo/gbrain` + `git remote add upstream garrytan/gbrain` — but stops there. No `git pull upstream`/rebase step, no `/sync-gbrain` script or skill anywhere in this repo. **The remote is configured but nothing uses it.**
- **gstack**: no equivalent fork/remote setup found at all — the 6 commands we carry were a one-time copy-paste-and-adapt, same as gbrain skills.
- **sageroute**: the one genuinely rigorous example — full source-level security audit (`docs/field-notes/2026-08-03-agent-factory-sageroute-audit.md`): supply-chain check (deps, postinstall hooks), outbound-egress audit (found and rejected an unvetted third-party decision API), OAuth-impersonation risk check, explicit REJECT-deployment/ADAPT-core decision, MIT attribution on every adapted file. This is the template — but it exists as one instance, not a codified checklist.
- **CI**: Dependabot + several security-scan workflows exist and run generically. `dependency_review.yml.disabled` and `secret-scan-gitleaks.yml.disabled` are present but **turned off**. Nothing in CI is scoped specifically to code adapted in from an external repo — the sageroute rigor was manual, not automated.

### Recommended strategy going forward

**Two adoption modes, handled differently — don't conflate them:**

1. **Runtime dependencies** (Aspire and anything like it — pulled as a container image or package, not copied source): keep doing exactly what's already working. Pin the version, never `:latest`, upgrade only via a documented per-change audit against DWS's actual usage surface, log as a field note. No change needed here.

2. **Source adaptation** (gbrain, gstack, sageroute, autoresearch — code or prose copied and modified into this repo): formalize the sageroute process as the mandatory bar for _any_ future import, not a one-off:
   - Source-level audit before merge: license (MIT confirmed for all four so far), outbound network calls / telemetry, credential/OAuth handling, dependency footprint, maintainer/maturity risk.
   - Explicit REJECT/ADAPT/ADOPT-verbatim decision, recorded in a dated field note (the sageroute note is the template to copy).
   - `**Source pin:**` line (shipped this session) on every adapted file going forward — this is what turns a future "pull latest" into a _bounded diff review_ (old pinned version → new upstream version) instead of a full re-audit from scratch every time.

**On "how do we pull latest to DGX and update dws6" specifically — recommend NOT doing that flow at all, in that direction.** DGX should never `git pull` directly from `garrytan/*` or any third-party repo into a running path. The flow should be:

```
upstream repo (garrytan/gbrain, etc.)
   -> manual/PR-reviewed diff against our Source-pinned version   [security gate here]
   -> merged into blogtheristo/dws6 (this repo) on a feature branch, reviewed
   -> DGX picks it up the same way it picks up everything else: pull dws6, redeploy
```

This keeps DGX's role unchanged (it runs what's in `blogtheristo/dws6`, via the existing docker-compose/cron-runner deploy path) and keeps the security-sensitive step — reviewing third-party code before it enters the codebase — in a PR-reviewed location (GitHub, human-visible diff) rather than on the production host. It also matches the existing golden rule already in this repo (git push/PR is YELLOW-not-auto, RED zone requires explicit human action) rather than inventing a new trust tier for "things pulled onto DGX."

**Concrete gaps to close, in priority order:**

1. **Turn on the disabled scanners** (`dependency_review.yml`, `secret-scan-gitleaks.yml`) at minimum for PRs touching `skills/`, `.claude/commands/`, `.opencode/command/`, or any path with a `**Source pin:**` line — the one place in the repo where third-party-derived code specifically lands.
2. **Decide the gbrain `upstream` remote's purpose**: either use it (define an actual periodic diff-review process) or remove the dangling instruction from `Admin/ADMIN_MANUAL.md` so it doesn't imply automation that doesn't exist.
3. **Codify the sageroute checklist** as a short skill/template (e.g. `skills/external-adopt/SKILL.md`) once it's been run manually 2–3 more times — per the Skill Codification Rule, don't build it speculatively.
4. **Cadence**: quarterly check of `VERSION`/tag drift on the 3 pinned upstreams (gbrain, gstack, Aspire image), triggered by a calendar reminder, not by "someone happens to ask" — this is exactly the kind of dated commitment the Session Learning Outcome Rule (§4.1, step 6) says should go on the calendar, not just in a doc.

## Verdict

No skill needs deleting today; no overlap cluster needs consolidating today. The one real, actionable gap is process, not content: the sageroute-quality security review exists but isn't repeatable, the gbrain upstream remote is configured but dead, and disabled CI scanners aren't scoped to the one place (source-adapted skills) where third-party code actually enters this repo.
