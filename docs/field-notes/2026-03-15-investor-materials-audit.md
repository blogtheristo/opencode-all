# Field Note: Investor Materials Audit — State of Play + MVP/V1 Feature Prompts

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/kya-standard-review-W3Qcg | Date: 15.03.2026 | Changes: Resolved conflicting signals. New seat tier structure (Fleet Admiral EUR 500K, Captain EUR 150K, Industry Captain EUR 50K x 8, Deputy unlimited). Updated MRR to EUR 7K March 2026. Added sales sprint June 15 – August 15.
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/kya-standard-review-W3Qcg | Date: 15.03.2026 | Changes: Full audit of investor materials, email outreach infrastructure, public IR pages. MVP and V1 feature gap analysis with actionable prompts. Legal Hub for investors scoped.

Document Status:
  - Created: 15.03.2026
  - Last Modified: 15.03.2026
  - Language: English
  - Languages Available: EN
  - Publication Status: INTERNAL
  - Classification: CONFIDENTIAL — Operational
  - Document Type: Field Note / Audit

Related Documents:
  - Legal/KYA_OPTIMIZATION_v1.4.md (Performance Guarantee, Alpha-Share, D&O)
  - docs/field-notes/2026-03-10-kya-financial-projections.md (Revenue model, D&O investor section)
  - investor-outreach/00-WHY-ZERO-OUTREACH.md (Root cause analysis)
  - INVESTOR_DOCUMENTATION.md (Root doc — needs overhaul)
  - investor-outreach/INVESTOR_MEMO.md (Active memo — needs update)
  - docs/INVESTOR_HOOK_DECK.md (3-slide hook — needs KYA)
  - INVESTOR_EMAIL_TEMPLATES.md (Templates — disconnected from Resend)
  - src/services/email.service.ts (Resend SDK — production ready, unused for outreach)

***

---

## 1. Audit Findings

### 1.1 Investor Documents — Version Chaos

| Document | Location | Last Updated | Round Size | Industries | Has KYA? | Has Alpha-Share? | Has D&O? |
|----------|----------|-------------|-----------|-----------|----------|-----------------|----------|
| INVESTOR_DOCUMENTATION.md | root | Jan 2026 | Cloud credits ask | 8 | No | No | No |
| investor-outreach/INVESTOR_MEMO.md | investor-outreach/ | Jan 18, 2026 | €500K SAFE | 8 | No | No | No |
| Firehorse/.../INVESTOR_PITCH.md | Firehorse/ | Dec 30, 2025 | €2M seed | Construction only | No | No | No |
| INVESTOR_EMAIL_TEMPLATES.md | root | Jan 2026 | €150K SAFE | Construction | No | No | No |
| docs/INVESTOR_HOOK_DECK.md | docs/ | Feb 16, 2026 | €500K SAFE | 16 | No | No | No |
| Firehorse/.../INVESTOR_MEMO.md | Firehorse/ | Dec 2025 | €500K SAFE | 8 | No | No | No |

**Verdict: Every investor document is stale.** None mention KYA (the strongest value prop), Alpha-Share (the revenue model), Performance Guarantee, D&O insurance angle, or the 20-industry expansion. The Hook Deck (Feb 2026) is closest to current but still missing the governance layer.

### 1.2 Conflicting Signals — RESOLVED (v1.1)

| Signal | Was | Now (March 15, 2026) | Status |
|--------|-----|---------------------|--------|
| Seat tiers | €150K / €500K / €2M (3 conflicting docs) | Fleet Admiral €500K, Captain €150K, Industry Captain €50K × 8, Deputy unlimited | RESOLVED |
| Industry count | 8 / 16 (stale) | 20 industries | RESOLVED |
| MRR | €7K (Dec 2025) stale | €7K (March 2026) confirmed | RESOLVED |
| Sales timeline | None specified | 2-month 100% sales sprint: June 15 – August 15, 2026 | RESOLVED |
| Valuation cap | €3.8M (all) | €3.8M — consistent | OK |
| Contact email | investor@dws10.com vs risto@lifetime.fi | risto@lifetime.fi (primary) | RESOLVED |

### 1.3 Email Outreach — Broken Pipeline

