---
title: "DWS Suvereeni pelikirja — Puolustus / kaksikäyttö"
slug: defence-fi
industry: "Puolustus / kaksikäyttö"
industry_number: 8
flagship: true
language: fi
version: 1.2.0
status: ACTIVE
effective: 2026-05-17
owner: Lifetime Oy
session: claude/playbooks-phase-1-Ps5Ax
pdf_target: dws10.com/playbooks/pdf/defence-fi.pdf
frameworks:
  - NIS2 (Direktiivi (EU) 2022/2555, CELEX 32022L2555)
  - CER (Direktiivi (EU) 2022/2557, CELEX 32022L2557)
  - EU:n tekoälyasetus (Asetus (EU) 2024/1689, CELEX 32024R1689) Artikla 12
  - Kaksikäyttötuotteiden vientivalvonta (Asetus (EU) 2021/821, CELEX 32021R0821)
  - GDPR (Asetus (EU) 2016/679, CELEX 32016R0679)
badges:
  - DWS Sovereign Stack
  - NVIDIA Inception
  - EU Inception Sovereign track
---

***
VERSION AND AGENT HISTORY
- 1.0.0 — 2026-05-17 — alkuperäinen Phase 1 -pelikirja (englanninkielinen) (claude/playbooks-phase-1-Ps5Ax)
- 1.1.0 — 2026-05-17 — Boardyn toimituspassi (claude/playbooks-phase-1-Ps5Ax)
- 1.2.0 — 2026-05-17 — Nokia Defence -kumppanuusasetelma lisätty + suomenkielinen käännös defence-fi.md (claude/playbooks-phase-1-Ps5Ax)
***

# Puolustus / kaksikäyttö — suvereenin pinon pelikirja

**Kenelle:** Suomen Puolustusministeriö, Puolustusvoimat (Pääesikunta,
Johtamisjärjestelmäkeskus, Logistiikkalaitos), EU:n puolustusministeriöt,
kaksikäyttöalan teolliset toimijat, vapaapalokunnat (VPK) sotilas- ja
siviilipuolustuksen rajapinnassa sekä CER/NIS2-valvonnan piirissä olevat
kriittisen infrastruktuurin operaattorit.

**Yhden lauseen lupaus:** NVIDIA-pino omalla raudallasi, omassa
rakennuksessasi, Artikla 12 -lokilla jonka tarkastaja voi sinetöidä.

> Jos et omista rautaa, et omista turvallisuutta.

---

## 0. Mitä sinun pitää uskoa, jotta tämä on sinulle relevantti

Tämä pelikirja ei ole halvempaa ja helpompaa tekoälyä etsiville. Se on niille,
jotka tietävät jo, että vaatimustenmukaisuus, lainvoimaiset
luovutusmääräykset ja operatiivinen hallinta ovat sitovia reunaehtoja.
Saadaksesi tästä dokumentista hyödyn, sinun pitää olla samaa mieltä seuraavista:

<div class="callout-believe">
<ul>
  <li><b>NIS2, CER, EU:n tekoälyasetuksen Artikla 12 ja Asetus 2021/821 ovat todellisia, voimassa olevia ja tarkastettavissa</b> — eivät pelkkää aiekirjelmää.</li>
  <li><b>Pilviriippuvuus on väärä veto puolustukselle ja CER-kriittisille toimijoille</b> — pilvipohjaisen ratkaisun oikeudellinen riskireservaus on rajoittamaton.</li>
  <li><b>Raudan omistaminen on koko pointti</b> — fyysinen huoltajuus inferenssikerroksesta on substraatti, joka tekee jokaisesta jälkikontrollista uskottavan.</li>
  <li><b>Lokitus on toimitettava komponentti</b>, ei sivutuote. Artikla 12 -loki on se, jonka luovutat tarkastajalle — sen on synnyttävä siellä, missä voit sinetöidä sen.</li>
</ul>
</div>

Jos nyökkäsit näille neljälle, tämä loput on sinulle.

---

## 1. Pilvi-pohjaisten LLM:ien neljä rakenteellista puutetta puolustustyössä

