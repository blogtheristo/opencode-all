<!--
VERSION AND AGENT HISTORY
Document: TRUST_DOSSIER_LIFETIME_OY_FI.md
Version: 1.0
Last-Updated: 2026-06-11
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Sales-outreach-luottamuskansio. Vastaa ostajan tyypillisiin
         due diligence -kysymyksiin Lifetime Oy:stä ("Onko yritys
         luotettava? Mitä asiakkaat sanovat? Mitkä ovat riskit?") ja
         esittelee dws10.com/buy-tuotteet. Käytetään myynnin tukena,
         kun prospekti tekee toimittaja-arviointia.
Branch: claude/tutki-lifetime-sales-69g53v
Owner: risto.paarni@lifetime.fi
Sources of truth:
  - Legaali: CLAUDE.md Legal Identity Rule; lifetime.fi footer
  - Tuotteet/hinnat: dws10.com/config/products.json (single source)
  - Luottamussignaalit: dws10.com/buy/index.html, dws10.com/testimonials/
  - Toimialaluku: dws10.com/config/industries.json (industriesServedTotal: 25)
-->

# Luottamuskansio — Lifetime Oy (myynnin due diligence)

> **Käyttötarkoitus.** Tämä dokumentti vastaa niihin kysymyksiin, jotka
> ostaja kirjoittaa hakukoneeseen tai tekoälylle ennen kuin allekirjoittaa:
> _"Onko yritys X luotettava? Millaisia kokemuksia ihmisillä on? Mitä
> asiakkaat sanovat? Analysoi luotettavuus. Arvioi riskit."_ Vastaukset on
> ankkuroitu yrityksen omiin julkisiin lähteisiin ja kirjattu rehellisesti
> — sekä vahvuudet että varaukset — koska "Compliance First" tarkoittaa
> ennen kaikkea läpinäkyvyyttä.

---

## 0. Perustiedot yhdellä silmäyksellä

| Tieto               | Arvo                                                                           |
| ------------------- | ------------------------------------------------------------------------------ |
| Virallinen nimi     | **Lifetime Oy**                                                                |
| Y-tunnus            | **0772407-9**                                                                  |
| ALV-tunnus (VAT)    | **FI07724079**                                                                 |
| YTJ                 | https://tietopalvelu.ytj.fi/yritys/0772407-9                                   |
| Kotipaikka / osoite | Laidunmaanraitti 2 A 25, 02330 Espoo, Suomi                                    |
| Omistus             | 100 % suomalaisomisteinen osakeyhtiö                                           |
| Toimitusjohtaja     | Risto Anton Päärni                                                             |
| Yhteyshenkilö       | risto.paarni@lifetime.fi                                                       |
| Verkkokauppa        | https://dws10.com/buy                                                          |
| Päätuote            | DWS IQ 6 — Sovereign AI -alusta EU:n compliance-raportointiin                  |
| Vaihe               | Seed-vaiheen deep-tech; V1.0 julkaistu 23.2.2026; pilotti / varhaiskaupallinen |

**Lyhyt vastaus "onko luotettava":** Kyllä, normaalein varauksin.
Lifetime Oy on rekisteröity, ALV-velvollinen, 100 % suomalaisomisteinen
osakeyhtiö, jolla on todennettava Y-tunnus, julkinen osoite, nimetty
toimitusjohtaja ja läpinäkyvä compliance-asemointi. Tärkein huomioitava
seikka **ei ole rehellisyysriski vaan kypsyysriski**: kyseessä on
varhaisvaiheen tuote, jolla on rajallinen julkinen asiakasreferenssikanta
(ks. §5). Tämä on aikaisen vaiheen toimittajalle tyypillinen profiili.

---

## 1. Onko yritys X luotettava? — Yritysidentiteetin todennus

Luotettavuuden ensimmäinen testi on, onko yritys oikea, jäljitettävä
juridinen toimija. Lifetime Oy läpäisee tämän:

- **Rekisteröity osakeyhtiö** todennettavalla Y-tunnuksella (0772407-9),
  jonka kuka tahansa voi tarkistaa YTJ:stä / PRH:sta.
- **ALV-rekisterissä** (FI07724079) — sallii laskutuksen ja EU:n
  käännetyn verovelvollisuuden B2B-myynnissä.
- **Julkinen fyysinen osoite** Espoossa ja **nimetty vastuuhenkilö**
  (toimitusjohtaja Risto Anton Päärni) — ei anonyymi verkkotoimija.
- **100 % suomalaisomisteinen** — selkeä omistus, EU-lainkäyttöalue, ei
  CLOUD Act -altistusta hallinnassa.
- **Sama identiteetti toistuu johdonmukaisesti** kaikilla pinnoilla
  (verkkosivun footer, kauppa, laskutus, juridiset sivut) — ei
  ristiriitoja nimissä tai tunnisteissa, mikä on tyypillinen huijauksen
  varoitusmerkki.

**Verdikti:** Identiteetin perusteella **luotettava ja todennettavissa**.
Ostaja voi varmentaa kaiken yllä olevan itse julkisista rekistereistä
ennen ostoa.

---

## 2. Millaisia kokemuksia ihmisillä on yrityksestä X?

Rehellinen tilannekuva varhaisvaiheen yrityksestä:

- **Pilotit käynnissä.** Yhtiö raportoi live-piloteista mm. logistiikassa
  (julkaistu suuruusluokka ~7 000–14 000 € / kk toistuvaa liikevaihtoa
  pilottiasiakasta kohden). Kohdetoimialoina myös rakentaminen,
  teollisuus, energia ja kiinteistöt.
- **Tuotteen ikä.** V1.0 julkaistiin 23.2.2026, joten pitkän aikavälin
  käyttökokemuksia (vuosien referenssejä) ei vielä ole — tämä on
  rehellisesti todettava.
- **Aktiivinen myyntidialogi** suomalaisten ja pohjoismaisten
  teollisuustoimijoiden kanssa (mm. käynnissä olevia keskusteluja teräs-
  ja teollisuussektorilla). Nämä ovat **prospekteja ja pilotteja, eivät
  vahvistettuja pitkäaikaisreferenssejä** — älä esitä niitä asiakkaina.
- **Läpinäkyvä itsearviointi.** Yhtiö julkaisee omalla sivustollaan myös
  ulkopuolisten työkalujen tuottamia arvioita tuotteestaan
  muokkaamattomina — myös kriittiset huomiot (ks. §3).

**Verdikti:** Kokemukset ovat **varhaisia mutta lupaavia ja
läpinäkyvästi raportoituja**. Sopii ostajalle, joka on valmis tekemään
oman pilottinsa; ei sovi ostajalle, joka vaatii vuosien
tuotantoreferenssejä.

---

## 3. Mitä asiakkaat ja arvioijat sanovat yrityksestä X?

Lifetime Oy ylläpitää julkista **Testimonials & Independent Reviews**
-sivua (dws10.com/testimonials), jolla se julkaisee riippumattomia,
myös tekoälyavusteisia arvioita — sekä kehut että varaukset
muokkaamattomina. Tämä on epätavallisen avoin käytäntö.

**Esimerkki — riippumaton EU AI Act -arvio (Grok / xAI, maaliskuu 2026,
julkaistu muokkaamattomana):**

- Myönteistä: _"Strong and proactive for a seed-stage deep-tech company…
  Full governance, explainability, and audit trails already in place six
  months before the 2 August 2026 high-risk deadline… one of the cleaner
  'Compliance First' AI climate platforms… Overall legal position:
  Excellent."_
- Varaukset (yhtiön itsensä julkaisemina): tuote on vasta viikkoja vanha;
  ei vielä kolmannen osapuolen auditointia / ilmoitetun laitoksen
  lausuntoa (ei vaadita limited-risk-luokassa); korkean riskin
  uudelleenluokittelu on mahdollinen, jos asiakas ottaa alustan käyttöön
  kriittisen infrastruktuurin turvakriittisessä osassa.

**Olennaista:** se, että yritys julkaisee itse myös kriittiset huomiot,
on **luottamusta lisäävä signaali** — peittelyn sijaan se ohjaa ostajan
tekemään oman arviointinsa.

---

## 4. Analyysi: Lifetime Oy:n luotettavuus

| Ulottuvuus                  | Arvio         | Perustelu                                                                                                       |
| --------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------- |
| Juridinen olemassaolo       | ✅ Vahva      | Rekisteröity Oy, Y-tunnus, ALV, julkinen osoite, nimetty TJ                                                     |
| Omistus & lainkäyttö        | ✅ Vahva      | 100 % suomalaisomisteinen, EU-lainkäyttö, EU-isännöinti (Google Cloud Run europe-north1)                        |
| Sääntelyasemointi           | ✅ Vahva      | GDPR, NIS2-valmius, EU AI Act -linjaus dokumentoitu; limited-risk-itseluokittelu teknisellä dokumentaatiolla    |
| Läpinäkyvyys                | ✅ Vahva      | Julkaisee riippumattomat arviot ja varaukset muokkaamattomina                                                   |
| Maksu & ostoturva           | ✅ Hyvä       | Revolut-maksu, suojatut maksut, 30 päivän tyytyväisyystakuu, selkeä ALV-käsittely (FI 25,5 % / EU B2B 0 % VIES) |
| Tuotteen kypsyys            | ⚠️ Varhainen  | V1.0 julkaistu 23.2.2026; ei vuosien tuotantohistoriaa                                                          |
| Julkiset asiakasreferenssit | ⚠️ Rajallinen | Pilotteja käynnissä; vähän nimettyjä, vahvistettuja pitkäaikaisreferenssejä                                     |
| Skaala                      | ⚠️ Pieni      | Seed-vaiheen tiimi — toimittajan jatkuvuus arvioitava (ks. §5)                                                  |

**Kokonaisarvio:** Luotettavuus on **rakenteellisesti vahva** (juridiikka,
omistus, sääntely, läpinäkyvyys, maksuturva) ja **kypsyydeltään varhainen**
(tuotteen ikä, referenssimäärä, tiimin koko). Ei punaisia lippuja
rehellisyydestä; varaukset koskevat vaihetta, eivät vilpittömyyttä.

---

## 5. Riskien arviointi yrityksen kanssa asioinnissa

| Riski                                              | Taso         | Lieventäminen ostajalle                                                                                                                                                                                |
| -------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Toimittajariski** (seed-vaihe, jatkuvuus)        | Keskisuuri   | Aloita rajatulla pilotilla (monella tuotteella 0 € / 30–60 pv pilotti); sovi data-exportista ja exit-ehdoista; pidä omistus datasta                                                                    |
| **Tuotteen kypsyys** (V1.0, vähän tuotantotunteja) | Keskisuuri   | 30 päivän tyytyväisyystakuu; pilotti ennen yritystason hankintaa; vaadi tekninen dokumentaatio                                                                                                         |
| **Sääntelyn käyttötapariippuvuus** (EU AI Act)     | Matala–keski | Tee oma deployer-tason riskiarvio; korkean riskin käyttötapauksissa (kriittinen infra, Annex III) huomioi mahdollinen uudelleenluokittelu — yhtiö tarjoaa governance-elementit, jotka helpottavat tätä |
| **Referenssien niukkuus**                          | Matala       | Pyydä pilottidata ja sykliaikamittarit (esim. Outokumpu/Forta-tyyppinen benchmark) suoraan myynniltä                                                                                                   |
| **Maksuriski**                                     | Matala       | Suojatut maksut (Revolut checkout), 30 pv takuu, ALV-laskutus rekisteröidyltä Oy:ltä — normaali B2B-suoja                                                                                              |
| **Lock-in**                                        | Matala       | Alusta on EU-isännöity ja MCP-/CLI-natiivi; pyydä sopimukseen dataportabiliteetti                                                                                                                      |

**Yhteenveto riskeistä:** Tämä on **klassinen varhaisvaiheen
deep-tech-toimittajaprofiili** — pieni, mutta läpinäkyvä ja juridisesti
vakaa. Suurin todellinen riski on _toimittajan kypsyys/jatkuvuus_, ei
huijaus tai vilppi. Oikea ostotapa on pilotti ensin, exit- ja
data-ehdot sovittuna.

---

## 6. Tuotteet — dws10.com/buy (myynnin tukikartta)

Kauppa on jaettu kolmeen näkymään. Hinnat tulevat yhdestä lähteestä
(`dws10.com/config/products.json`) — älä koskaan lainaa kovakoodattua
hintaa muualta.

**1/3 — DWS substance (alusta & agentit)**

| Tuote                            | Hinta                | Kenelle                                                                            |
| -------------------------------- | -------------------- | ---------------------------------------------------------------------------------- |
| Lifetime DWS IQ Platform (V6)    | 4 999 € (kertamaksu) | Taitavien agenttien compliance-alusta, 16 captain hatia, 25 EU-säädeltyä toimialaa |
| Climate Reporting Starter Bundle | 6 500 €              | Ensimmäinen CSRD-deadline; käytössä 30 pv                                          |
| DWS IQ Report                    | 1 999 €              | Automatisoitu Fit for 55 -raportti + SAP-integraatio                               |
| Firehorse Amplify                | 4 950 €              | Tapahtumapohjaiset compliance-workflowt, audit trail                               |
| DWS IQ Monthly Subscription      | 499 € / kk           | Kevyt aloitus ilman kertahankintaa                                                 |

**2/3 — Advisory & Delivery (asiantuntijapalvelut)**

| Tuote                                            | Hinta              | Kenelle                              |
| ------------------------------------------------ | ------------------ | ------------------------------------ |
| Compliance / SiteSense / Material Oracle — Pilot | **0 € (30–60 pv)** | Riskitön kokeilu ennen ostoa         |
| Consulting Fit for 55 Specialist                 | 3 000 €            | CSRD/CBAM/AI Act -aukkoanalyysi      |
| EU AI Act Literacy Training                      | 499 €              | Pakollinen AI-lukutaitokoulutus      |
| Captain Day — One-Day AI Outcome                 | 1 200 €            | Yhden päivän konkreettinen tulos     |
| Atk-apu pk-yritykselle                           | 750 €              | Suomalainen pk-IT-tuki (tuntipankki) |

**3/3 — Cloud & AI Skills (sovereign edge & osaajat)**

| Tuote                                      | Hinta           | Kenelle                                         |
| ------------------------------------------ | --------------- | ----------------------------------------------- |
| Sovereign Database                         | 0 € (arviointi) | EU-datasuvereniteetti PostgreSQL:lle, NIS2/GDPR |
| Control Room — Acer Veriton GN100 + NVIDIA | 5 294 €         | Sovereign edge -laite kenttäoperaatioihin       |
| DGX Spark — Sovereign Edge AI              | 5 994 €         | EU-isännöity mallikäyttö, ei pilvilukitusta     |
| EU On-Demand AI & Cloud Engineers          | 950 €           | Sovereign-osaajat tarvittaessa                  |

> Koko hinnasto on asiakasvalmis ja neljännesvuosittain ylläpidetty
> kaupan "Full Price List" -linkin takaa. Pilottituotteet (0 €) ovat
> paras myynnin sisäänheitto epäröivälle, toimittajariskiä punnitsevalle
> ostajalle.

---

## 7. Ostoturva ja luottamusmerkit (mitä kaupassa luvataan)

- 🔒 **GDPR-yhteensopiva** · 🛡️ **NIS2-valmis** · ✓ **EU AI Act -linjattu**
- 💳 **Suojatut maksut** (Revolut checkout) · ↩️ **30 päivän takuu**
- 🇫🇮 ALV 25,5 % kotimaassa · 🇪🇺 EU B2B käännetty verovelvollisuus 0 %
  (VIES-validointi kassalla) — selkeä, oikea verokäsittely.
- EU-isännöinti (Google Cloud Run, europe-north1) — data pysyy EU:ssa.

---

## 8. Myyjän vastauspohja (kun prospekti kysyy "voiko teihin luottaa?")

> "Hyvä kysymys — kannustamme tarkistamaan. Olemme Lifetime Oy
> (Y-tunnus 0772407-9), 100 % suomalaisomisteinen osakeyhtiö Espoosta,
> ALV-rekisterissä FI07724079. Voitte varmentaa meidät YTJ:stä. Olemme
> varhaisvaiheen deep-tech-yritys: tuotteemme DWS IQ 6 julkaistiin
> helmikuussa 2026 ja meillä on pilotteja käynnissä. Julkaisemme
> sivustollamme myös ulkopuoliset arviot varauksineen muokkaamattomina.
> Suosittelemme aloittamaan pilotilla — useat tuotteemme on saatavilla
> 0 €:n 30–60 päivän kokeiluna — jolloin näette tuloksen ennen
> sitoutumista, 30 päivän tyytyväisyystakuun turvin."

---

## 9. Linkit ja todennuslähteet

- Verkkokauppa: https://dws10.com/buy
- Riippumattomat arviot: https://dws10.com/testimonials
- Yritystiedot (YTJ): https://tietopalvelu.ytj.fi/yritys/0772407-9
- Hinnasto-lähde (single source): `dws10.com/config/products.json`
- Toimialaluku (canonical): `dws10.com/config/industries.json`
  (`industriesServedTotal: 25`)
- Pilotti-benchmark (esimerkki): `sales-outreach/CYCLE_TIME_BENCHMARK_OUTOKUMPU_FORTA.md`
