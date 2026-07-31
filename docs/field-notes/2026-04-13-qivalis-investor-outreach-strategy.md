# Qivalis × Investor Outreach — Narratiivin päivitys ja kohdelistat

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/add-qivalis-research-ePIAY | Date: 13.04.2026 | Changes: Initial — analyzes Qivalis stablecoin as investor narrative upgrade for Arctic 15, maps BBVA Ventures + ING Ventures as priority targets, diagnoses pipeline blockers, proposes 3-action sprint

Document Status:

- Created: 13.04.2026
- Last Modified: 13.04.2026
- Language: Finnish (pääkieli) + English (termit)
- Publication Status: INTERNAL
- Classification: CONFIDENTIAL — Operational

Related Documents:

- docs/field-notes/2026-04-06-series-a-technical-narrative-synthetic-nervous-system.md
- docs/field-notes/2026-03-15-investor-materials-audit.md
- docs/field-notes/2026-04-13-qivalis-stablecoin-european-banks-digital-euro.md
- investor-outreach/INVESTOR_MEMO.md
- docs/INVESTOR_HOOK_DECK.md

---

**Type:** Investoristrategia / Narratiivianalyysi
**Scope:** Arctic 15 (kesäkuu 2026), SAFE €500K @ €3.8M cap, kohdelistat
**Related:** Hook Deck, INVESTOR_MEMO, email-outreach-pipeline

---

## Ydinlöydös

Qivalis ei ole vain "mielenkiintoinen maksuuutinen". Se on **narratiivin
päivitys** DWS:n Arctic 15 -pitchiin — ja se avaa kaksi konkreettista
warm-intro-polkua: **BBVA Ventures** ja **ING Ventures**.

Mutta: **narratiivi ei ratkaise sitä, että yhtään outreach-emailia ei ole
lähetetty** (maaliskuun 2026 audit). Pipeline korjataan ensin.

---

## 1. Miten Qivalis muuttaa sijoittajatarinan

### Vanha tarina (April 6, 2026)

> "DWS IQ on EU-vaatimustenmukaisuuden kognitiivinen immuunijärjestelmä.
> CBAM, CSRD, NVIDIA NeMo DataDesigner — 10 000 vuoden synteettinen
> harjoitteludata."

**Vahvuus:** Konkreettinen tekninen moat, NVIDIA-kumppanuus, aikaikkuna.
**Heikkous:** Yksittäinen regulaatiovertikali (Green Deal). Ei maksuinfra-
narratiivia. Ei vielä "infrastructure play" -statusta.

### Uusi tarina (post-Qivalis)

> "Eurooppa rakentaa kahta kriittistä infrastruktuuria samanaikaisesti:
> **EU Green Deal -vaatimustenmukaisuus** (CBAM/CSRD enforced 2026) ja
> **digitaalinen euromaksuverkko** (Qivalis H2 2026, ECB CBDC 2029+).
>
> Molemmat osuvat teollisuusyritysten ERP-järjestelmiin. DWS IQ on
> kerros, joka tekee näistä infrastruktuureista käytettäviä."

**Miksi tämä on parempi sijoittajille:**

| Vanhan tarinan ongelma        | Uuden tarinan ratkaisu                  |
| ----------------------------- | --------------------------------------- |
| "Compliance tool" = pieni TAM | "Infrastruktuuri" = suuri TAM           |
| Yksi regulaatioajuri          | Kaksi konvergoivaa infrastruktuuria     |
| CBAM/CSRD voi viivästyä       | Qivalis H2 2026 = konkreettinen trigger |
| Vaikea verrata kilpailijoihin | Analogia: "Visma kohtaa MiCA-rajan"     |

---

## 2. Kohdeinvestorit — prioriteettijärjestyksessä

### Tier 1: Konsortioon liittyvät corporate VC:t (PARAS warm intro)

| VC                | Emopankki                | Miksi nyt                                                      | Intro-polku                      |
| ----------------- | ------------------------ | -------------------------------------------------------------- | -------------------------------- |
| **BBVA Ventures** | BBVA (Qivalis-konsortio) | Suora strateginen intressi: compliance-layer Qivalis-maksuille | BBVA:n fintech-tiimi → Ventures  |
| **ING Ventures**  | ING (Qivalis-konsortio)  | Sama. ING Ventures aktiivinen B2B-regtech-sijoittaja           | LinkedIn → ING Ventures partners |

**Pitch BBVA/ING Ventures -puhelu:**

> "BBVA ja ING rakentavat Qivalisin maksutunnelin. Teollisuusyritykset
> tarvitsevat compliance-kerroksen yläpuolelle: MiCA-raportointi,
> ERP-integraatio, CSRD-kirjanpito. DWS IQ on se kerros.
> Strateginen synergia molempiin suuntiin."

---

### Tier 2: Pohjoismaiset fintech/regtech VC:t

| VC                      | Fokus                | Miksi DWS sopii                   | Huomio                      |
| ----------------------- | -------------------- | --------------------------------- | --------------------------- |
| **Inventure** (FI)      | Enterprise SaaS, B2B | Kotikenttä, Suomi-yhteys          | Aktiivisin FI seed/Series A |
| **MAKI.VC** (FI)        | Deep tech, infra     | NVIDIA-kumppanuus kiinnostaa      | Pienempi rahasto            |
| **Voima Ventures** (FI) | Industrial tech      | Firehorse + teollisuus            | Paras fit toimialalle       |
| **Northzone**           | B2B SaaS, Nordic     | Series A kapasiteetti             | Vaikea cold outreach        |
| **Balderton Capital**   | EU infra plays       | "Infrastructure for Europe" frame | London-centric              |

