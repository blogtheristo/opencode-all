# Handoff — claude/ai-pact-enforcement-transparency-gnnipk

**PR:** #1780 (open). Branch merged with `origin/main` at `c8549c2` — one trivial `.gitignore` conflict (both sides added `telemetry/`), resolved by keeping the commented version. Dual-folder sync verified 0 differences on all four site pairs after merge.

---

## Part 1 — What shipped this session (done, pushed)

Triggered by a forwarded **AI Pact Secretariat** note: EU AI Act **Article 50 transparency obligations became enforceable 2 August 2026**.

1. **Article 50 marking audit** of all public sites → `docs/field-notes/2026-07-31-article-50-transparency-marking-audit.md` (v1.1, full six-step Learning Standard record).
2. **Vulnerability Disclosure Policy** — `dws10.com/compliance/vulnerability-disclosure-policy/` (+ mirror), adapted from the European Commission's public VDP with EC-institution-specific legal references dropped as inapplicable to a private company. Cross-linked from `.well-known/security.txt` (`Policy:` field repointed), `legal/index.html` §10, `compliance/trust-center/index.html`, and the Compliance Hub nav flyout (4 languages, nav v4.3). Registered in `DWS_SECURITY_STANDARD.md` §20 (v3.4 → 3.5) as the SLA single-source-of-truth.
3. **Two hero videos labeled and live.** Old outdated hero video retired (files kept, de-referenced). HIC-generated replacements wired in with the EU **"AI GENERATED" icon burned into the frames** (bottom-right, throughout) via ffmpeg — chosen over an on-page overlay because Article 50's placement text requires the label to survive download/re-share. Poster frames + VP9/WebM fallbacks generated for both.
   - Homepage: `SCENE_Modern_Nordic_industria_labeled.{mp4,webm}`
   - Investor page: `Investor_Modern_Nordic_in_labeled.{mp4,webm}` (dedicated asset, not a hero reuse)
4. **Learning Standard six steps complete** — KB raw signal, field note, `Learn/` HTML, Drive export, HIC questions, 4 calendar events.

**Container tooling note:** `pandoc` and `apt install ffmpeg` both fail in this container (package-mirror 404s). Workarounds that worked: `pip install imageio-ffmpeg` (ships a static ffmpeg 7.0.2 binary) for all video work; `pip install markdown` for the `Learn/` render; `npm install --no-save playwright` + `executablePath: /opt/pw-browsers/chromium-1194/chrome-linux/chrome` for screenshots. Re-do these in a fresh container.

### Still open from the audit (NOT done)

- **Four AI-persona photos are still unlabeled** (`AI_director.jpg`, `BusinessMentor.jpg`, `SolutionsArchitect.jpg`, `Strategic_advisor.jpg`) — logged as a live Article 50 exposure, enforcement already started. Superseded in priority by the careers decision below (the personas are being retired), but if they stay live in any form they need labels.
- **~114 onelifetime.world blog posts** have no `docs/blog-drafts/*.md` evidence file (predate the 27 Jul gate — a gap in retroactive evidence, not a confirmed violation). Needs HIC recollection.
- Should DWS **sign the Code of Practice on Transparency of AI-generated Content**? Recommended yes, not decided.

---

## Part 2 — THE NEXT SESSION'S JOB: rebuild careers around the Captain system

### The decision (HIC, this session)

> "We need to build careers fully around captains theme… personas who bring their industry knowledge and cash and desire make dws industry standard. We do not need current AI Careers. They are empty promise… Captains paid roles, deputy captains hired or partnership roles."

Boardy's framing, adopted: **"Stop selling generic 'AI careers.' Build careers around industrial authority."** The careers rebuild is _an industrial authority and earnings system, not an AI jobs page._

**Boardy's hard rule — the structural test every role must pass:**

> Every role needs **a named industry, a concrete capability, decision rights, and an economic path.** Otherwise "Captain" becomes branding and "Deputy Captain" becomes unpaid ambition.

### Three HIC decisions made (via AskUserQuestion, confirmed by Boardy audit)

