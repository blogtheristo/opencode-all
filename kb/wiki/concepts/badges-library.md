<!--
VERSION AND AGENT HISTORY
Document: badges-library.md
Version: 1.0
Last-Updated: 2026-04-22
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-7)
Purpose: Single source of truth for every visual badge / pill / chip used
         across dws10.com, landing-pages, onelifetime.world, lifetime.fi,
         Learn/, and partner-facing assets. Each badge has a canonical
         label, HTML snippet, category, semver, and list of files that
         currently use it. Future contributors should ADD new badges
         here first (or bump a version) before placing them on a page —
         this is how we keep consistency across 74+ HTML files and 134+
         badge instances.
Introduced-In: PR-pending (branch claude/agents-v2-implementation-PPLwb-EIYyg)
Code-Version: 1.0
Branch: claude/agents-v2-implementation-PPLwb-EIYyg
Date: 2026-04-22
Owner: risto.paarni@lifetime.fi
-->

# DWS Badges Library

**Version:** 1.0
**Status:** Active
**Scope:** All public sites (dws10.com, onelifetime.world, lifetime.fi, dws6.com) + landing-pages mirrors + Learn/ HTML exports

## Why this library exists

A Q2-2026 catalog found **47 unique badge labels** spread across **74 HTML files** with **134+ total instances**, each styled with slightly different inline CSS. Without a library, every edit risks drift (colour, corner radius, letter-spacing). This document is the canonical definition of each badge; industry pages, product pages, and partner pages MUST reference these shapes instead of reinventing them.

## How to use

1. **Look up** the badge you want in the catalog below by label or category.
2. **Copy** the HTML snippet exactly. If you need a variant (different background, different text), propose an addition via PR rather than inlining an ad-hoc style.
3. **Update** the "Used-In" list so future maintainers know where the badge is live.
4. **Version bumps:** If the badge text or visual design changes materially (new regulation, new positioning), bump the version here and in the VERSION AND AGENT HISTORY block.

## Semver rules

- **Patch (1.0.0 → 1.0.1):** typo, hex tweak, no semantic change.
- **Minor (1.0 → 1.1):** copy edit that preserves meaning (e.g. "KYA-WRAPPED" → "KYA-WRAPPED BY DEFAULT"), or new sub-label.
- **Major (1.0 → 2.0):** meaning change (retired regulation, replaced standard, or consolidated into a different badge).

## Categories

1. Sovereignty / Data Residency
2. Compliance / Regulation
3. Security / Governance
4. Interop / Protocol
5. Product / Tier
6. Partnership / Certification
7. Status / Timeline
8. Architecture / Scope

---

## 1. Sovereignty / Data Residency

### EU Data Residency `v1.0`

- **Label:** `EU Data Residency` (variants: `EU Data Residency (Finland)`)
- **Category:** Sovereignty
- **Intended use:** Any page claiming EU-hosted data processing.
- **Source of truth:** `lifetime.fi/index.html:744`
- **Used in (sample):** `lifetime.fi/index.html`, `aegis/index.html`, `products/cloud-pricing.html` (18+ instances)
- **Snippet:**

```html
<span class="nordic-sovereignty__badge nordic-sovereignty__badge--eu"> 🇪🇺 EU Data Residency </span>
```

### CLOUD Act Free `v1.0`

- **Label:** `CLOUD Act Free` (FR: `Sans CLOUD Act`, DE: `CLOUD Act-frei`)
- **Category:** Sovereignty
- **Intended use:** US-CLOUD-Act exposure disclaimer for EU buyers (banking, healthcare, public-sector).
- **Used in:** `lifetime.fi/index.html:745`, `products/cloud-pricing.html`, multilingual variants under `fr/`, `de/`, `sv/` (16+ instances).
- **Snippet:**

```html
<span class="nordic-sovereignty__badge nordic-sovereignty__badge--eu"> 🛡 CLOUD Act Free </span>
```

### Finnish Jurisdiction `v1.0`

- **Label:** `Finnish Jurisdiction` (FR: `Juridiction finlandaise`, DE: `Finnische Jurisdiktion`, SV: `Finsk jurisdiktion`)
- **Category:** Sovereignty
- **Used in:** `dws10.com/index.html:442`, `products/cloud-pricing.html:826` (as `Finnish Sovereign`).
- **Snippet:**

```html
<span class="nordic-sovereignty__badge nordic-sovereignty__badge--fi">
  🇫🇮 Finnish Jurisdiction
</span>
```