| # | Puute | Nimetty sääntely |
|---|---|---|
| 1 | **CLOUD Act -altistuminen.** Yhdysvaltoihin rekisteröidyt pilvipalveluntarjoajat voidaan pakottaa luovuttamaan asiakastiedot Yhdysvaltain viranomaisille — myös EU-alueille tallennettu data. Puolustukselle, kaksikäytölle tai CER-toimijoille tämä on diilin tappaja. | Yhdysvaltain CLOUD Act 2018 (Pub. L. 115-141) — törmää **GDPR Art. 48**:n kieltoon kolmannen maan luovutusmääräyksistä ilman valtiosopimusta (CELEX 32016R0679). |
| 2 | **Ei 24 tunnin häiriön rekonstruktiota.** Kun pilvi-LLM antaa väärän vastauksen klo 02:00, et pysty rekonstruoimaan mitä se teki. Lokit ovat jonkun muun tilauksessa, jonkun muun granulariteetilla, jonkun muun säilytyspolitiikalla. | **NIS2 -direktiivi (EU) 2022/2555 Art. 23** — varhainen varoitus 24 h:ssa, väliraportti 72 h:ssa, lopullinen raportti 1 kuukauden kuluessa. CELEX **32022L2555**. |
| 3 | **Ei Artikla 12 -muuttumatonta tietuetta.** Pilvi-LLM:t eivät tuota promptin / vastauksen / päätöksen jälkiä siinä granulariteetissa, jota korkean riskin tekoälyjärjestelmä vaatii. | **EU:n tekoälyasetus (EU) 2024/1689 Art. 12** — tapahtumien ("lokien") automaattinen tallennus korkean riskin tekoälyjärjestelmän eliniän ajalta. CELEX **32024R1689**. |
| 4 | **Ei luotettavaa kaksikäyttötuotteiden vientivalvontapäättelyä.** Pilvi-LLM, joka pyörii oman lainkäyttöalueesi ulkopuolella, ei voi luotettavasti kieltäytyä, lokita tai eskaloida pyyntöä, joka koskee Liite I:n valvonnan alaisia tuotteita tai herkkiä loppukäyttöjä — eikä mitään kykyä tarkastaa, mitä se sanoi. | **Neuvoston asetus (EU) 2021/821** (kaksikäyttötuotteiden vientivalvontajärjestelmän uudelleenlaadinta). CELEX **32021R0821**. |

Jos myyt puolustukseen, kaksikäyttöön tai kriittiseen infrastruktuuriin,
**mikä tahansa neljästä** tappaa diilin. Pilvi-pelkkä on rakenteellisesti
sopimaton.

> Pilvipohjaisen ratkaisun oikeudellinen riskireservaus on rajoittamaton.
> Suvereenin ratkaisun riskireservaus on nolla — koska lainkäyttöalue on poistettu.

---

## 2. Suositeltu suvereeni topologia

Puolustuspelikirja edellyttää siltayhdistettyä Situation Roomia, ei yksittäistä
reuna-laitetta. Syy on Artikla 12 -lokin replikointi: tarkastaja, jolle
luovutetaan sinetöity loki yhdestä noodista, ei pysty arvioimaan, oliko sitä
noodia peukaloitu tapahtuman ja sinetöinnin välillä. Kaksi noodia,
replikoituna, ristiinallekirjoitettuna.

**Rauta**

- **Situation Room (2× siltayhdistetty Acer Veriton GN100) — LF-SITROOM-001 — 10 093 €**
  Kaksi GN100-noodia yhdistettynä ConnectX-7-sillalla. 40 ydintä, 240 GiB
  yhdistettyä muistia, siltayhdistetty inferenssi 405 B-parametrin malleihin
  asti. Artikla 12 -loki kirjoitetaan aktiivi/valmius-konfiguraatiossa,
  ristiinreplikoituna, 7 vuoden säilytys.

- *Yksinoodinen vaihtoehto:* **IGX Orin (LF-IGX-ORIN) — 11 990 €** —
  puolustustoimijoille, jotka tarvitsevat NVIDIAn 10 vuoden teollisen
  tuen elinkaaren vuoteen 2033 saakka sekä ECC-muistin yhdellä noodilla.
  Käytä, kun yksinoodisen jalanjälki on tärkeämpää kuin siltayhdistetty
  redundanssi (esim. ajoneuvo, alus, kontti).

**Palvelu**

- **NVIDIA Install + Full Service — 995 €/laite** — paikan päällä insinööri,
  CUDA + NVIDIA-ajurit validoituna molemmissa noodeissa, NVIDIA NIM
  -mikropalvelut + Cosmos Reason 2 -tarkistuspisteet ladattuina,
  tensoriparallelismi konfiguroituna, MCP-päätepiste käytössä,
  Artikla 12 -replikaloki käynnistetty, allekirjoitettu asennusprotokolla
  + ajokäsikirja.

