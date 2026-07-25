# v4.2 — laatimisrajaus ja asiavirhelista päätettäväksi

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

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

### A1. Kuukausikulut: johdanto sanoo 300/600 €, johtopäätökset 100/400 € — päätös: ⬜

| Sijainti | Teksti |
| -------- | ------ |
| Johdanto (luku 1.1) | *"…kuukausikulut ovat olleet **noin 300 euroa** ajalla 1.9.2024–31.8.2025 ja **noin 600 euroa** kuukaudessa lopputyön toteutuksen aikana"* |
| Johtopäätökset (5.7.6) | *"…kuukausikulut pysyivät **noin 100 €/kk** tasolla ajalla 1.9.2024-31.8.2025 ja **noin 400 €/kk** tasolla … 1.9.2025-30.4.2026"* |
| Keskeiset kontribuutiot (5.8) | *"…noin **100 €/kk** ajalla 1.9.2024-31.8.2025 ja noin **400 €/kk** ajalla 1.9.2025-30.4.2026"* |

Sama kaksi lukua esiintyy kolmesti, ja johdannon pari on eri kuin kaksi muuta. **Tämä on työn keskeisin numeerinen väite** — kustannusrakenne on koko argumentin ydin — joten ristiriita on näkyvin mahdollisessa paikassa.

**Suositus: korjaa.** Kaksi kolmesta esiintymästä sanoo 100/400, joten johdanto on todennäköisimmin se vanhentunut. Vahvista kummat luvut ovat oikeat.

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

### B1. Nimetyt asiakkaat ja €10k MRR julkisessa dokumentissa — päätös: ⬜

Työ nimeää **Uber, Bolt, Kela, NCC, T2H** pilottiasiakkaina ja liittää heihin *"10 000 euron kuukausittainen toistuva liikevaihto"* sekä *"50 miljoonan euron projektiportfolio"*.

Kaksi kysymystä, jotka eivät ole muotoseikkoja:

1. **Onko luku oikein** ja koskeeko se näitä kolmea yhdessä?
2. **Onko näillä yrityksillä lupa tulla nimetyksi** maksavina pilottiasiakkaina pysyvästi julkisessa asiakirjassa? Tämä on jo julkaistu 10.7.2026 alkaen, joten kysymys on siitä, korjataanko eteenpäin — ei siitä, estetäänkö.

**Suositus: tarkista, älä automaattisesti korjaa.** Jos nimet ovat sovittuja, jätä. Jos eivät, tämä on ainoa listan kohta, jossa korjaamatta jättämisellä on ulkopuolinen osapuoli.

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
