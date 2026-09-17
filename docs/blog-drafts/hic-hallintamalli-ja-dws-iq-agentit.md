---
slug: hic-hallintamalli-ja-dws-iq-agentit
title: "HIC-hallintamalli ja DWS IQ -agentit"
subtitle: "Älykäs prosessiautomaatio teollisuudessa — Copilot-ohjausmalli yhdistettynä DWS IQ -osaaja-agentteihin"
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-07
Status: DRAFT
source: HIC-kirjoittama teksti (sessio claude/agent-use-cases-comparison-h7vl25), tarkistettu KYA-S1:tä vasten
---

# HIC-hallintamalli ja DWS IQ -agentit

### Älykäs prosessiautomaatio teollisuudessa — Copilot-ohjausmalli yhdistettynä DWS IQ -osaaja-agentteihin

_Arkkitehtuuritiivistelmä & HIC-toimintamalli · 1 A4 -esittely_

---

## 1. Agenttiluokkien vertailu: Kehittäjän avustajasta teollisuuden tausta-agenttiin

Tekoälyagentit jakautuvat kahteen päänäkökulmaan, joiden valvontatarve ja toimintaympäristö eroavat toisistaan perustavanlaatuisesti:

| Ominaisuus      | GitHub Copilot Agent                                                               | DWS IQ -agentit                                                          |
| --------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Rooli**       | Kehittäjän interaktiivinen pari (IDE-ympäristö).                                   | Teollisuuden & tietovarastojen tausta-agentti.                           |
| **Autonomia**   | Mikrotaso: ehdottaa koodia, ajaa testejä kehittäjän silmän alla.                   | Makrotaso: suorittaa monivaiheisia liiketoiminta- ja tuotantoprosesseja. |
| **HIC-malli**   | Luonnollinen ihmisvalvonta (_Human-in-Command_) jokaisessa käyttöliittymäaktoissa. | Vaatii erillisen hallintakerroksen, jotta valvonta säilyy tausta-ajossa. |
| **Kriittisyys** | Koodimuutos vaatii aina review'n ennen commitia.                                   | Suora vaikutus tuotantoketjuihin, rajapintoihin ja tietokantoihin.       |

---

## 2. Hallintamalli (HIC): Copilot-ohjaus tuotuna DWS IQ -ympäristöön

Jotta teollisuudessa saavutetaan sekä korkea automaatioaste että EU AI Actin vaatima _Human-in-Command_ (HIC) -valvonta, DWS IQ -agentteja hallitaan **GitHub Copilot -tyylisellä yhdellä Dashboardilla (Single Pane of Glass)**:

- **Yksi käynnistysnäkymä (Dashboard):** Ihminen toimii prosessin johtajana. Hän käynnistää agenttitoiminnon työnkulun (_workflow_) yhdestä selkeästä näkymästä ja näkee prosessin tilanteen reaaliaikaisesti.
- **DWS IQ Skilled Agents (Osaaja-agentit):** Dashboard reitittää ja valitsee työnkulun eri vaiheisiin tarkoitukseen erikoistuneet agentit (_Skilled Agents_) — esimerkiksi laadunvalvonta-, data-analyysi- tai logistiikka-agentin — aina kyseisen työvaiheen vaatimusten mukaisesti.
- **Aukoton KYA-kytkentä:** Jokainen Dashboardilta käynnistetty agentti noudattaa KYA-spesifikaatiota: tietoturva tuntee agentin taustahenkilön (IDV), luottamustason (TRS) ja tarjoaa välittömän hätäjarrun (TC4) koko agenttiketjulle.

---

## 3. Teollisuuden prosessikuvaukset: RUP-metodologian soveltaminen

Agenttiyhteistyöstä tehdään teollisuudessa ennakoitavaa ja hyväksyttyä mallintamalla työnkulut vakiintuneella **RUP-metodologialla (Rational Unified Process)** ja UML-aktiviteettikaavioilla:

```
[Inception]               [Elaboration]              [Construction]             [Transition]
Ihminen käynnistää ---->  Dashboard reitittää  ----> DWS IQ Skilled Agents  ----> Luovutus & KYA-
työnkulun Dashboardilta   sopivat IQ-agentit         suorittavat vaiheet        auditointijälki
```

- **Inception (Aloitus):** Ihminen määrittelee tavoitteen ja raamit Dashboardilla (HIC-aloitus).
- **Elaboration (Tarkennus):** Järjestelmä valitsee prosessiin tarvittavat _DWS IQ Skilled Agents_ -roolit ja esittää prosessikaavion käyttäjälle.
- **Construction (Toteutus):** Agentit suorittavat työvaiheet itsenäisesti. Kriittisissä RUP-tarkastuspisteissä (_Gateways_) järjestelmä pyytää ihmisen kuittauksen ennen seuraavaan vaiheeseen siirtymistä.
- **Transition (Luovutus):** Lopputulos todennetaan, ja KYA-S1-spesifikaation mukainen päätöksentekojälki tallennetaan automaattisesti myöhempää tarkastelua varten.

> **Yhteenveto:** Tuomalla GitHub Copilotin tuttu ja turvallinen ohjausmalli DWS IQ -tausta-agenteille ja kuvaamalla työnkulut teollisuuden rakastamilla RUP-prosessikaavioilla, tekoälyn johtamisvelvoite muuttuu lakitekstistä kirkkaaksi, käytännölliseksi ja skaalautuvaksi kilpailueduksi.
