# Blog Standard — OneLifetime.World

---

# VERSION AND AGENT HISTORY

Version: 2.7

Sessions & Modifications:

- Version: 2.7 | Tool: Claude Code (claude-opus-5) | Session: claude/ollama-orchestration-merge-047pj7 | Date: 27.07.2026 | Changes: **Made HIC review of blog text an absolute requirement (§3.3, new).** The HIC had asked many times to review blog entries as a copy-paste block before publication and it kept not happening — sessions published with nothing shown, drafted posts that were never published, or surfaced an audit summary instead of the words. Now a precondition, not a courtesy: `.claude/hooks/blog-draft-gate.sh` (PreToolUse, Edit|Write) blocks writes to `*/posts/*.html` unless `docs/blog-drafts/<slug>.md` exists and reads `Status: APPROVED`; `/blog-draft` is the loop (full text → ONE fenced code block → stop and ask → revise → explicit approval → publish); `session-stop.sh` back-stops by flagging published posts with no approved draft **and** drafts parked in `Status: DRAFT`. Escalated to **CLAUDE.md Non-Negotiable Rule 13** and mirrored to `GEMINI.md`, `.claude/hooks/session-start.sh` (surfaced every session), `/lsj-publish`, `scripts/weekly/lsj-publish-draft.sh` (cron drafts, never publishes), the hooks README and `docs/DWS_SKILLS_GUIDE.md` §6.5. Also registered §3.2.1 (mandatory AI-content label on machine-translated variants, EU AI Act Art. 50(4)) and §3.2 (multi-language convention). Limits stated rather than implied: a hook cannot verify a human read anything; generators and cron bypass it; hooks arm at session start, so the gate is inert in the session that adds it.
- Version: 2.6 | Tool: Claude Code | Session: claude/eda-dws-iq-business-case-jm7p3g | Date: 17.07.2026 | Changes: Registered post #42 (`ai-supercomputing-meets-eda-sovereign-design.html`) — NVIDIA partner note extending the "sovereign edge is still a box" DGX Spark series (#32/#33/#34/#41) to Electronic Design Automation. Written to the §12.5 partner-note sub-voice (gift → turn → honest limit → short version): NVIDIA's "AI Supercomputing Meets EDA — from tools to agents" thesis (Timothy Costa) as the gift; the honest limit that RTL/netlists/foundry PDKs cannot leave the design perimeter (NDA + export control), so agentic EDA only ships on a customer-owned box. Companion to `docs/DGX_SPARK_4X_EDA_BUSINESS_CASE.md`. Added to §3 registry, the `latestPosts` array in `blog/index.html` (new Text of the Day), and the `posts` array in `scripts/inject-blog-nav.cjs`. Ran the injector; reverted its unrelated re-stamp of 26 older posts' product-card copy to keep the change scoped to the new post and its prev-neighbour's (#41 Halos) nav link. Dual-folder synced to `landing-pages/onelifetime-world/`. Byline uses the correct "Risto Anton Päärni" umlaut spelling per CLAUDE.md Sender Identity (older posts carry the ASCII "Paarni" bug).
- Version: 2.5 | Tool: Claude Code (claude-sonnet-5) | Session: claude/nvidia-halos-robotics-suqayg | Date: 10.07.2026 | Changes: Registered post #41 (`nvidia-halos-robotics-physical-ai-safety.html`) — NVIDIA partner note on Halos for Robotics (the physical-AI functional-safety system, not a new model), written to the §12.5 partner-note sub-voice (gift → turn → honest limit → short version). Companion to the regulatory-radar brief `docs/regulatory-radar/NVIDIA_HALOS_ROBOTICS_BRIEF.md` and `DWS_TRUTH_STANDARD.md` §2 row 28 (row 27 was subsequently taken by "Sovereign Industrial Intelligence Outcomes" on main). Added to §3 registry, the `latestPosts` array in `blog/index.html` (new Text of the Day), and the `posts` array in `scripts/inject-blog-nav.cjs`. Ran the injector; reverted its unrelated re-stamp of 26 older posts' product-card copy to keep the change scoped to the new post and its immediate prev-neighbour's nav link. Dual-folder synced to `landing-pages/onelifetime-world/`.
- Version: 2.4 | Tool: Claude Code (Fable 5) | Session: claude/ai-sovereignty-research-9eshgd (merge-integrated) | Date: 07.07.2026 | Changes: Merge-integrated posts #39 (`the-moats-we-hand-you.html`) and #40 (`the-moats-we-hand-you.fi.html`) — sovereignty stance post ("sovereignty vs. interdependence" across nineteen places) + FI parity, originally drafted 01.07.2026 as #35/#36. **Fixed a pre-existing corruption**: this file (and its VERSION AND AGENT HISTORY / §3 registry) contained unresolved git conflict markers committed directly to `main`, the result of an earlier unresolved three-way collision between the jetson-thor (#34), industrial-intelligence-weekly, brexit-interdependence (#35/#36), and tiedon-vanheneminen (#37) post registrations. Reconciled the true post order from the live, uncorrupted `scripts/inject-blog-nav.cjs` `posts` array: 34=`nvidia-jetson-thor-physical-ai.html`, 35=`industrial-intelligence-weekly-2026-06-28.html`, 36=`brexit-interdependence-moat-us-eu.html`, 37=`brexit-interdependence-moat-us-eu.fi.html`, 38=`tiedon-vanheneminen-sensoridata-retention.html`, 39/40=this session's posts. Companion artefact: `docs/field-notes/2026-07-01-ai-sovereignty-nine-theses.md`; PhD §14.39 / KC#46. Prior entries below retain their own point-in-time post numbers as originally written.
- Version: 2.3 | Tool: Claude Code | Session: claude/lifetime-handbook-web-updates-lmyi2g | Date: 01.07.2026 | Changes: Registered post `tiedon-vanheneminen-sensoridata-retention.html` (#38 per the v2.4 renumbering above) — FI field note on unstructured-data decay and the four-layer sensor-data retention model for Control Room / Situation Room. Companion field note: `docs/field-notes/2026-07-01-tiedon-vanheneminen-sensoridata-retention-control-room.md`. Added to §3 registry, `latestPosts` array in `blog/index.html` (new Text of the Day), and `posts` array in `scripts/inject-blog-nav.cjs`. Ran the injector. Dual-folder synced to `landing-pages/onelifetime-world/`. (Merged with the brexit session; renumbered from #35 to #37 at the time — see v2.4 for the final numbering.)
- Version: 2.2 | Tool: Claude Code | Session: claude/brexit-us-eu-interdependence-m6si45 | Date: 30.06.2026 | Changes: Registered FI parity post `brexit-interdependence-moat-us-eu.fi.html` (#37 per the v2.4 renumbering above) — Finnish companion to the brexit post, with `hreflang` alternates both ways (en/fi + sv/de/fr/x-default → EN fallback), vertical lang bar, same cyan/gold callout design. Added EN↔FI `hreflang` + lang bar to the brexit post. Added a "Even China is on the axis" section to BOTH posts in lockstep (China cannot cheaply exit interdependence either — autarky and a parallel bloc are both just costlier dependence; the democratic edge is rules-based, chosen connection, not connection itself). Inserted in §3 registry and the `latestPosts` array in `blog/index.html` (chronological — not Text of the Day), and the `posts` array in `scripts/inject-blog-nav.cjs`. Ran the injector. Dual-folder synced to `landing-pages/onelifetime-world/`.
- Version: 2.1 | Tool: Claude Code | Session: claude/brexit-us-eu-interdependence-m6si45 | Date: 30.06.2026 | Changes: Registered post `brexit-interdependence-moat-us-eu.html` (#36 per the v2.4 renumbering above) — sovereignty essay arguing Brexit's sovereignty goal was partly right but its ~4–6% GDP operational cost was too high, so interdependence (not exit) is the moat for the US + EU. Written to §12 house voice; DWS connection kept implicit. Weaves three editorial angles: fork-the-stack vs own-the-governance-layer parallel, the economic (not political) coalition with Switzerland/Singapore/Nordics as winners, and the asymmetric-cost lesson (sovereignty without interdependence = negative ROI). Added to §3 registry, the `latestPosts` array in `blog/index.html`, and the `posts` array in `scripts/inject-blog-nav.cjs`. Ran the injector. Dual-folder synced to `landing-pages/onelifetime-world/`.
- Version: 2.0 | Tool: Claude Code | Session: claude/deepseek-v4-flash-hybrid-0niopt | Date: 27.06.2026 | Changes: Drafted community field note `deepseek-v4-flash-hybrid-inference_DRAFT.html` by Yannick Nick (@keennay) on DeepSeek V4 Flash running at native FP4+FP8 precision on 2x RTX Pro 6000 + 256 GB DDR5 via KTransformers hybrid GPU/CPU inference. First community-authored post; author/editor attribution split in meta, JSON-LD, byline, and signature. Left as `_DRAFT.html`, not registered in §3 registry, `latestPosts`, or `scripts/inject-blog-nav.cjs` `posts` (publication pending). Field note companion: `docs/field-notes/2026-06-27-deepseek-v4-flash-hybrid-gpu-cpu-inference.md`.
- Version: 1.10 | Tool: Claude Code | Session: claude/jetson-thor-physical-ai-91mjtv | Date: 26.06.2026 | Changes: Registered post #34 (`nvidia-jetson-thor-physical-ai.html`) — NVIDIA partner note on Jetson Thor and physical AI, written to the §12.5 partner-note sub-voice (gift → turn → honest limit → short version). Continues the "sovereign edge is still a box" series from #32/#33: Thor is that box, made concrete; NVIDIA owns the body (Blackwell silicon + on-device hardware root of trust), DWS owns the leash/log/human-in-loop governance layer. Added to §3 registry, the `latestPosts` array in `blog/index.html` (new Text of the Day), and the `posts` array in `scripts/inject-blog-nav.cjs`. Ran the injector. Dual-folder synced to `landing-pages/onelifetime-world/`.
- Version: 1.9 | Tool: Claude Code | Session: claude/nvidia-vera-rubin-card-be8g7t | Date: 25.06.2026 | Changes: Registered post #33 (`eu-sovereign-ai-factories-35-supercomputers.html`) — sovereignty field note on NVIDIA's June 2026 European AI-supercomputer buildout (35 systems / 23 countries / ~800 AI exaflops / EuroHPC AI Factories), framing the EU-sovereign upstream vs the customer-owned edge. Added to §3 registry, the `latestPosts` array in `blog/index.html` (new Text of the Day), and the `posts` array in `scripts/inject-blog-nav.cjs`. Ran the injector. Dual-folder synced to `landing-pages/onelifetime-world/`.
- Version: 1.8 | Tool: Claude Code | Session: claude/nvidia-vera-rubin-card-be8g7t | Date: 24.06.2026 | Changes: Registered post #32 (`nvidia-vera-rubin-ai-factory.html`) — NVIDIA partner note on Vera Rubin and the POD-scale AI factory, written to the §12.5 partner-note sub-voice (gift → turn → honest limit → short version). Added to §3 registry, the `latestPosts` array in `blog/index.html` (new Text of the Day), and the `posts` array in `scripts/inject-blog-nav.cjs`. Ran the injector for prev/next + share + product cards. Dual-folder synced to `landing-pages/onelifetime-world/`.
- Version: 1.7 | Tool: Claude Code | Session: claude/dws-iq6-social-thread-17d8ie | Date: 23.06.2026 | Changes: Registered FI parity posts #30 (`lifetime-world-model-three-piece-loop.fi.html`) and #31 (`four-learning-paradigms-world-model.fi.html`) — Finnish companions to #28/#29, keeping EN/FI lockstep for public copy. Added `hreflang` alternates both ways across all four files (en/fi + sv/de/fr/x-default → EN fallback). Inserted in §3 registry, the `latestPosts` array in `blog/index.html` (chronological — EN #29 stays Text of the Day, not the FI posts), and the `posts` array in `scripts/inject-blog-nav.cjs`. Code samples kept in English inside `<pre class="code-block">`. Dual-folder synced to `landing-pages/onelifetime-world/`.
- Version: 1.6 | Tool: Claude Code | Session: claude/dws-iq6-social-thread-17d8ie | Date: 23.06.2026 | Changes: Registered posts #28 (`lifetime-world-model-three-piece-loop.html`) and #29 (`four-learning-paradigms-world-model.html`) — the Lifetime World Model V1 launch pair (vision/architecture framing, third parties named as technology archetypes only, embedded reference code from `src/agents/world-model/`). Added both to §3 Post Registry, the `latestPosts` array in `blog/index.html` (Text of the Day → newest), and the `posts` array in `scripts/inject-blog-nav.cjs`. Dual-folder synced to `landing-pages/onelifetime-world/`.
- Version: 1.5 | Tool: Claude Code (claude-opus-4-8) | Session: claude/queued-followups-fi-artifacts-93kxqr | Date: 21.06.2026 | Changes: Registered FI parity post #23 (`your-model-cant-beat-your-noise-floor.fi.html`) — Finnish companion to the noise-floor post #22, with `hreflang` alternates both ways, vertical 5-language bar, ironclad footer, and product cards. Inserted chronologically (15 Jun 2026 slot, not Text of the Day) in §3 Post Registry and renumbered #24–#27; also registered in `blog/index.html` `latestPosts` and `scripts/inject-blog-nav.cjs` `posts`. Dual-folder synced to `landing-pages/onelifetime-world/`.
- Version: 1.4 | Tool: Claude Code (Sonnet 4.6) | Session: claude/blog-polls-ads-features-spdD1 | Date: 07.05.2026 | Changes: Blog V2 — added §13 Reader Polls (lsj-poll.js, localStorage persistence, seed counts), §14 Ads & Sponsorship Slots (lsj-ads.js, lsj-ads-config.json, three slot types, rate card). Added advertise/index.html (media enquiries + sponsorship price list). Registered posts #18 (eu-policy-backed-capital-bankable-sovereignty). Updated ToC to include §13–14.
- Version: 1.3 | Tool: Claude Code (Opus 4.7) | Session: claude/redhat-sovereignty-research-YGHtL | Date: 23.04.2026 | Changes: Added §12 Editor-in-Chief Voice (Seth Godin House Style) — house voice standard for all Lifetime Scope Journal posts. Codifies short paragraphs, verb-first sentences, partner-note sub-voice (gift → turn → honest limit), banned/kept words, and the pre-publish voice checklist. Reference exemplars: redhat-sovereign-move-three-tiers.html, mcp-apps-identity-spine.html, solid-layers-aiven-scaleway-kya.html, validated-mock-data-principle.html. Registered post #14 (redhat-sovereign-move-three-tiers).
- Version: 1.2 | Tool: Claude Code (Opus 4.7) | Session: claude/kya-verification-setup-QKFtu | Date: 22.04.2026 | Changes: Added §3.1 Text of the Day Rule — latest blog post is automatically the Text of the Day on /blog/ index via hero card + paginated Latest Posts list (5 per page, Prev/Next). Registered posts #12 (solid-layers-aiven-scaleway-kya) and #13 (mcp-apps-identity-spine).
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/liquidity-engine-guide-P6sVY | Date: 28.03.2026 | Changes: Added social share section (LinkedIn, X, Email, Copy Link), registered in CLAUDE.md standards table
- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/liquidity-engine-guide-P6sVY | Date: 28.03.2026 | Changes: Initial creation — blog post standard for onelifetime.world/posts, covering structure, nav injection, product cards, dual-folder sync, and post registry

Session Links & References:

- Claude Code (claude/liquidity-engine-guide-P6sVY): https://github.com/blogtheristo/dws6

Document Status:

- Created: 28.03.2026
- Last Modified: 10.07.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

---

**Version:** 1.2
**Effective Date:** 2026-03-28
**Last Updated:** 2026-04-22
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [File Locations](#2-file-locations)
3. [Post Registry](#3-post-registry)
4. [HTML Template Structure](#4-html-template-structure)
5. [Required Meta Tags](#5-required-meta-tags)
6. [Footer Navigation (Prev/Next)](#6-footer-navigation-prevnext)
7. [Product Cards](#7-product-cards)
8. [Injection Script](#8-injection-script)
9. [Checklist for Every New Post](#9-checklist-for-every-new-post)
10. [Social Share Section](#10-social-share-section)
11. [Style Tokens](#11-style-tokens)
12. [Editor-in-Chief Voice (Seth Godin House Style)](#12-editor-in-chief-voice-seth-godin-house-style)
13. [Reader Polls](#13-reader-polls)
14. [Ads & Sponsorship Slots](#14-ads--sponsorship-slots)

---

## 1. Overview

> ## ⛔ Before anything else: the HIC reads the post first
>
> **No blog entry is published until the HIC has read its full text and approved it.** Absolute, no
> exceptions — every language, every site, translations, LSJ issues and cron-drafted posts included.
> Run **`/blog-draft`**: write the whole text to `docs/blog-drafts/<slug>.md`, show the HIC **one
> fenced code block**, then **stop and ask in that turn**. Publish only after an explicit approval
> about that post sets `Status: APPROVED`.
>
> **Full rules: §3.3.** Canonical: CLAUDE.md **Non-Negotiable Rule 13**. Everything below this line
> is how to build a post that has already been approved.

All blog posts for OneLifetime.World live as **HTML files** (never `.md`) in `onelifetime.world/posts/`. Each post MUST be synced to `landing-pages/onelifetime-world/posts/` in the same commit (dual-folder rule from CLAUDE.md).

Every post gets:

- Prev/Next navigation linking to chronological neighbours
- Three product cards linking to the DWS10 store
- Consistent nav, footer, and meta tags

---

## 2. File Locations

| Purpose              | Path                                                |
| -------------------- | --------------------------------------------------- |
| Source of truth      | `onelifetime.world/posts/<slug>.html`               |
| Production copy      | `landing-pages/onelifetime-world/posts/<slug>.html` |
| EN template          | `onelifetime.world/posts/_template-en.html`         |
| FI template          | `onelifetime.world/posts/_template-fi.html`         |
| EN posts             | `onelifetime.world/posts/en/<slug>.html`            |
| FI posts             | `onelifetime.world/posts/fi/<slug>.html`            |
| SV posts             | `onelifetime.world/posts/sv/<slug>.html`            |
| DE posts             | `onelifetime.world/posts/de/<slug>.html`            |
| FR posts             | `onelifetime.world/posts/fr/<slug>.html`            |
| Nav injection script | `scripts/inject-blog-nav.cjs`                       |

### Language Standard (5 Languages)

Blog posts support **5 languages** matching the `dws10.com` language standard defined in `shared-assets/nav/ironclad-nav.js`:

| Code | Language | Label    | Post Subfolder |
| ---- | -------- | -------- | -------------- |
| `en` | English  | English  | `posts/en/`    |
| `fi` | Finnish  | Suomeksi | `posts/fi/`    |
| `sv` | Swedish  | Svenska  | `posts/sv/`    |
| `de` | German   | Deutsch  | `posts/de/`    |
| `fr` | French   | Français | `posts/fr/`    |

The language bar (`shared-assets/lang-bar.js`, v1.1+) auto-injects all 5 buttons and navigates via `hreflang` tags. Every multilingual post MUST declare all 5 `<link rel="alternate" hreflang="...">` tags in `<head>` pointing to its counterpart versions. If a translation is not yet published, point the `hreflang` to the English version as fallback and mark the status in the post registry.

---

## 3. Post Registry (Root-Level)

Chronological order. Update this table when adding/removing posts.

| #   | File                                                     | Title                                                                                                                                                                    | Date        |
| --- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| 1   | `business-case-logistics.html`                           | Business Case: The Intelligent Fleet Pilot                                                                                                                               | Dec 2025    |
| 2   | `kya-standard-v1.html`                                   | Field Note: KYA Standard for Autonomous Control Rooms                                                                                                                    | Mar 2026    |
| 3   | `eu-regulation-harness-engineering.html`                 | EU Regulation Makes Better AI                                                                                                                                            | 14 Mar 2026 |
| 4   | `eu-ai-act-compliance-ready.html`                        | EU AI Act: Compliance Ready                                                                                                                                              | 15 Mar 2026 |
| 5   | `buyers-note-harness-engineering.html`                   | Buyer's Note: Harness Engineering                                                                                                                                        | 15 Mar 2026 |
| 6   | `harness-engineering-investor-note.html`                 | Investor Note: Harness Engineering                                                                                                                                       | 15 Mar 2026 |
| 7   | `nvidia-gtc-2026-dws-roadmap-impact.html`                | NVIDIA GTC 2026: Industrial AI Roadmaps                                                                                                                                  | 16 Mar 2026 |
| 8   | `validated-mock-data-principle.html`                     | The Validated Mock Data Principle                                                                                                                                        | 16 Mar 2026 |
| 9   | `closing-the-bom-gap-cad-erp-sync.html`                  | Closing the BOM Gap: CAD-ERP Sync                                                                                                                                        | 26 Mar 2026 |
| 10  | `liquidity-engine-captain-seats.html`                    | The Liquidity Engine: Captain Seats                                                                                                                                      | 28 Mar 2026 |
| 11  | `core-resilience-hybrid-threats.html`                    | CORE: The EU Model That Maps Every Hybrid Threat                                                                                                                         | 16 Apr 2026 |
| 12  | `solid-layers-aiven-scaleway-kya.html`                   | Our Layers Are Solid — Aiven, Scaleway, KYA + Foundry                                                                                                                    | 22 Apr 2026 |
| 13  | `mcp-apps-identity-spine.html`                           | MCP Apps Extends the Frontier — KYA Identity Spine                                                                                                                       | 22 Apr 2026 |
| 14  | `redhat-sovereign-move-three-tiers.html`                 | Red Hat's EU Sovereign Move — and the Three Tiers                                                                                                                        | 23 Apr 2026 |
| 15  | `fpe-dark-mode-construction-wedge.html`                  | FPE · The Construction Wedge — €14,999 to Reduce Weakest-Link Failure                                                                                                    | 27 Apr 2026 |
| 16  | `dws-ontology-standard-v1.html`                          | DWS Ontology Standard v1.3 — Etymology, Philosophy, and the Decision-Centric Pillars                                                                                     | 29 Apr 2026 |
| 17  | `baseten-inference-engineering-300m.html`                | Field Note: Baseten Raises $300M — Inference Engineering Is a Discipline Now                                                                                             | 7 May 2026  |
| 18  | `eu-policy-backed-capital-bankable-sovereignty.html`     | The Strike Price State — Five Things Europe Just Made Official                                                                                                           | 7 May 2026  |
| 19  | `fire-brigades-drone-defense-units.html`                 | Fire Brigades as Drone Defence Units — Three Reasons to Build the Network Now (EN/FI/SV)                                                                                 | 15 May 2026 |
| 20  | `moat-is-not-the-model.html`                             | The Moat Is Not the Model — NVIDIA Makes It Possible, EU-Sovereign Deployment Makes It Defensible                                                                        | 17 May 2026 |
| 21  | `point-it-at-the-ontology.html`                          | Don't Point the LLM at the Data — Point It at the Ontology (5 industries)                                                                                                | 5 Jun 2026  |
| 22  | `your-model-cant-beat-your-noise-floor.html`             | Your Model Can't Beat Your Noise Floor — Evaluation, Clean Labels, the Shannon Bound (EN, Ontology Series)                                                               | 15 Jun 2026 |
| 23  | `your-model-cant-beat-your-noise-floor.fi.html`          | Mallisi ei voita kohinatasoasi — arviointi, puhtaat nimiöt, Shannon-raja (FI, Ontology Series)                                                                           | 15 Jun 2026 |
| 24  | `four-capital-classes.html`                              | Prompt, People, Plant, Perception — The Four Capital Classes of the Agentic Era (Ontology Series)                                                                        | 19 Jun 2026 |
| 25  | `software-vs-world-model.html`                           | Software You Operate vs Intelligence That Operates — SaaS and the World Model (Ontology Series)                                                                          | 20 Jun 2026 |
| 26  | `ontologia-tiimin-aivoissa.html`                         | Ontologia elää tiimin aivoissa — Kaukopää, tacit ontology, and the governed world model (FI, Ontology Series)                                                            | 20 Jun 2026 |
| 27  | `the-ontology-lives-in-the-team.html`                    | The Ontology Lives in the Team — Kaukopää case, three layers of industrial tacit knowledge, cynical wedge (EN, Ontology Series)                                          | 20 Jun 2026 |
| 28  | `lifetime-world-model-three-piece-loop.html`             | The Three-Piece Loop — Lifetime World Model V1 for Control Rooms (EN, vision/architecture, with reference code)                                                          | 23 Jun 2026 |
| 29  | `four-learning-paradigms-world-model.html`               | The Four Learning Paradigms Behind a World Model — RL, reward learning, supervised/generative, self-supervised (EN)                                                      | 23 Jun 2026 |
| 30  | `lifetime-world-model-three-piece-loop.fi.html`          | Kolmiosainen silmukka valvomoille — Lifetime World Model V1 (FI parity of #28)                                                                                           | 23 Jun 2026 |
| 31  | `four-learning-paradigms-world-model.fi.html`            | Maailmanmallin neljä oppimisparadigmaa (FI parity of #29)                                                                                                                | 23 Jun 2026 |
| 32  | `nvidia-vera-rubin-ai-factory.html`                      | NVIDIA Vera Rubin — The AI Factory Grows Up. The Sovereign Edge Is Still a Box. (EN, NVIDIA partner note)                                                                | 24 Jun 2026 |
| 33  | `eu-sovereign-ai-factories-35-supercomputers.html`       | Europe's AI Factory Came Home — 35 Supercomputers, and Why the Edge Still Needs a Box (EN, sovereignty field note)                                                       | 25 Jun 2026 |
| 34  | `nvidia-jetson-thor-physical-ai.html`                    | NVIDIA Jetson Thor — The Supercomputer Moves Onto the Robot. The Governance Sits Beside It. (EN, NVIDIA partner note)                                                    | 26 Jun 2026 |
| 35  | `industrial-intelligence-weekly-2026-06-28.html`         | Industrial Intelligence Weekly — Five Signals from the Regulated Economy (EN, market intelligence newsletter)                                                            | 28 Jun 2026 |
| 36  | `brexit-interdependence-moat-us-eu.html`                 | Sovereignty Is a Setting, Not a Switch — What the US and EU Can Learn from Brexit (EN, sovereignty essay)                                                                | 30 Jun 2026 |
| 37  | `brexit-interdependence-moat-us-eu.fi.html`              | Suvereniteetti on säädin, ei kytkin — mitä USA ja EU voivat oppia brexitistä (FI parity of #36)                                                                          | 30 Jun 2026 |
| 38  | `tiedon-vanheneminen-sensoridata-retention.html`         | Tiedon vanheneminen — sensoridatan tallennusstrategia Control Roomissa ja Situation Roomissa (FI, field note, data governance)                                           | 1 Jul 2026  |
| 39  | `the-moats-we-hand-you.html`                             | The Moats Are Yours, Not Ours — Sovereignty vs. Interdependence, in Nineteen Places (EN, sovereignty stance)                                                             | 1 Jul 2026  |
| 40  | `the-moats-we-hand-you.fi.html`                          | Vallihaudat ovat sinun, eivät meidän — suvereniteetti vs. keskinäisriippuvuus (FI parity of #39)                                                                         | 1 Jul 2026  |
| 41  | `nvidia-halos-robotics-physical-ai-safety.html`          | NVIDIA Halos for Robotics — The Robot Gets Certified. The Evidence Still Has to Keep Talking. (EN, NVIDIA partner note)                                                  | 10 Jul 2026 |
| 42  | `ai-supercomputing-meets-eda-sovereign-design.html`      | AI Supercomputing Meets EDA — The Design Agents Arrive. The IP Stays in the Building. (EN, NVIDIA partner note / DGX Spark series)                                       | 17 Jul 2026 |
| 43  | `ala-treenaa-base-mallia-omista-evidenssikerros.html`    | Älä treenaa base-mallia, omista evidenssikerros — adoptoi avoin sovereign-komponentti, investoi omistettuun evidenssisilmukkaan; NVIDIA-supply-riski nimettynä (FI)      | 26 Jul 2026 |
| 44  | `dont-train-a-base-model-own-the-evidence-layer.html`    | Don't train a base model. Own the evidence layer. (EN parity of #43 — canonical `x-default`)                                                                             | 26 Jul 2026 |
| 45  | `dont-train-a-base-model-own-the-evidence-layer.sv.html` | Träna inte basmodellen, äg evidenslagret (SV parity of #43)                                                                                                              | 26 Jul 2026 |
| 46  | `dont-train-a-base-model-own-the-evidence-layer.de.html` | Trainieren Sie kein Base-Modell, besitzen Sie die Evidenzschicht (DE parity of #43)                                                                                      | 26 Jul 2026 |
| 47  | `dont-train-a-base-model-own-the-evidence-layer.fr.html` | N'entraînez pas le modèle de base, possédez la couche de preuve (FR parity of #43)                                                                                       | 26 Jul 2026 |
| 48  | `harness-paywall-depth-arbitrage.html`                   | The Harness Paywall — the harness is the durable layer, its token intensity is the paywall, and bounded sovereign compute is the resolution (EN, architecture/economics) | 30 Jul 2026 |
| 49  | `arvonluonnin-ajurit-2026.html`                          | Six Drivers of Value — and the Research Behind Them (EN, canonical `x-default`)                                                                                          | 6 Aug 2026  |
| 50  | `arvonluonnin-ajurit-2026.fi.html`                       | Kuusi arvonluonnin ajuria — ja tutkimus niiden takana (FI parity of #49)                                                                                                 | 6 Aug 2026  |
| 51  | `arvonluonnin-ajurit-2026.sv.html`                       | Värdeskapande drivkrafter — sex huvuddimensioner, och forskningen bakom dem (SV parity of #49)                                                                           | 6 Aug 2026  |
| 52  | `arvonluonnin-ajurit-2026.de.html`                       | Wertschöpfungstreiber — sechs Hauptdimensionen, und die Forschung dahinter (DE parity of #49)                                                                            | 6 Aug 2026  |
| 53  | `arvonluonnin-ajurit-2026.fr.html`                       | Leviers de création de valeur — six dimensions clés, et la recherche qui les sous-tend (FR parity of #49)                                                                | 6 Aug 2026  |
| 54  | `kya-s1-one-signed-page.html`                            | KYA-S1 — One Signed Page for the Agent in Your Vendor File (EN, Standards / Buyer Note)                                                                                  | 6 Aug 2026  |
| 55 | `know-your-agent-kya-s1.html` | Know Your Agent (KYA-S1) — One Signed Page for the AI That Touches Your Data (EN, series 1/11) | 8 Aug 2026  |
| 56 | `know-your-agent-kya-s1.fi.html` | Tunne agenttisi (KYA-S1) — Yksi allekirjoitettu sivu tekoälystä (FI, sarja 1/11) | 8 Aug 2026  |
| 57 | `know-your-agent-kya-s1.sv.html` | Känn din agent (KYA-S1) — En signerad sida om den AI som rör dina data (SV, serie 1/11) | 8 Aug 2026  |
| 58 | `know-your-agent-kya-s1.de.html` | Kenne deinen Agenten (KYA-S1) — Eine unterschriebene Seite über die KI (DE, Serie 1/11) | 8 Aug 2026  |
| 59 | `know-your-agent-kya-s1.fr.html` | Connaissez votre agent (KYA-S1) — Une page signée sur l'IA (FR, série 1/11) | 8 Aug 2026  |
| 60 | `kya-kyc-seven-questions.fi.html` | KYC:n vastine tekoälylle — Seitsemän kriittistä KYA-kysymystä (FI, sarja 2/11) | 8 Aug 2026  |
| 61 | `eu-ai-act-article-14-hic.fi.html` | EU AI Act Artikla 14 (HIC) ja agenttien itsenäisyyden ristiriita (FI, sarja 3/11) | 8 Aug 2026  |
| 62 | `agent-classes-copilot-vs-dws-iq.fi.html` | Agenttiluokat: GitHub Copilot vs. DWS IQ -tausta-agentit (FI, sarja 4/11) | 8 Aug 2026  |
| 63 | `kya-s1-ja-bpmn-2-luottamustaso-ohjaa-prosessia.fi.html` | KYA-S1 ja BPMN 2.0: luottamustaso ohjaa teollisuusprosessia (FI, sarja 5/11) | 8 Aug 2026  |
| 64 | `bpmn-xml-trs-portti-riskiluokka-lease-fail-closed.fi.html` | KYA-S1 v1.3 × BPMN 2.0: Lease Token, fail-closed, TRS-laskenta (FI, sarja 6/11) | 8 Aug 2026  |
| 65 | `flt-72h-virheluokittelu-ja-prv-paatoksen-toistaminen.fi.html` | 72 tunnin virheluokittelu (FLT) ja päätöksen toistaminen (PRV) (FI, sarja 7/11) | 8 Aug 2026  |
| 66 | `kya-s1-ecosystem-roadmap.fi.html` | KYA-S1 Ekosysteemi & Tuotanto-Roadmap (FI, sarja 8/11) | 8 Aug 2026  |
| 67 | `lifetime-world-model-state-register.fi.html` | Lifetime World Model (LWM) — Globaali tilarekisteri ja muisti (FI, sarja 9/11) | 8 Aug 2026  |
| 68 | `agentic-commerce-autonomous-payments.fi.html` | Agentic Commerce -protokollat & Autonomiset Maksut (FI, sarja 10/11) | 8 Aug 2026  |
| 69 | `eudi-wallet-eidas2-human-identity.fi.html` | Yhteys eWallet EU (EUDI Wallet) & eIDAS 2.0 (FI, sarja 11/11) | 8 Aug 2026  |
| 70 | `kya-s1-sanasto-glossary.fi.html` | KYA-S1 Sanasto — KYA (Know Your Agent): Käsitteistö ja sanasto (FI, sarja 12/12) | 9 Aug 2026  |
| 71 | `greg-isenberg-agents-need-a-signature.html` | Greg Isenberg Is Right About Agents. The Hard Part Is a Signature. (EN field note; agent infrastructure, KYA as the shared layer, honest limit: credential mints unsigned). **EN on tämän postauksen ground truth** — käännökset johdetaan EN-versiosta. | 24 Jul 2026 |

---

## 3.1 Text of the Day Rule (CRITICAL)

**The most recent blog post is always the "Text of the Day."**

This is a hard rule, enforced in code on `onelifetime.world/blog/index.html`:

1. The top of the blog index renders a prominent **★ Text of the Day** hero card.
2. The card is wired to `latestPosts[0]` in the page's JavaScript — the first entry of the chronological `latestPosts` array (newest first).
3. The "Latest Posts" box directly below it paginates the full list 5 at a time with Prev / Next controls.
4. When a new post is registered in the `latestPosts` array (and in `scripts/inject-blog-nav.cjs`), the Text of the Day **automatically** points to it — no additional edit needed.

### When adding a new post

1. Prepend the new post to the `latestPosts` array at the top of `onelifetime.world/blog/index.html` (position 0 = newest).
2. Add the same entry at the tail of the `posts` array in `scripts/inject-blog-nav.cjs` (position last = newest, chronological-ascending there).
3. Sync both to `landing-pages/onelifetime-world/blog/index.html` in the same commit (dual folder rule).
4. The hero card and the top of the Latest Posts list update automatically on the next page load.

### Why this rule exists

The blog index previously relied on hand-curated featured cards that drifted out of date within days. The Text of the Day rule guarantees that the freshest writing is always the first thing a visitor sees — it is the homepage of Lifetime Scope Journal, and it should reflect today's thinking, not last month's.

**Do not remove the ToD hero or disable the pagination script.** Both are part of the blog standard from v1.2 onward.

---

## 3.2 Multi-Language Posts (EN / FI / SV / DE / FR)

A post published in more than two languages is **one editorial unit**, not N posts. Post #43–#47
is the reference implementation.

**Generation.** Never hand-write the variants. One language is the master; the others are built by

```powershell
node scripts/i18n/build-i18n-pages.cjs scripts/i18n/<target>.config.json
```

Translation is data (`scripts/i18n/<target>/<lang>-strings.json`, plus `meta.json` for the copy that
lives in HTML attributes — `<title>`, `description`, `og:*`, `twitter:*`, `article:section`,
`aria-label`, and the social `shareTitle`). Translators never touch markup, so they cannot break the
page, and the builder refuses to write when a translation's string count drifts from the master.
The builder is idempotent — re-running it is always safe.

**Slugs.** The master keeps whatever URL it already shipped on (never break a live URL). The other
languages share one English base slug, with `.sv.html` / `.de.html` / `.fr.html` suffixes — the
existing repo convention. All variants carry reciprocal `hreflang` alternates plus `x-default` → EN,
a per-language `canonical`, and a visible language switcher before `</body>`.

**Registration — this deliberately differs from §3.1:**

| Surface                               | What goes in                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------- |
| `latestPosts` (blog index)            | **EN and FI only.** PAGE_SIZE is 5; listing five languages would make page 1 a single post. |
| `scripts/inject-blog-nav.cjs` `posts` | **The master only.**                                                                        |
| §3 Post Registry above                | **Every variant**, each marked `(<LANG> parity of #<master>)`.                              |

Rationale: the prev/next chain is a reading order. A German reader should not be handed an unrelated
English post as "next", and the chain's length must not depend on how many languages a post has. The
translated pages inherit the master's nav block with their own URL and share title substituted in, so
`inject-blog-nav.cjs` skips them and the two tools never fight over the same bytes. SV/DE/FR stay
discoverable through `hreflang`, the language switcher, and the §3 registry.

**Known limitation:** the variants are machine translations built to canonical regulatory terms
(EU AI Act = _asetus_ / _Verordnung_ / _règlement_ — a regulation, never a directive). They have not
had native-speaker or legal review. Record that in the PR, do not imply otherwise.

### 3.2.1 AI-content labelling is mandatory — EU AI Act Article 50(4)

**From 2 August 2026**, AI-generated or machine-translated text published to inform the public on
matters of public interest must be labelled. A blog post on regulation, sovereignty or compliance is
exactly that. Canonical detail: `DWS_TRUTH_STANDARD.md` §2 row 31 / §2G.

Every machine-translated page therefore ships with an `<aside class="ai-notice">` immediately after
`</header>` — before the article body, because the reader must see it on first exposure. It is
generated by the builder from `meta.json` (`aiNoticeLabel` / `aiNoticeBody` / `aiNoticeLink`, per
language) and controlled by `aiNotice.langs` in the target config.

**Two states, and only two:**

| State                 | What the page carries                            | When                                          |
| --------------------- | ------------------------------------------------ | --------------------------------------------- |
| **Minimum (default)** | The AI-content notice                            | Any page no named human has reviewed          |
| **Exemption**         | No notice; a named reviewer credited on the page | Only after the review below actually happened |

**Removing the label from a language is not an editorial preference — it is a legal claim.**

**The regulation's own test** is that the text "did not undergo human review or editorial control
and … editorial responsibility was not assumed by any legal or natural person." So text falls
outside the duty only with **both**: review or editorial control, **and** an accountable person.

**DWS policy is deliberately stricter than that minimum** — the statutory wording does not define
how deep a review must be, and "someone glanced at it" is not a position worth defending. Remove a
label only when all of the following are true, and record it in the PR:

1. A **named person** read that page's text **before publication** (or before the label comes off),
   substantively — accuracy, plausibility, sources — not a skim.
2. That person had, and knew they had, the authority to **amend or reject** it.
3. Their **name and contact details are publicly reachable** from the page.
4. Only then: remove that language from `aiNotice.langs`, credit the reviewer on the page, and
   rebuild.

Steps 1–3 are DWS's own bar, not quoted regulation. Skipping them while removing the label asserts
that the page had review and an accountable owner. Leave the label on — it costs nothing and it is
true.

**The EU Icons are optional; the label is not.** Using an icon does not establish compliance, and no
icon asset is bundled here — the Commission's site blocks automated download, and a hand-drawn
lookalike would misrepresent an official mark. Two things to know if the icon is added later:

- The Commission's **user testing found the icon performs better when paired with a text label**
  than alone, so the icon complements this notice rather than replacing it.
- There are **three icon classes** (Basic / Fully AI-Generated / Partially AI-Modified) and which
  one fits a _machine translation_ is unsettled — the source text is human-written, the target text
  is entirely AI-produced. Decide it with the HIC; do not pick one by feel. See
  `DWS_TRUTH_STANDARD.md` §2G.

---

## 3.3 The Draft Gate — the HIC reads the text before it ships (ABSOLUTE)

> **CLAUDE.md Non-Negotiable Rule 13.** No blog entry is published until the HIC has read its full
> text and approved it. **No exceptions** — any language, any site, any length; translations, LSJ
> issues, community-authored posts, and cron-drafted posts included. There is no "small enough to
> skip", no "they approved something similar", and no "the schedule ran it".

**The rule binds even where the gate does not reach.** `.claude/hooks/blog-draft-gate.sh` catches
hand-authored writes; generators, cron runs, other agent surfaces (`GEMINI.md`) and sessions that
loaded `settings.json` before the hook existed are not covered by it. **A bypass is not permission.**
`session-stop.sh` back-stops by flagging any published post lacking an approved draft — but a
warning after the fact is not the control; the control is asking first.

This is not new policy; it is old policy that kept failing. The HIC asked for blog text as a
copy-paste block many times and it did not happen — sessions published with nothing shown, drafted
posts that were never published, or surfaced an audit summary instead of the words. Every instance
was an agent treating "show the draft" as something to remember. So it is now a precondition.

**The mechanism.** `.claude/hooks/blog-draft-gate.sh` (PreToolUse, `Edit|Write`) blocks any write to
`*/posts/*.html` unless `docs/blog-drafts/<slug>.md` exists **and** contains a line reading exactly
`Status: APPROVED`. Language variants inherit their master's draft (`foo.de.html` → `foo.md`).
Templates and `_OLD` files are exempt; index pages and configs are not gated — they are plumbing,
not the text a reader sees.

**The loop** — `/blog-draft <slug>`:

1. **Draft** the complete post as plain prose into `docs/blog-drafts/<slug>.md` with `Status: DRAFT`.
2. **Show** it to the HIC as **one fenced code block**, whole text, no preamble to scroll past
   (Deliverable Handoff Rule) — then **stop and ask**. Not in the same turn as publishing.
3. **Revise** at whatever grain they give, re-emitting the **full** text each round, not a diff. For
   line-by-line work use the `/dialog` convention (`muutos;` old → new, applied on `agree`).
4. **Approve** — only on an explicit approval **about this post**, set `Status: APPROVED` and record
   `Reviewed-By` / `Reviewed-On`.
5. **Publish**, then register per §3 / §3.1, sync the dual folder, and apply §3.2 / §3.2.1 for any
   translated variants.

**Hooks arm at session start.** `settings.json` is read once when a session begins, so this gate is
inert in the session that adds it and live from the next one. Verified by direct invocation
(all six paths: missing draft → block, `Status: DRAFT` → block, `APPROVED` → allow, language variant
inherits the master's draft, templates and index pages exempt). **Until a fresh session picks it up,
the discipline is unenforced** — which is precisely the condition this gate exists to end, so do not
treat "the hook is committed" as "the hook is protecting anything yet".

**What the hook does and does not do.** It guarantees a readable draft exists in the repo and in the
diff, and makes approving a deliberate, diffable act. It **cannot verify a human read anything** —
the asking is still the agent's job. Generators (`build-i18n-pages.cjs`, `inject-blog-nav.cjs`) write
through Bash/node and are never seen by the hook; that is deliberate, since they render already-
approved text, and it is also the way around the gate. Do not use a generator to dodge the draft step.

**Second purpose — Article 50(4) evidence.** The draft file's `Status: APPROVED` + `Reviewed-By` is
the artefact that evidences the _editorial responsibility_ limb of the EU AI Act Article 50(4) text
test (`DWS_TRUTH_STANDARD.md` §2G). It turns the exemption from an assertion into a record with a
name and a date. A post with no draft file has no evidence of review — which is exactly the state
that requires a label.

**A `Status: DRAFT` file is unfinished work, not a filing.** List open drafts when asked what is
pending and at session end; the "drafted but never published" failure is as real as the other one.

## 4. HTML Template Structure

Every blog post follows this skeleton:

```
<!DOCTYPE html>
<html lang="en">
<head>
    [Meta tags — see §5]
    [Tailwind CDN]
    [Custom styles]
    [JSON-LD structured data]
</head>
<body>
    <nav>          [Hamburger menu — same as _template-en.html]
    <main>
        <section>  [Hero: category badge, date, title, subtitle]
        <section>  [Article content]
            <article>
                [Content sections with h2 headings]
                [Insight cards, metric cards, comparison blocks]
                [Newsletter CTA]
                [Read Also cards]
            </article>
        </section>
    </main>
    [Post Navigation + Products — auto-injected by script]
    <footer>       [Copyright, links]
</body>
</html>
```

---

## 5. Required Meta Tags

Every post MUST include:

```html
<meta name="description" content="..." />
<meta name="author" content="Risto Anton Paarni" />
<meta name="date" content="YYYY-MM-DD" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://onelifetime.world/posts/<slug>.html" />
<meta property="og:image" content="https://dws10.com/DWS_IQ2026.png" />
<meta property="og:site_name" content="OneLifetime.World" />
<meta property="article:published_time" content="YYYY-MM-DD" />
<meta property="article:author" content="Risto Anton Paarni" />
<meta property="article:section" content="[category]" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="canonical" href="https://onelifetime.world/posts/<slug>.html" />
```

Plus JSON-LD `Article` schema (see template).

---

## 6. Footer Navigation (Prev/Next)

Auto-injected by `scripts/inject-blog-nav.cjs`. The script:

1. Reads the `posts` array (chronological order) defined at the top of the script
2. For each post, generates prev/next links based on array position
3. Inserts the nav block before the `<!-- Footer -->` comment (or `<footer>` tag)
4. Is **idempotent** — safe to re-run; removes old injection before re-inserting

### Adding a New Post to Navigation

1. Add the post to the `posts` array in `scripts/inject-blog-nav.cjs` in chronological position
2. Run `node scripts/inject-blog-nav.cjs`
3. Copy all changed files to `landing-pages/onelifetime-world/posts/`

### Nav HTML Structure

```html
<nav class="flex justify-between items-center pt-8 border-t border-gray-700">
  <a href="/posts/prev.html">← Previous Title</a>
  <a href="/posts/next.html">Next Title →</a>
</nav>
```

- First post: no prev link (empty span)
- Last post: no next link (empty span)
- Links use truncated titles to prevent overflow on mobile

---

## 7. Product Cards

Three product cards appear below the prev/next nav in every post:

| #   | Product                  | Price  | Badge      | URL                                    |
| --- | ------------------------ | ------ | ---------- | -------------------------------------- |
| 1   | DWS IQ Platform          | €4,999 | Flagship   | `/products/dwsiq.html`                 |
| 2   | Climate Reporting Bundle | €6,500 | Best Value | `/products/bundle.html`                |
| 3   | Firehorse Omnichannel    | €499   | Start Here | `/products/firehorse-omnichannel.html` |

Cards use the `metric-card` style pattern (dark glass background, cyan border on hover, translateY lift).

To change products: edit the `products` array in `scripts/inject-blog-nav.cjs` and re-run.

---

## 8. Injection Script

```bash
# Run from repo root
node scripts/inject-blog-nav.cjs

# Then sync to landing-pages
for f in *.html; do
  cp "onelifetime.world/posts/$f" "landing-pages/onelifetime-world/posts/$f"
done
```

The script is located at `scripts/inject-blog-nav.cjs` and:

- Processes only root-level posts (not `en/` or `fi/` subdirectories)
- Uses regex removal for idempotent re-runs
- Supports both `<!-- Footer -->` comment and direct `<footer>` tag markers

---

## 9. Checklist for Every New Post

- [ ] Create HTML in `onelifetime.world/posts/<slug>.html`
- [ ] Include all required meta tags (§5)
- [ ] Include JSON-LD structured data
- [ ] Use consistent nav/footer from template
- [ ] Add post to `scripts/inject-blog-nav.cjs` posts array
- [ ] Run `node scripts/inject-blog-nav.cjs`
- [ ] Copy ALL changed files to `landing-pages/onelifetime-world/posts/`
- [ ] Verify: `diff onelifetime.world/posts/<slug>.html landing-pages/onelifetime-world/posts/<slug>.html` → empty
- [ ] Commit source + landing-pages copy in SAME commit
- [ ] Update this registry table (§3)
- [ ] Never create posts as `.md` files (CLAUDE.md rule)

---

## 10. Social Share Section

Every post includes a social share bar between the prev/next nav and the product cards. Auto-injected by the script.

### Share Channels

| Channel     | Icon                    | Behavior                                              |
| ----------- | ----------------------- | ----------------------------------------------------- |
| LinkedIn    | LinkedIn logo (SVG)     | Opens LinkedIn share dialog with post URL             |
| X (Twitter) | X logo (SVG)            | Opens tweet compose with title + URL + @LifetimeOy    |
| Email       | Envelope (SVG)          | Opens `mailto:` with subject + body + URL             |
| Copy Link   | Link icon + "Copy link" | Copies URL to clipboard, shows "Copied!" confirmation |

### Design

- Icons are 36x36px circular buttons with dark glass background
- Each has a brand-color hover state (LinkedIn blue, X blue, cyan for email/copy)
- SVG icons use `#94a3b8` (muted gray) fill
- "Copy link" button uses `navigator.clipboard.writeText()` with 2-second feedback

### Privacy

- No tracking pixels or analytics in share links
- LinkedIn and X share dialogs are native platform dialogs (no SDK loaded)
- No third-party JavaScript loaded for sharing

---

## 11. Style Tokens

Consistent across all posts (from DWS Brand Standard dark theme):

| Token             | Value                         | Usage                      |
| ----------------- | ----------------------------- | -------------------------- |
| Background        | `#0f172a → #1e293b → #0f172a` | Body gradient              |
| Text primary      | `#f1f5f9`                     | Body text                  |
| Text secondary    | `#cbd5e1`                     | Article prose              |
| Text muted        | `#94a3b8`                     | Captions, dates            |
| Accent cyan       | `#06b6d4`                     | Links, highlights, borders |
| Accent gold       | `#d4a843`                     | Badges, section headers    |
| Accent blue       | `#2563eb`                     | CTAs, buttons              |
| Card background   | `rgba(30,41,59,0.9)`          | Metric/product cards       |
| Card border       | `rgba(6,182,212,0.2)`         | Default state              |
| Card border hover | `rgba(6,182,212,0.5)`         | Hover state                |
| Nav background    | `#1e293b`                     | Sticky nav bar             |

---

## 12. Editor-in-Chief Voice (Seth Godin House Style)

Lifetime Scope Journal has one voice. It belongs to the Editor-in-Chief (Risto Anton Päärni), and every post — partner notes, field notes, investor notes, launch commentary — is written in it. The voice is **Seth Godin friendly**: generous, direct, and short on corporate air.

This section is the standard. Any agent or human drafting a post MUST apply it. The `redhat-sovereign-move-three-tiers.html` partner note (23 Apr 2026) is the reference exemplar — read it before writing a new post.

### 12.1 Voice principles

1. **Short paragraphs.** One to three sentences. White space is structure, not emptiness.
2. **One idea at a time.** Each paragraph carries a single thought. If two ideas are fighting, split the paragraph.
3. **Verb-first sentences.** "Red Hat shipped sovereign support." Not "It can be observed that Red Hat shipped sovereign support."
4. **Respect the reader.** No throat-clearing, no "as you may know," no filler. Assume the reader is smart, busy, and curious.
5. **Generous toward partners and competitors.** Name the thing they did well before naming the thing you would do differently. No punching down.
6. **Honest about limits.** Never sell a promise the layer cannot deliver. If the tier is 2, the headline says 2. The fastest way to lose European enterprise trust is to over-claim.
7. **Own the stance.** Say what we think, and why. Hedging ("it could be argued") is weaker than a declared position followed by its reasoning.
8. **Talk like a person.** Contractions, plain words, rhythm. "We run on Red Hat" beats "DWS operates its production environment on Red Hat Enterprise Linux."
9. **Earn every adjective.** Delete one adjective from every paragraph on final pass. Strong nouns and verbs carry the weight.
10. **Close with a recap, not a crescendo.** A short bullet list titled "The short version" at the end, so a reader who skimmed still leaves with the thesis.

### 12.2 Structural moves (the Seth Godin pattern)

Not every post uses every move. Most posts use most of them, in roughly this order.

| Move                            | What it is                                                                  | Example from `redhat-sovereign-move-three-tiers.html`                |
| ------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **The news, in one line**       | A cyan callout box. One paragraph of fact. Source cited at the end.         | "Red Hat announced Confirmed Sovereign Support for the 27 EU…"       |
| **The opener**                  | One sentence. Often a stance. Sometimes a gift.                             | "Good news from a good partner."                                     |
| **The turn**                    | "And because X, here is the honest part." Named pivot from warmth to rigor. | "And because cheering without thinking is not a business, here is…"  |
| **The body**                    | H2 sections. Each is a single thought. 1–3 short paragraphs per section.    | "What 'Confirmed Sovereign Support' actually covers"                 |
| **The gold callout**            | Warning / nuance / the thing the label does NOT promise.                    | "What the label does not promise — and why that matters"             |
| **The tier cards / scan layer** | A structured block (cards, list, table) so skimmers still land softly.      | Tier 1 / Tier 2 / Tier 3 cards                                       |
| **The stance**                  | Short section titled "Why we will not X" or "Why honesty wins." The spine.  | "Why we will not over-claim"                                         |
| **The short version**           | Cyan callout, bullet list, 3–5 lines, the thesis compressed.                | "Red Hat's EU sovereignty move is real and useful. We applaud it. …" |
| **Read next**                   | 2–4 internal links to sister posts. No external links here.                 | Solid Layers, MCP Apps, KYA v1                                       |
| **Signature**                   | Horizontal rule + italic sign-off with title.                               | "Risto Anton Paarni — CEO, Lifetime Oy · Editor in Chief, LSJ"       |

### 12.3 Words we avoid

Delete these on final pass. They are fog.

- "Solutions," "synergies," "leverage," "unlock," "empower," "robust," "cutting-edge," "best-in-class," "world-class," "game-changing," "revolutionary," "disruptive"
- "In today's world," "in the modern era," "in an ever-changing landscape"
- "It goes without saying," "needless to say," "as we all know"
- "Very," "really," "quite," "somewhat" (almost always deletable)
- "Utilize" (use "use")

### 12.4 Words we keep

Small words, real words, specific nouns.

- **Verbs:** ship, run, build, pair, match, pick, read, cheer, notice, trust, earn, draw, hold
- **Nouns:** layer, tier, stack, partner, reader, workload, engineer, buyer, auditor, chain, label
- **Connectives:** "And because…," "So here is…," "The honest part:…," "Two things…," "One more time."

### 12.5 Partner-note sub-voice

When a post names a partner by name (Red Hat, Aiven, Scaleway, Microsoft, Anthropic, OpenAI, SUSE, IBM, NVIDIA), three extra rules apply on top of §12.1–12.4:

1. **Open with a gift.** Name what they did well before anything else. If we cannot name it sincerely, the post is not ready.
2. **Match their careful language.** If the partner used the word "confirmed" instead of "absolute," we use the same restraint. Never escalate a partner's claim past the line they themselves drew.
3. **Position, do not compete.** Say where DWS sits on top of, beneath, or beside the partner's layer. Never imply we replace them unless we literally do.

### 12.6 Before publishing — the voice checklist

- [ ] Opener is one sentence, stance or gift
- [ ] Every paragraph is ≤ 3 sentences
- [ ] Every section has one idea, not two
- [ ] No words from the §12.3 banned list
- [ ] At least one gold callout names a limit, nuance, or honest caveat
- [ ] A "The short version" recap appears near the end
- [ ] Internal "Read next" links to 2–4 sister posts
- [ ] Signature block with Editor-in-Chief title
- [ ] Partner notes: opener names the partner's good work before anything else
- [ ] Claims never exceed the tier the layer can deliver (see §3.6 in `DWS_STANDARDS_LIBRARY.md`)

### 12.7 Reference exemplars

Read these before writing. Match their rhythm.

| Post                                     | Why it is an exemplar                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| `redhat-sovereign-move-three-tiers.html` | **Partner-note canonical.** Gift → turn → tiers → honest limit → short version. |
| `mcp-apps-identity-spine.html`           | **Stack-note canonical.** Names what an open standard gives, what it does not.  |
| `solid-layers-aiven-scaleway-kya.html`   | **Sovereign-stack canonical.** Three layers, three partners, honest tier map.   |
| `validated-mock-data-principle.html`     | **Principle-note canonical.** Small, declarative, unforgettable.                |

If a draft does not feel like these four when read aloud, rewrite it until it does.

---

## 13. Reader Polls

Every blog post may include one reader poll using `shared-assets/lsj-poll.js` (introduced Blog V2, 7 May 2026).

### 13.1 How it works

Drop a single `<div class="lsj-poll">` element anywhere in the article body. The widget self-renders with no external dependencies. Votes persist in localStorage per poll-id — a reader who has already voted sees results immediately on return.

```html
<div
  class="lsj-poll"
  data-poll-id="unique-slug-per-poll"
  data-question="Your question here?"
  data-options='["Option A","Option B","Option C","Option D"]'
  data-seed="[42, 31, 18, 27]"
  data-theme="gold"
></div>
```

### 13.2 Required attributes

| Attribute       | Required | Description                                                                                        |
| --------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `data-poll-id`  | Yes      | Unique string. Use `<post-slug>-<topic>` (e.g. `strike-price-driver`).                             |
| `data-question` | Yes      | The question shown to the reader.                                                                  |
| `data-options`  | Yes      | JSON array of 2–4 option strings.                                                                  |
| `data-seed`     | No       | JSON int array — starting vote counts per option. Match real audience distribution where possible. |
| `data-theme`    | No       | `gold` (default) \| `cyan` \| `red`                                                                |

### 13.3 Seed data rule (Validated Mock Data Principle)

Seed counts MUST represent a plausible distribution — not uniform zeros. Use knowledge of the audience (EU B2B industrial buyers) to set initial weights. Document the rationale in an HTML comment above the poll div.

### 13.4 Script loading

Add to `<head>` of the post:

```html
<script src="../shared-assets/lsj-poll.js" defer></script>
```

For posts under `posts/en/` or `posts/fi/`:

```html
<script src="../../shared-assets/lsj-poll.js" defer></script>
```

### 13.5 Placement

- One poll per article, placed after the first major section (approximately 30–40 % into the article).
- Do not place polls inside callout boxes or card grids.

### 13.6 Future upgrade path

The current V1 implementation is localStorage-only (per-device). When real aggregate results are needed, replace localStorage read/write in `lsj-poll.js` with Supabase upsert/select calls using the `lsj_polls` table (not yet created). Seed counts will then seed the DB row on first vote, not the UI.

---

## 14. Ads & Sponsorship Slots

Blog posts may include partner ad slots using `shared-assets/lsj-ads.js` and `shared-assets/lsj-ads-config.json` (introduced Blog V2, 7 May 2026).

### 14.1 Ad slot types

| Slot type | Placement                            | HTML element                                    |
| --------- | ------------------------------------ | ----------------------------------------------- |
| `sponsor` | Top of article, below the header     | `<div class="lsj-ad-slot" data-slot="sponsor">` |
| `mid`     | Mid-article, between major sections  | `<div class="lsj-ad-slot" data-slot="mid">`     |
| `footer`  | End-of-article, before product cards | `<div class="lsj-ad-slot" data-slot="footer">`  |

Add `data-category="compliance|ai|sovereignty|carbon|industrial|erp|construction"` to target ads by article topic.

### 14.2 Script loading

```html
<script src="../shared-assets/lsj-ads.js" defer></script>
```

### 14.3 Ad configuration

Partner ads are managed in `onelifetime.world/shared-assets/lsj-ads-config.json`. Fields:

| Field            | Required | Description                                     |
| ---------------- | -------- | ----------------------------------------------- |
| `id`             | Yes      | Unique string slug                              |
| `active`         | Yes      | `true` to serve; `false` to pause               |
| `name`           | Yes      | Partner brand name                              |
| `tagline`        | Yes      | One-line value prop (max 80 chars)              |
| `headline`       | No       | Mid-article card headline (max 60 chars)        |
| `body`           | No       | Mid-article card body (2 sentences max)         |
| `url`            | Yes      | Destination URL (UTM-tagged preferred)          |
| `cta`            | No       | Call-to-action label (e.g. "See packages")      |
| `slots`          | Yes      | Array: `["sponsor","mid","footer"]`             |
| `categories`     | No       | Array of article category strings               |
| `type`           | Yes      | `"house"` or `"paid"`                           |
| `campaign_start` | No       | ISO date — slot will not serve before this date |
| `campaign_end`   | No       | ISO date — slot will not serve after this date  |

If no active ad matches a slot, the element is silently removed — no empty space.

### 14.4 Sponsorship rate card

Full rate card lives at `onelifetime.world/advertise/index.html`. Summary:

| Format                 | Rate           |
| ---------------------- | -------------- |
| Article Sponsorship    | €800 / article |
| Newsletter Sponsorship | €1,500 / issue |
| Sponsored Article      | €2,500         |
| Press Release          | €500           |
| Mid-Article Card       | €600 / article |

All prices EUR, B2B, VAT 0 % (EU reverse charge). Invoiced by Lifetime Oy, VAT FI07724079.

### 14.5 Editorial policy

Ad placements are clearly labelled ("Sponsored by" / "Partner Content"). Paid ads do not influence editorial content. The editor-in-chief approves all partners before activation.

---

_Document maintained by DWS IQ 6 Platform team. For questions, contact risto.paarni@lifetime.fi_