---

### Tier 3: EU Compliance / Climate-tech VC:t

| VC                   | Fokus             | Miksi DWS sopii                                      |
| -------------------- | ----------------- | ---------------------------------------------------- |
| **Speedinvest** (AT) | Fintech + regtech | CBAM/CSRD enforcement = kasvava portfolio-relevanssi |
| **HV Capital** (DE)  | Enterprise B2B    | Saksalainen teollisuusbase = DWS-asiakkaat           |
| **EQT Ventures**     | Tech infra        | Iso tasku, vaatii isomman traction                   |

---

## 3. Pipeline-diagnoosi: miksi yhtään emailia ei ole lähetetty

Maaliskuun audit löysi nämä blockerit. **Kaikki edelleen auki:**

| Blokkeri                                        | Tila                                     | Korjaus                                               |
| ----------------------------------------------- | ---------------------------------------- | ----------------------------------------------------- |
| Email-templates puuttuvat investor-outreachille | Resend SDK valmis, ei investor-templatea | M2: `investorOutreachTemplate()` → email-templates.ts |
| Kontaktilista on CSV-tiedosto                   | Ei Supabase-taulua, ei statusseurantaa   | M4: `investor_contacts` -taulu                        |
| Calendly-linkki puuttuu                         | Placeholder koodissa                     | Manuaalinen setup (M7)                                |
| Kaikki investor-docs vanhentuneet               | Viimeisin: maaliskuu 2026                | M1: Memo päivitys                                     |
| API-route puuttuu                               | Ei `/api/email/investor-outreach`        | M3: Express-route                                     |

**Riski:** Qivalis-narratiivin hiominen ilman, että pipeline toimii, on
priorisoinnin vääristymä. Paras pitch maailmassa ei auta, jos emailia
ei pystytä lähettämään.

---

## 4. Kolmen toimenpiteen sprint (ennen Arctic 15)

Arctic 15 on **kesäkuussa 2026** — ~8 viikkoa.

### Sprint 1 — Narratiivi (tee ensin, tänään)

**Hook Deck päivitys:**
Lisää Slide 4 `docs/INVESTOR_HOOK_DECK.md`:n nykyisiin kolmeen:

```
Slide 4: "Two Infrastructures. One Compliance Layer."
- Qivalis (H2 2026): private digital euro, 12 banks
- ECB CBDC (2029+): public CBDC incoming
- CBAM enforcement: 2026 fully operational
- CSRD: 2026 wave 1
- DWS IQ sits at the intersection of all four
- Customers: industrial ERP users who need both payment + regulatory compliance
```

**Investor Memo päivitys** (M1 — maaliskuun auditista):
Lisää Qivalis-kappale section "Market Timing" -kohtaan.

---

### Sprint 2 — Pipeline (tee seuraavaksi)

1. **M4:** Luo `investor_contacts` Supabase-taulu (migraatio)
2. **M2:** Lisää `investorOutreachTemplate()` email-templatesiin
3. **M3:** Lisää `/api/email/investor-outreach` route
4. **M7:** HUMAN ACTION — Calendly setup

Tavoite: ensimmäinen batch (5 emailia) lähtee ennen toukokuun loppua.

---

### Sprint 3 — BBVA + ING Ventures warm outreach

Tässä järjestyksessä:

1. **LinkedIn research:** Etsi BBVA Ventures + ING Ventures managing partners
2. **Warm intro -polku:** Onko olemassa olevissa verkostoissa (Suomi/Espanja/Alankomaat) yhteyshenkilöitä?
3. **Email:** 1 kappale + pitch deck link + Calendly — ei pitkää tekstiä

**Malliteksti BBVA Ventures:**

> Subject: DWS IQ — compliance layer for Qivalis payment flows
>
> Hi [Name],
>
> BBVA's role in the Qivalis consortium caught our attention. We're building
> the EU compliance intelligence layer that industrial ERP customers will need
> when they start processing payments on Qivalis rails — MiCA reporting,
> CBAM/CSRD integration, automated audit trails.
>
> We're raising a €500K SAFE @ €3.8M cap ahead of Arctic 15 (June 2026).
> Happy to share our 3-slide hook deck.
>
> Risto / Lifetime Oy

---

## 5. Mitä Qivalis EI muuta

- **SAFE-ehdot** pysyvät: €500K @ €3.8M cap
- **Valuation cap** ei nouse vielä — Qivalis on tailwind, ei traction
- **Primääripitch** pysyy CBAM/CSRD + NVIDIA — Qivalis on lisäkerros
- **Arctic 15 -budjetti** ei muutu: sales sprint kesäkuu 15 – elokuu 15

---

## 6. Aikataulu

| Päivä        | Toimenpide                      | Vastuutaho              |
| ------------ | ------------------------------- | ----------------------- |
| 13.04        | Hook Deck Slide 4 lisätään      | Claude Code             |
| 14.04        | Investor Memo Qivalis-kappale   | Claude Code             |
| Viikko 17    | M4 Supabase investor_contacts   | Claude Code             |
| Viikko 17    | M2 + M3 email templates + route | Claude Code             |
| Viikko 17    | M7 Calendly setup               | **Risto (manuaalinen)** |
| Viikko 18    | BBVA Ventures LinkedIn research | Risto                   |
| Viikko 18–19 | Ensimmäiset 5 emailia lähtevät  | Automatiikka            |
| Kesäkuu 2026 | Arctic 15                       | Risto                   |

---

_Kirjoitettu 13.04.2026. Seuraava päivitys kun ensimmäinen batch-lähetys
vahvistetaan tai BBVA/ING Ventures -kontakti löytyy._
