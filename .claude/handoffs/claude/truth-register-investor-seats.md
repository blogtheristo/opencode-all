# Branch: claude/truth-register-investor-seats — PR #1986

## Task

Started as D1 of a nine-item decision dialog (supersede LD-2026-014). Grew to cover all nine
items plus a chain of Cloudflare/CI findings surfaced by the HIC's "Cloudflare workers are
stalled" report.

## State

Worktree clean, 9 commits ahead of `origin/main`, pushed. Two field notes + rendered `Learn/`
HTML committed.

## Shipped

**Investor seat structure (D1–D9, all nine ruled and applied)**

- **LD-2026-017** locked: Fleet Admiral €250,000 × 1 + Industry Captain €50,000 × 8 = **€650,000**
  SAFE at €3.8M cap. `dws10.com/investor-centre/` is canonical; `/captain/` and `/fleet-admiral/`
  stay redirects. LD-2026-014 marked SUPERSEDED but **kept intact** — PR #1778 applied it in good
  faith while LOCKED and its readers need the trail.
- **Registered in the truth standard** — `DWS_TRUTH_STANDARD.md` row 34 + structured mirror
  `config/truth/investor-seat-tiers.json`, with all three superseded structures as deprecated
  phrasings. Verified: €200K and "9 Captain seats" FAIL, "8 Captain seats" passes. §6 drift-log
  entry added. This is the fix that makes the rest stick — the number drifted four times in six
  months precisely because it lived only in a decision log.
- **Sweep: 32 seat-tier FAILs → 0** across 14 files. Live collateral corrected outright; dated
  and published docs (29-Jul Boardy pack, press release) corrected _with_ a dated correction note
  rather than silently.
- **D3 Deputy shelved, D4 triple bundle retired, D5 Captain = investment tier** — all registered,
  so they are machine-enforced rather than merely recorded.
- **D6 answered from the registry, no edit needed:** `industries.json` already registers
  "16 captain hats covering 25 EU-regulated industries" as APPROVED. Product taxonomy, not seat
  count. A WARN guard now stops the two being reconciled against each other — the conflation the
  previous three passes kept attempting.

**Cloudflare / CI — five controls that reported success while doing nothing**

Full write-up: `docs/field-notes/2026-09-09-controls-that-reported-success-while-doing-nothing.md`

- Cache purge **never ran** — read `secrets.CLOUDFLARE_ZONE_ID`, a name that has never existed.
  Now reads the real per-site names and warns by site for each uncovered zone.
- Purge **could not report failure** — no `--fail`, response never read, unconditional success
  echo. Now checks HTTP status + `success` field, prints Cloudflare's error body, exits non-zero.
- Purge covered **one zone for four sites**. Now loops all, continues past failures.
- `dws-workflows` (11 Workflow bindings) **had no deployment path**. Added
  `deploy-cloudflare-workflows.yml`.
- truth-lint CI red on this PR: fixed my own break (`Learn/` is the rendered mirror of
  `docs/field-notes/`; excluding the source but not the rendering defeats it at the render step)
  plus two genuine row-1 drifts.

## Open — needs HIC

1. **Tree Gate repair.** `tree-gate.yml` never passes `--config`, so the gate has failed on every
   PR and **never guarded anything** — including the deletion tripwire built after #1888. The
   one-line fix was written, tested and **reverted**: it is not sufficient (script also reads refs
   from stdin; emits an array where the workflow's `jq` reads an object) and alone would turn a
   loud failure into a green check guarding nothing. Wired correctly it returns
   `block — "P4 manifest: manifest schema invalid"` (workflow's `find` picks
   `./skills/manifest.json`; config expects `.githooks/critical-files.manifest`). Repair may
   legitimately block every PR → needs its own reviewed PR.
2. **DoD Gate false positive** — flags `expect(result.skipped).toBe(1)` as a skipped test.
3. **`CLOUDFLARE_ACCOUNT_ID` is empty** (exists in the secret list, carries nothing) → blocks the
   Workers deploy.
4. **`CLOUDFLARE_ZONE_ID_DWS6` / `_LIFETIMEFI` do not exist** → those two sites uncovered.
5. **`CLOUDFLARE_APII_TOKEN`** — typo duplicate, dead, worth deleting.
6. **GCP key rotation + two key-bearing refs.** `gcp-sa-key-new.json` has **no deletion commit
   anywhere**; absence from main is a side effect of the #1890 tree-restore, not a purge. Live in
   the trees of `archive/main-pre-rewrite-2026-07-31` and `claude/captain-admiral-pages-sync`.
   Repo NO-DELETE hook blocks removal → GitHub UI. HIC says the key is already old.
   **Do not delete the archive ref** until the DGX bundle is confirmed to hold the pre-incident
   ancestry — it is currently the only verified copy of 4,762 commits.
7. **`dws10.com/index.html`** still shows the shelved Deputy and retired triple bundle.

## Related PRs

- **#1986** (this branch) — LD-2026-017, row 34 registration, D2/D8 sweep, Cloudflare/CI fixes.
- **#1987** — store generator writes to source + `edge-node-gn100` €8,008. Red on Tree Gate and
  DoD Gate; neither is its fault, triage posted as a PR comment.
- **#1778** — closed as superseded.

## Corrections made this session (all mine)

Worth keeping because the pattern repeated: I stated conclusions more confidently than my checking
supported, three times on the same subject.

- "Main's history was rewritten" → no rewrite; it was the #1888 fixture wipe + #1890 tree-restore.
- "The secrets purge is intact" → there was no purge.
- Cache impact: "five weeks across all four sites" → "one zone" → **zero zones, ever**.
- "Dry-ran the rsync, 0 deletions" → `rsync` is not installed in this container; the command
  failed and `grep -c` counted zero lines. Conclusion held for a different reason.
