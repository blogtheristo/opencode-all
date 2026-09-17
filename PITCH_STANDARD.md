# DWS Pitch Standard

***

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code (Claude Sonnet 4.6) | Session: claude/nordic-industrial-ai-sales-Jni0E | Date: 10.05.2026 | Changes: Added Pitch Types section — pitch is now declared as either Client (enterprise sales) or Investor. Each of the four parts carries type-specific variant specs. Investor pitch file path is investor-outreach/; client pitch stays in sales-outreach/.
- Version: 1.0 | Tool: Claude Code (Claude Sonnet 4.6) | Session: claude/nordic-industrial-ai-sales-Jni0E | Date: 10.05.2026 | Changes: Initial creation. Defines the canonical four-part pitch structure (Client Sales DD, Person Investigation, Letter Wedge Formation, Appendix by Case) required whenever the word "pitch" is used in a DWS sales or outreach context.

Document Status:

- Created: 10.05.2026
- Last Modified: 10.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Standard / Sales Playbook

Related Documents:

- CLAUDE.md § Pitch Rule
- DWS_STANDARDS_LIBRARY.md § 8. Sales Standards
- sales-outreach/NORDIC_SALES_STRATEGY.md
- docs/sales/enterprise-pricing-construction.md
- docs/sales/contact-details.md

***

## 1. Purpose

Defines what "pitch" means in every DWS outreach context. Any agent, human, or automation that receives the instruction "pitch [company/person]" must declare the pitch type and produce all four parts below, in order, as a single document.

---

## 2. Pitch Types

Every pitch is one of two types. Declare the type at the top of the document.

| Type         | Target                                                   | Goal                                                   | Storage path                                             |
| ------------ | -------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| **Client**   | Enterprise buyer (procurement, CFO, sustainability lead) | Sell DWS IQ 6 / Lifetime Oy product — MRR or setup fee | `sales-outreach/PITCH_<COMPANY>_<CONTACT>_<YYYYMMDD>.md` |
| **Investor** | VC, family office, PE, angel, strategic partner          | Secure SAFE/equity investment or strategic partnership | `investor-outreach/PITCH_<FIRM>_<PERSON>_<YYYYMMDD>.md`  |

If the type is ambiguous, default to **Client**. Do not mix types in one document.

---

## 3. Pitch Structure (both types)

**A pitch is a four-part deliverable:**

| #   | Part                   | Purpose                                  |
| --- | ---------------------- | ---------------------------------------- |
| 1   | Client / Investor DD   | Due diligence on the target organisation |
| 2   | Person Investigation   | Research on the specific contact         |
| 3   | Letter Wedge Formation | The outbound message                     |
| 4   | Appendix by Case       | Tailored supporting evidence             |

All four parts are mandatory. A document missing any part is not a pitch — it is a draft.

---

## 4. Part Specifications

### 4.1 DD (Due Diligence) — Part 1

**Client pitch:** Research the target company.

- **Industry & vertical:** Sector, sub-sector, Nordic/EU footprint
- **Regulatory exposure:** Which Fit for 55 / CSRD / CBAM / NIS2 deadlines apply and when
- **Size & financials:** Revenue band, headcount, public signals (press, filings, news)
- **Current pain points:** Compliance risk, operational inefficiency, carbon cost exposure
- **Tech stack signals:** ERP (SAP/Visma/IFS/Dynamics), BIM use, fleet/IoT presence
- **DWS fit score:** Which products address the highest-priority gap (DWS IQ Base, Firehorse Report, Lifetime Fleet, Sovereign Cloud)
- **Competitive context:** Are they using a known competitor? What's the switching angle?

**Investor pitch:** Research the target firm.

- **Firm type & stage focus:** VC, family office, PE, angel, corporate VC — and their typical cheque size / stage
- **Portfolio signals:** Do they hold industrial, climate-tech, or B2B SaaS companies? Relevant names.
- **Thesis alignment:** What is their stated investment thesis? Where does DWS IQ fit?
- **Fund cycle:** Are they actively deploying? Recent closes or dry-powder signals.
- **Relationship path:** Warm intro route, LP overlap, mutual portfolio company
- **Competitive dynamic:** Have they backed a direct competitor?

Output (both types): 300–500 words. Bullet-structured. No speculation — cite sources.

---

### 4.2 Person Investigation — Part 2

Research the specific named contact. Applies to both pitch types.

- **Role & seniority:** Title, reporting line, decision authority (buyer / influencer / cheque-signer)
- **Tenure:** How long in role — new executives and new partners move fast, long-tenured need proof
- **Public footprint:** LinkedIn, conference talks, published articles, press quotes
- **Stated priorities:** What have they said publicly about sustainability, digital transformation, compliance, or investment thesis?
- **Personal opening angle:** One specific, non-creepy hook that shows you did homework
- **Preferred channel:** Email, LinkedIn, warm intro route