**What exists:**
- `generate-5-emails-today.py` — Python script that reads CSV, generates `.txt` files for manual Gmail copy-paste
- `SEND-5-EMAILS-TODAY.sh` — Shell wrapper for above
- `contacts-angel-investors.csv` — Sample contacts (3 test entries)
- Templates in `INVESTOR_EMAIL_TEMPLATES.md` and `EARLY-INPUT-EMAIL-5-DAY-SYSTEM.md`

**What's broken:**
1. **Zero emails have been sent** (confirmed by `00-WHY-ZERO-OUTREACH.md`)
2. The Python script generates files for manual sending — not connected to Resend
3. `src/services/email.service.ts` has a production-ready Resend SDK with batch sending, Supabase logging, and template system — **completely unused for investor outreach**
4. Verified domain is `onelifetime.world` (CLAUDE.md), but templates use `risto@lifetime.fi`
5. No Calendly link configured (placeholder in scripts)
6. Demo link points to external domain `j6prmljgpvnia.ok.kimi.link` — not a Lifetime/DWS domain

### 1.4 Public Investor Relations

- `dws10.com/investor-relations/index.html` — Exists, long page, dark theme. Content is generic/stale.
- `dws10.com/captain/index.html` — Captain seats page (from Hook Deck). Exists.
- No Legal Hub or governance section visible to investors.
- No KYA documentation publicly accessible for due diligence.

### 1.5 Legal/ Folder — Strong Content, Zero Visibility

| File | Content | Investor Relevance |
|------|---------|-------------------|
| KYA_STANDARD_v1.md | KYA-S Security Standard | HIGH — governance framework |
| KYA_OPTIMIZATION_v1.4.md | KYA-O + Alpha-Share + Performance Guarantee | HIGH — revenue model + D&O |
| KYA_SECURITY_v1.2.md | Security controls | MEDIUM — due diligence |
| KYA_NIST_STANDARD_v1.md | NIST alignment | MEDIUM — credibility |
| KYA_NIST_SECURITY_v1.md | NIST security mapping | LOW — technical |
| KYA_NIST_OPTIMIZATION_v1.md | NIST optimization mapping | LOW — technical |

**The best content in the company is invisible to investors.** KYA + Alpha-Share + Performance Guarantee + D&O = the story that closes deals. It's all in Legal/ but none of it reaches investor-facing materials.

---

## 2. Architecture Decision: Single Source of Truth

**Problem:** 6+ investor documents with overlapping, conflicting content. Maintaining all of them is impossible.

**Decision:** Consolidate to 3 documents:

| Document | Purpose | Audience | Location |
|----------|---------|----------|----------|
| **Investor Memo** (primary) | Full investment case — traction, KYA, Alpha-Share, D&O, terms | Angels, VCs, family offices | `investor-outreach/INVESTOR_MEMO.md` |
| **Hook Deck** (teaser) | 3-slide hook — cost advantage, moat, CTA | Cold outreach, first contact | `docs/INVESTOR_HOOK_DECK.md` |
| **Email Templates** (outreach) | Programmatic templates for Resend SDK | Automated outreach | `src/services/email-templates.ts` (add investor templates) |

**Retire:** `INVESTOR_DOCUMENTATION.md` (root), `Firehorse/.../INVESTOR_PITCH.md`, `Firehorse/.../INVESTOR_MEMO.md`. Move to `docs/archive/investor/`.

---

## 3. Feature Gap Analysis

### What's Missing for MVP (Minimum Viable Outreach)

MVP = An investor can receive an email, click through to a page, read the case, and book a call. No human copy-paste required.

| # | Feature | Current State | Blocker |
|---|---------|--------------|---------|
| M1 | **Investor memo with KYA story** | Memo exists but missing KYA/Alpha-Share/D&O | Content update only |
| M2 | **Resend investor email template** | Resend SDK ready, no investor template | Add `investorOutreachTemplate()` to `email-templates.ts` |
| M3 | **Investor outreach API route** | Email routes exist (`src/routes/email.routes.ts`) | Add `/api/email/investor-outreach` endpoint |
| M4 | **Contact list in Supabase** | CSV file in repo | Create `investor_contacts` table, import CSV |
| M5 | **Legal Hub page on dws10.com** | No page | Create `dws10.com/legal-hub/index.html` with KYA summary |
| M6 | **Updated IR page** | Stale content | Update `dws10.com/investor-relations/index.html` |
| M7 | **Working Calendly or booking link** | Placeholder | Human setup required |

