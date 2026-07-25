# Portti 1 — ehdokkaat kahdeksi riippumattomaksi toteuttajaksi

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

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

## Mitä tämä tarkoittaa järjestykselle

**Elin ei ole ensimmäinen kysymys — se on kolmas.**

1. **Ratkaise Törngrenin rooli** (arvioija vai toteuttaja vai jako) — halvin, ja se on tehtävä ennen kuin asia ratkeaa itsestään
2. **Lähesty yhtä arviointilaitosta** — ajoitus on nyt, koska AI Act -velvoitteet alkavat ilman valmista näyttökehystä
3. **Vasta sitten elin** — se ratkeaa lähes itsestään, kun tiedetään keitä toteuttajat ovat ja missä jurisdiktiossa he toimivat

**Ja hold-päätös pitää koko ajan.** Julkaisu on se hetki, jolloin patenttiehdot lukittuvat (Apache-2.0 §3 aktivoituu luovutuksessa). Toteuttajien etsintä voidaan tehdä **NDA:n alla ilman julkaisua** — ja EPC 54 artiklan kannalta se on myös ainoa tapa, joka säilyttää uutuuden.

## Liittyvät

- `kb/wiki/concepts/specification-vs-standard-four-gates.md` v1.4 — portit, kolme tilaa, hallintomallin valinta
- `docs/phd/KYA_HARD_GATE_ANALYSIS_2026-07-25.md` — elokuun 2026 aikaikkuna
- `PHD_FIREHORSE` Liite H — kumppaniekosysteemi (jakelu, ei legitimointi)
- `docs/phd/PHD_RESEARCH_QUESTIONS_LOCK_v1.md` — RQ1/RQ4 ankkurit
- `docs/legal/PRIOR_ART_DISCLOSURE_RECORD_2026-07-25.md` §6 — NDA-ehto ennen teknistä paneelia
