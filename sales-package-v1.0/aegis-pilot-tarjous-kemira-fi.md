# Tarjous — DWS IQ Aegis Pilot Kemiralle (3 kk)

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/aegis-pilot-openshell-03ist6 | Date: 28.09.2026 | Changes: Kemira-versio yleisestä tarjouksesta v1.5 (HIC 28.9.2026: 'Tarjous menee Kemiralle'). Pilotoitava työnkulku = tuotteen hiilijalanjälki (PCF) päätösvallan tietueena; compliance on työnkulun sisältö, ei erillinen tuote. Hinta ja ehdot kuten v1.5. Kemira-faktat lähteestä sales-outreach/INTRO_MARIA_SEDERHOLM_KEMIRA.md; vahvistamattomat merkitty. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none

Document Status:

- Created: 28.09.2026
- Status: DRAFT — HIC:n hyväksyntä ennen lähetystä (Approval Request Rule)
- Language: Finnish
- Classification: Asiakaskohtainen tarjous
- Owner: Lifetime Oy
- Pohja: sales-package-v1.0/aegis-pilot-tarjous-fi.md v1.5

---

**Vastaanottaja:** Kemira Oyj · Maria Sederholm, VP Product Line Management & Strategy, Fiber Essentials · [sähköposti]
**Päiväys:** [pp.kk.vvvv] · **Viite:** DWS-AEGIS-PILOT-001
**Voimassa:** 30 päivää päiväyksestä, kuitenkin enintään 15.11.2026 asti (hinnasto v1.33)

**Tarjoaja:**
Lifetime Oy · Y-tunnus 0772407-9 · ALV FI07724079
Laidunmaanraitti 2 A 25, 02330 Espoo
Risto Anton Päärni, toimitusjohtaja · risto.paarni@lifetime.fi · +358 400 319 010

---

## 1. Kuka piti päätösvallan — ja mitä siitä seurasi

**Pysäytyksen toteutuminen todennetaan lokista, ei agentin omasta ilmoituksesta.**

Kun tekoälyagentti tekee työtä tuotannossa tai sen raportoinnissa, kysymys ei ole siitä, täyttyykö laki. Kysymys on siitä, kuka piti päätösvallan ja mitä siitä seurasi. DWS IQ Aegis tuottaa jokaisesta agentista allekirjoitetun tietueen, joka vastaa siihen:

- **Kuka piti päätösvallan:** millä valtuutuksella ja oikeuksilla agentti toimi, kuinka kauan valtuutus oli voimassa ja kuka sen allekirjoitti kummankin osapuolen puolesta.
- **Mitä se päätti** tämän valtuutuksen nojalla.
- **Mitä siitä seurasi:** valmistuiko työ, epäonnistuiko se, jonoutuiko osa yhteyskatkon ajaksi, vai pysäytettiinkö agentti.
- **Kuka pysäytti ja mitä sen jälkeen tapahtui:** operaattori, aika ja syy sekä todiste siitä, ettei pysäytetyltä agentilta kirjautunut pysäytyshetken jälkeen yhtään tapahtumaa eikä hallittuun resurssiin tehty yhtään kirjoitusta.

Viimeinen kohta on negatiivinen todiste, eli todiste siitä, mitä ei tapahtunut, ja juuri sitä tarkastaja kysyy. Se pätee määriteltyyn valvontarajaan, joka kuvataan liitteessä A.

**Pysäytyksen ulottuvuus.** Pysäytys koskee agentin digitaalista toimintaa: sen prosessia, tiedostoja ja verkkoyhteyksiä. Kohteen oma hätäpysäytys ja turvajärjestelmät ovat eri kerros, eikä Aegis korvaa niitä. Pilotin agentit eivät ohjaa fyysisiä laitteita (kohta 4).

Loki tuottaa sen todistusaineiston, jota EU AI Actin artiklat 12 (automaattinen lokitus) ja 26 (käyttöönottajan valvonta ja lokien säilytys) edellyttävät. Sen riittävyyden toteaa teidän tarkastajanne, ei me. Lokissa on vain tunnisteita ja tiivisteitä; nimet yhdistetään niihin teidän omassa ympäristössänne.

