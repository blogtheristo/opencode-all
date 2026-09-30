---
slug: kya-s1-trust-level-in-industrial-process
lang: fi
title: "KYA-S1 ja BPMN 2.0: luottamuspiste ohjaa tekoälyagenttia teollisuusprosessissa"
hero: "Näet, miten luottamuspiste päättää, tekeekö työn agentti vai ihminen — ja miten virhe selvitetään ja päätös toistetaan jälkikäteen."
visual: infographic
visual_src: docs/blog-drafts/img/kya-s1-trust-level-in-industrial-process.svg
visual_alt: "Vuokaavio: luottamuspiste (TRS) valitsee kaistan, kertakäyttöinen valtuutusavain kulutetaan suoritushetkellä, vikatilanteessa pakkosuojaus ohjaa ihmiselle, ja lopuksi virheattribuutio (FLT) ja päätöksen toistaminen (PRV)."
seo_tags:
  [kya_trs, kya_lease_token, kya_fail_closed, kya_flt, kya_prv, bpmn_service_task, bpmn_user_task]
series: "KYA-S1"
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
merged_from:
  [
    bpmn-xml-trs-portti-riskiluokka-lease-fail-closed.md,
    kya-s1-ja-bpmn-2-luottamustaso-ohjaa-prosessia.md,
    flt-72h-virheluokittelu-ja-prv-paatoksen-toistaminen.md,
  ]
note: "Visual not yet made — the SVG is a to-do."
---

# KYA-S1 ja BPMN 2.0: luottamuspiste ohjaa tekoälyagenttia teollisuusprosessissa

## Puheista prosessikoodiksi

Sääntelyn ja arkkitehtuurikuvauksien jälkeen vastaan tulee aina sama tekninen kysymys: **miten tämä koodataan pystyyn?**

Miten yhdistetään BPMN 2.0 -prosessimoottori (kuten Camunda tai Zeebe), KYA-S1-turvallisuusspesifikaation elävä luottamuspiste (TRS) sekä DWS IQ -tausta-agentit siten, että tuloksena on EU AI Actin vaatima rehellinen ihmisen johtamisvalta (HIC, _Human-in-Command_)?

Vastaus piilee siinä, että prosessimoottori ei anna agentille kiinteää käyttöoikeutta, vaan jokainen työvaihe reititetään dynaamisesti luottamustason mukaan. Tämä kirjoitus käy ketjun läpi alusta loppuun: miten luottamuspiste valitsee kaistan, miten kertakäyttöinen valtuutusavain ja pakkosuojaus vikatilanteessa sulkevat raot, ja mitä tapahtuu, kun jokin kuitenkin menee pieleen.

## Luottamuspiste ratkaisee kaistan

Jotta tekninen toteutus on selkeä, vastuualueet jaetaan kolmeen komponenttiin. **BPMN 2.0 -moottori** on tuotantoprosessin kapellimestari: se hoitaa työnkulun reitityksen ja tilakoneen. **KYA-S1 TRS -palvelu** tekee reaaliaikaisen luottamus- ja riskipisteytyksen Lifetime World Model (LWM) -rajapinnan kautta. **DWS IQ Skilled Agent** on suorittava tausta-agentti, mikropalvelu tai autonominen suorittaja.

Kun DWS IQ -ympäristössä ajetaan liiketoiminta- tai tuotantoprosessia, BPMN 2.0 -moottori ja KYA-S1 TRS viestivät keskenään jokaisessa kriittisessä solmukohdassa.

**Ennakkoarviointi.** Ennen kuin BPMN-moottori siirtyy tehtävään, se laukaisee `Execution Listener` -kuuntelijan. Kuuntelija tekee REST- tai gRPC-pyynnön KYA-S1 Trust Enginelle: _"Onko DWS IQ Quality Agent X valtuutettu suorittamaan tehtävä 'Laadunvarmistus_Erä_402' juuri nyt?"_ Kuuntelija ei hae pelkkää pistettä, vaan pisteen ja valtuutusavaimen yhdessä, ennen porttia.

