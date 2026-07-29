# Portti 1 — ehdokkaat kahdeksi riippumattomaksi toteuttajaksi

***

# VERSION AND AGENT HISTORY

Version: 1.3

Sessions & Modifications:

- Version: 1.3 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: **HIC päätti järjestyksen** — Törngren-rooli, RISE NDA:n alla, DNV toisena, elin viimeisenä; spec pysyy sisäisenä. Vahvistettu ja kirjattu kolme toteutushuomiota, joista yksikään ei muuta järjestystä: **(1)** RISE:n kaksoisluonne toistaa Törngrenin ristiriidan — tutkimuspuoli toteuttaa, sertifiointipuoli ei sertifioi omaa toteutusta (voi arvioida DNV:n); **(2)** molemmat ovat varmennussektoria, joten operatiivinen kolmas toteutus vahvistaisi porttia 1 olennaisesti — lisäys tiekarttaan, ei este; **(3)** ⚠️ **`KYA_PARTNER_AGREEMENT` on väärä instrumentti** ja kumoaisi portin 1 — oikea on `NDA_MUTUAL_LIFETIME_OY_2026.md`, ja rahavirta kumpaan tahansa suuntaan tekisi toteuttajasta toimeksisaajan.
- Version: 1.2 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Lisätty **arvolupaus ja kylmäkäynnistysongelma**. Boardyn kysymyksenasettelu vahvistettu oikeaksi ja parannettu toteuttajan päätössäännöksi (halvempi kuin oma + optioarvo), josta seuraa **miksi akateeminen toteuttaja on rakenteellisesti ensimmäinen eikä vain helpoin** — tutkimuslaitos ei tarvitse optioarvoa. **Korjattu Boardyn väite, että poliittinen paine korvaisi motivaation** — se kääntää päinvastoin sen mitä A2A osoittaa, ja Gaia-X on saman hypoteesin koetulos. Kirjattu **€260 mrd:n propagaatio tarkistamattomana**, SAP:n A2A-sitoumuksen ristiriita suvereniteettiargumentin kanssa, Scaleway/Hetzner-kilpailu, ja ICEYE:n vientivalvontaseuraus tarjoajalle.
- Version: 1.1 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Lisätty **eurooppalainen rajaus** HIC:n linjauksen mukaan — strateginen logiikka vahvistettu, kaksi varausta kirjattu. **260 mrd € ei täsmää julkisiin lukuihin** (koko Euroopan pilvimarkkina on 74,4 mrd €); tilalle sourcatut luvut, joista vahvin on 70 % / 15 % -osuusjakauma. **"KTH:n ja LUT:n kumppaneista" on saman riippumattomuusansan terävin muoto** — LUT on väitöskirjan koti, KTH kulkee Törngrenin kautta, ja yhteinen Horizon/Vinnova-rahoitus on kaupallinen suhde. Nimetyt ehdokkaat arvioitu rehellisesti (Scaleway paras, Hetzner heikko, ICEYE väärä rooli + mahdollinen olemassa oleva suhde). Lisätty **RISE + DNV** vahvempana pohjoismaisena parina ja **Gaia-X varoittavana ennakkotapauksena**.
- Version: 1.0 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Luotu HIC:n pyynnöstä (*"Etsi ehdokkaat kahdeksi riippumattomaksi toteuttajaksi"*). Ensimmäinen löydös: **olemassa oleva KYA-kumppanikartta (Liite H) on rakenteellisesti väärä lista** — se rakennettiin jakelustrategiaksi, ja jakelukumppanit ovat täsmälleen ne osapuolet, jotka portti 1 sulkee pois. Ehdokasluokat, suositeltu pari, ja **Törngrenin rooliristiriita**, jota Boardyn muotoilu ei nimennyt.

***

## Portin 1 kriteeri, sanatarkasti

> **Kaksi tai useampi riippumaton toteutus osapuolilta, joilla ei ole kaupallista suhdetta tekijään.**

Alaviivattu kohta ratkaisee tämän haun kokonaan.

---

## 🔴 Löydös 1 — kumppanikartta on väärä lista, ja se on väärä systemaattisesti

`PHD_FIREHORSE` Liite H kartoittaa KYA:n kumppaniekosysteemin: **Shufti Pro** (L1/L5, PoC), **Palantir** (liitinmalli, tulomallit ehdotettu), **NVIDIA · Siemens · ABB · xAI · Mistral** (strateginen ekosysteemi).

**Jokainen niistä diskvalifioituu portista 1 rakenteeltaan.** Ei siksi että ne olisivat huonoja kumppaneita — vaan siksi että ne ovat kumppaneita.