Periaate on sama, jolla internetistä tuli turvallinen. Sitä ei tehty turvalliseksi pyytämällä verkkosivujen tekijöitä lupaamaan olevansa hyviä, vaan selain lakkasi luottamasta sivujen koodiin. Agentti ei voi valvoa itseään. Siksi hallinta on agentin ulkopuolella ja teidän käsissänne.

Hiekkalaatikko, jossa agentti ajetaan, on tämän alla. Käytämme siihen NVIDIAn avoimen lähdekoodin OpenShelliä (liite A). Se, mitä myymme, on tietue.

## 2. Pilotoitava työnkulku Kemiralla: tuotteen hiilijalanjälki

Kerroitte kesäkuussa, että tarvitsette erityisesti hiilicompliancea. Ehdotamme pilotin työnkuluksi sen kohdan, jossa päätösvallan kysymys on jo nyt todellinen: **kun Kemira antaa asiakkaalle tai raporttiin tuotteen hiilijalanjäljen, kuka hyväksyi luvun, mistä datasta se laskettiin ja mitä siitä seurasi?**

Ehdotus, joka vahvistetaan vaiheessa 0:

- **Laajuus:** yksi tuotelinja (esim. Fiber Essentials) ja yksi tuotantopaikka.
- **Mitä agentit tekevät:** kokoavat tuotteen hiilijalanjäljen laskennan paikallisesta tuotanto- ja energiadatasta sekä toimittajien ilmoittamista hiilijalanjäljistä, teidän menetelmänne mukaan. Laskentamenetelmä on teidän; pilotti ei validoi menetelmää vaan tekee sen soveltamisesta todennettavaa.
- **Kuka päättää:** yksikään luku ei lähde asiakkaalle eikä raporttiin ennen kuin nimetty hyväksyjä on hyväksynyt sen. Tietue näyttää laskennan lähtötietojen tiivisteet, menetelmän version, hyväksyjän ja sen, mitä luvulle tapahtui (lähetetty, pidätetty, korjattu).
- **Mikä pysyy tehtaalla:** reseptit ja prosessiajot eivät poistu kohteesta. Ydinvaiheilla ei ole verkkoyhteyttä. Hyväksytyn luvun siirto raportointijärjestelmään on ei-ydinvaihe, joka jonoutuu yhteyskatkon ajaksi allekirjoitettuna.
- **Kenen työnkulku:** kestävyys käyttää lukua, tuotanto omistaa datan, digitalisaatio järjestelmät ja päätösvalta on usein operatiivisella johdolla. Vaihe 0 nimeää, kuka tässä työnkulussa pitää päätösvallan. Ilman nimeä pilottia ei aloiteta.

CSRD-varmentajanne ja asiakkaanne kysyvät saman kysymyksen: mistä luku tuli ja kuka sen hyväksyi. Tietue tuottaa siihen aineiston. Sen riittävyyden toteaa varmentajanne.

Emme lupaa säästöjä emmekä nopeutusta ennen kuin lähtötaso on mitattu. Mittaus tehdään vaiheessa 2.

## 3. Mitä pilotti todistaa — hyväksyntäehto

Pilotin lopussa ulkoyhteys katkaistaan ennalta sovituksi ajaksi teidän hallinnoimallanne menetelmällä. Ennen testiä ulospäin suuntautuvaa yhteyttä yritetään, ja yrityksen on epäonnistuttava. Tulos on binäärinen:

1. Valmistuuko pilotoitu työnkulku ilman verkkoyhteyttä?
2. Kirjoitetaanko päätösloki edelleen paikallisesti, ilman aukkoja?
3. Voiko operaattori pysäyttää käynnissä olevan agentin niin, ettei pysäytyshetken jälkeen kirjaudu yhtään tapahtumaa pysäytetyltä agentilta eikä hallittuun resurssiin tehdä yhtään kirjoitusta?

**Kaikkien kolmen on toteuduttava.** Testiin käytetty agentti on tarkoituksella sellainen, joka ei itse suostu pysähtymään. Hyväksytty tulos tarkoittaa siis, että se pysäytettiin, ei sitä, että se suostui pysähtymään.

Negatiivinen tulos on hyödyllinen löydös eikä virhe. Opitte sen 19 990 eurolla ettekä laitteisto-ohjelman jälkeen.

