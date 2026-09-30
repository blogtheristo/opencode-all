---
slug: kya-s1-ekosysteemi-ja-tuotanto-roadmap
title: "Bronze, Silver, Gold — ja miksi emme myönnä itsellemme yhtäkään"
subtitle: "KYA-S1:n attestointitierit, self-attestation-kielto ja se mitä tapahtuu auditoinnissa oikeasti"
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-08
Status: DRAFT
source: HIC:n sarjasuunnitelma osat 8–11 (sessio claude/kya-s1-blog-parts-8-10-flfmrn)
series: "Blogi 8/11 · DWS IQ & Lifetime World Model"
canon:
  - Legal/KYA_S1_v1.3.md §3 (Evidence Meta-Rule), §8 (Attestation Tiers), §9 (Reference Implementation + conformance note)
  - Legal/KYA_AUDIT_WORKLIST_2026-08.md (P0 korjattu 08.08.2026; P1–P3 auki)
  - docs/blog-drafts/SARJA_KYA_S1_NUMEROINTI.md (sarjan numerointi 1–11)
unverified_claims: |
  TARKISTETTAVA ennen julkaisua (Sääntö 12 — merkitään, ei arvata):
  1. Auditointikustannus ja läpimenoaika. Tekstissä EI esitetä yhtään euro- eikä
     viikkolukua tiereistä, koska niitä ei ole mitattu eikä hinnoiteltu. Jos HIC
     haluaa lukuja mukaan, ne on ensin kirjattava kanoniin (DWS_TRUTH_STANDARD.md),
     ei blogiin ensiesiintymänä.
  2. "Yksikään vendori ei ole vielä hakenut KYA-S1-attestaatiota" — pidätetty
     väitteenä. Kommenttikausi on auki 04.11.2026 asti; hakijoiden määrää ei ole
     seurattu missään rekisterissä, joten sitä ei väitetä suuntaan eikä toiseen.
  3. Arvioijakelpoisuus ("qualified independent assessor"). §3 nimeää esimerkkejä
     (SOC 2 -auditoija, IDV-toimittaja, akkreditoitu red-team). Muodollista
     akkreditointipolkua KYA-S1-arvioijalle EI ole olemassa. Teksti sanoo tämän
     ääneen §5:ssä; älä pehmennä sitä julkaisussa.
withheld_by_design: |
  §8:n tier-taulukon kaksi saraketta — TRS-pisteen voimassaoloaika ja TRS-moottorin
  aikakatkaisu — lukevat v1.3:ssa "documented + assessor-verified" KAIKILLA kolmella
  tierillä. Luvut (300/60/10 s ja 5 s / 2 s / 500 ms) jätettiin pois tarkoituksella:
  ne olivat insinöörin intuitiota, eivät mittausta. Tämä blogi EI saa esittää niitä.
  Blogissa esiintyvä luku muuttuu normatiiviseksi adoptoijalle, jolla ei ole niille
  sen enempää perustetta kuin kirjoittajallakaan. Julkaistut SLA-luvut (IDV-peruutus,
  TC4-eteneminen, PRV-toisto, FLT-väliattribuutio) ovat v1.3 §8:ssa ja siksi
  siteerattavissa sellaisenaan.
open_decisions: |
  Ennen julkaisua HIC:n päätettävä:
  1. Julkaistaanko §9:n conformance-note sellaisenaan — eli sanotaanko julkisesti,
     ettei oma referenssitoteutus täytä TRS-1:tä? Agentin suositus: kyllä. Tämä teksti
     on kirjoitettu sen oletuksen varassa; jos vastaus on ei, luku 6 poistetaan
     kokonaan ja koko kirjoituksen argumentti romahtaa.
  2. Tuotanto-roadmapin aikataulu. Luku 7 kuvaa JÄRJESTYKSEN (mikä ennen mitä) muttei
     päivämääriä. Päivämäärät vaativat P1–P3-työn resursoinnin, jota ei ole tehty.
---

# Bronze, Silver, Gold — ja miksi emme myönnä itsellemme yhtäkään

Sarjan seitsemän ensimmäistä osaa rakensivat koneiston: spesifikaation, BPMN-portin, atomisen Lease Tokenin, fail-closed-käytöksen, virheluokittelun ja päätöstoiston. Jäljelle jää kysymys, jonka jokainen ostaja esittää viimeisenä ja joka ratkaisee kaupan:

**Kuka sanoo, että tuo kaikki on totta?**