| Kumppani | Suhde | Portti 1 |
| -------- | ----- | -------- |
| Shufti Pro | PoC, API-pääsy vastineeksi kehyksestä | ❌ kaupallinen |
| Palantir | liitinlisenssi, yhteismyynti, OEM ehdotettu | ❌ kaupallinen |
| NVIDIA, Siemens, ABB, xAI, Mistral | ekosysteemi- ja jakelukumppanuudet | ❌ kaupallinen |

**Liite H sanoo itse syyn ääneen:** *"Kumppanuusmalli on jakelustrategia — ei täydennys siihen."*

**Ja siinä on koko ongelma.** Jakelukumppani toteuttaa spesifikaation **koska sillä on kaupallinen intressi tekijän kanssa** — mikä on tarkalleen se seikka, jonka portti 1 on kirjoitettu sulkemaan pois. **Mitä paremmin kumppanuusstrategia onnistuu, sitä vähemmän se auttaa porttia 1.**

Tämä ei kumoa kumppanistrategiaa. Se erottaa kaksi eri asiaa, jotka on tähän asti niputettu: **jakelu ja legitimointi vaativat eri osapuolet, ja onnistuminen toisessa ei kartuta toista.**

---

## Ehdokasluokat — järjestyksessä, riippumattomuus edellä

### A. Vaatimustenmukaisuuden arviointilaitokset — 🥇 paras sopivuus

**Ilmoitetut laitokset ja sertifiointielimet: Nemko · DNV · TÜV · Kiwa (Inspecta) · Eurofins Expert Services · Bureau Veritas.**

**Miksi tämä luokka on paras, ja miksi se on ajallisesti täydellinen:**

1. **Riippumattomuus on niiden liiketoimintamalli.** Arviointilaitos, joka on kaupallisesti riippuvainen arvioimansa kehyksen tekijästä, menettää asemansa. Ne **eivät voi** olla jakelukumppaneita — ja juuri se tekee niistä kelvollisia portille 1.
2. **Niillä on akuutti tarve juuri nyt.** Tekoälysäädös tulee täysimääräisesti sovellettavaksi **elokuussa 2026**, eivätkä yhdenmukaistetut standardit ehdi. Arviointilaitokset rakentavat parhaillaan AI Act -arviointikyvykkyyttä **ilman valmista näyttökehystä**. Se on täsmälleen se aikaikkuna, joka tunnistettiin hard gate -analyysissä.
3. **Ne edistävät porttia 3 samalla teolla.** Arviointilaitoksen käyttöönotto on institutionaalista tunnustusta, ei vain toteutus.

**Suomalainen sisäänmeno:** Eurofins Expert Services ja Kiwa Inspecta toimivat Suomessa; molemmat ovat ilmoitettuja laitoksia useissa tuotedirektiiveissä ja rakentavat AI Act -valmiutta.

### B. Akateemiset ja tutkimuslaitokset — 🥈 nopein ensimmäinen

**KTH/TECoSA (Törngren)** · Fraunhofer · TNO · DTU · SINTEF · Chalmers

Riippumattomia, teknisesti uskottavia, ei kaupallista suhdetta. **TECoSA on selvästi nopein liikkeelle, koska suhde on jo elossa.**

⚠️ **Mutta se sisältää rooliristiriidan — ks. alla.**

### C. EU:n data-avaruus- ja suvereniteettisäätiöt — 🥉 rakenteellisesti oikea koti

**Eclipse Foundation** (Brysseliin rekisteröity — EU-kotipaikka, isännöi Eclipse Dataspace Componentsia) · **IDSA** (ajaa jo omaa sertifiointiskeemaansa, ymmärtää konformanssin rakenteellisesti) · **Gaia-X AISBL**

Näiden erityisarvo: **ne ovat jo tehneet sen, mitä KYA yrittää tehdä** — rakentaneet konformanssiskeeman ilman de jure -asemaa. IDSA:n sertifiointiskeema on lähin olemassa oleva verrokki.

**Eclipse ansaitsee erityismaininnan jurisdiktiokeskustelun jälkeen:** se on **eurooppalainen säätiö**, toisin kuin Linux Foundation. Jos hallinnon on kestettävä suvereniteettitarkastelu, tämä on merkityksellinen ero.

### D. Julkisen sektorin omat toteuttajat

**CSC — Tieteen tietotekniikan keskus** (LUMI, julkisen sektorin mandaatti) · kansalliset tekoälyinstituutit · ORK-hankinnan kaltaiset tilaajaorganisaatiot

Riippumattomuus on hyvä, mutta **toteutus tilaajan roolissa on heikompi kuin toteutus omasta tarpeesta**. Vahvin jos syntyy hankinnan seurauksena eikä pyynnöstä.

