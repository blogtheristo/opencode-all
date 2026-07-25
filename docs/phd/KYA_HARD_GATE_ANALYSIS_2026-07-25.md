# Onko KYA:n hard gate mahdollinen?

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Luotu HIC:n kysymyksestä (*"Standardi toimii erottelun perusteena… Standardi määrittää hard gaten. Onko kya hard gate mahdollinen?"*). Sisältää premissin korjauksen (standardi ei luo porttia, lainsäädäntö luo), EU:n New Legislative Frameworkin arkkitehtuurin, JTC 21 -reitin realistisen arvion, saavutettavissa olevat pehmeämmät portit sekä rakenteellisen jännitteen. **Ei uusi tutkimuskysymys** — lukitussääntö 1: signaali liittyy olemassa olevaan RQ:hun.

***

## ⚠️ Premissi vaatii yhden korjauksen, ja se ratkaisee koko vastauksen

> *"EU sähköturvallisuusstandardi vaatii laitteen hyväksyttämisen jotta sen voi tuoda EU-markkinoille. Standardi määrittää hard gaten."*

**Standardi ei määritä porttia. Lainsäädäntö määrittää portin; standardi määrittää halvimman reitin sen läpi.**

EU:n New Legislative Framework toimii kolmikerroksisesti, ja kerrokset on pidettävä erillään:

| Kerros | Mitä tekee | Sitovuus |
| ------ | ---------- | -------- |
| **Säädös** (esim. pienjännitedirektiivi 2014/35/EU, konedirektiivi) | Kieltää saattamasta markkinoille tuotetta, joka ei täytä olennaisia vaatimuksia | **Pakottava — tämä on portti** |
| **Yhdenmukaistettu standardi** | Antaa **vaatimustenmukaisuusolettaman**: jos noudatat sitä, sinun oletetaan täyttävän olennaiset vaatimukset | **Vapaaehtoinen** |
| **CE-merkintä + vaatimustenmukaisuuden arviointi** | Valmistajan vakuutus siitä, että vaatimukset täyttyvät | Pakottava menettely |

**Standardin noudattaminen ei ole pakollista.** Olennaiset vaatimukset voi täyttää muullakin tavalla — se on vain kalliimpaa ja raskaampaa todistaa. Standardi on siis **etuoikeutettu reitti, ei este.**

**Ja toinen täsmennys, joka muuttaa sanan "hyväksyttäminen" merkitystä:** valtaosassa tuoteryhmiä ei ole kolmannen osapuolen ennakkohyväksyntää lainkaan. Valmistaja tekee **oman vaatimustenmukaisuusvakuutuksensa** ja kiinnittää CE-merkin. Ilmoitettu laitos (notified body) tarvitaan vain määritellyissä korkean riskin luokissa. **EU:n portti on siis pääosin vakuutusportti, jolla on valvonta- ja vastuuseuraamukset — ei ennakkolupaportti.**

Tämä ei heikennä porttia. Se **siirtää painon näytön laatuun**, koska vakuutuksen antaa se, joka kantaa vastuun. Ja juuri siihen kohtaan evidenssikehys asettuu.

---

## Vastaus kolmessa osassa

### 1. Markkinaporttina EU:ssa: **ei KYA:n omalla toiminnalla — koskaan**

Yksikään spesifikaatio ei luo markkinoillepääsyn porttia, olipa se miten hyvä tahansa. Se on lainsäädäntövalta.

**Mutta portti on jo olemassa, eikä KYA:n tarvitse rakentaa sitä.** EU:n tekoälysäädös kieltää korkean riskin tekoälyjärjestelmän saattamisen markkinoille ilman vaatimustenmukaisuuden arviointia, CE-merkintää ja rekisteröintiä EU-tietokantaan. **Se on hard gate, se on laissa, ja se tulee täysimääräisesti sovellettavaksi elokuussa 2026** — ensi kuussa.

### 2. Olettamareittinä portin läpi: **teoriassa kyllä, käytännössä ei tällä aikahorisontilla**

Ainoa tapa, jolla KYA voisi saada porttiaseman, on **AI Act 40 artiklan yhdenmukaistettu standardi** — ja se reitti on suljettu oma-aloitteisuudelta.

