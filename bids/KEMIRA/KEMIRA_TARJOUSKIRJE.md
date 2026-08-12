<!--
VERSION AND AGENT HISTORY
Document: KEMIRA_TARJOUSKIRJE.md
Version: 1.0
Last-Updated: 2026-06-27
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Sonnet 4.6
Purpose: Suomenkielinen tarjouskirje Kemira Oyj:lle — DWS IQ Aegis Defence
         -alusta hiilijalanjälki-complianceen (CBAM, CSRD, Scope 3 PCF).
         Vastaanottaja: Maria (Hintikka) Sederholm, VP Product Line
         Management & Strategy, Fiber Essentials, Kemira Oyj.
         Toissijainen: Mikko Pohjala, VP Strategy.
-->

***

# Tarjouskirje — DWS IQ Aegis Defence

**Kemira Oyj**
Maria (Hintikka) Sederholm
VP Product Line Management & Strategy, Fiber Essentials
Espoo / Helsinki

**Tarjoaja:** Lifetime Oy
Risto Anton Päärni, toimitusjohtaja
Laidunmaanraitti 2 A 25, 02330 Espoo
Y-tunnus: 0772407-9 | VAT: FI07724079
risto.paarni@lifetime.fi | https://dws10.com

**Päivämäärä:** 27.6.2026
**Viite:** DWS IQ Aegis Defence — tarjous hiilijalanjälki-compliancen automatisointiin

---

## Hyvä Maria,

Kiitos lupaukseni lunastamisesta — tässä tarjous **DWS IQ Aegis Defence** -alustasta, pakattuna niin, että voit välittää sen suoraan Kemiran hallitukselle ilman lisäkääntelyjä.

Kolme osaa: ongelma, ratkaisu ja seuraava askel.

---

## 1. Ongelma — hiilijalanjälki-compliance kasvaa joka vuosi

Kemiralla on SBTi-validoidut hiilitavoitteet:

- Scope 1 & 2: **−51,23 % vuoteen 2030 mennessä** (2018-baseline)
- Scope 3 (ostetut tavarat + kuljetus): **−32,5 % vuoteen 2033 mennessä** (2021-baseline)
- Hiilineutraali Scope 1 & 2: **2045**

FY2024:stä lähtien Kemiralla on ensimmäinen **CSRD/ESRS**-kestävyysraportti varmennuksen alla. Käytännön työ — CBAM-laskelmat, asiakkaiden vaatimat tuotekohtaiset hiilijalanjäljet (PCF), Scope 3 -datan keruu toimittajilta — kasvaa joka vuosi. Teillä on jo _Supplier PCF Reporting Guideline_ (huhtikuu 2025), mikä osoittaa, että tätä datavirtaa jo koordinoidaan. Silti merkittävä osa tästä compliance-työstä tehdään käsin, ilman yhtenäistä audit-jälkeä.

**Ratkaisematon jännite:** tähän compliance-työhön käytetty tekoäly pyörii tyypillisesti yhdysvaltalaisilla pilvialustoilla — Microsoft Azure, Google Cloud, AWS. Kemiralle tämä tarkoittaa **US CLOUD Act -altistuspintaa** prosessi- ja asiakasdataan juuri silloin, kun CSRD-varmennus edellyttää jäljitettävyyttä lähdedataan asti. EU:n tekoälyasetuksen (EU AI Act) Article 12 -lokivaatimus edellyttää auditoitavaa jälkeä — vaatimus, jota US-hyperscaler-pohjainen tekoäly ei täytä puhtaasti.

Hiili-compliance-taakka, jonka jo kannatte, kääntyy myyntieduksi vasta suvereenilla, auditoitavalla alustalla.

---

## 2. Ratkaisu — DWS IQ Aegis Defence

**DWS IQ Aegis Defence** on suvereeni, suomalainen tekoälyalusta säänneltyjen teollisuusyritysten compliance-automaatioon. Rakentanut Lifetime Oy (Espoo) — sama lainkäyttöalue kuin Kemira.

### Mitä alusta tekee Kemiran compliance-työssä

| Compliance-tarve                   | Aegis-toiminto                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------- |
| CBAM-laskelmat                     | Autonomiset agentit laskevat ja dokumentoivat hiili-intensiteetit tuotantolinjoittain       |
| PCF-raportointi (asiakkaille)      | Article 12 -auditoitu PCF-tuotos, valmis toimittamaan asiakkaiden kyselyihin                |
| Scope 3 -datan keruu toimittajilta | RAG-arkkitehtuuri + 15 000+ EU-sääntelydokumenttia: automatisoitu tiedonkeruu ja validointi |
| CSRD/ESRS-raportointi              | Strukturoitu data-audit-trail ESRS E1 -raporttiin, varmentajakelpoisena                     |
| EDIP-raportointi                   | Puolustusläheisten asiakkuuksien EU Defence Industrial Programme -raportointi               |

### Miksi Aegis Defence — ei Standard eikä US-hyperscaler