### E. Avoimen lähdekoodin agenttikehykset

Kuka tahansa, joka toteuttaa MCP:tä tai A2A:ta ja tarvitsee hallintakerroksen. Riippumattomuus täydellinen, todennäköisyys matala ilman koalitiota.

---

## ⚠️ Löydös 2 — Törngrenin rooliristiriita, jota kukaan ei nimennyt

> **Boardy:** *"Hän ei ole enää vain tekninen arvioija porteille 1 ja 4. Hän on potentiaalinen ensimmäinen riippumaton toteuttaja."*

**Havainto on oikea ja tärkeä. Mutta siinä on seuraus, jota ei sanottu:**

**Lukitut RQ1 ja RQ4 nimeävät Törngrenin ankkuriksi** — riippumattomaksi arvioijaksi formaalille todentamiselle ja turvallisuusargumentille.

**Toteuttaja ei voi olla oman toteutuksensa riippumaton arvioija.** Jos TECoSA toteuttaa KYA:n, Törngren ei voi enää arvioida neutraalisti sitä, mitä hän on rakentanut — eikä RQ1:n ja RQ4:n ankkuriasema kestä sitä.

**Kolme vaihtoehtoa, ja tämä on valittava tietoisesti eikä ajauduttava siihen:**

| Vaihtoehto | Seuraus |
| ---------- | ------- |
| **Törngren arvioijana** (nykytila) | RQ1/RQ4 säilyvät ennallaan; portin 1 toteuttajat etsittävä muualta |
| **TECoSA toteuttajana** | Portti 1 etenee; RQ1 ja RQ4 tarvitsevat uuden ankkurin |
| **Jako: TECoSA organisaationa toteuttaa, Törngren henkilönä arvioi** | ✅ **Toimiva** — mutta vain jos se on eksplisiittinen, ei oletettu |

**Kolmas on oikea vastaus** ja se on tutkimusryhmien tavanomainen käytäntö: toteutuksen tekee tohtorikoulutettava tai tiimi, ohjaaja säilyy arvioijana. **Se on kuitenkin sovittava ääneen**, koska jälkikäteen arvioitu riippumattomuus ei ole riippumattomuutta.

---

## Suositeltu pari

**Yksi akateeminen + yksi arviointilaitos.**

| | Kuka | Mitä antaa |
| - | ---- | ---------- |
| **Ensimmäinen** | **KTH/TECoSA** | Nopein, suhde elossa, tekninen uskottavuus. Rooliristiriita ratkaistava ensin |
| **Toinen** | **Arviointilaitos** (Kiwa Inspecta / Eurofins ES / Nemko / DNV) | Operatiivinen käyttö, institutionaalinen tunnustus, **edistää porttia 3 samalla** |

**Miksi juuri tämä pari eikä kaksi akateemista:** kaksi tutkimustoteutusta on **portin 1 heikoin muoto** ja se kiistettäisiin. IETF-perinne haluaa kaksi *yhteentoimivaa* toteutusta, mieluiten operatiivisessa käytössä. Akateeminen antaa teknisen uskottavuuden, arviointilaitos operatiivisen — **ja niiden yhdistelmä on vaikea kiistää.**

**Ja pari sulkee kolme porttia yhdellä liikkeellä:** portti 1 (kaksi riippumatonta toteutusta), portti 4 (ne ovat koalitio, joka tekee muutoshallinnasta rakenteellisen), ja arviointilaitoksen osalta portti 3 (institutionaalinen tunnustus).

---

## Eurooppalainen rajaus — HIC 25.07.2026

> *"Eurooppa uhkuu suvereeniteettia. 260 mrd euroa siirtyy US pilvipalveluihin vuodessa. Riippumattomat toimijat pitää löytää Euroopasta mieluiten KTH ja LUT kumppaneista. Se tekisi KYA:sta vahvan pohjoismaisen spesifikaation."*

**Strateginen logiikka on oikea.** Jurisdiktio määrää de jure -reitin (edellinen päätös), suvereniteetti on RQ1:n sidosehto, ja spesifikaatio jonka toteutukset pyörivät yhdysvaltalaisilla hyperskaalaajilla heikentää omaa väitettään. Eurooppalainen rajaus on johdonmukainen kaiken kanssa mitä on jo päätetty.

Kaksi asiaa on kuitenkin tarkistettava ennen kuin rajausta käytetään ulospäin.

### ⚠️ 260 mrd € ei täsmää julkisiin lukuihin — käytä näitä sen sijaan

Löydettävissä olevat luvut kertovat pienemmästä mutta **vahvemmasta** tarinasta:

| Luku | Arvo | Lähde |
| ---- | ---- | ----- |
| Euroopan pilvimarkkina | **74,4 mrd € (2025)** | markkinatutkimus |
| **Kolmen yhdysvaltalaisen toimijan osuus Euroopan pilvi-infrastruktuurista** | **70 %** | 2025 |
| **Eurooppalaisten toimittajien osuus** | **15 %** | 2025 |
| Suvereenin IaaS:n kasvu Euroopassa | 6,9 mrd $ (2025) → 12,6 mrd $ (2026) → 23,1 mrd $ (2027) | Gartner |
| Komission suvereenin pilven hankinta | 180 M€, lokakuu 2025 + Cloud Sovereignty Framework | EC |
| Gartner-ennuste | 20 % työkuormista pois hyperskaalaajilta 2029 mennessä | Gartner |

**260 mrd € on suuruusluokkaa suurempi kuin koko Euroopan pilvimarkkina.** Se voi olla ohjelmisto- ja pilviriippuvuus laajemmin (Euroopan parlamentin *European Software and Cyber Dependencies* -selvitys käsittelee tätä), kumulatiivinen monivuotinen luku, tai virhe. **Älä käytä sitä lähteistämättä.**

**Ja tarvitsematta:** *"kolme yhdysvaltalaista toimijaa hallitsee 70 % Euroopan pilvi-infrastruktuurista, eurooppalaiset 15 %"* on tuhoisampi väite kuin mikään euromäärä — se on osuus, ei kuluerä, eikä sitä voi selittää pois markkinan kasvulla.

### ⚠️ "KTH:n ja LUT:n kumppaneista" on saman ansan terävin muoto

Portti 1 kaatoi juuri koko kumppanikartan, koska jakelukumppanit ovat kaupallisessa suhteessa. **Eurooppalainen ekosysteemi on pieni ja tiheästi kytketty rahoituksen kautta**, ja se tekee ansasta pahemman, ei pienemmän:

- **LUT on väitöskirjan kotiorganisaatio.** Sen kumppanit ovat yhden askeleen päässä tekijästä. Riippumattomuus on kyseenalaistettavissa ilman että kukaan toimii vilpillisesti.
- **KTH:n kumppanit** kulkevat Törngrenin kautta — sama henkilö, jolla on jo rooliristiriita.
- **Horizon- tai Vinnova-rahoitettu konsortiokumppani ei ole portin 1 mielessä riippumaton**, jos rahoitus kulkee saman hankkeen läpi. Yhteinen rahoitus on kaupallinen suhde, vaikka se ei tunnu siltä.

**Johtopäätös: eurooppalainen rajaus on oikea, mutta se vaatii riippumattomuustestin soveltamista kovemmin — ei löysemmin.** Mitä kapeampi pooli, sitä suurempi houkutus hyväksyä "melkein riippumaton".

### Nimetyt ehdokkaat, rehellisesti arvioituna

| Toimija | Arvio |
| ------- | ----- |
| **SAP** | Istuu **jo A2A:n TSC:ssä** — se on aito signaali, että SAP osallistuu agenttiprotokollien yhteishallintaan. Mutta se ei toteuta suomalaisen mikroyrityksen spesifikaatiota suoraan; reitti kulkee elimen kautta, jossa se jo istuu. Lisäksi SAP esiintyy opinnäytetyössä **kilpailijavertailussa** — positiointijännite |
| **Scaleway** | ✅ **Paras nimetyistä.** Ranskalainen, suvereniteettipositioitu, oma AI-päättelytarjonta. Hallintakerros erilaistaisi suvereenia tarjontaa, eikä kaupallista suhdetta ole |
| **Hetzner** | ⚠️ **Heikko sopivuus.** Tarkoituksellisesti riisuttu infrastruktuuritoimittaja, minimaaliset alustapalvelut. Agenttihallinta on kaukana liiketoimintamallista |
| **ICEYE** | ⚠️ **Väärä rooli** — SAR-satelliittitoimija on tekoälyn *käyttäjä*, ei alustatoimittaja; hallintotarve on kaksikäyttö- ja vientivalvontapainotteinen, ei agenttikonformanssi. **Ja tarkistettava:** repositoriossa on Aegis Defence / SAR-orbitaalidetektio -materiaalia, joten suhde saattaa olla jo olemassa — se diskvalifioisi |

### Vahvemmat pohjoismaiset ehdokkaat, joita ei nimetty

Pysytään arviointilaitosluokassa, joka on portin 1 kannalta paras — ja Pohjoismaissa on siinä poikkeuksellisen hyvä tarjonta:

