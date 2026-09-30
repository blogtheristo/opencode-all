# Myyntisopimus v1 — Lifetime Oy / Erkki J Anttila (LUONNOS)

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Session: claude/myyntisopimus-v1-anttila | Date: 30.09.2026 | Changes: First draft. HIC 30.09.2026: "Myyntisopimus v1. Erkki J Anttila. 1. Tuotteista selkeät lyhyet kuvaukset. Tarkista kaikki tuotteet." Liite 1 covers all 73 public (non-BLUE) products in `dws10.com/config/products.json` (priceVersion 1.33, 25.09.2026); Aegis description follows the HIC's wording. Aegis pilot acceptance terms are by reference to `AEGIS_PILOT_ACCEPTANCE_ANNEX.md` (approved 30.09.2026). | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD + DWS_ROLES_REGISTRY | HIC-approved-drift: none

Document Status:

- Created: 30.09.2026
- Last Modified: 30.09.2026
- Language: Finnish
- Languages Available: Finnish
- Publication Status: DRAFT — INTERNAL until HIC approval. Never copy to `dws10.com/`, `dws6.com/`, `onelifetime.world/`, `lifetime.fi/` or `landing-pages/`.
- Classification: CUSTOMER — vastaanottajalle sen jälkeen, kun HIC on hyväksynyt ja lakimies tarkistanut
- Status: DRAFT — HIC-päätökset [hakasulkeissa]; suomalaisen lakimiehen tarkistus ennen allekirjoitusta

---

_Luonnos 30.09.2026, versio 1.0. Merkinnät [HAKASULUISSA] odottavat Lifetime Oy:n päätöstä tai vahvistusta. Sisäinen muistio on tämän asiakirjan lopussa ja se poistetaan ennen lähettämistä._

---

# Myyntisopimus

## 1. Osapuolet

**Myyjä:** Lifetime Oy, Y-tunnus 0772407-9, ALV-tunnus FI07724079, Laidunmaanraitti 2 A 25, 02330 Espoo. Yhteyshenkilö: Risto Anton Päärni, Founder, CEO, risto.paarni@lifetime.fi, +358 400 319 010.

**Ostaja:** [Yhtiön nimi ja Y-tunnus — VAHVISTETTAVA]. Yhteyshenkilö: Erkki J Anttila, [rooli — VAHVISTETTAVA], [sähköposti], [puhelin].

_Jos ostaja on yksityishenkilö eikä yritys, tämä pohja ei kelpaa: kuluttajansuojalaki edellyttää eri ehdot._

## 2. Sopimuksen kohde

Myyjä myy ja ostaja ostaa tilausvahvistuksessa (Liite 2) luetellut tuotteet. Tuotteiden sisältö on kuvattu Liitteessä 1. Liitteen 1 kuvaus ja tilausvahvistus ratkaisevat, mitä toimitetaan. Mikään muu markkinointi- tai myyntimateriaali ei ole sitova.

Tuotteet, joiden tila on "ennakkotilaus", eivät ole vielä yleisesti saatavilla. Liite 1 kertoo tuotekohtaisesti, mikä on toimitettavissa ja mikä suunniteltua.

## 3. Hinnat ja maksu

1. Hinnat ovat euroina ilman arvonlisäveroa (alv 0 %). Arvonlisävero lisätään lain mukaan. Toiseen EU-maahan myytäessä sovelletaan käännettyä verovelvollisuutta, jos sen edellytykset täyttyvät.
2. Hintana on voimassa oleva hinnasto (`dws10.com/config/products.json`, versio 1.33, 25.09.2026) tilausvahvistuksen päivänä. Tilausvahvistukseen kirjattu hinta on sopimushinta.
3. Maksuehto: [30 päivää netto] laskun päiväyksestä. Viivästyskorko korkolain mukaan.
4. Laitteiden hinta kattaa laitteen. Asennus, tuki ja mallien asennus ovat erillisiä, ellei tilausvahvistuksessa toisin sovita.
5. Tilausvahvistus kirjaa erikseen kertamaksut, kuukausi- ja vuosimaksut sekä maksuerien ajankohdat. [Aegis-pilotin maksuerät: HIC päättää, esim. 50 % tilauksesta ja 50 % Vaiheen 3 hyväksynnästä.]

