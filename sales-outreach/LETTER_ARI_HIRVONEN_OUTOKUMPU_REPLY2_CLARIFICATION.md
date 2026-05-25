<!--
VERSION AND AGENT HISTORY
Document: LETTER_ARI_HIRVONEN_OUTOKUMPU_REPLY2_CLARIFICATION.md
Version: 1.2
Last-Updated: 2026-05-25
Status: DRAFT — Risto to send AFTER the two referenced attachments
        exist as files. Currently blocked: line says "(attached)"
        referring to a detailed pilot sheet + NVIDIA hardware line
        items, neither of which exists yet. See §Attachments below.

Sessions & Modifications:
  - 1.2 | 2026-05-25 | Boardy refinement: EN version, longer, adds
                       anti-misread anchor ("paid pilot, not a free
                       trial") and pilot scope detail (one Forta
                       line, IP review flow, before/after measurement
                       on disclosure time + IP coverage + sales-eng
                       hours reclaimed). References two attachments.
                       FI translation kept parallel.
  - 1.1 | 2026-05-25 | Concrete commercial terms replace the soft
                       v1.0 wording. Now states price, duration,
                       effort split, and the compute/HW pass-through.
                       Earlier "Outokumpu sponsoroi + sovitaan lyhyt
                       aloitus" framing was tentative; this version
                       is the deal proposal in plain Finnish.
  - 1.0 | 2026-05-25 | Soft anchor draft ("jos tämä on oikea suunta,
                       Outokumpu sponsoroi pilotin..."). Never sent;
                       superseded.

Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-7) — recording only; line drafted
       by Risto.
Purpose: One-line commercial-terms proposal to Ari Hirvonen after
         the bilingual material package. States the pilot as paid,
         3 months at 50 % effort, €24k from Outokumpu's budget,
         with compute and hardware billed separately on top. Skips
         the soft commitment-test framing of v1.0 — moves straight
         to the actual deal shape.
Branch: claude/exa-openclaw-integration-YnDpO
Date: 2026-05-25
Owner: risto.paarni@lifetime.fi
Recipient: Ari Hirvonen, Patent IP Director, Outokumpu Oyj
Transport: Amazon SES SMTP (Risto's client), within existing thread
Sender: risto.paarni@lifetime.fi
Funnel step: Step 3 hinge — commercial-model clarification + Forta-
             line pivot question. Exit Step 3 when Ari names a line
             AND confirms the wedge applies.
-->

# Reply 2 — Clarification (Finnish) — Ari Hirvonen (Outokumpu)

**To:** ari.hirvonen@outokumpu.com *(same thread)*
**From:** risto.paarni@lifetime.fi

---

### English (canonical — Boardy refinement)

> Ari, this is a paid pilot, not a free trial. Scope is 3 months at 50% effort, €24k from Outokumpu's budget, with compute and hardware billed separately on top. The pilot covers one Forta line, IP review flow, and before/after measurement on disclosure time, IP coverage, and sales-engineering hours reclaimed.
>
> Here is the detailed pilot sheet and the NVIDIA hardware line items (attached).

### Finnish (parallel)

> Ari, tämä on maksettu pilotti, ei ilmainen kokeilu. Laajuus on 3 kk, 50 % työpanos, €24k Outokummun budjetista, ja compute sekä hardware laskutetaan erikseen päälle. Pilotti kattaa yhden Forta-linjan, IP-review-prosessin sekä ennen/jälkeen-mittauksen disclosure-ajalle, IP-kattavuudelle ja vapautuneille myyntiteknisille tunneille.
>
> Liitteenä pilotin yksityiskohtainen määrittely ja NVIDIA-raudan rivierittely.

---

## Why this line works

| Element | Function |
|---|---|
| "Paid pilot, not a free trial" / "Maksettu pilotti, ei ilmainen kokeilu" | **Anti-misread anchor.** Removes any ambiguity Ari might have inherited from the soft v1.0 framing or the package's "at cost" wording. The negation ("not a free trial") is the cleanest possible commercial test. |
| "3 months at 50% effort, €24k from Outokumpu's budget" | States resource shape + price + budget owner in one phrase. ~1.5 person-months of Lifetime time at €16k/month effective rate — defensible senior consulting rate. Naming the budget owner ("Outokumpu's budget") pre-empts the CFO routing question. |
| "Compute and hardware billed separately on top" | Pass-through clause. Keeps Lifetime out of the infrastructure margin game. Vendor stack named in the attached NVIDIA line items. |
| "One Forta line, IP review flow, before/after measurement" | **Scope in one sentence.** Maps directly to the 3 sections of the material package: product line = §1, IP review flow = §2 mechanism, before/after = §3 measurement. No new content; tighter restatement. |
| "Here is the detailed pilot sheet and NVIDIA hardware line items (attached)" | Signals proposal-ready commercial maturity. **But requires the two attachments to actually exist** — see §Attachments below. |

---

## Attachments — BLOCKING

The line says "(attached)" referring to two artifacts. **Neither exists as a file yet.** Cannot send Boardy's line as-is without making the attachments real or softening the line.

### Required attachments

| Attachment | Purpose | What it contains | Status |
|---|---|---|---|
| **Detailed pilot sheet** (PDF, ~1-2 pages) | Proposal-grade pilot definition Ari can route to Procurement (R20) + CFO (R23) | Parties, duration (3 mo), effort (50%), price (€24k ex-VAT), compute/HW pass-through clause, scope (one Forta line + IP review flow), measurement (cycle time, IP coverage %, sales-eng hours), milestones (weekly checkpoints), deliverables (KYA-governed pipeline + audit log + before/after report), success criteria, exit / commercial-conversion clause, sign-off lines | **DOES NOT EXIST YET** |
| **NVIDIA hardware line items** (PDF or one-page table) | Procurement-ready itemised list, BYO-vs-pass-through clear | Item, SKU, qty, unit price / cost basis, total. Examples: Jetson Orin Nano units, DGX Spark hours estimate; EU-sovereign cloud monthly recurring (Scaleway, Aiven). BYO option flagged per line | **DOES NOT EXIST YET** |

### Three options before send

1. **Create both attachments, then send** *(highest quality, takes ~1-2 hours of Risto time + agent scaffolding)*. Recommended.
2. **Soften the line** — replace "Here is the detailed pilot sheet and the NVIDIA hardware line items (attached)" with "I'll send the detailed pilot sheet and NVIDIA hardware line items within 24 hours." Then create them within 24 hours. Trades polish for speed; only do this if Ari is in the inbox today and the alternative is silence.
3. **Drop the attachment sentence** from this send. Send the commercial-terms paragraph alone. Mention the attachments in the next round when they exist. Lowest risk but loses commercial momentum.

### What I (agent) can scaffold

- **Pilot sheet skeleton:** structure, all section headers, default values filled where the material package already specified them (3 mo, 50%, €24k, compute/HW pass-through, scope, measurement). Blanks for milestones, success criteria, sign-off. Risto fills the remaining specifics + reviews.
- **NVIDIA line items skeleton:** table with the SKUs, columns, and BYO/pass-through flags filled in based on what `DWS_STANDARDS_LIBRARY.md` §3.6 and the package's compute-and-hardware subsection already specify. Risto fills current NVIDIA / Scaleway / Aiven prices (which I don't have).

