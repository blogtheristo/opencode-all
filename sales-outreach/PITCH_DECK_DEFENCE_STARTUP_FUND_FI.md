<!--
VERSION AND AGENT HISTORY
Document: PITCH_DECK_DEFENCE_STARTUP_FUND_FI.md
Version: 1.0
Last-Updated: 2026-06-23
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Pitch deck (FI) Defence Startup Fund -täydennettyyn hakemukseen —
         vastaa RTOY:n palautteeseen (video + pitch deck puuttuivat).
         Kalvokohtainen sisältö + puhujan muistiinpanot. Lähde:
         docs/DEFENCE_STARTUP_FUND_APPLICATION.md.
Branch: claude/aegis-defence-deliverables-3clsx0
Owner: risto.paarni@lifetime.fi
- Version: 1.1 | Tool: Claude Code (Opus 5) | Session: claude/traction-truth-reconciliation | Date: 29.07.2026 | Changes: Traction claims reconciled to docs/TRACTION_CANONICAL.md — Kalvo 8: dispatch operators removed as "Nykyasiakkaat", "MRR 7 000 €/kk, 100 % retentio" and "17 v operaattorisuhteet" retired/relabelled, Nokia replaced with "puolustusalan päähankkija" (NDA).
-->

# Pitch Deck — Defence Startup Fund (Lifetime Oy)

Kalvokohtainen käsikirjoitus (11 kalvoa). Voidaan tuottaa Gamma-esitykseksi tai PDF:ksi. Yksi punainen lanka: **ongelma → ratkaisu → veto → pyyntö.**

---

## Kalvo 1 — Kansi

**DWS IQ Aegis** — Suvereeni teollinen äly kaksikäyttöiseen valmistukseen.
Lifetime Oy · Riihimäki / DEFINE · 2026
_Puhuja:_ Yksi EU-suvereeni alusta, joka yhdistää puolustus- ja ilmastosääntelyn — rakennettu Suomessa.

## Kalvo 2 — Ongelma

Puolustusalan toimitusketjut kohtaavat kolminkertaisen sääntelypaineen:

- **Kaksoiskäyttöasetus (EU 2021/821)** — vientivalvonta ja compliance
- **Ilmastosääntely (CSRD, CBAM, ETS)** — päästöraportointi ja hiiliraja
- **Datasuvereenius (EU AI Act, NIS2, GDPR)** — datan sijainti ja hallinta

US-alustat (Palantir, C3.ai) altistuvat CLOUD Actille. Compliance tehdään käsin. Yhtä alustaa kaksoisvaatimuksille ei ole.

## Kalvo 3 — Ratkaisu

**DWS IQ Aegis** — autonominen AI-agenttialusta, joka tuottaa **auditoitavia tuloksia**, ei dashboardeja. Yhden vuokralaisen suvereeni alusta suomalaisessa infrastruktuurissa, nolla CLOUD Act -altistusta, jokainen päätös oikeudessa puolustettavissa (KYA + EU AI Act artikla 12).

## Kalvo 4 — Aegis-agentit (6 ydintä)

- **ArgusAgent** — ICEYE SAR -satelliittidatan analyysi (tiedustelu, muutostunnistus)
- **SovereigntyMonitor** — CLOUD Act -altistumisen pisteytys, NIS2
- **Article12Logger** — EU AI Act -auditointiketju
- **KYA Engine** — agenttien hallinta; kill-switch sub-5 ms / laivasto alle 50 ms
- **ComplianceAgent** — kaksoiskäyttö + CSRD/CBAM/ETS
- **SiteSenseAgent** — puolustusrakentamisen ja -logistiikan turvallisuus

## Kalvo 5 — Lifetime Fleet IoT (fyysinen kerros)

NVIDIA Jetson Orin Nano + Acer Veriton GN100 reunalaskentana kentällä: kenttäoperaatioiden tilannekuva, kaluston seuranta, huoltovarmuuslogistiikka. Mobiilisensorit, OpenSandbox v1.5, TimescaleDB — kaikki AI-inferenssi paikallisesti, ei pilviviivettä.