## 4. Toimitus ja käyttöönotto

1. Toimitusaika ja käyttöönottoaikataulu kirjataan tilausvahvistukseen.
2. Laitteen omistusoikeus siirtyy ostajalle, kun koko kauppahinta on maksettu. Vahingonvaara siirtyy toimituksessa.
3. Ostaja antaa myyjälle toimitukseen tarvittavat tiedot, pääsyt ja nimetyt yhteyshenkilöt. Viivästys tässä siirtää toimitusaikaa vastaavasti.

## 5. Hyväksyntä

1. Aegis-pilotin hyväksyntä tapahtuu Liitteen 3 (Katkaistun verkkoyhteyden hyväksymisprotokolla ja Vaihe 0 -rajaus) mukaan. Hyväksyntä on kyllä/ei-kriteeri, jonka kolme ehtoa arvioidaan tietueesta, ei ajossa olevan ohjelmiston omasta ilmoituksesta.
2. Muiden tuotteiden ja palveluiden hyväksyntä: ostaja tarkastaa toimituksen [10 arkipäivän] kuluessa ja ilmoittaa kirjallisesti virheistä. Ilmoittamatta jäänyt toimitus katsotaan hyväksytyksi.

## 6. Aegis-pilotin erityisehdot

1. Pilotti (`DWS-AEGIS-PILOT-001`) on kiinteähintainen, kolmen kuukauden mittainen ja rajattu yhteen toimipisteeseen ja yhteen työnkulkuun.
2. Kielteinen tulos on pilotin kelvollinen lopputulos, ei virhe. Silloin ostaja saa raportin, mittaukset ja tietueen eikä mitään muuta ole maksettavaa.
3. Pilotin agentit tuottavat suosituksia, päätöksiä ja tietueita. Ne eivät ohjaa fyysisiä laitteita: mikään komento ei mene ohjelmoitavaan logiikkaan (PLC), SCADA-järjestelmään tai kenttäväylään, eikä toimipisteen omiin turvatoimintoihin kosketa.
4. Pilotin hinta hyvitetään kokonaan Aegis-hankinnan hinnasta, jos ostaja jatkaa 6 kuukauden kuluessa pilotin raportin luovutuksesta. Hyvitys on enintään 19 990 €. Se koskee vain Aegis-hankintaa. Hyvityksen ulkopuolella ovat LWM-integraatio, laitteistohankinnat, usean toimipisteen käyttöönotto, muut toimialat, räätälöidyt ERP-, BIM- ja SCADA-integraatiot sekä erillinen Aegis Implementation Programme.
5. Kahden ensimmäisen viikon rajaus- ja lähtötasovaihe (Vaihe 0) on maksuton. Se päättyy allekirjoitettuun yhden sivun rajaukseen (Liite 3, osa B). Jos työnkulkua ei voi kuvata päättyvänä jaksona, jolla on määritelty valmis-tila, Vaihe 0 päättyy tulokseen "ei testattavissa" ja ostajalta ei peritä mitään.

## 7. Ostajan velvollisuudet

Ostaja nimeää työnkulun omistajan, teknisen yhteyshenkilön, pysäytysoikeuden haltijan (operaattori) ja todistajan, toimittaa sovitut pääsyt ja pitää verkon eristyksen ostajan omassa hallinnassa. Eristystä ylläpitää ostajan järjestelmänvalvoja pilotoitavan järjestelmän yläpuolelta.

## 8. Immateriaalioikeudet

Myyjä säilyttää oikeudet ohjelmistoihin, malleihin, työkaluihin ja menetelmiin. Ostaja saa toimituksen mukaisen käyttöoikeuden omaan sisäiseen käyttöönsä. Ostajan aineisto ja ostajan tuotannon tiedot kuuluvat ostajalle. Kolmannen osapuolen ohjelmistoihin ja malleihin (esim. NVIDIA) sovelletaan niiden omia lisenssiehtoja, jotka myyjä ilmoittaa tilausvahvistuksessa. [NVIDIA AI Enterprise -tilaus ei sisälly hintoihin, ellei toisin mainita.]

