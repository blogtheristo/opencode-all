# v4.2 — toteutuslista Google Docsiin

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Luotu HIC:n kysymyksestä *"Vien v4.2 theseukseen. Onko se nyt valmis?"* — **ei ole.** Päätökset olivat valmiit, dokumentti ei. `V42_ASIAVIRHELISTA.md` on järjestetty päätöksentekoa varten (A/B/C/D-luokat); tämä on sama sisältö järjestettynä **dokumentin läpi kulkevaksi työlistaksi**, jotta korjaukset voi tehdä yhdellä läpikäynnillä eikä hyppimällä.

***

## ⛔ v4.2 ei ole olemassa

Tähän mennessä on päätetty **mitä** muutetaan. **Yhtäkään muutosta ei ole tehty.** Lähdetiedosto `V41_Final_Thesis_FI` on Google Drivessa muuttumattomana.

**Älä vie Theseukseen ennen kuin tämä lista on käyty läpi ja vaihe 2 on tehty.**

---

## Vaihe 1 — korjaukset dokumentin järjestyksessä

Yksi läpikäynti alusta loppuun. Rasti kohdat sitä mukaa.

### Kansilehti

- [ ] **Otsikko** → *Firehorse-tuotevalmistuksen toimintamalli: Hybridi AI-edge-arkkitehtuuri ilmastoälykkäille teollisille alustoille*
- [ ] **Päivämäärä** → valitse **yksi** päivä (valmistumis-/palautuspäivä) ja käytä sitä kaikissa kolmessa paikassa

### Tiivistelmä (suomi)

- [ ] **Otsikko** — jo oikein, tarkista että vastaa kansilehteä
- [ ] **Aika** → sama päivä kuin kansilehdellä (nyt 10.2.2026)
- [ ] **Liitteet** 7 → **8**
- [ ] **Sivumäärä** — ⏸️ *jätä tyhjäksi, täytetään vaiheessa 2*

### Tiivistelmä (englanti)

- [ ] **Title** → *The Firehorse product manufacturing operating model — a hybrid AI-edge architecture for climate-intelligent industrial platforms*
- [ ] **Date** → sama päivä (nyt 26TH April 2026)
- [ ] **Appendices** 7 → **8**
- [ ] **Number of Pages** — ⏸️ *vaihe 2*
- [ ] **Poista löydöksistä** *"€10k MRR during pilot phase from logistics customers"* → tiivistelmät menevät samalla synkkaan
- [ ] **36–40 %** → *"approximately 36 % of EU CO₂ emissions and 40 % of energy consumption"*

### Luku 1.1

- [ ] **Kustannusluvut** → *"…kuukausikulut olivat **noin 100–300 euroa** ajalla 1.9.2024–31.8.2025 — nousu ajoittuu huhtikuuhun 2025, jolloin Claude Max otettiin käyttöön — ja **noin 300–600 euroa** ajalla 1.9.2025–30.4.2026, kun Google Cloud Run ja muut pilvipalvelut kasvattivat perustasoa."*
- [ ] **Kilpailijavirke** → korvaava virke (poistaa McKinsey-lähteen, hintaluvut ja korjaa latenssin lähteen kerralla):

> *"Perinteiset SaaS-ratkaisut eivät vastaa monien keskisuurten ja suurten teollisuusyritysten tarpeisiin kustannustehokkaasti, erityisesti kun käyttöönotto pitää ulottaa useille työmaille, tehtaille tai yksiköille. **Kilpailija-analyysin perusteella vastaavat ratkaisut hinnoitellaan käyttäjä- tai laitekohtaisesti, jolloin kokonaiskustannus kasvaa käyttöönoton laajuuden mukana. DWS IQ:n hinnoittelu on rakenteeltaan toisenlainen: kustannus ei kasva käyttäjä- eikä laitemäärän mukana.** Lisäksi pelkkä pilvipohjaisuus tuottaa **omissa työmaasimulaatioissa mitatun 500–2 000 millisekunnin päästä päähän -vasteajan**, mikä ei riitä reaaliaikaiseen työmaavalvontaan."*

- [ ] **Poista lähdeluettelosta** *"McKinsey & Company 2024. The State of AI in Construction…"* — mitään ei enää lainata

### Luku 1.5 (menetelmät ja aineisto)

- [ ] *"Asiakashaastattelut ja data (Uber, Bolt, Kela — €10k MRR)"* → *"Asiakashaastattelut ja pilottiaineisto (logistiikka-alan pilottiasiakkaat)"*

### Luku 1.6 (työn rakenne)

- [ ] **Korvaa loppuosa** (kolme virkettä → yksi):

> *"Luku 3 analysoi nykytilan: eurooppalaisen teollisen AI-maiseman, kilpailuympäristön ja asiakassegmentit sekä DWS IQ -toimintamallin ja arkkitehtuurin suunnittelun neljällä kerrostasolla. Luku 4 dokumentoi toteutusvaiheen. Luku 5 käsittelee dws10.com-verkkokaupan integraation ja agentic commerce -tuotantopolun sekä esittää tulokset, vastaukset tutkimuskysymyksiin, pohdinnan ja keskeiset kontribuutiot."*

### Luku 3.3 (asiakassegmentit)

- [ ] **Kaikki yritysnimet pois**, toimialat jäävät → *"Tason 1 kriittiset teollisuudet (välitön myyntifokus) sisältävät rakentamisen, logistiikan, valmistuksen ja energian."*

### Luku 3.4

