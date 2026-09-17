# Field Note — Five Controls That Reported Success While Doing Nothing

**Date:** 2026-09-09
**Branch:** `claude/truth-register-investor-seats` (PR #1986)
**Trigger:** HIC reported "Cloudflare workers are stalled". Nothing was stalled. Several things had never started.

---

## 1. The pattern

Every finding below is the same defect wearing different clothes: **a control that cannot fail, guarding something nobody checked.** Not one of them was detected by the thing it was supposed to protect. They were found by reading the code that implements them.

A green check that cannot go red is worse than no check, because it consumes the attention that would otherwise notice the gap.

## 2. The five

### 2.1 The Cloudflare cache purge never ran — not once

`sync-dws6-landing-pages.yml` read `secrets.CLOUDFLARE_ZONE_ID`. **That secret has never existed.** The repo's actual names are `CLOUDFLARE_ZONE_ID_DWS10` and `CLOUDFLARE_ZONE_ID_ONELIFETIME`. The reference resolved to empty, the guard fell to its `else`, and the step printed _"⚠️ Cloudflare secrets not configured (optional)"_ on every run since it was written.

A missing secret and a correctly-configured one were indistinguishable in the log, because the "not configured" branch was written as an acceptable outcome.

### 2.2 …and it could not have reported failure if it had

```bash
curl -X POST ".../purge_cache" ...   # no --fail, response never read
echo "✅ Cloudflare cache purged"     # unconditional
```

`curl` exits 0 on HTTP 403. So even with a valid zone ID, an expired token would have produced a green step and a success message. Both faults had to be fixed together: naming the right secret without checking the response would have swapped a silent no-op for a silent 403.

### 2.3 One zone for four sites

`CLOUDFLARE_ZONE_ID` was singular. Four domains publish from this repo. Even in the best case the step would have cache-busted one of them. Now reads every per-site zone secret and **warns by site name** for each one left uncovered, so the gap appears in the log instead of being inferred from silence.

### 2.4 `dws-workflows` had no deployment path

`cloudflare-workflows/wrangler.toml` declares **11 Workflow bindings** (outokumpu/ncc/kemira dev+prod, dws6-com/dws10-com/onelifetime-world dev+prod). The live account holds only `cari` and `dws-revolut-checkout`. No workflow in `.github/workflows/` deployed it; the toml documented a manual `wrangler deploy` command, and a manual command nobody runs is not a deployment path.

"Stalled" implies a stuck instance. There were no instances. Added `deploy-cloudflare-workflows.yml`, which also states in its job summary that a green deploy still leaves the worker **inert** until `WORKFLOW_API_TOKEN` and `GITHUB_WEBHOOK_SECRET` are set — because the endpoints fail closed (`src/index.ts:355`). Setting secrets is deliberately not automated: a workflow able to write them carries a wider blast radius than the thing it deploys.

### 2.5 The Tree Gate — the post-#1888 defence — has never guarded anything

```
poisoned-tree-gate: missing --config <file>
##[error]Process completed with exit code 2
```

Exit **2** is a usage error, raised before any check runs. `tree-gate.yml` passes seven flags but not `--config`, which the script requires. **This gate has failed on every PR since it was added**, including the deletion tripwire it exists to provide after the repo wipe.

**It is worse than failing silently: it posts reassurance.** Observed on PR #1986:

> ### Tree Gate Result:
> _No violations detected._

That line comes from `jq -r '.decision'` reading a result file the script never wrote. So the gate
built to prevent a repeat of the #1888 repo wipe has, on every PR since it was added, both failed
to run **and** told reviewers there were no violations. A reviewer skimming the thread sees a
green-sounding verdict from a control that has never executed once. This is the note's pattern in
its most damaging form — not an absent check, but an *affirmative false statement* produced by one.

**The one-line fix was written, tested, and reverted.** Three faults, not one:

| #   | Fault                                                          | Effect                                           |
| --- | -------------------------------------------------------------- | ------------------------------------------------ |
| 1   | no `--config`                                                  | exit 2                                           |
| 2   | no stdin (script reads pre-push ref lines)                     | with `--config` alone: returns `[]`, **exits 0** |
| 3   | emits an array; workflow's `jq` reads `.decision` on an object | always null                                      |

Fixing only #1 would have converted a loud failure into a green check guarding nothing — this note's own pattern, introduced while fixing it. Wired up correctly the gate returns a real verdict: `block — "P4 manifest: manifest schema invalid"`, because the workflow's `find` picks `./skills/manifest.json` while the config expects `.githooks/critical-files.manifest`. Repairing it may legitimately begin blocking every PR, so it needs its own reviewed change.

## 3. Two more of the same shape, not fixed here

- **`CLOUDFLARE_ACCOUNT_ID` exists but is empty.** It appears in the repository secret list, so it reads as configured while carrying nothing. Same class as 2.1.
- **The DoD Gate's skipped-test check is a false positive.** It flags `expect(result.skipped).toBe(1)` — assertions about a `skipped` _field_ — as `test.skip`. A gate that cries wolf trains people to merge past it.

## 4. What this cost, and what it did not

The honest accounting matters, because I overstated it twice before getting it right:

| Claim                                             | Verdict                                                          |
| ------------------------------------------------- | ---------------------------------------------------------------- |
| "five weeks of stale cache across all four sites" | **wrong** — token expiry was real but never what broke this step |
| "only one zone was ever purged"                   | **wrong**                                                        |
| **zero zones, ever**                              | correct                                                          |

Impact is bounded by the fact that three of the four sites are Cloudflare **Pages** (`docs/CLOUD_ENVIRONMENTS.md:100`), which invalidates on deploy; the zone purge is a belt-and-braces layer over that. Real, but narrower than first stated. The lesson is not the blast radius — it is that I asserted a blast radius three times before checking how the sites are served.

## 5. The rule worth keeping

**A configured name is not a configured value, and a success message that cannot fail is not evidence.** When adding a control, write the failing case first and prove it goes red. Every finding here would have been caught on day one by a single deliberate failure test.

## 6. HIC Learning Outcome

1. **KB** — N/A: operational defects, captured here and in the commits that fix them.
2. **Field note** — this file.
3. **`Learn/` HTML** — rendered alongside.
4. **Drive export** — N/A: repo is source-of-truth (`DWS_TRUTH_STANDARD` §2E); no external-audience content.
5. **Decision question** — the Tree Gate repair is unresolved and put to the HIC: it is a security gate that will likely start blocking PRs once working, so it needs a dedicated reviewed change rather than being folded into an unrelated PR.
6. **Calendar** — `CLOUDFLARE_API_TOKEN` was renewed 2026-09-09 with an expiry of **2026-07-01 → 2027-07-01**. That is a dated commitment: a renewal reminder belongs in the calendar ~2 weeks before, since an expired token is now loud but still an outage.