## 9. Tietosuoja ja tietueen sisältö

1. Jos myyjä käsittelee toimituksessa ostajan henkilötietoja, osapuolet tekevät erillisen henkilötietojen käsittelysopimuksen (EU 2016/679). [LIITE: DPA — `docs/DPA_DATA_PROCESSING_AGREEMENT.md`.]
2. Aegis-tietue on pseudonyymi: se sisältää tunnisteita, ei nimiä, ja tulosten ja syötteiden tiivisteitä, ei raakaa prosessidataa. Yhteyden tunnisteesta henkilöön pitää ostaja.

## 10. Luottamuksellisuus

Kumpikin osapuoli pitää toisen luottamukselliset tiedot salassa ja käyttää niitä vain sopimuksen täyttämiseen. Velvollisuus jatkuu [3] vuotta sopimuksen päättymisen jälkeen. Se ei koske tietoa, joka on julkista, jonka vastaanottaja on saanut riippumattomasti tai jonka luovuttamiseen laki velvoittaa.

## 11. Vientivalvonta

Osa tuotteista (erityisesti Aegis Defence ja Sovereign) voi kuulua kaksikäyttötuotteiden vientivalvonnan piiriin. Ostaja ei vie, luovuta tai käytä tuotteita vastoin sovellettavaa lainsäädäntöä. Ks. `docs/legal/DUAL_USE_EXPORT_NOTICE.md`. [Lakimies tarkistaa sanamuodon.]

## 12. Vastuu

1. Osapuolen vastuu on rajattu välittömiin vahinkoihin. Välillisistä vahingoista, kuten tulon menetyksestä, ei vastata.
2. Myyjän kokonaisvastuu on enintään [tilauksen kokonaishinta / 12 kuukauden maksut — HIC päättää].
3. Rajaukset eivät koske tahallisuutta, törkeää huolimattomuutta tai vastuuta, jota ei laissa voi rajoittaa.
4. Myyjä ei vastaa väitteistä, jotka koskevat sertifiointeja. Aegis tähtää suuntaa-antavasti lähimpään SEAL-3-tasoon (Digital Resilience). Se ei ole komission sertifikaatti, eikä Lifetime Oy ole Cloud III -hankkeessa.

## 13. Voimassaolo ja päättäminen

Sopimus on voimassa, kunnes tilaukset on toimitettu ja maksettu. Kuukausi- ja vuosimaksulliset palvelut jatkuvat [toistaiseksi, irtisanomisaika 3 kuukautta]. Kumpikin osapuoli voi purkaa sopimuksen, jos toinen rikkoo sitä olennaisesti eikä korjaa rikkomusta 30 päivässä kirjallisesta huomautuksesta.

## 14. Sovellettava laki ja riidat

Sopimukseen sovelletaan Suomen lakia lukuun ottamatta sen lainvalintasääntöjä. Riidat ratkaistaan [Helsingin käräjäoikeudessa — HIC vahvistaa].

## 15. Liitteet ja allekirjoitus

- Liite 1 — Tuotekuvaukset
- Liite 2 — Tilausvahvistus
- Liite 3 — Aegis-pilotin hyväksymisprotokolla ja Vaihe 0 -rajaus (`docs/sales/AEGIS_PILOT_ACCEPTANCE_ANNEX.md`)
- [Liite 4 — Henkilötietojen käsittelysopimus]

| Osapuoli    | Nimi, asema                      | Päivämäärä ja allekirjoitus |
| ----------- | -------------------------------- | --------------------------- |
| Ostaja      | Erkki J Anttila, [rooli]         |                             |
| Lifetime Oy | Risto Anton Päärni, Founder, CEO |                             |

---

# Liite 1 — Tuotekuvaukset

Hinnat ovat ilman alv:tä ja perustuvat hinnastoon (versio 1.33, 25.09.2026). Sisäiset ja pilottitilassa olevat tuotteet (65 kpl, väri BLUE) eivät kuulu tähän liitteeseen. Niitä ei myydä ilman Lifetime Oy:n sisäistä hyväksyntää.

