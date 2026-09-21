# Handoff — cursor/dws10-i18n-25-dictionary-c0ce

**Branch:** `cursor/dws10-i18n-25-dictionary-c0ce`  
**Task:** kya-jev 0.8 advisory + 25-industry dictionary + live 087  
**State:** READY-FOR-REVIEW / 087 LIVE (HIC SQL editor)  
**PR:** https://github.com/blogtheristo/dws6/pull/2044  
**Date:** 2026-09-19

---

## Version & Agent History

| Version      | Date       | Changes                                                          | Agent           |
| ------------ | ---------- | ---------------------------------------------------------------- | --------------- |
| [Latest] 1.0 | 2026-09-19 | 087 applied live 1.0.5 by HIC; merge/handoff/next-session prompt | Cursor Grok 4.6 |

---

## Facts (do not invent)

- **087 Code-Version 1.0.5** is in `supabase/migrations/087_kya_jev_calls.sql`. HIC confirmed the SQL **succeeded in the live SQL editor**. The agent did **not** apply via Supabase MCP.
- **RLS:** ENABLE + FORCE yes (EXECUTE inside `DO $kya_jev$`).
- **No anon** grant. Grants: `authenticated`, `service_role` only.
- **Policies:** additive `kya_jev_calls_service_all_v087_3`, `kya_jev_calls_authenticated_org_v087_3`. No DROP POLICY / DROP TABLE.
- Table comment in repo: `Code-Version=1.0.5 …`. If next session has Supabase, **verify** that comment; do **not** re-run CREATE.
- **kya-jev 0.8** is advisory only (`actionable: false`). `adviseLeadScore()` / `adviseModelRoute()` / `adviseDictionaryTerm()`. `selectModel()` stays deterministic.
- **Wave 3 live trio** is still **HIC-only**. Live this tree: **industry 8** only. Proposed 8 / 2 / 24 is **unconfirmed**.
- **Art. 50** (transparency / named review): hold until a **named** HIC review. Do not invent Art. 50 closure.
- **No invented companies or prices.** SKU `KYA-JEV-001` remains EUR 99/mo Early Access as already in `dws10.com/config/products.json` (`detailsUrl: null`). Do not invent vendor 150ms / 100x / 22M-token / cents / $3.40 / 193.6× / 444.6× / Cua eval numbers as DWS facts.
- **EN is master** for dictionary / i18n copy.
- **Gemini packet:** `docs/field-notes/2026-09-19-kya-jev-0.8-gemini-audit-packet.md` — path for HIC to paste; no Gemini findings invented here. Packet text may still say “087 unapplied”; **override with this handoff**: 087 is applied live 1.0.5.
- **TypeSafe tweet:** safety audit **MOSTLY SAFE — leave up**. No takedown. Do not invent a tweet URL.

## What's done

- Dictionary + Wave 3 industry **8** only; advisory consumers bound (dictionary, lead score, model route).
- Migration 087 authored through Code-Version **1.0.5**; HIC applied in SQL editor.
- PR #2043 merged to `main` earlier (`edaf0a8b2`) — historical; this vehicle is **#2044**.
- Field notes / Gemini packet / TypeSafe tweet audit on this branch (see git log).

## What's open

- **LWM System-1** vs `LLMClient` + KYA-gated `makeTypedDecision()`: analog only; **not** a claimed production System-1 head.
- **Visual B2/D1** storefront/commercial check (uncalibrated price caveat on the card, not only JSON).
- **KYAv2** publish / partner path: still **blocked** pending HIC (do not treat as shipped).
- **Wave 3 8/2/24** trio **unconfirmed**; do not add industries 2 or 24 to live without HIC.
- Calibration study / ECE: harness exists (`scripts/calibrate-kya-jev.mjs`); **no fabricated results**.
- Next **product** work: **TBD by HIC**.

## Do not

- Re-run 087 CREATE / paste a new CREATE TABLE.
- Grant `anon` on `kya_jev_calls`.
- Auto-route from kya-jev hints, auto-swap to CUA-S1, or ship game / newsjack / Cua form-filler SKU.
- Invent companies, prices, Wave 3 industries, or vendor economics as DWS calibration.

---

## NEXT SESSION PROMPT

Copy the fenced block below into a new agent session.

```
Start from the handoff, not from chat memory:

  .claude/handoffs/cursor-dws10-i18n-25-dictionary-c0ce.md

Branch: cursor/dws10-i18n-25-dictionary-c0ce
PR: https://github.com/blogtheristo/dws6/pull/2044
(If #2044 is merged, work from main or a new feature branch — do not reopen 087 CREATE.)

087 IS ALREADY APPLIED LIVE (HIC SQL editor, 2026-09-19).
Code-Version 1.0.5. Agent did not apply via MCP. Do NOT re-run CREATE TABLE.
Do NOT DROP POLICY / DROP TABLE. Policies are *_v087_3. RLS ENABLE+FORCE. No anon.

If you have Supabase: verify COMMENT ON TABLE kya_jev_calls contains Code-Version=1.0.5.
If you do not have Supabase: do not invent a live verify; leave it to HIC.

kya-jev 0.8 is advisory only (actionable: false). EN is master.
Wave 3 live = industry 8 only. Trio 8/2/24 unconfirmed — HIC-only.
Art. 50 waits for a named review. No invented companies or prices.
Gemini packet: docs/field-notes/2026-09-19-kya-jev-0.8-gemini-audit-packet.md
(override any “087 unapplied” line in that packet with this handoff).
TypeSafe tweet: MOSTLY SAFE — leave up. Do not invent a tweet URL.

Open (do not close without HIC evidence):
- LWM System-1 (not claimed shipped)
- visual B2/D1 storefront check
- KYAv2 blocked
- Wave 3 8/2/24 unconfirmed

Next product work is TBD by HIC. Do not invent claims, SKUs, industries, or calibration numbers.
```
