# v4.2 — laatimisrajaus ja asiavirhelista päätettäväksi

***

# VERSION AND AGENT HISTORY

Version: 1.8

Sessions & Modifications:

- Version: 1.8 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: **Kaksi viimeistä päätöstä — lista on täysi.** A6: alustaohjelmistoja on **neljä**, taulukon luku 2 oli väärä; kuvaus säilyy. Luku 3.3: **kaikki yritysnimet pois**, toimialat jäävät. Poistojen jälkeen työssä ei ole yhtään yritysnimeä asiakas- tai kohdeasiakasroolissa. Lisätty ⚠️ rajaus: **teknologiatoimittajat jäävät** (Google Cloud Run, NVIDIA, Cloudflare, Supabase, Proton, Groq, Revolut, Stripe) — ne ovat arkkitehtuurin sisältöä, ja ilman niitä toteutus ei ole toistettavissa. Kilpailijanimet poistuvat C1/C2:n korvaavan virkkeen myötä.
- Version: 1.7 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: **Korjaushuomautus päätetty** ja laadittu (`V42_KORJAUSHUOMAUTUS.md`, 18 numeroitua kohtaa). Kolme poikkeamaa ehdotuksesta perusteluineen: huomautus ei saa toistaa poistettua sisältöä (muuten B1 ja D1 kumoutuvat), viittaus lukuihin eikä riveihin (rivinumerot eivät kestä korjauksia), ja numeroimaton osio eikä Liite 9 (muuten liitteiden määrä rikkoo oman korjauksensa). Kirje kevennetty v3.2:ksi viittaamaan huomautukseen.
- Version: 1.6 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: **A5 vahvistettu** — 25–350 kustannuksiin (3 kohtaa), 0–350 asiakashintaan (2 kohtaa ennallaan), Freemium-riviin ei kosketa; toteutuksessa ei saa käyttää hae-ja-korvaa. Lisätty **HIC:n linjaus kirjaston roolista**: kirjaston tehtävä on ylläpitää julkista opinnäytetyöpalvelua ja Metropolia haluaa mahdollisimman hyvän tekstin, joten korjaus on yhteinen intressi eikä pyydetty palvelus. Korjauskynnys on siis matalampi kuin aluksi oletettiin.
- Version: 1.5 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: **Loput päätökset kirjattu.** A6 korjataan · B2 Kela pois (myös luvun 3.3 segmenttilistasta — se ei ole logistiikkayritys; poiston jälkeen sana ei esiinny työssä lainkaan) · B3 versiometatietorivi pois · C3 nimi ja liian vahva "validoitu"-merkintä korjataan · C4 36 % päästöt ja 40 % energia erotetaan toisistaan. **C2 vastattu: tarkkaa hintatietoa ei tarvita** — kappaleen oma premissi on skaalautumisväite, ei hintatasoväite; luvut vanhenevat ja SAP:n luku ei ole lähteistettävissä lainkaan. Yksi korvaava virke ratkaisee C1:n, C2:n ja latenssin lähteen kerralla.
- Version: 1.4 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: **Viisi päätöstä kirjattu.** D1 vahvistettu (koko kappale pois). A2: työssä on viisi lukua — 1.6 kirjoitetaan sen mukaiseksi, teksti lyhenee kolmesta virkkeestä yhteen. A3: 3.4.2→3.4.1, 3.4.3→3.4.2, puuttuvaa alalukua ei lisätä. A4: SWOT-maininta korjataan vastaamaan esitettyä laskelmaa (pilvi vs. reuna), luku 82 % säilyy. **A5: tarkistus paljasti kaksi eri suuretta** — infrakustannus (25–350, kolme korjattavaa kohtaa) ja asiakashinta (0–350, kaksi säilytettävää kohtaa, koska työn oma hinnoittelumalli määrittelee Freemium 0 €). Jako jätetty HIC:n vahvistettavaksi, koska pelkkä korvaaminen kaikkialla tuottaisi uuden virheen.
- Version: 1.3 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: **B1 päätetty (poistetaan)** — kuusi esiintymää nimineen ja summineen listattu korvaavine muotoiluineen; ratkaisee samalla A7:n. Yksi alakysymys jätetty auki: kohdesegmenttilista (luku 3.3), joka on eri asia kuin asiakasväite. **C1: korvaava evidenssi etsitty** — latenssiluvun paras lähde on työn oma työmaasimulaatio, joka on jo tekstissä; kilpailijahinnoista Atlassian ja Siemens ovat julkisesti lähteistettävissä, SAP:lla ei ole julkista listahintaa lainkaan. Korjattu argumentti on rakenteellinen (kilpailijoiden kustannus skaalautuu käyttäjämäärän mukana) ja vahvempi kuin alkuperäinen. **🔴 Uusi löydös D1**, jota ei etsitty: julkaistussa työssä on kappale kirjoittajan henkilökohtaisesta Kela-takaisinperinnästä ja nimetty moite Metropolialle. Suositus: poista.
- Version: 1.2 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: **A1 ratkaistu.** HIC kertoi todellisen kulukehityksen (100 → 300 Claude Maxin myötä → lähemmäs 600 Cloud Runin ym. myötä). Päivien tarkastelu paljasti ristiriidan juurisyyn: **Claude Max julkaistiin 9.4.2025 eli keskellä kautta 1**, ei kausien rajalla, joten kumpikaan lukupari ei ole väärä — johdanto mittaa saavutettua tasoa, johtopäätökset lähtötasoa/keskiarvoa. Korjausehdotus: vaihteluvälit 100–300 / 300–600 kaikkiin kolmeen paikkaan. Kirjattu **pakollinen seurausmuutos**: väite *"skaalautuvuutta ei saavutettu kulupiikillä"* ei kestä korjattuja lukuja (kulut kuusinkertaistuivat), joten se on muutettava absoluuttiseksi vertailuksi.
- Version: 1.1 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Lisätty **C-luokka — lähde- ja viitetarkistukset verkkohaulla** HIC:n hypoteesin perusteella (Gemini olisi voinut tuottaa lukuun 3 tekstiä jota ei olisi hyväksytty repoon). **Hypoteesi osui, mutta ei lukuun 3:** luvun 3 sääntelyteksti kesti tarkistuksen ja on poikkeuksellisen hyvin varauksin kirjoitettu. Heikot kohdat ovat johdannossa (McKinsey-lähdettä ei löydy, ja se on liitetty kilpailijahintaväitteeseen jota konsulttitalo ei julkaisisi) ja liitteessä 6 (SWD(2025) 836 on aito mutta se on **Digital** Omnibus, ei kestävyysraportointia). Kirjattu myös mitä tarkistettiin ja todettiin oikeaksi — ml. 61 % ESRS-vähennys ja 2040-tavoite, jota **ei saa päivittää** vaikka se on sittemmin edennyt.
- Version: 1.0 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Kirjattu HIC:n asettama v4.2:n laatimisrajaus (*"tekstin laatimishengessä"*, ei laajennuksia eikä päivityksiä myöhemmistä versioista) ja koottu ehdokaslista asiavirheistä yksittäin päätettäväksi. Lista on **ehdotus, ei toteutettu muutos** — jokainen kohta odottaa HIC:n erillistä päätöstä.