## A. DWS IQ Aegis -perhe (ennakkotilaus, ei vielä tuotannossa)

**DWS IQ Aegis** (`DWS-AEGIS-001`) on ajoympäristö, jossa tekoälyagenttiympäristö (laite ja alusta) tekee työtä asiakkaan omassa tuotannossa, esimerkiksi datakeskuksessa tai tehtaalla. Sen päälle rakennettu hallinta varmistaa, että ihminen säilyttää päätösvallan ja että jokaisesta vaiheesta jää jälki. Hinta 59 990 € kertamaksu (lisenssi ja integraatio). Ylläpitotilaus 999 €/kk (Standard), 1 999 €/kk (Defence) tai 4 999 €/kk (Sovereign). Aegis on ennakkotilauksessa: se ei ole vielä tuotannossa.

**DWS IQ Aegis Pilot** (`DWS-AEGIS-PILOT-001`) on kolmen kuukauden pilotti, 19 990 € kiinteä hinta. Yksi työnkulku ajetaan agentilla asiakkaan tuotannossa ja testataan kolme asiaa: työ jatkuu, vaikka verkko katkeaa; loki kirjoittuu katkeamatta; operaattori pystyy pysäyttämään käynnissä olevan agentin niin, että pysäytys voidaan jälkikäteen todistaa lokista eikä agentin omasta raportista. Kaikkien kolmen pitää täyttyä, tai pilotti raportoi perustellun kielteisen tuloksen. Hinta hyvitetään täysimääräisenä Aegis-hankinnasta, jos asiakas jatkaa 6 kuukauden kuluessa (ks. sopimuksen kohta 6).

**Kenelle:** pilotin ostaja on henkilö, jolla on päätösvalta pilotoitavaan työnkulkuun (esimerkiksi tehtaanjohtaja tai käyttöjohtaja), ei IT-osasto.

**Aegisin ympärille rakentuva kokonaisuus** (kuvaus, ei toimitussitoumus): päätöshistoria, joka säilyttää myös hylätyt ja keskeytyneet polut, sekä reititys ongelmasta seuraavaan oikeaan päätökseen tuotteen sijaan.

**DWS IQ Aegis Implementation Programme** (`DWS-AEGIS-IMPL-001`), 45 000 €. Kolme vaihetta: operatiivinen auditointi (2 viikkoa, 5 000 €), yksi agentti tuotantoon EU-vaatimusten mukaisesti (6 viikkoa, 15 000 €) ja maailmanmallin (LWM) integraatio, jotta toiminnan tieto kertyy (8 viikkoa, 25 000 €). Lisätään lisenssiin, ei hyvitetä siitä.

**DWS IQ Aegis — Maintenance Subscription** (`DWS-AEGIS-SUB-001`), 999 €/kk. Yksi tilaus per lisensoitu käyttöönotto. Taso seuraa lisensoitua Aegis-tasoa.

## B. DWS IQ -alusta

