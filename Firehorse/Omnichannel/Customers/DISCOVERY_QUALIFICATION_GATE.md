# Figure Out Who's a Serious Prospect — Discovery Qualification Gate

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/fix-linkedin-channel-QK460 | Date: 25.03.2026 | Changes: Initial creation — hard gate between demo interest and engineering resource commitment, based on founder lessons learned from wasted pilots

Session Links & References:
  - Claude Code (claude/fix-linkedin-channel-QK460): https://github.com/blogtheristo/dws6/commits/claude/fix-linkedin-channel-QK460

Document Status:
  - Created: 25.03.2026
  - Last Modified: 25.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

| Field | Value |
|-------|-------|
| **Document ID** | DWS-SALES-DISCO-001 |
| **Version** | 1.0 |
| **Date** | 2026-03-25 |
| **Owner** | Risto Anton Päärni, CEO |
| **Status** | Active |
| **Funnel Stage** | Between Stage 3 (Call/Demo) and Stage 5 (Proposal) |
| **Hard Rule** | Do NOT commit engineering resources until Gate 2 is passed |

---

## Rule Zero: Stop and Look Around

> We need to stop coding, building, recruiting, fund raising, etc., and take
> stock of what changed around you. Or your company will die.

This document exists because of Rule Zero. The natural state of a startup is motion — shipping code, booking demos, chasing funding. That momentum feels like progress. It's not. It's activity.

**Progress is closing the gap between what you're building and what someone will pay for.** If you haven't checked whether that gap exists lately — or whether it shifted — then every hour of engineering, every demo, every pitch deck is a bet you're placing blind.

Rule Zero says: before you commit resources to anything — a prototype, a pilot, a hire, a fundraise — **stop and verify your assumptions are still true.** Markets move. Buyers reorg. Regulations shift. Competitors appear. The deal that was real six weeks ago may be dead today for reasons that have nothing to do with your product.

**When to invoke Rule Zero:**
- Before committing engineering to a custom demo or prototype
- Before extending a pilot that hasn't converted
- Before starting a fundraise (is the story still true?)
- When a deal stalls and no one can explain why
- When you catch yourself saying "we just need to build one more thing"
- Quarterly, whether you think you need to or not

**What Rule Zero looks like in practice:**
1. Stop what you're doing
2. List your top 3 assumptions about your market, your buyer, and your product
3. For each one, ask: "What evidence do I have that this is still true?"
4. If the answer is "I think so" or "it was true 3 months ago" — that's a red flag
5. Go talk to customers, not to confirm, but to discover what changed

---

## The Mistake This Prevents

> In my unbridled enthusiasm for impressing a potential customer, I never asked
> the user champion or the potential buyer what were the steps for turning the
> demo into a purchase order. I made a ton of assumptions — all of them wrong.
> And most importantly I wasted the most precious things a startup has —
> engineering resources, time, and money.

**Root cause:** We had product/market fit with the *user* (the person who sees the demo and loves it) but not with the *organization* that controls the budget and the path to deployment and scale.

### The Core Lesson: Multiple Product/Market Fits

In complex enterprise sales, there is not one product/market fit. There are several — each with a different person, different criteria, and different definition of success:

| PMF | Who | What they care about | Their "yes" means |
|-----|-----|----------------------|-------------------|
| **PMF 1 — User fit** | End user, operator, analyst | "Does it solve my daily pain?" | "I'd use this every day" |
| **PMF 2 — Champion fit** | Internal advocate, recommender | "Can I stake my reputation on this?" | "I'll push this through the org" |
| **PMF 3 — C-suite fit** | CFO, CIO, CTO | "Is this a defensible product I can bet my org on?" | "I'll sponsor this at the executive level" |
| **PMF 4 — IT/Security fit** | IT ops, CISO, compliance | "Can we deploy, secure, and maintain this?" | "It meets our standards" |
| **PMF 5 — Procurement fit** | Procurement, legal, finance | "Does it pass our vendor process?" | "PO approved" |
| **PMF 6 — Scale fit** | Operations, transformation office | "Can this roll out across the enterprise?" | "Approved for multi-site deployment" |