If Risto says go on either or both, I scaffold in the next turn.

## Funnel state after this line is sent

This line is more aggressive than the v1.0 soft anchor — it moves the conversation from "is this the right direction?" to "here is the deal shape." That shifts the response space:

- **Step 3 (Prove the wedge):** held 🟡 only until Ari engages with the terms. The €24k anchor + 3-month structure are concrete enough that any meaningful reply is a Step 3 exit signal.
  - **"OK, lähdetään / let's go"** → Step 3 exits. Move directly to Stage-1 scoping kick-off. Enter Step 4 (CSO + product-line VP loop) in parallel.
  - **"Sopii, mutta haluan käydä läpi budjetin / sopimuksen"** → Step 3 exits. Schedule contract + budget review with Outokumpu Procurement / Finance (R20 / R23). This is normal enterprise-deal motion, not a stall.
  - **Counter on price or scope** ("€24k kuulostaa kovalta" / "voiko olla 2 kk?") → Step 3 exits — engaged on terms means he sees the value. Negotiate; do not discount under €18k or under 2 months without margin recalc.
  - **Asks for ROI justification** ("näytä mitä saamme €24k vastaan") → Step 3 holds 🟡. Send the cycle-time benchmark (Outokumpu-Forta specific) as a ROI one-pager — the numbers are already there.
  - **Silence > 5 business days** → bump with tender-deadline angle from `INTRO_ARI_HIRVONEN_OUTOKUMPU.md` §Thread step 3.
  - **"Ei sovi nyt" / no** → walk; document reason; revisit Q4 2026.

## What this concrete-terms send buys vs. the soft v1.0 alternative

| Dimension | v1.0 (soft, never sent) | v1.1 (this version) |
|---|---|---|
| Commitment test | Yes/no on direction | Yes/no on the actual deal |
| Price transparency | Implied | One named number (€24k) |
| Time-to-decision | Likely 2 more rounds before €number lands | One round — €number is on the table |
| Risk if Ari declines | Low — soft no, easy to recover | Higher — explicit no, requires repositioning |
| Risk if Ari accepts | "OK what's the price" round still needed | Closes faster — directly to contract motion |

Choosing v1.1 over v1.0 = trading slower nurture for faster commercial clarity. Right call given Ari's warm Wednesday reply ("laita vain materiaali jakoon"), which signalled he is past the awareness phase.

## Related files

- `sales-outreach/LETTER_ARI_HIRVONEN_OUTOKUMPU_MATERIAL_PACKAGE.md` — the bilingual package this clarifies. Updated to use the two-stage commercial model going forward.
- `sales-outreach/INTRO_ARI_HIRVONEN_OUTOKUMPU.md` — outreach plan + stakeholder map.
- `sales-outreach/CYCLE_TIME_BENCHMARK_OUTOKUMPU_FORTA.md` — line-specific worked example, attach after Ari names the sub-line.
- `docs/SALES_FUNNEL_WORKFLOW_ENTERPRISE.md` §7 — funnel-state row for this prospect.