**Eksklusiivinen reititys.** BPMN-prosessi käyttää palautettua arvoa XOR-portin ehtolausekkeessa. Kaistoja on kaksi:

- **BPMN Service Task (automaattinen kaista):** prosessi jatkuu välittömästi automaattisena tehtävänä, ja DWS IQ Skilled Agent suorittaa transaktion millisekunnissa.
- **BPMN User Task (ihmisen kuittaus):** prosessi haarautuu välittömästi ihmiselle. Tehtävä ilmestyy operaattorin yhtenäiseen valvomonäkymään (_Single Pane of Glass_), ja prosessi pysähtyy turvallisesti odottamaan ihmisen kuittausta.

Käytännössä kuuntelija istuu portille johtavalla sequence flowlla ja saa tehtävän vaatimukset kenttinä: vaadittu luottamuspiste (`requiredTrs`), tehtävän riskiluokka (`taskRiskTier`) ja aikaraja (`timeoutMs`, 500 ms). Automaattikaistalle johtava ehto on kaksiosainen: luottamus on hyväksytty **ja** valtuutusavain on saatu. Kumpikaan yksin ei riitä.

Portin oletushaara (`default`) osoittaa ihmisen kaistalle. Jos automaattikaistan ehto ei täyty mistä tahansa syystä — matala piste, puuttuva valtuutusavain tai aikakatkaisu — mennään ihmiselle.

Perinteisessä automaatiossa agentille annetaan joko 0 % tai 100 % valtuutus. Jos jotain menee pieleen, ainoa keino on sammuttaa koko järjestelmä. Kytkemällä BPMN 2.0 -moottori ja KYA-S1 TRS toisiinsa saavutetaan **dynamiikka**. Kun kaikki muuttujat ovat vihreällä, DWS IQ -agentit pyörittävät teollisuusprosessia täydellä teholla. Jos agentin ympäristössä tapahtuu poikkeama tai valtuutus vanhenee, luottamuspisteet putoavat välittömästi. Järjestelmä ei kaadu, vaan _siirtää päätöksenteon pehmeästi ihmiselle_.

## Kiinteä raja ei riitä

Yksinkertaisin tapa havainnollistaa porttia on kiinteä raja, esimerkiksi `TRS >= 85`. Se on havainnollinen opetusesimerkki — tuotannossa se on tietoturvariski. KYA-S1-spesifikaatio (§6.2, TRS-2) edellyttää dokumentoitua kynnysarvoa, muttei sido tiettyyn lukuun; oikea arvo asetetaan toimialan ja teon seurausvakavuuden mukaan.

Siksi jokaisella BPMN-tehtävällä on oma vaatimustasonsa, **tehtäväkohtainen riskikynnys (TRS_req)**. Kynnys ei ole järjestelmän ominaisuus vaan **teon seurausvakavuuden** ominaisuus. Alla olevat luvut ovat ehdotuksia, eivät kanonia:

| Riskitaso                               | TRS_req | Valtuutusavaimen voimassaolo | Hyväksyntä alle kynnyksen  |
| --------------------------------------- | ------- | ---------------------------- | -------------------------- |
| Luku, haku, koonti                      | 60      | 30 s                         | Ei — jatka lokituksella    |
| Laatukirjaus, erän statuspäivitys       | 75      | 15 s                         | Yksi operaattori           |
| Finanssitransaktio, ERP-kirjaus, tilaus | 85      | 5 s                          | Operaattori + perustelu    |
| Laitteen ohjaus, linjan pysäytys, SCADA | 95      | 2 s                          | Kaksi henkilöä (four-eyes) |

### Rehellinen luottamuspiste on portin syöte

Portti on vain niin hyvä kuin sen syöte. Luottamuspiste TRS ∈ [0, 100] muodostuu painotetusta summasta, josta vähennetään poikkeamasakot: `TRS = max(0, (w₁·IDV + w₂·BHM + w₃·REG + w₄·TRS_hist) − Δ_decay − Δ_anomaly)`.