Tämä kirjoitus käsittelee sitä kysymystä. Se on epämukava kysymys myydä, koska rehellinen vastaus meidän omalta osaltamme on tällä hetkellä: *ei kukaan vielä.*

## 1. Miksi tiereitä on kolme eikä yksi

Yksi taso olisi ollut helpompi. Se olisi myös ollut hyödytön.

Attestointi, jossa on vain "hyväksytty / hylätty", pakottaa jokaisen adoptoijan raskaimpaan kustannustasoon heti ensimmäisenä päivänä. Käytännössä se tarkoittaa, ettei kukaan adoptoi — ja standardi, jota kukaan ei adoptoi, ei suojaa ketään. Kolme tieriä on kompromissi kahden aidon riskin välillä: liian matala rima tuottaa merkityksettömän leiman, liian korkea rima tuottaa tyhjän rekisterin.

Tiereitä erottaa **kolme asiaa yhtä aikaa** — ei yksi:

| Erottaja                 | Bronze                    | Silver                     | Gold                                      |
| ------------------------ | ------------------------- | -------------------------- | ----------------------------------------- |
| **Uusintakadenssi**      | Vuosittain                | Neljännesvuosittain        | Jatkuva (telemetria) + vuosittain 3. osap. |
| **Todistusaineiston syvyys** | 3. osapuolen auditointi vähintään yhdestä domainista + allekirjoitettu telemetria tai sopimus-SLA lopuista kuudesta | 3. osapuolen auditointi IDV- ja BHM-domainista + allekirjoitettu telemetria (12 kk säilytys) lopuista viidestä | Riippumaton arvioija kaikista 7 domainista + allekirjoitettu SLA |
| **Etenemis-SLA:t**       | IDV-peruutus 15 min · TC4 15 min · red-team vuosittain | IDV-peruutus 5 min · TC4 5 min · red-team neljännesvuosittain | IDV-peruutus 60 s · TC4 60 s · red-team jatkuva |

_(Lähde: `Legal/KYA_S1_v1.3.md` §8. Luvut ovat spesifikaatiosta, eivät tästä tekstistä.)_

Huomaa mitä taulukossa **ei** ole: kontrollien määrä ei vaihdele tierin mukaan. Kaikki seitsemän domainia — IDV, BHM, REG, TC4, FLT, TRS, PRV — koskevat jokaista tieriä. Bronze ei ole "vähemmän kontrolleja", vaan **ohuempi todistusaineisto ja hitaampi reagointi** samoista kontrolleista. Tämä on tarkoituksellista: adoptoija ei saa valita pois kontrollia, vain sen todentamisen syvyyden.

## 2. Se korjaus, joka teki tiereistä merkityksellisiä

Versiossa 1.2 tier-taulukko erotti Bronzen, Silverin ja Goldin **vain IDV:n, TC4:n ja BHM:n** perusteella. Kolme laajennusdomainia — FLT, TRS ja PRV — olivat identtiset kaikilla tiereillä.

Tämä oli hiljainen virhe, ja se oli pahin mahdollinen paikka virheelle. FLT, TRS ja PRV ovat täsmälleen ne kolme domainia, jotka spesifikaation §7 tunnistaa tämän standardin **omaksi kontribuutioksi** — asioiksi, joita mikään olemassa oleva ohjelmisto- tai organisaatioattestaatio ei kata. Gold-attestaatio lupasi ostajalle niistä täsmälleen saman kuin Bronze: ei mitään mitattavaa luottamuspisteen tuoreudesta, päätöstoiston saatavuudesta tai vastuunattribuution nopeudesta.

v1.3 lisäsi toisen taulukon:

| Tier       | PRV — päätöstoiston saatavuus | FLT — väliaikainen attribuutio |
| ---------- | ----------------------------- | ------------------------------ |
| **Bronze** | 30 päivää                     | 30 päivää havainnosta          |
| **Silver** | 7 päivää                      | 10 päivää havainnosta          |
| **Gold**   | 24 tuntia                     | 72 tuntia havainnosta          |

Nyt ero on ostajalle konkreettinen. Gold-tason toimittajalta auditoija saa päätöksen toistettuna vuorokaudessa. Bronze-tason toimittajalta kuukaudessa. Kumpikin on rehellinen lupaus; ne eivät vain ole sama lupaus.

## 3. Kaksi saraketta, jotka jätettiin tyhjiksi — tarkoituksella