| Tuote                         | SKU                | Lyhyt kuvaus                                                                                                                                                                        | Hinta                         |
| ----------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| DWS IQ — EU Sovereign Starter | `DWS-EU-STARTER`   | DWS IQ EU-suvereenilla infrastruktuurilla: vaatimustenmukaisuus-, raportointi- ja etsintäagentit sekä CSRD-näkymä. EU-datasijainti alusta asti.                                     | 499 €/kk + 1 490 € perustus   |
| DWS IQ — EU Sovereign Pilot   | `DWS-EU-PILOT`     | Täysi arviointi EU-suvereenilla alustalla: koko Firehorse-agenttisarja, raportit, EU AI Act 12 artiklan lokitus, NIS2-näkymä, 5 käyttäjää.                                          | 1 499 €/kk + 3 990 € perustus |
| DWS IQ — US Cloud Starter     | `DWS-US-STARTER`   | Sama Starter Yhdysvaltain pilvessä (US-toimivalta). Yksi käyttäjä.                                                                                                                  | 299 €/kk                      |
| DWS IQ — US Cloud Pilot       | `DWS-US-PILOT`     | Neljän viikon arviointi omalla datalla Yhdysvaltain pilvessä. 5 käyttäjää.                                                                                                          | 799 €/kk                      |
| DWS IQ Platform (versio 6)    | `DWS-IQ-006`       | Orkestrointialusta, joka tuottaa allekirjoitetun tuotoksen (tarjous, lähetys, lasku, avustus), jonka vastapuoli hyväksyy. Agenttien työ jäljitetään KYA- ja Article 12 -tietueella. | 4 999 € kertamaksu            |
| DWS IQ Free                   | `DWS-IQ-FREE-2026` | Ensimmäinen CSRD-projekti ilmaiseksi: yksi projekti, enintään 50 ESG-riviä, yksi käyttäjä, ei luottokorttia.                                                                        | 0 €                           |
| DWS IQ Essentials — Setup     | `DWS-IQ-ESS-SETUP` | Käyttöönotto: asennus, yhteys GitHubiin ja yhteen ajoympäristön liittymään sekä ensimmäinen inventaariokuva ja ensimmäinen todistetietue.                                           | 799 €                         |
| kya-jev (Early Access)        | `KYA-JEV-001`      | Nopeat tyypitetyt päätökset (valinta, pistemäärä, kyllä/ei ja varmuus) mihin tahansa DWS-agenttiin. Vaatii jo myönnetyn KYA-päätöksen ja kirjautuu Article 12 -lokiin.              | 99 €/kk                       |

## C. Vaatimustenmukaisuus ja raportointi

| Tuote                            | SKU                    | Lyhyt kuvaus                                                                                                           | Hinta                         |
| -------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| DWS IQ Climate Intelligence      | `DWS-CLIMATE-001`      | Muuttaa ETS-, CBAM- ja CSRD-velvoitteet toteutukseksi tehdaslattialla. Agentit tuottavat tulokset, ei pelkkiä näkymiä. | 2 999 €/kk + 4 990 € perustus |
| Climate Reporting Starter Bundle | `LIFETIME-BUNDLE-2026` | Perusalusta, raportointimoduuli ja työpaja ensimmäiselle CSRD-raportille. Käytössä 30 päivässä.                        | 6 500 €                       |
| Firehorse Amplify                | `FH-AUTO-001`          | Tapahtumaohjatut työnkulut Fit for 55-, CSRD- ja EPBD-tiedon keruuseen suoraan järjestelmistä, täydellinen jäljitys.   | 4 950 €                       |
| DWS IQ Report                    | `FH-RPT-001`           | Automaattinen raporttipohja Fit for 55 -näkymineen ja SAP-liittymällä. Sisältää 4 viikon validoinnin.                  | 1 999 €                       |
| Firehorse Signed Reports         | `FH-SIGN-001`          | DocuSign-sähköinen allekirjoitus raportteihin, allekirjoitusjärjestys laatija, tarkastaja, auditoija.                  | 199 €/v                       |
| Firehorse Content Management     | `FH-CMS-001`           | Todistehallinta: merkitsee asiakirjat, varoittaa sertifikaattien vanhenemisesta, semanttinen haku.                     | 2 999 €                       |
| Firehorse Omnichannel Next       | `FH-OMNI-001`          | Markkinointi, jossa väitteet tarkistetaan EU AI Act- ja Green Claims -vaatimuksia vasten. Sisältää 4 viikon pilotin.   | 499 €                         |
| Sovereign Database               | `DWS-SOVEREIGN-DB-001` | EU-omisteinen ja EU-sijainen PostgreSQL, jatkuva suvereniteettiseuranta ja pisteytys. Arviointi ilmainen.              | 499 €/kk (Standard)           |

## D. Laitteet ja reunaympäristö

Kaikki laitehinnat ovat laitteen hinta. Mallien asennus 995 € (`LF-NVIDIA-INSTALL`), erikoistuki 100 €/h. Suomalainen ja EU-yritysasiakas, alv 0 % käännetty verovelvollisuus.