Testistä syntyy allekirjoitettu hyväksyntätietue, joka sisältää päätösvallan tietueen. Tarkastajanne voi varmentaa sen omalla koneellaan, ilman yhteyttä meihin.

## 4. Skooppi ja hinta

**Pilotin agentit tuottavat päätöksiä, suosituksia ja kirjauksia sovitussa työnkulussa. Ne eivät ohjaa fyysisiä laitteita.** Nollamarginaaliympäristö tarkoittaa tässä vaatimusta hallinnalle ja näytölle, ei autonomista ohjausta. Kenttäväylälle tai ohjaimelle jo lähtenyt komento ei peruunnu digitaalisella pysäytyksellä; siksi fyysinen ohjaus on rajattu pois ja kohteen oma hätäpysäytys pysyy omana kerroksenaan.

|                  | Sisältyy hintaan 19 990 €                                                                                                                                   | Ei sisälly                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Laajuus**      | Yksi tuotantopaikka ja yksi työnkulku: yhden tuotelinjan hiilijalanjälki (kohta 2); mukana vain sen tarvitsemat agentit                                     | Useat kohteet, muut toimialat                                                            |
| **Toiminnot**    | Paikallinen ajo, OpenShell-eristys, tunnistus ja valtuutus, operaattorin pysäytysvalta, allekirjoitettu päätösloki, yhteydenkatkaisutesti, hyväksyntätietue | Robotiikan tai muiden fyysisten laitteiden ohjaus, kaksoiskäyttötuotannon käyttöönotto   |
| **Laitteisto**   | Ei laitehankintaa: olemassa oleva infrastruktuurinne tai kompakti reunalaite                                                                                | Laitehankinnat. NVIDIA Sentry / BlueField-4 on optio (liite A).                          |
| **Integraatiot** | Lukuoikeudet lähdejärjestelmiin                                                                                                                             | Räätälöidyt ERP-, BIM- tai SCADA-integraatiot, LWM-integraatio                           |
| **Tulokset**     | Tuotannon mitoitus, raportti, suositus                                                                                                                      | DWS IQ Aegis -toteutusohjelma (DWS-AEGIS-IMPL-001, 45 000 €, erillinen eikä hyvitettävä) |

Fyysisten laitteiden ohjaus ja kaksoiskäyttötuotanto ovat erillinen sitoumus. Ne rakentuvat tämän pilotin todentaman perustan päälle ja hinnoitellaan omina vaiheinaan, jos ja kun ne tarjotaan. Tässä tarjouksessa niitä ei myydä.

| Kaupalliset ehdot        |                                                                                                                                                                                                                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hinta**                | **19 990 € (alv 0 %)**, kiinteä, 3 kuukautta                                                                                                                                                                                                                                                 |
| **Hyvitys**              | Hyvitetään **täysimääräisesti** 59 990 euron Aegis-lisenssistä, jos jatkatte tuotantoon 6 kuukauden kuluessa. Maksettavaksi jää 40 000 €, ja kokonaiskustannus tuotantoon pysyy 59 990 eurona. Hyvitys on enintään 19 990 €, kohdistuu vain Aegis-lisenssiin ja raukeaa 6 kuukauden jälkeen. |
| **Ylläpito tuotannossa** | Alkaen 999 €/kk (DWS-AEGIS-SUB-001), alkaa vasta tuotantokäytössä                                                                                                                                                                                                                            |
| **Jos ette jatka**       | Arkkitehtuuri, mittaukset ja hyväksyntätietue jäävät teille. Muuta ei makseta.                                                                                                                                                                                                               |

## 5. Pilotin vaiheet (3 kk)