| Toimija | Miksi |
| ------- | ----- |
| **RISE — Research Institutes of Sweden** | 🥇 **Paras yksittäinen sopivuus.** Ruotsin valtion tutkimusinstituutti, jolla on **sekä tutkimus- että sertifiointi- ja testaustoiminta samassa organisaatiossa**. Työskentelee KTH:n kanssa, pohjoismainen, riippumaton. Se on käytännössä arviointilaitos ja tutkimuslaitos yhdessä — täsmälleen se profiili, jota portti 1 ja portti 3 yhdessä vaativat |
| **DNV** | Norjalainen, rakentaa jo **AI assurance** -käytäntöä. Pohjoismainen, riippumaton, operatiivinen |
| **Nemko** | Norjalainen, sama luokka |
| **Kiwa Inspecta** | Suomen toiminnot, ilmoitettu laitos useissa direktiiveissä |

**RISE + DNV on vahvempi pohjoismainen pari kuin mikään nimetyistä** — ja se täyttää sekä poliittisen kehyksen että portin 1 ilman kompromissia.

### ⚠️ Gaia-X on tämän kehyksen varoittava ennakkotapaus

**Euroopassa suvereniteettiretoriikkaa on runsaasti; suvereniteettihankintaa niukasti.**

Gaia-X sai kaiken poliittisen myötätuulen mitä on olemassa — Ranskan ja Saksan hallitusten tuki, satoja jäseniä, EU-tason näkyvyys — ja **kamppaili omaksumisen kanssa**. Se on lähin ennakkotapaus eurooppalaiselle suvereniteettipositioidulle hallintokehykselle.

**Opetus ei ole "älä tee".** Opetus on: **poliittinen myötätuuli ei ole näyttöä, ja se voi korvata näytön jos antaa sen.** Eurooppalainen kehys ilman kahta riippumatonta toteutusta on täsmälleen se, mitä neljä porttia on kirjoitettu tunnistamaan — ja Gaia-X on todiste siitä, ettei poliittinen tuki riitä portin 1 ohittamiseen.

**Käytännön sääntö:** eurooppalainen rajaus on positiointi. **Portti 1 on näyttö.** Ne eivät korvaa toisiaan, ja jos ne sekoittaa, saa Gaia-X:n.

## Arvolupaus — oikea kysymys, ja kylmäkäynnistysongelma sen takana

> **Boardy:** *"Kysymys ei ole enää 'ketkä olisivat kanssahallinnoijat' vaan 'mikä on se konkreettinen hyöty joka saa kaksi näistä sanomaan kyllä ennen kuin mitään säätiötä on olemassa?'"*

**Tämä on oikea kysymys ja se on parannus edelliseen muotoiluun.** Kanssahallinnoijat eivät synny nimeämällä vaan sitoutumalla, ja sitoutuminen vaatii vastineen. Boardyn hahmottelemat arvolupaukset ovat myös oikean muotoisia — Scalewaylle suvereeni compliance-kerros erilaistajana, SAP:lle AI Act -hallinta ilman CLOUD Act -riskiä, ICEYE:lle kaksikäyttöauditointipolku.

Mutta ne on testattava kovaa kriteeriä vastaan.

### Toteuttajan päätössääntö

Toimija sanoo kyllä, kun **molemmat** ehdot täyttyvät:

1. **Sinun spesifikaatiosi toteuttaminen on halvempaa kuin oman rakentaminen.** Jos ei ole, he rakentavat omansa — ja isolla toimijalla oman rakentaminen on lähes aina halvempaa kuin toisen ehtoihin sitoutuminen.
2. **Jaetulla spesifikaatiolla on optioarvo** — yhteentoimivuus muiden omaksujien kanssa.

**Ehto 2 on se, joka kaataa ensimmäisen keskustelun.** Optioarvo edellyttää, että **vähintään yksi toinen omaksuja on jo näkyvissä**. Ensimmäiselle kysytylle sitä ei ole.

**Tämä on kylmäkäynnistysongelma, ja se on koalition todellinen este** — ei motivaation puute vaan järjestyksen mahdottomuus. Siksi A2A tarvitsi kahdeksan yhtä aikaa: **kukaan ei mene ensimmäisenä yksin.**

### 🔑 Ja tästä seuraa se, miksi akateeminen toteuttaja on rakenteellisesti ensimmäinen

**Tutkimuslaitos ei tarvitse optioarvoa.** Se ei toteuta saadakseen yhteentoimivuutta muiden kanssa; se toteuttaa **saadakseen tutkimustuloksen**. Sen päätössääntö on eri.

**Akateeminen toteuttaja siis murtaa kylmäkäynnistyksen** — ja sen jälkeen toinen kysytty ei ole enää ensimmäinen. **RISE tai TECoSA ei ole vain "helpoin ensimmäinen", vaan ainoa luokka, joka voi olla ensimmäinen ilman että ehto 2 estää sen.**