- **IDV** — todennettu ihmisjohtajan sidos: onko agentin taustahenkilön identiteetti ja käyttöoikeus voimassa ja tuore?
- **BHM** — ajonaikainen käyttäytymisen valvonta: onko agentin käyttäytymisessä havaittu poikkeamia perustasoon verrattuna, esimerkiksi viimeisen 10 minuutin aikana?
- **REG** — kyvykkyysmanifesti ja rekisteri: ovatko agentin rekisteröinti ja malliversio ajan tasalla?
- **TRS_hist** — agentin historiatietojen luotettavuus.

Ehdotetut oletuspainot ovat w₁ = 0,35, w₂ = 0,35, w₃ = 0,15 ja w₄ = 0,15, joiden summa on 1,0.

**Merkkisopimus on yksiselitteinen.** Δ_decay ja Δ_anomaly ovat määritelmän mukaan ei-negatiivisia sakkoja, ja kaava vähentää ne. Poikkeaman "vaikutus −40" tarkoittaa siis `Δ_anomaly = 40`. Sekaannus tässä on kallis: jos toteutus sijoittaa −40:n suoraan kaavaan, kaksoisnegaatio **nostaa** luottamuspistettä poikkeaman hetkellä — eli avaa portin juuri silloin kun sen pitäisi sulkeutua.

## Kertakäyttöinen valtuutusavain sulkee raon

Jos luottamustason tarkistuksen ja itse suorituksen välillä on edes muutaman millisekunnin rako ilman lukitusta, syntyy **race condition**. Agentti voi menettää valtuutuksensa juuri ennen suoritusta, ja prosessi ajaa sen silti läpi. Auditointijälki näyttää siltä, että portti toimi. Se ei toiminut. Ihmisen johtamisvalta on tällöin näennäistä.

Siksi Trust Engine ei palauta pelkkää numeroa, vaan **kertakäyttöisen valtuutusavaimen** (_Lease Token_): kryptografisesti allekirjoitetun ja aikaan sidotun avaimen, jonka voimassaolo on esimerkiksi 5 sekuntia. Automaattinen tehtävä voi toteutua vain, jos se **kuluttaa** kelvollisen avaimen suoritushetkellä. Tämä on ainoa kohta, joka sulkee race conditionin.

### Kaavio ei ole atominen — se on delegaatin vastuu

Tässä on kohta, jossa kaavio näyttää turvallisemmalta kuin ajonaikainen todellisuus, ja se on rehellisyyden vuoksi sanottava ääneen. BPMN-mallin `inputParameter` **ei kuluta avainta**. Se vain kopioi merkkijonon prosessimuuttujasta tehtävän skooppiin. Jos agentin delegaatti ottaa arvon vastaan ja aloittaa työn, race condition on edelleen auki — se on vain siirtynyt BPMN-tasolta delegaatin sisään, missä auditoija ei sitä näe.

Atomisuus on **delegaatin sopimus**, ei XML:n ominaisuus. Vaatimuksia on neljä:

1. Delegaatin **ensimmäinen** operaatio on `consumeAndExecute(leaseToken, action)` — yksi kutsu, joka Trust Enginen puolella validoi avaimen, merkitsee sen kulutetuksi ja valtuuttaa teon samassa transaktiossa (`SELECT … FOR UPDATE`- tai `compare-and-swap`-tasoinen lukitus).
2. Jos yhtä atomista operaatiota ei ole saatavilla, avaimen kulutuksen on oltava transaktion ensimmäinen **lukittu** vaihe, ja kaiken sivuvaikutuksellisen työn on tultava sen jälkeen samassa transaktiossa.
3. Epäonnistunut kulutus heittää virheen `KYA_LEASE_INVALID`, joka ohjaa tehtävän rajatapahtuman kautta ihmiselle. Ei uudelleenyritystä automaattina.
4. Delegaatti ei saa koskaan lukea avainta päättääkseen itse, onko se vielä voimassa. Voimassaolon ratkaisee yksin Trust Engine kulutushetkellä.