***

## Laatimisrajaus — HIC 25.07.2026

> *"V4.2 pitää tehdä tekstin laatimishengessä eikä sitä sovi korjata millään laajennuksella tai päivityksellä myöhemmistä versioista. Asiavirheet voinee korjata jos niitä on mutta kysy ne yksittäin."*

**Mitä tämä sulkee pois:**

| Ei sallittu | Miksi |
| ----------- | ----- |
| Sisällön laajentaminen | v4.2 on korjaus, ei uusi versio |
| Päivitykset `V3Thesis`-versioista (v3.8x) | Ne on kirjoitettu talletuksen **jälkeen**; niiden tuominen tekisi työstä eri työn kuin se, joka arvioitiin |
| Luvun 5.4 poisto tai muuttaminen patenttisyistä | Erikseen harkittu ja hylätty — `docs/legal/PRIOR_ART_DISCLOSURE_RECORD_2026-07-25.md` §7 |
| Tyylin, rakenteen tai argumentin uudelleenkirjoitus | "Laatimishenki" tarkoittaa työn omaa ääntä sen omalta ajalta |

**Mitä on sallittu:** ne viisi muotokorjausta, jotka kirjasto listasi (`KORJAUSPYYNTO_KIRJASTOLLE.md`), ja **erikseen hyväksytyt** asiavirheiden korjaukset alta.

## Kirjaston rooli — HIC:n linjaus 25.07.2026

> *"Heidän tehtävänsä on ylläpitää julkista opinnäytetyöpalvelua. Metropolia haluaa mahdollisimman hyvän tekstin."*
> *"Kirjasto teksti pitää olla korrekti mutta eivät he hylkää korjauksia."*

Tämä muuttaa korjauspyynnön sävyn, ja muutos on oikea. **Kyse ei ole palveluksen pyytämisestä vaan yhteisestä intressistä:** kirjaston tehtävä on ylläpitää laadukasta julkaista tutkintotietuetta, ja korjattu versio palvelee sitä tehtävää. Kirjasto havaitsi virheet itse ennen julkaisua ja tarjosi korjausmahdollisuutta oma-aloitteisesti — se ei ole vastapuoli.

**Käytännön seuraus kirjeeseen:** virheen omistajuus säilyy (*"virhe on minun"* on totta ja se kuuluu kirjeeseen), mutta anelevaa sävyä ei tarvita. Kirje on asiallinen ilmoitus korjatusta tiedostosta, ei pyyntö suopeudesta. `KORJAUSPYYNTO_KIRJASTOLLE.md` v3.1.

**Seuraus tälle listalle:** kynnys korjata on matalampi kuin aluksi oletettiin. Kohdat, jotka jätettäisiin väliin "ettei vaivata kirjastoa", kannattaa korjata — tiedosto vaihdetaan joka tapauksessa kerran.

## Miten tätä listaa luetaan

Jokainen kohta on **ehdotus**, ei tehty muutos. Kohdat on jaettu kahteen luokkaan:

- **A-luokka — sisäinen ristiriita.** Sama työ sanoo kahdessa paikassa eri asian. Toinen niistä on väärä; kumpi, sen tietää vain kirjoittaja.
- **B-luokka — tarkistettava väite.** Ei todistettavasti väärä, mutta sellainen jonka lukija voi kyseenalaistaa. Päätös voi hyvin olla "jätetään".

Merkitse jokaiseen `KORJAA` / `JÄTÄ` / `KORJAA NÄIN: …`.

---

## A-luokka — sisäiset ristiriidat

### A1. Kuukausikulut: johdanto sanoo 300/600 €, johtopäätökset 100/400 € — ✅ PÄÄTETTY 25.07.2026: VAIHTELUVÄLIT

| Sijainti | Teksti |
| -------- | ------ |
| Johdanto (luku 1.1) | *"…kuukausikulut ovat olleet **noin 300 euroa** ajalla 1.9.2024–31.8.2025 ja **noin 600 euroa** kuukaudessa lopputyön toteutuksen aikana"* |
| Johtopäätökset (5.7.6) | *"…kuukausikulut pysyivät **noin 100 €/kk** tasolla ajalla 1.9.2024-31.8.2025 ja **noin 400 €/kk** tasolla … 1.9.2025-30.4.2026"* |
| Keskeiset kontribuutiot (5.8) | *"…noin **100 €/kk** ajalla 1.9.2024-31.8.2025 ja noin **400 €/kk** ajalla 1.9.2025-30.4.2026"* |

#### HIC:n selvitys todellisesta kulukehityksestä

> *"Aluksi 100 € kuussa mutta claude max nostu kulut 300 ja google cloud run ym lähemmäs 600."*

Kulut eivät siis olleet kaksi tasoa vaan **kolmiportainen nousu**: 100 → 300 → 600 €/kk.

#### Päivien tarkastelu — tässä on ristiriidan syy

**Claude Max julkaistiin 9.4.2025** (Max 5× 100 $/kk, Max 20× 200 $/kk). Se osuu **kauden 1 sisään**, ei kausien rajalle:

| Kausi | Kesto | Kulukehitys |
| ----- | ----- | ----------- |
| **1.9.2024–31.8.2025** | 12 kk | 9/2024–3/2025 (7 kk) ≈ **100 €/kk** → Claude Max käyttöön 4/2025 → 4–8/2025 (5 kk) ≈ **300 €/kk** |
| **1.9.2025–30.4.2026** | 8 kk | lähtötaso ≈ 300 €/kk → Google Cloud Run ym. nostavat → **lähemmäs 600 €/kk** |

**Kumpikaan lukupari ei siis ole väärä — ne mittaavat eri asiaa.** Johdanto on ankkuroitu **saavutettuun tasoon** (300 / 600), johtopäätökset **lähtötasoon ja keskiarvoon** (100 / ~400). Kirjoittajat — tai kirjoituskerrat — valitsivat eri mittarin eivätkä kertoneet kumpaa käyttävät.

**Juurisyy on kausirajaus:** kausiraja 1.9.2025 on lukuvuosiraja, ei kulukäyrän taitekohta. Todellinen taitekohta on **huhtikuu 2025**, keskellä kautta 1. Siksi *mikään* yksittäinen luku per kausi ei ole rehellinen — vaihteluväli on.

