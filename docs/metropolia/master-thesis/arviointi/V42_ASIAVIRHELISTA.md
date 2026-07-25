# v4.2 — laatimisrajaus ja asiavirhelista päätettäväksi

***

# VERSION AND AGENT HISTORY

Version: 1.3

Sessions & Modifications:

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

### A2. Työn rakenne -luku lupaa kymmenen lukua, työssä on viisi — päätös: ⬜

Luku 1.6 (Työn rakenne) sanoo:

> *"Luku 5 dokumentoi MVP-vaiheen toteutuksen. **Luku 6** käsittelee dws10.com-verkkokauppakanavan integraation. **Luku 7** esittelee agentic commerce tuotantopolun. **Luku 8** esittää tulokset ja analyysit, ja **luku 9** sisältää pohdinnan… **Luku 10** kokoaa johtopäätökset."*

Todellinen rakenne: työ päättyy lukuun 5. Lupauksen luvut 6–10 ovat todellisuudessa alalukuja 5.4, 5.5, 5.7 ja 5.7.6, ja luku 4 (arkkitehtuurin suunnittelu) on alaluku 3.4.

**Tämä on ainoa kohta työssä, joka ohjaa lukijaa aktiivisesti väärään paikkaan.** Arvioinnin matalin osa-arvosana oli *"Raportin viestivyys, kieli ja ulkoasu"* (3,75) — tämä on todennäköisesti yksi syy siihen.

**Suositus: korjaa.** Kirjoita 1.6 vastaamaan todellista rakennetta. Se on yksi kappale eikä laajenna työtä.

### A3. Alalukua 3.4.1 ei ole — päätös: ⬜

Sisällysluettelo etenee `3.4` → `3.4.2 Asiakaslupaus ja ROI-validointi`. Numerointi hyppää yli 3.4.1:n.

**Suositus: korjaa numerointi** (3.4.2 → 3.4.1 ja seuraavat vastaavasti), **älä lisää puuttuvaa alalukua** — sisällön lisääminen olisi laajennus.

### A4. Sama 82 % kahdessa eri vertailussa — päätös: ⬜

| Sijainti | Mihin verrataan |
| -------- | --------------- |
| Tiivistelmä, luku 5.7.2 | *"82 % kustannusvähennys **verrattuna pelkkään pilveen**"* |
| SWOT (5.7.1) | *"kustannusjohtajuus (**82 % halvempi kuin kilpailijat**)"* |

Sama luku esitetään kerran arkkitehtuurivertailuna ja kerran kilpailijavertailuna. Ne eivät ole sama asia, eikä sama luku voi olla molempien vastaus muuten kuin sattumalta.

**Suositus: korjaa SWOT-maininta** muotoon, joka vastaa laskelmaa (pilvi vs. reuna). Kilpailijaväite ei perustu esitettyyn laskelmaan.

### A5. Hybridikonfiguraation hinta: 25–350 € vs. 0–350 € — päätös: ⬜

Arkkitehtuurivertailun taulukko sanoo hybridille **25–350 €/kk**. Neljässä muussa kohdassa (kilpailukykyväite, TK2-vastaus, SWOT-taulukko, tuotekatalogi) lukee **0–350 €/kk**.

**Suositus: korjaa yhtenäiseksi.** Jos 0 € viittaa freemium-tasoon, taulukon 25 € on oikea tekninen luku ja markkinointimuotoilu 0–350 on eri asia — silloin riittää täsmennys yhteen paikkaan. Sinä tiedät kumpi.

### A6. Alustaohjelmistojen lukumäärä 2, kuvauksessa neljä versiota — päätös: ⬜

Tuotekatalogitaulukko: *"Alustaohjelmistot | **2** | 4 999–6 995 €"*, mutta saman rivin kuvaus luettelee **neljä**: DWS 3 (2019), DWS 4 (2022), DWS IQ v5 (2023), DWS IQ v6 (2025).

**Suositus: korjaa luku** vastaamaan sitä, montako on **myynnissä** (jos 2 on oikein, kuvaus listaa historian — täsmennä se yhdellä sanalla).

### A7. Tiivistelmät eivät kerro samoja löydöksiä — päätös: ⬜

Englanninkielinen tiivistelmä listaa neljä löydöstä: takaisinmaksu, 82 %, **€10k MRR**, +62 %. Suomenkielinen listaa kolme — **MRR puuttuu**.

Tiivistelmien tulisi vastata toisiaan (kirjaston yleishuomio *"tekstit pitäisi olla synkassa opinnäytteen sisällä"*).

**Suositus: korjaa** — lisää MRR suomenkieliseen **tai** poista englanninkielisestä. Kytkeytyy kohtaan B1 alla: jos MRR-väitettä muutetaan, muuta molemmat.

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

