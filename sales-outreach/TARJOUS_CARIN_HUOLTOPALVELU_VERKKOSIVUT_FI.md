<!--
VERSION AND AGENT HISTORY
Document: TARJOUS_CARIN_HUOLTOPALVELU_VERKKOSIVUT_FI.md
Version: 4.0
Last-Updated: 2026-07-01
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-sonnet-5)
Purpose: Tarjous Carin Huoltopalvelulle uusista verkkosivuista —
         yksisivuinen, kaksikielinen (FI/EN) sivusto, toteutus ja
         julkaisu Cloudflare Pages -alustalla samaan tapaan kuin
         lifetime.fi (staattinen HTML/CSS/JS, git-pohjainen deploy,
         ilmainen hosting), lisättynä verkkotunnuksen (cari.fi) ja
         Google Workspacen (myynti@cari.fi) käyttöönotolla.
Version-history:
  - 4.0 (2026-07-01): lisätty scope: verkkotunnuksen cari.fi
    rekisteröinti/käyttöönotto + Google Workspace -käyttöönotto
    osoitteelle myynti@cari.fi. Tekninen huomio: Cloudflare
    Registrar ei tue .fi-päätettä (vahvistettu vuoden 2026
    tuetun TLD-listan mukaan) — cari.fi pitää rekisteröidä
    .fi-kelpoisen rekisteröijän kautta (esim. suomalainen
    operaattori), minkä jälkeen nimipalvelimet (NS) osoitetaan
    Cloudflareen DNS:ää ja Pages-julkaisua varten. cari.fi:n
    saatavuus tarkistettava ennen tilausvahvistusta.
  - 3.0 (2026-07-01): hinta korvattu owner-instruction mukaisesti
    kiinteällä 85 €:lla (sisältää alv) koko yksisivuisesta,
    kaksikielisestä toteutuksesta. Tämä on eksplisiittinen
    poikkeama kanonisesta 75 €/h + alv -tuntihinnasta (ks. konflikti
    alla) — ei averagoitu vanhan 450 €:n kanssa, vaan korvattu
    kokonaan omistajan ohjeen mukaisesti.
  - 2.0 (2026-07-01): rescope yksisivuiseksi + kaksikieliseksi
    (FI/EN) + Cloudflare Pages -toteutukseksi lifetime.fi:n
    tapaan. Tuntipankki laskettu alas 10 h -> 6 h (450 €)
    vastaamaan pienempää sivumäärää.
  - 1.0 (2026-07-01): alkuperäinen moni-sivuinen tarjous, 10 h
    tuntipankki osana atk-apu pk-yritykselle -pakettia (750 €).
Pricing-basis:
  - HUOM — konflikti kanonisen hinnan kanssa (CLAUDE.md sääntö 7,
    "surface conflicts, don't average them"): dws10.com/config/
    products.json "professional-web-pages" -SKU ja
    flyer-atk-apu-pk-yritykselle-a4.html käyttävät 75 €/h + alv
    -tuntihintaa. Tämä tarjous käyttää sen sijaan kertaluonteista
    kiinteää 85 € (sisältää alv) -hintaa, koska omistaja
    (risto.paarni@lifetime.fi) on eksplisiittisesti pyytänyt tätä
    hintaa juuri tähän yksisivuiseen toteutukseen. 85 € sisältäen
    alv 25,5 % vastaa n. 67,73 € alv 0 % -hintaa — selvästi alle
    normaalin tuntihinnan (n. 0,9 h × 75 €/h). Käsitellään
    kertaluonteisena aloitus-/erikoishintana tälle projektille,
    ei uutena kanonisena SKU-hintana. Jatkotyö (lisäsivut,
    -kielet, ylläpito) laskutetaan edelleen standardilla
    75 €/h + alv -tuntihinnalla (ks. kohta 3, C ja D).
  - Tekninen malli: lifetime.fi (staattinen sivusto, Cloudflare
    Pages, shared-assets/vertical-lang-bar.js-tyyppinen
    kielivalitsin, sovitettuna yhdelle sivulle kahdella kielellä).
  - Verkkotunnus + Google Workspace -käyttöönotto (v4.0 lisäys):
    käyttöönottotyö (domainin rekisteröinnin ohjaus, NS-osoitus
    Cloudflareen, Workspace-tilin ja myynti@cari.fi-postilaatikon
    perustus, MX/SPF/DKIM-tietueet) laskutetaan standardilla
    75 €/h + alv erillisenä lisäpalveluna 85 €:n verkkosivuhinnan
    päälle — ei sulautettu kiinteään hintaan, sillä 85 € oli
    eksplisiittisesti rajattu vain sivuston rakennukseen (ks. v3.0
    huomio yllä). Kolmannen osapuolen jatkuvat kulut (domain-
    vuosimaksu, Workspace-kuukausimaksu per käyttäjä) ovat aina
    asiakkaan omia, läpilaskutettavia kuluja riippumatta
    käyttöönottotyön hinnoittelusta.
  - Ei Y-tunnusta tiedossa vielä; pyydetään ennen sopimusta
    (ks. kohta 6).