### PMF 3 — The Defensibility Gate (CFO / CIO / CTO)

PMF 3 is the hardest to earn and the easiest to lose. Users love the product. The champion is pushing it. Then the CTO asks: *"What happens if this vendor disappears in 18 months?"* If you don't have an answer, the deal dies in the executive review.

C-suite doesn't evaluate features. They evaluate **risk.** Their question is not "does it work?" but "can I defend this decision to the board?"

| C-suite role | Their defensibility question | What they need from you |
|--------------|------------------------------|------------------------|
| **CFO** | "What's the financial risk if this fails or the vendor folds?" | ROI model, contract exit terms, cost of switching back, comparison to build-vs-buy |
| **CIO** | "Does this fit our architecture, or does it create technical debt?" | Integration architecture, data sovereignty, compliance certifications, migration path |
| **CTO** | "Is the technology real, or is it a demo wrapped in promises?" | Technical deep dive, source code access or escrow, SLA with teeth, product roadmap with dates |

**What makes a product defensible at C-suite level:**

- **Vendor viability** — Revenue, funding, customer count, team size. A startup selling to enterprise must answer "why won't you die?" credibly.
- **Data sovereignty** — Where does our data live? Can we get it back? (DWS answer: EU-only, Finland/Germany, full export, GDPR-compliant)
- **Lock-in risk** — What happens if we leave? Is there an open standard, data export, or migration path? (DWS answer: JSON export, standard SQL, MCP protocol)
- **Compliance coverage** — Can we point auditors at this? (DWS answer: CSRD, EU ETS, CBAM, Fit for 55, EU AI Act — scored, not just checked)
- **Roadmap credibility** — Are you shipping or are you promising? (DWS answer: 16 agents live, MCP endpoint, production customers on 12+ month retention)

**How to qualify PMF 3 in a deal:**

> "Who at the executive level would need to approve a product like ours? What would they need to see to say yes?"

If the champion can't name the executive or describe what they'd need — you don't have PMF 3 access yet. Don't build until you do.

> "Has your CTO/CIO evaluated a product like this before? What killed the last one?"

The answer tells you exactly what defensibility criteria they'll apply to you.

A demo nails PMF 1. A prototype nails PMF 2. **Neither tells you anything about PMF 3–6.** Excitement that dies in the executive review is Champion fit without C-suite fit. A signed pilot that never deploys is Buyer fit without IT fit.

### Three Hard Rules

**1. In complex sales there are multiple product/market fits — Users, Buyers, etc. — each with different criteria.**
Map all the PMFs for each prospect. Don't assume that winning the user means winning the deal. Each stakeholder has different success criteria and different veto power.

**2. Don't invest time and resources in building on-demand prototypes if you don't know the path to a purchase order.**
Before writing a single line of custom code: can you draw the path from demo to signed PO on a whiteboard? If not, you're building blind. Engineering hours are the most expensive thing a startup has — never spend them to impress, spend them to close.

**3. Use polite forcing functions (e.g. cancelable purchase orders) to discover who else needs to say "yes".**
The cancelable PO is not a closing tactic. It's a discovery tool. Every objection reveals a stakeholder. Every "I can't sign yet because..." maps a gate. The prospect's "no" teaches you more than their "cool demo" ever will.

---

## Gate 1 — Pre-Demo Qualification (Before ANY Demo)

Answer these before scheduling a demo. If 3+ are unknown, the demo is premature — do more discovery first.

### 1.1 Competitive Landscape

| # | Question | Ask the champion | Red flag |
|---|----------|-----------------|----------|
| 1 | Are you evaluating other vendors for this? | "Who else are you looking at?" | They won't say — means you're column fodder |
| 2 | What stage are you in with those vendors? | "Have you seen demos from others already?" | They already have a frontrunner and need you for price comparison |
| 3 | What would make you pick us over them? | "What's missing from what you've seen?" | "Nothing, we just want options" |

### 1.2 Budget & Authority