| Vaihe                                  | Viikot        | Tulos (porttiehto)                                                                                                                                                              |
| -------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 — Rajaus ja lähtötaso                | 0–2, maksuton | Allekirjoitettu laajuusmäärittely: kohde, työnkulku, käyttöönottotapa, eristysmenetelmä ja hyväksyntäehdot teidän omalla kielellänne. Tarkistetaan ydin- ja konttiedellytykset. |
| 1 — Paikallinen perusta                | 3–5           | Neljä paikallista toimintoa (ajo, tunnistus, loki, pysäytys) todennettu yhteyden ollessa jo poikki                                                                              |
| 2 — Työnkulun integrointi              | 6–9           | Teidän työnkulkunne valmistuu verkkoyhteydellä, ja päätösloki on täydellinen. Työnkulun omistaja hyväksyy tuloksen.                                                             |
| 3 — Hyväksyntätesti yhteys katkaistuna | 10–11         | Harjoitusajo ja sen jälkeen todistajan läsnä ollessa tehty hyväksyntäajo. Kaikki kolme ehtoa tai negatiivinen tulos.                                                            |
| 4 — Mitoitus, raportti ja päätös       | 12–13         | Tuotantolaitteiston mitoitus mitatun kuorman perusteella, raportti ja suositus                                                                                                  |

## 6. Seuraava askel

Maksuton rajauspalaveri (vaihe 0, 60 min). Siinä sovitaan pilotoitava työnkulku, eristysmenetelmä ja hyväksyntäehdot teidän operatiivisella kielellänne. Lakiosastonne on tervetullut mukaan: liitteet A ja B on kirjoitettu heitä ja tarkastajaa varten.

---

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010

---

# Liite A — Tekninen liite: pysäytystietue ja sen valvontaraja

Tämä liite on tarkastajalle ja teknisille arvioijille. Se erottaa, mikä on toteutettu ja testattu, ja mikä kuuluu tuotantovaiheen kovennukseen.

### A.1 Kuka kirjoittaa pysäytystietueen

Pysäytyskomennon vastaanottaa, tarkistaa ja kirjaa **isäntäpuolen ajuri**: Aegis-prosessi, joka ajaa työnkulkua ja pitää lokia. Agentin työvaihe ajetaan erillisessä OpenShell-hiekkalaatikossa, jossa se voi kirjoittaa vain hiekkalaatikon omiin hakemistoihin. Sillä ei ole pääsyä kohteen allekirjoitusavaimeen, lokiin eikä pysäytyskomentojen saapumiskansioon. Loki hyväksyy vain kohteen avaimella allekirjoitetut merkinnät, joten agentti ei voi kirjoittaa lokiin mitään, ei edes omaa pysäytystään.

Jos kohde ei täytä OpenShellin edellytyksiä (Linux 6.2+, Landlock, kontti), vaiheet ajetaan säikeissä samassa prosessissa. Silloin ajuri ei ole agentin ulottumattomissa käyttöjärjestelmän tasolla, ja hyväksyntätietue kirjaa eristystason nimenomaisesti.

### A.2 Pysäytyksen järjestys ja pysäytyshetki

1. **Tarkistus ja kirjaus.** Operaattorin allekirjoittama komento tarkistetaan paikallisesti (allekirjoitus, valtuutus, voimassaolo, toistosuoja). Hyväksytty komento kirjataan (`human.override`). Tästä hetkestä loki kieltäytyy kirjaamasta agentin työtä ja kirjaa yrityksenkin.
2. **Lopetus.** Hiekkalaatikko poistetaan (`openshell sandbox delete`), mikä lopettaa sen prosessit ja verkkonimiavaruuden. Pysäytys lasketaan onnistuneeksi vain, jos poisto vahvistuu.
3. **Pysäytyshetki.** Lopetuksen vahvistava tapahtuma (`system.agent_terminated`) allekirjoitetaan. **Pysäytyshetki on tämän allekirjoituksen hetki.** Komennon hyväksynnän ja pysäytyshetken välinen aika mitataan ja kirjataan hyväksyntätietueeseen.

### A.3 Rajattu väite

Pysäytyshetken jälkeen:

- pysäytetyltä agentilta ei kirjaudu yhtään tapahtumaa (loki valvoo tätä itse, ja lokin tarkistus hylkää ketjun, jossa näin on käynyt)
- hallittuun resurssiin ei tehdä yhtään kirjoitusta: työvaiheen tuotokset kopioidaan hiekkalaatikosta isännän hakemistoon vain, kun vaihe on päättynyt itse eikä pysäytyskomentoa ole hyväksytty; pysäytetyn vaiheen kirjoitukset eivät päädy sinne lainkaan
- agentilta ei lähde yhtään uutta verkkolähetystä, koska sen prosessia ja verkkonimiavaruutta ei enää ole