**Suositus: säilytä lista, mutta täsmennä otsikointi** — *"kohdesegmentit ja niiden edustavat toimijat"* eikä *"kohdeasiakkaat … välitön myyntifokus"*. Kun kohdat 1–6 on korjattu, nimet esiintyvät enää tässä yhdessä roolissa eikä sekaannusta synny. **Vaihtoehto:** poista nimet tästäkin ja jätä toimialat — turvallisin, mutta hävittää markkina-analyysin konkretian.

Kumpi? ⬜

### B2. Kela "logistiikka-asiakkaana" — päätös: ⬜

Kela luetellaan logistiikkapilottien joukossa (*"Logistiikka-asiakkaat (Uber Taksi Helsinki, Bolt, Kela)"*). Kela on sosiaalivakuutuslaitos; yhteys on todennäköisesti Kelan korvaamat taksikuljetukset, mutta teksti ei sano sitä.

**Suositus: täsmennä kolmella sanalla** jos yhteys on taksikuljetukset — muuten lukija lukee sen virheenä. Ei laajennus.

### B3. Liitteessä 6 näkyy sisäinen versiometatieto — päätös: ⬜

Liitteen 6 tekstissä lukee: *"Analyysidokumentti — Master Thesis FI **V3.1** & DWS IQ 6/7 Platform. Risto Anton Päärni — Lifetime Oy. 12. helmikuuta 2026 **Versio 3.2**…"*

Kaksi eri versionumeroa samassa virkkeessä, ja molemmat viittaavat työn sisäiseen versiointiin, joka ei kuulu julkaistuun tekstiin.

**Suositus: poista versiorivi.** Se on kirjoitusprosessin jäänne, ei työn sisältöä.

### B4. 2040-tavoite kuvattu hyväksytyksi — päätös: ⬜

Liitteessä 6: *"**2040-tavoite 90 %:** Hyväksytty helmikuussa 2026 strategisena suuntaviivana"*, ja samassa taulukossa sen oma riskiarvio sanoo *"Korkean riskin väite: Tavoite on poliittinen suuntaviiva; yksityiskohdat voivat täsmentyä trilogissa."*

Työ siis merkitsee väitteen itse korkeariskiseksi ja esittää sen silti hyväksyttynä. **Tämä on itse asiassa työn ansio** — se on rehellinen omasta epävarmuudestaan.

**Suositus: jätä.** Ei ole virhe; se on asianmukaisesti merkitty varaus. Mainittu tässä vain, ettei se jää huomaamatta myöhemmin ja näytä siltä että se ohitettiin.

---

## C-luokka — lähde- ja viitetarkistukset (verkkohaku 25.07.2026)

HIC:n hypoteesi: *"Myös geminillä on tietoa dws hankkeesta ja on uskottavaa sen kyenneen luomaan lukuun 3 tekstiä jota ei olisi kenties hyväksytty repoon."*

**Hypoteesi osui, mutta ei lukuun 3.** Luvun 3 sääntelyteksti kesti tarkistuksen hyvin — se on jopa poikkeuksellisen huolellisesti varauksin kirjoitettu (*"tulee varmistaa CBAM-asetuksesta … ennen kuin niitä käytetään numeerisina ankkureina"*, *"julkisessa keskustelussa usein esitetty suuruusluokka"*). Heikot kohdat ovat **luvussa 1 (johdanto)** ja **liitteessä 6**.

### C1. McKinsey-lähdettä ei löydy — ✅ KORVAAVA EVIDENSSI ETSITTY 25.07.2026

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

### C2. Atlassian Rovon hintaväite on istumapaikkasidonnainen — päätös: ⬜

Rovo hinnoiteltiin erillistuotteena **20 $/käyttäjä/kk** (vuosilaskutus; 24 $ kuukausilaskutuksella), ja se on sittemmin sisällytetty Atlassianin Premium/Enterprise-tilauksiin.

*"Yli 1 400 euroa kuukaudessa"* vastaa siis noin **70:tä käyttäjää**. Työssä ei kerrota käyttäjämäärää, ja luku asetetaan vertailuun Firehorsen kiinteän 0–350 €/kk kanssa. **Vertailu ei ole väärä, mutta sen peruste puuttuu** — per-seat-tuotteen kokonaiskustannus ilmoittamattomalla käyttäjämäärällä vs. kiinteä alustahinta.

**Suositus: lisää käyttäjämäärä** (*"noin 70 käyttäjän organisaatiossa"*). Yksi lisäys, ei laajennus — ja se tekee luvusta puolustettavan sen sijaan että se näyttäisi valikoidulta.

