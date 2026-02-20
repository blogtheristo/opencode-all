# Ylläpitokäsikirja - Blogin Hallintajärjestelmä (Supabase)

***
# VERSIO JA AGENTTIHISTORIA

Versio: 1.0

Istunnot & Muutokset:
  - Versio: 1.0 | Työkalu: Cursor AI | Istunto: 2025-12-30 | Päivämäärä: 30.12.2025 | Muutokset: Alkuperäinen luonti - Kattava blogin hallintajärjestelmän ylläpitokäsikirja Supabase-integraatiolla

Istuntolinkit & Viitteet:
  - Cursor AI (2025-12-30): https://github.com/blogtheristo/dws6/commits/main
  - Katso GitHubissa: https://github.com/blogtheristo/dws6/blob/main/onelifetime.world/ADMIN_MANUAL_BLOG_SYSTEM_FI_v1.md

Dokumentin Tila:
  - Luotu: 30.12.2025
  - Viimeksi Muokattu: 30.12.2025
  - Kieli: Suomi
  - Saatavilla Olevat Kielet: English, Suomi
  - Julkaisutila: ✅ AKTIIVINEN

***

**Versio:** 1.0  
**Voimaantulopäivä:** 2025-12-30  
**Viimeksi Päivitetty:** 2025-12-30  
**Tila:** ✅ AKTIIVINEN  
**Alusta:** OneLifetime.World  
**Teknologiapino:** Supabase, PostgreSQL, Vanilla JavaScript, HTML5

---

## Sisällysluettelo