**Ristiriitainen tarkistus, joka täsmää:** aiempi ~100 €/kk perustaso + Claude Max 20× (200 $ ≈ 185 €) ≈ **285 €/kk** ≈ ilmoitettu 300 €/kk. Kulukertomus on sisäisesti johdonmukainen.

#### Korjausehdotus — sama muotoilu kaikkiin kolmeen paikkaan

> *"…tekoälypalvelujen ja pilvipalvelujen kuukausikulut olivat **noin 100–300 euroa** ajalla 1.9.2024–31.8.2025 — nousu ajoittuu huhtikuuhun 2025, jolloin Claude Max otettiin käyttöön — ja **noin 300–600 euroa** ajalla 1.9.2025–30.4.2026, kun Google Cloud Run ja muut pilvipalvelut kasvattivat perustasoa."*

Kolme lukua muuttuu vaihteluväleiksi, ja syy nousuun mainitaan kerran. **Ei laajennus** — sama väite tarkemmin.

#### ⚠️ Yksi seurausmuutos, joka on pakko tehdä samalla

Johtopäätösten nykyinen virke sanoo:

> *"Tämä viittaa siihen, että skaalautuvuutta ei saavutettu **kulupiikillä** vaan arkkitehtuurivalinnoilla."*

Korjatuilla luvuilla kulut **kuusinkertaistuivat** (100 → 600). Väite "ei kulupiikkiä" ei enää kanna sellaisenaan.

**Rehellinen ja vahvempi muotoilu on absoluuttinen, ei suhteellinen:**

> *"…kuukausikulut pysyivät koko ajan satojen eurojen suuruusluokassa, kun vertailukelpoiset kaupalliset ratkaisut liikkuvat tuhansissa euroissa kuukaudessa."*

Tämä on totta, se säilyttää argumentin, ja se kestää sen että luvut kasvoivat. **Nykyinen muotoilu ei kestäisi korjattuja lukuja** — siksi tätä ei voi jättää tekemättä, jos A1 korjataan.

#### ✅ HIC:n päätös 25.07.2026

> *"Vaihteluväli on oikein"*

**Vaihteluvälimuotoilu hyväksytty** — 100–300 € ja 300–600 €, kaikkiin kolmeen paikkaan, syy nousuun mainittuna kerran.

**Seurausmuutos etenee samalla.** Se ei ole erillinen makuvalinta vaan looginen seuraus: kun luvut kertovat kuusinkertaistumisen, virke *"skaalautuvuutta ei saavutettu kulupiikillä"* on ristiriidassa oman taulukkonsa kanssa. Korjatut luvut ilman korjattua väitettä jättäisivät työhön **uuden** sisäisen ristiriidan — pahemman kuin se, joka nyt korjataan. Muotoilu *"pysyivät koko ajan satojen eurojen suuruusluokassa, kun vertailukelpoiset kaupalliset ratkaisut liikkuvat tuhansissa"* säilyttää argumentin ja kestää kasvaneet luvut. Jos tämä ei käy, kerro — muuten se tehdään A1:n mukana.

### A2. Työn rakenne -luku lupaa kymmenen lukua, työssä on viisi — ✅ PÄÄTETTY: KORJATAAN VIITEEN

> **HIC:** *"a2 5"* — työssä on viisi lukua; 1.6 kirjoitetaan sen mukaiseksi.

**Nykyinen 1.6:** *"…Luku 4 kuvaa DWS IQ -toimintamallin ja arkkitehtuurin suunnittelun neljällä kerrostasolla. Luku 5 dokumentoi MVP-vaiheen toteutuksen. **Luku 6** käsittelee dws10.com-verkkokauppakanavan integraation. **Luku 7** esittelee agentic commerce tuotantopolun. **Luku 8** esittää tulokset ja analyysit, ja **luku 9** sisältää pohdinnan, rajoitusten arvioinnin ja suositukset. **Luku 10** kokoaa johtopäätökset."*

**Todellinen rakenne** (sisällysluettelosta todennettuna):

| Luku | Sisältö |
| ---- | ------- |
| 1 | Johdanto |
| 2 | Teoreettinen viitekehys |
| 3 | Nykytila-analyysi — AI-maisema, kilpailuympäristö, asiakassegmentit, **ja** DWS IQ -toimintamallin ja arkkitehtuurin suunnittelu (3.4–3.7) |
| 4 | Toteutusvaihe |
| 5 | DWS10.com-verkkokaupan integraatio — sis. agentic commerce (5.4), tulokset (5.5), tutkimuskysymykset (5.6), pohdinta (5.7), kontribuutiot (5.8) |

**Korjausehdotus — korvaa 1.6:n loppuosa:**

> *"Luku 3 analysoi nykytilan: eurooppalaisen teollisen AI-maiseman, kilpailuympäristön ja asiakassegmentit sekä DWS IQ -toimintamallin ja arkkitehtuurin suunnittelun neljällä kerrostasolla. Luku 4 dokumentoi toteutusvaiheen. Luku 5 käsittelee dws10.com-verkkokaupan integraation ja agentic commerce -tuotantopolun sekä esittää tulokset, vastaukset tutkimuskysymyksiin, pohdinnan ja keskeiset kontribuutiot."*

**Teksti lyhenee, ei pitene** — kolme virkettä yhdeksi. Puhtaasti laatimishengen sisällä.

### A3. Alalukua 3.4.1 ei ole — ✅ PÄÄTETTY: KORJATAAN NUMEROINTI

> **HIC:** *"a3 korjaa"*

Sisällysluettelo etenee `3.4` → `3.4.2` → `3.4.3` → `3.5`. Uudelleennumerointi:

| Nykyinen | Korjattu |
| -------- | -------- |
| 3.4.2 Asiakaslupaus ja ROI-validointi | **3.4.1** |
| 3.4.3 Hallinto- ja varmennuskerros: Omnibus-yhteensopivuusmoottori | **3.4.2** |

**Ei lisätä puuttuvaa alalukua** — sisällön lisääminen olisi laajennus. Tarkista samalla, ettei tekstissä ole ristiviittauksia vanhoihin numeroihin.

### A4. Sama 82 % kahdessa eri vertailussa — ✅ PÄÄTETTY: KORJATAAN SWOT

> **HIC:** *"a4 korjaa swot"*

| Sijainti | Nykyinen | Toimenpide |
| -------- | -------- | ---------- |
| Tiivistelmä, luku 5.7.2 | *"82 % kustannusvähennys **verrattuna pelkkään pilveen**"* | säilyy — vastaa esitettyä laskelmaa |
| SWOT (5.7.1), Vahvuudet | *"kustannusjohtajuus (**82 % halvempi kuin kilpailijat**)"* | **korjataan** |

