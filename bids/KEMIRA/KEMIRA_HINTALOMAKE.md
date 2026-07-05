<!--
VERSION AND AGENT HISTORY
Document: KEMIRA_HINTALOMAKE.md
Version: 1.0
Last-Updated: 2026-06-27
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Sonnet 4.6
Purpose: Suomenkielinen hintalomake Kemira Oyj:lle — DWS IQ Aegis -tasot
         ja konsultointioptio. Kanoninen hinnoittelu: Store/PRODUCT_AEGIS.md
         ja dws10.com/config/products.json (id DWS-AEGIS-001).
-->

---

# Hintalomake — DWS IQ Aegis

**Kemira Oyj**
**Tarjoaja:** Lifetime Oy | Y-tunnus: 0772407-9 | VAT: FI07724079
**Päivämäärä:** 27.6.2026
**Voimassaolo:** 30.9.2026

---

## Aegis-tasot

| Taso                             | Käyttöönotto + integraatio | Kuukausimaksu  | Sisältö                                                                                                            |
| -------------------------------- | -------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Aegis Standard**               | 59 990 €                   | 999 €/kk       | 18 agenttia, 21 toimialaa, oma K8s-klusteri, Article 12 -lokitus, KYA-hallinta, standard-tuki                      |
| **Aegis Defence** _(suositeltu)_ | **89 990 €**               | **1 999 €/kk** | Standard + NVIDIA L40S GPU -laskenta (UpCloud Helsinki), ArgusAgent SAR, priority-tuki (4 h SLA), EDIP-raportointi |
| **Aegis Sovereign**              | Räätälöity                 | 4 999 €/kk     | Defence + air-gapped/on-prem-optio, tietoturvaselvitysvalmius, oma insinööritiimi, räätälöity SLA                  |

_Kaikki hinnat ALV 0 %. ALV 25,5 % lisätään suomalaisille yrityksille laskutuksessa._

---

## Tasojen vertailu

| Ominaisuus                                  | Standard | Defence | Sovereign |
| ------------------------------------------- | :------: | :-----: | :-------: |
| Agentit (18 kpl)                            |    ✓     |    ✓    |     ✓     |
| 21 toimialaa                                |    ✓     |    ✓    |     ✓     |
| Single-tenant Kubernetes (UpCloud Helsinki) |    ✓     |    ✓    |     ✓     |
| ISO 27001, nolla CLOUD Act -altistusta      |    ✓     |    ✓    |     ✓     |
| EU AI Act Article 12 -lokitus               |    ✓     |    ✓    |     ✓     |
| KYA-hallinta (Know Your Agent)              |    ✓     |    ✓    |     ✓     |
| CBAM / CSRD / Scope 3 PCF -agentit          |    ✓     |    ✓    |     ✓     |
| RAG (15 000+ EU-sääntelydokumenttia)        |    ✓     |    ✓    |     ✓     |
| NVIDIA L40S GPU -inferenssi (Helsinki)      |    —     |    ✓    |     ✓     |
| ArgusAgent SAR (satelliittitiedustelu)      |    —     |    ✓    |     ✓     |
| Priority-tuki, 4 h SLA                      |    —     |    ✓    |     ✓     |
| EDIP-raportointi                            |    —     |    ✓    |     ✓     |
| Air-gapped / on-prem -optio                 |    —     |    —    |     ✓     |
| Tietoturvaselvitysvalmius                   |    —     |    —    |     ✓     |
| Oma insinööritiimi                          |    —     |    —    |     ✓     |
| Räätälöity SLA                              |    —     |    —    |     ✓     |

---

## Konsultointi (lisäoptio)

| Palvelu                                                   | Hinta                |
| --------------------------------------------------------- | -------------------- |
| Konsultointityö (arkkitehtuuri, integraatio, räätälöinti) | **72 €/h** (ALV 0 %) |
| Scoping-vaihe (1–2 viikkoa)                               | **Maksuton**         |

Konsultointia voidaan käyttää esim. ERP-integraatioihin (SAP S/4HANA, IFS Cloud, Dynamics 365), räätälöityihin PCF-laskentamalleihin tai CSRD-raportointiputken rakentamiseen.

---

## Alustan saatavuus ja toimitusaikataulu

| Vaihe                           | Aikataulu                            |
| ------------------------------- | ------------------------------------ |
| Scoping (maksuton)              | Heti sovittavissa — 1–2 viikkoa      |
| Pilottisopimus                  | Sovittavissa scoping-vaiheen jälkeen |
| Platform GA (yleinen saatavuus) | **Elokuu 2026**                      |
| Pilotti käynnistyy              | GA-julkaisun myötä (elokuu 2026)     |
| Kaupallistaminen                | Sovittujen KPI-mittareiden täytyttyä |

---

## Laskutus- ja sopimusehdot

- **Käyttöönottomaksu:** laskutetaan sopimuksen allekirjoituksessa (50 %) ja pilotin käynnistyessä (50 %).
- **Kuukausimaksu:** alkaa pilotin käynnistymisestä. Laskutusväli: kuukausittain jälkikäteen.
- **Minimisitoumus:** 12 kuukautta pilotin käynnistymisestä.
- **Irtisanomisaika:** 3 kuukautta kirjallisesti minimisitoumuksen jälkeen.
- **Maksuehdot:** 14 päivää netto.
- **Valuutta:** Euro (EUR).
- **Hallintaoikeus:** Sopimus Suomen lainsäädännön mukaan; toimivaltainen tuomioistuin Espoon käräjäoikeus.

---

## Suositeltu paketti Kemiralle

**Aegis Defence** on luvattu taso ja sopii Kemiran tilanteeseen:

- NVIDIA L40S GPU mahdollistaa raskaan PCF/Scope 3 -analyysin suvereenissa enklaaviissa
- ArgusAgent SAR tuottaa resilienssievidenssiä kriittisillä raaka-ainesolmuilla (CER-direktiivi)
- EDIP-raportointi avaa puolustusläheisiä asiakkuuksia
- 4 h SLA vastaa kriittisen infrastruktuurin toittajan odotuksia

**Jos scoping-vaiheen jälkeen dual-use/EDIP-altistus osoittautuu oletettua ohuemmaksi**, suositellaan **Aegis Standard** (59 990 € + 999 €/kk) — sama suvereenisuus ja KYA-hallinta, ilman SAR/GPU/EDIP-tasoa. Tämä kerrotaan avoimesti; ei ylisuositella korkeampaa tasoa, jos Standard täyttää tarpeen (Rule 12: fail loud).

---

## Yhteyshenkilö

**Risto Anton Päärni**
Toimitusjohtaja, Lifetime Oy
risto.paarni@lifetime.fi
Laidunmaanraitti 2 A 25, 02330 Espoo
Y-tunnus: 0772407-9 | VAT: FI07724079
https://dws10.com

---

_Hinnoittelun kanoninen lähde: Store/PRODUCT_AEGIS.md ja dws10.com/config/products.json (id DWS-AEGIS-001)._
