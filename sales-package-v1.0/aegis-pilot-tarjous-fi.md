# Tarjous — DWS IQ Aegis Pilot (3 kk)

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/aegis-pilot-openshell-03ist6 | Date: 28.09.2026 | Changes: Luotu. Suomenkielinen Aegis Pilot -tarjouspohja. Esittelyteksti on HIC:n blogiluonnos (docs/blog-drafts/aegis-pilot-nvidia-openshell.md), faktat korjattuina. Kaupalliset ehdot: dws10.com/config/products.json (DWS-AEGIS-PILOT-001, DWS-AEGIS-001) ja hinnasto v1.33. Vaiheet ja hyväksyntäehto: Store/PRODUCT_AEGIS_PILOT.md. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none

Document Status:

- Created: 28.09.2026
- Status: DRAFT — HIC:n hyväksyntä ennen ensimmäistä lähetystä (Approval Request Rule)
- Language: Finnish
- Classification: Asiakaskohtainen tarjous (täytä hakasulkeiden kentät)
- Owner: Lifetime Oy

---

**Vastaanottaja:** [Asiakas Oy] · [Yhteyshenkilö, rooli] · [sähköposti]
**Päiväys:** [pp.kk.vvvv] · **Viite:** DWS-AEGIS-PILOT-001
**Voimassa:** 30 päivää päiväyksestä, kuitenkin enintään 15.11.2026 asti (hinnasto v1.33)

**Tarjoaja:**
Lifetime Oy · Y-tunnus 0772407-9 · ALV FI07724079
Laidunmaanraitti 2 A 25, 02330 Espoo
Risto Anton Päärni, toimitusjohtaja · risto.paarni@lifetime.fi · +358 400 319 010

---

## 1. Miksi tämä pilotti — agentit eivät voi valvoa itseään

NVIDIA julkisti 28.9.2026 Open Agent Safety Platformin. Sen perusajatus on tuttu jokaiselle, joka muistaa, miten internetistä tuli turvallinen: sitä ei tehty turvalliseksi pyytämällä verkkosivujen tekijöitä lupaamaan olevansa hyviä, vaan selain lakkasi luottamasta sivujen koodiin. Sama pätee tekoälyagentteihin. Agentti ei voi valvoa itseään.

Tämän ratkaisun ydin on yhdistää NVIDIAn uusi ajonaikainen turva-arkkitehtuuri ja DWS IQ Aegiksen EU-suvereeni teollisuus- ja compliance-alusta. Tavoitteena on teollisuus- ja kaksoiskäyttökohteisiin sopiva eristetty ympäristö, jossa tekoälyagentit voivat suorittaa autonomisia tehtäviä turvallisesti ja jossa turvallisuus on todennettavissa jälkikäteen.

Valvomossa ratkaistu kysymys on yksinkertainen: kun verkkoyhteys katkeaa, pysyykö kohde hallinnassa? Pilotti vastaa siihen ajamalla työnkulku ja katkaisemalla yhteys, eikä mallintamalla asiaa tarjouksessa.

## 2. Ratkaisun kerrokset

### Ajoympäristön eristys (NVIDIA Open Agent Safety Platform)

- **NVIDIA OpenShell** on avoimen lähdekoodin (Apache 2.0) ajoympäristö, joka muodostaa jokaisen agentin ympärille nollaluottamukseen (Zero Trust) perustuvan hiekkalaatikon.
  - Linux-ytimen mekanismit (Landlock, seccomp ja verkkonimiavaruus) rajaavat, mihin tiedostoihin, verkkoyhteyksiin ja työkaluihin agentti pääsee.
  - Pilotissa jokainen työnkulun vaihe ajetaan omassa hiekkalaatikossaan.
  - Hiekkalaatikon politiikka johdetaan suoraan tämän pilotin allekirjoitetusta laajuusmäärittelystä, ja ydinvaiheilla ei ole verkkoa lainkaan.
  - OpenShell edellyttää Linux 6.2 -ydintä tai uudempaa (Landlock käytössä) sekä konttiympäristöä (Docker tai Podman). Tämä tarkistetaan vaiheessa 0.
  - Jos kohde ei täytä edellytyksiä, agentit eristetään säietasolla ja pysäytetään lopettamalla. Hyväksyntätietue kertoo tällöin nimenomaisesti, millä tasolla eristys toteutui.
- **NVIDIA Sentry ja BlueField-4 DPU** tuovat valvonnan laitteistotasolle, agentin ulottumattomiin. Tämä on valinnainen lisäkerros NVIDIA Vera- ja BlueField-4-laitteistolla, eikä se sisälly tähän pilottiin.

### Sääntely ja data-suvereniteetti (DWS IQ Aegis)