**Korjausehdotus:**

> *"…kustannusjohtajuus (82 % pienemmät ajonaikaiset kustannukset verrattuna pelkkään pilviarkkitehtuuriin)…"*

Luku pysyy, vertailukohta korjaantuu vastaamaan sitä laskelmaa, joka työssä tosiasiassa on. **Kilpailijavertailu ei katoa työstä** — se on omana kohtanaan luvussa 1 (ks. C1/C2, jossa se saa oikean perustan).

### A5. 25–350 € vs. 0–350 € — ✅ VAHVISTETTU 25.07.2026: jako kustannus/hinta

> **HIC:** *"a5 25-350"*

**Tarkistuksessa paljastui, ettei kyse ole yhdestä luvusta vaan kahdesta eri suureesta**, jotka käyttävät päällekkäisiä lukuja. Siksi pelkkä korvaaminen kaikkialla tuottaisi uuden virheen.

| Rivi | Nykyinen | Mikä suure | Toimenpide |
| ---- | -------- | ---------- | ---------- |
| Arkkitehtuurivertailu (Pilvi 555 / Reuna 10 / Hybridi) | **25–350 €/kk** | infrakustannus | ✅ jo oikein |
| Kehitysmalli-vertailu (MCP Hub + reuna) | **25–350 €/kk** | infrakustannus | ✅ jo oikein |
| TK2-vastaus: *"…alle 100 ms reunalatenssin ja 0–350 euron **kuukausikustannukset**"* | 0–350 | infrakustannus | 🔧 **→ 25–350** |
| SWOT-taulukko, Kustannusrakenne: *"0–350 €/kk **infra**, startup-krediitit"* | 0–350 | infrakustannus | 🔧 **→ 25–350** |
| Strategiataulukko, Ratkaisu-rivi: *"reunatekoäly (< 100 ms), 0–350 €/kk"* | 0–350 | infrakustannus | 🔧 **→ 25–350** |
| Omnibus-luku: *"Firehorse-**hintataso** 0–350 euroa kuukaudessa on kilpailukykyinen"* | 0–350 | **asiakashinta** | ⛔ **säilytä 0–350** |
| Tuotekatalogi: *"matalan kynnyksen **aloituksen** (0–350 euroa kuukaudessa)"* | 0–350 | **asiakashinta** | ⛔ **säilytä 0–350** |

**Miksi kaksi viimeistä säilyvät.** Työn oma hinnoittelumalli määrittelee **Freemium 0 €** ja **Compliance-taso 350 €/kk**. Asiakkaan maksama hinta alkaa siis aidosti nollasta. Infrastruktuurin ajokustannus ei — se on 25 €/kk pohjalla. **Nämä ovat eri asioita, ja niiden yhdistäminen olisi juuri se virhe, jota A5 korjaa.**

#### ✅ HIC:n vahvistus 25.07.2026

> *"Vahvistan"*

**Jako vahvistettu:** 25–350 €/kk kustannuksiin (kolme korjattavaa kohtaa), 0–350 €/kk asiakashintaan (kaksi kohtaa säilyy ennallaan). Hinnoittelumallin Freemium-riviin ei kosketa.

**Toteutuksessa muistettava:** korjaa **vain** ne kolme kohtaa, joissa lukee "kustannus" tai "infra". Jos korjaisit hakemalla ja korvaamalla kaikki "0–350", rikkoisit kaksi oikeaa kohtaa.

### A6. Alustaohjelmistojen lukumäärä 2, kuvauksessa neljä versiota — ✅ PÄÄTETTY: KORJATAAN

> **HIC:** *"A6 korjaa"*

Tuotekatalogitaulukko: *"Alustaohjelmistot | **2** | 4 999–6 995 €"*, kuvauksessa neljä versiota (DWS 3 · DWS 4 · DWS IQ v5 · DWS IQ v6).

#### ✅ HIC:n päätös 25.07.2026

> *"4 alustaohjelmistoa"*

**Lukumäärä 2 → 4.** Kuvaus (DWS 3 · DWS 4 · DWS IQ v5 · DWS IQ v6) on oikein ja säilyy ennallaan; taulukon luku oli väärä. Yhden merkin korjaus.

---

## B-luokka — tarkistettavat väitteet

### B1. Nimetyt asiakkaat ja €10k MRR — ✅ PÄÄTETTY 25.07.2026: POISTETAAN

> **HIC:** *"Poista nimetyt asiakkaat ja summa"*

Alla kaikki esiintymät ja korvaava muotoilu. **Korvaus, ei pelkkä poisto** — virkkeiden tehtävä säilyy, väitteestä poistuvat nimet ja luku.

| # | Sijainti | Nykyinen | Korvaava |
| - | -------- | -------- | -------- |
| 1 | EN-tiivistelmä | *"**€10k MRR** during pilot phase from logistics customers"* | poista koko kohta löydöslistasta — **tämä ratkaisee samalla A7:n** (tiivistelmät menevät synkkaan) |
| 2 | Menetelmät ja aineisto | *"Asiakashaastattelut ja data (**Uber, Bolt, Kela — €10k MRR**)"* | *"Asiakashaastattelut ja pilottiaineisto (logistiikka-alan pilottiasiakkaat)"* |
| 3 | Kolmivaiheinen käyttöönotto | *"Ensimmäisissä asiakaskeskusteluissa **NCC:n ja T2H:n** kanssa kävi ilmi…"* | *"Ensimmäisissä asiakaskeskusteluissa rakennusalan pilottiorganisaatioiden kanssa kävi ilmi…"* |
| 4 | Pilottitulokset (5.x) | *"Logistiikka-asiakkaat (**Uber Taksi Helsinki, Bolt, Kela**) tuottivat ensimmäisenä konkreettisia tuloksia: **10 000 euron** kuukausittainen toistuva liikevaihto pilotin aikana. Rakennusasiakkaat (**NCC, T2H**) toivat viisi projektia ja **50 miljoonan euron** projektiportfolion."* | *"Logistiikka-alan pilotit tuottivat ensimmäisenä konkreettisia tuloksia ja alustan ensimmäisen toistuvan liikevaihdon. Rakennusalan pilotit toivat viisi projektia."* |
| 5 | TK1-vastaus | *"…€10k MRR pilotista (**Uber, Bolt, Kela**) sekä 8 vertikaalipohjaa…"* | *"…pilottien tuottama toistuva liikevaihto sekä 8 vertikaalipohjaa…"* |
| 6 | SWOT, Vahvuudet | *"Täydellinen toteutus (live-järjestelmä **10 000 euron MRR:llä**)"* | *"Täydellinen toteutus (tuotannossa oleva, maksavien pilottien käyttämä järjestelmä)"* |