| Tuote                                     | SKU                                                                           | Lyhyt kuvaus                                                                                                                                             | Hinta                                   |
| ----------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Control Room — Acer Veriton GN100         | `edge-node-gn100`                                                             | Asiakkaan hallitsema suvereeni tekoälylaite omassa rakennuksessa, valmis DWS IQ Control Room -käyttöön.                                                  | 8 008 €                                 |
| Situation Room — kaksi solmua             | `LF-SITROOM-001`                                                              | Kaksi yhdistettyä solmua rinnakkaiseen päättelyyn ja varmennukseen.                                                                                      | 11 598 €                                |
| DGX Spark                                 | `LF-DGX-SPARK`                                                                | NVIDIAn GB10 Grace Blackwell -työasema, sama piiluokka kuin GN100.                                                                                       | 6 109 €                                 |
| IGX Orin                                  | `LF-IGX-ORIN`                                                                 | Teollisuus-, lääke- ja ydinympäristöihin: ECC-muisti, NVIDIA-tuki vuoteen 2033.                                                                          | 11 990 €                                |
| Jetson Sensor Node / Mid / Concentrator   | `LF-JETSON-NANO`, `-NX`, `-AGX`                                               | Anturisolmut kameroille, äänelle ja IoT:lle. Sisältää asennuksen ja palvelun.                                                                            | 764 € / 1 990 € / 2 694 €               |
| iPCMax IPC-409 / IPC-P68, Cincoze DA-1200 | `LF-IPCMAX-…`                                                                 | Teollisuusyhdyskäytävät: protokollamuunnos, PoE-kamerat, karkea ympäristö.                                                                               | 345 € / 680 € / 1 850 €                 |
| NVIDIA Model Installation + Full Service  | `LF-NVIDIA-INSTALL`                                                           | NVIDIA-mallipinon asennus omalle laitteelle sekä operaattorikoulutus, tuki, takuuhuolto ja etäkonfigurointi.                                             | 995 € / laite                           |
| DWS IQ Compliance Ambulance               | `LF-COMPLIANCE-AMBULANCE-001`                                                 | Liikkuva Control Room ajoneuvoalustalla (NVIDIA Thor). [Hinta pyynnöstä — hinnastossa vain paikkamerkki 1 €.]                                            | [VAHVISTETTAVA]                         |
| Kubernetes-orkestrointi T1–T4             | `LF-K8S-T1…T4`                                                                | k3s yhdellä solmulla (T1), HA-klusteri (T2), viranomaiskelpoinen RKE2 (T3), koko NVIDIA AI Enterprise -pino (T4). NVIDIA AI Enterprise -tilaus erikseen. | 1 500 / 4 500 / 7 500 / 12 000 €        |
| NIM-mallipaketit                          | `LF-NIM-…`                                                                    | Valmiit päättelypalvelut: yleinen, haku ja upotus, koodi, biologia.                                                                                      | 500 / 500 / 500 / 2 000 €/kk            |
| DOCA-mikropalvelut                        | `LF-DOCA-…`                                                                   | BlueField-DPU:n palvelut: telemetria, tietoturva ja vaatimustenmukaisuus, verkko ja tallennus.                                                           | 500 / 1 000 / 2 000 €/kk                |
| Government Ready                          | `LF-GOV-READY-SETUP`, `-ANNUAL`, `LF-GOV-AIRGAP-BUNDLE`, `LF-FIPS-VALIDATION` | Viranomaiskelpoisen klusterin asennus ja vuosihuolto, offline-kuvapaketti ja FIPS 140-3 -varmennus.                                                      | 7 500 € / 3 000 €/v / 1 500 € / 2 000 € |

## E. Asiantuntijapalvelut ja koulutus