### What's Missing for V1 (Production Investor System)

V1 = Automated daily outreach with tracking, follow-ups, and reporting.

| # | Feature | Description | Depends On |
|---|---------|------------|-----------|
| V1 | **Automated daily batch send** | Cron job sends 5 emails/day from contact queue | M2, M3, M4 |
| V2 | **Email status dashboard** | View sent/delivered/opened/replied in Firehorse dashboard | Supabase email_logs |
| V3 | **Follow-up sequences** | Auto-send follow-up at Day 5 and Day 10 | V1 |
| V4 | **Investor CRM view** | Contact status, interaction history, pipeline stage | M4 |
| V5 | **Webhook for email events** | Resend webhooks → Supabase for delivery/bounce/reply tracking | Resend webhook config |
| V6 | **PDF pitch deck generation** | Auto-generate PDF from memo markdown | `create_pdf.py` exists, needs update |
| V7 | **Legal Hub with KYA downloads** | PDF downloads of KYA-S, KYA-O summaries for due diligence | M5 |
| V8 | **Hook Deck with KYA slide** | Add Slide 4: "Why boards need KYA" (D&O angle) | Content only |

---

## 4. MVP Feature Prompts (Copy-Paste Ready)

These are prompts you can give to a Claude Code session to implement each feature:

### M1: Update Investor Memo with KYA Story

```
Update investor-outreach/INVESTOR_MEMO.md to v2.0. Add:
1. KYA section — Know Your Agent governance framework (from Legal/KYA_STANDARD_v1.md)
2. Alpha-Share revenue model — Decline-to-Scale 12%/8%/5% (from Legal/KYA_OPTIMIZATION_v1.4.md §5.4)
3. Performance Guarantee — replaces old "clawback" language. 30-day service credit on verified fault
4. D&O Insurance angle — personal liability under EU AI Act Article 99, 8-12% premium reduction
5. Update industry count from 8 to 20
6. Update MRR to current figure (ask human)
7. Consolidate round size to €500K SAFE @ €3.8M cap (remove €150K and €2M references)
8. Update milestones to 2026 actuals
Source: Legal/KYA_OPTIMIZATION_v1.4.md, docs/field-notes/2026-03-10-kya-financial-projections.md
Use DWS standard.
```

### M2: Add Investor Email Template to Resend Service

```
Add investor outreach email template to src/services/email-templates.ts.
Create investorOutreachTemplate(firstName, variant) function.
4 variants: climate-tech, traction, regulatory-urgency, nordic-construction.
Each variant under 80 words. Include CTA link parameter.
Sender: process.env.EMAIL_FROM || 'risto@onelifetime.world'
Match existing template pattern (welcomeTemplate, etc).
Then add sendInvestorOutreachEmail() method to src/services/email.service.ts.
Run npm run build to verify.
```

### M3: Add Investor Outreach API Route

```
Add POST /api/email/investor-outreach to src/routes/email.routes.ts.
Request body: { contacts: [{email, firstName, variant}], batchSize?: number }
Use emailService.sendBatch() for batch sending.
Rate limit: max 5 per request, max 25 per day.
Auth: require JWT with admin role.
Log to Supabase email_logs with templateType 'investor_outreach'.
Run npm run build and npm run test.
```

### M4: Create investor_contacts Supabase Table

```
Create Supabase migration: supabase/migrations/YYYYMMDDHHMMSS_create_investor_contacts.sql
Table: investor_contacts
Columns: id (uuid), name (text), email (text unique), linkedin (text), location (text),
focus_area (text), check_size_min (int), check_size_max (int), angel_network (text),
warm_intro_path (text), contact_status (text default 'not_contacted'),
last_contact_date (timestamptz), next_action (text), created_at (timestamptz default now())
RLS: service_role only. No public access.
Import existing contacts from investor-outreach/contacts-angel-investors.csv.
```