- [ ] **Numerointi:** 3.4.2 → **3.4.1**, 3.4.3 → **3.4.2**. Tarkista ristiviittaukset
- [ ] **NCC / T2H** → *"Ensimmäisissä asiakaskeskusteluissa rakennusalan pilottiorganisaatioiden kanssa…"*
- [ ] 🔴 **POISTA KOKO KAPPALE** — alkaa *"Työn valmistuminen on kestänyt useamman vuoden…"*, päättyy *"…piestynäkin onnellinen tämän työn tuloksista."* Tarkista että edeltävä ja seuraava kappale liittyvät toisiinsa saumattomasti

### Luku 5.5 (pilottitulokset)

- [ ] → *"Logistiikka-alan pilotit tuottivat ensimmäisenä konkreettisia tuloksia ja alustan ensimmäisen toistuvan liikevaihdon. Rakennusalan pilotit toivat viisi projektia."*

### Luku 5.6 (TK1-vastaus)

- [ ] *"€10k MRR pilotista (Uber, Bolt, Kela)"* → *"pilottien tuottama toistuva liikevaihto"*
- [ ] **TK2-vastaus:** *"0–350 euron kuukausikustannukset"* → **25–350**

### Luku 5.7

- [ ] **SWOT, Vahvuudet:** *"82 % halvempi kuin kilpailijat"* → *"82 % pienemmät ajonaikaiset kustannukset verrattuna pelkkään pilviarkkitehtuuriin"*
- [ ] **SWOT, Vahvuudet:** *"live-järjestelmä 10 000 euron MRR:llä"* → *"tuotannossa oleva, maksavien pilottien käyttämä järjestelmä"*
- [ ] **SWOT-taulukko, Kustannusrakenne:** *"0–350 €/kk infra"* → **25–350**
- [ ] **Strategiataulukko, Ratkaisu-rivi:** *"0–350 €/kk"* → **25–350**
- [ ] **Johtopäätökset:** kustannusluvut → sama vaihteluvälimuotoilu kuin luvussa 1.1
- [ ] **Johtopäätökset:** *"skaalautuvuutta ei saavutettu kulupiikillä"* → *"…kuukausikulut pysyivät koko ajan satojen eurojen suuruusluokassa, kun vertailukelpoiset kaupalliset ratkaisut liikkuvat tuhansissa euroissa kuukaudessa."*
- [ ] **Keskeiset kontribuutiot:** kustannusluvut → sama vaihteluvälimuotoilu

### Liite 2 (tuotekatalogi)

- [ ] **Alustaohjelmistot** 2 → **4**
- [ ] ⛔ *"matalan kynnyksen aloituksen (0–350 euroa kuukaudessa)"* — **ÄLÄ MUUTA.** Tämä on asiakashinta, ei kustannus

### Liite 6

- [ ] *"SWD(2025) 836 (Digital and Sustainability Omnibus)"* → *"SWD(2025) 836 (Digital Omnibus)"*
- [ ] *"Validointi: Luvut ovat linjassa komission yksinkertaistamisstrategian kanssa"* → *"Suuntaa-antava: luku on linjassa komission yleisen taakanvähennystavoitteen kanssa; kestävyysraportoinnin osalta lähde on eri."* (tai poista koko rivi)
- [ ] **Poista versiometatietorivi** — *"Analyysidokumentti — Master Thesis FI V3.1 … Versio 3.2 — ETS2 lykkäys 2028…"*

### Aivan loppuun, liitteiden jälkeen

- [ ] **Lisää korjaushuomautus** — valmis teksti: `V42_KORJAUSHUOMAUTUS.md`
- [ ] Otsikko on **"Korjaushuomautus"**, **ei** "Liite 9" — muuten liitteiden määrä (jonka juuri korjasit) menee taas väärin

---

## Vaihe 2 — viimeistely, vasta kun vaihe 1 on kokonaan tehty

- [ ] **Regeneroi sisällysluettelo** — korjaa sisennykset ja päivittyy poistojen mukaan
- [ ] **Laske sivumäärä** korjaushuomautus mukaan lukien
- [ ] **Vie sivumäärä molempiin tiivistelmiin** (kaksi ⏸️-kohtaa vaiheesta 1)
- [ ] **Tarkista korjaushuomautuksen sijaintilista** todellisia luvunnumeroita vastaan — luonnoksessa osa on paikannettu päättelemällä. **Ylimääräinen rivi on yhtä väärä kuin puuttuva**
- [ ] *(Valinnainen)* siirrä lähteet liitteiden edelle — kirjasto piti tätä makuasiana, älä viivytä tämän takia

---

## Vaihe 3 — vienti ja ilmoitus

- [ ] PDF-vienti
- [ ] **Tallennus Theseukseen**
- [ ] **Vasta sitten** viesti `kirjasto@metropolia.fi` — `KORJAUSPYYNTO_KIRJASTOLLE.md` v4.0

---

## Kolme asiaa, jotka menevät helposti pieleen

**1. Hae-ja-korvaa `0–350`.** Viidestä esiintymästä **kaksi on oikein** (asiakashinta). Korjaa vain ne kolme, joissa lukee *kustannus* tai *infra*.

**2. Sivumäärä ennen korjaushuomautusta.** Jos täytät sen vaiheessa 1, se on väärä heti kun huomautus lisätään.

**3. D1-poiston sauma.** Kappale poistuu keskeltä tekstiä. Tarkista että edeltävä ja seuraava kappale lukevat yhteen — muuten poisto näkyy.
