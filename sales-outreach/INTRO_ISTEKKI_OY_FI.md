<!--
VERSION AND AGENT HISTORY
Document: INTRO_ISTEKKI_OY_FI.md
Version: 1.0
Last-Updated: 2026-06-29
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Sales-outreach -konteksti Istekki Oy:n markkinavuoropuheluun.
         Kohteena Istekin Teams-markkinavuoropuhelun kolme esittäjää
         (hankintapäällikkö, hankinta-asiantuntija, palvelumuotoilija).
         Hankinnan kohde: SoTe-ICT / palvelumuotoilu (vahvistettu käyttäjä 2026-06-29).
         Kärki: arkaluonteinen SoTe-data → suvereeni data + NIS2 (terveys-sektori)
         + EU AI Act (terveydenhuollon AI = high-risk) + auditoitava AI-UX.
Branch: claude/sales-outreach-istekki-cqazhi
Date: 2026-06-29
Owner: risto.paarni@lifetime.fi
Recipient: Istekki Oy — hankintatiimi (markkinavuoropuhelun esittäjät)
-->

# INTRO — Istekki Oy (markkinavuoropuhelu)

## Yritys

| Tieto           | Arvo                                                                                                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nimi            | Istekki Oy                                                                                                                                                            |
| Y-tunnus        | 2292633-0 _(vahvistettu istekki.fi 2026-06-29)_                                                                                                                       |
| YTJ             | https://tietopalvelu.ytj.fi/yritys/2292633-0                                                                                                                          |
| Kotipaikka      | Kuopio                                                                                                                                                                |
| Toimiala        | Tieto-, viestintä- ja terveysteknologia (ICMT); ~1400 asiantuntijaa                                                                                                   |
| Omistus         | Asiakkaiden omistama, **voittoa tavoittelematon inhouse-yhtiö** (hyvinvointialueet + kunnat)                                                                          |
| Asiakkaat       | Hyvinvointialueet ja kunnat; vaikuttaa yli 4 milj. ihmisen arkeen                                                                                                     |
| Toimitusjohtaja | Lasse Koskivuori                                                                                                                                                      |
| Sähköpostimuoto | etunimi.sukunimi@istekki.fi _(vahvistettu)_; viranomaisposti kirjaamo@istekki.fi                                                                                      |
| Hankinnat       | Kilpailuttaa ~60 % liikevaihdostaan avoimilta markkinoilta (yli 1000 toimittajaa); hankinnan elinkaarihallinnan malli. Tietopyynnöt ja markkinavuoropuhelut Hilmassa. |
| Merkit          | Avainlippu + Yhteiskunnallinen yritys; Kustos Ry:n jäsen                                                                                                              |

> **Asetelma (tärkeä):** Istekki on **inhouse-hankintayksikkö**, joka kilpailuttaa
> palvelut omistaja-asiakkaidensa (hyvinvointialueet/kunnat) puolesta hankintalain mukaan.
> Lifetime/DWS:n polku on siis **kilpailutettu toimittaja/alihankkija** — ja tekninen
> markkinavuoropuhelu on juuri se toimittajille avoin kanava, jossa vaatimusmäärittelyyn
> vaikutetaan ennen kilpailutusta. SoTe on Istekin toimintaympäristö, mutta tämän tietopyynnön
> kohde on laajempi: **asiantuntijatyön puitejärjestely** (ks. seuraava osio).

## ⏰ Tietopyyntö 243/02.08.06/2026 — AIKAKRIITTINEN

**Lähde:** TED/Hilma-ilmoitus (käyttäjä toimitti virallisen ilmoituksen 2026-06-29).
Ilmoituksen tunniste `c0866dc5-42e0-4d2e-8b0a-0855433da732`, versio 01.
**Julkiset hankinta-asiakirjat (ei rajoitettu):** https://tarjouspalvelu.fi/istekki?id=612127&tpk=b8ead72b-7b81-4fd5-9562-b9e5b32f344b
_(huom: portaali estää automaattihaun — sisältö pyydettävä `hankinnat@istekki.fi` tai avattava selaimessa.)_

