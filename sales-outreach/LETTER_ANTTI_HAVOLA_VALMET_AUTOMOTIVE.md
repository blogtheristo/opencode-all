<!--
VERSION AND AGENT HISTORY
Document: LETTER_ANTTI_HAVOLA_VALMET_AUTOMOTIVE.md
Version: 1.0
Last-Updated: 2026-06-21
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-8)
Purpose: Cold email draft for Antti Havola, VP Defense Business, Valmet
         Automotive. Trigger: Valmet Automotive–Patria 6x6 collaboration
         announced at Eurosatory 2026 — building Patria's 6x6 armored
         vehicles at Uusikaupunki, scaling to hundreds of units/year.
         Wedge: the AI/data layer of a defense ramp must be EU-sovereign
         and attributable, or it undercuts the security-of-supply claim
         the program was announced under. DWS IQ keeps it sovereign and
         audit-ready while removing operational friction from the ramp.
Introduced-In: PR-pending (branch claude/patria-valmet-outreach-xrhsv3)
Code-Version: 1.0
Branch: claude/patria-valmet-outreach-xrhsv3
Date: 2026-06-21
Owner: risto.paarni@lifetime.fi
Recipient: Antti Havola, VP Defense Business, Valmet Automotive
Transport: Amazon SES SMTP only (per CLAUDE.md non-negotiable rule #4)
Sender: risto.paarni@lifetime.fi (never noreply@, per CLAUDE.md non-negotiable rule #3)
-->

# Email Draft: Antti Havola (VP Defense Business, Valmet Automotive)

**To:** antti.havola@valmet-automotive.com (verify before send)
**From:** risto.paarni@lifetime.fi
**Subject:** Scale the Uusikaupunki line without compromising security of supply — 20 min?

---

Hei Antti,

Congratulations on the Patria 6×6 collaboration announced at Eurosatory — a real security-of-supply step, not a press line.

**DWS Intelligence amplifies human intelligence in regulated industries.** Concretely for Valmet Automotive: **DWS helps you scale the Uusikaupunki line without compromising security of supply — keeping the production AI and data layer EU-sovereign and attributable, while taking operational friction out of the ramp.**

With full capacity targeted for early 2027, the line's AI and data architecture is being decided over the next two quarters — which is exactly why I'm writing now.

Here is the gap. A line that scales to hundreds of armored vehicles a year scales on AI — production planning, supplier-readiness, quality-gate inspection, documentation, ramp forecasting. Every one of those touches the most sensitive data the program produces: vehicle specs, BOMs, supplier identities, schedules, defect data. For a commercial car line, where that AI runs is a footnote. For a **defense** line it is the exposure surface — and the default tools entering a new line are US-cloud SaaS and shadow copilots. "Security of supply across Europe" and "our production AI runs on US cloud" cannot both be true in front of the customer's security audit.

Two mechanics close it:

- **KYA-governed agent identity.** Every AI-mediated action on defense data is bound to a verified, cleared human, with an Article 12-style audit log. Export-control and traceability gaps close at the action layer — not in a policy PDF.
- **Sovereign NVIDIA infra.** EU-sovereign Jetson edge, DGX Spark, or EU cloud inside your perimeter. No US Cloud Act reach into defense production data. EU AI Act aligned; NIS2 supply-chain obligations answered with one URL instead of a remediation project.

The operational effect: the ramp gets AI assistance — fast — and the "where does your AI run, and who is accountable for each automated action?" question from Patria or the end customer has a one-line answer from day one. Less ramp friction, provable security of supply — not the usual trade-off.

And friction removal is only the entry point. **DWS Intelligence is the main product** — from week one your defense-business team gets a live EU defense-procurement and sovereignty-requirement radar tied to the platforms you build, plus supplier-readiness and supplier-security scoring on the new line. Easier today, sharper every quarter.

We are Espoo-based (Lifetime Oy, business ID 0772407-9) — same jurisdiction as both Valmet Automotive and Patria, which is itself part of the security-of-supply answer. 20 minutes at Uusikaupunki: one line workflow of your choice, modeled end-to-end.

Week of 2026-06-29 or 2026-08-10?

Best,
Risto

---

**Risto Anton Päärni**
Founder & CEO, Lifetime Oy
risto.paarni@lifetime.fi
+358 50 — — — — (phone available on request)
Laidunmaanraitti 2 A 25, 02330 Espoo
Business ID 0772407-9 · VAT FI07724079

DWS IQ 6 — EU-sovereign agentic infrastructure for regulated industries, NVIDIA Connect ISV.
Backed by Lifetime 24/7 EU-staffed support.
https://dws10.com

---

## Send mechanics

- **Transport:** Amazon SES SMTP (per `CLAUDE.md` non-negotiable rule #4 — no Resend).
- **Sender:** `risto.paarni@lifetime.fi` — never `noreply@` (per `CLAUDE.md` non-negotiable rule #3).
- **Recipient:** corporate domain `valmet-automotive.com` is confirmed; `firstname.lastname@` is the assumed scheme — verify the exact address for `antti.havola@valmet-automotive.com` before send. If unverifiable, route via the Valmet Automotive defense/corporate contact, or (preferred for a defense program first-touch) LinkedIn using the message in `INTRO_ANTTI_HAVOLA_VALMET_AUTOMOTIVE.md` thread step 1.
- **Attachments at first send:** none. After first reply, link to the anonymized "Sovereign AI for Defense-Adjacent Manufacturing" sector-pattern one-pager at `https://dws10.com/sovereign-defense-manufacturing/` (built; live once dws10.com next deploys — sector-pattern framing only, does **not** name Valmet Automotive or Patria).
- **Do not attach** any Valmet- or Patria-specific worked example until Antti has seen and approved the framing. Defense program — keep the first touch sector-pattern only.

## Follow-up (if no response in 5 business days)

> Antti, brief bump — one concrete question. As the Uusikaupunki line is tooled, the production-planning, quality, and supplier AI is being chosen right now. When Patria's or the end customer's security audit asks "where does that AI run, and who is accountable for each automated action on defense data?" — is there a one-line answer today? If not, that's the 20 minutes I'm asking for. Cheers, Risto

## Follow-up (post-call if scheduled)

To be drafted after the call date is set. Default plan: a one-page anonymized KYA-governed, sovereign-infra walkthrough modeled on a line workflow Antti nominates (a signed AI-assisted quality/document step with an Article 12-style audit entry), plus a two-party-motion proposal pulling in Valmet Automotive Plant/Ops + Quality + CISO, with the Patria door #2 mapped for a later stage.