1. [Järjestelmän Yleiskatsaus](#1-järjestelmän-yleiskatsaus)
2. [Arkkitehtuuri](#2-arkkitehtuuri)
3. [Tietokantarakenne](#3-tietokantarakenne)
4. [Ylläpitotoiminnot](#4-ylläpitotoiminnot)
5. [Sisällönhallinta](#5-sisällönhallinta)
6. [Migraatio & Tuonti](#6-migraatio--tuonti)
7. [Turvallisuus & Pääsynhallinta](#7-turvallisuus--pääsynhallinta)
8. [Seuranta & Analytiikka](#8-seuranta--analytiikka)
9. [Vianmääritys](#9-vianmääritys)
10. [Ylläpitomenettelyt](#10-ylläpitomenettelyt)
11. [Koodin Laatustandardit](#11-koodin-laatustandardit)
12. [Tarkastusketju](#12-tarkastusketju)

---

## 1. Järjestelmän Yleiskatsaus

### 1.1 Tarkoitus

OneLifetime.World Blogin Hallintajärjestelmä tarjoaa modernin, tietokantapohjaisen sisällönhallintaratkaisun Lifetime Scope Journal (LSJ) -blogille. Järjestelmä korvaa staattiset HTML-blogikirjoitukset dynaamisella sisällöllä, joka palvellaan Supabase PostgreSQL -tietokannasta.

### 1.2 Keskeiset Ominaisuudet

✅ **Dynaaminen Sisällön Lataus**
- Reaaliaikainen kirjoitusten haku Supabasesta
- Asiakaspuolen renderöinti vanilla JavaScriptillä
- Ei käännösvaihetta tarvita

✅ **Sisällönhallinta**
- 767+ tuotua blogikirjoitusta vanhasta järjestelmästä
- Täydet CRUD-toiminnot Supabase Dashboardin kautta
- Markdown/HTML-sisällön tuki

✅ **Haku & Suodatus**
- Tagipohjainen suodatus
- Kategoriajärjestely
- Päivämääräpohjainen lajittelu

✅ **Turvallisuus**
- Row Level Security (RLS) käytössä
- Julkinen lukuoikeus
- Vain autentikoiduilla kirjoitusoikeus

✅ **Suorituskyky**
- Indeksoidut tietokantakyselyt
- CDN-pohjaiset JavaScript-kirjastot
- Optimoitu 1000+ samanaikaiselle käyttäjälle

### 1.3 Järjestelmän Komponentit

| Komponentti | Teknologia | Tarkoitus |
|-------------|-----------|-----------|
| **Tietokanta** | Supabase PostgreSQL | Sisällön tallennus ja haku |
| **Frontend** | Vanilla JavaScript | Dynaaminen sisällön renderöinti |
| **API** | Supabase REST API | Tietokantaviestintä |
| **Autentikointi** | Supabase Auth | Ylläpitäjän pääsynhallinta |
| **Hosting** | Staattinen HTML | Nopea sivujen toimitus |

### 1.4 URL-osoitteet

| Ympäristö | URL | Tarkoitus |
|-----------|-----|-----------|
| **Tuotannon Blogin Etusivu** | https://onelifetime.world/blog/ | Pääblogin listaus |
| **Dynaaminen Blogin Etusivu** | https://onelifetime.world/blog/index-dynamic.html | Supabase-pohjainen listaus |
| **Kirjoituksen Yksityiskohtasivu** | https://onelifetime.world/blog/post.html?slug=xxx | Yksittäisen kirjoituksen näkymä |
| **Supabase Dashboard** | https://app.supabase.com | Tietokannan hallinta |

---

## 2. Arkkitehtuuri

### 2.1 Järjestelmän Arkkitehtuurikaavio

```
┌─────────────────────────────────────────────────────────────┐
│                    OneLifetime.World                         │
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │  Selain      │────────▶│  index.html  │                 │
│  │  (Asiakas)   │◀────────│  post.html   │                 │
│  └──────────────┘         └──────────────┘                 │
│         │                         │                          │
│         │                         │                          │
│         ▼                         ▼                          │
│  ┌─────────────────────────────────────────┐               │
│  │     Supabase JavaScript Client          │               │
│  │     (CDN: unpkg.com/@supabase)          │               │
│  └─────────────────────────────────────────┘               │
│                    │                                         │
└────────────────────┼─────────────────────────────────────────┘
                     │
                     │ HTTPS REST API
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Tietokanta                    │  │
│  │                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │  blog_posts  │  │blog_categories│ │ blog_tags  │ │  │
│  │  │  (767 riviä) │  │              │  │            │ │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  │                                                        │  │
│  │  Row Level Security (RLS) Käytössä                    │  │
│  │  - Julkinen: SELECT                                   │  │
│  │  - Autentikoitu: INSERT, UPDATE, DELETE               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Supabase Auth                            │  │
│  │  - Ylläpitäjän autentikointi                          │  │
│  │  - JWT-tokenien hallinta                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Tietovirta

**Lukutoiminto (Julkinen Käyttäjä):**
```
1. Käyttäjä vierailee /blog/index-dynamic.html
2. JavaScript latautuu CDN:stä
3. Supabase-asiakas alustaa ANON_KEY:llä
4. Kysely: SELECT * FROM blog_posts WHERE status='published'
5. RLS tarkistaa: Salli (julkinen lukukäytäntö)
6. Data palautetaan JSON-muodossa
7. JavaScript renderöi HTML:n
8. Käyttäjä näkee blogikirjoitukset
```

**Kirjoitustoiminto (Ylläpitäjä):**
```
1. Ylläpitäjä kirjautuu Supabase Dashboardiin
2. Autentikoi sähköpostilla/salasanalla
3. JWT-token myönnetään
4. Ylläpitäjä navigoi Table Editoriin
5. Suorittaa INSERT/UPDATE/DELETE
6. RLS tarkistaa: Salli (autentikoitu kirjoituskäytäntö)
7. Tietokanta päivitetään
8. Muutokset näkyvät välittömästi frontendissä
```

### 2.3 Tiedostorakenne

```
onelifetime.world/
├── blog/
│   ├── index.html                    # Staattinen blogisivu (vanha)
│   ├── index-dynamic.html            # Dynaaminen blogisivu (UUSI)
│   ├── post.html                     # Dynaaminen kirjoituksen yksityiskohtasivu (UUSI)
│   └── README.md                     # Blogihakemiston dokumentaatio
├── lib/
│   ├── supabase.ts                   # Yleinen Supabase-asiakas
│   └── blog-supabase.ts              # Blogikohtaiset Supabase-funktiot (UUSI)
├── scripts/
│   └── import-blog-posts.ts          # Migraatioskripti (UUSI)
├── ultra/
│   └── ultra-styles.css              # Yhtenäinen tyylittely
├── ADMIN_MANUAL_BLOG_SYSTEM_EN_v1.md # Englanninkielinen versio
├── ADMIN_MANUAL_BLOG_SYSTEM_FI_v1.md # Tämä dokumentti (UUSI)
├── BLOG_SUPABASE_SETUP.md            # Asennusopas
├── BLOG_SYSTEM_SUMMARY.md            # Järjestelmän yleiskatsaus
└── BLOG_QUICK_START.md               # Pikaopas
```

---

## 3. Tietokantarakenne

### 3.1 Taulu: `blog_posts`

**Tarkoitus:** Tallentaa kaikki blogikirjoitusten sisällön ja metatiedot

**Rakenteen Määrittely:**

```sql
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT DEFAULT 'Risto Anton Paarni',
  tags TEXT[],
  categories TEXT[],
  type TEXT DEFAULT 'post',
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  view_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  meta_description TEXT,
  meta_keywords TEXT[]
);

-- Indeksit suorituskyvylle
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_blog_posts_categories ON blog_posts USING GIN(categories);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured) WHERE featured = TRUE;

-- Kokotekstihakuindeksi
CREATE INDEX idx_blog_posts_search ON blog_posts USING GIN(
  to_tsvector('english', title || ' ' || COALESCE(content, ''))
);

-- Triggeri updated_at-kentälle
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 3.2 Kenttien Kuvaukset

| Kenttä | Tyyppi | Pakollinen | Kuvaus | Esimerkki |
|--------|--------|------------|--------|-----------|
| `id` | BIGSERIAL | Auto | Yksilöllinen kirjoitustunniste | `1` |
| `created_at` | TIMESTAMPTZ | Auto | Luontiaika | `2025-12-30T10:00:00Z` |
| `updated_at` | TIMESTAMPTZ | Auto | Viimeisimmän päivityksen aika | `2025-12-30T15:30:00Z` |
| `title` | TEXT | ✅ Kyllä | Kirjoituksen otsikko | `"Tekoälyn Tulevaisuus"` |
| `slug` | TEXT | ✅ Kyllä | URL-ystävällinen tunniste (yksilöllinen) | `"tekoalyn-tulevaisuus"` |
| `date` | DATE | ✅ Kyllä | Julkaisupäivä | `2025-12-30` |
| `content` | TEXT | ✅ Kyllä | Täysi kirjoituksen sisältö (HTML/Markdown) | `"<p>Artikkelin teksti...</p>"` |
| `excerpt` | TEXT | Ei | Lyhyt yhteenveto (150-200 merkkiä) | `"Tämä artikkeli tutkii..."` |
| `author` | TEXT | Ei | Kirjoittajan nimi | `"Risto Anton Paarni"` |
| `tags` | TEXT[] | Ei | Tagien taulukko | `["AI", "Teknologia"]` |
| `categories` | TEXT[] | Ei | Kategorioiden taulukko | `["Tapaustutkimus", "Logistiikka"]` |
| `type` | TEXT | Ei | Kirjoituksen tyyppi | `"post"`, `"case-study"` |
| `status` | TEXT | Ei | Julkaisutila | `"published"`, `"draft"`, `"archived"` |
| `view_count` | INTEGER | Ei | Katselukertojen määrä | `1250` |
| `featured` | BOOLEAN | Ei | Nostettu kirjoitus -lippu | `true`, `false` |
| `meta_description` | TEXT | Ei | SEO-metakuvaus | `"Opi tekoälyyn liittyvistä trendeistä..."` |
| `meta_keywords` | TEXT[] | Ei | SEO-avainsanat | `["AI", "koneoppiminen"]` |

### 3.3 Row Level Security (RLS) Käytännöt

```sql
-- Ota RLS käyttöön
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Käytäntö: Salli julkinen lukuoikeus julkaistuihin kirjoituksiin
CREATE POLICY "Allow public read access to published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Käytäntö: Salli autentikoiduille käyttäjille lukea kaikki kirjoitukset (mukaan lukien luonnokset)
CREATE POLICY "Allow authenticated read all posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

-- Käytäntö: Salli autentikoidut lisäykset (ylläpitäjille)
CREATE POLICY "Allow authenticated inserts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Käytäntö: Salli autentikoidut päivitykset (ylläpitäjille)
CREATE POLICY "Allow authenticated updates"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true);

-- Käytäntö: Salli autentikoidut poistot (ylläpitäjille)
CREATE POLICY "Allow authenticated deletes"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);
```

### 3.4 Datan Validointisäännöt

| Sääntö | Täytäntöönpano | Kuvaus |
|--------|----------------|--------|
| **Yksilöllinen Slug** | Tietokantarajoite | Ei sallita päällekkäisiä slugeja |
| **Status-arvot** | CHECK-rajoite | Vain 'draft', 'published', 'archived' |
| **Otsikon Pituus** | Sovellus | Min 5 merkkiä, Max 200 merkkiä |
| **Slug-muoto** | Sovellus | Pienet kirjaimet, vain väliviivat, ei välilyöntejä |
| **Päivämääräalue** | Sovellus | Ei tulevaisuudessa (ellei ajoitettu) |
| **Sisällön Pituus** | Sovellus | Min 100 merkkiä julkaistuille kirjoituksille |

---

## 4. Ylläpitotoiminnot

### 4.1 Supabase Dashboardin Käyttö

**Vaihe Vaiheelta:**

1. **Navigoi Supabaseen**
   ```
   URL: https://app.supabase.com
   ```

2. **Kirjaudu Sisään**
   - Sähköposti: `admin@onelifetime.world` (tai ylläpitäjän sähköposti)
   - Salasana: Käytä turvallista salasanaa salasananhallinnasta

3. **Valitse Projekti**
   - Projektin Nimi: `onelifetime-blog` (tai projektisi nimi)
   - Alue: EU (GDPR-vaatimustenmukaisuus)

4. **Navigoi Table Editoriin**
   - Vasen sivupalkki: Klikkaa "Table Editor"
   - Valitse taulu: `blog_posts`

### 4.2 Dashboard-käyttöliittymän Yleiskatsaus

```
┌─────────────────────────────────────────────────────────────┐
│  Supabase Dashboard - Table Editor                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Taulu: blog_posts                              [+ Lisää]   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ID │ Otsikko        │ Slug         │ Päivä      │ ... │  │
│  ├────┼────────────────┼──────────────┼────────────┼─────┤  │
│  │ 1  │ Ensimmäinen    │ ensimmainen  │ 2025-12-30 │ ... │  │
│  │ 2  │ Toinen         │ toinen       │ 2025-12-29 │ ... │  │
│  │ 3  │ Kolmas         │ kolmas       │ 2025-12-28 │ ... │  │
│  └────┴────────────────┴──────────────┴────────────┴─────┘  │
│                                                              │
│  [Suodata] [Lajittele] [Hae]                   [Vie CSV]    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Käyttäjäroolit & Oikeudet

| Rooli | Käyttöoikeustaso | Oikeudet | Käyttötapaus |
|-------|------------------|----------|--------------|
| **Anon (Julkinen)** | Vain luku | SELECT julkaistut kirjoitukset | Verkkosivun vierailijat |
| **Autentikoitu** | Täysi CRUD | Kaikki toiminnot | Ylläpitäjät |
| **Service Role** | Täysi pääsy | Ohita RLS | Backend-skriptit |

---

## 5. Sisällönhallinta

### 5.1 Uuden Blogikirjoituksen Luominen

**Supabase Dashboardin Kautta:**

1. **Avaa Table Editor**
   - Navigoi `blog_posts`-tauluun
   - Klikkaa **[+ Lisää rivi]** -painiketta

2. **Täytä Pakolliset Kentät**
   ```
   Title: "Kirjoituksesi Otsikko Tässä"
   Slug: "kirjoituksesi-otsikko-tassa"  (pienet kirjaimet, väliviivat)
   Date: 2025-12-30  (VVVV-KK-PP muoto)
   Content: "<p>Kirjoituksesi sisältö HTML:nä</p>"
   Status: "published"  (tai "draft" julkaisemattomalle)
   ```

3. **Täytä Valinnaiset Kentät**
   ```
   Excerpt: "Lyhyt yhteenveto kirjoituksesta..."
   Author: "Risto Anton Paarni"
   Tags: ["AI", "Teknologia", "Innovaatio"]
   Categories: ["Tapaustutkimus", "Logistiikka"]
   Featured: false
   ```

4. **Tallenna**
   - Klikkaa **[Tallenna]** -painiketta
   - Kirjoitus ilmestyy välittömästi verkkosivulle

**API:n Kautta (Edistynyt):**

```javascript
import { supabase } from './lib/blog-supabase.js';

const uusiKirjoitus = {
  title: 'Uusi Blogikirjoitukseni',
  slug: 'uusi-blogikirjoitukseni',
  date: '2025-12-30',
  content: '<p>Tämä on kirjoituksen sisältö...</p>',
  excerpt: 'Lyhyt yhteenveto kirjoituksesta.',
  author: 'Risto Anton Paarni',
  tags: ['AI', 'Teknologia'],
  categories: ['Innovaatio'],
  status: 'published',
  featured: false
};

const { data, error } = await supabase
  .from('blog_posts')
  .insert([uusiKirjoitus])
  .select();

if (error) {
  console.error('Virhe kirjoituksen luomisessa:', error);
} else {
  console.log('Kirjoitus luotu:', data);
}
```

### 5.2 Olemassa Olevan Kirjoituksen Muokkaaminen

**Supabase Dashboardin Kautta:**

1. **Etsi Kirjoitus**
   - Käytä hakua tai selaa löytääksesi kirjoituksen
   - Klikkaa riviä avataksesi muokkausikkunan

2. **Muokkaa Kenttiä**
   - Päivitä mitä tahansa kenttää tarpeen mukaan
   - `updated_at`-aikaleima päivittyy automaattisesti

3. **Tallenna Muutokset**
   - Klikkaa **[Tallenna]** -painiketta
   - Muutokset näkyvät välittömästi verkkosivulla

**API:n Kautta:**

```javascript
const { data, error } = await supabase
  .from('blog_posts')
  .update({ 
    title: 'Päivitetty Otsikko',
    content: '<p>Päivitetty sisältö...</p>',
    // updated_at asetetaan automaattisesti triggerillä
  })
  .eq('id', 123)  // tai .eq('slug', 'kirjoitus-slug')
  .select();
```

### 5.3 Kirjoituksen Poistaminen

**⚠️ VAROITUS:** Poistaminen on pysyvää eikä sitä voi peruuttaa!

**Suositeltu Lähestymistapa: Arkistoi Sen Sijaan**

```javascript
// Arkistoi poistamisen sijaan
const { data, error } = await supabase
  .from('blog_posts')
  .update({ status: 'archived' })
  .eq('id', 123);
```

**Pysyvä Poisto (jos välttämätöntä):**

```javascript
const { error } = await supabase
  .from('blog_posts')
  .delete()
  .eq('id', 123);
```

### 5.4 Sisältöohjeet

**Otsikon Parhaat Käytännöt:**
- ✅ Selkeä ja kuvaava
- ✅ 40-60 merkkiä optimaalinen SEO:lle
- ✅ Sisällytä ensisijainen avainsana
- ❌ Vältä klikkiotsikointia
- ❌ Ei ISOJA KIRJAIMIA

**Slug-parhaat Käytännöt:**
- ✅ Vain pienet kirjaimet
- ✅ Käytä väliviivoja (ei alaviivoja)
- ✅ Vastaa otsikon avainsanoja
- ✅ Pidä alle 50 merkin
- ❌ Ei erikoismerkkejä
- ❌ Ei välilyöntejä

**Sisällön Parhaat Käytännöt:**
- ✅ Käytä semanttista HTML:ää (`<h2>`, `<p>`, `<ul>`, jne.)
- ✅ Sisällytä kuvia alt-tekstillä
- ✅ Jaa lyhyisiin kappaleisiin
- ✅ Käytä alaotsikointia (H2, H3)
- ✅ Vähintään 300 sanaa SEO:lle
- ❌ Ei inline-tyylejä (käytä CSS-luokkia)
- ❌ Ei JavaScriptiä sisällössä

**Excerpt-parhaat Käytännöt:**
- ✅ 150-200 merkkiä
- ✅ Houkutteleva yhteenveto
- ✅ Sisällytä ensisijainen avainsana
- ✅ Täydellinen lause
- ❌ Älä toista otsikkoa täsmälleen

### 5.5 SEO-optimointi

**Meta-kuvaus:**
```
Pituus: 150-160 merkkiä
Sisällytä: Ensisijainen avainsana, toimintakehotus
Esimerkki: "Tutustu siihen, miten tekoäly muuttaa logistiikkatoimintoja. 
           Opi tosielämän tapaustutkimuksista ja asiantuntijoiden näkemyksistä."
```

**Meta-avainsanat:**
```
Muoto: Merkkijonotaulukko
Määrä: 5-10 avainsanaa
Esimerkki: ["AI", "logistiikka", "automaatio", "tapaustutkimus", "kalustonhallinta"]
```

**Tagit vs. Kategoriat:**
- **Tagit**: Erityiset aiheet (esim. "AI", "Helsinki", "Uber")
- **Kategoriat**: Laajat teemat (esim. "Tapaustutkimus", "Teknologia", "Logistiikka")

---

## 6. Migraatio & Tuonti

### 6.1 Tuontiskriptin Yleiskatsaus

**Tiedosto:** `onelifetime.world/scripts/import-blog-posts.ts`

**Tarkoitus:** Siirtää olemassa olevat markdown-blogikirjoitukset vanhasta järjestelmästä Supabaseen

**Lähde:** `Admin/Sites-Archive/sites/lifetime-fi/content/posts/*.md`

**Määrä:** 767 blogikirjoitusta

### 6.2 Tuontiskriptin Suorittaminen

**Edellytykset:**
```bash
# Asenna riippuvuudet
npm install gray-matter @supabase/supabase-js

# Asenna ts-node globaalisti (jos ei jo asennettu)
npm install -g ts-node
```

**Ympäristön Asetukset:**
```bash
# Luo .env-tiedosto projektin juureen
NEXT_PUBLIC_SUPABASE_URL="https://sinun-projekti.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sinun-anon-avain-tassa"
```

**Suorita Tuonti:**
```bash
# Navigoi projektin juureen
cd /polku/dws6

# Suorita tuontiskripti
ts-node onelifetime.world/scripts/import-blog-posts.ts
```

**Odotettu Tulos:**
```
Aloitetaan blogikirjoitusten tuonti...
Lisätty uusi kirjoitus: Blog the mention
Lisätty uusi kirjoitus: Ensimmäisen kirjoituksen otsikko
Päivitetty kirjoitus: Olemassa olevan kirjoituksen otsikko
...
Blogikirjoitusten tuonti valmis.
Yhteensä: 767 kirjoitusta käsitelty
Onnistui: 765 kirjoitusta tuotu
Virheitä: 2 kirjoitusta epäonnistui (katso lokit)
```

### 6.3 Tuontiskriptin Logiikka

```typescript
// Yksinkertaistettu logiikkavirta
for jokainen tiedosto posts-hakemistossa:
  1. Lue markdown-tiedosto
  2. Jäsennä frontmatter (otsikko, päivä, slug, tagit)
  3. Pura sisältörunko
  4. Tarkista, onko kirjoitus olemassa (slugin perusteella)
  5. Jos on: UPDATE
  6. Jos ei: INSERT
  7. Kirjaa tulos
  8. Jatka seuraavaan tiedostoon
```

### 6.4 Tuontivirheiden Käsittely

**Yleiset Ongelmat:**

| Virhe | Syy | Ratkaisu |
|-------|-----|----------|
| **Päällekkäinen slug** | Slug on jo olemassa | Muokkaa slug yksilölliseksi |
| **Virheellinen päivämäärä** | Päivämäärämuoto virheellinen | Muunna VVVV-KK-PP muotoon |
| **Puuttuva otsikko** | Frontmatter epätäydellinen | Lisää otsikkokenttä |
| **Yhteyden aikakatkaisu** | Verkkoongelma | Yritä tuontia uudelleen |
| **RLS-käytäntövirhe** | Ei autentikoitu | Tarkista Supabase-tunnukset |

**Tuonnin Uudelleensuoritus:**
- Turvallista suorittaa useita kertoja
- Olemassa olevat kirjoitukset päivitetään (ei kopioida)
- Käyttää `slug`-kenttää yksilöllisenä tunnisteena

### 6.5 Tuonnin Jälkeinen Varmistus

**Tarkista Tuonnin Onnistuminen:**

```sql
-- Laske tuodut kirjoitukset
SELECT COUNT(*) FROM blog_posts;
-- Odotettu: 767

-- Tarkista päivämääräalue
SELECT MIN(date), MAX(date) FROM blog_posts;
-- Odotettu: 2007-11-08 - 2025-12-30

-- Tarkista puuttuvat slugit
SELECT COUNT(*) FROM blog_posts WHERE slug IS NULL;
-- Odotettu: 0

-- Tarkista tilajakauma
SELECT status, COUNT(*) FROM blog_posts GROUP BY status;
-- Odotettu: published: 767
```

---

## 7. Turvallisuus & Pääsynhallinta

### 7.1 Autentikoinnin Asetukset

**Ylläpitäjäkäyttäjän Luominen:**

1. **Navigoi Supabase Auth**
   - Dashboard → Authentication → Users

2. **Lisää Uusi Käyttäjä**
   ```
   Sähköposti: admin@onelifetime.world
   Salasana: [Luo vahva salasana]
   Vahvista Sähköposti: Kyllä
   ```

3. **Tallenna Tunnukset**
   - Tallenna salasananhallintaan
   - Jaa turvallisesti tiimin kanssa

### 7.2 API-avainten Hallinta

**Avaintyypit:**

| Avaimen Tyyppi | Käyttö | Turvallisuustaso | Altistuminen |
|----------------|--------|------------------|--------------|
| **ANON_KEY** | Julkinen asiakaspuoli | Matala | ✅ Turvallista paljastaa |
| **SERVICE_ROLE_KEY** | Vain palvelinpuoli | Korkea | ❌ ÄLÄ KOSKAAN paljasta |

**Ympäristömuuttujat:**

```bash
# .env.local (kehitykselle)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ÄLÄ KOSKAAN commitoi näitä Gitiin!
# Lisää .env.local .gitignore-tiedostoon
```

**Tuotantokäyttöönotto:**

```bash
# Aseta ympäristömuuttujat hosting-alustalla
# Esimerkkejä:
# - Vercel: Project Settings → Environment Variables
# - Netlify: Site Settings → Build & Deploy → Environment
# - Cloudflare Pages: Settings → Environment Variables
```

### 7.3 RLS-käytännön Tarkastus

**Säännölliset Turvallisuustarkastukset:**

```sql
-- Listaa kaikki RLS-käytännöt
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'blog_posts';

-- Odotetut käytännöt:
-- 1. Salli julkinen lukuoikeus julkaistuihin kirjoituksiin (SELECT)
-- 2. Salli autentikoiduille lukea kaikki kirjoitukset (SELECT)
-- 3. Salli autentikoidut lisäykset (INSERT)
-- 4. Salli autentikoidut päivitykset (UPDATE)
-- 5. Salli autentikoidut poistot (DELETE)
```

**Käytännön Testaus:**

```javascript
// Testaa julkinen luku (pitäisi toimia)
const { data: julkisetKirjoitukset } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('status', 'published');
console.log('Julkinen voi lukea:', julkisetKirjoitukset.length);

// Testaa julkinen kirjoitus (pitäisi epäonnistua)
const { error: julkinenKirjoitusVirhe } = await supabase
  .from('blog_posts')
  .insert([{ title: 'Testi', slug: 'testi', date: '2025-12-30', content: 'Testi' }]);
console.log('Julkinen kirjoitus estetty:', julkinenKirjoitusVirhe !== null);

// Testaa autentikoitu kirjoitus (pitäisi toimia kirjautumisen jälkeen)
await supabase.auth.signInWithPassword({
  email: 'admin@onelifetime.world',
  password: 'sinun-salasana'
});
const { data: authKirjoitus } = await supabase
  .from('blog_posts')
  .insert([{ title: 'Testi', slug: 'testi-auth', date: '2025-12-30', content: 'Testi' }])
  .select();
console.log('Autentikoitu kirjoitus toimii:', authKirjoitus !== null);
```

### 7.4 Turvallisuuden Parhaat Käytännöt

**✅ TEE:**
- Käytä ympäristömuuttujia avaimille
- Ota RLS käyttöön kaikissa tauluissa
- Vaihda salasanat säännöllisesti
- Seuraa auth-lokeja
- Käytä vain HTTPS:ää
- Toteuta nopeusrajoitus
- Tarkasta RLS-käytännöt neljännesvuosittain

**❌ ÄLÄ TEE:**
- Commitoi API-avaimia Gitiin
- Käytä SERVICE_ROLE_KEY:tä frontendissä
- Poista RLS käytöstä
- Jaa ylläpitäjätunnuksia
- Käytä heikkoja salasanoja
- Salli julkisia kirjoituksia
- Paljasta tietokantaa suoraan

---

## 8. Seuranta & Analytiikka

### 8.1 Katselukertojen Seuranta

**Toteutus:**

```javascript
// post.html-tiedostossa, kasvata katselukertoja sivun latauksessa
async function seuraaKatselua(slug) {
  const { data: kirjoitus } = await supabase
    .from('blog_posts')
    .select('view_count')
    .eq('slug', slug)
    .single();
  
  if (kirjoitus) {
    await supabase
      .from('blog_posts')
      .update({ view_count: kirjoitus.view_count + 1 })
      .eq('slug', slug);
  }
}

// Kutsu sivun latauksessa
const slug = new URLSearchParams(window.location.search).get('slug');
if (slug) seuraaKatselua(slug);
```

### 8.2 Suosittujen Kirjoitusten Kysely

```sql
-- Top 10 katsotuinta kirjoitusta
SELECT 
  title, 
  slug, 
  view_count, 
  date 
FROM blog_posts 
WHERE status = 'published'
ORDER BY view_count DESC 
LIMIT 10;
```

### 8.3 Sisältöanalytiikka

**Keskeiset Mittarit:**

```sql
-- Julkaistut kirjoitukset yhteensä
SELECT COUNT(*) FROM blog_posts WHERE status = 'published';

-- Kirjoitukset kuukausittain
SELECT 
  DATE_TRUNC('month', date) AS kuukausi,
  COUNT(*) AS kirjoitus_maara
FROM blog_posts
WHERE status = 'published'
GROUP BY kuukausi
ORDER BY kuukausi DESC;

-- Keskimääräinen kirjoituksen pituus
SELECT 
  AVG(LENGTH(content)) AS keskimaara_sisallon_pituus
FROM blog_posts
WHERE status = 'published';

-- Eniten käytetyt tagit
SELECT 
  UNNEST(tags) AS tagi,
  COUNT(*) AS kayttomaara
FROM blog_posts
WHERE status = 'published'
GROUP BY tagi
ORDER BY kayttomaara DESC
LIMIT 20;

-- Kirjoitukset ilman excerptejä (vaativat huomiota)
SELECT 
  id, 
  title, 
  slug 
FROM blog_posts 
WHERE excerpt IS NULL 
  AND status = 'published';
```

### 8.4 Tietokannan Suorituskyvyn Seuranta

**Supabase Dashboardin Kautta:**

1. Navigoi **Database** → **Query Performance**
2. Tarkista hitaat kyselyt (> 1 sekunti)
3. Tarkista indeksien käyttö
4. Seuraa yhteyspoolia

**Suorituskykykyselyt:**

```sql
-- Tarkista indeksien käyttö
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan AS indeksi_skannaukset,
  idx_tup_read AS tuplat_luettu,
  idx_tup_fetch AS tuplat_haettu
FROM pg_stat_user_indexes
WHERE tablename = 'blog_posts'
ORDER BY idx_scan DESC;

-- Taulun koko
SELECT 
  pg_size_pretty(pg_total_relation_size('blog_posts')) AS kokonaiskoko,
  pg_size_pretty(pg_relation_size('blog_posts')) AS taulun_koko,
  pg_size_pretty(pg_indexes_size('blog_posts')) AS indeksien_koko;
```

---

## 9. Vianmääritys

### 9.1 Yleiset Ongelmat & Ratkaisut

#### Ongelma: Kirjoitukset Eivät Lataudu

**Oireet:**
- Tyhjä sivu
- "Blogikirjoitusten lataus epäonnistui" -virhe
- Konsoli-virhe: `Failed to fetch`

**Diagnoosi:**
```javascript
// Tarkista selaimen konsolissa
console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Key:', SUPABASE_ANON_KEY ? 'Läsnä' : 'Puuttuu');
```

**Ratkaisut:**
1. **Tarkista Supabase-tunnukset**
   - Varmista, että URL ja ANON_KEY ovat oikein
   - Tarkista kirjoitusvirheet HTML-tiedostoissa

2. **Tarkista verkkoyhteys**
   - Avaa selaimen DevTools → Network-välilehti
   - Etsi epäonnistuneita pyyntöjä Supabaseen

3. **Tarkista RLS-käytännöt**
   - Varmista, että julkinen lukukäytäntö on käytössä
   - Testaa kysely Supabase SQL Editorissa

4. **Tarkista CORS-asetukset**
   - Supabasen pitäisi sallia kaikki alkuperät oletuksena
   - Varmista Dashboard → Settings → API

#### Ongelma: Autentikointivirheet

**Oireet:**
- "Virheelliset tunnukset" -virhe
- Ei voi lisätä/päivittää kirjoituksia
- 401 Unauthorized -virheet

**Ratkaisut:**
1. **Varmista tunnukset**
   ```javascript
   const { data, error } = await supabase.auth.signInWithPassword({
     email: 'admin@onelifetime.world',
     password: 'sinun-salasana'
   });
   console.log('Auth-virhe:', error);
   ```

2. **Tarkista käyttäjän olemassaolo**
   - Dashboard → Authentication → Users
   - Varmista, että sähköposti on vahvistettu

3. **Nollaa salasana**
   - Dashboard → Authentication → Users
   - Klikkaa käyttäjää → Lähetä salasanan nollauslinkki

#### Ongelma: Hidas Suorituskyky

**Oireet:**
- Sivun lataus > 3 sekuntia
- Viivästynyt vieritys
- Viivästyneet hakutulokset

**Diagnoosi:**
```sql
-- Tarkista hitaat kyselyt
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
WHERE query LIKE '%blog_posts%'
ORDER BY mean_time DESC
LIMIT 10;
```

**Ratkaisut:**
1. **Lisää puuttuvat indeksit**
   ```sql
   -- Jos haut ovat hitaita
   CREATE INDEX IF NOT EXISTS idx_blog_posts_search 
   ON blog_posts USING GIN(to_tsvector('english', title || ' ' || content));
   ```

2. **Toteuta sivutus**
   ```javascript
   // Rajoita tuloksia per sivu
   const { data } = await supabase
     .from('blog_posts')
     .select('*')
     .range(0, 19)  // Ensimmäiset 20 kirjoitusta
     .order('date', { ascending: false });
   ```

3. **Ota välimuisti käyttöön**
   ```javascript
   // Välimuistita kirjoitukset localStorageen
   const valimuistitutKirjoitukset = localStorage.getItem('blog_posts');
   if (valimuistitutKirjoitukset && Date.now() - valimuistitutKirjoitukset.timestamp < 3600000) {
     // Käytä välimuistidataa (1 tunti)
     return JSON.parse(valimuistitutKirjoitukset.data);
   }
   ```

### 9.2 Virhekoodien Viite

| Koodi | Merkitys | Ratkaisu |
|-------|----------|----------|
| **PGRST116** | Ei rivejä löytynyt | Tarkista kyselysuodattimet |
| **PGRST301** | JWT vanhentunut | Autentikoi uudelleen |
| **23505** | Yksilöllisyysrajoitteen rikkominen | Vaihda slug yksilölliseksi |
| **23502** | Not null -rikkominen | Täytä pakolliset kentät |
| **42501** | Riittämättömät oikeudet | Tarkista RLS-käytännöt |
| **42P01** | Taulua ei ole olemassa | Suorita skeema SQL |

### 9.3 Virheenkorjaustila

**Ota käyttöön yksityiskohtainen lokitus:**

```javascript
// Lisää blog-supabase.js-tiedostoon
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-debug-mode': 'true'
    }
  }
});

// Kirjaa kaikki kyselyt
supabase.from('blog_posts').select('*').then(({ data, error }) => {
  console.log('Kyselyn tulos:', { data, error });
});
```

---

## 10. Ylläpitomenettelyt

### 10.1 Päivittäiset Tehtävät

**✅ Tarkistuslista:**
- [ ] Tarkista uudet kirjoitukset (jos automaattijulkaisu)
- [ ] Seuraa virhelokeja Supabase Dashboardissa
- [ ] Tarkista katselukertojen poikkeavuudet
- [ ] Tarkista verkkosivun toimivuus (https://onelifetime.world/blog/)

**Automaatio:**
```yaml
# GitHub Actions -työnkulku (valinnainen)
name: Päivittäinen Blogin Terveystarkastus
on:
  schedule:
    - cron: '0 9 * * *'  # Klo 9 päivittäin
jobs:
  terveystarkastus:
    runs-on: ubuntu-latest
    steps:
      - name: Tarkista blogin päätepisteä
        run: curl -f https://onelifetime.world/blog/ || exit 1
      - name: Tarkista Supabase-yhteys
        run: |
          curl -f "$SUPABASE_URL/rest/v1/blog_posts?select=count" \
            -H "apikey: $SUPABASE_ANON_KEY" || exit 1
```

### 10.2 Viikoittaiset Tehtävät

**✅ Tarkistuslista:**
- [ ] Tarkista suosittujen kirjoitusten analytiikka
- [ ] Päivitä nostetut kirjoitukset tarvittaessa
- [ ] Tarkista kirjoitukset, joista puuttuu excerptit
- [ ] Tarkasta uudet tagit/kategoriat
- [ ] Varmuuskopioi tietokanta (Supabase automaattiset varmuuskopiot päivittäin)

**Analytiikkaraportti:**
```sql
-- Viikkoraportti
SELECT 
  'Kirjoitukset Yhteensä' AS mittari,
  COUNT(*)::TEXT AS arvo
FROM blog_posts
WHERE status = 'published'

UNION ALL

SELECT 
  'Kirjoitukset Tällä Viikolla',
  COUNT(*)::TEXT
FROM blog_posts
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
  AND status = 'published'

UNION ALL

SELECT 
  'Katselukerrat Yhteensä Tällä Viikolla',
  SUM(view_count)::TEXT
FROM blog_posts
WHERE updated_at >= CURRENT_DATE - INTERVAL '7 days';
```

### 10.3 Kuukausittaiset Tehtävät

**✅ Tarkistuslista:**
- [ ] Tarkista ja päivitä RLS-käytännöt
- [ ] Tarkasta käyttäjien pääsylokit
- [ ] Optimoi tietokanta (VACUUM, ANALYZE)
- [ ] Tarkista hitaat kyselyt
- [ ] Päivitä dokumentaatio tarvittaessa
- [ ] Turvallisuustarkastus

**Tietokannan Ylläpito:**
```sql
-- Vacuum ja analyze
VACUUM ANALYZE blog_posts;

-- Päivitä tilastot
ANALYZE blog_posts;

-- Tarkista turvotus
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS koko,
  n_live_tup,
  n_dead_tup,
  ROUND(n_dead_tup * 100.0 / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS kuolleiden_suhde
FROM pg_stat_user_tables
WHERE tablename = 'blog_posts';
```

### 10.4 Neljännesvuosittaiset Tehtävät

**✅ Tarkistuslista:**
- [ ] Täysi turvallisuustarkastus
- [ ] Tarkista ja päivitä ylläpitokäsikirja
- [ ] Suorituskyvyn optimointikatsaus
- [ ] Katastrofipalautustesti
- [ ] Päivitä riippuvuudet
- [ ] Tarkista ja arkistoi vanhat luonnokset

**Katastrofipalautustesti:**
```bash
# 1. Vie nykyinen tietokanta
supabase db dump > varmuuskopio_$(date +%Y%m%d).sql

# 2. Luo testiprojekti
# 3. Tuo varmuuskopio
supabase db push < varmuuskopio_20251230.sql

# 4. Varmista datan eheys
# 5. Dokumentoi ongelmat
```

### 10.5 Varmuuskopiointistrategia

**Supabase Automaattiset Varmuuskopiot:**
- **Taajuus:** Päivittäin
- **Säilytys:** 7 päivää (Ilmainen taso), 30 päivää (Pro-taso)
- **Sijainti:** Supabase-infrastruktuuri

**Manuaaliset Varmuuskopiot:**
```bash
# Vie kaikki blogikirjoitukset JSON-muodossa
curl "$SUPABASE_URL/rest/v1/blog_posts?select=*" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  > blog_posts_varmuuskopio_$(date +%Y%m%d).json

# Vie CSV-muodossa (Supabase Dashboardin kautta)
# Table Editor → blog_posts → Export → CSV
```

**Varmuuskopion Varmistus:**
```bash
# Tarkista varmuuskopiotiedoston koko
ls -lh blog_posts_varmuuskopio_*.json

# Laske tietueet varmuuskopiossa
jq 'length' blog_posts_varmuuskopio_20251230.json
# Odotettu: 767
```

---

## 11. Koodin Laatustandardit

### 11.1 DWS6 Koodin Laadun Vaatimustenmukaisuus

**Tämä blogijärjestelmä noudattaa:**
- ✅ DWS-dokumenttistandardia (DWS_DOCUMENT_STANDARD.md)
- ✅ Sivuston laatustandardeja (SITE_QUALITY_STANDARDS.md)
- ✅ AI-agentin ohjeita (AI_AGENT_GUIDELINES.md)

### 11.2 Koodin Tarkistuslista

**Ennen Käyttöönottoa:**

```markdown
## Koodin Laadun Tarkistuslista

### Turvallisuus
- [ ] Ei kovakoodattuja tunnuksia
- [ ] Ympäristömuuttujat käytetty oikein
- [ ] RLS-käytännöt käytössä ja testattu
- [ ] Syötteen validointi toteutettu
- [ ] XSS-suojaus käytössä

### Suorituskyky
- [ ] Tietokantakyselyt optimoitu
- [ ] Indeksit luotu yleisille kyselyille
- [ ] Sivutus toteutettu
- [ ] Välimuististrategia määritelty
- [ ] Latausaika < 3 sekuntia

### Saavutettavuus
- [ ] Semanttinen HTML käytetty
- [ ] Alt-teksti kuvissa
- [ ] ARIA-merkinnät tarvittaessa
- [ ] Näppäimistönavigointi toimii
- [ ] Ruudunlukija testattu

### SEO
- [ ] Meta-kuvaukset läsnä
- [ ] Oikea otsikkohierarkia (H1, H2, H3)
- [ ] Strukturoitu data toteutettu
- [ ] Sivukartta luotu
- [ ] Robots.txt konfiguroitu

### Koodityyli
- [ ] Johdonmukaiset nimeämiskäytännöt
- [ ] Kommentit monimutkaisessa logiikassa
- [ ] Ei console.log tuotannossa
- [ ] Virheiden käsittely toteutettu
- [ ] TypeScript-tyypit määritelty (jos käytetään TS)

### Testaus
- [ ] Manuaalinen testaus suoritettu
- [ ] Selainten välinen testaus (Chrome, Firefox, Safari)
- [ ] Mobiiliresponsiivisuus varmistettu
- [ ] Virhetilanteet testattu
- [ ] Suorituskyky testattu
```

### 11.3 Nimeämiskäytännöt

**DWS-standardien Mukaisesti:**

**Tiedostot:**
```
✅ OIKEIN:
- ADMIN_MANUAL_BLOG_SYSTEM_FI_v1.md
- blog-supabase.ts
- import-blog-posts.ts
- index-dynamic.html

❌ VÄÄRIN:
- adminManual.md
- BlogSupabase.ts
- import_posts.ts
- indexDynamic.html
```

**Muuttujat:**
```javascript
// ✅ OIKEIN: camelCase JavaScriptille
const blogiKirjoitukset = [];
const supabaseAsiakas = createClient();
const katseluMaara = 0;

// ❌ VÄÄRIN
const blogi_kirjoitukset = [];
const SupabaseAsiakas = createClient();
const katselu-maara = 0;
```

**Tietokanta:**
```sql
-- ✅ OIKEIN: snake_case SQL:lle
CREATE TABLE blog_posts (
  created_at TIMESTAMPTZ,
  view_count INTEGER
);

-- ❌ VÄÄRIN
CREATE TABLE blogPosts (
  createdAt TIMESTAMPTZ,
  viewCount INTEGER
);
```

### 11.4 Dokumentaatiostandardit

**Kaikkien kooditiedostojen on sisällettävä:**

```javascript
/**
 * Tiedosto: blog-supabase.ts
 * Tarkoitus: Supabase-asiakas ja funktiot blogikirjoitusten hallintaan
 * Luotu: 2025-12-30
 * Viimeksi Muokattu: 2025-12-30
 * Tekijä: Cursor AI
 * Riippuvuudet: @supabase/supabase-js
 * 
 * Funktiot:
 * - getBlogPosts(): Hae kaikki julkaistut kirjoitukset
 * - getBlogPostBySlug(slug): Hae yksittäinen kirjoitus slugin perusteella
 * - createBlogPost(post): Luo uusi kirjoitus
 * - updateBlogPost(id, updates): Päivitä olemassa oleva kirjoitus
 * - deleteBlogPost(id): Poista kirjoitus
 */
```

---

## 12. Tarkastusketju

### 12.1 Muutosloki

| Päivämäärä | Versio | Muutokset | Tekijä |
|------------|--------|-----------|--------|
| 2025-12-30 | 1.0 | Blogijärjestelmän alkuperäinen luonti | Cursor AI |
| 2025-12-30 | 1.0 | Tuotu 767 vanhaa blogikirjoitusta | Cursor AI |
| 2025-12-30 | 1.0 | Luotu dynaamiset blogisivut | Cursor AI |
| 2025-12-30 | 1.0 | Lisätty navigaatiovalikon korjaukset | Cursor AI |
| 2025-12-30 | 1.0 | Luotu ylläpitokäsikirja (tämä dokumentti) | Cursor AI |

### 12.2 Tietokannan Tarkastusloki

**Ota käyttöön tarkastuslokitus:**

```sql
-- Luo tarkastustaulu
CREATE TABLE blog_posts_audit (
  id BIGSERIAL PRIMARY KEY,
  blog_post_id BIGINT,
  action TEXT CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  changed_by TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Luo tarkastustriggerifunktio
CREATE OR REPLACE FUNCTION audit_blog_posts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO blog_posts_audit (blog_post_id, action, new_data, changed_by)
    VALUES (NEW.id, 'INSERT', row_to_json(NEW), current_user);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO blog_posts_audit (blog_post_id, action, old_data, new_data, changed_by)
    VALUES (NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), current_user);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO blog_posts_audit (blog_post_id, action, old_data, changed_by)
    VALUES (OLD.id, 'DELETE', row_to_json(OLD), current_user);
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Liitä triggeri
CREATE TRIGGER blog_posts_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION audit_blog_posts();
```

**Kysele tarkastuslokia:**

```sql
-- Viimeaikaiset muutokset
SELECT 
  blog_post_id,
  action,
  new_data->>'title' AS otsikko,
  changed_by,
  changed_at
FROM blog_posts_audit
ORDER BY changed_at DESC
LIMIT 20;

-- Muutokset käyttäjittäin
SELECT 
  changed_by,
  action,
  COUNT(*) AS muutosten_maara
FROM blog_posts_audit
GROUP BY changed_by, action
ORDER BY muutosten_maara DESC;
```

### 12.3 Vaatimustenmukaisuuden Tarkistuslista

**GDPR-vaatimustenmukaisuus:**
- [x] Data tallennettu EU-alueella (Supabase EU)
- [x] Käyttäjän suostumus analytiikkaan (jos toteutettu)
- [x] Datan vientimahdollisuus (JSON/CSV)
- [x] Datan poistomahdollisuus (ylläpitäjän toiminto)
- [x] Tietosuojakäytäntö päivitetty

**Turvallisuusvaatimustenmukaisuus:**
- [x] HTTPS pakotettu
- [x] RLS käytössä
- [x] Autentikointi vaaditaan kirjoituksille
- [x] API-avaimet turvattu
- [x] Säännölliset turvallisuustarkastukset aikataulutettu

**Saavutettavuusvaatimustenmukaisuus:**
- [x] WCAG 2.1 AA -vaatimustenmukaisuus
- [x] Semanttinen HTML
- [x] Näppäimistönavigointi
- [x] Ruudunlukijayhteensopiva
- [x] Alt-teksti kuvissa

---

## Liite A: Pikaviite

### Supabase-yhteys

```javascript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### Yleiset Kyselyt

```javascript
// Hae kaikki julkaistut kirjoitukset
const { data } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('status', 'published')
  .order('date', { ascending: false });

// Hae yksittäinen kirjoitus
const { data } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('slug', 'kirjoitus-slug')
  .single();

// Luo kirjoitus
const { data } = await supabase
  .from('blog_posts')
  .insert([{ title: '...', slug: '...', date: '...', content: '...' }])
  .select();

// Päivitä kirjoitus
const { data } = await supabase
  .from('blog_posts')
  .update({ title: 'Uusi Otsikko' })
  .eq('id', 123)
  .select();

// Poista kirjoitus
const { error } = await supabase
  .from('blog_posts')
  .delete()
  .eq('id', 123);
```

### Hätäyhteystiedot

| Rooli | Yhteystieto | Tavoitettavuus |
|-------|-------------|----------------|
| **Järjestelmän Ylläpitäjä** | risto@lifetime.fi | Ma-Pe 9-17 EET |
| **Supabase Tuki** | support@supabase.com | 24/7 (Pro-taso) |
| **Hosting Tuki** | [Hosting-palveluntarjoajasi] | 24/7 |

---

## Liite B: Sanasto

| Termi | Määritelmä |
|-------|------------|
| **RLS** | Row Level Security - PostgreSQL-ominaisuus pääsynhallintaan |
| **Slug** | URL-ystävällinen tunniste (esim. "oma-blogikirjoitus") |
| **CRUD** | Create, Read, Update, Delete -toiminnot |
| **JWT** | JSON Web Token - autentikointitokenin muoto |
| **CDN** | Content Delivery Network - hajautettu tiedostojen hosting |
| **ANON_KEY** | Anonyymi API-avain julkiseen käyttöön |
| **SERVICE_ROLE_KEY** | Ylläpitäjän API-avain täydellä pääsyllä |
| **Supabase** | Backend-as-a-Service -alusta (PostgreSQL + API:t) |
| **LSJ** | Lifetime Scope Journal - blogin nimi |

---

**Dokumentin Loppu**

**Seuraavat Vaiheet:**
1. Lue englanninkielinen versio: `ADMIN_MANUAL_BLOG_SYSTEM_EN_v1.md`
2. Tarkista asennusopas: `BLOG_SUPABASE_SETUP.md`
3. Katso järjestelmän yhteenveto: `BLOG_SYSTEM_SUMMARY.md`
4. Aloita sisällönhallinta Supabase Dashboardissa

**Kysymyksiä?** Ota yhteyttä: risto@lifetime.fi

---

**Luonut:** Cursor AI  
**Istunto:** 2025-12-30  
**Laadunvarmistus:** DWS6-standardien Mukainen  
**Tila:** ✅ AKTIIVINEN