| Tieto              | Arvo                                                                                                                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Diaarinumero       | **243/02.08.06/2026**                                                                                                                                                                                    |
| Ilmoitustyyppi     | **Ennakkoilmoitus / tekninen markkinavuoropuhelu (tietopyyntö)** — TED **eF04**, lomaketyyppi Suunnittelu. Oikeusperusta dir. 2014/24/EU. _Istekin teksti: "kyseessä on tietopyyntö, ei tarjouspyyntö"._ |
| Ostaja             | **Istekki Oy** (2292633-0), PL 4000, 70601 Kuopio, Pohjois-Savo (FI1DB). Julkisoikeudellinen yhteisö; **hankintaviranomaisen toiminta: Terveys**                                                         |
| Yhteyspiste        | Hankinta · `hankinnat@istekki.fi` · +358 17 618 0700                                                                                                                                                     |
| Kohde              | Asiantuntijatyön hankinta: data-analytiikka, tietojohtaminen, **tekoäly**, ohjelmistoautomaatio, testaus                                                                                                 |
| Hankintalaji / CPV | Palvelut; pää-CPV **72000000** (IT-palvelut). Lisäkoodit: 72200000, 72212000, 72220000, 72300000, 72600000, **72800000 (auditointi- ja testauspalvelut)**                                                |
| Hankintamalli      | **Puitejärjestely**; asiantuntijatyö/-palvelut erillistilauksilla, sis. ylläpito/tuki/jatkuva palvelu. Tavoite: pitkäjänteinen kumppanuus                                                                |
| Rakenne            | **5 osaamiskategoriaa → 12 osa-aluetta**; kuhunkin valitaan **max 10** vähimmäisvaatimukset täyttävää toimittajaa                                                                                        |
| Suorituspaikka     | Missä tahansa ETA-alueella; **GPA (WTO) sovelletaan: kyllä**                                                                                                                                             |
| Muutoksenhaku      | Markkinaoikeus (markkinaoikeus@oikeus.fi)                                                                                                                                                                |
| Velvoittavuus      | Ei sido Istekkiä; kilpailutus voidaan jättää järjestämättä; vastaaminen vapaaehtoista ja korvauksetonta                                                                                                  |

**5 osaamiskategoriaa:** 1) data-analytiikan asiantuntijatyö · 2) tietojohtamisen konsultointi · 3) **tekoälyn asiantuntijatyö** · 4) ohjelmistoautomaation asiantuntija · 5) testauksen asiantuntijatyö.

### Aikajana ja toimenpiteet (tänään 2026-06-29)

| Pvm                     | Tapahtuma                                            | Toimenpide                                                                                      |
| ----------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **ennen 7.7.2026**      | Materiaalipyynnön ikkuna sulkeutuu                   | **Pyydä kommentoitava materiaali** osoitteesta `hankinnat@istekki.fi` — **8 päivää aikaa**      |
| 7.7.–2.8.2026           | Kesätauko                                            | Istekki **ei toimita** materiaaleja tällä välillä                                               |
| 2.8.2026 →              | Ikkuna aukeaa uudelleen                              | Vaihtoehtoinen pyyntöaika, jos 7.7. ei ehdi                                                     |
| **11.8.2026 klo 12.00** | **Kommenttien määräaika**                            | Toimita kommentit suomeksi `hankinnat@istekki.fi`; liitteeksi sallitaan suomenkieliset esitteet |
| **~26.8.2026**          | Tarjouspyynnön arvioitu julkaisu (Istekin oma arvio) | Varsinainen kilpailutus aukeaa → tarjousvalmius (vähimmäisvaatimukset, referenssit, ESPD)       |

**Pakollinen otsikointi materiaalipyyntöön:**
`[Yritys xxx], Pyyntö kommentoida asiakirjoja: Asiantuntijatyön hankinta data-analytiikkaan, tietojohtamiseen, tekoälyyn yms.`