Sama taulukko sisältää kaksi saraketta, joissa lukee kolmella rivillä sama teksti: *"documented + assessor-verified"*. Ne ovat TRS-pisteen voimassaoloaika ja TRS-moottorin aikakatkaisu.

Luvut oli kirjoitettu. Ne poistettiin ennen julkaisua.

Syy on se, että ne olivat insinöörin arvauksia. Kukaan ei ollut mitannut, kuinka kauan luottamuspiste pysyy merkityksellisenä ennen kuin se on vanhentunut, eikä kukaan ollut mitannut, missä ajassa luottamusmoottorin on realistista vastata tuotantokuormassa. Julkaistuna nuo luvut olisivat muuttuneet **normatiivisiksi** jokaiselle adoptoijalle — ja adoptoijalla ei olisi ollut niille sen enempää perustetta kuin meillä.

Sitova vaatimus on silti voimassa, ja se on kirjoitettu tarkoituksella juuri tähän muotoon: **toimittajan on dokumentoitava arvo ja arvioijan on todennettava se.** Toimittaja ei saa jättää lukua määrittelemättä. Se saa vain olla toimittajan oma, perusteltu luku sen sijaan että se olisi meidän arvauksemme kaikkien puolesta.

Luvut tulevat taulukkoon, kun referenssitoteutus on mitattu. Ei ennen.

## 4. Self-attestation-kielto — mitä se auditoinnissa oikeasti tarkoittaa

Spesifikaation §3 on yksi lause: **oma vakuutus ei kelpaa todistusaineistoksi KYA-S1:n alla.**

Se kuulostaa itsestäänselvyydeltä, kunnes katsoo, miten tietoturva-attestaatiot käytännössä täytetään. Tavallinen kuvio on kyselylomake, jonka toimittaja täyttää itse, ja jonka ostaja arkistoi. Kukaan ei koskaan avaa lokia. Väite "meillä on tunnistautuminen" ja väite "tunnistautumisen peruutus etenee 60 sekunnissa" käsitellään samassa sarakkeessa, vaikka toinen on markkinointia ja toinen on mitattava tosiasia.

§3 vaatii jokaisesta seitsemästä domainista **vähintään yhden** neljästä:

1. **Riippumattoman, pätevän arvioijan auditointiraportti** — SOC 2 -auditoija, IDV-toimittaja, akkreditoitu red-team-yritys tai vastaava.
2. **Alustan tuottama telemetria**, säilytysaika vähintään 12 kuukautta, kryptografisella eheydellä — allekirjoitettu tapahtumaloki tai append-only-ledger.
3. **Arkkitehtuuridokumentaatio**, jonka riippumaton pätevä arvioija on katselmoinut ja allekirjoittanut.
4. **Sopimuksellinen SLA-sitoumus**, jossa on määritelty mittausmenetelmä ja ulkoisesti todennettava rikkomusraportointi.

Todistusaineiston on oltava **uusittavaa** määritellyllä kadenssilla: vuosittain vähintään, Gold-tasolla neljännesvuosittain.

### Miten tämä muuttaa auditointitilanteen

Käytännön ero on siinä, mitä auditoija saa tehdä kysymyksen jälkeen.

**Ilman §3:a:** "Onko teillä henkilöllisyyden todentaminen?" — "On." — merkintä ruutuun.

**§3:n kanssa:** "Onko teillä henkilöllisyyden todentaminen?" — "On." — "Kuka sen on todentanut, ja millä päivämäärällä? Näytä telemetriaotos sidontatapahtumista. Näytä yksi tapahtuma, jossa henkilön todennus peruttiin, ja kellonaika jolloin peruutus eteni ketjun viimeiseen agenttiin."

Kolmas kysymys on se, joka ratkaisee. Sitä ei voi vastata dokumentilla — vain lokilla.

Tämä on myös syy siihen, miksi §3 nimeää nimenomaan **neljä** vaihtoehtoista todistusmuotoa eikä vaadi kaikkia. Pieni toimittaja ei kykene neljään SOC 2 -auditointiin, mutta kykenee allekirjoitettuun lokiin. Vaatimus on todennettavuus, ei kalleus.

### Yksi rehellinen aukko

Muodollista akkreditointipolkua "KYA-S1-arvioijalle" ei ole olemassa. §3 nimeää esimerkkejä pätevästä arvioijasta muttei rekisteriä, josta sellaisen löytäisi. Tämä on standardin nykyversion aito heikkous, ja se on parempi sanoa ääneen kuin peittää: ostajan on toistaiseksi arvioitava arvioijansa itse. Kommenttikausi on auki tästä syystä.