### GDPR Native `v1.0`

- **Label:** `GDPR Native`
- **Category:** Sovereignty
- **Used in:** `lifetime.fi/index.html:748`
- **Snippet:**

```html
<span class="nordic-sovereignty__badge nordic-sovereignty__badge--eu">GDPR Native</span>
```

### European Cloud `v1.0`

- **Label:** `European Cloud`
- **Category:** Sovereignty
- **Used in:** `products/edge-node-gn100.html`.
- **Note:** Prefer `EU Data Residency` unless specifically describing the cloud vendor layer.

---

## 2. Compliance / Regulation

### EU AI Act `v1.0`

- **Label:** `EU AI Act` (sub-variant `EU AI Act Article 12`)
- **Category:** Compliance
- **Used in:** `aegis/index.html:446`, `lifetime.fi/index.html:746` (8+ instances).
- **Snippet:**

```html
<span class="reg">EU AI Act</span>
```

(short-form `.reg` class, used in architecture/compliance pages)

### NIS2 Aligned `v1.0`

- **Label:** `NIS2 Aligned`
- **Category:** Compliance
- **Used in:** `lifetime.fi/index.html:747` (6+ instances).
- **Snippet:**

```html
<span class="nordic-sovereignty__badge nordic-sovereignty__badge--eu">NIS2 Aligned</span>
```

### CSRD / ETS / ETS2 / CBAM / Fit for 55 / EPBD / SFDR / DORA / MiCA / CRMA `v1.0`

- **Category:** Compliance
- **Used in:** `architecture/index.html`, `compliance/index.html`, industry pages (found via `.reg` class).
- **Snippet (short-form):**

```html
<span class="reg">CSRD</span>
<span class="reg">ETS2</span>
<span class="reg">CBAM</span>
```

### EU AI Act Compliance `v1.0`

- **Label:** `EU AI Act Compliance`
- **Category:** Compliance (dual-use markets)
- **Used in:** `construction/index.html:552`.

---

## 3. Security / Governance

### KYA Agent Governance `v1.0`

- **Label:** `KYA Agent Governance`
- **Category:** Security
- **Used in:** `lifetime.fi/index.html:749`.
- **Snippet:**

```html
<span class="tag tag-kya">KYA Agent Governance</span>
```

### KYA-WRAPPED BY DEFAULT `v1.1` ⚑ NEW in this PR

- **Label:** `🛡 KYA-WRAPPED BY DEFAULT`
- **Category:** Security
- **Intended use:** Any "Bring Your Own Agent" / A2A interop context where we want to advertise that BYO agents are MicroVM-sandboxed and identity-bound.
- **Copy (below badge, 1 paragraph):** "Every BYO agent is bound to a verified human identity, isolated in a MicroVM sandbox, and subject to TC-4 Leash-Snap termination. **We aim to open-source the KYA Standard via the Agentic AI Foundation, NIST, and European standards bodies** — just as Google donated A2A to the Linux Foundation."
- **Introduced by:** branch `claude/agents-v2-implementation-PPLwb-EIYyg`, commit `d6bc3fd1` (initial) → bumped in this PR to v1.1 to add open-source aim.
- **Used in:** `dws10.com/construction/index.html`, `landing-pages/dws10-com/construction/index.html` (v1.0 initial); will roll out to all 11 industry pages + `/enterprise-integrations/` at v1.1.
- **Snippet (v1.1):**

```html
<div
  style="background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.25); border-radius: 8px; padding: 12px 14px; margin-bottom: 15px;"
>
  <div
    style="color: #fbbf24; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.06em; margin-bottom: 4px;"
  >
    🛡 KYA-WRAPPED BY DEFAULT
  </div>
  <p style="color: rgba(255,255,255,0.8); font-size: 0.88rem; line-height: 1.5; margin: 0;">
    Every BYO agent is bound to a verified human identity, isolated in a MicroVM sandbox, and
    subject to TC-4 Leash-Snap termination. We aim to open-source the KYA Standard via the
    <strong>Agentic AI Foundation, NIST, and European standards bodies</strong>.
    <a href="/kya-standard/" style="color: #fbbf24; text-decoration: underline;"
      >Know Your Agent Standard →</a
    >
  </p>
</div>
```

### PiTuKri Audited `v1.0`

- **Label:** `PiTuKri Audited`
- **Category:** Security (Finnish public-sector audit standard)
- **Used in:** `products/cloud-pricing.html:677`.