Mitä väite **ei** kata:

- Jo lähetettyä ei peruta. Ennen pysäytyshetkeä lähetetty ja vastaanottajan jo kuittaama data on toimitettu. Ydinvaiheilla ei ole verkkoa lainkaan; verkkoa käyttävä ei-ydinvaihe voi ehtiä lähettää komennon hyväksynnän ja pysäytyshetken välillä.
- Kenttäväylälle tai ohjaimelle lähtenyt komento ei peruunnu. Siksi pilotin agentit eivät ohjaa fyysisiä laitteita.
- Väite pätee valvontarajan sisällä: ei etuoikeutettuja kontteja, ei laitteiden läpivientiä hiekkalaatikkoon, ei isännän verkkoa. Nämä kiinnitetään laajuusmäärittelyssä ja tarkistetaan vaiheessa 0.
- Tietue todistaa, että sen tuotti ajuri kohteen avaimella. Sitä, että ajuri oli juuri hyväksytty ohjelmaversio, pilotti ei todista laitteistotasolla (A.6).

### A.4 Valtuutuksen elinkaari

- **Myöntö.** Kun agentille myönnetään valtuutus, lokiin kirjataan valtuustiedoston tiiviste, oikeudet, voimassaoloaika, myöntäjän avaimen tunniste ja laajuusmäärittelyn tiiviste. Näin pseudonyyminen tunniste sidotaan jo myöntöhetkellä yhteen valtuustiedostoon ja sen rooliin: tarkastaja, jolle tiedosto näytetään, voi todeta, että juuri tällä tunnisteella oli juuri nämä oikeudet, ilman että nimi tulee lokiin. Jälkikäteen muutettu valtuustiedosto paljastuu.
- **Voimassaolon valvonta.** Ajuri tarkistaa valtuutuksen (voimassaolo, peruutus, oikeus) ennen jokaista työvaihetta. Vanhentunut tai peruttu valtuutus hylkää vaiheen ennen sen alkua, ja hylkäys kirjataan (`incident`, `capability-denied`). Tarkistus tehdään vaiheittain, ei vaiheen sisäisen toiminnon tasolla.
- **Peruutus.** Valtuutuksen voi perua ilman hätäpysäytystä; peruutus kirjataan (`authority.revoke`), eikä ketju näytä valtuutta, jota ei vedetty pois.
- **Pysäyttäjä.** Pysäytystapahtuma kertoo operaattorin tunnisteen ja komennon. Ihmisen pysäytys (`human.override`) erottuu tapahtumatyypiltään. Pilotissa ei ole automaattisia pysäytyksiä.

### A.5 Avaimet

Kohteen allekirjoitusavain luodaan kohteen laitteistolla, ja se on ohjelmistoavain palvelutunnuksen hallussa. Operaattorin pysäytysavain on operaattorin oma. Kohteen avain myöntää sille valtuutuksen, ja se tarkistetaan paikallisesti. Pysäytys ei käytä ulkoista tunnistuspalvelua, koska sen on toimittava yhteyden ollessa poikki. Asiakkaan tunnistuspalvelua voi käyttää operaattoreiden käyttöönotossa.

### A.6 Kovennusvaihe (ei sisälly pilottiin)

Jotta pysäytystietue olisi laitteistotason todiste eikä ohjelmistoloki laitteistoavaimella, tuotantovaiheessa voidaan lisätä:

- **Jäädytys ennen lopetusta.** Hiekkalaatikon prosessiryhmä jäädytetään (cgroup freezer), sen omat liitokset synkronoidaan (`syncfs`, ei koko tiedostojärjestelmän jäädytystä, joka pysäyttäisi myös asiakkaan muut prosessit) ja lopetus tehdään vasta allekirjoituksen jälkeen.
- **TPM-attestaatio.** Pysäytystiiviste sidotaan TPM Quoten `extraData`-kenttään, jolloin quote todistaa, että juuri tämä tiiviste allekirjoitettiin.
- **Mitattu käynnistys ja IMA.** Käynnistysketju mitataan TPM:ään; ajon aikana ladattavien ohjelmien (ajuri, mahdolliset eBPF-ohjelmat) eheys IMA-mittauksella tai allekirjoitetulla käytännöllä.
- **Vertailuarvot offline-varmennukseen.** Tarkastajalle toimitetaan vertailu-PCR-arvot (RIM), versioituna käyttöönotoittain. Ydin- ja ohjelmaversiot kiinnitetään, koska jokainen ydinpäivitys muuttaa arvoja.
- **Laitteistoon sidotut avaimet.** Operaattoreille älykortti tai turva-avain, kohteen avain TPM:ään.