| # | Question | Ask the champion | Red flag |
|---|----------|-----------------|----------|
| 4 | Is there a budget allocated for this? | "Is this budgeted for this year, or would it need new approval?" | "We'll figure it out later" |
| 5 | Who signs the purchase order? | "Who has the authority to approve a spend of €30–60K?" | Champion doesn't know or says "I'll find out" |
| 6 | What is the procurement process? | "Walk me through the steps from 'we want this' to 'PO signed'" | No process exists — means no one has ever bought software this way |

### 1.3 Timeline & Urgency

| # | Question | Ask the champion | Red flag |
|---|----------|-----------------|----------|
| 7 | When do you need this live? | "What's driving the timeline?" | No deadline, no regulatory pressure, no event |
| 8 | What happens if you do nothing? | "What's the cost of not solving this in 2026?" | "It's not critical" — means there's no internal pressure |

### 1.4 Decision-Making Unit

| # | Question | Ask the champion | Red flag |
|---|----------|-----------------|----------|
| 9 | Who else needs to be involved? | "Who from IT/security/legal needs to approve?" | "Just me" — almost never true for €30K+ enterprise deals |
| 10 | Who would deploy and maintain this? | "Who runs integrations and onboarding internally?" | No one assigned — means deployment will stall |
| 11 | Have those people been briefed? | "Can we get them in the next meeting?" | Champion is protective — doesn't want you talking to others |

### 1.5 Champion Credibility

| # | Question | Observe, don't ask directly | Red flag |
|---|----------|----------------------------|----------|
| 12 | Is the champion in a business unit or innovation/evaluation group? | Check title, org chart, LinkedIn | Innovation labs rarely have procurement power |
| 13 | Has this person bought software before? | "What's the last tool you brought in? How did that go?" | Never bought anything — no internal credibility to push it through |
| 14 | Can the champion mobilize the org? | "Can you introduce me to the budget owner this week?" | Deflects or delays — they can't |

---

## Gate 2 — Post-Demo Qualification (Before Committing Engineering)

Demo went well. Champion is excited. **STOP.** Before writing a single line of custom code, integration, or pilot setup:

### 2.1 Success Criteria

| # | Question | Why it matters |
|---|----------|---------------|
| 15 | "What does success look like for you to get an internal yes?" | If they can't articulate it, they can't sell it internally |
| 16 | "What metrics would you show your boss after the pilot?" | Forces them to think about internal justification |
| 17 | "What would make you NOT buy after a successful pilot?" | Surfaces hidden blockers (IT policy, competing project, reorg) |

### 2.2 Willingness to Pay (The Litmus Test)

| # | Question | Why it matters |
|---|----------|---------------|
| 18 | "Would you pay for a 4-week proof-of-concept at €X?" | If they won't pay for a PoC, they won't pay for the product |
| 19 | "Can we do a paid pilot instead of a free demo extension?" | Free pilots have zero internal commitment — they die silently |
| 20 | "What's the budget approval process for a €5–10K pilot?" | Tests whether they can actually move money |

### 2.3 Org Fit (PMF 2)

| # | Question | Why it matters |
|---|----------|---------------|
| 21 | "Who in IT needs to approve the integration?" | No IT approval = no deployment |
| 22 | "What's your security/vendor assessment process?" | Enterprise security reviews take 2–6 months — factor it in |
| 23 | "Is there an existing vendor you'd need to replace?" | Switching costs and politics can kill deals |
| 24 | "What's your contract/legal review timeline?" | Legal can add 4–12 weeks to any deal |

---

## Scoring: Go / Dig Deeper / Walk Away

After Gates 1 + 2, score the deal:

| Score | Criteria | Action |
|-------|----------|--------|
| **GO** (18+ of 24 answered, no red flags) | Budget exists, timeline is real, decision-maker identified, champion can mobilize, willing to pay for PoC | Commit engineering resources. Send proposal. |
| **DIG DEEPER** (12–17 answered, 1–2 red flags) | Some unknowns but champion is engaged and responsive | Schedule a second discovery call. Get missing answers before committing anything. Max 2 weeks to resolve. |
| **WALK AWAY** (< 12 answered, or 3+ red flags) | No budget, no timeline, no authority, innovation lab, won't pay for PoC | Thank them. Add to nurture list. Revisit in 6 months. Do NOT build anything. |