**Sovereignty:** 100 % EU-omisteinen alusta (UpCloud, Helsinki, ISO 27001). Nolla CLOUD Act -altistusta. Prosessi-IP ja asiakasdata eivät poistu Suomesta eivätkä kouluta vieraita malleja.

**Hallinta (KYA — Know Your Agent):** Jokaisella tekoälytoimella on todennettu identiteetti, MicroVM-eristys (Firecracker) ja reaaliaikainen kill-valtuus. EU AI Act **Article 12** -audit sisäänrakennettuna — ei konfiguraationa vaan arkkitehtuurina.

**ArgusAgent SAR:** Satelliittipohjainen muutoksenhavainto (SAR, kaikessa säässä) kriittisillä toimitusketjusolmuilla ja raaka-ainekohteilla. Toimitusketjun resilienssievidenssiä CER-direktiiviä ja asiakasauditointeja varten.

**NVIDIA L40S GPU:** Raskas LLM-inferenssi suvereenissa enklaaviissa — formuloinnin ja toimitusketjuanalyysin käsittely ilman, että data poistuu Suomesta.

**Priority-tuki, 4 h SLA:** Kriittisen infrastruktuurin toittajan SLA-vaatimukset täyttyvät.

### Neljä roolia — sama otsikko, jokainen voittaa

| Rooli                   | Mitä voittaa                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **CTO / T&K**           | Prosessi-IP pysyy suvereenina; EU-only inferenssi; ei mallikoulutusta Kemiran datalla                             |
| **CISO**                | NIS2 + CER täyttyy puhtaasti; KYA-hallinta, kill-valtuus, Article 12 -audit; nolla discovery-pintaa               |
| **Kaupallinen / Maria** | Suvereeni-todennus tarjouskilpailujen erottautumistekijänä; nopeammat säännellyt kaupat                           |
| **CEO / CFO**           | Liikevaihto + kustannus + moat yhdellä alustalla; yksi EU-jurisdiktio, yksi auditoitava tarina pääomamarkkinoille |

---

## 3. Seuraava askel — maksuton scoping

Ehdotan **kaksivaiheista etenemistä:**

### Vaihe 1 — Scoping (1–2 viikkoa, maksuton)

Lukitaan yhdessä:

- Mitkä Kemiran tuotelinjat ovat CER/NIS2-piirissä ja/tai kaksikäyttöä (tämä vaikuttaa oikeaan tasoon)
- Yksi konkreettinen compliance-virta (esim. PCF-raportointi asiakkaille), jonka mittaristo pilottia varten sovitaan
- Onko oikea taso **Aegis Defence** vai **Aegis Standard** (scoping päättää rehellisesti — ei myyntiargumentein)

**Kustannus: maksuton.**

### Vaihe 2 — Pilotti (GA syyskuu 2026)

Alusta on yleisesti saatavilla elokuusta 2026. Pilotti kohdistetaan GA-julkaisuun. Kaupallistaminen sovittujen KPI-mittareiden täytyttyä.

**Pilotissa mitataan:**

- Sovereign-kattavuus: kuinka suuri osuus yhden tuotelinjan compliance-virrasta ajetaan todennettavasti suvereenilla alustalla (ennen vs. pilotin aikana)
- Compliance-työn vapautuminen: käsin tehdyn CBAM/PCF/Scope 3 -evidenssin keruun tuntimäärä ja uudelleenkohdentaminen
- Tarjouskilpailun läpimeno: voitto-% niissä asiakkuuksissa, jotka vaativat suvereeni-todennusta

---

## Hinnoittelu

Katso erillinen hintalomake: **KEMIRA_HINTALOMAKE.md**

Lyhyesti: **Aegis Defence** (suositeltu) — €89 990 käyttöönotto + €1 999/kk.

---

## Miksi nyt

- CSRD-varmennus on alkanut (FY2024-raportti under assurance) — audit-trail-vaatimus on tässä ja nyt
- CBAM-transitiokausi päättyy; laskelmat on tehtävä tuotantolaatuisesti 2026 alkaen
- Alusta GA syyskuu 2026 — scoping nyt tarkoittaa, että Kemira on ensimmäisten joukossa
- Sama jurisdiktio (Espoo–Helsinki): tapaamiset nopeasti järjestettävissä

Sopisiko 20 minuutin scoping-palaveri viikolla 27 tai 28? Voin tulla Helsinkiin tai järjestää etäyhteyden.

Terveisin,

**Risto Anton Päärni**
Toimitusjohtaja, Lifetime Oy
risto.paarni@lifetime.fi
+358 (0) --- (vahvistettavissa)
Laidunmaanraitti 2 A 25, 02330 Espoo
Y-tunnus: 0772407-9 | VAT: FI07724079
https://dws10.com

---

_Tarjouksen liitteet:_

- _KEMIRA_HINTALOMAKE.md — Hinnoittelu kaikilla Aegis-tasoilla_
- _CV_KEMIRA.md — Risto Anton Päärni, ansioluettelo_
- _KEMIRA_REFERENSSIT.md — Referenssit ja kokemus_