## 5. Miksi emme myönnä itsellemme yhtään tieriä

Tässä kohtaa teksti kääntyy meihin.

Lifetime Oy ylläpitää KYA-S1:n referenssitoteutusta osana DWS IQ -alustaa. Kaikki seitsemän domainia on toteutettu jossain muodossa: IDV-toimittajat tokensidonnalla, Firehorse-käyttäytymistelemetria, Subagent Registry kyvykkyysmanifestilla, TC-4 Leash Snap -ketjuterminointi, vastuunattribuutiotaksonomia, ATS-luottamuspistemoottori ja muistin auditointijälki vesileimauksella.

Elokuussa 2026 tehty katselmus löysi tästä toteutuksesta kohdan, joka ei pitänyt paikkaansa. **TRS-1** vaatii luottamuspisteeltä dokumentoidut syötteet: IDV-tila, käyttäytymisen etäisyys perustasosta, red-team-asento ja kyvykkyysmanifestin laajuus. Toimitettu kaava pisteytti rikkomusten määrää, estettyjen polkujen yrityksiä ja keskimääräistä vasteaikaa. **Yksikään neljästä vaaditusta syötteestä ei esiintynyt siinä.**

Seuraus oli täsmällinen eikä teoreettinen: ihmisen todennuksen peruutus ei liikuttanut luottamuspistettä lainkaan. Koko §4:n Artikla 14 -kytkentä IDV:n ja TRS:n välillä oli olemassa kaaviossa mutta ei koodissa. Ketju *näytti* katkeavan.

**Osittainen korjaus, 7.–8. elokuuta 2026.** IDV-tila on nyt pakollinen syöte ja hard kill: peruutettu, vanhentunut tai tuntematon ihmisprincipal romahduttaa pisteen nollaan riippumatta agentin omasta käytöksestä. Vanhentuminen raportoidaan erillään peruutuksesta, koska ne vaativat eri operaattoritoimen. Syöte tehtiin **pakolliseksi parametriksi** eikä valinnaiseksi — valinnainen parametri olisi antanut kutsujan hiljaa ohittaa juuri sen kontrollin, jota varten syöte on olemassa.

**Kolme neljästä syötteestä puuttuu yhä.** Käyttäytymisen etäisyys perustasosta, red-team-asento ja manifestin *laajuus* eivät vaikuta pisteeseen. Manifestin **voimassaolo** tarkistetaan, sen **laajuus** ei. TRS-1 ei siis ole täytetty.

Siksi: **DWS IQ -alustalle ei myönnetä KYA-S1-attestaatiota itse, eikä mitään tieriä väitetä.** Yllä oleva luettelo domaineista on arkkitehtuurikuvaus, ei attestaatio. Kun riippumaton arvioija allekirjoittaa sellaisen, se sanotaan — arvioijan nimellä ja päivämäärällä, kuten §8 vaatii.

Tämä conformance-note julkaistiin spesifikaatiossa sen sijaan että vika olisi korjattu hiljaa. Syy on §3 itse: **referenssitoteutus, jonka kuvataan täyttävän kontrolli jota se ei täytä, on self-attestationia laiminlyönnin kautta.** Standardi, joka kieltää sen muilta ja tekee sen itse, ei ole standardi vaan markkinointimateriaali.

## 6. Tuotanto-roadmap — järjestys, ei päivämääriä

Korjausvelka on kirjattu auditlistaksi: 16 työkohtaa, 12 tiedostoa, prioriteetti ja hyväksymiskriteeri kohdittain. Kolme estävää kohtaa (P0) on korjattu. Loput ovat auki.

Järjestys on tässä tärkeämpi kuin aikataulu, koska kohdat riippuvat toisistaan:

**1. Luottamuspisteen syötteet ennen tiereitä.** Ei ole mieltä hakea attestaatiota kontrollille, jonka kolme neljästä syötteestä puuttuu. Jäljellä olevista syötteistä käyttäytymisen perustaso on määrittelypäätös, ei koodityö: perustaso, etäisyysmitta ja painotus on valittava ennen kuin mitään voi toteuttaa. Lupaavin polku on johtaa perustaso kyvykkyysmanifestista — se toimii ilman telemetriahistoriaa ja kytkee manifestin laajuuden mukaan samalla kertaa, jolloin kaksi puuttuvaa syötettä ratkeaa yhdellä päätöksellä.