### M5: Create Legal Hub Page

```
Create dws10.com/legal-hub/index.html — investor-facing Legal & Governance Hub.
Use ironclad-nav.js for navigation. Dark theme matching dws10.com brand.
Sections:
1. KYA Framework Overview (summary of KYA-S + KYA-O)
2. EU AI Act Compliance (Article 99, safe harbor)
3. Performance Guarantee (service credit model)
4. D&O Insurance Impact (8-12% premium reduction)
5. Download section (placeholder for PDF summaries)
Content source: Legal/KYA_OPTIMIZATION_v1.4.md, Legal/KYA_STANDARD_v1.md
Copy to landing-pages/dws10-com/legal-hub/ in same commit.
Use DWS standard.
```

### M6: Update IR Page

```
Update dws10.com/investor-relations/index.html:
1. Add KYA governance section
2. Add Alpha-Share revenue model (Decline-to-Scale)
3. Add D&O insurance angle
4. Update industry count to 20
5. Update MRR (ask human for current figure)
6. Add link to Legal Hub (/legal-hub/)
7. Add link to Captain seats (/captain/)
Copy to landing-pages/dws10-com/investor-relations/ in same commit.
```

### M7: Calendly Setup (Human Action)

```
HUMAN ACTION REQUIRED:
1. Create Calendly account or configure existing
2. Create "Investor Call - 15 min" booking type
3. Set availability: 9am-5pm EET, 15min buffer
4. Get the booking URL
5. Update EMAIL_CALENDLY_LINK in .env
```

---

## 5. V1 Feature Prompts (Post-MVP)

### V1: Automated Daily Batch Send

```
Create src/services/investor-outreach.service.ts.
Cron job (node-cron): daily at 08:30 EET.
1. Query Supabase investor_contacts WHERE contact_status = 'not_contacted' LIMIT 5
2. For each: call emailService.sendInvestorOutreachEmail()
3. Update contact_status to 'contacted', set last_contact_date
4. Log batch result
Register cron in src/app.ts.
Env var INVESTOR_OUTREACH_ENABLED=true to activate.
```

### V2: Email Status Dashboard

```
Add investor outreach dashboard to dws6.com/dashboard/firehorse/v9-react/.
New route: /dashboard/investor-outreach
Components:
- OutreachStats: total sent, response rate, meetings booked
- ContactTable: sortable list with status badges
- EmailTimeline: sent/delivered/opened/replied events
Data source: Supabase email_logs + investor_contacts tables.
```

### V3: Follow-Up Sequences

```
Add follow-up logic to investor-outreach.service.ts.
Rules:
- Day 5: If contact_status = 'contacted' and no response → send follow-up variant
- Day 10: If still no response → send final follow-up
- After Day 10: Mark as 'no_response'
- If reply received: Mark as 'responded', create task for human
Template: shorter versions of outreach templates (2-3 sentences).
```

### V8: Hook Deck KYA Slide

```
Add Slide 4 to docs/INVESTOR_HOOK_DECK.md:
Title: "Why Every Board Needs KYA"
Content:
- EU AI Act Article 99: personal director liability for ungoverned AI
- KYA-S: three evidence layers (identity, fault, guardrails)
- D&O premium reduction: 8-12%
- One-liner: "SOC 2 for AI agents"
- Timeline: enforcement Aug 2026, first claims Q4 2026
Update version to 1.1. Regenerate Learn/INVESTOR_HOOK_DECK.html.
```

---

## 6. Priority Order

### Do Now (This Session)
1. M5 — Legal Hub page (user requested)
2. M8 — Hook Deck KYA slide (quick win, high impact)

### Do Next (Next Session)
3. M1 — Update Investor Memo with KYA story
4. M2 + M3 — Resend investor templates + API route
5. M6 — Update IR page

### Do Later (After MVP Ships)
6. M4 — Supabase investor_contacts table
7. V1 — Automated daily batch
8. V2 — Dashboard
9. V3 — Follow-up sequences

---

**Lifetime Oy** | Helsinki, Finland
**Contact:** risto@onelifetime.world
**Classification:** CONFIDENTIAL — Operational