Yhdenmukaistettuja standardeja tuotetaan **vain komission standardointipyynnön nojalla**, ja tekoälysäädöksen osalta työn tekee **CEN-CENELEC JTC 21**. Sitä ei voi käynnistää itse. Tämä on jo kirjattu `PHD_FIREHORSE` §14.43:een (*yhdenmukaistetun aseman oma-aloitteisuusrajoite*), ja se on tämän analyysin kannalta ratkaiseva rajoite.

**Realistinen arvio JTC 21:stä:**

- Perustettu 1.6.2021, **yli 300 asiantuntijaa yli 20 maasta**, viisi työryhmää
- Työ on **myöhässä**: yhdenmukaistettuja standardeja ei todennäköisesti siteerata EU:n virallisessa lehdessä ennen kuin säädöksen keskeiset velvoitteet ovat jo voimassa
- prEN 18286 (laadunhallintajärjestelmä, 17 artikla) on julkisella lausuntokierroksella

**Yhden toimittajan spesifikaatio suomalaiselta mikroyritykseltä ei tule tähän putkeen ehdokasstandardina.** Se ei ole arvio KYA:n laadusta vaan prosessin rakenteesta.

**Todellinen sisäänpääsyreitti on kansallinen peilikomitea** — Suomessa **SFS** — jonka kautta voi osallistua **kontribuuttorina**, ei ehdokkaana. Se on hidas, se on halpa, ja se on ainoa avoin ovi. Se on myös arvokas riippumatta standardiasemasta: peilikomiteassa näkee mitä on tulossa ennen kuin se on julkista.

### 3. Hankinta- ja sopimusporttina: **kyllä, nyt, ja tämä on ainoa lähiajan todellinen portti**

Tässä on vastauksen rakentava osa. **Portti ei vaadi lainsäädäntöä, jos joku muu tekee poissulkemisen puolestasi.**

| Porttityyppi | Mekanismi | Saavutettavuus |
| ------------ | --------- | -------------- |
| **Julkinen hankinta** | Ostaja vaatii KYA-konformanssia tarjouspyynnössä | ✅ **Nyt.** Kova portti *siinä kilpailutuksessa* |
| **Sopimusportti** | Suuryritys vaatii KYA:ta toimittajiltaan | ✅ Nyt, yksityisoikeudellisesti |
| **Vakuutus / vastuu** | Vakuuttaja vaatii näyttökehystä | 🟡 Hitaampi, mutta erittäin voimakas |
| **Alustaportti** | Agenttialusta vaatii KYA:ta listautumiseen | 🟡 Näin monet de facto -standardit saivat hampaat |

**Julkinen hankinta on näistä vahvin EU-kontekstissa**, koska hankinta on politiikkainstrumentti ja suvereeni tekoälyhankinta on aktiivinen poliittinen teema. Se kytkeytyy suoraan **RQ6:een** ja repositoriossa olevaan **ORK-tarjoukseen**.

---

## Aikaikkuna, joka on auki juuri nyt — ja sulkeutuu

Tässä on tämän analyysin kaupallisesti kiinnostavin havainto.

**Tekoälysäädös tulee täysimääräisesti sovellettavaksi elokuussa 2026. Yhdenmukaistetut standardit eivät ole valmiita.** Syntyy tila, jossa velvoite on voimassa mutta virallista reittiä sen täyttämiseen ei ole siteerattu.

Siinä tilassa jokainen korkean riskin järjestelmän toimittaja joutuu **osoittamaan vaatimustenmukaisuuden ilman olettamareittiä** — eli tuottamaan näyttöä omalla vastuullaan, ilman että mikään standardi suojaa häntä.

**KYA:n realistinen lähiajan asema ei ole portti vaan se, mitä ihmiset käyttävät näyttönä sinä aikana kun portilla ei ole virallista reittiä.** Se on aidosti arvokas positio, se on saavutettavissa ilman elintä, ja **se on aikarajattu**: kun JTC 21:n standardit siteerataan, olettamareitti aukeaa ja markkinaehtoisen kehyksen arvo laskee jyrkästi.