**2. Väärä signaali pois ennen kuin sen päälle rakennetaan.** Nykyinen kaava rankaisee vasteajasta: yli 500 ms keskiviive laskee luottamuspistettä. Tämä on väärinpäin täsmällisellä tavalla. Ruuhkainen verkko tai kylmäkäynnistys laskee agentin luottamusta ja voi työntää sen oikeusrajan yli, vaikka agentti ei ole tehnyt mitään epäluotettavaa. Hitaus ja epälojaalius eivät ole sama signaali eivätkä saa jakaa kanavaa. Infrastruktuurin heikentyminen kuuluu reitittää ihmiselle fail-closed-sääntönä, ei hiljaa muuttaa auktorisointiarvoa.

**3. Rikkomuslaskurille aikaikkuna, vaimennus ja rehabilitaatio.** Rikkomusten määrä on nyt laskuri ilman ikkunaa: kutsuja valitsee telemetriajakson, eikä valintaa ole dokumentoitu missään. Sessiokohtainen telemetria antaa yhden luvun, 12 kuukauden telemetria toisen — samasta agentista. Ilman puoliintumisaikaa neljä rikkomusta jäädyttää agentin pysyvästi, eikä mikään dokumentti kerro, miten nollaan pudonnut agentti palaa käyttöön tai kuka sen valtuuttaa. Kaikki kolme ovat edellytyksiä sille, että TRS-1:n "dokumentoidut syötteet" -väitteen voi ylipäänsä esittää.

**4. Lease Tokenin dokumentointi ennen TRS-4:n toteutusta.** Allekirjoitettu, aikaan sidottu manifestin hard kill on jo koodissa, ja se on lähin olemassa oleva vastine TRS-4:n atomiselle valtuutustokenille. Se on myös näkymätön kaikissa kolmessa sisäisessä standardissa. Kontrollia, jota mikään dokumentti ei nimeä, ei voi attestoida — §3 vaatii arkkitehtuuridokumentaatiota tai telemetriaa, eikä kumpikaan kuvaa mekanismia jota ei ole kirjoitettu mihinkään.

**5. Vasta tämän jälkeen: mittaus, ja mitatut luvut §8:n kahteen tyhjään sarakkeeseen.**

Päivämääriä ei tässä anneta, koska niitä ei ole resursoitu. Päivämäärä ilman resurssia on sama asia kuin arvattu SLA-luku — lupaus, jonka takana ei ole mitään.

## 7. Mitä ostajan kannattaa kysyä

Jos olet hankkimassa autonomista agenttia järjestelmiisi, tässä on kolme kysymystä, jotka erottavat todennetun toimittajan vakuuttavasta:

1. **"Mikä tier, kenen arvioimana, minä päivänä?"** Tier-väite ilman arvioijan nimeä ja päivämäärää ei ole tier-väite. Spesifikaatio vaatii molemmat samassa lauseessa.
2. **"Näytä yksi telemetriatapahtuma, jossa ihmisen todennus peruttiin, ja kellonaika jolloin peruutus eteni viimeiseen alempaan agenttiin."** Tämä on yksi kysymys, jota ei voi vastata dokumentilla.
3. **"Mitkä TRS-1:n neljästä syötteestä ovat toteutuksessanne, ja mitkä eivät?"** Kysy se juuri noin. Meidän vastauksemme tähän kysymykseen on julkinen ja se on "yksi neljästä". Toimittaja, joka vastaa "kaikki neljä" empimättä ja ilman lokia, vastaa kysymykseen jota ei esitetty.

## 8. Yhteenveto

Attestointitierit eivät ole hinnoittelutasoja. Ne ovat kolme rehellistä lupausta, joista ostaja valitsee sen, jonka riskitasoonsa tarvitsee — ja jokainen niistä on todennettu jonkun muun kuin toimittajan itsensä toimesta.

Standardin arvo mitataan siinä, mitä se kieltää sen julkaisijalta. KYA-S1 kieltää meiltä juuri nyt attestaation, jonka voisimme itsellemme kirjoittaa viidessä minuutissa. Se on koko pointti.

**Seuraavassa osassa (9/11):** Lifetime World Model globaalina tilarekisterinä — mihin IDV-sidokset, TRS-historia ja PRV-vedokset oikeastaan kirjoitetaan, ja yksi termiristiriita, joka on yhä ratkaisematta.

---

**Risto Anton Päärni**
_Perustaja & toimitusjohtaja, Lifetime Oy_
_Päätoimittaja, Lifetime Scope Journal_