**Hard rule:** No engineering time, no custom demo, no integration work, no pilot setup until score is GO.

---

## The Cheap Hack: Questions ARE the Qualifier

The validation hack for tire-kicking is embarrassingly simple: **ask the org-fit questions and see if they can answer them.**

A real buyer can answer all of these off the top of their head. A tire-kicker can't answer any.

| Question | Real buyer answers | Tire-kicker answers |
|----------|--------------------|---------------------|
| What are the success criteria for getting an order? | Specific KPIs, board presentation requirements | "We'll figure it out" |
| What's the decision timeline? | "Budget cycle closes in Q3" or "Board meets March 15" | "No rush" |
| Does a budget exist? | "Yes, €X allocated under project Y" | "We'd need to find budget" |
| Who has purchase authority? | Names a person with a title | "I think my boss" |
| What's IT/Security/Compliance's approval process? | "Security review takes 6 weeks, here's the form" | "I don't know, probably fine" |
| What's the expected scaling path? | "Start with 2 sites, roll out to 15 by Q4" | "Let's just see" |

**The hack:** If they can answer 5 of 6, you have a real deal. If they can answer 2 or fewer, it's a tire-kicking exercise — no matter how enthusiastic the demo was. Save your engineering hours.

**Why this works:** These questions cost nothing to ask but immediately separate prospects who have done internal work (talked to procurement, secured budget, aligned stakeholders) from those who are just "exploring." The ones who've done the work will appreciate that you're professional enough to ask. The ones who haven't will either step up or self-select out.

---

## The Nuclear Qualifier: The Fully Cancelable Purchase Order

After the demo, ask the prospect to sign a **fully cancelable purchase order.**

This sounds aggressive. It's not. It's the single most effective qualification tool we've found, and here's why: **you're not trying to close — you're trying to learn.**

### What happens when you ask

| Response | What it tells you | Action |
|----------|-------------------|--------|
| "We can't sign that yet" | **This is the good outcome.** Now ask: "What would need to happen before you could?" | You've just mapped their entire internal approval process for free |
| "I'd need to get X, Y, and Z involved" | You now know every stakeholder and gatekeeper in the deal | Ask for intros to X, Y, and Z — these are the people who actually matter |
| "We already have a vendor selected" | They were doing demo theater — making their selection look fair by getting multiple bids | Thank them and move on. You just saved months of engineering time. |
| "Let me talk to procurement" | They're real. They're testing their own org's readiness. | Help them. Send a clean PO template they can route internally. Track where it gets stuck. |
| They actually sign it | Rare, but it happens. Now you have a committed customer. | Celebrate. Then ask all the deployment questions anyway. |

### Why this works

The cancelable PO is not a closing tactic. It's a **discovery accelerator.**

- **It excludes tire-kickers** — prospects who aren't ready to make a purchase decision, or those doing demo theater to make a pre-selected vendor look fair
- **It surfaces the real org chart** — every objection to signing reveals a stakeholder you didn't know about
- **It maps the end-to-end approval process** — "I can't sign because X" means X is a gate you need to understand
- **It identifies the deployment path** — who in IT, compliance, security, and operations needs to say yes, and what are their decision processes
- **It creates urgency without pressure** — "fully cancelable" means zero risk to them, but the act of routing a PO internally forces their org to take a position

**It's more than OK if they say no.** In fact, "no" with an explanation is more valuable than "let me think about it." Every "no" teaches you something a demo never would.

### DWS Implementation

After a successful demo where the champion shows genuine interest:

> "Based on what you've seen, I'd like to send you a fully cancelable pilot agreement — €29,950 for 5 months. You can cancel any time, no penalty."
>
> "The reason I'm asking is not to pressure you. It's because routing this internally will tell both of us whether your organization is ready. If it gets stuck somewhere, that's useful information — it shows us who else we need to talk to."
>
> "If you're not ready to route it, that's completely fine too. Just help me understand what would need to happen first."

