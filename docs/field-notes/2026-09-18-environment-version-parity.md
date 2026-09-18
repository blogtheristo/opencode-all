# Field Note — Environment Version Parity (Truth Standard §2I)

## VERSION AND AGENT HISTORY

***

Version: 1.0
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [Latest] HIC: environments must have the same versions. Registered DWS_TRUTH_STANDARD.md v5.3 row 41 + §2I. Pin file + check-dev-env-pins.mjs. Docker 29.8.0 shared; Spark 29.2.1 open drift.

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
- **Entities:** Lifetime Oy, Win11, DGX Spark, Docker, DWS Truth Standard

## The Story

1. HIC: “environments must have same versions. how to make that sure? dev truth standard”.
2. This branch had documented Win11 Docker **29.8.0** and Spark Docker **29.2.1** as a standing pin split.
3. Truth Standard last row on `main` is **39**. PR #2039 already took **row 40** (Spark Ollama pair). This fact is **row 41**.
4. “Make that sure” is not more Admin prose. It is a pin file + a check that exits 1 + a lint FAIL on the old split-as-policy sentence.
5. Role-unique tools stay split: WSL 2.7.14 and Aspire CLI 13.5.4 (Win11); aspire-dashboard 13.4.2 and Spark Ollama (Spark). Averaging the CLI into the dashboard image remains wrong.
6. HIC Spark dashboard paste: compose `pull`/`up` failed interpolating `POSTGRES_PASSWORD`; `docker inspect` of the running container was already `mcr.microsoft.com/dotnet/aspire-dashboard:13.4.2`; `/health` **200**. Recipe now uses `docker pull` of the image.

## The Insight

Two checkouts are two copies of the repo, not two allowed Docker Engines. The pin is the **role**. A check that cannot fail is not a check.

## What shipped

- `DWS_TRUTH_STANDARD.md` v5.3 — row 41 + §2I.
- `config/truth/dev-environment-pins.json`
- `scripts/check-dev-env-pins.mjs` + `npm run env:pins` / `env:pins:strict`
- Admin v3.23, CLOUD_ENVIRONMENTS v2.9, Files & Folders v1.10, Acer README v1.8
- `docs/system-config/STANDARDS_ROUTING.md` trigger; `DWS_STANDARDS_LIBRARY.md` v1.13 pointer

## What did not ship

- No Spark apt from this VM (cannot SSH).
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

Exit 1 until Spark `docker --version` prints **29.8.0**.

## Next Steps

1. HIC Q6 (recommend A): after Spark apt, paste `docker --version` and flip the pin file to `aligned`.
2. Q5 remains the apt run on `gn100-cb5d`.
3. Q4 (split Win11 29.8.0 from Spark) is superseded by Q6.

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
                  Win11 paste 29.8.0; Spark paste 29.2.1; PR #2039 holds Truth row 40.
                  Propagated — pin file + check script this session.
```

Status: `PENDING_REVIEW`

## N/A items (Rule 12)

- Step 1 KB / Step 3 Learn HTML / Step 4 Drive: N/A — Cursor Cloud; repo markdown is master.
- Step 6 Calendar: N/A — no new dated commitment.
- Dual-folder / thesis: N/A.

***

**Document version:** v1.0 · **Date:** 18.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.** This document contains confidential and proprietary information of Lifetime Oy. It is disclosed solely to the intended recipient under an applicable NDA or business relationship and may not be copied, distributed, or disclosed to any third party without Lifetime Oy's prior written consent.