#### ⬜ Yksi kohta vaatii vielä päätöksen: kohdeasiakaslista

Luku 3.3 (Asiakassegmentit) luettelee:

> *"Tason 1 kriittiset teollisuudet (välitön myyntifokus) sisältävät rakentamisen (NCC, Skanska, T2H, Vinci), logistiikan (Uber, Bolt, Kela, DB Schenker), valmistuksen (Kone, Wärtsilä, ABB) ja energian (Fortum, Helen, Vattenfall)."*

**Tämä on eri asia kuin yllä olevat kuusi.** Se ei väitä näitä asiakkaiksi vaan **kohdesegmentin esimerkeiksi** — julkisten yhtiöiden nimeäminen markkina-analyysin esimerkkeinä on tavanomaista eikä vaadi lupaa.

**Ongelma on kuitenkin, että samat nimet esiintyvät työssä molemmissa rooleissa.** Kun Uber, Bolt ja Kela ovat toisaalla "logistiikka-asiakkaita" ja täällä "välitön myyntifokus", lukija ei erota kumpi on kumpi — ja juuri se sekoittuminen synnytti alkuperäisen ongelman.

#### ✅ HIC:n päätös 25.07.2026

> *"3.3 nimet pois"*

**Kaikki yritysnimet poistetaan myös luvusta 3.3.** Jäljelle jäävät toimialat, jotka kantavat segmentoinnin ilman yksittäisiä yrityksiä:

> *"Tason 1 kriittiset teollisuudet (välitön myyntifokus) sisältävät rakentamisen, logistiikan, valmistuksen ja energian."*

Poistuvat: NCC, Skanska, T2H, Vinci, Uber, Bolt, Kela, DB Schenker, Kone, Wärtsilä, ABB, Fortum, Helen, Vattenfall.

**Seuraus koko työhön:** poistojen jälkeen **työssä ei ole yhtään yritysnimeä asiakas- eikä kohdeasiakasroolissa.** Se on siisti lopputulos — ei jäljelle jäävää tulkinnanvaraa siitä, kuka oli asiakas ja kuka esimerkki.

#### ⚠️ Mitä EI poisteta — teknologiatoimittajat jäävät

Tämä on tarkistettava toteutuksessa, koska "poista yritysnimet" voi mennä liian pitkälle. **Arkkitehtuurin toimittajat ovat työn sisältöä eivätkä asiakasväitteitä**, ja ne jäävät:

| Jää | Miksi |
| --- | ----- |
| Google Cloud Run, Google Merchant Center | toteutusalusta |
| NVIDIA Jetson Orin Nano | mitattu laitteisto |
| Cloudflare Pages, Supabase, Proton, Groq | toteutuspino |
| Revolut, Stripe | maksuintegraatiot, kuvattu luvussa 5.4 |

Näiden nimeäminen on välttämätöntä — ilman niitä arkkitehtuurikuvaus ei ole toistettavissa, mikä on opinnäytetyön perusvaatimus.

**Kilpailijanimet** (Atlassian, SAP, Siemens) poistuvat C1/C2:n korvaavan virkkeen myötä, koska korjattu muotoilu ei nimeä ketään — se puhuu hinnoittelurakenteesta.

### B2. Kela "logistiikka-asiakkaana" — ✅ PÄÄTETTY: KELA POIS

> **HIC:** *"b2 kela pois"*

Ratkeaa B1:n mukana: kun *"Logistiikka-asiakkaat (Uber Taksi Helsinki, Bolt, Kela)"* korvataan muodolla *"logistiikka-alan pilotit"*, Kela poistuu tästä kohdasta itsestään.

**Tarkista lisäksi kolmas esiintymä:** luvun 3.3 kohdesegmenttilista sisältää *"logistiikan (Uber, Bolt, **Kela**, DB Schenker)"*. **Kela poistetaan myös sieltä** — se ei ole logistiikkayritys, ja sen mukanaolo segmenttiesimerkkinä on virhe riippumatta siitä, mitä 3.3:n muille nimille päätetään.

Poiston jälkeen sana "Kela" ei esiinny työssä lainkaan (D1 poisti kolmannen esiintymän).

### B3. Liitteessä 6 näkyy sisäinen versiometatieto — ✅ PÄÄTETTY: POISTETAAN

> **HIC:** *"b3 meta pois"*

Poistettava rivi liitteestä 6:

> *"Analyysidokumentti — Master Thesis FI V3.1 & DWS IQ 6/7 Platform. Risto Anton Päärni — Lifetime Oy. 12. helmikuuta 2026 Versio 3.2 — ETS2 lykkäys 2028, CBAM definitiivivaihe, 2040-tavoite 90 %, 3 liitettä: syvennykset + poliittinen analyysi + digitaalinen suvereniteetti."*

Koko rivi on kirjoitusprosessin metatietoa — kaksi eri versionumeroa, sisäinen tiedostoviite ja muutoslokimerkintä. **Poista kokonaan.** Liitteen asiasisältö ei ole tämän rivin varassa.

### B4. 2040-tavoite kuvattu hyväksytyksi — päätös: ⬜

Liitteessä 6: *"**2040-tavoite 90 %:** Hyväksytty helmikuussa 2026 strategisena suuntaviivana"*, ja samassa taulukossa sen oma riskiarvio sanoo *"Korkean riskin väite: Tavoite on poliittinen suuntaviiva; yksityiskohdat voivat täsmentyä trilogissa."*

Työ siis merkitsee väitteen itse korkeariskiseksi ja esittää sen silti hyväksyttynä. **Tämä on itse asiassa työn ansio** — se on rehellinen omasta epävarmuudestaan.

**Suositus: jätä.** Ei ole virhe; se on asianmukaisesti merkitty varaus. Mainittu tässä vain, ettei se jää huomaamatta myöhemmin ja näytä siltä että se ohitettiin.

---

## C-luokka — lähde- ja viitetarkistukset (verkkohaku 25.07.2026)

HIC:n hypoteesi: *"Myös geminillä on tietoa dws hankkeesta ja on uskottavaa sen kyenneen luomaan lukuun 3 tekstiä jota ei olisi kenties hyväksytty repoon."*

**Hypoteesi osui, mutta ei lukuun 3.** Luvun 3 sääntelyteksti kesti tarkistuksen hyvin — se on jopa poikkeuksellisen huolellisesti varauksin kirjoitettu (*"tulee varmistaa CBAM-asetuksesta … ennen kuin niitä käytetään numeerisina ankkureina"*, *"julkisessa keskustelussa usein esitetty suuruusluokka"*). Heikot kohdat ovat **luvussa 1 (johdanto)** ja **liitteessä 6**.