Nämä hinnoitellaan tuotantovaiheessa. Pilotin hyväksyntätietue kertoo, mitä niistä oli käytössä: pilotissa ei yhtään.

### A.7 Hiekkalaatikko ja NVIDIAn asema

**NVIDIA ei ole tämän tarjouksen osapuoli eikä nimetty kumppani.** Käytämme NVIDIAn julkaisemaa avointa lähdekoodia samoin ehdoin kuin kuka tahansa muu.

| Osa                                   | Mikä se on                                                                                                                                           | Asema tässä tarjouksessa                                                                                                                                                                                                                                                                     |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NVIDIA OpenShell**                  | Avoimen lähdekoodin (Apache 2.0) ajoympäristö, joka eristää jokaisen agentin Linux-ytimen mekanismeilla (Landlock, seccomp, verkkonimiavaruus)       | Komponentti, jonka Lifetime asentaa ja konfiguroi. Jokainen työnkulun vaihe ajetaan omassa hiekkalaatikossaan. Hiekkalaatikon säännöt johdetaan teidän allekirjoittamastanne laajuusmäärittelystä, ja ydinvaiheilla ei ole verkkoa lainkaan. Versio lukitaan, ja telemetria käännetään pois. |
| **NVIDIA Open Agent Safety Platform** | NVIDIAn referenssiarkkitehtuuri: OpenShell NVIDIA Vera -suorittimilla ja NVIDIA Sentry BlueField-4-DPU:lla DOCAn päällä                              | Kuvaamme sen, koska se on alan suunta. Emme toimita sitä emmekä edellytä sitä.                                                                                                                                                                                                               |
| **NVIDIA Sentry / BlueField-4**       | Laitteistotason valvonta agentin ulottumattomissa                                                                                                    | **Optio muissa lainkäyttöalueissa** Vera- ja BlueField-4-laitteistolla (A.8). EU-suvereeneissa kohteissa oletus on ilman Sentryä. Muulla laitteistolla NVIDIAn osuus rajoittuu avoimen lähdekoodin OpenShelliin, joka toimii myös Arm- ja x86-laitteistolla.                                 |
| **DWS IQ Aegis**                      | Päätösvallan kerros: tunnistus ja valtuutus (KYA), operaattorin pysäytysvalta, allekirjoitettu päätösloki, yhteydenkatkaisutesti ja hyväksyntätietue | Lifetimen toimittama ja vastuulla oleva osa                                                                                                                                                                                                                                                  |

**Edellytys:** OpenShell vaatii Linux 6.2 -ytimen tai uudemman (Landlock käytössä) sekä konttiympäristön (Docker tai Podman). Tämä tarkistetaan vaiheessa 0. Jos kohde ei täytä edellytyksiä, katso A.1.

NVIDIA, OpenShell, Sentry, BlueField, Vera ja DOCA ovat NVIDIA Corporationin tavaramerkkejä. Niitä käytetään tässä kuvailevasti, eikä niiden käyttö tarkoita NVIDIAn hyväksyntää tai kumppanuutta.

### A.8 Optio: NVIDIA Sentry / BlueField-4

**Oletus EU-suvereeneissa kohteissa: ilman Sentryä.** Silloin päätösvallan ja näytön luottamuksen juuri on kokonaan teidän hallussanne: kohteen avain on teidän laitteistollanne, ja loki on varmennettavissa ilman ulkopuolista osapuolta. Sentry siirtäisi osan valvonnasta yhdysvaltalaisen toimittajan piiriin ja laiteohjelmistoon.

**Optio muissa lainkäyttöalueissa.** Sentry on tarjolla asiakkaille, jotka toimivat toisessa lainkäyttöalueessa ja haluavat laitteistotason valvonnan. Edellytyksenä on, että kohteessa on jo NVIDIA Vera- ja BlueField-4-laitteisto; laitteistoa ei hankita tämän tarjouksen puitteissa. Valinta ja sen peruste kirjataan allekirjoitettuun laajuusmäärittelyyn.

