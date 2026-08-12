<!--
VERSION AND AGENT HISTORY
Document: INVESTOR_MESSAGING_UPDATE_2026-05-25.md
Version: 2.0
Last-Updated: 2026-05-25
Author: Risto Anton Paarni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-7)
Purpose: One-page board pre-read. Companion to the Exa partnership letter
         (sales-outreach/LETTER_EXA_PARTNERSHIPS.md, v1.1 was sent — the
         long numbers-bearing version, not the tightened v1.2).
Branch: claude/exa-openclaw-integration-YnDpO
Date: 2026-05-25
Owner: risto.paarni@lifetime.fi
Audience: Lifetime Oy board (hallitus), next session.

Sessions & Modifications:
  - 2.0 | 2026-05-25 | Major rev. Adds the "16 → 25+ industries" finding
                       (58-file bulk rename, commit d4abb4d), the captain-
                       math inconsistency it surfaced, the missing source-
                       of-truth registry, and the audience-determines-
                       length lesson from the Exa send.
  - 1.0 | 2026-05-25 | Initial — four-bullet shift translated to one
                       concrete edit + one tracked number per surface.
-->

# Board Pre-Read — Callout Findings (2026-05-25)

**One page. Thesis: numbers beat adjectives.**

---

## What I found this session

1. **Exa case studies (StackAI, Anara) carry zero hard numbers.** No latency, no recall, no customer count, no dollars. The whole agent market is doing this. Gap to exploit, not copy.
2. **"16 EU industries" was wrong in 58 files** — every live investor deck (V4–V4.3), every CEO/founder profile, every press release, the master thesis, `ONTOLOGY.md`, `DWS7_ROADMAP.md`, `NORDIC_SALES_STRATEGY`, the xAI partnership proposals, `risto-bio.md`. All said 16. Actual is 25+. Fixed in commit `d4abb4d`.
3. ~~**Captain framework math is now visibly broken.**~~ **RESOLVED 2026-05-25** — 16 captains stay; some hats are combined (a captain hat clusters one or more of the 25+ regulated verticals with shared regulatory exposure). `docs/FOUNDER_CREDIBILITY_PLAYBOOK.md` reconciled in 7 places (section header, tranche-allocation table title, captain pitch, LinkedIn opener, third-person profile blurb). "One per vertical" framing replaced with "one per captain hat (each hat clusters related industries)."
4. **We have no source-of-truth file for our own facts.** No `config/industries.json`, no MRR registry, no pilot-count registry. Every fact lives as freeform text in 50+ markdown files. The "16" mistake was inevitable; the next one is too.
5. **Audience determines length, not the other way around.** Risto sent the long Exa letter (v1.1, full numbers block, ~350 words) — correct for a partnership pitch. Cold prospects get 120 words. Worth codifying.

---

## One-liners (board-quotable)

1. **"Numbers beat adjectives every time."**
2. **"We carried a load-bearing lie in 58 files including every live investor deck. Fixed today. The bigger problem is we had no source-of-truth to lint against."**
3. **"Retrieval took two days. Sovereignty took four years. The retrieval is the easy part."**
4. **"16 captains for 25+ industries doesn't work. Pick one — expand the captain count or drop one-per-vertical."**
5. **"Our case studies will be quantitative. That's a category move, not a copy edit."**
6. **"Audience determines length. Cold prospects: 120 words. Partners: 350 words with the numbers block."**
7. **"If we can't write the after-number, the feature isn't ready to announce."**

---

## Four shifts — concrete edits

### 1. Investor materials — *one buyer, one pain, one mechanism, one proof*

**Today:** Platform-language opener. Industry count was wrong everywhere (now fixed). Captain-tranche math now inconsistent (16 captains vs. 25+ industries).

**Shift:** One buyer (named role), one pain (named workflow with baseline number), one mechanism (one sentence), one proof (one measured outcome) per slide. Everything else moves to appendix. Captain framework reconciled with industry count.

**One edit:** Rewrite SAFE/Captain slides in V4.3 deck with consistent industry-vs-captain math. Replace architecture + platform slides with one composite (buyer/pain/mechanism/proof).

**Number to track:** Ratio of measured-outcome words to capability-claim words on slides 1–5. Target > 1.

---

### 2. Sales outreach — *shorter, role-specific, numeric, proof-first, length matched to audience*

**Today:** 4 cold letters, ~350 words avg, no reply-rate instrumentation. No distinction between cold-prospect length and partner-pitch length.