**Tilaus**

- **Sovereign Model Updates — 299 €/kk** — viikoittaiset
  tietoturvakorjaukset (CUDA-ajuripäivitykset, konttien CVE-korjaukset,
  OpenSandbox + Ubuntu LTS), pienet mallipäivitykset,
  sillan konfiguraatiotuunaukset, kuukausittainen NIM-paketin päivitys.
  CER / NIS2 / EU:n tekoälyasetuksen tarkastajat odottavat dokumentoitua
  korjauskadenssia — viikoittainen on tarkastajaystävällinen.

**Alusta**

- **DWS IQ 6 — 4 999 € (kertaluonteinen)** — orkestrointi, MCP-jako,
  agenttirekisteri, Artikla 12 -loki-API, EUR-Lex-haku,
  auditbundlen vientityökalu.

**Avaimet käteen yhteensä (vuosi 1): 10 093 € + 995 € (×2 noodia kattaa yksi
maksu/pari) + 4 999 € alusta + 299 € × 12 tilaus = 19 675 €.**
Vuosi 2+: 299 € × 12 = 3 588 €/vuosi tilausmaksu.

Kaikki hinnat Suomi/EU B2B ALV 0 % käännetty verovelvollisuus. Hintatieto:
`dws10.com/config/products.json` (priceList v1.20).

---

## 3. Kolme nimettyä työnkulkua jotka automatisoimme

### Työnkulku A — Lennokin tunnistus + UAS-luokitus + Artikla 12 -luovutus

- **Konenäkö-NIM:** YOLOv8-x Noodi A:ssa neljästä yhtaikaisesta
  kamerasyötteestä — rajauslaatikko + luokka + luottamus ohjauspöydällä
  reaaliajassa.
- **Akustinen NIM:** BirdNET-pohjainen akustinen tapahtumamalli Noodi A:n
  toissijaisella kaistalla — roottoritunnisteen luokittelu
  (quadcopter / fixed-wing) vahvistaa tai hylkää visuaalisen havainnon
  alle 200 ms:ssä.
- **Päättely-NIM:** Qwen 2.5 72B siltayhdistettynä molempien noodien yli —
  ristiviittaa havainto + lentokäytäväohje + KRITIS / CER -säännöt +
  paikallinen NOTAM-tietokanta.
- **Mihin loki päätyy:** jokainen havainto, jokainen suositus, jokainen
  operaattorin päätös päätyy **EU:n tekoälyasetuksen Art. 12 -lokiin**,
  replikoituna aktiivi/valmius-tilassa molemmissa GN100:issa,
  hash-ketjutettu, 7 vuoden säilytys.
- **Mitä tarkastaja näkee:** yksi allekirjoitettu vienti — JSON-tapahtumavirta
  + CSV-päätösloki + SHA-256-ketjun manifesti — luovutettuna sinetöidyssä
  USB:ssä tai pelkkäluku-Artikla 12 -loki-API:n kautta.

### Työnkulku B — Kaksikäyttötuotteiden vientivalvontaseulontaa (As. 2021/821)

- **Päättely-NIM:** Llama 3.1 70B Noodi B:ssä (itsenäinen tarkistus) +
  Qwen 2.5 72B sääntelyyn viritettynä Noodi A:ssa — molempia konsultoidaan
  jokaisen lähtevän lähetyspyynnön kohdalla; erimielisyys nostetaan
  operaattorin tietoon.
- **Haku:** BGE-M3 -upotukset + paikallinen RAG Neuvoston as. (EU)
  2021/821 Liite I:stä (valvotut tuotteet), Liite IV:stä (EU:n sisäinen
  rajoitus) sekä omasta loppukäyttäjä-/loppukäyttötiedostostasi.
- **Mihin loki päätyy:** Artikla 12 -lokimerkintä jokaisesta
  seulontapäätöksestä — luokittelu, mallien yksimielisyystila, operaattorin
  ohitus (jos sellainen) ja lopullinen tulos (vapauta / pidätä / eskaloi).
- **Mitä tarkastaja näkee:** lähetyskohtainen päätösjälki, jossa siteerataan
  täsmällinen CELEX-pykälä, konsultoidut malliversiot ja operaattorin
  identiteetti, joka liittyy puheluun. Puolustuskelpoinen tarkastuksessa.