### Single-Tenant `v1.0`

- **Label:** `Single-Tenant`
- **Category:** Security
- **Used in:** `products/cloud-pricing.html:675`.

### ISO 27001 Q3 2026 `v1.0`

- **Label:** `ISO 27001 Q3 2026`
- **Category:** Security / Timeline
- **Used in:** `products/cloud-pricing.html`.
- **Note:** Timeline-bound. Bump to v2.0 when certification lands (remove "Q3 2026" qualifier).

### ICEYE SAR Partner `v1.0`

- **Label:** `ICEYE SAR Partner`
- **Category:** Security / Partnership
- **Used in:** `construction/index.html:554`.

---

## 4. Interop / Protocol

### V2 · SKILLED AGENTS `v1.0` ⚑ NEW in this PR

- **Label:** `V2 · SKILLED AGENTS`
- **Category:** Product / Architecture
- **Intended use:** Section opener on industry pages announcing the V2 agent roster with executable skills.
- **Used in:** `dws10.com/construction/index.html:576` (initial), rolling out to all 11 industry pages.
- **Snippet:**

```html
<div
  style="display: inline-block; background: rgba(251,191,36,0.15); color: #fbbf24; padding: 6px 14px; border-radius: 999px; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.08em;"
>
  V2 · SKILLED AGENTS
</div>
```

### A2A v1.0 · MCP · KYA (Standards Strip) `v1.0` ⚑ NEW in this PR

- **Label:** Three chips in a row: `A2A v1.0`, `MCP`, `KYA`
- **Category:** Interop / Protocol
- **Intended use:** Footer of the V2 Skilled Agents section on every industry page + the BYO Agent Interface section on `/enterprise-integrations/`. Signals interop parity with Google A2A (Linux Foundation, 150+ orgs), Anthropic MCP, and Lifetime Oy's KYA.
- **Source:** Competitive landscape analysis `docs/field-notes/2026-04-22-agent-ecosystem-landscape-q2-2026.md`.
- **Snippet:**

```html
<div
  style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 8px; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08);"
>
  <span style="color: rgba(255,255,255,0.55); font-size: 0.82rem; margin-right: 4px;"
    >Standards &amp; Interop:</span
  >
  <a
    href="https://a2a-protocol.org/latest/specification/"
    target="_blank"
    rel="noopener"
    style="background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); padding: 4px 12px; border-radius: 999px; font-size: 0.82rem; font-family: monospace; text-decoration: none; border: 1px solid rgba(255,255,255,0.12);"
    >A2A v1.0</a
  >
  <a
    href="https://modelcontextprotocol.io"
    target="_blank"
    rel="noopener"
    style="background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); padding: 4px 12px; border-radius: 999px; font-size: 0.82rem; font-family: monospace; text-decoration: none; border: 1px solid rgba(255,255,255,0.12);"
    >MCP</a
  >
  <a
    href="/kya-standard/"
    style="background: rgba(251,191,36,0.12); color: #fbbf24; padding: 4px 12px; border-radius: 999px; font-size: 0.82rem; font-family: monospace; text-decoration: none; border: 1px solid rgba(251,191,36,0.3);"
    >KYA</a
  >
</div>
```

### Skill Chip (generic) `v1.0`

- **Label:** any `/slash-command` or `runtime gate`
- **Category:** Interop (agent skill reference)
- **Used in:** V2 Skilled Agents agent cards on industry pages.
- **Snippet:**

```html
<span
  style="background: rgba(251,191,36,0.12); color: #fbbf24; padding: 3px 9px; border-radius: 999px; font-size: 0.78rem; font-family: monospace;"
  >/compliance-check</span
>
```

---

## 5. Product / Tier

### DWS IQ 6 — €4,999 `v1.0`

- **Label:** `DWS IQ 6 — €4,999`
- **Category:** Product CTA (blue gradient)
- **Used in:** `healthcare/index.html:251`, repeated across industry pages (20+ instances).
- **Note:** Treat as a CTA button, not a status badge. Price changes ⇒ major version bump here.

### DWS IQ Aegis — €59,990 `v1.0`

- **Label:** `DWS IQ Aegis — €59,990`
- **Category:** Product CTA (gold gradient)
- **Used in:** 20+ pages.

### All Dual Use Industries `v1.0`

- **Label:** `All Dual Use Industries`
- **Category:** Product navigation
- **Used in:** industry pages, `healthcare/index.html:253`, etc. (20+).