| Tuote                                           | SKU                                            | Lyhyt kuvaus                                                                                                               | Hinta         |
| ----------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Outcome-Priced Applied-AI Pilot                 | `AIS-OUTCOME-PILOT`                            | Kuuden viikon kiinteähintainen pilotti yhdelle tulokselle. Hinta palautetaan, jos sovittu mittari ei liiku.                | 9 990 €       |
| EU-Sovereign AI Migration                       | `AIS-EU-SOV-OC`                                | Yksi tuotannon tekoälykuorma pois USA-hallinnoidusta mallipinosta EU-suvereeniin ympäristöön, kiinteä hinta per kuorma.    | 4 990 €       |
| EU-Sovereign AI Engineering & Cloud Consultancy | `aws-consultancy`                              | 25 tuntia senior-arkkitehdin työtä (Claude, Mistral, Llama Scalewayssa, OVH:ssa tai omalla DGX Sparkilla). Voimassa 12 kk. | 3 750 €       |
| Sovereignty Cloud Consulting                    | `sovereignty-cloud-consulting`                 | Siirto eurooppalaiseen pilveen, DPA, NIS2 ja EU AI Act -linjaus.                                                           | 1 500 €/kk    |
| EU AI Project Accelerator                       | `lean-project`                                 | Kiinteähintainen tekoälyprojekti EU-tiimille.                                                                              | 4 960 €       |
| EU-Hosted Conversational Agent                  | `conversational-agent`                         | Keskusteleva agentti Teamsiin, WhatsAppiin, Zoomiin tai webhookiin EU-isännöinnillä.                                       | 3 500 €       |
| AI Customer Agent                               | `firehorse-flow`                               | Asiakaspalvelun agentti, joka optimoi palvelukokemusta jatkuvasti.                                                         | 499 €         |
| Firehorse Omnichannel & Multimodal Assistant    | `omnichannel-multimodal`                       | Kanavien kampanjanhallinta päivittäisellä mittauksella.                                                                    | 699 €/kk      |
| Firehorse Data Services                         | `firehorse-data-services`                      | Rajapintapohjaiset datatuotteet, välitys ja rikastus.                                                                      | 899 €         |
| Agentic Software Development for EU Teams       | `ai-consulting-agentic`                        | Agenttipohjainen ohjelmistokehitys EU-suvereenissa ympäristössä.                                                           | 2 500 €       |
| AI & Agent Engineering                          | `ai-agent-engineering`                         | Senior-tekoälyinsinööri tuntiveloituksella (vara-arvo, tulospohjaiset tuotteet ovat ensisijaisia).                         | 200 €/h       |
| Captain Day                                     | `ai-consultant-day`                            | Yksi päivä, yksi tulos.                                                                                                    | 1 200 €       |
| Senior Compliance Specialist                    | `consulting-hourly`                            | Koulutus, työnkulkujen kehitys ja jatkuvuus.                                                                               | 250 €/h       |
| Consulting Fit for 55 Specialist                | `consulting-fit55`                             | Suora yhteys DWS IQ 6:n arkkitehtiin, kuukausittainen yhteistyö.                                                           | 3 000 €/kk    |
| Assessment (tehdas)                             | `devops-lead`                                  | Kahden viikon arvio siitä, onko tehdas valmis tekoälylle.                                                                  | 2 500 €       |
| Claude Code Coaching                            | `claude-code-coaching-…`, `business-mentor-30` | 1 pv luento 1 900 €, 2 pv työpaja 4 500 €, 3 pv kokonaisuus 5 900 €, projektityö 7 500 €, 30 h valmennus 4 960 €.          | 1 900–7 500 € |
| EU AI Act Literacy Training                     | `firehorse-coach`                              | Tekoälylukutaito (Article 4) johdolle ja henkilöstölle.                                                                    | 499 €         |
| AI Koulutus, 3 päivää                           | `ai-koulutus-3d`                               | Kolmen päivän talon sisäinen koulutus.                                                                                     | 6 250 €       |

## F. Pk-yrityskampanja

| Tuote                    | SKU                      | Lyhyt kuvaus                                                                            | Hinta |
| ------------------------ | ------------------------ | --------------------------------------------------------------------------------------- | ----- |
| Website Starter          | `LIFETIME-WEB-STARTER`   | Moderni yrityssivusto uudelle yrittäjälle, mobiiliystävällinen.                         | 650 € |
| Small Online Store       | `LIFETIME-WEBSTORE-MINI` | Pieni verkkokauppa hinnastolla.                                                         | 350 € |
| Kotisivut pk-yritykselle | `professional-web-pages` | Yrityssivu, livenä 12 tunnissa.                                                         | 750 € |
| IT-tukituntipankki 10 h  | `LIFETIME-IT-TUKI-10H`   | Suomenkielinen senior-asiantuntija, ei alihankintaa. Espoo ja pääkaupunkiseutu. 75 €/h. | 750 € |

