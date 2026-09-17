# Next session prompt — DWS6 handbook / ORK bid continuation

Paste the block below into a new Claude Code session to continue.

---

## Context

Repo: `blogtheristo/dws6`. Previous session shipped the Konsultoinnin käsikirja 2026 (handbook),
the `/dialog` skill, a whitepaper series, coaching v1.2, admin/thesis docs, and a full ORK public
tender bid package. **All of it is already merged into `main` via PR #1525 (merged 2026-06-29).**

## Branch policy (IMPORTANT)

PR #1525 on branch `claude/consultant-handbook-v1-6-622fep` is **merged and finished — do not reuse
it.** For any new work, start the branch fresh from main (same name allowed) and open a NEW PR:

```
git fetch origin main && git checkout -B claude/consultant-handbook-v1-6-622fep origin/main
```

## Canonical facts to keep (do not regress)

- **"58 agenttia ja 88 kyvykkyyttä (roolia) 25 toimialalla"** — canonical phrase, non-exact (catalog grows). Never revert to 16/20/50.
- **Ethical line:** capability, not headcount; _agents augment, never replace_; leadership decides personnel (handbook §2 Ihmiskeskeisyys, whitepaper WP01).
- **Pricing (products.json is source of truth):** Climate IQ €2 999/kk (€40 978/v incl. setup), Enterprise Navigator €4 999, DGX Spark €5 994, Control Room €5 294, Situation Room €10 093.
- **Handbook version: 1.76** (`.01` increments). VERSION block uses `***` delimiters.
- **HTML is generated, not hand-edited:** `node scripts/gen-handbook-html.cjs` (handbook), `node scripts/gen-doc-html.cjs <in.md> <out.html> "Title"` (whitepapers/CV/annexes). 2024 design.
- Security incidents → `security@lifetime.fi`. Legal identity: Lifetime Oy, 0772407-9, CEO Risto Anton Paarni.

## ORK/1462/2026 bid — state & the ONE blocker

Finnish Register of Criminal Sanctions (ORK), framework 2+1+1, 3 lots, unit €/person-day. Files in `bids/ORK160826/`.

- **Pricing: tiered Strategy S (chosen).** Base 55,90 €/h (419,25 €/htp); high-weight OA3 roles (AI Architect, DevOps) 52,00 €/h (390,00 €/htp). Total comparison 2 301 000 €. **PROVISIONAL — BLOCKED on John's cost input.** When John's price arrives → lock numbers in `ORK160826_HINTALOMAKE.md` + Liite 5 (E34/E35 → 390,00; rest → 419,25).
- **Differentiation (HIC-locked):** capability + sovereign NVIDIA hardware (Control Room/Situation Room, KYA), NOT cheapest labor. Token-cost avoidance = cost-certainty (no cloud token pass-through) + development continuity. Hardware available as leasing (capex→opex).
- **Market intel:** Gofore won last tender at €58/h with Finnish own personnel. Digia Hub is NOT our channel (self-serving; doesn't want other consortia bidding) — use only the Gofore benchmark. Winning factor = own Finnish staff + specialist certifications → highlight ours (NVIDIA Connect ISV, Founders Hub L1–L4, Article 12, ISO 27001, KYA).
- **Cubet (subcontractor, Lots 1 & 3):** capability annex, whitepaper package, CV template done + exported to Google Drive folder "ORK Cubet Tarjouspaketti".
- **Guardrail:** development-continuity capabilities are 0.1-level — kept in the OFFER only with a maturity caveat; NOT published on the public `lifetime.fi/laskuri` (Keskeytyslaskuri) page.

## Open items / candidate next actions

1. **ORK: lock final price** once John's cost input arrives (the live blocker).
2. **Google Docs review copies** of the handbook are at v1.72 — refresh to v1.76 if still needed (parts 1/2 in Drive).
3. **Whitepapers:** WP01 done. Strongest next = WP07 (capability lifecycle / Boris Cherny archetypes — supports the posted X thread). WP08/WP10 already exist (KYA, Sovereign Industrial Intelligence) — refresh, don't duplicate. Plan: `docs/whitepapers/README.md`.
4. **Thesis change-set** (`docs/THESIS_CHANGESET_HANDBOOK_v1.75.md`) is a PROPOSAL only — RED zone, needs human-applied lockstep update of 4 thesis files + Learn/ HTML.
5. **CV_ORK160826.md / referenssilomakkeet:** could foreground certifications as a differentiator.

## Working method

Use `/dialog`: propose each change as `muutos;` (Nykyinen → Muutos + one-line rationale), wait for "agree" or a counter, apply, commit + push per logical group. Load canonical sources before asserting facts. Surface conflicts, don't average. Preserve quotes/formulations (DWS_DOCUMENT_STANDARD §21).
