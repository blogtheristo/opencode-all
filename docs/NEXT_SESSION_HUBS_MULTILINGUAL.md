# Next Session — Compliance Hub + Legal Hub: language bar, language versions, versioning, go-live

**Branch:** `claude/susanna-hypponen-card-tnq9cl` (continue here)

**Status carried in from previous session**

- Shipped (committed + pushed, **not yet merged to `main`, so not live online**):
  - Compliance Hub v3.0 → **v3.1**: Data Protection Management (Tietosuojajohtaminen) capability tile + ISO/IEC 42001 (AI Management System) framework card + Digia Hub partner trust signal. (`dws10.com/compliance/index.html` + `landing-pages/dws10-com/...` mirror)
  - Legal Hub: §3 reframed around data protection management, DPO line backed by external advisory bench, ISO/IEC 42001 roadmap row, Partner Ecosystem (Digia Hub) card. (`dws10.com/legal/index.html` + mirror)
  - `DWS_LEGAL_STANDARD.md` → v1.2.
  - People DB + cards: `People/people_database.json` (`susanna-hypponen-001`), `People/partners/consultants/susanna-hypponen.md`, `People/partners/technology/digia.md`, `People/partners/consulting/{digia-hub-consulting,DIGIA_HUB_YHTEISMARKKINOINTI,DIGIA_HUB_ASSIGNMENTS}.md`.
- **Guardrail:** Susanna Hyppönen stays internal (prospect) — do NOT name her on public Legal/Compliance Hub pages.

**Online audit result:** the changes live only on the feature branch; `origin/main` (HEAD `7e067aa`) does not contain them, so `dws10.com` still serves the old hubs. Going live = merge branch → `main` (deploy).

---

## Standards to load (CLAUDE.md routing)

`multilingual` (`.claude/commands/multilingual.md`) · `dual-folder-sync` · `SITE_QUALITY_STANDARDS.md` · `DWS_BRAND_STANDARD.md` · `DWS_DOCUMENT_STANDARD.md` (VERSION blocks use `***`, never `---`) · `DWS_TRUTH_STANDARD.md` (run `/truth-check`).

## 1. Language bar on both hubs (FI · SV · DE · FR · EN)

- Add `<script src="/shared-assets/vertical-lang-bar.js"></script>` to `dws10.com/compliance/index.html` and `dws10.com/legal/index.html` (+ `landing-pages/dws10-com/` mirrors).
- Extend `dws10.com/shared-assets/vertical-lang-bar.js`: today `pageType` only detects `home` / `store` / `product` (lines ~112-116). Add `compliance` and `legal` path detection and a per-language hero text for each context in `LANGS[]`. Mirror the JS file.
- Bar is a PAGE element — never inside `ironclad-nav`. Rows: language name left, native hero centre, flag right.

## 2. Language versions for both hubs

- Create `dws10.com/compliance/{fi,sv,de,fr}/index.html` and `dws10.com/legal/{fi,sv,de,fr}/index.html` (EN stays canonical at root). Add `hreflang` alternates linking all five.
- Translate the additions from last session: Data Protection Management / Tietosuojajohtaminen, ISO/IEC 42001 card, Digia Hub partner signal, Legal §3 + DPO + roadmap.
- Mirror every page to `landing-pages/dws10-com/...` in the same commit.
- Run multilingual **audit**: each language page H1 must match `LANGS[].<context>` in the bar JS.

## 3. Versioning consistent with the price-list (`products.json`)

- `dws10.com/config/products.json` uses a per-entry `"version"` string (e.g. "1.0", "1.2", "6"). Give **both hubs** a matching, consistent version marker:
  - Legal Hub currently has **no** `VERSION AND AGENT HISTORY` block — add one (`***` delimiters) + a visible version badge like the Compliance Hub's `CI POWER V2 LIVE` badge.
  - Bump Compliance Hub 3.1 → **3.2** for the language work.
  - Keep both hub version stamps in lockstep with each other.

## 4. Verify + go live

- Dual-folder parity: `diff -q` source vs mirror for every changed page (must be identical).
- Valid HTML; no `.md` in public-site folders; `/truth-check` clean (no "Certified" claims we don't hold).
- Optional: `dws browse` the FI + DE pages to confirm the bar renders correctly.
- Commit + push. Then **open PR `claude/susanna-hypponen-card-tnq9cl` → `main`** (requires human go-ahead — deploy is the RED zone) and confirm CI green. Merge is what makes everything live online.

---

_Generated as a session handoff. Not a public-site file (lives in `docs/`)._