> **DWS-osumat kategorioihin:** Lifetime/DWS IQ on vahvimmillaan kategoriassa **3 (tekoäly)** —
> suvereeni AI, KYA-agenttihallinta, EU AI Act -auditoitavuus — sekä **1 (data-analytiikka)**,
> **2 (tietojohtaminen)** ja **4 (ohjelmistoautomaatio)**. Testaus (5) mahdollinen quality-gate-agentilla.
> Matala kynnys: max 10 toimittajaa/osa-alue, ei winner-take-all → puitteisiin pääsy realistinen.

## Markkinavuoropuhelun esittäjät (Teams-tapahtuma)

Lähde: käyttäjän toimittama Teams-tapahtuman "Esittäjät (3)" -näkymä (IMG_6730);
LinkedIn-vahvistukset IMG_6734. Yhteysaste = Risto Päärnin verkostoon.

| Nimi                  | Rooli Istekissä (LinkedIn)                                   | Rekisterin rooli         | Aste | Outreach-merkitys                                 |
| --------------------- | ------------------------------------------------------------ | ------------------------ | ---- | ------------------------------------------------- |
| **Saila Pekkarinen**  | Hankintapäällikkö                                            | R21 Head of Procurement  | —    | Hankinnan omistaja — **ensisijainen kohde**       |
| **Noora Lappalainen** | Hankinta-asiantuntija / Procurement Specialist (HAAGA-HELIA) | R21-tuki / valmistelija  | 2.   | Tekninen vuoropuhelu, portinvartija               |
| **Vesa Huotari**      | Palvelumuotoilija                                            | R09/R10 (service-design) | —    | Käyttäjälähtöisyys — AI-UX- ja auditoitavuuskärki |

## Lämpimät reitityskontaktit — avainasiakaspäälliköt

Istekin avainasiakaspäälliköt (alueittain) ovat luontevia lämpimiä reittejä toimittajasuhteen
avaamiseen markkinavuoropuhelun rinnalla. SoTe-ICT-hankinta kohdistuu hyvinvointialueille → valitse
alueen mukaan tai keskuskaupungit/tukipalveluyhtiöt. Lähde: istekki.fi/yhteystiedot.

| Nimi              | Vastuualue                           | Yhteys                                          |
| ----------------- | ------------------------------------ | ----------------------------------------------- |
| Tapio Rauma       | Keskuskaupungit ja tukipalveluyhtiöt | tapio.rauma@istekki.fi · +358 40 526 8231       |
| Kimmo Hartikainen | Keski-Suomi ja Länsi-Suomi           | kimmo.hartikainen@istekki.fi · +358 44 271 4380 |
| Anne-Maria Hauhio | Etelä-Suomi                          | anne-maria.hauhio@istekki.fi · +358 40 504 0030 |
| Jari Laakkonen    | Pohjois-Suomi                        | jari.laakkonen@istekki.fi · +358 43 824 4408    |
| Petteri Saario    | Itä-Suomi                            | petteri.saario@istekki.fi · +358 50 444 6631    |
| Pekka Surakka     | Laboratoriot                         | pekka.surakka@istekki.fi · +358 40 869 1889     |

> **Reititysohje:** Lifetimen kotipaikka on Espoo (Etelä-Suomi) → ensisijainen lämmin reitti
> **Anne-Maria Hauhio**. Jos hankinta on valtakunnallinen/keskuskaupunkitasoinen → **Tapio Rauma**.
> Markkinavuoropuhelun esittäjät (Pekkarinen/Lappalainen) ovat silti hankinnan suorin kontakti.

## LinkedIn-verkosto — strategiset lisäkontaktit

Lähde: käyttäjän toimittamat LinkedIn-profiilit (IMG_6731–6733, 2026-06-29). Yhteysaste = Risto Päärnin verkostoon.