### C1. McKinsey-lähdettä ei löydy — ✅ PÄÄTETTY: VAIHDETAAN

> **HIC:** *"C1 etsi toinen evidenssi"*

Lähdeluettelo: *"McKinsey & Company 2024. **The State of AI in Construction: Adoption, Impact, and Future Outlook.**"* — tämännimistä julkaisua ei löydy. Se on liitetty virkkeeseen, joka esittää **kaksi eri väitettä**. Ne tarvitsevat eri evidenssin.

#### Väite 1: pilvilatenssi 500–2 000 ms

**Korvaava evidenssi on jo työssä itsessään, kaksi sivua myöhemmin:**

> *"Ensimmäisten **työmaasimulaatioiden** aikana huomattiin, että 500–2 000 millisekunnin latenssi ei riitä, kun rakennustyömaalla pitää havaita turvallisuuspoikkeama ja hälyttää reaaliajassa. NVIDIA Jetson Orin Nano -reunalaitteen testaus osoitti, että alle 100 millisekunnin vasteaika on mahdollinen paikallisella prosessoinnilla."*

Luku on **oman mittauksen tulos**, ei kirjallisuudesta lainattu. Se on opinnäytetyössä paras mahdollinen lähde — empiirinen havainto omasta koeasetelmasta.

**Ulkopuolinen tarkistus tukee sitä, kun mitta täsmennetään:** julkaistut LLM-rajapintojen *time-to-first-token* -arvot ovat tyypillisesti **50–500 ms**, eli selvästi alle työssä esitetyn haarukan. Työn luku ei kuitenkaan ole TTFT vaan **päästä päähän -vasteaika**, joka sisältää verkon edestakaisen viiveen, jonoutumisen ja koko vastauksen generoinnin. Erot ovat siis näennäisiä vain, jos mittaa ei kerrota.

**Korjaus:**
- Poista McKinsey-viittaus.
- Merkitse luku omaksi havainnoksi: *"omissa työmaasimulaatioissa mitattu päästä päähän -vasteaika oli 500–2 000 ms"*.
- **Täsmennä mitta** — "päästä päähän, sisältäen verkkoviiveen" — jotta lukija ei vertaa sitä TTFT-lukuihin.

Tämä on **vahvempi** kuin nykyinen: keksitty toissijainen lähde korvautuu omalla mittauksella, joka on työn oma kontribuutio.

#### Väite 2: kilpailijoiden hinnat

Tarkistettu, mitä näistä on julkisesti lähteistettävissä:

| Toimittaja | Julkinen hinta? | Mitä löytyy |
| ---------- | --------------- | ----------- |
| **Atlassian Rovo** | ✅ kyllä | Erillistuotteena **20 $/käyttäjä/kk** (vuosilaskutus), 24 $/kk kuukausilaskutuksella; sittemmin sisällytetty Premium/Enterprise-tilauksiin. Väitetty *"yli 1 400 €/kk"* ⇒ **noin 70 käyttäjää** (ks. C2). |
| **Siemens Insights Hub** | ✅ osittain | Siemensin oma käyttöperusteinen hinnasto: **106 €/kk per asset** yli sovitun rajan (850 €/v). Väitetty *"yli 2 000 €/kk"* ⇒ **noin 19 assettia**. |
| **SAP Sustainability Control Tower** | ❌ ei | *"Price upon request"*, hinnoittelu per aktiivinen käyttäjä per vuosi, **minimi 10 käyttäjää**, edellyttää S/4HANA Cloud -lisenssiä. **Julkista listahintaa ei ole.** |

**Tässä on kaksi asiaa, jotka kannattaa erottaa:**

1. **Kaikki kolme ovat per-käyttäjä- tai per-asset-tuotteita.** Työ ilmoittaa niistä kuukausisumman kertomatta yksikkömäärää ja rinnastaa sen kiinteään 0–350 €/kk -hintaan. **Vertailu ei ole väärä, mutta se on epäkelpo ilman yksikköä.**
2. **SAP:lla ei ole julkista hintaa lainkaan.** Jos luku 4 000 € on peräisin saadusta tarjouksesta, se on **pätevä primäärilähde** ja se pitää merkitä sellaiseksi. Jos se on arvio, se pitää merkitä arvioksi.

**Korjausehdotus — yksi virke:**

> *"Kilpailija-analyysin perusteella vastaavat ratkaisut ovat per-käyttäjä- tai per-asset-hinnoiteltuja: Atlassian Rovo 20 $/käyttäjä/kk (noin 70 käyttäjän organisaatiossa yli 1 400 €/kk), Siemens Insights Hub 106 €/kk per asset (noin 19 assettia ylittää 2 000 €/kk), ja SAP Sustainability Control Tower, jolle **julkista listahintaa ei ole saatavilla** (hinnoittelu per aktiivinen käyttäjä, minimi 10 käyttäjää). DWS IQ:n kiinteä hinnoittelu on siten rakenteeltaan eri: kustannus ei kasva käyttäjä- tai laitemäärän mukana."*

**Tämä on olennaisesti parempi argumentti kuin alkuperäinen.** Alkuperäinen sanoi "kilpailijat ovat kalliita" ja nojasi olemattomaan lähteeseen. Korjattu sanoo *"kilpailijoiden kustannus skaalautuu käyttäjämäärän mukana, meidän ei"* — se on rakenteellinen väite, se on lähteistettävissä, ja **se on se väite, joka itse asiassa on totta ja myyvä.**

Lähteet: Atlassianin hinnoittelumuutokset (TechTarget 2025–26) · Siemens *Price List for Offerings with Usage-based Fees* v2.2 · SAP Sustainability Control Tower Pricing (sap.com).

### C2. Tarvitaanko tarkka hintatieto lainkaan? — ✅ VASTAUS: EI TARVITA

> **HIC:** *"c2 tarvitaanko tarkka hintatieto?"*

**Ei tarvita, ja ilman sitä kappale on parempi.** Tämä on paras yksittäinen oivallus koko listalla, joten perustelu kokonaan:

**1. Tarkat luvut eivät kanna väitettä, jota niillä yritetään tukea.** Kappaleen oma premissi on *"…erityisesti kun käyttöönotto pitää ulottaa useille työmaille, tehtaille tai yksiköille."* Se on **skaalautumisväite**, ei hintatasoväite. Yksittäinen euromäärä ei kerro siitä mitään; hinnoittelun **rakenne** kertoo kaiken.

**2. Jokainen luku vaatii puolustuksen, jota ei ole.** Atlassian ja Siemens ovat per-yksikkö-hinnoiteltuja, joten kokonaissumma riippuu yksikkömäärästä, jota työssä ei kerrota. **SAP ei julkaise hintaa lainkaan** — se luku ei ole lähteistettävissä millään tavalla, ellei se ole saatu tarjous. Kolme lukua, kolme eri ongelmaa.