Branch: claude/carin-huoltopalvelu-quote-ygb14z
Date: 2026-07-01
Owner: risto.paarni@lifetime.fi
Recipient: Carin Huoltopalvelu (cari.huoltopalvelu@gmail.com, 0400744214)
Transport: Amazon SES SMTP only (CLAUDE.md non-negotiable rule #4)
Sender: risto.paarni@lifetime.fi (never noreply@, rule #3)
-->

# Tarjous — Yksisivuinen, kaksikielinen verkkosivu, Carin Huoltopalvelu

**Vastaanottaja:** Carin Huoltopalvelu (cari.huoltopalvelu@gmail.com, 0400744214)
**Tarjouksen tekijä:** Lifetime Oy (Y-tunnus 0772407-9, ALV FI07724079)
**Päiväys:** 2026-07-01
**Voimassa:** 2026-07-31 asti
**Aihe-ehdotus sähköpostiin:** _Tarjous: Yksisivuiset verkkosivut Carin Huoltopalvelulle, 85 € (sisältää alv)_

---

## 1. Lyhyt yhteenveto

Tarjoamme Carin Huoltopalvelulle **yksisivuisen, kaksikielisen (suomi/englanti) verkkosivun** kiinteällä hinnalla **85 € (sisältää alv 25,5 %)**. Sivu toteutetaan ja julkaistaan **Cloudflare Pages** -alustalla — sama tekninen ratkaisu kuin Lifetime Oy:n omalla lifetime.fi-sivustolla: staattinen, nopea, ilmaisella hostingilla, automaattisella HTTPS:llä ja globaalilla CDN:llä.

Tämä on kertaluonteinen, kiinteä hinta juuri tälle yksisivuiselle toteutukselle — ei tuntiveloitusta. Vertailuna Suomessa pienyrityksen valmis kotisivu maksaa markkinoilla tyypillisesti **500–1 500 €**; 85 € on selvästi tämän haarukan alapuolella ja sisältää käyttöönoton loppuun asti. Jos sivustoa halutaan myöhemmin laajentaa (lisää sivuja, kieliä, toiminnallisuutta), jatkotyö laskutetaan vakiotuntihinnalla 75 €/h + alv (ks. kohta 3, C ja D).

---

## 2. Mitä saatte

Yksi sivu, ei valikkorakennetta — kaikki tieto samalla sivulla, vieritettävissä ylhäältä alas.

| Osa-alue                        | Sisältö                                                                                                                                                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hero-osio**                   | Yritysnimi, ydinviesti, puhelinnumero ja sähköposti heti näkyvissä.                                                                                                                                                   |
| **Palvelut**                    | Huoltopalveluiden kuvaus samalla sivulla, tarvittaessa hinnasto tai "Pyydä tarjous" -painike.                                                                                                                         |
| **Yhteystiedot & lomake**       | Yhteydenottolomake, joka lähettää viestin suoraan sähköpostiinne — ei erillistä kirjautumista tai kolmannen osapuolen palvelua.                                                                                       |
| **Kielivalitsin FI/EN**         | Pieni lippu-/kielipainike (🇫🇮/🇬🇧) vaihtaa koko sivun sisällön suomesta englanniksi ilman sivun uudelleenlatausta — kevennetty versio samasta ratkaisusta kuin lifetime.fi:n kielipalkki, sovitettuna yhdelle sivulle. |
| **Mobiilioptimointi**           | Sivu toimii puhelimella yhtä hyvin kuin tietokoneella — suurin osa huoltopalvelun asiakkaista hakee palvelun kännykällä.                                                                                              |
| **Google-näkyvyys**             | Google Business -profiilin perustus tai korjaus, jotta yritys löytyy paikallishauista.                                                                                                                                |
| **Julkaisu — Cloudflare Pages** | Staattinen sivusto, git-pohjainen julkaisu, ilmainen hosting, automaattinen HTTPS, globaali CDN. Sama alusta kuin lifetime.fi, dws10.com ja onelifetime.world.                                                        |
| **Verkkotunnus — cari.fi**      | Rekisteröinnin ohjaus .fi-kelpoisen rekisteröijän kautta (Cloudflare Registrar ei tue .fi-päätettä) ja nimipalvelinten (NS) osoitus Cloudflareen, jotta sivusto ja sähköposti toimivat samalla domainilla.            |
| **Google Workspace**            | Tilin perustus ja postilaatikko **myynti@cari.fi** — MX/SPF/DKIM-tietueiden määritys, kirjautuminen ja peruskäyttöohjeistus.                                                                                          |

Sivuston rakennus (85 €) ja verkkotunnus/Workspace-käyttöönotto hinnoitellaan erikseen — ks. kohta 3. Jos sivustosta halutaan laajempi (useampi sivu, lisää kieliä) — ks. kohta 3, vaihtoehto C.

---

## 3. Hinnoittelu

**Yksikköhinta:** 75 €/h + alv (sama tuntihinta kaikessa atk-avussamme).

### A. Yksisivuinen, kaksikielinen sivu — kiinteä hinta (suositus)

| Erä                   | Hinta                             |
| --------------------- | --------------------------------- |
| Kiinteä kokonaishinta | **85,00 € (sisältää alv 25,5 %)** |
| Josta alv 0 %         | n. 67,73 €                        |

Kertaluonteinen kiinteä hinta — ei tuntiveloitusta. Sisältää yksisivuisen sivuston suunnittelun, toteutuksen suomeksi ja englanniksi, kielivalitsimen, sisällön asettelun (teksti ja kuvat toimitatte te), yhteydenottolomakkeen, Google Business -perustuksen ja julkaisun Cloudflare Pages -alustalle. Etätyönä; ei matkakuluja.

### B. Lisäpalvelu — verkkotunnus cari.fi + Google Workspace (myynti@cari.fi)

| Erä                                                                                | Tuntiarvio | Hinta (alv 0 %)    |
| ---------------------------------------------------------------------------------- | ---------- | ------------------ |
| Verkkotunnuksen cari.fi rekisteröinnin ohjaus + NS-osoitus Cloudflareen            | ~0,5 h     | **37,50 €**        |
| Google Workspace -tilin ja myynti@cari.fi-postilaatikon käyttöönotto (MX/SPF/DKIM) | ~1 h       | **75,00 €**        |
| **Yhteensä (käyttöönottotyö)**                                                     | ~1,5 h     | **112,50 € + alv** |

Käyttöönottotyö laskutetaan vakiotuntihintaan (75 €/h + alv) erillisenä lisänä 85 €:n sivuhinnan päälle — ei sisälly kiinteään hintaan. Tämän lisäksi asiakkaalle tulevat kolmannen osapuolen jatkuvat kulut, laskutetaan asiakkaan nimissä tai kuluveloituksena ilman katetta:

| Jatkuva kulu                      | Arvio                                       | Huomio                                                                                      |
| --------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| cari.fi-verkkotunnus              | n. 15–25 €/vuosi                            | Traficom-rekisteröinti .fi-kelpoisen operaattorin kautta (ei Cloudflaren kautta, ks. alla). |
| Google Workspace Business Starter | n. 6,90 €/kk/käyttäjä + alv (vuosisitoumus) | Kuukausilaskutuksella hieman korkeampi. Yksi postilaatikko (myynti@cari.fi) riittää aluksi. |

**Tekninen huomio:** Cloudflare Registrar ei rekisteröi .fi-päätteisiä verkkotunnuksia — cari.fi pitää rekisteröidä muun, .fi-kelpoisen rekisteröijän kautta (esim. suomalainen operaattori), minkä jälkeen nimipalvelimet osoitetaan Cloudflareen. Itse sivuston hosting (Cloudflare Pages) pysyy silti ilmaisena. **cari.fi:n saatavuus tarkistetaan ennen tilausvahvistusta.**

**Kertaluonteinen kokonaishinta (A + B):** 85 € (sisältää alv) + 112,50 € + alv ≈ **226 € sisältäen alv 25,5 %**, kertaluonteisesti. Sen päälle tulevat kolmannen osapuolen jatkuvat kulut yllä (domain + Workspace).

### C. Laajennettu, useampisivuinen paketti — tuntipankki 10 h

| Erä         | Tuntimäärä   | Hinta (alv 0 %) |
| ----------- | ------------ | --------------- |
| Tuntipankki | 10 h         | **750,00 €**    |
| Voimassa    | 6 kk ostosta | —               |

Jos yksi sivu ei riitä (esim. erillinen palvelut-sivu, referenssit, useampi kieli) — sama Cloudflare-toteutus, laajennettuna monisivuiseksi.

### D. Ylläpito julkaisun jälkeen (valinnainen)

| Sitoumus                          | Hinta (alv 0 %)                     |
| --------------------------------- | ----------------------------------- |
| Pieniä päivityksiä tarpeen mukaan | 75 €/h, laskutus toteutuneen mukaan |
| Kiinteä 4 h / kk                  | **300 €/kk**                        |

Ei pakollinen — moni pienyritys pärjää julkaisun jälkeen ilman kuukausisopimusta ja tilaa päivitykset tarvittaessa tuntiveloituksella. Cloudflare Pages -julkaisu tarkoittaa myös, että pienet tekstipäivitykset ovat nopeita tehdä (muutos → julkaisu muutamassa minuutissa).

### E. Laajempi toteutus (erillinen tarjous)

Esim. verkkokauppa, ajanvarausjärjestelmä tai asiakasportaali. Tarjotaan erikseen, markkinahinta 120–145 €/h tai kiinteä projektihinta.

---

## 4. Hintavertailu ja mitä 85 € kattaa

| Vertailukohta                                                              | Hinta                   | Huomio                                                                                        |
| -------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------- |
| Freelance-toteutus valmiilla työkaluilla (esim. teema-alustat), yksi kieli | 300–600 €               | Kevyt, mutta usein ilman jatkotukea eikä toista kieltä.                                       |
| Web-toimiston yksisivuinen kotisivu                                        | 500–1 500 €             | Sisältää yleensä projektinhallinnan lisäkustannuksen.                                         |
| Vakiotuntihintamme (75 €/h + alv) tälle laajuudelle                        | n. 450 €                | Normaali atk-apu-tuntihintamme, jos laskutettaisiin tuntipankista (ks. version 2.0 historia). |
| **Tämä tarjous**                                                           | **85 € (sisältää alv)** | Kiinteä, kertaluonteinen erikoishinta juuri tähän yksisivuiseen toteutukseen.                 |

85 € on selvästi alle vakiotuntihintamme (75 €/h + alv) laskennallisen hinnan — tämä on tietoinen, kertaluonteinen aloitushinta tälle projektille, ei uusi yleinen SKU-hinta. Kattaa:

1. Senior-tason toteuttajan (Lifetime Oy:n toimitusjohtaja, DWS IQ -alustan tekijä).
2. Cloudflare Pages -hostingin, joka on ilmainen — ei kuukausittaista hosting-laskua, vain verkkotunnus.
3. Yksisivuisen, kaksikielisen sivun suunnittelun, toteutuksen ja julkaisun kokonaan.

Jatkotyö (lisäsivut, -kielet, kuukausiylläpito) laskutetaan standardilla 75 €/h + alv -tuntihinnalla (ks. kohta 3, C ja D) — 85 € koskee vain tätä ensimmäistä yksisivuista toteutusta.

---

## 5. Mitä ei sisälly

- Verkkotunnuksen ja Google Workspacen jatkuvat, kolmannen osapuolen kulut (domain n. 15–25 €/vuosi, Workspace n. 6,90 €/kk/käyttäjä + alv) — laskutetaan asiakkaan nimissä tai kuluveloituksena ilman katetta. Käyttöönottotyö itsessään sisältyy kohtaan 3, vaihtoehto B. Itse sivuston hosting (Cloudflare Pages) on ilmainen.
- Laaja sisällöntuotanto (ammattivalokuvaus, pitkät tekstit, englanninkielisen tekstin ammattikäännös) — asiakas toimittaa tekstit ja kuvat suomeksi, englanninkielisen version teemme peruskäännöksenä osana tuntipankkia; virallinen käännöstoimiston tarkistus sovitaan erikseen jos tarpeen.
- Logo tai laajempi graafinen ilme, jos sitä ei ole vielä olemassa — voidaan tarjota erikseen.
- Lisäkielet (esim. ruotsi, saksa) — voidaan lisätä samaan kielivalitsimeen myöhemmin, ks. kohta 3, vaihtoehto C.
- Verkkokauppa, ajanvaraus tai kirjautuminen — kohta 3, vaihtoehto E, erillinen tarjous.

---

## 6. Aloitus

Sopimisen jälkeen tarvitsemme:

1. Y-tunnuksen ja laskutusosoitteen (verkkolasku).
2. Sisällön suomeksi: yrityksen kuvaus, palvelulista, yhteystiedot, mahdolliset kuvat.
3. Vahvistuksen cari.fi-verkkotunnuksen saatavuudesta ja kuka toimii tilaajana/laskutettavana (rekisteröinti .fi-kelpoisen operaattorin kautta, ei Cloudflaren kautta).
4. Vahvistuksen Google Workspace -laskutuksesta: onko tili jo olemassa, vai perustetaanko uusi tili myynti@cari.fi-postilaatikkoa varten.
5. Lyhyen kartoituspuhelun (30 min, veloitukseton): mitä palveluita halutaan esille ja mikä on tärkein viesti asiakkaille sekä suomeksi että englanniksi.

Kartoituksen jälkeen ensimmäinen luonnos on nähtävissä noin viikon sisällä, ja sivusto, verkkotunnus sekä myynti@cari.fi-postilaatikko julkaisukunnossa.

---

## 7. Yhteystiedot

**Lifetime Oy**
Risto Anton Päärni, toimitusjohtaja
Laidunmaanraitti 2 A 25, 02330 Espoo
Y-tunnus: 0772407-9 | ALV: FI07724079
risto.paarni@lifetime.fi
https://dws10.com

---

## Lähetysohjeet

- **Transport:** Amazon SES SMTP (CLAUDE.md sääntö #4 — ei Resendiä).
- **Lähettäjä:** `risto.paarni@lifetime.fi` — ei koskaan `noreply@` (sääntö #3).
- **Vastaanottaja:** cari.huoltopalvelu@gmail.com — vahvista oikea kirjoitusasu ennen lähetystä.
- **Liite:** tämä tiedosto PDF:nä tai sähköpostin runkona. Lyhyt, lähetysvalmis versio: `TARJOUS_CARIN_HUOLTOPALVELU_VERKKOSIVUT_FI_SHORT.md`.
