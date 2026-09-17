<!--
VERSION AND AGENT HISTORY
Document: LETTER_ARI_HIRVONEN_OUTOKUMPU_MATERIAL_PACKAGE.md
Version: 1.1
Last-Updated: 2026-05-25
Status: DRAFT — Risto to send from his client. Bilingual (FI + EN)
        so Ari can forward to Outokumpu board (board language = EN)
        without translation work.

Sessions & Modifications:
  - 1.1 | 2026-05-25 | Added English parallel to the Finnish package.
                       File renamed (was _MATERIAL_PACKAGE_FI.md →
                       _MATERIAL_PACKAGE.md, no language suffix since
                       it now carries both). Outokumpu's board operates
                       in English; bilingual single-email lets Ari
                       forward once with no extra work.
  - 1.0 | 2026-05-25 | Initial Finnish-only draft. Three labeled
                       sections per Boardy spec (no extra setup):
                       1) problem, 2) 3-line benefit, 3) what is
                       measured in the pilot.

Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-7)
Branch: claude/exa-openclaw-integration-YnDpO
Date: 2026-05-25
Owner: risto.paarni@lifetime.fi
Recipient: Ari Hirvonen, Patent IP Director, Outokumpu Oyj (FI body);
           Outokumpu board / international stakeholders via Ari's
           forward (EN body).