**3. Luvut vanhenevat, rakenne ei.** Rovon hinnoittelu on jo muuttunut (erillistuotteesta sisällytetyksi tilauksiin) sen jälkeen kun työ kirjoitettiin. Pysyvässä julkisessa dokumentissa oleva vanhentunut hintataulukko on jatkuva rasite; rakenteellinen havainto pitää paikkansa vuosia.

#### Korjausehdotus — korvaa koko virke, luvut pois

> *"Perinteiset SaaS-ratkaisut eivät vastaa monien keskisuurten ja suurten teollisuusyritysten tarpeisiin kustannustehokkaasti, erityisesti kun käyttöönotto pitää ulottaa useille työmaille, tehtaille tai yksiköille. **Kilpailija-analyysin perusteella vastaavat ratkaisut hinnoitellaan käyttäjä- tai laitekohtaisesti, jolloin kokonaiskustannus kasvaa käyttöönoton laajuuden mukana. DWS IQ:n hinnoittelu on rakenteeltaan toisenlainen: kustannus ei kasva käyttäjä- eikä laitemäärän mukana.** Lisäksi pelkkä pilvipohjaisuus tuottaa **omissa työmaasimulaatioissa mitatun 500–2 000 millisekunnin päästä päähän -vasteajan**, mikä ei riitä reaaliaikaiseen työmaavalvontaan."*

**Mitä tämä ratkaisee kerralla:** C1 (keksitty McKinsey-lähde poistuu, koska mitään lainattua ei enää ole), C2 (ei lukuja joita pitäisi perustella), ja latenssiväite saa oikean lähteen — oman mittauksesi.

**Yksi virke, kolme ongelmaa pois, ja argumentti muuttuu myyvemmäksi.** "Kilpailijat ovat kalliita" on mielipide. "Kilpailijoiden kustannus skaalautuu käyttöönoton mukana, meidän ei" on rakenteellinen väite, joka pitää paikkansa ja jonka lukija voi itse tarkistaa kenen tahansa per-seat-toimittajan hinnastosta.

### C3. SWD(2025) 836 on olemassa, mutta se on eri Omnibus — ✅ PÄÄTETTY: KORJATAAN

Liite 6 käyttää lähteenä *"Komission yksiköiden valmisteluasiakirja SWD(2025) 836 (**Digital and Sustainability Omnibus**)"* tukemaan **25 % / 35 % hallinnollisen taakan vähennystavoitetta**.

**Asiakirja on aito** — SWD(2025) 836 final, Bryssel **19.11.2025** — mutta se on **Digital Omnibus**: tietosuoja- ja ePrivacy-säännöstö, tekoäly, kyberturvallisuus ja alustasääntely. **Se ei käsittele kestävyysraportointia.** Nimi *"Digital and Sustainability Omnibus"* yhdistää kaksi eri pakettia yhdeksi.

> **HIC:** *"c3 c4 korjaa"*

**Korjaus kaksiosainen:**

1. **Nimi:** *"SWD(2025) 836 (Digital and Sustainability Omnibus)"* → *"SWD(2025) 836 (Digital Omnibus)"*.
2. **Merkintä:** sama rivi merkitsee itsensä *"Validointi: Luvut ovat linjassa komission yksinkertaistamisstrategian kanssa"*. Kun lähde ei käsittele kestävyysraportointia, merkintä on liian vahva. Vaihda muotoon, joka kertoo mihin lähde tosiasiassa riittää: *"Suuntaa-antava: luku on linjassa komission yleisen taakanvähennystavoitteen kanssa; kestävyysraportoinnin osalta lähde on eri."*

Vaihtoehto, jos haluat pitää sen yksinkertaisena: **poista koko rivi**. Se ei kanna liitteen argumenttia, ja poisto on varmasti oikein.

### C4. Rakennusalan 36–40 % — ✅ PÄÄTETTY: KORJATAAN

Englanninkielinen tiivistelmä: *"the construction sector, which accounts for **36–40 % of EU lifecycle emissions**"*.

Vakiintuneet luvut ovat **36 % päästöistä ja 40 % energiankulutuksesta**; elinkaarinäkökulmasta rakennukset ovat noin 40 % EU:n CO₂-päästöistä. Väli "36–40 %" yhdistää päästö- ja energialuvun yhdeksi haarukaksi.

> **HIC:** *"c3 c4 korjaa"*

**Korjaus:** erota luvut toisistaan sen sijaan että ne esitetään haarukkana:

> *"…the construction and buildings sector, which accounts for **approximately 36 % of EU CO₂ emissions and 40 % of energy consumption**…"*

Molemmat luvut ovat vakiintuneita ja lähteistettävissä erikseen; haarukka "36–40 %" oli ainoa ongelma, koska se esitti kaksi eri suuretta yhtenä.

### Tarkistettu ja **oikein** — ei korjattavaa

| Väite | Tarkistus |
| ----- | --------- |
| ESRS-datapisteiden vähennys **n. 61 %** | **Oikein.** EFRAG vähensi pakollisia datapisteitä 61 % (tekninen ohjeistus komissiolle 3.12.2025); kokonaisvähennys yli 70 % vapaaehtoiset mukaan lukien. |
| EU:n ilmastolaki 2021/1119, **−55 % / 2030 / 1990-taso** | Oikein, myös artiklaviittaukset. |
| **2040-tavoite 90 %**, merkitty "hyväksytty helmikuussa 2026" + korkean riskin varaus | **Oikein kirjoitushetkellä.** Parlamentti hyväksyi 9.–10.2.2026; neuvoston lopullinen hyväksyntä 5.3.2026 ja voimaantulo 4/2026 tapahtuivat vasta myöhemmin. **Älä päivitä** — se olisi myöhemmän tiedon tuomista, jonka laatimisrajaus kieltää. Varaus oli oikea silloin. |
| EU ETS laajennus meriliikenteeseen 2024 | Oikein. |
| SWD(2025) 836 on olemassa | Oikein (ks. C3 nimestä). |

## 🔴 D1. Henkilökohtainen Kela-maininta — ✅ PÄÄTETTY 25.07.2026: POISTETAAN KOKONAAN

**Tätä ei ollut listalla eikä sitä kysytty.** Se löytyi asiakasnimien hakua tehtäessä ja se on pakko nostaa esiin (Rule 12, fail loud).

Luvussa 3.4.2:n tienoilla, keskellä asiakaslupauksen ja ROI-validoinnin käsittelyä, on kappale:

> *"Työn valmistuminen on kestänyt useamman vuoden. **Kela jo päättikin periä aiempien vuosien kelatuet takaisinperintänä eikä siinä Metropolian ponnistelut vaikuttaneet mitään.** Mutta olen kuitenkin piestynäkin onnellinen tämän työn tuloksista."*

**Mitä tässä on:**

1. **Kirjoittajan henkilökohtainen opintotukiasia** — takaisinperintäpäätös — pysyvässä, julkisessa, indeksoidussa tutkintotietueessa. Se on arkaluonteista henkilökohtaista taloustietoa, eikä se poistu Theseuksesta.
2. **Nimetty moite oppilaitokselle** (*"eikä siinä Metropolian ponnistelut vaikuttaneet mitään"*) — juuri sille laitokselle, jolta nyt pyydetään korjausta.
3. **Rekisterin vaihdos.** Ympäröivä teksti on asiatyylistä ROI-analyysiä; tämä kappale on ensimmäisessä persoonassa ja tunnepitoinen. Se on todennäköisesti muistiinpano, joka jäi tekstiin.
4. **Kolmas merkitys sanalle "Kela"** samassa työssä: logistiikka-asiakkaana, kohdesegmentin esimerkkinä, ja tässä opintotuen myöntäjänä.
5. *"piestynäkin"* on lisäksi ilmeinen kirjoitusvirhe.

**Suositus: poista koko kappale.** Perustelut, miksi tämä ei ole harkintakysymys samalla tavalla kuin muut kohdat:

- Se **ei kuulu työn argumenttiin** millään tavalla — poisto ei vie mitään pois sisällöstä eikä ole laajennus, vaan puhtain mahdollinen "laatimishengen" palautus.
- Se on **ainoa kohta koko työssä, joka voi vahingoittaa kirjoittajaa henkilökohtaisesti**, ja se on julkinen 10.7.2026 alkaen.
- Korjauspyyntö menee **Metropolialle**, jota tämä kappale moittii nimeltä. Sen poistaminen samalla kertaa on sekä oikein että tahdikasta.

**Tämä on koko listan tärkein yksittäinen korjaus.** Nimivirhe on kiusallinen; tämä on henkilökohtainen.

### ✅ HIC:n päätös 25.07.2026

> *"Poista koko kappale"*

**Koko kappale poistetaan** — ei uudelleenmuotoilua, ei lyhentämistä. Kolme virkettä poistuvat kokonaan:

> *"Työn valmistuminen on kestänyt useamman vuoden. Kela jo päättikin periä aiempien vuosien kelatuet takaisinperintänä eikä siinä Metropolian ponnistelut vaikuttaneet mitään. Mutta olen kuitenkin piestynäkin onnellinen tämän työn tuloksista."*

**Tarkistettava poiston yhteydessä:** varmista, ettei edeltävä tai seuraava kappale viittaa tähän (esim. sidesanalla). Poiston jälkeen kohdan tulee lukea saumattomasti — muuten poisto näkyy.

### Seuraus korjauspyyntöön — kirjettä on muutettava

Kirjeen nykyinen virke *"Työn sisältöön, tuloksiin tai johtopäätöksiin ei ole tehty muutoksia"* **ei enää pidä paikkaansa**, kun D1 ja B1 poistavat tekstiä. Se on korjattava, ei kierrettävä: kirje kertoo mitä poistettiin ja miksi. Kaksi poistoa ovat molemmat sellaisia, joita kirjasto ei kyseenalaista — kolmansien osapuolten nimet ja aiheeseen kuulumaton kappale — mutta niistä on kerrottava. `KORJAUSPYYNTO_KIRJASTOLLE.md` päivitetty v2.1.

## Mitä listalla ei ole

Tarkistettu ja **todettu johdonmukaiseksi** — ei siis korjattavaa:

- Takaisinmaksuaika: *2 kuukautta* (pyöristetty) ja *1,95 kuukautta* (laskettu) ovat sama luku
- Automaatiotaulukon prosentit (96 % / 99 % / 80 % / 94 %) vastaavat annettuja lähtö- ja loppuarvoja
- Tavoite/toteuma-parit (+50 %→+62 %, −50 %→−73 %)
- 15 300 $ startup-krediitit, −55 % 2030, 61 % ESRS-vähennys, 16 toimialaa, alle 100 ms reunalatenssi — esiintyvät johdonmukaisesti kaikkialla

## ✅ Korjaushuomautus v4.2:n loppuun — päätetty 25.07.2026

> **HIC:** *"Ehdotan korjausliitettä version 4.2 loppuun jos kerrotaan alkuperäisen version virheen syyt ja riveittäin tehdyt korjaukset viittausnumeroin"*

**Kannatettu ja laadittu:** `V42_KORJAUSHUOMAUTUS.md` sisältää valmiin, sellaisenaan liitettävän tekstin (18 numeroitua korjausta + syyt).

**Kolme suunnitteluratkaisua, jotka poikkeavat ehdotuksesta — perustelut tiedostossa:**

1. **Huomautus ei saa toistaa sitä, minkä korjaus poistaa.** B1 ja D1 ovat poistoja arkaluonteisesta syystä; jos huomautus lainaisi poistettua tekstiä tai luettelisi nimet, se julkaisisi ne uudelleen samassa pysyvässä dokumentissa. Poistot kuvataan **luokkatasolla**.
2. **Viittaus lukuihin, ei riveihin.** Rivinumerot siirtyvät heti kun korjaukset muuttavat sivutusta — huomautus olisi virheellinen sillä hetkellä kun se laaditaan. Juokseva numero + luvun nimi antaa saman jäljitettävyyden ja pysyy oikeana.
3. **Numeroimaton osio, ei "Liite 9".** Liitteeksi numerointi muuttaisi liitteiden määrän kahdeksasta yhdeksään — ja juuri se luku on yksi korjattavista kohdista. Korjaus rikkoisi itsensä.

**Seuraus:** kirje kevenee (v3.2) ja viittaa huomautukseen. **Sivumäärä lasketaan vasta kun huomautus on paikallaan.**

## Työjärjestys

1. HIC päättää kohdat A1–A7 ja B1–B4 yksitellen.
2. Hyväksytyt korjaukset + kirjaston viisi muotokorjausta tehdään `V41`:een → **v4.2**.
3. PDF-vienti.
4. Kirje `kirjasto@metropolia.fi` (`KORJAUSPYYNTO_KIRJASTOLLE.md`) — **päivitä kirjeen kohta "Mitä korjatussa versiossa on muutettu" vastaamaan lopullista päätöslistaa.** Jos asiavirheitä korjataan, kirje ei voi enää sanoa pelkästään "muutokset koskevat etu- ja tiivistelmäsivuja".