Output: 150–250 words. Focused on what makes this person the right contact and what tone/angle will land.

---

### 4.3 Letter Wedge Formation — Part 3

The outbound message. Maximum 250 words. Four-beat structure for both types:

1. **Hook (1–2 sentences):** Specific to the person — their words, their portfolio/company news, their deadline or mandate. Never a generic opener.
2. **Problem / gap statement (2–3 sentences):** Names their pain or thesis gap in their language. No DWS product names yet.
   - _Client:_ compliance risk, manual effort, cost exposure
   - _Investor:_ missing exposure to Nordic industrial AI / Fit for 55 wave
3. **Value wedge (2–3 sentences):** One clear, specific outcome. Quantified where possible.
   - _Client:_ "15–25% efficiency gain", "audit-ready in weeks", "€6,500 pilot, results in 30 days"
   - _Investor:_ "€2.68B Nordic TAM", "two enterprise pilots contracted Q1/2026 at €29,950 each — €59,900 booked", "150k SAFE at [cap]". Never quote an MRR range; see `docs/TRACTION_CANONICAL.md` §3.
4. **Call to action (1 sentence):** Low-friction ask — a 20-minute call, a deck link, or a question that invites a reply. Never "let me know if you're interested."

Tone: Peer-to-peer. No buzzwords. Write as Risto Anton Päärni, CEO, Lifetime Oy unless instructed otherwise.

---

### 4.4 Appendix by Case — Part 4

A concise, tailored supporting section. Include only items relevant to this pitch type.

**Client pitch:**

- **Regulatory deadline table:** Deadlines this company faces (CSRD/EPBD/CBAM/ETS) with dates
- **Pilot reference:** Most relevant existing pilot with outcome metrics (anonymised or named if approved)
- **Product bundle recommendation:** Exact product(s), pricing tier, and entry offer
- **ROI reference:** Hours saved, fines avoided, tender revenue protected — quantified
- **Next step for sales manager:** Who to cc, what to attach, what calendar link to include

**Investor pitch:**

- **Cap table / SAFE terms:** Current round, valuation cap, discount, total raise target, amount remaining
- **Traction table:** MRR, pilot count, key logos, growth rate
- **Market proof:** TAM reference (€2.68B+ Nordic), regulatory tailwind dates
- **Use of funds:** How this cheque size maps to milestones (e.g., 150k → 3 enterprise pilots closed)
- **Intro ask:** Specific next step — deck, data room link, warm intro to LP, or calendar

Output: 200–400 words. Bullet and table format preferred.

---

## 5. File Naming & Storage

**Client pitch:**

```
sales-outreach/PITCH_<COMPANY>_<CONTACT>_<YYYYMMDD>.md
```

**Investor pitch:**

```
investor-outreach/PITCH_<FIRM>_<PERSON>_<YYYYMMDD>.md
```

Examples:

```
sales-outreach/PITCH_NCC_SUSTAINABILITY_LEAD_20260510.md
sales-outreach/PITCH_SKANSKA_ESG_BERGSTROM_20260510.md
investor-outreach/PITCH_TECHSEED_BENTZEL_20260510.md
investor-outreach/PITCH_SIEMENS_ENERGY_AHLBERG_20260510.md
```

---

## 6. Quality Gate

Before a pitch file is finalised, verify:

**Both types:**

- [ ] Pitch type declared at the top (`Type: Client` or `Type: Investor`)
- [ ] All four parts present
- [ ] Part 2 names one specific fact about the contact (not just their title)
- [ ] Part 3 is ≤250 words
- [ ] No generic filler sentences ("I hope this finds you well", "We are a leading provider of…")
- [ ] Correct storage path for pitch type

**Client pitch only:**

- [ ] Part 1 cites at least one specific regulatory deadline for this company
- [ ] Part 4 includes a product bundle recommendation with price

**Investor pitch only:**

- [ ] Part 1 identifies fund stage focus and at least one portfolio signal
- [ ] Part 4 includes current SAFE/round terms and a traction table

---

## 7. Related Standard: Field Note Newsletter

Weekly sales field notes (format: `docs/field-notes/YYYY-MM-DD-<topic>-digest-wNN.md`) feed Part 1 DD with market intelligence. Run before pitching to ensure DD reflects current news and regulatory signals.

Companion pitch list format: `sales-outreach/YYYY-MM-DD-<region>-targeted-pitch-list.md`