| #   | Decision                                            | Detail                                                                                                                                                                                                                                                                                                   |
| --- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Captain model: carry-bearing**                    | Contractual share of collected revenue / account economics from named industrial accounts they originate and materially advance. **Attribution, payment trigger, term, and margin rules must be explicit. No vague equity promise, no guaranteed payback.** Supersedes LD-2026-014's no-carry structure. |
| 2   | **Deputy Captains: capability-named, per industry** | Each role owns a concrete industrial AI motion (deployment, compliance, sales, implementation, architecture, safety, domain ops) **with defined decision rights and compensation**.                                                                                                                      |
| 3   | **Fleet VIP roles: remove**                         | Fleet Field Engineer and Fleet Driver (Uber/Taksi/Kela) come off the careers page entirely — "they belong to the operating fleet, not the Captain career system."                                                                                                                                        |

The **Dayna Blackwell** structure is the only carry model pressure-tested against a real person and is the natural template for #1: €50K in → **15%** of net cash collected until repaid → **7.5%** taper for 12 months → ends. Guardrails already drafted there (named-account attribution agreed before outreach, payment only after customer cash clears, net of VAT/pass-through, no share on deals not materially advanced, no guaranteed payback) map 1:1 onto Boardy's "explicit rules" requirement. **Note:** that deal is `DO NOT SEND` / unsigned, is EUR-denominated pending a US rework, and was explicitly never adopted as the standard for all 9 seats — treat as template, not precedent.

### ⚠️ BLOCKER — five conflicting Captain economics are live simultaneously

Nothing should publish until one wins. Decision #1 above sets the _direction_ (carry-bearing) but not the _figures_.

| Source                                                                | Structure                                                                                                                    |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `docs/LOCKED_DECISIONS.md` **LD-2026-014** (canonical, locked 31 Jul) | €200k Admiral (1) / €50k × 9 Captains / €5k Deputy — **no carry**                                                            |
| **Live** `dws10.com/captain/` + `/fleet-admiral/`                     | €250k Admiral / €50k × **30 industries, 5 clusters** / €5k — **5% lifetime carry**, +2% Admiral override, CEO Council ladder |
| `investor-outreach/captain-deck.md` v1.4                              | Captain is a **client position**, "not an investor seat," terms **TBD**, zero equity                                         |
| `docs/Investor/DWS_LIQUIDITY_ENGINE_v1.md`                            | €250k Admiral / €25k Deputy                                                                                                  |
| Dayna deal (real, unsigned)                                           | €50k in → 15% → 7.5% taper → ends                                                                                            |

Plus `dws10.com/investor-relations/` _is_ reconciled to LD-2026-014, so fixing the careers page without touching `/captain/` and `/fleet-admiral/` would create a sixth version.

**Supersession process** (`LOCKED_DECISIONS.md`, and the ad-hoc convention LD-2026-014 itself introduced): requires **(a) Risto approval, (b) legal review of existing SAFEs, (c) a new sequential `LD-2026-0NN` entry, (d) leave the superseded entry's body text untouched and change only its Status to `SUPERSEDED by LD-2026-0NN`.** The doc's own "Adding New Locked Decisions" section does not yet formalize the supersede convention — worth formalizing while you're in there.

### Current state of the careers page (what you're replacing)

**Canonical:** `onelifetime.world/careers/index.html` (+ byte-identical `landing-pages/onelifetime-world/` mirror). `dws10.com/careers/index.html` is a pure JS redirect stub to it — leave as redirect.

