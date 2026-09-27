# Field Note — Environment Version Parity (Truth Standard §2I)

## VERSION AND AGENT HISTORY

***

Version: 1.2
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [Latest] needrestart user-session leftover (sshd #129/#130). Not Docker. Q8 recommend log out SSH.

***

Version: 1.1
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [not latest] Spark apt ran. Observed **29.6.2** (NVIDIA ARM64 cap). Shared target remains **29.8.0**. Q6 cannot close aligned. Q7 opened (recommend A).

***

Version: 1.0
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [not latest] HIC: environments must have the same versions. Registered DWS_TRUTH_STANDARD.md v5.3 row 41 + §2I. Pin file + check-dev-env-pins.mjs. Docker 29.8.0 shared; Spark 29.2.1 open drift.

***

## Author

Cursor Agent (Grok 4.6) — cloud agent `bc-01a09dae-c4ec-7cd5-a66e-f6ae9071a455`

## Date

2026-09-18

## Location

Espoo, Finland (HIC). Agent: Cursor Cloud.

## Ontology Tags

- **Geography:** Europe > Finland > Espoo
- **Sector:** Development infrastructure / source-of-truth
- **Entities:** Lifetime Oy, Win11, DGX Spark, Docker, DWS Truth Standard, NVIDIA baseos

## The Story

1. HIC: “environments must have same versions. how to make that sure? dev truth standard”.
2. This branch had documented Win11 Docker **29.8.0** and Spark Docker **29.2.1** as a standing pin split.
3. Truth Standard last row on `main` is **39**. PR #2039 already took **row 40** (Spark Ollama pair). This fact is **row 41**.
4. “Make that sure” is not more Admin prose. It is a pin file + a check that exits 1 + a lint FAIL on the old split-as-policy sentence.
5. Role-unique tools stay split: WSL 2.7.14 and Aspire CLI 13.5.4 (Win11); aspire-dashboard 13.4.2 and Spark Ollama (Spark). Averaging the CLI into the dashboard image remains wrong.
6. HIC Spark dashboard paste: compose `pull`/`up` failed interpolating `POSTGRES_PASSWORD`; `docker inspect` of the running container was already `mcr.microsoft.com/dotnet/aspire-dashboard:13.4.2`; `/health` **200**. Recipe now uses `docker pull` of the image.
7. HIC then ran Spark docker-ce apt. Result: **29.6.2** (`dfc4efb`), NVIDIA `noble/arm64` candidate `5:29.6.2-1~ubuntu.24.04~noble`. Not 29.8.0. `docker compose ps` failed the same interpolate error. needrestart: no containers bounced; **user sessions** (sshd #129/#130, admin100 and gdm systemd --user) still hold old binaries — log out SSH, do not bounce docker/gdm.

## The Insight

Two checkouts are two copies of the repo, not two allowed Docker Engines. The pin is the **role**. A check that cannot fail is not a check. Apt that cannot reach the pin is still honest drift — record the cap, do not retarget silently.

## What shipped

- `DWS_TRUTH_STANDARD.md` v5.4 — row 41 / §2I live copy names NVIDIA cap **29.6.2**.
- `config/truth/dev-environment-pins.json` v1.1 — `observed.spark` 29.6.2; `sparkRepoCap` 29.6.2; status `open-drift`.
- Admin v3.25, CLOUD_ENVIRONMENTS v2.10, Files & Folders v1.11, Acer README v1.9.
- `scripts/check-dev-env-pins.mjs` + `npm run env:pins` / `env:pins:strict`

## What did not ship

- No `aligned` (29.6.2 ≠ 29.8.0).
- No `download.docker.com` on GN100.
- No pin retarget to 29.6.2 (Q7).
- No Docker install on Cursor Cloud.
- No aspire-dashboard image bump.
- No Docker MCP restore.

## How to make that sure (operator)

On each box:

```bash
node scripts/check-dev-env-pins.mjs --dump > /tmp/dws-env-$HOSTNAME.json
```

Then:

```bash
node scripts/check-dev-env-pins.mjs --compare win11.json spark.json
npm run env:pins:strict
```

Exit 1 until Spark `docker --version` prints **29.8.0** (or HIC retargets the pin via Q7).

## Next Steps

1. Q7 (recommend A): keep shared target **29.8.0**; wait for NVIDIA on noble/arm64. Do not mix docker.com. Do not downgrade Win11 to 29.6.2.
2. Q6 cannot set `aligned`. Q5 is ANSWERED with 29.6.2.
3. Q4 (split Win11 29.8.0 from Spark) stays superseded.

## HIC decision — Q6 (branch `cursor/wsl-updated-a455`)

```
Q6. After Spark docker-ce apt, set config/truth/dev-environment-pins.json
    docker.client observed.spark to the pasted version and status aligned
    when it equals pin 29.8.0?
    Options:      <A> Yes — close open-drift; npm run env:pins:strict must then exit 0
                  vs <B> Keep 29.2.1 as a second allowed Docker pin
    (RECOMMEND:   <A> — HIC just ruled environments must have the same versions.
                  B is the policy this row exists to FAIL.)
    Reversibility: two-way door until apt; after apt, pin file edit
    Unblocks:     env:pins:strict becomes the merge gate for future version drift
    Cost of delay: Admin and Spark stay 29.2.1 while Win11 is 29.8.0
    Rests on:     Verified — HIC 18.09.2026 “environments must have same versions”;
                  Win11 paste 29.8.0; Spark paste 29.2.1 then 29.6.2; PR #2039 holds Truth row 40.
                  Propagated — pin file + check script this session.
```

Status: `ANSWERED` — observed.spark set to **29.6.2**. **Cannot A:** 29.6.2 ≠ 29.8.0; `status` stays `open-drift`; `npm run env:pins:strict` still exits 1. **Not B:** 29.2.1 / 29.6.2 are not a second allowed pin.

## HIC decision — Q7 (branch `cursor/wsl-updated-a455`)

```
Q7. Shared Docker pin is Win11 **29.8.0**. Spark apt maxed at NVIDIA ARM64 **29.6.2**. What closes the remaining §2I gap?
    Options:      <A> Keep target **29.8.0**. Wait until NVIDIA publishes 29.8.0 on noble/arm64. Do not add download.docker.com on GN100. Do not downgrade Win11.
                  vs <B> Retarget the shared pin to **29.6.2** (NVIDIA cap becomes the pin; Win11 29.8.0 becomes the drift)
                  vs <C> Add Docker CE ARM64 from download.docker.com on GN100 to chase 29.8.0 now
    (RECOMMEND:   <A> — NVIDIA already owns docker-ce on this box. Mixing docker.com risks a split Engine. B hides the Win11/Spark mismatch by moving the target. C is a host-policy change, not a docs edit.)
    Reversibility: A two-way (docs). B two-way (pin file). C one-way-ish (apt source on GN100).
    Unlocks:      operators stop treating 29.6.2 as “the environments now match”
    Cost of delay: env:pins:strict stays red until NVIDIA or a HIC retarget
    Rests on:     Verified — HIC apt paste 18.09.2026; apt-cache policy candidate 5:29.6.2-1~ubuntu.24.04~noble;
                  docker --version 29.6.2 dfc4efb; Compose v5.2.0; Truth §2I.
                  Propagated — this VM did not SSH; sudo password from the paste is not stored.
```

Status: `PENDING_REVIEW`

## N/A items (Rule 12)

- Step 1 KB / Step 3 Learn HTML / Step 4 Drive: N/A — Cursor Cloud; repo markdown is master.
- Step 6 Calendar: N/A — no new dated commitment.
- Dual-folder / thesis: N/A.

***

**Document version:** v1.2 · **Date:** 18.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.** This document contains confidential and proprietary information of Lifetime Oy. It is disclosed solely to the intended recipient under an applicable NDA or business relationship and may not be copied, distributed, or disclosed to any third party without Lifetime Oy's prior written consent.