**Template:** `Partners/PILOT_AGREEMENT_CANCELABLE.md` (to be created)

---

## Anti-Patterns (Things We Did Wrong)

| Anti-pattern | What happened | What to do instead |
|--------------|---------------|-------------------|
| **Demo-first, qualify-later** | Built custom demo for unqualified lead, wasted 2 weeks of engineering | Qualify first with Gate 1, demo only after 10+ questions answered |
| **Champion = Buyer assumption** | Treated the excited user as the decision-maker | Always ask: "Who signs the PO?" on the first call |
| **Free pilot = foot in the door** | Gave away free pilot, prospect had zero commitment | Always charge for pilots — even €5K creates skin in the game |
| **Assumed the buying process** | Never asked how POs get approved at their company | Ask: "Walk me through the steps from demo to PO" |
| **Ignored innovation lab risk** | Demo'd to an innovation team with no procurement power | Check org chart — business unit > innovation lab |
| **Built before confirming org fit** | Had user PMF, missed org PMF entirely | Gate 2 exists specifically for this — run it before writing code |

---

## Integration with Existing Sales Workflow

This gate sits between stages in `FIREHORSE_SALES_WORKFLOW.md`:

```
Stage 1: Lead Import
Stage 2: LinkedIn Outreach
Stage 3: Call / Demo Request
         ┌──────────────────────────┐
         │  >>> GATE 1 <<<          │
         │  Pre-Demo Qualification  │
         │  (14 questions)          │
         └──────────────────────────┘
Stage 3b: Demo (30 min)
         ┌──────────────────────────┐
         │  >>> GATE 2 <<<          │
         │  Post-Demo Qualification │
         │  (10 questions)          │
         │  Score: Go / Dig / Walk  │
         └──────────────────────────┘
Stage 4: Proposal (only if GO)
Stage 5: Negotiation
Stage 6: Close
```

**CRM Fields to Add:**

| Field | Type | Values |
|-------|------|--------|
| `gate1_score` | integer | 0–14 (questions answered) |
| `gate1_red_flags` | integer | count of red flags |
| `gate2_score` | integer | 0–10 (questions answered) |
| `gate2_red_flags` | integer | count of red flags |
| `qualification_status` | enum | `unqualified`, `gate1_passed`, `gate2_go`, `gate2_dig_deeper`, `gate2_walk_away` |
| `pmf_user` | boolean | Champion/user validated product value |
| `pmf_org` | boolean | Budget, authority, process confirmed |
| `willing_to_pay_poc` | boolean | Agreed to paid PoC/pilot |
| `decision_maker_identified` | text | Name + title of PO signer |
| `buying_process_mapped` | boolean | Steps from demo to PO documented |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `CONSTRUCTION_CXO_CALL_SCRIPT.md` | Call script — add Gate 1 questions to Phase 2 (Discovery) |
| `FIREHORSE_SALES_WORKFLOW.md` | End-to-end workflow — insert gates between stages |
| `CAPTAIN_ACQUISITION_FUNNEL.md` | 11-stage funnel — add qualification gates |
| `sales-outreach/enterprise-sales.md` | MEDDPICC framework — this gate operationalizes it |

---

## One-Page Cheat Sheet (Print This)

Before committing ANY engineering resource, confirm:

1. Who signs the PO? (name, not "someone")
2. Is there budget this year? (yes/no, not "probably")
3. What are the steps from demo to PO? (mapped, not assumed)
4. Are other vendors being evaluated? (know your position)
5. Will they pay for a PoC? (skin in the game)
6. Is the champion in a business unit? (not innovation lab)
7. Who else needs to approve? (IT, security, legal, procurement)
8. What happens if they do nothing? (urgency test)
9. What does success look like? (their words, not yours)
10. Can we meet the budget owner this week? (mobilization test)

**If you can't answer 8 of 10: DO NOT BUILD. DO MORE DISCOVERY.**