Ilman tätä sopimusta kaavio kuvaa aikomusta, ei takuuta. Kohtien 1–4 toteutus on se, mikä tekee portista aidon — XML vain tekee siitä tarkastettavan.

Esimerkki on kirjoitettu Camunda 7 -muodossa, koska sen `camunda:`-laajennukset ovat luettavimmat. Camunda 8:ssa vastineet ovat suoraviivaiset: `camunda:delegateExpression` vaihtuu muotoon `zeebe:taskDefinition`, `camunda:inputOutput` muotoon `zeebe:ioMapping` ja lomakekentät Camunda Forms JSONiksi. Rakenne — aikakatkaisu pakkosuojauksena, valtuutusavaimen rajatapahtuma, oletushaara ihmiselle ja PRV omana tehtävänään — siirtyy sellaisenaan.

## Pakkosuojaus vikatilanteessa

Jos KYA-S1 Trust Engine ei vastaa aikarajan puitteissa (yli 500 ms) tai palauttaa virheen, prosessi ei koskaan aja automaatiota. Se ohjautuu poikkeuksetta ihmisen kuittaukseen. Trust Enginen alasajo hidastaa tuotantoa; se ei avaa porttia.

Sama koskee jo myönnettyä avainta. Jos avain mitätöidään kesken suorituksen — hätäjarrun, valtuutuksen peruutuksen tai vanhenemisen takia — automaattinen tehtävä keskeytetään, tehdään rollback ja tehtävä siirtyy suoraan ihmiselle. Kun hätäjarru (TC4) laukeaa, Lifetime World Model mitätöi kaikki aktiiviset valtuutusavaimet välittömästi — koko agenttiketjusta kerralla.

Ihmisen kaistallakin on kaksi sääntöä. Kuittaus ilman perustelua ei ole valvontaa, joten perustelukenttä on pakollinen. Ja kuittaamaton tehtävä ei jää roikkumaan hiljaisuudessa: 15 minuutin ajastin eskaloi sen.

Järjestelmän rehellisyys testataan poikkeamissa, ei normaaliajossa:

| Poikkeamatilanne                            | Vaikutus luottamuspisteeseen | Seuraus BPMN-moottorissa                      |
| ------------------------------------------- | ---------------------------- | --------------------------------------------- |
| Normaaliajo, kaikki kunnossa                | 90–100                       | Valtuutusavain myönnetään → automaattinen     |
| Taustahenkilön oikeus muuttuu (IDV)         | → 0 välittömästi             | Avain mitätöidään → ihmisen kuittaus          |
| Tuntematon API-kutsu / koodipoikkeama (BHM) | Δ_anomaly = −40              | Piste alle TRS_req → ihmisen kuittaus         |
| Engine timeout / yhteys poikki              | ei arvoa                     | **Pakkosuojaus** → välittömästi ihmiselle     |
| Valtuutusavain vanhenee                     | Avain mitätöityy             | Automaattinen tehtävä hylkää → rollback & HIC |
| Hätäjarru (TC4)                             | Kaikki avaimet mitätöidään   | Koko agenttiketju pysähtyy välittömästi       |

Huomaa, mikä matriisissa **puuttuu**: ei yhtään riviä, jolla poikkeama johtaisi automaattisuoritukseen. Se on koko suunnittelun ydin. Automaatti vaatii aktiivisen todistuksen; ihmispolku ei vaadi mitään.

## Kun jotain menee pieleen: 72 tunnin kello

Vaikka tekninen arkkitehtuuri olisi kuinka tiivis, teollisuusympäristössä on hyväksyttävä yksi rehellinen tosiasia:

**Ennen pitkää jokin menee vikaan.**

Tekoäly mallintaa poikkeavan tilanteen väärin, taustajärjestelmän tietokantayhteys katkeaa kesken transaktion, kenttälaite syöttää korruptoitunutta dataa, tai ihminen antaa virheellisen syötteen.

KYA-S1-spesifikaatiossa kysymys ei ole siitä, tapahtuuko virhe. Kysymys kuuluu: **mitä tapahtuu 72 tuntia sen jälkeen, kun tapaus on suljettu?**