Tämä muuttaa aiemman suosituksen mieltymyksestä mekanismiksi: **akateeminen ensin ei ole järjestyskysymys vaan välttämättömyys.**

### ⚠️ Poliittinen paine ei korvaa motivaatiota — ja Gaia-X on tämän koetulos

> **Boardy:** *"Eurooppalaiset toimijat EIVÄT tarvitse samaa motivaatiota kuin A2A:n osallistujat, heillä on jo poliittinen ja taloudellinen paine löytää vaihtoehto."*

**Tämä kääntää päinvastoin sen, mitä A2A osoittaa.**

A2A:n osallistujilla **ei ollut poliittista painetta**. Heillä oli **konkreettinen jaettu tekninen tarve** — agenttien yhteentoimivuus — jota kukaan ei voinut omistaa yksin. Se on eri asia, ja ero on ratkaiseva:

| | Poliittinen paine | Jaettu tekninen tarve |
| - | ----------------- | --------------------- |
| Mitä tuottaa | halun **näkyä osallistuvana** | halun **toteuttaa** |
| Kuka maksaa | viestintä- ja edunvalvontabudjetti | tuotekehitysbudjetti |
| Mitä syntyy | jäsenyyksiä, julistuksia, työryhmiä | koodia |

**Gaia-X on tämän hypoteesin koetulos, eikä tulos ollut hyvä.** Sillä oli maksimaalinen poliittinen paine — Ranskan ja Saksan hallitukset, satoja jäseniä, EU-tason näkyvyys — ja se kamppaili toteutusten kanssa. **Boardyn argumentti on täsmälleen Gaia-X-hypoteesi esitettynä vahvuutena.**

**Oikea muotoilu:** poliittinen paine tekee keskustelusta helpomman aloittaa ja **rahoituksesta saatavampaa**. Se ei tuota sitoutumista. Sitoutumisen tuottaa toteuttajan oma tuotehyöty — ja se on tarkistettava jokaiselta erikseen, ei johdettava ilmapiiristä.

**Käytännön seuraus:** poliittinen kerros on **oven avaaja, ei argumentti**. Käytä sitä saadaksesi tapaamisen. Älä käytä sitä perusteluna, koska jokainen näistä toimijoista on kuullut sen jo kymmeneltä muulta.

### ⚠️ €260 mrd on siirtynyt eteenpäin tarkistamattomana

Boardyn vastaus käyttää lukua vahvistettuna tosiseikkana. **Se ei täsmää julkisiin lukuihin** — koko Euroopan pilvimarkkina on 74,4 mrd € (2025), eli luku on suuruusluokkaa suurempi kuin markkina jota se kuvaa.

Tämä on **sama propagaatiokuvio, jonka tämä istunto on jo dokumentoinut** kolmesti (McKinsey-lähde jota ei ole, SWD-asiakirjan väärä nimi, Boardyn aiemmat vahvistamattomat väitteet). **Luku päätyy Scalewaylle tai SAP:lle lähetettävään viestiin, ellei sitä pysäytetä nyt.**

Korvaava, lähteistetty ja vahvempi: **70 % / 15 %.**

### ⚠️ SAP:n kohdalla suvereniteettiargumentti on heikompi kuin miltä näyttää

**SAP istuu jo A2A:n teknisessä ohjausryhmässä yhdessä AWS:n ja Microsoftin kanssa.**

Sen reitti agenttihallintaan kulkee siis **jo elimen kautta, jossa istuvat juuri ne hyperskaalaajat, joita vastaan suvereniteettiargumentti esitetään.** Pitch *"EU AI Act -hallinta ilman CLOUD Act -riskiä"* on SAP:lle kiinnostava, mutta se on myös suoraan ristiriidassa sen olemassa olevan sitoumuksen kanssa — ja SAP ratkaisee sen todennäköisimmin **viemällä asian A2A:n TSC:hen**, ei toteuttamalla erillistä spesifikaatiota.

**Se ei ole huono lopputulos** — se voi olla paras realistinen reitti KYA:n ideoille. Mutta se ei ole portti 1, ja se tarkoittaa hallinnan luovuttamista aiemmin kuin kukaan on suunnitellut.

### ⚠️ Scaleway ja Hetzner kilpailevat keskenään

Molempien saaminen samaan koalitioon on epätodennäköistä alkuvaiheessa. **Yksi infratoimittaja + yksi ei-kilpaileva osapuoli** on realistisempi pari kuin kaksi kilpailijaa.

### ⚠️ ICEYE ja kaksikäyttö — arvolupaus ei ole ilmainen