- **There is no section literally titled "AI Careers."** The "empty promise" is the _vague AI-adjacent phrasing on otherwise generic listings_ — e.g. Senior Full-Stack Engineer: _"Experience with AI agent systems or multi-agent architectures strongly preferred."_
- Current listings on a hiring timeline: **FLEET VIP** (Fleet Field Engineer, Fleet Driver — _both to be removed_), **Q2 2026** (Head of Sales/BD, Senior Full-Stack Engineer), **Q3 2026** (Customer Success Lead, Compliance Domain Specialist), **Q4 2026** (CTO/Co-Founder — equity, co-founder role). All apply via `mailto:risto@lifetime.fi` or WhatsApp. **No euro figures anywhere on the page.**
- A **Captain seats section was added to this page on `main` yesterday** (commit `73de384`) — three cards, but **all three typed "Partner / Investment seat," none a paid role**, terms "shared directly on inquiry," no named industries, no capabilities, no decision rights. Deputy Captain currently reads: _"platform credit and standing in the Captain community, for people building toward a larger seat over time."_ **That is verbatim the "unpaid ambition" failure mode Boardy warned about** — it is the single clearest thing the rebuild must fix.
- `DWS_ROLES_REGISTRY.md` is **silent** on Captain/Deputy/Fleet Admiral (it governs customer-side buyer personas only) — no conflict, but also no support. Registering the new roles there is a candidate follow-up.

### Also being retired: the four AI-agent personas

Homepage "Our Team" presents Rocky (AI Director), Adrian (Business Mentor), Marcus (Solutions Architect), Sofia (Strategic Advisor) as AI agents with dedicated `@lifetime.fi` aliases. Findings:

- **Only Rocky maps to a real distinct system** (`/plan-ceo-review` workflow, `kb/raw/articles/team-agent-rocky-ceo.md`). **Adrian, Marcus, and Sofia have no defining workflow anywhere in the repo** — labels on the same assistant.
- Photos are AI-generated (watermarked) but **mismatched to role** — "Marcus, Solutions Architect" is depicted as a woman gardening; "Rocky, AI Director" is two people at a waterfront meeting.
- HIC's position: _"We do not need current AI Careers. They are empty promise."_ Persona-video prompts were drafted this session but **deliberately not generated** — producing four more polished fictional-colleague videos cuts against the credibility this rebuild is meant to establish.

**No signed Captain exists.** All seats open, nobody named. There are also **zero real customer testimonials** on `dws10.com/testimonials/` (its one "review" is a self-published Grok analysis), and a flagged prior incident (`docs/sales/CAPTAIN_MADONNA_FUNNEL.md`) where a Captain-adjacent inbound was _"almost certainly an impersonation playbook"_ — build vetting into any recruitment push.

### Suggested next-session sequence

1. **Resolve the figures blocker first** — get Risto to pick canonical Captain/Deputy/Admiral economics (carry % , payback trigger, term, attribution rules, seat count: 9 vs 30 industries), then write the new `LD-2026-0NN` entry and mark LD-2026-014 `SUPERSEDED`. Nothing publishes before this.
2. Reconcile the **five** sources above — including the live `/captain/` and `/fleet-admiral/` pages — so no sixth version is created.
3. Rebuild `onelifetime.world/careers/index.html`: remove Fleet VIP roles, convert remaining openings to **Deputy Captain — {Industry}, {Capability}** with decision rights + compensation stated, and make the Captain seat a **paid, carry-bearing role** rather than a "Partner / Investment seat."
4. Sync `landing-pages/onelifetime-world/` byte-identical in the same commit (Dual Folder Sync rule).
5. Decide the fate of the homepage "Our Team" AI personas (retire / relabel / replace with real Captains) — and if any stay live, **label the four photos** for Article 50.
6. Consider registering Captain/Deputy Captain in `DWS_ROLES_REGISTRY.md`.

### Deferred, unrelated (from earlier in this session)

Sales-video priority ranking (researched, grounded in `products.json` + homepage CTAs + page-size/git-activity): **1** dwsiq.html · **2** aegis.html (17 commits, most-iterated page in repo) · **3** situation-room.html · **4** edge-node-gn100.html · **5** dgx-spark.html · **6** bundle.html (featured but only 88 lines — video could carry weight the copy lacks) · **7** sovereignty-cloud-consulting.html · **8** climate-intelligence.html · **9** ai-consulting.html · **10** igx-orin.html. HIC wants **2 videos per product page → repurposed for social**; Gemini Omni caps at **10 seconds per video**. Caveat: no signed customer proof exists yet, so plan founder/product-demo led, not testimonial-led.