Tämä on **ajoituskysymys, ei standardointikysymys** — ja se on eri strategia kuin standardiksi pyrkiminen.

---

## Rakenteellinen jännite, joka on syytä sanoa ääneen

**Hard gate vaatii auktoriteetin, joka voi kieltäytyä.**

Neljä porttia (spesifikaatio → standardi) mittaavat **tunnustuksen ansaitsemista**. Markkinaportti on eri asia: se on **jonkun toisen käyttämä poissulkemisvalta sinun kriteeriesi perusteella**. Jälkimmäinen vaatii ensimmäisen *plus* instituution, joka on valmis käyttämään sitä valtaa.

**Ja tässä on sama vaihtokauppa kuin sertifiointimerkissä, yhtä tasoa ylempänä:**

Päästäkseen asemaan, jossa elin voisi tehdä KYA:sta olettamareitin, spesifikaatio on **luovutettava sille elimelle** (portti 4). Sen jälkeen se ei ole enää sinun, ja portti sulkee ulos **elimen kriteereillä**, ei Lifetime Oy:n.

> **Portti, jonka rakennat, on portti jota et omista.**

Tämä ei ole argumentti olla rakentamatta sitä. Se on argumentti sen puolesta, että **motiivi on tunnistettava oikein**: jos tavoite on poissulkeva kontrolli, standardointi on väärä väline — se on nimenomaan kontrollista luopumisen mekanismi. Jos tavoite on markkinan muotoilu, se on oikea väline, ja hinta on hallinta.

---

## Tarkka vastaus kysymykseen

**Onko KYA:n hard gate mahdollinen?**

| | |
| - | - |
| **EU-markkinaporttina, KYA:n omalla toiminnalla** | ❌ Ei koskaan. Vain laki luo portteja |
| **Olettamareittinä olemassa olevan portin läpi (AI Act 40 art.)** | 🟡 Teoriassa. Reitti kulkee JTC 21:n kautta, sitä ei voi käynnistää itse, ja se maksaa hallinnan |
| **Hankinta- ja sopimusporttina** | ✅ **Kyllä, nyt.** Ainoa lähiajan todellinen |
| **Lifetime Oy:n omistamana porttina** | ❌ Ei. **Portti, jonka omistat, ei ole standardi vaan tuotevaatimus — ja ostajat tunnistavat eron** |

Viimeinen rivi on se, joka kannattaa pitää mielessä. Omistettu portti on myyntiehto. Se voi olla hyvä liiketoimintaa, mutta se ei ole sitä mitä sana "standardi" lupaa — ja jos sitä kutsutaan standardiksi, ollaan takaisin siinä väitteessä, jonka neljä porttia on kirjoitettu estämään.

## Miten tämä käsitellään — ei uutena tutkimuskysymyksenä

**Lukitussääntö 1: signaali liittyy olemassa olevaan RQ:hun, se ei koskaan saa omaa numeroa.**

Tämä analyysi on hyvää materiaalia, mutta se ei ole RQ7. Se jakautuu näin:

- **RQ5 v3** (pitääkö erottelu, kun kohde muuttuu) — poissulkemisvoiman kysymys kuuluu tänne: *mikä antaa hallintastandardille hampaat, ja muuttuuko se, kun sertifioitava kohde on liikkuva?*
- **RQ6** (siirtymän hallinta) — hankintaportti on tämän kysymyksen mekanismi, ja ORK-tarjous on sen kenttätapaus
- **Signaaliliite** — JTC 21:n aikataulu, prEN 18286, elokuun 2026 aikaikkuna

## Liittyvät

- `kb/wiki/concepts/specification-vs-standard-four-gates.md` v1.3 — kolme tilaa, A2A-vertailu, IPR-inversio
- `PHD_FIREHORSE` §14.43 — yhdenmukaistetun aseman oma-aloitteisuusrajoite
- `docs/phd/RQ_FALSIFIABILITY_AUDIT_2026-07-25.md` — T1–T3
- `docs/phd/PHD_RESEARCH_QUESTIONS_LOCK_v1.md` — lukitussäännöt
- `bids/ORK160826/` — julkisen hankinnan kenttätapaus