## G. Erilliset dataproduktit

`LF-ONTOLOGY-25` ja `LWM-ONT-SOVEREIGN` ovat itsenäisiä dataproduktteja, joita voi ostaa ilman DWS IQ:ta. [Hinta ja kuvaus puuttuvat `products.json`-tiedostosta — VAHVISTETTAVA ennen kuin tuote lisätään tilaukseen.]

---

# Liite 2 — Tilausvahvistus (pohja)

| Rivi | SKU | Tuote | Määrä | Hinta (alv 0 %) | Maksuerä ja ajankohta | Toimitus |
| ---- | --- | ----- | ----- | --------------- | --------------------- | -------- |
| 1    |     |       |       |                 |                       |          |
| 2    |     |       |       |                 |                       |          |

Yhteensä (alv 0 %): **\_\_** € · Alv: **\_\_** € · Maksuehto: [30 pv netto]

---

# Liite 3

Katso `docs/sales/AEGIS_PILOT_ACCEPTANCE_ANNEX.md` (versio 1.0, HIC 30.09.2026). **Poista liitteestä sisäinen huomautus (kohta A8) ennen lähettämistä.**

---

# SISÄINEN MUISTIO — poista ennen lähettämistä

**Erkki J Anttilan kommentti 1 ja sen käsittely.** Kommentti pyysi selkeitä lyhyitä tuotekuvauksia ja kaikkien tuotteiden tarkistusta. Liite 1 kattaa 73 julkista tuotetta (`products.json` 138 tuotetta, joista 65 BLUE). Aegis-kuvaus on HIC:n oma sanamuoto, tiivistettynä.

**Oletukset (Rule 12).**

1. **Erkki J Anttilan rooli on tuntematon.** Repossa ei ole häntä koskevaa tietoa. Sopimus on kirjoitettu niin, että hän on ostajan yhteyshenkilö ja allekirjoittaja. Jos hän onkin sopimuksen tarkastaja eikä ostaja, korjaa kohta 1 ja allekirjoitusrivi.
2. **Nimi.** Kommentissa on "DWS IQ 7 Aegis". Hinnasto ja Store-tiedostot käyttävät nimeä "DWS IQ Aegis". Käytin hinnaston nimeä (Truth: hinnasto on ainoa lähde). Jos "DWS IQ 7" on tarkoituksella uusi nimi, hinnasto pitää päivittää ensin.
3. **Ristiriita: "onboarding" vs "lisenssi".** `Store/PRODUCT_AEGIS_PILOT.md` sanoo hyvityksen kohdistuvan 59 990 € "onboardingiin". `products.json` sanoo "licence + integration". Käytin muotoa "Aegis-hankinnan hinta" kunnes HIC valitsee.
4. **Sanamuoto "päätöshistoria, joka säilyttää hylätyt polut" ja "reititys ongelmasta oikeaan päätökseen"** on HIC:n kuvaus. En ole varmistanut sen toimitustilaa repossa, joten se on merkitty kuvaukseksi eikä toimitussitoumukseksi.
5. **Ontologiatuotteiden (G)** hinta puuttuu `products.json`-tiedostosta. Ei lisätty tilaukseen.
6. **Compliance Ambulancen hinta** on paikkamerkki 1 €. Ei ole tarjottavissa hinnalla ennen vahvistusta.
7. **Liite 3, kohta A8.2** riippuu yhä yhdistämättömästä PR #2256:sta. Älä lupaa sitä, ennen kuin se on korjattu.
8. **Lakimiehen tarkistus** vaaditaan ennen allekirjoitusta (vastuu, vientivalvonta, riidanratkaisu, omistuksenpidätys).

**Valmis sopimus ei ole "valmis" ennen `node scripts/agent-done-gate.mjs --full` -tulosta.** Tämä on luonnos, ei toimitus.

---

**Lifetime Oy** · Y-tunnus 0772407-9 · ALV FI07724079 · Laidunmaanraitti 2 A 25, 02330 Espoo
**Founder, CEO:** Risto Anton Päärni · risto.paarni@lifetime.fi · +358 400 319 010