Sopimusmaailmassa suurin kustannus virheen sattuessa ei yleensä ole itse tekninen vika, vaan viikkoja tai kuukausia kestävä lakimiesten ja toimittajien "eipäs–juupas"-väittely siitä, kenen vastuulla vahinko oli.

KYA-S1:n **aikarajoitettu virheattribuutio (FLT)** poistaa tämän epävarmuuden. Poikkeaman jälkeen järjestelmä tuottaa allekirjoitetun vastuuluokittelun **72 tunnin sisällä tapauksen sulkemisesta** (FLT-2), viiteen kategoriaan:

| Virheluokka              | Kuvaus                                                                | Vastuun kohdistus                   |
| ------------------------ | --------------------------------------------------------------------- | ----------------------------------- |
| **1. Model Fault**       | Kielimallin hallusinaatio, stokastinen virhe tai odottamaton ulostulo | Mallitoimittaja / LLM Provider      |
| **2. Logic Fault**       | DWS IQ -agentin sovelluslogiikan tai prompt-rakenteen koodivirhe      | Agenttiohjelmiston toimittaja       |
| **3. Integration Fault** | API-yhteysvirhe, verkkoviive, timeout tai tietokantakatko             | Infra- / integraatiotoimittaja      |
| **4. Operator Fault**    | Ihmisoperaattorin antama virheellinen tai puutteellinen syöte         | Tilaaja / käyttäjäorganisaatio      |
| **5. Policy Fault**      | Säännöstön, rajoituksen tai valtuutuksen konfiguraatiovirhe           | Sääntöarkkitehti / turvallisuuselin |

Tämän luokittelun ansiosta vastuunjako lakkaa olemasta kuluttava lakitekninen väittely ja muuttuu täsmälliseksi hakukyselyksi.

## Päätöksen toistaminen: tekoälyn aikakone

Jotta virheattribuutio voidaan tehdä puolueettomasti, tarvitaan kovaa teknistä todisteaineistoa. Tässä kohtaa Lifetime World Model astuu peliin, ja siksi PRV-kirjaus — päätösten toistettavuus ja auditointijälki — on BPMN-mallissa oma automaattinen tehtävänsä eikä pelkkä kuuntelija yhdellä sequence flowilla.

Ero on olennainen. Kuuntelija yhdellä sequence flowilla kattaa vain sen yhden reitin, jolloin ihmisen kuittaus jää lokittamatta. Omaan tehtäväänsä yhdistyvät **molemmat** polut — agentin suoritus ja ihmisen kuittaus — ja se on myös näkyvissä kaaviossa; auditoija ei joudu etsimään kuuntelijaa XML:n sisältä. Ihmisen päätös on yhtä lailla auditoitava tapahtuma kuin agentin: ihmispäätöksen alkuperä ja kuittaus on nimenomaan Artikla 14:n todiste.

Aina kun DWS IQ -agentti suorittaa tehtävän tai se ohjautuu valvomonäkymään, World Modeliin tallennetaan kryptografisesti allekirjoitettu tilavedos:

1. **Alkuperäiset syötteet:** täsmälleen se data ja konteksti, joka agentille syötettiin.
2. **Luottamustila:** agentin luottamuspiste ja IDV-tila suoritushetkellä.
3. **Käytetty valtuutusavain:** todiste siitä, että suorituslupa oli voimassa ja atomisesti kulutettu.
4. **Mallin tila:** malliversio, lämpötilaparametri ja järjestelmäkehotteet.

PRV-tehtävä kirjaa myös, kumpaa kaistaa pitkin päätös tuli (automaattinen vai ihmisen kuittaus), luottamuspisteen päätöshetkellä ja käytetyn valtuutusavaimen. Vasta tämän jälkeen prosessi päättyy — ja päätöstapahtuman nimi kertoo, miksi: suoritus on päätöksessä, ja päätös on toistettavissa.