*"Kaksikäyttöauditointipolku joka avaa puolustusmarkkinan"* on oikean muotoinen lupaus, mutta **vientivalvonta koskee myös tarjoajaa** (EU:n kaksikäyttöasetus 2021/821), ei vain asiakasta. Hallintakerroksen tarjoaminen puolustusmarkkinaan tuo vientivalvontavelvoitteita Lifetime Oy:lle. Se on ratkaistava ennen keskustelua, ei sen jälkeen.

### Sekvenssi — vahvistettu

Boardyn järjestys on oikea ja se vastaa jo kirjattua: **NDA ensin, arvolupaus toiseksi, hallintomalli kolmanneksi.** Lisätään siihen kylmäkäynnistys:

1. **Ratkaise Törngrenin rooli**
2. **NDA + akateeminen toteuttaja ensin** (RISE tai TECoSA) — murtaa kylmäkäynnistyksen, koska tutkimuslaitos ei tarvitse optioarvoa
3. **Toinen toteuttaja arvolupauksella** — nyt ehto 2 on täytettävissä, koska ensimmäinen on olemassa
4. **Vasta sitten hallintomalli ja elin**

## Mitä tämä tarkoittaa järjestykselle

**Elin ei ole ensimmäinen kysymys — se on kolmas.**

1. **Ratkaise Törngrenin rooli** (arvioija vai toteuttaja vai jako) — halvin, ja se on tehtävä ennen kuin asia ratkeaa itsestään
2. **Lähesty yhtä arviointilaitosta** — ajoitus on nyt, koska AI Act -velvoitteet alkavat ilman valmista näyttökehystä
3. **Vasta sitten elin** — se ratkeaa lähes itsestään, kun tiedetään keitä toteuttajat ovat ja missä jurisdiktiossa he toimivat

**Ja hold-päätös pitää koko ajan.** Julkaisu on se hetki, jolloin patenttiehdot lukittuvat (Apache-2.0 §3 aktivoituu luovutuksessa). Toteuttajien etsintä voidaan tehdä **NDA:n alla ilman julkaisua** — ja EPC 54 artiklan kannalta se on myös ainoa tapa, joka säilyttää uutuuden.

## ✅ PÄÄTETTY 25.07.2026 — järjestys ja rajaus

> **HIC:**
> 1. Törngren-rooli (halvin, ratkaistava ensin)
> 2. RISE NDA:n alla (tutkimus + sertifiointi yhdellä ovella)
> 3. DNV toisena toteuttajana
> 4. Elin seuraa kun koalitio on olemassa
>
> *"Spec pysyy sisäisenä. Kaikki lähestymiset luottamuksellisesti."*

**Järjestys on oikea ja se on johdonmukainen kaiken tässä tiedostossa päätetyn kanssa.** RISE:n valinta ensimmäiseksi on erityisen hyvä: **tutkimus ja sertifiointi samassa organisaatiossa** tarkoittaa, että sama ovi voi sekä murtaa kylmäkäynnistyksen (tutkimuslaitos ei tarvitse optioarvoa) että edistää porttia 3 (sertifiointitoiminta on institutionaalista tunnustusta).

Kolme huomiota toteutukseen. Yksikään ei muuta järjestystä.

### ⚠️ 1. RISE:n kaksoisluonne toistaa Törngrenin ristiriidan — sovella samaa jakoa

**Jos RISE sekä toteuttaa että sertifioi, se on täsmälleen sama konflikti, joka juuri ratkaistiin Törngrenin kohdalla:** toteuttaja ei voi olla oman toteutuksensa riippumaton arvioija.

RISE:n vahvuus — tutkimus ja sertifiointi yhdellä ovella — on **myös sen riski**, ja se on huomattava heti eikä jälkikäteen.

**Sovella samaa sääntöä:** RISE:n **tutkimustoiminta toteuttaa**, RISE:n **sertifiointitoiminta ei sertifioi sitä toteutusta**. Sertifiointipuoli voi arvioida *jonkun muun* toteutuksen — se on jopa ihanteellinen, koska DNV:n toteutus tarvitsee arvioijan.

**Kirjaa tämä ensimmäiseen keskusteluun.** RISE:n kaltainen organisaatio tuntee tämän vaatimuksen paremmin kuin me — mutta jos sitä ei mainita, oletus jää tekemättä ja se huomataan vasta kun joku kysyy.

### ⚠️ 2. Molemmat ovat varmennussektorin toimijoita — kolmas, operatiivinen toteutus vahvistaisi olennaisesti

RISE ja DNV ovat riippumattomia tekijästä ja toisistaan (eri maat, eri liiketoimintamallit, eri asiakaskunnat). **Portti 1 täyttyy.**