## Kalvo 6 — Kaksoiskäyttö (dual-use)

| Kyvykkyys        | Siviili                      | Puolustus                       |
| ---------------- | ---------------------------- | ------------------------------- |
| Päästölaskenta   | CSRD-raportointi             | Hankintojen hiilijalanjälki     |
| Satelliittikuvat | Teollisuuskohteiden valvonta | Tiedustelu, muutostunnistus     |
| Suvereenius      | GDPR                         | Puolustustiedon datasuvereenius |
| IoT/sensorit     | Logistiikan seuranta         | Kenttäoperaatioiden tilannekuva |

## Kalvo 7 — Markkina

- ~4 000 puolustusurakoitsijaa EU:ssa
- ~15 000 kaksoiskäyttövalmistajaa EU:ssa
- 27 EU-puolustusministeriötä
- Ajuri: komission **EDIP-työohjelma 1,5 mrd € (30.3.2026)** — rahoituksen saajat tarvitsevat suvereenin compliance-infrastruktuurin.

## Kalvo 8 — Liiketoimintamalli ja veto

- **Tuotelähtöinen** yhtiö; tulorahoitus (ei ulkoista pääomaa).
- Ohjelmistoveto: **kaksi yritysasiakaspilottia sovittu Q1/2026**, 29 950 € kumpikin (**59 900 € kirjattu**).
- Tulorahoitus: **~7 000 €/kk palvelu- ja kuljetusliikevaihtoa (ei ohjelmistoliikevaihtoa)**; yhtiö kassavirtatasapainossa perustajan palkalla 0 €. Kela, Uber, Bolt ja Taksi Helsinki ovat **välityspalveluoperaattoreita** (Traficomin määrittelemä rooli) — luvanvaraisen kuljetusliiketoiminnan kaupallisia vastapuolia, **eivät DWS IQ:n, Aegiksen tai minkään Lifetimen ohjelmistotuotteen asiakkaita**. 17 vuoden operaattorisuhteet ovat kuljetusliiketoiminnan toimialakokemusta, eivät alustavetoa.
- Veto puolustusalalla: **Aegis × puolustusalan päähankkija × DEFINE** -keskustelut (NDA 14.4.2026; vastapuoli luottamuksellinen).
- InvestEU-portaaliin julkaistu hanke (INPO-20254383).

## Kalvo 9 — Tiimi ja kumppanit

- Risto Anton Päärni (CEO, full-stack + EU-sääntely, 20+ v) · Lucille Päärni (liiketoiminnan kehitys)
- Kumppanit: NVIDIA (ISV / Connect), Acer Finland, Siemens, ABB, Metropolia, VTT (DIANA), Shufti, ICEYE (DEFINE)

## Kalvo 10 — Rahoitus ja käyttö (20 000 € + 20 000 € matching)

Avustus: ICEYE SAR -integraatio 8 000 € · EU AI Act Art. 12 -sertifiointivalmistelu 5 000 € · puolustusalan pilot 4 000 € · DEFINE-verkostoituminen 3 000 €.
Omarahoitus (tulorahoitus): Aegis-kehitys 10 000 € · infrastruktuuri 5 000 € · Riihimäen toimipiste 3 000 € · ISO 27001 -esivalmistelu 2 000 €.

## Kalvo 11 — Riihimäki-sitoumus ja pyyntö

**Sitoumus:** pääkonttori ja perustajat muuttavat Riihimäelle — täysi läsnäolo DEFINE-ekosysteemissä. Yhteydet Panssariprikaatiin.
**Pyyntö:** Defence Startup Fund -avustus 20 000 € (matching) DWS IQ Aegiksen ja Lifetime Fleet IoT:n markkinavalmiuden vahvistamiseen puolustus- ja kaksoiskäyttösektorilla.

---

## Tuotanto

- [ ] Vie kalvot Gamma-esitykseksi (MCP `generate`) tai PDF:ksi.
- [ ] Liitä valmis esittelyvideo (2–3 min) samaan pakettiin.
- [ ] Tarkista luvut hakemusta vasten (`docs/DEFENCE_STARTUP_FUND_APPLICATION.md`).