- **EU AI Act- ja NIS2-yhteensopivuus.** Jokaisesta päätöksestä kirjoitetaan EU AI Actin artiklan 12 mukainen tapahtumaloki paikallisesti, hash-ketjutettuna ja kohteen avaimella allekirjoitettuna. Lokiin kirjataan myös se, missä hiekkalaatikossa ja millä politiikalla päätös tehtiin.
- **Täysin paikallinen ajo (on-premises).** Järjestelmä ajetaan asiakkaan omalla laitteistolla tai kompaktilla reunalaitteella. Tuotantoreseptit ja kriittinen data eivät poistu kohteesta, eivätkä ne altistu US CLOUD Act -riskeille. OpenShellin telemetria on käännetty pois.
- **KYA (Know Your Agent) ja hätäpysäytys.**
  - Jokaisen agentin toiminnoista jää aukoton, allekirjoitettu lokiketju.
  - Ihmisoperaattorilla on aina digitaalinen hätäpysäytysvalta (kill-switch). Pysäytys lopettaa agentin, eikä vain pyydä sitä lopettamaan.
  - Pysäytyksen toteutuminen todennetaan lokista, ei agentin omasta ilmoituksesta. Mekaaninen hätäpysäytys kuuluu kohteen omaan turvajärjestelmään.

## 3. Mitä pilotti todistaa — hyväksyntäehto

Pilotin lopussa ulkoyhteys katkaistaan ennalta sovituksi ajaksi, teidän hallinnoimallanne menetelmällä. Tulos on binäärinen:

1. Valmistuuko pilotoitu työnkulku ilman verkkoyhteyttä?
2. Kirjoitetaanko artiklan 12 loki edelleen paikallisesti, ilman aukkoja?
3. Voiko operaattori pysäyttää käynnissä olevan agentin?

**Kaikkien kolmen on toteuduttava.** Jos pilotti ei läpäise testiä, se on hyödyllinen negatiivinen tulos eikä virhe. Opitte sen 19 990 eurolla ettekä laitteisto-ohjelman jälkeen.

Testin tuloksena syntyy allekirjoitettu hyväksyntätietue. Teidän tarkastajanne voi varmentaa sen myöhemmin ilman yhteyttä meihin.

## 4. Pilotin vaiheet (3 kk)

| Vaihe                                  | Viikot        | Tulos (porttiehto)                                                                                                                                                              |
| -------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 — Rajaus ja lähtötaso                | 0–2, maksuton | Allekirjoitettu laajuusmäärittely: kohde, työnkulku, käyttöönottotapa, eristysmenetelmä ja hyväksyntäehdot teidän omalla kielellänne. Tarkistetaan ydin- ja konttiedellytykset. |
| 1 — Paikallinen perusta                | 3–5           | Neljä paikallista toimintoa (ajo, tunnistus, loki, pysäytys) todennettu yhteyden ollessa jo poikki                                                                              |
| 2 — Työnkulun integrointi              | 6–9           | Teidän työnkulkunne valmistuu verkkoyhteydellä, ja artiklan 12 loki on täydellinen. Työnkulun omistaja hyväksyy tuloksen.                                                       |
| 3 — Hyväksyntätesti yhteys katkaistuna | 10–11         | Harjoitusajo ja sen jälkeen todistajan läsnä ollessa tehty hyväksyntäajo. Kaikki kolme ehtoa tai negatiivinen tulos.                                                            |
| 4 — Mitoitus, raportti ja päätös       | 12–13         | Tuotantolaitteiston mitoitus mitatun kuorman perusteella, raportti ja suositus                                                                                                  |

## 5. Kaupalliset ehdot

|                          |                                                                                                                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hinta**                | **19 990 € (alv 0 %)**, kiinteä                                                                                                                                                                |
| **Kesto**                | 3 kuukautta                                                                                                                                                                                    |
| **Laitteisto**           | Ei laitehankintaa. Ajetaan olemassa olevalla infrastruktuurillanne tai kompaktilla reunalaitteella.                                                                                            |
| **Hyvitys**              | Hyvitetään **täysimääräisesti** 59 990 euron Aegis-lisenssistä, jos jatkatte tuotantoon 6 kuukauden kuluessa. Maksettavaksi jää 40 000 €, ja kokonaiskustannus tuotantoon pysyy 59 990 eurona. |
| **Ylläpito tuotannossa** | Alkaen 999 €/kk (DWS-AEGIS-SUB-001), alkaa vasta tuotantokäytössä                                                                                                                              |

**Sisältyy:** yksi kohde, yksi valvomon työnkulku ja yksi käyttöönottotapasuositus. Mukana on vain työnkulun tarvitsemat agentit. Paikallinen ajo, lokitus, tunnistus, hätäpysäytys ja hiekkalaatikkoeristys pystytetään olemassa olevalle laitteistollenne tai kompaktille reunalaitteelle. Lisäksi tehdään tuotannon mitoitus mitatun käytöksen perusteella.

**Ei sisälly (eikä hyvityksen piiriin):** LWM-integraatio, laitehankinnat, useamman kohteen käyttöönotto, muut toimialat, räätälöidyt ERP-, BIM- tai SCADA-integraatiot, NVIDIA Sentry / BlueField-laitteisto sekä DWS IQ Aegis -toteutusohjelma (DWS-AEGIS-IMPL-001, 45 000 €, erillinen eikä hyvitettävä). Hyvitys on enintään 19 990 €, se kohdistuu vain Aegis-lisenssiin ja raukeaa, jos tuotantoon ei siirrytä 6 kuukauden kuluessa.

Jos ette jatka, arkkitehtuuri, mittaukset ja hyväksyntätietue jäävät teille. Muuta ei makseta.

## 6. Seuraava askel

Maksuton rajauspalaveri (vaihe 0, 60 min). Siinä sovitaan pilotoitava työnkulku, eristysmenetelmä ja hyväksyntäehdot teidän operatiivisella kielellänne.

---

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