**Shift:** Cold prospect = 120 words, proof-first, subject = the number. Partner = 350 words with the numbers block (the Exa v1.1 letter is the template). Reply rate tracked weekly by template and by audience class.

**One edit:** Cut `LETTER_ARI_HIRVONEN_OUTOKUMPU.md`, `LETTER_FRIDA_AHLBERG_SIEMENS.md`, `LETTER_JACOB_BENTZEL_TECHSEED.md`, and `Warm Intro Letter-AI-Stockholm2.md` to 120 words. Keep `LETTER_EXA_PARTNERSHIPS.md` at v1.1 length. A/B vs current.

**Number to track:** Reply rate per 100 sends, by template × audience class.

---

### 3. Product updates — *every claim maps to a number, a workflow, or a buyer outcome*

**Today:** Release notes describe what we built. ~20% of public copy carries a number. Industry count drifted to 16 because no registry existed.

**Shift:** Every release-note line is structured: *Buyer + workflow + before-number → after-number, or workflow unlocked.* Public claims are linted against a source-of-truth registry.

**One edit:** Build `config/industries.json` with the authoritative list (and equivalent files for MRR, pilots, AI Act readiness). Add a CI lint that fails when public `.md` claims don't match the registry. Apply the lint to release notes + landing-page hero text.

**Number to track:** % of public release notes (this quarter) passing the lint. Target 100%. Today ~20%.

---

### 4. Brand presence — *operator credibility, transparency as a brand move*

**Today:** Ecosystem language ("Sovereign EU ecosystem of agentic compliance") in landing pages and LinkedIn posts.

**Shift:** Lead with what we shipped this week. Quote the operator. Show the trace. Be visibly self-correcting — turn the "we fixed 58 files of bad facts today" into a brand moment.

**One edit:** LSJ next biweekly issue leads with two stories: (a) the Exa wiring ("Wired Exa in two days. Took four years to wire EU sovereignty. The retrieval is the easy part.") and (b) "We audited our own claims and fixed 58 files of bad facts today." Mirror to LinkedIn same day.

**Number to track:** LSJ open rate + LinkedIn engagement on operator-credibility posts vs. ecosystem-language posts, weekly.

---

## What I want from this board session

**Three decisions:**

1. **Approve the messaging shift** (the four edits above) so deck rewrite + LinkedIn pivot can start this week.
2. ~~**Decide the captain-count question.**~~ **DECIDED 2026-05-25** — 16 captains, combined hats. `FOUNDER_CREDIBILITY_PLAYBOOK.md` reconciled.
3. **Approve building `config/industries.json` + CI lint** — 30-minute task, prevents the next "16" mistake. Same pattern extends to MRR, pilots, readiness %.

**One discussion item:**

- Where else are we carrying load-bearing lies? Suspicion: MRR figures (cited in three different ranges across docs), pilot contract values, EU AI Act readiness percentages, NVIDIA Connect ISV claim dates. A 1-day audit would tell us.

---

## 90-day before/after target

| Surface | Before | After (target 2026-09-01) |
|---|---|---|
| Pitch deck | 24 slides, platform-language opener, captain-math inconsistent | 12 slides, buyer/pain/mechanism/proof opener, captain framework reconciled |
| Cold outreach | 4 letters, ~350 words avg, reply rate not measured | 4 letters @ ≤ 120 words + 1 partner letter @ 350 words; reply rate by audience class, weekly |
| Release notes | Feature-described, ~20% number-bearing | 100% number-bearing, lint-gated against `config/industries.json` (and the other registries) |
| LSJ / LinkedIn | Mixed ecosystem + operator voice | Operator-first, ecosystem language explicitly avoided in the lede; "self-correction" framing as a brand move |
| Public claims integrity | Drifted (the "16" was a 4-month lie) | Lint-enforced; drift caught at PR time |
| External proof | Internal thesis numbers only | At least two externally-published measured outcomes (one with Exa co-publication if they take it; one solo via LSJ) |

---

## Source documents

- `sales-outreach/LETTER_EXA_PARTNERSHIPS.md` — v1.1 was sent; v1.2 (tight) preserved for cold prospects.
- `docs/field-notes/2026-05-25-exa-enterprise-case-studies.md` — the analysis that surfaced the numbers gap.
- `docs/field-notes/2026-05-25-exa-stackai-anara-action-plan.md` — the broader cross-functional plan.
- Commit `d4abb4d` — the 58-file "16 → 25+" rename.
- `docs/field-notes/2026-03-15-investor-materials-audit.md` — prior audit; this v2.0 supersedes it on tone and on the captain-math finding.