### Työnkulku C — NIS2 24 tunnin häiriön rekonstruktio

- **Litterointi-NIM:** Whisper (FI / SV / EN) operaattorin konsolissa —
  jokainen radiopuhelu, jokainen Virve-lähetys, jokainen operaattori-
  operaattori-luovutus tallennetaan talossa.
- **Päättely-NIM:** Qwen 2.5 72B kävelee häiriön aikajanan läpi NIS2-
  velvoitteitasi vasten ja luonnostelee 24 tunnin varhaisen varoituksen ja
  72 tunnin väliraportin — esitäytetty, CISO:si muokkaa ja allekirjoittaa.
- **Mihin loki päätyy:** Artikla 12 -lokimerkintä per artefakti — alkuperäinen
  telemetria, mallin luonnostelema raportti, ihmisen muokkaukset, lopullinen
  toimitus.
- **Mitä tarkastaja näkee:** yksi rekonstruktiopaketti — mitä järjestelmä näki,
  mitä malli suositteli, mitä ihminen teki, milloin kukin vaihe tapahtui,
  allekirjoitettu päästä päähän.

---

## 4. ROI — manuaalinen vs DWS:n suvereeni pino, 36 kk

| Erä | Manuaalinen / pilvi -lähtötaso | DWS suvereeni |
|---|---|---|
| Rauta (kertaluonteinen) | 0 € (pilvi) | 10 093 € (Situation Room siltayhdistetty pari) |
| Asennus + käyttöönotto | 0 € (pilvi) | 995 € (yksi maksu parille) |
| Alustalisenssi (kertaluonteinen) | 0 € — korvattu SaaS:lla | 4 999 € (DWS IQ 6) |
| Vaatimustenmukaisuusvastaavan tunnit, Artikla 12 -rekonstruktio (~6 h/kk á 120 €/h) | 25 920 € / 36 kk | ~2 160 € (10 % jäännöstarkastelu) |
| Kaksikäyttöseulonnan tarkastelu (~4 h/vk á 120 €/h) | 74 880 € / 36 kk | ~7 488 € (10 % jäännös) |
| Pilvi-LLM-tokenit (puolustuslaatu, EU-asuva — missä saatavissa) | 18 000 – 36 000 € / 36 kk (tyypillinen) | 0 € — paikan päällä inferenssi |
| Tilaus | – | 10 764 € (299 € × 36) |
| CLOUD Act / GDPR Art. 48 oikeudellisen riskin reservaus | rajoittamaton — tapauskohtainen | 0 € (lainkäyttöalue poistettu) |
| **36 kk:n TCO** | **118 800 € – 136 800 €** | **36 499 €** |

Varovainen haarukka. Rivi, joka sulkee diilin, on rivi 8: oikeudellisen
riskin reservaus on rajoittamaton pilvi-pelkässä ja poissa suvereenissa.

---

## 5. Referenssiasennuksen vinjetti

**Skenaario.** 2026, itä-Suomen rajakunta. Vapaapalokunta pyörittää
suvereenia-oletuksena-situaatiohuonetta kalustohallista. Kaksikäyttömandaatti:
palo/pelastus + siviilipuolustus — mukaan lukien tuntemattomat UAS-havainnot.
CER ja NIS2 vaativat auditoitavaa havaitsemis-päätös-lokia.

Näin Situation Room ajaa sen ilman, että data poistuu rakennuksesta:

<ul class="timeline">
<li><b>T+0&nbsp;ms</b> — YOLOv8-x Noodi A:ssa merkitsee liikkuvan kohteen yhdellä neljästä kamerasyötteestä. Rajauslaatikko + luokka + luottamus ohjauspöydällä.</li>
<li><b>T+200&nbsp;ms</b> — Akustinen malli Noodi A:n toissijaisella kaistalla vahvistaa quadcopterin roottoritunnisteen. Visuaalinen havainto nostetaan <i>ehdokkaasta</i> <i>vahvistetuksi</i>.</li>
<li><b>T+500&nbsp;ms</b> — Qwen 2.5 72B siltayhdistettynä molemmissa noodeissa ristiviittaa havainnon lentokäytävän B7 ohjetta, KRITIS / CER -säännöstöä ja paikallista NOTAM-tietokantaa vasten.</li>
<li><b>T+1.0&nbsp;s</b> — Suositus tulee päivystäjän konsoliin: <i>"Todennäköisesti kaupallinen quadcopter, käytävä B7, ei rajoitusalueella. Loki + tarkkaile. Eskaloi jos kestää &gt; 5 min rajoitusalueella."</i></li>
<li><b>T+1.2&nbsp;s</b> — Llama 3.1 70B Noodi B:ssä ajaa saman skenaarion itsenäisesti. Yksimielisyys = korkea luottamus; erimielisyys = molemmat näkemykset operaattorille.</li>
<li><b>T+2.0&nbsp;s</b> — Whisper litteroi päivystäjän radiopuhelun kumppaniyksikölle; TTS lähettää keskinäisen avunannon SitRepin suomeksi ja ruotsiksi Virvessä.</li>
<li><b>T+sinetöity</b> — Jokainen havainto, suositus ja operaattorin päätös on Artikla 12 -lokissa, replikoituna molemmissa noodeissa, hash-ketjutettuna. CER / NIS2 -tarkastaja saapuu; päivystäjä luovuttaa sinetöidyn viennin.</li>
</ul>

Mikään ei kulkenut ulkoisen verkon yli. CLOUD Act ei ulotu kalustohalliin.

---

## 6. Suomalaisen hankinnan liite — Hilma.fi, Laki 1531/2011, CPV-kartoitus

Tämä liite on tarkoitettu erityisesti Suomen Puolustusministeriön,
Puolustusvoimien (Pääesikunta, Johtamisjärjestelmäkeskus,
Logistiikkalaitos) hankintapäälliköille, jotka tarvitsevat kartoituksen
tämän tarjouksen ja olemassa olevan hankintaputken välillä.

### Oikeusperusta

- **Laki julkisista puolustus- ja turvallisuushankinnoista 1531/2011**
  ("PUTU-laki"). Kansallinen implementaatio EU:n
  **Direktiivistä 2009/81/EY** puolustus- ja turvallisuusalan hankinnoista.
- EU:n kynnysarvo puolustus- ja turvallisuuspalvelu-/tavarahankinnoille:
  **443 000 €** (uudistus voimassa 1.1.2026 alkaen, Komission asetuksen
  (EU) N:o 1251/2011 säännönmukaisen tarkistuksen mukaisesti). Vahvista
  voimassa oleva kynnysarvo *Virallisesta lehdestä* ilmoituksen
  julkaisupäivänä.
- Alle kynnysarvon: Lain 1531/2011 kansalliset säännöt, ilmoitus
  **Hilmassa (hankintailmoitukset.fi)** asianmukaisessa kansallisessa
  kategoriassa.
- Yli kynnysarvon: sama Hilma-ilmoitus; alusta välittää ilmoituksen
  automaattisesti **TED:lle (Tenders Electronic Daily)**.

### Menettelykartoitus

Tämän kaltaiselle suvereenin pinon hankinnalle — siltayhdistetty
Situation Room tai IGX Orin, NVIDIA NIM -paketti, suvereenin
malli päivitykset -tilaus ja DWS IQ 6 -orkestrointialusta Artikla 12
-lokituksella — suositeltava menettely PUTU-lain mukaan on
**neuvottelumenettely ilmoituksen julkaisemisen jälkeen**
(Laki 1531/2011 § 30, Dir. 2009/81/EY Art. 26 implementaatio). Perusteet:

- turvallisuusherkkä toimintaympäristö;
- teknistä määritystä ei voida täysin lukita etukäteen
  (mallipakettikonfiguraatio riippuu operatiivisesta roolista);
- vuoropuhelu tarvitaan Artikla 12 -lokituksen integraatiosta asiakkaan
  SIEM:iin ja tarkastajan luovutusprosessiin.

### CPV-kartoitus

CPV 2008 -sanasto ei tunne tekoälyä erikseen. Lähin tarkka kartoitus DWS
Defence -käyttöönotolle:

| CPV | Kuvaus | Vastaa |
|---|---|---|
| 35710000-4 | Johtamis-, valvonta-, viestintä- ja tietokonejärjestelmät | Situation Room siltayhdistetty pari C4-alustana |
| 35720000-7 | Tiedustelu, valvonta, kohteen hankinta (ISTAR) | UAS-tunnistus-työnkulku (Työnkulku A) |
| 30210000-4 | Tietojenkäsittelykoneet (laitteisto) | Acer Veriton GN100, IGX Orin, DGX Spark |
| 48000000-8 | Ohjelmistopaketit ja tietojärjestelmät | DWS IQ 6 -alusta, NIM-mikropalvelupaketti |
| 72000000-5 | IT-palvelut: konsultointi, ohjelmistokehitys, Internet, tuki | NVIDIA Install + Full Service, Sovereign Model Updates |
| 80511000-9 | Henkilöstön koulutuspalvelut | Operaattoriharjoitus asennuksen hyväksynnässä |

Yhdistetty ilmoitus listaa tyypillisesti **35710000-4**:n ensisijaisena
CPV-koodina ja 30210000-4 sekä 48000000-8 lisäkoodeina.

### Tarjoajan tiedot

| Kenttä | Arvo |
|---|---|
| Tarjoaja | Lifetime Oy |
| Y-tunnus | 0772407-9 |
| ALV-tunnus | FI07724079 |
| Osoite | Laidunmaanraitti 2 A 25, 02330 Espoo, Finland |
| Toimitusjohtaja | Risto Anton Paarni |
| Yhteyshenkilö | risto.paarni@lifetime.fi |
| Toimitusketju | NVIDIA Inception Partner (EU Sovereign track) · Acer ISV -reitti · EU-asuva valmistus / integraatio / tuki |
| Saatavuus | Toimitus 4–8 viikkoa tilauksesta, asennus 1–2 päivää / sivusto |

### Asema Nokia Defencen kanssa

> **Nokia tuo verkon uskottavuuden. DWS tuo hallitun toimintapinon.**

Nokian puolustus- ja tiedustelutarjonta — yksityinen 5G,
mission-critical-verkot, taktinen-kupla -tyyppinen ulottuva yhteys,
MX Industrial Edge — ratkaisee suvereenin pinon alapuolisen kerroksen:
bittien saamisen kamerasta, radiosta ja sensorista inferenssitasolle
luotettavasti operatiiviseksi luotetuksi, sekä kentällä että kalustohallissa.

Kolme asiaa, jotka Nokia tuo yhteiseen kaseen:

- **Hankinnan uskottavuus.** Tunnettu pohjoismainen puolustustoimija
  verkkokerroksessa tekee suvereenista pinosta vähemmän startup-teesi ja
  enemmän ostokelpoinen järjestelmä. Ostajan riskikomitea tunnistaa
  Nokia-logon jonakin, jonka se on aiemmin hyväksynyt.
- **Turvallinen yhteys.** Yksityinen 5G / reuna / mission-critical
  -palaset sallivat paikan päällä olevan NVIDIA-pinon todella toimia
  kentällä — ajoneuvossa, aluksessa, kontissa, eturintaman noodissa —
  ei pelkästään kiinteässä rakennuksessa.
- **Integraatiopeite.** Nokia omistaa verkko- ja infrastruktuurikerroksen;
  DWS omistaa ohjauskerroksen ja Artikla 12 -lokituskerroksen sen
  päällä. Puhtaampi arkkitehtuuri kuin yrittää olla kaikkea itse.

Se, mitä Nokia **ei** tuo, on suoja-aita. Suoja-aita — suvereeni asennus,
asiakkaan omistama rauta, auditoitava luovutus, NVIDIA NIM -palvelukääre
ja kentän palautesilmukka — istuu DWS:n hallussa. Yhteistarjoukseen
geometria tehdään näkyväksi: **Nokia viivan alla, DWS viivan yläpuolella,
asiakas sinetin huollossa.**

### Asema NestAI-yhteistyön kanssa

> **NestAI rakentaa mallin. DWS rakentaa sen fyysisen ja oikeudellisen
> kerroksen, joka tekee mallista Artikla 12:n ja NIS2:n tarkastuksessa
> kestävän.**

Suomalainen kotimainen tekoäly on oikea strateginen veto puolustukselle.
Mutta malli ilman suvereenia substraattia, jolla pyöriä, on malli, joka
on käytettävä jonkun toisen raudalla — ja se jonkun toisen rauta tänä
päivänä on lähes aina Yhdysvaltoihin rekisteröity pilvi. DWS toimittaa
substraatin, joka sulkee aukon: paikan päällä inferenssin, NVIDIA NIM
-mikropalvelukäynnistöympäristön, Artikla 12 -lokituskerroksen,
replikoidun audit-tallennuksen ja tarkastajalaatuisen bundlen
vientityökalun. NestAI-malli laskeutuu DWS Situation Roomille ja on
**otettavissa käyttöön rajoitetuissa ympäristöissä päivänä yksi** ilman,
että vaatimustenmukaisuuskertomusta tarvitsee kirjoittaa uudelleen.

