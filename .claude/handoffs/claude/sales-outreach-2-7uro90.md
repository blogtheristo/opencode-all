<!--
VERSION AND AGENT HISTORY
Document: .claude/handoffs/claude/sales-outreach-2-7uro90.md
Version: 1.1
Last-Updated: 2026-09-28
Agent: Claude Code (claude-sonnet-4-6)
Branch: claude/sales-outreach-2-7uro90
-->

# Branch Handoff: claude/sales-outreach-2-7uro90

**Task:** Sales Outreach 2 — second batch of DWS IQ 6 B2B prospect packages
**Status:** Batch 2 complete (Consti, GRK Infra, Kreate) + Batch 3 complete (YIT, SRV, Posti)
**Last commit:** see `git log --oneline -3` on this branch

---

## Work Completed

### Batch 2 (commit a62b4df)

| File                   | Prospect     | ICP Score | Vertical     |
| ---------------------- | ------------ | --------- | ------------ |
| INTRO_CONSTI_GROUP.md  | Consti Group | QUALIFIED | Construction |
| LETTER_CONSTI_GROUP.md | Consti Group | —         | Construction |
| INTRO_GRK_INFRA.md     | GRK Infra Oy | QUALIFIED | Construction |
| LETTER_GRK_INFRA.md    | GRK Infra Oy | —         | Construction |
| INTRO_KREATE_GROUP.md  | Kreate Group | STRONG    | Construction |
| LETTER_KREATE_GROUP.md | Kreate Group | —         | Construction |

### Batch 3 (this session, 2026-09-28)

| File                  | Prospect    | ICP Score | Vertical            |
| --------------------- | ----------- | --------- | ------------------- |
| INTRO_YIT_OYJ.md      | YIT Oyj     | STRONG    | Construction        |
| LETTER_YIT_OYJ.md     | YIT Oyj     | —         | Construction        |
| INTRO_SRV_YHTIOT.md   | SRV Yhtiöt  | QUALIFIED | Construction        |
| LETTER_SRV_YHTIOT.md  | SRV Yhtiöt  | —         | Construction        |
| INTRO_POSTI_GROUP.md  | Posti Group | QUALIFIED | Logistics/Transport |
| LETTER_POSTI_GROUP.md | Posti Group | —         | Logistics/Transport |

---

## Wedges Used

| Prospect     | Primary wedge                                   | Regulatory trigger |
| ------------ | ----------------------------------------------- | ------------------ |
| Consti Group | EPBD renovation contractor + CSRD Wave 1 burden | CSRD W1 + EPBD     |
| GRK Infra    | Best profit year + CSRD Wave 2 first deadline   | CSRD W2            |
| Kreate Group | Listed + CSRD active + both Espoo HQ            | CSRD W1            |
| YIT Oyj      | Dual exposure: builder Scope 1 + developer EPC  | CSRD W1 + EPBD     |
| SRV Yhtiöt   | Recovery story + cost efficiency + CSRD W1      | CSRD W1            |
| Posti Group  | Fleet Scope 1 + ETS2 direct cost from 2027      | CSRD + ETS2        |

---

## Verification Required Before Sending (HIC Actions)

### Consti Group

- [ ] Verify Esa Korkeela is still CEO (consti.fi investor relations)
- [ ] Identify ESG/Sustainability Director (Consti 2025 Annual Report, backup persona)

### GRK Infra

- [ ] Identify COO/CDO name via LinkedIn (private company, no public email pattern)
- [ ] Verify GRK 6.7% EBIT figure is publicly citeable (Alma Insights paywall check)

### Kreate Group

- [ ] Verify Timo Repo is still CEO (kreate.fi investor relations)
- [ ] Check Kreate H1 2026 results for updated hook

### YIT Oyj

- [ ] Verify Antti Inkilä is still CEO (yit.fi/en/investors)
- [ ] Identify Head of Sustainability (YIT 2025 Annual Report, backup persona)
- [ ] Check YIT H1 2026 results for margin update

### SRV Yhtiöt

- [ ] Verify Santtu Laitinen is still CEO (srv.fi/en/investors)
- [ ] Check SRV 2025 margin recovery figures
- [ ] Identify SRV Head of Sustainability (backup persona)

### Posti Group

- [ ] Verify Turkka Kuusisto is still CEO (posti.fi/en/about/posti-group/management)
- [ ] Identify CSO / Head of Fleet Operations (backup personas)
- [ ] Verify Posti email pattern (`@posti.com` or `@posti.fi`)
- [ ] Confirm ETS2 fleet threshold applicability (route length + vehicle weight verification)

---

## Pending: Market Signal → Sales Pipeline Logging

Per CLAUDE.md v1.6 Market Signal → Sales Pipeline Rule: the construction profitability
signals (Alma Insights 2020–2025 data) that drove Batch 2 prospect selection should be
logged to `docs/sales/SALES_OPPORTUNITIES_PIPELINE.md` with star scores.

All 6 prospects qualify: each has named buyer pain + budget line + regulatory trigger.
Suggested scores:

- Kreate Group: ★★★★☆ (active trigger + product fit + listed)
- YIT Oyj: ★★★★☆ (active trigger + largest ticket + listed)
- GRK Infra: ★★★☆☆ (strong margin + CSRD W2, no named contact yet)
- Posti Group: ★★★★☆ (ETS2 cost line 2027 = active trigger + large fleet)
- Consti Group: ★★★☆☆ (EPBD tailwind + CSRD, margin tight)
- SRV Yhtiöt: ★★★☆☆ (recovery story + CSRD, no active event trigger)

---

## Next Logical Work on This Branch

1. Log 6 prospects to `docs/sales/SALES_OPPORTUNITIES_PIPELINE.md` (Market Signal Rule)
2. Send sequences per NORDIC_SALES_STRATEGY.md cadence after CEO verifications
3. When Kreate ESG contact identified: draft `LETTER_KREATE_GROUP_ESG.md`
4. Logistics vertical expansion: DB Schenker Finland, Transval Group if Posti converts
