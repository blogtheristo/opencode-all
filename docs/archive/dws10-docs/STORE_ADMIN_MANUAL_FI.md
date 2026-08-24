# DWS10.com Verkkokaupan Yllapitajan Kasikirja

**Versio:** 1.0
**Paivamaara:** Tammikuu 2026
**Tekija:** Lifetime Oy
**Alusta:** DWS10.com Verkkokauppa

---

## Sisallysluettelo

1. [Yleiskatsaus](#yleiskatsaus)
2. [Arkkitehtuuri](#arkkitehtuuri)
3. [Tuotehallinta](#tuotehallinta)
4. [Google Merchant Center -integraatio](#google-merchant-center--integraatio)
5. [Maksukasittely (Revolut Business)](#maksukasittely-revolut-business)
6. [Viikoittainen yllapitorutiini](#viikoittainen-yllapitorutiini)
7. [Firehorse-toimintamalli](#firehorse-toimintamalli)
8. [Vianetsinta](#vianetsinta)

---

## Yleiskatsaus

DWS10.com on Lifetime Oy:n yritysverkkokauppa ilmasto-alykkyyden ratkaisuille, vaatimustenmukaisuusohjelmistoille ja ammattimaisille konsultointipalveluille. Kauppa toimii Cloudflare Pages -alustalla staattisella HTML-generoinnilla ja integroituu:

- **Google Merchant Center** (Tili-ID: 8496329) tuotenakyvyydelle
- **Revolut Business** kassan ja maksujen kasittelyyn
- **Claude Code** automatisoituun kaupan yllapitoon Firehorse-mallin kautta

### Tuotekategoriat

| Kategoria | Tuotteet | Hintaluokka |
|-----------|----------|-------------|
| Alustaohjelmistot | DWS IQ v5, v6 | 4 999 - 6 995 EUR |
| Firehorse-tuoteperhe | Automation, Report, CMS, Omnichannel | 499 - 4 950 EUR |
| Konsultointipalvelut | Tunti-, kuukausi-, tyopajahinnoittelu | 98 - 6 250 EUR |
| Koulutus & Valmennus | AI Koulutus, Coach, Mentor | 499 - 6 250 EUR |
| Digitaaliset tuotteet | Sanastot, verkkosivut | 0,99 - 799 EUR |

---

## Arkkitehtuuri

### Tiedostorakenne

```
dws10.com/
├── buy/                    # Kauppasivut
│   ├── index.html         # Paakauppa (Sivu 1)
│   ├── page2/index.html   # Lisakyotteet (Sivu 2)
│   └── page3/index.html   # Konsultointi & Koulutus (Sivu 3)
├── config/
│   └── products.json      # Keskitetty tuotekatalogi
├── feeds/
│   ├── generate-feed.cjs  # Syotteen generointiskripti
│   └── google-products.xml # Google Merchant -syote
├── return-policy/
│   └── index.html         # Palautuskaytanto (Googlen vaatima)
└── docs/                   # Dokumentaatio
```

### Teknologiapino

- **Hosting:** Cloudflare Pages (staattinen HTML)
- **Build:** Node.js syotegeneraattori
- **Maksut:** Revolut Business Checkout Links
- **Analytiikka:** Google Merchant Center
- **Toiminnot:** Claude Code + Firehorse-malli

---

## Tuotehallinta

### Uuden tuotteen lisaaminen

1. **Muokkaa products.json** (`dws10.com/config/products.json`)

```json
{
  "tuote-id": {
    "id": "tuote-id",
    "gtin": null,
    "mpn": "UNIIKKI-MPN-2026",
    "name": "Tuotteen nimi",
    "price": 999,
    "currency": "EUR",
    "type": "one-time",
    "description": "Tuotekuvaus Google Merchantille",
    "priceNote": "Hintahuomautus kaupassa",
    "revolutLink": "https://checkout.revolut.com/pay/...",
    "image": "/static/images/tuote.jpg",
    "detailsUrl": "../buy/",
    "featured": false,
    "google": {
      "productCategory": "Software > Business & Productivity Software",
      "condition": "new",
      "availability": "in_stock",
      "brand": "Lifetime",
      "targetCountry": "FI",
      "contentLanguage": "en"
    }
  }
}
```

2. **Generoi syote**
```bash
cd dws10.com/feeds
node generate-feed.cjs
```

3. **Laheta Google Merchantiin**
```bash
curl -T google-products.xml \
  -u "mc-sftp-8496329:SALASANA" \
  --insecure \
  "sftp://partnerupload.google.com:19321/google-products.xml"
```

### Tuote-ID-ohjeet

- Kayta kuvaavia ID:ita: `DWS-IQ-006`, `FH-AUTO-001`
- Vastaa olemassa olevia Google Merchant ID:ita valttaaksesi duplikaatit
- MPN-muoto: `KATEGORIA-TYYPPI-VUOSI` (esim. `DWSIQ-V6-2026`)

### Hintatyypit

| Tyyppi | Kuvaus | Esimerkki |
|--------|--------|-----------|
| `one-time` | Kertaosto | Alustalisenssit |
| `monthly` | Toistuva tilaus | Neuvontapalvelut |
| `hourly` | Tuntilaskutus | Konsultointi |

---

## Google Merchant Center -integraatio

### Tilitiedot

- **Merchant ID:** 8496329
- **Kohdemaa:** Suomi (FI)
- **Syote-URL:** https://dws10.com/feeds/google-products.xml
- **SFTP-palvelin:** partnerupload.google.com:19321

### Syotevaatimukset

Syotegeneraattori (`generate-feed.cjs`) tuottaa vaatimustenmukaisen XML:n:

- `g:id` - Uniikki tuotetunniste
- `g:mpn` - Valmistajan osanumero
- `g:brand` - "Lifetime" tai "Firehorse"
- `g:price` - Hinta EUR valuutalla
- `g:checkout_link_template` - Revolut-kassan URL
- `g:availability` - Varastotilanne
- `g:condition` - Aina "new"

### Yleiset ongelmat ja ratkaisut

| Ongelma | Syy | Ratkaisu |
|---------|-----|----------|
| Verkkotunnus ei tasmaa | URL:t osoittavat vanhaan domainiin | Paivita `detailsUrl` dws10.com:iin |
| Duplikaattituotteet | ID ei tasmaa Merchant Centeriin | Yhdenmukaista ID:t products.json:ssa |
| Hinta puuttuu | Kentta ei asetettu | Varmista etta `price` on numeerinen |
| identifier_exists-virhe | Asetettu false kun brand+MPN on | Poista kentta tai aseta true |

### SFTP-lataus

```bash
# Laheta syote Google Merchant Centeriin
curl -T google-products.xml \
  -u "mc-sftp-8496329:SALASANASI" \
  --insecure \
  "sftp://partnerupload.google.com:19321/google-products.xml"
```

Huom: URL-koodaa erikoismerkit salasanassa (esim. `$` muuttuu `%24`)

---

## Maksukasittely (Revolut Business)

### Kassalinkit

Jokaisella tuotteella voi olla oma Revolut-kassalinkki:

```json
"revolutLink": "https://checkout.revolut.com/pay/f023d433-0bf4-48fa-98cd-494de448df39"
```

Jos erityista linkkia ei ole asetettu, kaytetaan varalinkkia:
- **Varalinkki:** `https://revolut.me/lifetimeoy`

### Kassalinkkien luominen

1. Kirjaudu Revolut Businessiin
2. Siirry kohtaan **Accept Payments** > **Payment Links**
3. Luo uusi maksulinkki:
   - Tuotteen nimi
   - Kiintea hinta
   - Kuvaus
4. Kopioi kassan URL products.json-tiedostoon

### Revolut-integraation edut

- **Valittaomat tilitykset** yritystilille
- **Monivaluuttatuki** (EUR ensisijainen)
- **Matalat maksut** verrattuna perinteisiin prosessoreihin
- **Suora Google Merchant -integraatio** `checkout_link_template`:n kautta

---

## Viikoittainen yllapitorutiini

### Maanantai: Syotteen terveystarkastus

1. **Tarkista Google Merchant Center -tila**
   - Kirjaudu Merchant Centeriin
   - Kasitttele tuotediagnostiikka
   - Kirjaa ylhaan hylatyt tuotteet

2. **Varmista syotteen tuoreus**
   - Tarkista `lastUpdated`-aikaleima products.json:ssa
   - Generoi syote uudelleen jos yli 7 paivaa vanha

### Keskiviikko: Suorituskyvyn arviointi

1. **Kasittele Google Merchant -mittarit**
   - Nayttokerrat
   - Klikkaukset
   - Klikkausprosentti (CTR)

2. **Tunnista alitehoavat tuotteet**
   - Vahaiset naytot: Paranna otsikoita/kuvauksia
   - Matala CTR: Paivita kuvat tai hinnoittelu

### Perjantai: Optimointi

1. **Toteuta parannukset**
   - Paivita tuotekuvaukset
   - Lisaa uusia Revolut-linkkeja
   - Paivita tuotekuvat

2. **Laheta paivitetty syote**
   - Aja syotegeneraattori
   - SFTP-lataus Googleen

### Kuukausittain: Katalogin tarkistus

1. **Tuoteauditointi**
   - Poista lopetetut tuotteet
   - Lisaa uudet tarjoamat
   - Paivita hinnoittelu

2. **Kilpailija-analyysi**
   - Kasittele markkinahinnoittelu
   - Saada asemointia

---

## Firehorse-toimintamalli

### Yleiskatsaus

Firehorse on Lifetimen tekoalyavusteinen toimintamalli, joka kayttaa Claude Codea automatisoituun kaupan yllapitoon. Tama mahdollistaa:

- **Nopeat tuotepaivitykset** luonnollisella kielella
- **Automatisoidun syotteen generoinnin** ja latauksen
- **Dokumentaation generoinnin** (tama kasikirja)
- **Koodiavusteisen vianmaaityksen**

### Tyonkulku Claude Coden kanssa

1. **Tuotemuutokset**
   ```
   Kayttaja: "Lisaa uusi tuote X hintaan 999 EUR"
   Claude: Paivittaa products.json, generoi syotteen, lahettaa Googleen
   ```

2. **Kaupan yllapito**
   ```
   Kayttaja: "Tarkista Google Merchant -tila"
   Claude: Analysoi syotteen, tunnistaa ongelmat, ehdottaa korjauksia
   ```

3. **Dokumentaatio**
   ```
   Kayttaja: "Luo yllapitokasikirja"
   Claude: Generoi kattavan dokumentaation
   ```

### Edut

- **Nopeus:** Tuotepaivitykset minuuteissa, ei tunneissa
- **Tarkkuus:** Automatisoitu validointi estaa virheet
- **Johdonmukaisuus:** Standardoidut prosessit
- **Jaljitettavyys:** Git-historia kaikille muutoksille

### Git-tyonkulku

Kaikki muutokset seurataan git-haaroissa:
- Ominaisuushaarat: `claude/<ominaisuus>-<id>`
- Pull requestit tarkistukseen
- Main-haara tuotantoa varten

---

## Vianetsinta

### Syotteen generointi epaonnistuu

```bash
# Tarkista etta Node.js on asennettu
node --version

# Aja yksityiskohtaisella tulosteella
cd dws10.com/feeds
node generate-feed.cjs
```

### SFTP-lataus epaonnistuu

1. **Tarkista tunnukset**
   - Kayttajatunnus: `mc-sftp-8496329`
   - Salasana: URL-koodaa erikoismerkit

2. **Testaa yhteys**
   ```bash
   curl -v --insecure "sftp://partnerupload.google.com:19321/"
   ```

### Tuote ei nay

1. Tarkista Google Merchant Center -diagnostiikka
2. Varmista etta tuote-ID tasmaa syotteeseen
3. Varmista etta kaikki pakolliset kentat ovat mukana
4. Odota 24-48 tuntia kasittelya varten

### Maksulinkki ei toimi

1. Varmista etta Revolut-linkki on aktiivinen
2. Tarkista linkin muoto products.json:ssa
3. Testaa kassavirta manuaalisesti

---

## Yhteystiedot ja tuki

- **Tekninen tuki:** support@lifetime.fi
- **Myyntikyselyt:** sales@lifetime.fi
- **Revolut Business:** Lifetime Oy -tili
- **Google Merchant:** Tili 8496329

---

*Dokumentti generoitu Firehorse-toimintamallilla Claude Coden avulla*
*Viimeksi paivitetty: Tammikuu 2026*
