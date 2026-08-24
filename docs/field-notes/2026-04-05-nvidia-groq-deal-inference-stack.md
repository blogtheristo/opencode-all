# NVIDIA × Groq Deal — Impact on DWS6 Inference Stack

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Initial — documents the December 2025 NVIDIA-Groq non-exclusive licensing deal, implications for DWS6 inference routing (Scaleway primary, NVIDIA NIM third route, Groq demoted but retained), strategic narrative for NVIDIA Connect Partners, residency posture unchanged

Session Links & References:
  - Groq press release: https://groq.com/newsroom/groq-and-nvidia-enter-non-exclusive-inference-technology-licensing-agreement-to-accelerate-ai-inference-at-global-scale
  - CNBC analysis: https://www.cnbc.com/2025/12/26/nvidia-groq-deal-is-structured-to-keep-fiction-of-competition-alive.html
  - Tom's Hardware (Groq 3 LPX chip): https://www.tomshardware.com/tech-industry/semiconductors/nvidias-20-billion-groq-deal-produces-its-first-chip
  - TechCrunch: https://techcrunch.com/2025/12/24/nvidia-acquires-ai-chip-challenger-groq-for-20b-report-says/
  - More Than Moore (Dr. Ian Cutress): https://morethanmoore.substack.com/p/ho-ho-ho-groq-nvidia-is-a-gift

Document Status:
  - Created: 05.04.2026
  - Last Modified: 05.04.2026
  - Language: English
  - Publication Status: ACTIVE

***

**Type:** Competitive Intelligence / Infrastructure Decision
**Scope:** `src/services/climate-assistant.service.ts` inference routing, DWS7 inference architecture, NVIDIA Connect Partner narrative
**Related:** commit `4ad74e7` (Scaleway EU-primary swap), `.env.example` LLM section

---

## What happened (Dec 24, 2025)

NVIDIA entered a **$20B non-exclusive licensing agreement** with Groq. Structured
as a licensing deal + acqui-hire, not a full acquisition:

| Component | Outcome |
|---|---|
| Groq LPU architecture + patents | Licensed to NVIDIA (non-exclusive) |
| Jonathan Ross + Groq core engineers | Joined NVIDIA |
| Groq the company | **Remains independent**, still holds IP |
| GroqCloud (api.groq.com) | **Still operates**, unchanged for customers |
| New NVIDIA product | **NVIDIA Groq 3 LPX** — Groq LPU architecture on Samsung 4nm, integrated into NVIDIA Vera Rubin rack-scale platform |

Deal structure keeps Groq alive as a "competitor in fiction" (CNBC) to reduce
antitrust exposure.

## What changed architecturally

NVIDIA publicly acknowledged at GTC 2026 that the inference pipeline is
**GPU + LPU hybrid**, not GPU-only:

| Stage | Best silicon |
|---|---|
| Training | NVIDIA GPU (Blackwell / Rubin) |
| Inference — prefill (context ingestion) | NVIDIA GPU |
| Inference — decode (token-by-token) | Groq LPU |

The architectural distinction remains real:

| | NVIDIA GPU | Groq LPU |
|---|---|---|
| Memory | HBM external | SRAM on-die |
| Scheduling | Dynamic | Deterministic |
| Latency | Variable | Very flat |
| Training | ✅ | ❌ |
| Token-latency tail | Wider p99 | Tight p99 |

## What this means for DWS6

### Narrative change — significant

Before the deal, saying "we use Groq" was orthogonal to our NVIDIA Connect
Partner status. Now they are **strategically aligned**: Groq LPU is NVIDIA's
inference decode strategy. Using Groq = using NVIDIA's inference architecture.

This is useful for enterprise pitches where Chief Architects ask about
silicon strategy: we can say *"our inference decode path runs on Groq LPU,
which is now part of NVIDIA's Vera Rubin platform under our Connect Partner
relationship"* — a single, coherent story instead of two separate vendors.

### Residency posture — UNCHANGED

The deal is a **silicon + talent** transfer, not a data-residency change.
GroqCloud is still US-hosted. EU customer prompts sent to `api.groq.com`
still cross the Atlantic. **GDPR / residency concerns on the Groq cloud path
are identical to before the deal.**

EU customers still route to Scaleway (Paris/AMS). Groq remains fallback
only.

### DPA posture — UNCHANGED

Groq DPA is still EU-SCC-embedded in the GroqCloud Services Agreement (no
separate signable instrument). This was flagged as a gap for EU enterprise
buyers pre-deal, and remains a gap post-deal.

### Future (V1.5+): EU-hosted Groq LPU becomes possible

NVIDIA Groq 3 LPX chips will ship in NVIDIA rack-scale systems. These can
be deployed in EU data centers (Equinix FR, Hetzner DE/FI, Scaleway DC3/DC5,
or Lifetime's own DGX racks). Once NVIDIA's inference microservices (NIM)
expose Groq 3 LPX endpoints in EU regions, **we could get Groq LPU
latency with EU residency** — the best of both. Not available at MVP, worth
tracking for V1.

## Decision applied (this session)

Final routing for Climate Assistant inference (see
`src/services/climate-assistant.service.ts`):

```
1. Scaleway (EU, primary)         — free tier, EU residency, Llama 3.3 70B
2. NVIDIA NIM (EU region or partner preview) — strategic, Connect Partner benefit
3. Groq (US, retained)            — fallback + non-EU admin/demo path
```

Groq is **NOT** dropped. Groq is **demoted from primary to tertiary**, with
a retained strategic role:
- Speed benchmarking (LPU 500+ tok/s vs GPU ~50-100 tok/s)
- Non-EU admin tools, internal demos, dev prototyping
- Fallback if Scaleway AND NIM both fail

### Routing decision tree

```
EU customer?
├── yes → Scaleway → NIM(EU) → [fail: friendly message]
└── no  → NIM(preview) → Groq → Scaleway(EU)

Admin / demo / dev?
└── Groq (speed-first, residency not relevant)

Edge / offline?
└── DGX / Jetson on-prem (NIM container locally, planned V1)
```

## Action items

- [x] Code: Scaleway EU-primary routing shipped (commit `4ad74e7`)
- [ ] Code: add NVIDIA NIM as third route (this session, follow-up commit)
- [ ] Env: `NIM_API_KEY` + `NIM_API_URL` + `NIM_MODEL` in `.env.example`
- [ ] Legal hub: document that Groq DPA gap persists post-deal
- [ ] Partnerships: ask NVIDIA Connect Partner manager about EU Groq 3 LPX
      availability + DPA terms for NIM EU endpoints
- [ ] Roadmap: add "EU Groq LPU" as V1.5 milestone once NIM-EU ships

## One-sentence summary

*"Groq vs NVIDIA" is dead — it's "NVIDIA + Groq" now. DWS6 keeps Groq in the
stack as strategic fallback, routes EU customer data through Scaleway, and
tracks NVIDIA Groq 3 LPX on EU NIM as the V1.5 convergence path.*

---

**Footer**
Owner: Lifetime Oy (risto.paarni@lifetime.fi)
Business ID: 0772407-9 | VAT: FI07724079
Part of the Lifetime World Model (LWM) field-notes corpus.