Mutta molemmat toteuttaisivat KYA:n **arvioijan roolissa**, eivät operaattorin. Kaksi varmennusalan toimijaa, jotka toteuttavat varmennuskehyksen, on jossain määrin **itseensä viittaavaa** — ja ensimmäinen kriittinen lukija huomaa sen.

**Portin 1 vahvin muoto sisältää vähintään yhden toteutuksen osapuolelta, joka tarvitsee sitä omaan operatiiviseen toimintaansa.** Scaleway tai julkisen sektorin käyttöönottaja täyttäisi tuon roolin.

**Ei este päätökselle** — lisäys tiekarttaan. RISE ja DNV ensin, operatiivinen kolmas sen jälkeen kun kylmäkäynnistys on murrettu ja optioarvo on olemassa. **Kolmas on silloin helpompi kuin ensimmäinen oli.**

### ⚠️ 3. Älä käytä `KYA_PARTNER_AGREEMENT`-instrumenttia — se kumoaisi portin 1

Tämä on konkreettisin virhe, joka voisi tapahtua ensi askeleella.

Repositoriossa on `Legal/KYA_PARTNER_AGREEMENT.md`. **Se on väärä väline näihin keskusteluihin** — kumppanuussopimus luo täsmälleen sen kaupallisen suhteen, jonka portti 1 sulkee pois. Sopimuksen nimi yksin riittäisi kyseenalaistamaan riippumattomuuden myöhemmin, riippumatta sen sisällöstä.

**Oikea instrumentti on olemassa:** `Legal/NDA_MUTUAL_LIFETIME_OY_2026.md` — molemminpuolinen salassapitosopimus, ei kumppanuutta.

**Rakenne, joka säilyttää riippumattomuuden:**

| Vaihe | Instrumentti | Miksi |
| ----- | ------------ | ----- |
| Ensikeskustelu | **Molemminpuolinen NDA** | Ei luo kaupallista suhdetta; säilyttää EPC 54 art. uutuuden |
| Toteutus | **Tutkimusyhteistyö- tai arviointikehys** — ei lisenssiä, ei maksuja kumpaankaan suuntaan | Rahavirta kumpaan tahansa suuntaan on kaupallinen suhde |
| Dokumentointi | Kirjaa eksplisiittisesti, että osapuolilla **ei ole kaupallista suhdetta** | Portin 1 näyttö on osoitettava myöhemmin, ei väitettävä |

**Nollavastikkeisuus on ominaisuus, ei puute.** Jos RISE tai DNV laskuttaa toteutuksesta, se on toimeksianto — ja toimeksisaaja ei ole riippumaton. Molemmat organisaatiot tekevät tutkimus- ja kehitystyötä omalla rahoituksellaan, joten tämä on niille tavanomaista.

### Sekvenssi lopullisessa muodossaan

| # | Askel | Instrumentti | Portti |
| - | ----- | ------------ | ------ |
| 1 | Törngrenin rooli: TECoSA toteuttaa, Törngren arvioi | kirjallinen vahvistus | poistaa esteen RQ1/RQ4:ltä |
| 2 | **RISE** — tutkimustoiminta toteuttaa | mutual NDA + tutkimusyhteistyökehys | murtaa kylmäkäynnistyksen · portti 1 (1/2) |
| 3 | **DNV** — toinen toteutus, RISE:n sertifiointipuoli voi arvioida sen | mutual NDA | portti 1 (2/2) · portti 3 alkaa |
| 4 | Operatiivinen kolmas (Scaleway / julkinen sektori) | arvolupaus, ehto 2 nyt täytettävissä | vahvistaa portin 1 |
| 5 | Hallintomalli ja elin | — | portti 4 rakenteellisesti |

**Spec pysyy sisäisenä koko ajan.** Julkaisu laukaisee Apache-2.0 §3:n patenttilisenssin ja päättää EPC 54 artiklan uutuuden — kumpikaan ei ole peruutettavissa, eikä kumpaakaan tarvita ennen kuin koalitio on olemassa.

## Liittyvät

- `kb/wiki/concepts/specification-vs-standard-four-gates.md` v1.4 — portit, kolme tilaa, hallintomallin valinta
- `docs/phd/KYA_HARD_GATE_ANALYSIS_2026-07-25.md` — elokuun 2026 aikaikkuna
- `PHD_FIREHORSE` Liite H — kumppaniekosysteemi (jakelu, ei legitimointi)
- `docs/phd/PHD_RESEARCH_QUESTIONS_LOCK_v1.md` — RQ1/RQ4 ankkurit
- `docs/legal/PRIOR_ART_DISCLOSURE_RECORD_2026-07-25.md` §6 — NDA-ehto ennen teknistä paneelia