Transport: Amazon SES SMTP (Risto's client)
Sender: risto.paarni@lifetime.fi
Funnel step: Step 3 → Step 4 hinge. Material now in Ari's hands;
             exit Step 3 when Ari confirms numbers on his actual
             workflow; enter Step 4 (Expand sideways — CSO + product-
             line VP + board) when he agrees to a meeting OR forwards
             internally. The EN parallel is the Step 4 enabler — it
             pre-stages the board's language for the sideways expansion.
-->

# Material Package (Finnish + English) — Ari Hirvonen (Outokumpu)

**To:** ari.hirvonen@outokumpu.com *(reply within existing thread)*
**From:** risto.paarni@lifetime.fi
**Subject:** Re: [preserve thread] — *Materiaalipaketti / Material package: CBAM-disclosure + IP-funktio*

Single email, bilingual. Finnish for Ari (matches his language); English directly below so he can forward to the Outokumpu board (board operating language = English) without translation work.

---

## Finnish (for Ari)

---

Tervehdys Ari,

Tässä lupaamani paketti — kolme osaa, ei lisäselittelyä.

## 1) Ongelma

Forta-tendereiden CBAM-, EPD- ja Scope-3-dokumentit lähtevät tällä hetkellä ilman IP-funktion tarkistusta. Mukana saattaa kulkea romupohjasuhde, energiasekoitus, reseptin yksityiskohdat ja alkuperämaa — eli julkaistavissa olevaa prosessi-IP:tä, jota Outokumpu suojaa muuten patenttiportfoliossa ja liikesalaisuusohjelmissa. Q3 2026 CBAM-definitive-vaihe syventää granulariteettia entisestään.

## 2) Hyöty (3 riviä)

- **Julkaisukierto:** 2–6 viikkoa → alle 2 minuuttia per disclosure.
- **Aikasäästö:** 240–480 myyntiteknisen tunnin vapautus per edustaja per vuosi.
- **IP-suojaus:** 100 % kattavuus disclosure-virrasta, ad-hoc-tarkistuksen sijaan.

## 3) Mitä pilotissa mitataan

- **Kierrosaika:** nykyinen vs. KYA-malli, yksi tuotelinja (esim. Forta tai mikä muu sinulle relevantein).
- **IP-funktion kattavuusprosentti:** ennen pilottia vs. pilotin aikana.
- **Vapautuneet myyntitekniset tunnit:** määrä ja uudelleenkohdennus.

**Kesto ja kustannus — kaksi vaihetta:**
- **Vaihe 1 — Scoping:** 1–2 viikkoa, maksuton. Lukitaan laajuus, tuotelinja, mittaristo.
- **Vaihe 2 — Pilotti:** 3 kk, **maksettu (ostaja sponsoroi)**, 50 % työpanos. Hinta sovitaan vaiheen 1 jälkeen volyymin ja OEM-tier-monimutkaisuuden perusteella. Compute ja hardware laskutetaan erikseen päälle. Kaupallistaminen sovittujen KPI:iden täytyttyä.

Anonymisoitu sektorikuvio yhdellä sivulla: https://dws10.com/sovereign-cbam-disclosure/

Salmisaarenranta sopii, meiltä Espoosta 15 min. Viikko 23 (1.–5.6.) tai 24 (8.–12.6.)?

Terveisin,
Risto

---

**Risto Anton Päärni**
Founder & CEO, Lifetime Oy
risto.paarni@lifetime.fi
Laidunmaanraitti 2 A 25, 02330 Espoo
Business ID 0772407-9 · VAT FI07724079
https://dws10.com

---

— — — — — — — — — — — — — — — — — — — — —

*English version below for forward to board / international stakeholders. Same package, no extra content.*

— — — — — — — — — — — — — — — — — — — — —

## English (for board forward)

Hello Ari,

As promised — three sections, no extra commentary. (Same as the Finnish above; included here in English so this email can be forwarded directly to the board without translation work.)

### 1) The problem

Every Forta tender's CBAM, EPD, and Scope-3 disclosure currently leaves Outokumpu without IP-function review. The published technical detail can include scrap ratio, energy mix, recipe specifics, and source country — the same process IP that Outokumpu otherwise protects through its patent portfolio and trade-secret programmes. The Q3 2026 CBAM definitive phase pushes that granularity deeper.

### 2) The benefit (3 lines)

- **Disclosure cycle:** 2–6 weeks → under 2 minutes per disclosure.
- **Time reclaimed:** 240–480 sales-engineering hours per rep per year.
- **IP coverage:** 100% of the disclosure stream, instead of ad-hoc review.

### 3) What the pilot measures

- **Cycle time:** current state vs. KYA-governed pipeline, on one product line (e.g. Forta, or whichever is most relevant for you).
- **IP-function coverage rate:** before pilot vs. during pilot.
- **Sales-engineering hours reclaimed:** volume and reallocation.

**Duration and cost — two stages:**
- **Stage 1 — Scoping:** 1–2 weeks, free of charge. Lock scope, product line, measurement set.
- **Stage 2 — Pilot:** 3 months, **paid (buyer sponsors)**, 50% effort. Price agreed after Stage 1 based on volume and OEM-tier complexity. Compute and hardware billed separately on top. Commercial conversion on agreed KPIs.

**What "compute and hardware" covers (billed pass-through, no Lifetime margin):**
- NVIDIA inference hardware — Jetson Orin Nano edge units and/or DGX Spark cloud capacity, depending on workload shape locked in scoping.
- EU-sovereign data services — Scaleway (Paris) and/or Aiven (Helsinki) for PostgreSQL, vector store, object storage. Tier 1 Full EU Sovereign per `DWS_STANDARDS_LIBRARY.md` §3.6, no US Cloud Act perimeter.
- Buyer can BYO existing NVIDIA / Aiven contracts where they already exist; otherwise Lifetime provisions and passes through monthly invoices at provider cost.

Anonymized sector pattern, one page: https://dws10.com/sovereign-cbam-disclosure/

Salmisaarenranta works — 15 minutes from our office in Espoo. Week 23 (1–5 June) or week 24 (8–12 June)?

Best regards,
Risto

**Risto Anton Päärni**
Founder & CEO, Lifetime Oy
risto.paarni@lifetime.fi
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland
Business ID 0772407-9 · VAT FI07724079
https://dws10.com

---

## Send mechanics

- **Transport:** Amazon SES SMTP (Risto's client) — CLAUDE.md rule #4.
- **Sender:** `risto.paarni@lifetime.fi` — rule #3.
- **Thread:** reply within the same email thread Ari used Wed 2026-05-20. Do not start a new thread.
- **Finnish proof:** drafted by a non-native-speaker agent — Risto (native FI) should proof for register before send. Tone target: warm-but-direct, Finnish business style.
- **English proof:** drafted in native English, but Risto should still scan for any phrase that doesn't match the Lifetime / DWS voice on dws10.com.
- **Bilingual delivery:** single email, both languages stacked, FI first (matches recipient's language), EN second (board-forward-ready). Visual separator between the two so Ari forwards only the EN block if he wants to spare the board the FI section.

## Source data for the numbers

All cycle-time, hours-saved, and pilot-design numbers in this package are sourced from `CYCLE_TIME_BENCHMARK_OUTOKUMPU_FORTA.md`. The benchmark file is **not** attached as PDF — its content is incorporated into this email body so Ari does not need to open another document.

## If Ari names a different product line in his reply

Re-issue this package with the line name substituted in §1 (currently "Forta-tendereiden") and §3 (currently "esim. Forta"). The pattern is generalisable across stainless lines (Circle Green, Core, Ultra, long products) — only the line name and any line-specific public benchmark numbers change.

## Funnel transition

When Ari acknowledges these numbers apply to his workflow (in reply, in a call, or in any written confirmation), Step 3 of the enterprise funnel exits and Step 4 (Expand sideways — CSO + product-line VP) begins.

## Related files

- `sales-outreach/INTRO_ARI_HIRVONEN_OUTOKUMPU.md` — full outreach plan + stakeholder map.
- `sales-outreach/CYCLE_TIME_BENCHMARK_OUTOKUMPU_FORTA.md` — source for the numbers.
- `sales-outreach/LETTER_ARI_HIRVONEN_OUTOKUMPU_REPLY1_FI.md` — alternative longer reply (not sent; retained as reference).
- `dws10.com/sovereign-cbam-disclosure/index.html` — anonymized sector-pattern landing page (linked in body).
- `docs/SALES_FUNNEL_WORKFLOW_ENTERPRISE.md` §7 — funnel-state row for this prospect.
