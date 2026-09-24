---
signal_id: MS-2026-09-001
reality: Asiakas näkee A5-kampanjasivun ja lifetime.fi:n.
observation: Asiakas reagoi enemmän ekosysteemin ajattelumalliin kuin kampanjan ominaisuuksiin; osti ajatuksen, ei tuotetta.
signal: Maailmankuva myy paremmin kuin tuotekuvaus – asiakkaat ostavat merkitystä, eivät agenttiarkkitehtuuria.
source: customer conversation
date: 2026-09-23
observed_at: 2026-09-23
signal_at: 2026-09-24
insight_at: 2026-09-24
decided_at: 2026-09-24
observer: HIC
confidence: high
occurrences: 2
affected: [lifetime.fi, onelifetime.world, dws10.com, dws10.com/buy, workflows, offering]
decision: roolimalli_v1_5
status: implemented
insight: Asiakkaat ostavat merkityksen ja maailmankuvan ennen tuotetta – lifetime.fi:n on oltava synteesi ja suunta, ei ratkaisusivu; kaikki tuote- ja hintapuhe kuuluu dws10.com:iin.
evidence:
  {
    conversations: 1,
    audits: 1,
    campaign_results: "A5-kampanjasivu koettiin kalpeaksi vaikka tietoa oli paljon",
  }
hypothesis: lifetime.fi:n pitää olla synteesi ja suunta (WHY), ei ratkaisusivu; tuotteet, hinnat ja arkkitehtuuri kuuluvat dws10.com:iin ja selitykset onelifetime.worldiin. Kun kerrokset ovat puhtaat, yhteydenotot alkavat WHY-kerroksesta eivätkä kampanjasivulta.
refuting_evidence: Jos 60 päivää lifetime.fi-tarinan julkaisusta yhteydenotoista alle 20 % viittaa lifetime.fi:n sisältöön (WhatsApp/puhelin/lomake, kysytään lähde) ja Journal-tekstien lukuaika ei ylitä 3 min, hypoteesi on väärä tai toteutus riittämätön. Arviointipäivä kirjataan, kun vaihe A julkaistaan.
comprehension: HIC 24.09.2026 — ilmiö on aito; sama havainto toistui Copilot-auditissa; kampanjasivun ongelma ei ollut sisältö vaan kerros.
application_decision:
  applies_to: [lifetime.fi, onelifetime.world, dws10.com, linkedin, meta]
  does_not_apply_to:
    [dws10.com/campaigns/a5-kampanja-kaksipuolinen (HIC-veto), investor-centre, legal-hub]
  basis: [MS-2026-09-001 evidence, Copilot-audit 24.09.2026]
  valid_until: strategia v1.6 -> vaihe A julkaisu + 60 pv arviointi
  affects: [suomalaiset yrityspäättäjät, Journal-lukijat, some-seuraajat]
decisions_detail:
  - lifetime.fi -> synteesi, missio, johtopäätökset (WHY); ei tuotteita, hintoja, lyhenteitä
  - onelifetime.world -> Lifetime Scope Journal, white paperit, seminaarit (UNDERSTAND)
  - dws10.com -> ratkaisut ja toteutus (HOW); dws10.com/buy -> hankinta (BUY)
  - kampanjasivu a5-kampanja-kaksipuolinen pysyy ennallaan (HIC-veto 24.09.2026)
  - blogisarja 0 (liiketoimintataso) ennen termisarjaa
dispatched_runs:
  - docs/proposals/2026-09-24-lifetime-fi-tulossivu-ehdotus.md (strategia v1.x, PR #2091)
  - Workflow v2 Chapters 10–14 (this branch)
impact:
  - {
      target: lifetime.fi,
      status: in progress,
      note: strategia v1.6 hyväksytty,
      vaihe A odottaa HIC-lupaa,
    }
  - { target: onelifetime.world, status: not started, note: blogisarja 0 luonnokset odottavat }
  - { target: linkedin, status: not started }
  - { target: meta, status: not started }
  - { target: dws10.com, status: in progress, note: whitepapers/playbooks-siirto inventoitu }
  - { target: buy, status: done, note: dws10.com/buy olemassa, ei muutosta }
evaluation: null
---

## Reality → Observation → Market Signal

- **Reality:** asiakas näkee kampanjasivun ja lifetime.fi:n.
- **Observation (HIC):** asiakas reagoi ekosysteemin ajattelumalliin, ei ominaisuuksiin.
- **Market signal:** maailmankuva myy paremmin kuin tuotekuvaus.
- **Hypothesis:** lifetime.fi toimii synteesi- ja johtopäätöskerroksena.
- **Decision:** roolimalli v1.5 (WHY / UNDERSTAND / HOW / BUY).
- **Status:** implemented strategiassa; evaluation avoinna vaiheen A julkaisuun asti.

## Havainto

Kaksi esiintymää: (1) asiakaskeskustelu 23.09.2026, jossa asiakas osti ajatuksen One Lifetime
-lähestymisestä eikä yhtään tuotetta; (2) Copilot-auditin ja HIC:n yhteinen arvio 24.09.2026,
että A5-kampanjasivu tuntui "kalpealta" vaikka tietoa on valtavasti – tieto jäi dws10.com:n
hakemistoihin eikä siitä syntynyt merkitys näkynyt.

## Miksi tämä on Observation-kerroksen vika, ei sisältövika

Workflowt tuottivat edelleen kampanjasivua, tuotekuvausta, ominaisuuksia ja paketteja. HIC
joutui ohittamaan ne käsin ja sanomaan "asiakas osti maailmankuvan". Järjestelmä ei ollut
absorboinut havaintoa, koska havainnolle ei ollut paikkaa: ei rekisteriä, ei hypoteesia, ei
vaikutusten jakelua workflow'ihin. Tämä tiedosto ja Chapter 14 ovat se paikka.

## Workflow-vaikutus (Refiner)

- Chapter 5 (content-publishing) ja kampanjatyönkulut olettivat "tuota tuotesivu". Chapter 10
  SYNTHESIZE tuottaa ensin johtopäätöksen ja syvän tekstin, tuotelinkki viimeisenä.
- Chapter 0/1 (funnel, outreach) viestit: WHY-lause ennen tarjousta. Ehdotus refinerille, ei
  vielä muutettu.