Tämä mahdollistaa **PRV-2:n (Decision replay)**. Vaikka varsinainen tekoälymalli päivittyisi tai vaihtuisi kahden vuoden kuluttua, alkuperäinen päätöksentekoketju voidaan rekonstruoida täsmälleen samoilla reunaehdoilla ja todentaa vuosienkin päästä.

Mitä agentti tiesi? Millä valtuudella se toimi? Miten se päätyi tulokseen? PRV antaa näihin vastauksen — myös silloin kun päättäjä oli ihminen.

## Dominoefektin katkaisu: ketjun keskeytys

Teollisuuden moniagenttiympäristöissä yksi DWS IQ -agentti voi käynnistää toisia agentteja. Laadunvalvonta-agentti käynnistää logistiikka-agentin, joka käynnistää tilausagentin. Jos ensimmäisen agentin päätöksessä havaitaan virhe, suurin vaara on **dominoefekti** — virheen monistuminen taustajärjestelmiin.

KYA-S1:n **ketjun keskeytys (TC4, _Trust Collapse Response & Chain Termination_)** katkaisee ketjun. Talon kansankielinen nimi sille on hätäjarru, _leash snap_ (TC4-2).

1. **TC4-1** — luottamusromahdus havaitaan määritellyllä kynnyksellä, ja siitä lähetetään allekirjoitettu tapahtuma.
2. **TC4-2** — ketju terminoidaan atomisesti: rikkova agentti, jokainen sen käynnistämä alempi agentti ja kaikki niiden aktiiviset työkalusessiot. Valtuutusavaimet mitätöityvät samalla, joten yksikään kesken oleva automaattinen tehtävä ei pääse kirjoittamaan tietokantaan.
3. **TC4-4** — koko agentin tila, työkaluhistoria ja päätösjälki säilötään terminointihetkellä forensista tutkintaa varten. Tästä virheattribuutio saa aineistonsa.
4. Prosessi siirtyy valvomonäkymään ihmisoperaattorin hallintaan.

Huomaa järjestys: **todisteet talteen ennen kuin ketju vapautetaan** — tallennus ennen resursseista luopumista. Jos TC4-4 jää tekemättä, virheattribuutio 72 tunnissa on mahdoton — jäljelle jää vain arvaus.

## Yhteenveto: rehellinen tekoälyhallinta teollisuudessa

Kokonaisuus tiivistyy ketjuun:

1. **Yksi allekirjoitettu sivu:** tylsä tietoturvakansio saa vihdoin oman sivunsa tekoälyagentille.
2. **Tekninen luottamus:** luottamuspiste ei ole mittari dashboardilla, vaan BPMN 2.0 -prosessin suora ehto- ja ohjausmekanismi.
3. **Ihminen johtaa oikeasti:** jokainen poikkeama, yhteyskatko tai valtuutusvirhe ohjaa tehtävän ihmiselle, ja ohjelmisto takaa, ettei valvonta ole näennäistä.
4. **Ei race conditionia:** kertakäyttöinen valtuutusavain takaa, ettei agentti voi suorittaa mitään ilman tuoretta ja validia luottamustasoa suoritushetkellä.
5. **Aukoton kriisinhallinta:** kun asiat menevät pieleen, virheattribuutio ja World Modelin historiatiedot pitävät vastuunjaon kirkkaana. Loki todentaa jälkikäteen, kuka teki, millä valtuuksilla ja miksi — myös silloin kun tekijä oli ihminen.

Tämä on se täsmällinen syy, miksi autoimme luomaan tämän spesifikaation: se tekee lakisääteisestä ihmisen johtamisvelvoitteesta toimintavarmaa ohjelmistoarkkitehtuuria.

Kun nämä palaset ovat paikoillaan, tekoälyagentit lakkaavat olemasta hallitsematon tietoturvariski — ja muuttuvat siksi, miksi ne on tarkoitettu: **teollisuuden luotettavaksi ja suorituskykyiseksi suoritusportaaksi.**

---

**Risto Anton Päärni**
_Perustaja & toimitusjohtaja, Lifetime Oy_
_Päätoimittaja, Lifetime Scope Journal_