---

## 6. Partnership / Certification

### NVIDIA ISV Partner `v1.0`

- **Label:** `NVIDIA ISV Partner`
- **Category:** Partnership
- **Used in:** `dws10.com/index.html:445` (8+ instances).
- **Snippet:**

```html
<span class="nordic-sovereignty__badge nordic-sovereignty__badge--nvidia">NVIDIA ISV Partner</span>
```

### InvestEU INPO-20254383 `v1.0`

- **Label:** `InvestEU INPO-20254383`
- **Category:** Funding / Program
- **Used in:** `products/cloud-pricing.html:825`.

### DEFINE Accelerator `v1.0`

- **Label:** `DEFINE Accelerator`
- **Category:** Program
- **Used in:** `products/cloud-pricing.html`.

---

## 7. Status / Timeline

### PRODUCTION READY `v1.0`

- **Label:** `🟢 PRODUCTION READY`
- **Category:** Status
- **Used in:** `progress-report.html:259`.

### PARTNERSHIP READY `v1.0`

- **Label:** `🟢 PARTNERSHIP READY`
- **Category:** Status
- **Used in:** `progress-report.html:313`.

### DELIVERY READY `v1.0`

- **Label:** `🟢 DELIVERY READY`
- **Category:** Status
- **Used in:** `progress-report.html:341`.

### Available August 2026 `v1.0`

- **Label:** `Available August 2026`
- **Category:** Timeline
- **Used in:** `products/cloud-pricing.html`.
- **Note:** Bump to v2.0 on GA.

---

## 8. Architecture / Scope

### 18+ GodAgents `v1.0`

- **Label:** `18+ GodAgents`
- **Category:** Architecture
- **Used in:** `products/cloud-pricing.html:595`.
- **Note:** Numbers drift as the roster grows. Audit monthly; bump minor on each increment.

### 20 Industries `v1.0`

- **Label:** `20 Industries`
- **Category:** Scope
- **Used in:** `products/cloud-pricing.html:596`.

### 6 ERP Channels `v1.0`

- **Label:** `6 ERP Channels`
- **Category:** Integration
- **Used in:** `products/cloud-pricing.html:597`.

---

## Multilingual variants

EU pages (FR, DE, SV) use translated badge labels. Keep parity:

| EN                   | FR                       | DE                     | SV                 |
| -------------------- | ------------------------ | ---------------------- | ------------------ |
| EU Data Residency    | Résidence des données UE | EU-Datenresidenz       | EU-dataresidens    |
| Finnish Jurisdiction | Juridiction finlandaise  | Finnische Jurisdiktion | Finsk jurisdiktion |
| CLOUD Act Free       | Sans CLOUD Act           | CLOUD Act-frei         | CLOUD Act-fri      |
| KYA Agent Governance | Gouvernance d'agent KYA  | KYA-Agenten-Governance | KYA Agentstyrning  |

---

## Follow-up engineering tasks

- [ ] **Extract to shared CSS.** Today 134+ badge instances use inline CSS. Consolidate into `shared-assets/badges.css` with classes `.badge`, `.badge--sov-eu`, `.badge--sov-fi`, `.badge--reg`, `.badge--kya`, `.badge--status-ready`. Don't break existing inline usage — add classes alongside and migrate page-by-page. Separate PR.
- [ ] **Lint.** Write a script `scripts/audit-badges.ts` that greps for known badge labels, cross-references the Used-In lists above, and flags drift (unknown labels, missing version bumps). Run in CI.
- [ ] **Register in kb.json.** Add this article to `kb/kb.json` on next `/kb compile`.
- [ ] **A2A Agent Card endpoint.** Tie to the follow-up in `docs/field-notes/2026-04-22-agent-ecosystem-landscape-q2-2026.md` — once `/.well-known/agent-card.json` ships, publish a `A2A v1.0 VERIFIED` badge and bump the Standards Strip to v1.1.
- [ ] **Open-source KYA** via Agentic AI Foundation / NIST / European standards body. Bump `KYA-WRAPPED BY DEFAULT` from v1.1 → v2.0 when a specification is published externally.

---

## Contribution workflow

1. Identify need → check if an existing badge fits.
2. If yes: copy snippet, update Used-In list.
3. If no: propose an addition here first (new entry + snippet + category + version `1.0`).
4. Commit the library update **in the same PR** as the page change that introduces the badge.