### C3. SWD(2025) 836 on olemassa, mutta se on eri Omnibus — päätös: ⬜

Liite 6 käyttää lähteenä *"Komission yksiköiden valmisteluasiakirja SWD(2025) 836 (**Digital and Sustainability Omnibus**)"* tukemaan **25 % / 35 % hallinnollisen taakan vähennystavoitetta**.

**Asiakirja on aito** — SWD(2025) 836 final, Bryssel **19.11.2025** — mutta se on **Digital Omnibus**: tietosuoja- ja ePrivacy-säännöstö, tekoäly, kyberturvallisuus ja alustasääntely. **Se ei käsittele kestävyysraportointia.** Nimi *"Digital and Sustainability Omnibus"* yhdistää kaksi eri pakettia yhdeksi.

**Suositus: korjaa nimi** muotoon *"SWD(2025) 836 (Digital Omnibus)"* ja **tarkista, tukeeko se 25 % / 35 % -lukua** — jos ei, luvun lähde on etsittävä komission yksinkertaistamisviestinnästä. Sama liite merkitsee itse tämän rivin validoiduksi, joten merkintä on tällä hetkellä liian vahva.

### C4. Rakennusalan 36–40 % — päätös: ⬜

Englanninkielinen tiivistelmä: *"the construction sector, which accounts for **36–40 % of EU lifecycle emissions**"*.

Vakiintuneet luvut ovat **36 % päästöistä ja 40 % energiankulutuksesta**; elinkaarinäkökulmasta rakennukset ovat noin 40 % EU:n CO₂-päästöistä. Väli "36–40 %" yhdistää päästö- ja energialuvun yhdeksi haarukaksi.

**Suositus: pieni täsmennys tai jätä.** Suuruusluokka on oikea ja lähdekirjallisuus käyttää molempia lukuja; tämä on listan vähiten kiireellinen kohta.

### Tarkistettu ja **oikein** — ei korjattavaa

| Väite | Tarkistus |
| ----- | --------- |
| ESRS-datapisteiden vähennys **n. 61 %** | **Oikein.** EFRAG vähensi pakollisia datapisteitä 61 % (tekninen ohjeistus komissiolle 3.12.2025); kokonaisvähennys yli 70 % vapaaehtoiset mukaan lukien. |
| EU:n ilmastolaki 2021/1119, **−55 % / 2030 / 1990-taso** | Oikein, myös artiklaviittaukset. |
| **2040-tavoite 90 %**, merkitty "hyväksytty helmikuussa 2026" + korkean riskin varaus | **Oikein kirjoitushetkellä.** Parlamentti hyväksyi 9.–10.2.2026; neuvoston lopullinen hyväksyntä 5.3.2026 ja voimaantulo 4/2026 tapahtuivat vasta myöhemmin. **Älä päivitä** — se olisi myöhemmän tiedon tuomista, jonka laatimisrajaus kieltää. Varaus oli oikea silloin. |
| EU ETS laajennus meriliikenteeseen 2024 | Oikein. |
| SWD(2025) 836 on olemassa | Oikein (ks. C3 nimestä). |

## 🔴 D1. Löydös jota ei etsitty — henkilökohtainen Kela-maininta julkaistussa työssä

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

Päätös: ⬜

## Mitä listalla ei ole

Tarkistettu ja **todettu johdonmukaiseksi** — ei siis korjattavaa:

- Takaisinmaksuaika: *2 kuukautta* (pyöristetty) ja *1,95 kuukautta* (laskettu) ovat sama luku
- Automaatiotaulukon prosentit (96 % / 99 % / 80 % / 94 %) vastaavat annettuja lähtö- ja loppuarvoja
- Tavoite/toteuma-parit (+50 %→+62 %, −50 %→−73 %)
- 15 300 $ startup-krediitit, −55 % 2030, 61 % ESRS-vähennys, 16 toimialaa, alle 100 ms reunalatenssi — esiintyvät johdonmukaisesti kaikkialla

## Työjärjestys

1. HIC päättää kohdat A1–A7 ja B1–B4 yksitellen.
2. Hyväksytyt korjaukset + kirjaston viisi muotokorjausta tehdään `V41`:een → **v4.2**.
3. PDF-vienti.
4. Kirje `kirjasto@metropolia.fi` (`KORJAUSPYYNTO_KIRJASTOLLE.md`) — **päivitä kirjeen kohta "Mitä korjatussa versiossa on muutettu" vastaamaan lopullista päätöslistaa.** Jos asiavirheitä korjataan, kirje ei voi enää sanoa pelkästään "muutokset koskevat etu- ja tiivistelmäsivuja".