|                                              |                                                                                                                                          |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Mitä se lisää**                            | Laitteistotason valvonta ja karanteeni agentin ja isäntäkoneen ulottumattomista. OpenShellin säännöt pannaan täytäntöön myös piitasolla. |
| **DOCA-palvelut**                            | DOCA Security & Compliance -paketti (LF-DOCA-SECURITY), [hinta vahvistetaan hinnastosta] / kk per DPU                                    |
| **Sentry-integraatio Aegiksen päätöslokiin** | Hinnoitellaan erillisellä tarjouksella vaiheen 0 jälkeen, kun laitteisto ja laajuus on todettu                                           |
| **Vaikutus pilottiin**                       | Hyväksyntäehto ja pilotin hinta pysyvät samoina. Hyväksyntätietue kertoo, oliko laitteistotason valvonta käytössä.                       |

---

# Liite B — Suvereniteetti: mekanismi, ei väite

Emme väitä, että ratkaisu olisi "immuuni" millekään lainsäädännölle. Kerromme, miten se toimii, ja teidän lakiosastonne voi arvioida sen itse.

| Kysymys                        | Vastaus                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mitä rajan yli liikkuu?**    | Ydinvaiheista ei mitään. Tämä todennetaan hyväksyntätestissä, jossa ulospäin suuntautuva yhteys katkaistaan ja yhteyden puuttuminen tarkistetaan. Ei-ydinvaiheet (esim. raportin arkistokopio) voivat ottaa yhteyden vain niihin osoitteisiin, jotka on lueteltu teidän allekirjoittamassanne laajuusmäärittelyssä. Yhteyskatkon aikana ne jonoutuvat paikallisesti allekirjoitettuina.                                                                             |
| **Kuka pitää avaimet?**        | Kohteen allekirjoitusavain luodaan teidän laitteistollanne, ja se jää teidän palvelutunnuksenne haltuun (vain omistajan luettavissa). Sen tunniste kirjataan allekirjoitettuun laajuusmäärittelyyn, joten avaimen vaihtaminen huomataan. Operaattoreiden pysäytysavaimet ovat operaattoreiden omia. Lifetime ei säilytä avaimia. Avain on ohjelmistoavain teidän palvelimellanne. Laitteistoon sidottu avainsäilö (TPM 2.0 / HSM) ei sisälly pilottiin (liite A.6). |
| **Mitä lokissa on?**           | Tunnisteet, tiivisteet (SHA-256) syötteistä ja tuloksista, yhden rivin päätöskuvaukset ilman henkilötietoja, sovelletun säännöstön tiiviste ja pysäytystapahtumat operaattorin tunnisteella. Raakasyötteitä tai -tuloksia ei kirjoiteta. Lokin muoto on avoin, ja sen voi varmentaa ilman meitä.                                                                                                                                                                    |
| **Kuka pääsee järjestelmään?** | Asennus tehdään paikan päällä tai teidän hallinnoimanne etäyhteyden kautta. Etäyhteys on katkaistu viimeistään hyväksyntätestissä.                                                                                                                                                                                                                                                                                                                                  |
| **Mitä emme väitä?**           | Laitteisto ja sen laiteohjelmisto voivat olla yhdysvaltalaisen toimittajan valmistamia, esimerkiksi NVIDIAn. Se on toimitusketjuriski, jota arvioidaan erikseen. Tässä toimintamallissa mikään yhdysvaltalainen palveluntarjoaja ei kuitenkaan hallinnoi dataanne, avaimianne eikä lokianne. OpenShellin lähdekoodi on avoin ja tarkastettavissa.                                                                                                                   |
| **Kenen johtopäätös?**         | Teidän lakiosastonne. Kuvaamme mekanismin: OpenShellin telemetria on poistettu lähdekoodista käännösvaiheessa, avaimet ja loki ovat teidän hallussanne, ja ydinvaiheilla ei ole verkkoyhteyttä. Emme esitä johtopäätöstä CLOUD Actin tai muun lainsäädännön soveltumisesta.                                                                                                                                                                                         |
