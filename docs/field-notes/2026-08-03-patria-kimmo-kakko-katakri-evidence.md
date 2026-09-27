# Field note — Patria outreach (Kimmo Kakko) & the evidence register

**Date:** 2026-08-03 · **Session:** `claude/patria-sales-outreach-iyvb7o` · **Tool:** Claude Code (Fable 5, earlier turns Opus 5)

## What happened

1. **Outreach shipped.** LinkedIn card → named Stage 3 door at Patria: Kimmo Kakko (Manager, Factory Security, Protected Mobility; KATAKRI Chief Auditor, Laurea). Letter iterated v1→v3 on two Boardy rounds: wedge narrowed to **supplier + export-control evidence**, ask narrowed to an **independent gap assessment** ("missä tämä ei kestä KATAKRI- tai DIANA-arviointia"), EU dual-use first, **no ITAR/EAR claim**, no introduction request in message one. **HIC sent it 03.08.** Bump 10.08 (calendared, event `9nm1uahq6qrh5pl4c02m2hdmoo`). Files: `sales-outreach/{INTRO,LETTER,ONEPAGER}_*KIMMO_KAKKO*`.
2. **The auditor-recipient forced an evidence audit of ourselves.** New register `docs/TODISTUSVELVOLLISUUS.md`: "PiTuKri tehty" is actually an **AI-session self-assessment** (81 %, 42/52, 7 not met — its own gap list includes no personnel-security process and no 2026 pentest); "alle 5 ms" is a **design target with no measurement**. Rule established: if it can't be shown in the same moment, it isn't said.
3. **KATAKRI 2020 read from source** (HIC-supplied PDF) → `docs/KATAKRI_2020_VAATIMUSHAKEMISTO.md` (all 42 requirement IDs). Corrected our own premise: KATAKRI is *not* silent on non-human actors (I-06 k.3 covers automatic processes; I-07 identifies systems). The real gap is the **T-13 seam**: an agent gets rights as a system while its need-to-know derives from a person the criteria never name. Call sheet v2.0 maps every question to real control IDs and opens with the self-correction.
4. **G7 sweep done.** 12 live outreach/investor/GTM files corrected: "PiTuKri audited" → "v1.1 self-assessment, 81 %, independent audit **planned**" (HIC corrected "in procurement" → "planned"); "sub-5 ms" → "design target".
5. **Backlog section G** (9 items) added to `docs/backlog/BACKLOG_UNDONE_2026-07-24.md`. P0: independent assessment (G1), 2026 pentest (G2), latency measurement (G3).

## Lesson

Selling to an auditor inverted the artifact: the deliverable stopped being persuasive copy and became a **provability register**. Two flagship claims did not survive our own first pass — better to be the ones who found that.

## Learning Outcome checklist (DWS_LEARNING_STANDARD)

1. kb/ update — **N/A**: `/kb` compile not run in this cloud session; this note + register are the durable artifacts, kb ingestion deferred to next local session.
2. Field note — this file.
3. Learn/ HTML — **N/A**: `scripts/render-doc.sh` toolchain not exercised here; render alongside step 1.
4. Drive export — attempted this session via Google Drive connector; see session log.
5. HIC decision question — in chat (G1 budget question).
6. Calendar — done in-session (bump event 10.08).