| Nimi                  | Rooli / nimike                                                                      | Org                                   | Aste   | Merkitys SoTe-ICT-vuoropuhelussa                                                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------- | ------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Harri Kumpulainen** | SoTe-ICT **hankejohtaja**, pitkän tähtäimen suunnittelu; Prosci change practitioner | Istekki Oy                            | 2.     | **Tärkein uusi kontakti** — todennäköinen hankkeen omistaja/sponsori vaiheelle, jota markkinavuoropuhelu pohjustaa. Strateginen vaikuttaja (vaihe 1–2). |
| **Lasse Koskivuori**  | Toimitusjohtaja; Kustos Ry HVPJ                                                     | Istekki Oy                            | 2.     | Vahvistaa rekisterin (tj.). Executive sponsor (vaihe 5) — näkyvyys, ei päivittäiskontakti.                                                              |
| **Jari Lintunen**     | Datakeskusasiantuntija                                                              | Istekki Oy                            | **1.** | **Lämmin sisäinen reitti** (1. aste) → luonteva intro Kumpulaiseen/hankintatiimiin. Infra/tekninen vuoropuhelu.                                         |
| **Jocka Träskbäck**   | Kaupunginhallituksen 1. varapj (kok.), Tampere                                      | Tampereen kaupunki (omistaja-asiakas) | **1.** | **Omistajapuolen** poliittinen vaikuttaja → top-down-mandaatti. Tampere on Istekin omistaja-asiakas.                                                    |
| **Sanna Kallankari**  | Strateginen muutoskyvykkyys / teknologiamurros                                      | (Pohjois-Pohjanmaa / Kempele)         | **1.** | Muutosjohtamisen kärki; tukee Prosci-/change-narratiivia. Vahvista organisaatio ennen kontaktia.                                                        |

> **Reititysstrategia:** lämpimin polku hankkeeseen kulkee **Jari Lintusen (1. aste)** kautta
> introna **Harri Kumpulaiseen** (SoTe-ICT-hankejohtaja, 2. aste) — hän on markkinavuoropuhelun
> "miksi"-taso, kun esittäjät (Pekkarinen/Lappalainen) ovat "miten"-taso. Rinnalla **Jocka Träskbäck**
> (1. aste) antaa omistaja-asiakkaan (Tampere) top-down-näkyvyyden, jos hankinta koskee Pirkanmaata.
> **Vahvistettava:** Kumpulaisen tarkka vastuualue ja onko hän juuri tämän vuoropuhelun takana.

## Wedge-by-role -matriisi (julkissektori)

Julkissektorin variantti (`DWS_ROLES_REGISTRY.md` §4): Door #1 = sääntely + suvereeni
hankinta; korostuvat roolit R05/R13/R15. Markkinavuoropuhelun esittäjät ovat
hankinta- ja palvelumuotoilupuolella (vaihe 4 + operatiivinen vaihe 2), joten
diagonaalin "voitto" rakennetaan heidän kauttaan päättäjille (CISO/CIO/lakijohto).

| Vaihe        | Rooli                              | Mitä omistaa                                       | Mitä voittaa (DWS-kärki)                                                              |
| ------------ | ---------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 4 — Driver   | R21 Hankintapäällikkö (Pekkarinen) | Hankinnan kohteen määrittely, kilpailutuksen laatu | Auditoitava, suvereeni vaatimuspohja — vähemmän valitusriskiä (vrt. MAO:296/298/2026) |
| 4 — Driver   | R21-asiantuntija (Lappalainen)     | Markkinakartoituksen valmistelu, tarjoajadialogi   | Valmis NIS2-/EU AI Act -vaatimuskartta ilman erillistä selvitystyötä                  |
| 2 — Owner    | R09/R10 Palvelumuotoilu (Huotari)  | Käyttäjälähtöinen palvelumuotoilu                  | AI-agentit, jotka tuottavat auditoitavia tuloksia — ei pelkkiä dashboardeja           |
| 3 — Approver | R15 CISO / R16 InfoSec             | NIS2-velvoitteet, tietoturva                       | SovereigntyMonitor: CLOUD Act -altistuksen pisteytys, suomalainen hosting             |
| 3 — Approver | R13 CIO / R14 Head of IT           | Arkkitehtuuri, integraatio                         | KYA-hallinta: agenttien trust scoring + kill-switch                                   |
| 1 — Sponsor  | R05 General Counsel                | Sääntelyaltistus, hankintaoikeus                   | EU AI Act -artikla 12:n mukainen auditointiketju (Article12Logger)                    |

