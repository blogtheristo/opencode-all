# DWS IQ Reference Architecture and Gold Standard

<!-- Evidence: Tool=Claude Code Model=anthropic Agent=reference-architecture Date=2026-09-27 -->
<!-- Audit trail: git log -- docs/field-notes/2026-09-27-dws-iq-reference-architecture.md -->

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/focused-ritchie-rou192 | Date: 27.09.2026 | Changes: Initial field note.

Status: PENDING_REVIEW

---

## What happened

- HIC supplied the Palantir AIP architecture overview and asked for a DWS version plus proposed updates. Result: `docs/architecture/DWS_IQ_REFERENCE_ARCHITECTURE.md` and its Gold Standard HTML view.
- HIC defined "gold standard" = cari.fi colours exactly + IBM Plex. Codified as `DWS_BRAND_STANDARD.md` §2.2 (v3.14), source `blogtheristo/cari` `public/index.html` commit dd2a144; trigger row added to `STANDARDS_ROUTING.md` v1.8.
- Open PRs checked first: Copilot's `blogtheristo/dws6#2177` (LinkedIn UTF-8) and OpenCode's `blogtheristo/dws6#2173` (products payable) do not touch these files.

## Finding

The largest gap against the benchmark is the ontology runtime: DWS sells "the governed ontology is the product" (Brand §22) but the ontology is documentation plus a simulator, with no typed object / link / action runtime. Second: the Inference Jurisdiction Score, the per-session proof behind sovereignty-first segmentation, is not implemented.

## HIC decision question

Which P1 goes first: the Inference Jurisdiction Score (fastest, backs existing sovereignty claims) or the typed ontology runtime (largest moat, longest build)?

## Learning-loop steps

- KB update: N/A — pending HIC answer on P1 order.
- Learn/ HTML render: N/A — the HTML view lives beside the source in `docs/architecture/`.
- Drive export: N/A — draft until HIC review.
- Calendar: N/A — no dated commitment made.
- Market-signal routing: Sales Score N/A — this is an internal architecture benchmark, not a market event; no buyer, trigger or account named.