---

## 7. Vastaväitteet jotka saamme, ja rehellinen vastaus

### "Mallit muuttuvat nopeasti. Rauta on kiinteää. Eikö se häviä sinulle?"

Ei — kahdesta syystä. Ensinnäkin, **Sovereign Model Updates** -tilaus
(299 €/kk) virkistää NIM-paketin kuukausittain; rauta on substraatti,
mallit ovat kuorma, ja kuorma vaihdetaan. Toiseksi, malliluokka joka
pyörii siltayhdistetyssä GN100-parissa (tensoriparallelismin kautta
405 B-parametriin asti) on täsmälleen se luokka, jonka tarkastaja
hyväksyy todisteena seuraavat 3–5 vuotta. Rauta on kiinteä; suoja-aita
on vaihtokadenssi + Artikla 12 -lokin jatkuvuus päivitysten yli.

### "Kuka kantaa vastuun jos malli hallusinoi väärän uhkakutsun?"

Operaattori, sama kuin minkä tahansa päätöksenteon tukityökalun kanssa
tänä päivänä. Mitä DWS lisää, on **todistusketju, joka antaa operaattorin
puolustaa kutsun**:
- molempien mallien itsenäiset tulokset ja erimielisyystila lokitetaan;
- konsultoidun SOP:n ja säännöstön versio lokitetaan;
- operaattorin päätös ja päätösaika lokitetaan;
- koko ketju hash-sinetöidään ennen luovutusta.

Suvereenin pinon sopimuksellinen vastuu on Lifetime Oy:llä,
suomalaisrekisteröidyllä EU-yhtiöllä (Y-tunnus 0772407-9). Ei kolmannen
maan hyppyä vastuuketjussa.

### "Miksi emme voi käyttää yksityistä EU-tenanttia Azuressa / AWS:ssä / OCI:ssä?"

Kolme syytä, päättäväisyysjärjestyksessä:

1. **CLOUD Act -lainkäyttöalue ei poistu EU-tenantilla.** Yhdysvaltoihin
   rekisteröity palveluntarjoaja voidaan edelleen pakottaa Yhdysvaltain
   CLOUD Actin (Pub. L. 115-141) nojalla luovuttamaan asiakastiedot
   Yhdysvaltain viranomaisille riippumatta siitä, mikä alue tavut pitää.
   GDPR Art. 48 (CELEX 32016R0679) kieltää kolmannen maan
   luovutusmääräykset ilman valtiosopimusta. Nämä kaksi törmäävät;
   ostaja kantaa oikeudellisen riskireservaation.
2. **Artikla 12 (EU:n tekoälyasetus) edellyttää tietueenpitoa
   korkean riskin tekoälyjärjestelmän eliniän ajan granulariteetilla,
   jota pilvipalveluntarjoajat eivät tuota.** Yksityinen tenantti
   muuttaa sitä, kuka pitää avaimet; se ei muuta sitä, mitä pilvipuolen
   lokitus kaappaa.
3. **NIS2:n 24 tunnin häiriöraportti vaatii rekonstruktion siitä, mitä
   malli teki häiriön hetkellä.** Kun lokit asuvat jonkun muun
   tilauksessa, jonkun muun granulariteetilla, jonkun muun
   säilytyspolitiikalla, rekonstruktio on osittainen. Tarkastajat
   huomaavat.

Rehellinen vastaus: yksityinen tenantti on hyödyllinen asema joillekin
työkuormille. Puolustukselle, kaksikäytölle ja CER-kriittiselle
infrastruktuurille se ei riitä.

---

## 8. Mitä tehdä seuraavaksi

- **Varaa 30 minuutin demo:** <https://dws10.com/book>
- **Täysi hinnasto:** <https://dws10.com/buy>
- **NVIDIA Inception -case:** <https://dws10.com/dual-use-industries>
- **Suora yhteys:** Risto Paarni, toimitusjohtaja Lifetime Oy — risto.paarni@lifetime.fi

Lifetime Oy — Y-tunnus 0772407-9 — ALV FI07724079 —
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland.