**Diagonaali-win (sama otsikko jokaiselle):** _"EU-suvereeni, auditoitava
AI-/data-infrastruktuuri suomalaisella hostingilla ja nollalla CLOUD Act
-altistuksella."_ Tämä kelpaa riippumatta markkinavuoropuhelun täsmäaiheesta.

## Avoimet tiedot (täydennettävä ennen lähetystä)

- [x] **Hankinnan kohde** — asiantuntijatyön puitejärjestely (5 kategoriaa); diaarinumero 243/02.08.06/2026 (vahvistettu 2026-06-29).
- [x] **Määräajat** — materiaalipyyntö ennen 7.7. (tai jälkeen 2.8.); kommentit 11.8.2026 klo 12.00.
- [ ] **Kommentoitavat luonnosmateriaalit** — pyydettävä `hankinnat@istekki.fi`; sisältö nähtävissä vasta pyynnön jälkeen → tarkka vaatimusmäärittely avoinna siihen asti.
- [ ] **Mihin osa-alueisiin (12) Lifetime tähtää?** — valittava ennen kommenttien laadintaa.

## Aktiiviset signaalit (ajoituksen kärki)

- **Avoin EU-hankinta, Kuopio:** "Software package and information systems" (EU TED).
- **Markkinaoikeuden päätökset MAO:296/2026 ja MAO:298/2026** — Istekin lapsettomuushoitojärjestelmän avoimesta hankinnasta; osoittaa kilpailutuksen laadun olevan akuutti kipupiste → kärki suvereenille, auditoitavalle vaatimuspohjalle.
- **Istekin Palvelu- ja hankintawebinaarit** — toimittajille suunnattu vakituinen markkinavuoropuhelun kanava (toukokuun 2026 kierros: asiakkaat 12.5., toimittajat 13.5.).

## Seuraavat askeleet

1. **[NYT, ennen 7.7.]** Lähetä materiaalipyyntö `hankinnat@istekki.fi` pakollisella otsikolla → ks. `LETTER_ISTEKKI_OY_MARKKINAVUOROPUHELU_FI.md` (materiaalipyyntö-versio). Lähetys Amazon SES (ei Resend, ei noreply@).
2. Päätä, mihin 12 osa-alueesta Lifetime tähtää (vahvimmat: tekoäly, data-analytiikka, tietojohtaminen, ohjelmistoautomaatio).
3. Kun materiaalit saapuvat: laadi **kommenttivastaus** (suomeksi) 11.8.2026 klo 12.00 mennessä; rakenna vaatimusten vastaavuusmatriisi DWS-kyvykkyyksiin.
4. Liitä suomenkielinen 1-sivuinen DWS IQ -esite (suvereeni AI + NIS2 + EU AI Act + KYA-hallinta).
5. Rinnalla: lämmin verkostoreitti (Lintunen → Kumpulainen) taustakeskusteluun ennen lopullista kilpailutusta.

## Liittyvät tiedostot

- `sales-outreach/LETTER_ISTEKKI_OY_MARKKINAVUOROPUHELU_FI.md` — (1) materiaalipyyntö ennen 7.7. + (2) kommenttivastauksen runko 11.8. määräaikaan.
- `DWS_ROLES_REGISTRY.md` — rooli-ID:t (R09/R10/R13/R15/R21) ja julkissektorin variantti §4.
