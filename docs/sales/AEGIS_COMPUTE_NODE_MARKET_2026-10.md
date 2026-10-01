# Aegis-laskentasolmu: markkinahaku (GB10, Thor, x86 rugged, Intel/AMD), jälleenmyyjät, TPM

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web), WebSearch-aliagentti | Date: 01.10.2026 | Changes: Ensimmäinen haku. Vain hakukatkelmat (WebFetch estetty proxyssa); "Verified" = kaksi riippumatonta lähdettä. Hakubudjetti loppui ennen Intel Arc Pro-, saksalaisten IPC-valmistajien (Kontron, Siemens, Beckhoff, Phoenix, WAGO, B&R) ja ABB-lisähakua; ne ovat §7 avoimina. | Harness: Claude Code + CLAUDE.md + DWS_MARKET_RESEARCH_STANDARD

Document Status:

- Created: 01.10.2026
- Classification: INTERNAL
- Status: DRAFT, PENDING_REVIEW. Hinnat markkinaviitteitä (lista/katuhinta, ALV lähteen mukaan), eivät hinnaston hintoja.

---

## 0. Tosiasia ensin: GB10 on Arm

Jokainen GB10-laatikko (DGX Spark, Acer GN100, ASUS GX10, Dell Pro Max GB10, HP ZGX Nano, Lenovo PGX, MSI MS-C931, Gigabyte AI TOP ATOM) on Arm: Grace-CPU (10× Cortex-X925 + 10× Cortex-A725) + Blackwell-GPU, DGX OS 7 = Ubuntu 24.04 aarch64. Jetson Thor on myös Arm (Neoverse V3AE). **x86-only-sääntö sulkee pois koko nykyisen Lifetime-pinon ja luokan 1.** Vain luokat 3 ja 4 ovat x86.

## 1. GB10 OEM -laatikot (Arm; 128 GB; ~1 PFLOPS FP4; DGX OS 7)

| Valmistaja | Malli                  | Hinta (viite)                                                 | EU-saatavuus            | Lähde                                            | Verified?                        |
| ---------- | ---------------------- | ------------------------------------------------------------- | ----------------------- | ------------------------------------------------ | -------------------------------- |
| Acer       | Veriton GN100          | EMEA alk. €3 999; 4 TB €5 999–6 148 (DE)                      | geizhals, senetic, pi3g | geizhals.de; pi3g.com/nvidia-dgx-spark-price     | Verified                         |
| ASUS       | Ascent GX10            | US $3 999; LDLC FR €4 499,95 (listaus päättynyt)              | ohut                    | asus.com FAQ 1056142; ldlc.com                   | US verified; EU unverified       |
| Dell       | Pro Max GB10 (FCM1253) | US $3 699/3 999; **Multitronic FI €7 016,90 (2 TB)**          | Dell FI, Multitronic    | multitronic.fi/en/products/4601426; phoronix.com | OS verified; FI-hinta yksi lähde |
| HP         | ZGX Nano G1n           | DE UVP €3 929 sis. ALV; katu €3 551 (1 TB)                    | Bechtle, HP DE          | geizhals.de; notebookcheck                       | Verified                         |
| Lenovo     | ThinkStation PGX       | **Bechtle DE €4 565 (1 TB)** / €5 119 (4 TB); Elara IE €4 740 | Bechtle, Elara          | bechtle.com; elara.ie                            | Verified, halvin EU-GB10         |
| MSI        | EdgeXpert MS-C931      | US $2 999 (1 TB, rajoitettu); LDLC €6 599,95 (4 TB)           | LDLC                    | notebookcheck; ldlc.com                          | Unverified                       |
| Gigabyte   | AI TOP ATOM            | Newegg $3 499,99 / $3 999,99                                  | ei EU-listausta         | cnx-software; newegg                             | EU unverified                    |

Mikään ei ole rugged (ei laajaa lämpöaluetta, ei DIN/19"). ubuntu.com/certified-merkintää ei löytynyt yhdellekään GB10-laatikolle.

## 2. Jetson AGX Thor T5000 -järjestelmät — **Arm, ei testatussa pinossa**

T5000: 2 560-ytiminen Blackwell, 128 GB LPDDR5X, 2 070 TFLOPS FP4 (sparse), 14× Neoverse V3AE, 40–130 W. JetPack 7 = Ubuntu 24.04 -pohja; **Ubuntu Server 24.04 on Canonicalin sertifioima Thorille** (verified).

| Valmistaja        | Malli                      | Muoto / lämpö                                  | Hinta (viite)                                                            | EU                               | Lähde                                             | Verified?                          |
| ----------------- | -------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------- | ------------------------------------------------- | ---------------------------------- |
| NVIDIA            | AGX Thor Developer Kit     | dev kit, ei rugged                             | $3 499; Silicon Highway €4 790 ex VAT; korotus $5 499 raportoitu 07/2026 | Silicon Highway, Arrow, reichelt | hackster.io; siliconhighwaydirect.com; videocardz | $3 499 verified; $5 499 unverified |
| Advantech         | MIC-743-AT                 | fanless, 25GbE                                 | CoastIPC $9 720–14 080                                                   | Elmark, Impulse (UK), Mouser     | advantech.com; coastipc.com                       | malli verified; hinta unverified   |
| Aetina            | AIE-PT (fanless) / AIE-KT  | rugged                                         | n/a                                                                      | ei Nordic-jakelijaa              | aetina.com                                        | julkistus verified                 |
| Connect Tech (CA) | Anvil-T5 / Gauntlet AGX301 | rugged box                                     | $13 876 / $7 681 (WDL)                                                   | vain US                          | wdlsystems.com                                    | unverified                         |
| **Syslogic (CH)** | RPC RSL A5AGX / RML A5AGX  | rugged, fanless, −25…+60 °C, IP67/69, 9–45 VDC | tarjous                                                                  | Syslogic direct, Assured (UK)    | syslogic.com; eenewseurope                        | specs verified                     |
| Forecr (TR)       | DSBOX-THRMAX               | teollinen box, 25GbE                           | €6 085–9 815 (ristiriitainen)                                            | Forecr direct                    | linuxgizmos; forecr.io                            | unverified                         |
| Vecow             | EAC-7000                   | rugged, −25…+70 °C                             | tarjous                                                                  | Assured, Impulse, Lextron (NL)   | vecow.com; impulse-embedded                       | lämpö verified                     |
| Auvidea (DE)      | X242 carrier               | carrier-kortti, 2×10GbE, PCIe x16              | €799 + ALV                                                               | Auvidea direct                   | auvidea.eu                                        | verified                           |
| MSI               | MS-C913                    | Orin Nano/NX, ei Thor                          | n/a                                                                      | Elmark                           | linuxgizmos                                       | ei 70B-kyvykäs                     |

## 3. x86 teollisuus-PC:t erillisellä NVIDIA-GPU:lla (prioriteettiluokka)

Vain kolme ensimmäistä riviä täyttävät ≥96 GB / ≥500 TFLOPS -tavoitteen. Boardyn nimeämät rugged-mallit eivät yllä 70B-luokan paikalliseen inferenssiin.

| Valmistaja                    | Malli                                                            | GPU / muisti                                                      | Muoto / lämpö                                                   | Ubuntu 24.04                                                         | Hinta (viite)                    | EU-jakelija                                                | Lähde                                           | Verified?                                     |
| ----------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------- |
| **Neousys**                   | **Nuvo-10109GC**                                                 | 1× 600 W slot → RTX PRO 6000 Blackwell 96 GB (~4 000 TOPS FP4)    | rugged box, 9–32 VDC; GPU tuuletettu; lämpöalue ei kirjattu     | preload-optio; ei sertifioitu (Neousys hakee Red Hat -sertifiointia) | tarjous; GPU yksin ~$7 500–8 900 | **OEM Finland Oy**, Bressner (DE), Sensor ECS (DK), Elmark | omtec.de manual; sensorecs.dk                   | GPU-luokka verified                           |
| Neousys                       | Nuvo-10208GC                                                     | 2× 350 W: RTX PRO 6000 Max-Q (2× 96 GB) tai 2× RTX 6000 Ada 48 GB | rugged box, ignition, 10G                                       | preload-optio                                                        | n/a                              | Bressner, BVM, Assured                                     | neousys-tech.com press 484; assured-systems.com | verified                                      |
| Neousys                       | Nuvo-10108GC                                                     | 1× 350 W: RTX 6000 Ada 48 GB; Intel 12–14th gen, DDR5             | rugged box, 3 PCIe                                              | preload $0 (CoastIPC)                                                | base $2 120 + GPU $9 825 ≈ $12k  | Bressner, recab (SE/NO/DK), AT-IPC, BVM                    | coastipc.com; bressner.de                       | verified; 48 GB → 70B-4bit marginaalinen      |
| Neousys                       | GT-92GC                                                          | RTX 2000 Ada 16 GB (70 W); ECC DDR5 ≤128 GB                       | **2U 19" fanless**, −25…+55 °C, 8× M12 PoE, EN 50155 -variantti | Linux; ei sert.                                                      | $4 690–4 965                     | Elmark, omtec, recab, elvac, Assured                       | neousys-tech.com; coastipc.com                  | verified; **ei 70B**                          |
| Neousys                       | Nuvo-7164GC                                                      | L4 24 GB / T4 / A2; 8./9. gen Intel; DDR4 ≤64 GB                  | fanless, −25…+60 °C                                             | Linux; vanha alusta                                                  | n/a                              | Elmark, CoastIPC, Assured                                  | coastipc.com; Neousys manual                    | verified; **ei 70B, CPU EOL-riski**           |
| Stealth (CA)                  | SR-2950                                                          | Quadro T1000 4 GB; 6./7. gen, ECC-optio                           | 2U 19" fanless, −25…+60 °C, EN 50155/50121                      | ei ilmoitettu                                                        | $4 430                           | **vain suoramyynti** (sales@stealth.com)                   | stealth.com; shop.stealth.com                   | verified; **ei 70B, vanha**                   |
| Advantech                     | TPC-B610                                                         | PCIe x16 ≤75 W GPU; 10. gen LGA1200; DDR4 ≤64 GB                  | fanless modulaarinen                                            | Advantech Linux; ei sert.                                            | n/a                              | **Elkome (FI)**, Elmark, Mouser                            | advantech.com; elmark-automation.com            | verified; **ei 70B**                          |
| Advantech                     | AIR-520                                                          | 4U EPYC, 2–4× RTX 6000 Ada, NVIDIA-Certified                      | 4U palvelin, ei fanless                                         | Ubuntu 22.04; 24.04 unverified                                       | n/a                              | Advantech EU, Westercom                                    | advantech.com news                              | verified (palvelin)                           |
| Premio (US/DE)                | RCO-6000-RPL-2                                                   | RTX A2000 12 GB / RTX 4000 SFF Ada 20 GB; DDR5 ≤96 GB             | fanless rugged, −25…+60 °C, MIL-STD-810G                        | Ubuntu 22.04; 24.04 unverified                                       | barebone $1 305                  | Assured (UK), HighTech Nordic (SE)                         | premioinc.com; assured-systems.com              | verified; **ei 70B**                          |
| MSI IPC                       | MS-C906                                                          | ei GPU-paikkaa; iGPU                                              | fanless mini, −20…+70 °C, IEC 61373                             | unverified                                                           | n/a                              | **Data Modul (FI)**, Elmark, Rosch, Spo-comm               | ipc.msi.com; elmark                             | verified; **gateway-luokka**                  |
| Vecow                         | GPC-1000 / ECX-3000                                              | 2× 750 W slot, 9. gen CPU                                         | rugged                                                          | unverified                                                           | n/a                              | Assured, Lextron                                           | directindustry                                  | unverified Blackwellille                      |
| Siemens                       | SIMATIC IPC + NVIDIA (Industrial Operations X); BX-35A (Orin NX) | n/a                                                               | kaappi-IPC                                                      | SIMATIC Industrial OS (Debian), ei Ubuntu                            | n/a                              | Siemens FI                                                 | press.siemens.com                               | unverified (ei SKU/GPU)                       |
| Kontron                       | KBox C/R                                                         | ei RTX 6000 Ada -mallia                                           | —                                                               | —                                                                    | —                                | —                                                          | kontron.com                                     | N/A                                           |
| Beckhoff                      | C6675                                                            | ATX, GPU-kortti ≤300 W                                            | kaappi-IPC                                                      | **listauksessa vain Windows IoT/Server**                             | n/a                              | Beckhoff Oy (FI)                                           | beckhoff.com C6675-0070                         | verified (Windows-listaus); ks. §7 ristiriita |
| EDGECON GmbH (DE, Deggendorf) | RugCon-RVS mini-IPC:t; OEM Enbik (TW)                            | ei GPU/LLM-tuotetta                                               | fanless mini                                                    | unverified                                                           | n/a                              | direct; aktiivinen 02/2026                                 | edgecon.ai; it-production.com                   | olemassaolo verified; **ei sopivaa tuotetta** |

## 4. Ei-NVIDIA, kirjan vuoksi (x86, AMD Ryzen AI Max+ 395, 128 GB jaettu)

| Valmistaja | Malli           | Hinta                   | Lähde        | Huomio                                        |
| ---------- | --------------- | ----------------------- | ------------ | --------------------------------------------- |
| Framework  | Desktop 128 GB  | $1 999 → $3 449 (nousu) | phoronix.com | Ubuntu tuettu, ei sertifioitu; ~96 GB GPU:lle |
| GMKtec     | EVO-X2 128 GB   | $3 499,99 (volatiili)   | gmktec.com   | Windows; Linux yhteisö                        |
| Beelink    | GTR9 Pro 128 GB | $2 399–4 349            | videocardz   | unverified                                    |
| HP         | Z2 Mini G1a     | US $2 999               | techradar    | unverified                                    |

Muistikaista ~256 GB/s, ei CUDA; Phoronix: Dell GB10 edellä Frameworkia llama.cpp:ssä.

## 5. Ubuntu 24.04 -sertifiointi

| Alusta                                                                 | Tila                                                                                       | Lähde                                                           |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Jetson AGX Thor                                                        | **Ubuntu Server 24.04 sertifioitu**                                                        | ubuntu.com/download/nvidia-jetson; canonical.com blog           |
| GB10-laatikot                                                          | DGX OS 7 Ubuntu 24.04 -pohja; **ei certified-merkintää**; Ubuntu Pro sisältyy (yksi lähde) | forums.developer.nvidia.com; github timothystewart6/ubuntu-gb10 |
| Advantech MIC-770 V3W                                                  | **24.04 sertifioitu** (operaattorityöasema-luokka)                                         | ubuntu.com/blog                                                 |
| Neousys (kaikki)                                                       | ei Ubuntu-sertifiointia; preload tarjolla; Nuvo-9160GC Red Hat -sertifioitu 2026           | neousys-tech.com press 601                                      |
| Vecow, Premio, Stealth, MSI IPC, Siemens, Beckhoff, EDGECON, AMD-minit | ei löydetty                                                                                | —                                                               |

## 6. TPM 2.0 — vaiheen 0 testi, ei ostokriteeri

Linux-attestointi on geneeristä: `tpm2-tools 5.7` Ubuntu 24.04:ssä, `tpm2_createek/createak/quote/checkquote` dokumentoitu (verified). Yksikään valmistaja ei dokumentoi quote-attestointia erikseen.

| Malli                      | TPM                                         | dTPM vs fTPM                                                        | Piiri      | Verified?     |
| -------------------------- | ------------------------------------------- | ------------------------------------------------------------------- | ---------- | ------------- |
| Neousys GT-92GC            | kyllä                                       | **dTPM 2.0** (Neousys + CoastIPC)                                   | ei nimetty | dTPM verified |
| Neousys Nuvo-7164GC        | "on-board TPM 2.0 module", BIOS-oletus pois | diskreetti implisiittisesti                                         | ei nimetty | unverified    |
| Neousys Nuvo-1010x/10208GC | TPM 2.0 datalehdessä                        | ei ilmoitettu                                                       | ei nimetty | unverified    |
| Stealth SR-2950            | TPM 2.0                                     | ei ilmoitettu (6./7. gen → voi olla Intel PTT)                      | —          | unverified    |
| Advantech TPC-B610         | TPM 2.0                                     | ei ilmoitettu; PCA-TPM-lisämoduulit viittaavat diskreettiin optioon | —          | unverified    |
| Premio RCO-6000-RPL-2      | TPM 2.0                                     | ei ilmoitettu                                                       | —          | unverified    |
| MSI MS-C906                | "Onboard TPM 2.0"                           | todennäköisesti diskreetti                                          | —          | unverified    |
| GB10 / Thor                | ei haettu (budjetti)                        | —                                                                   | —          | —             |

Vaiheen 0 toimenpide: pyydä jälleenmyyjältä TPM-piirin osanumero (odotus Infineon SLB 9670/9672 tai Nuvoton NPCT75x) ja aja `tpm2_getcap properties-fixed` lainalaitteella. Huom. nykyinen pysäytyspolku ei nojaa TPM:ään (Ed25519-avaimet, operaattorin avain laitteen ulkopuolella).

## 7. Jälleenmyyjät (Nordic ensin; julkaistut yrityskontaktit)

| Valmistaja                          | Jälleenmyyjä (maa)                                              | URL                                    | Julkinen kanava                           | Verified?             |
| ----------------------------------- | --------------------------------------------------------------- | -------------------------------------- | ----------------------------------------- | --------------------- |
| Neousys                             | **OEM Finland Oy (FI)**                                         | neousys-tech.com/.../wheretobuy-fi     | +358 207 499 499, info@oem.fi             | verified              |
| Neousys                             | OEM Automatic AB (SE)                                           | neousys-tech.com/.../wheretobuy-se     | +46 75-242 41 80, imaging@oemautomatic.se | verified              |
| Neousys                             | Recab (SE/NO/DK); Sensor ECS (DK)                               | recab.com; sensorecs.dk                | lomake                                    | unverified            |
| Neousys                             | Bressner Technology GmbH (DE)                                   | bressner.de                            | +49 8142 47284-0, vertrieb@bressner.de    | verified              |
| Neousys / Advantech / MSI IPC       | Elmark Automatyka S.A. (PL, toimittaa EU:hun)                   | elmark-automation.com                  | verkkokauppa                              | verified              |
| Neousys / Vecow / Premio / Syslogic | Assured Systems (UK; EMEA)                                      | assured-systems.com                    | lomake                                    | verified              |
| Advantech                           | **Elkome Oy (FI, Hyvinkää)**                                    | elkome.com; advantech.com/partner/199  | +358 29 007 4410, sales@elkome.com        | verified              |
| Advantech                           | Advantech Europe B.V. Nordic (Tukholma)                         | page.advantech.com/eiot-contact        | sivun kontakti                            | unverified            |
| Advantech / Premio                  | HighTech Nordic AB (SE)                                         | hightechnordic.com                     | +46 10 177 58 00, info@hightechnordic.com | verified (Advantech)  |
| Advantech                           | Mouser (FI)                                                     | mouser.fi                              | +358 800 119 414                          | verified              |
| Stealth                             | vain suoramyynti (Kanada)                                       | stealth.com/faq                        | sales@stealth.com, +1 905 264 9000        | verified              |
| MSI IPC                             | **Data Modul (FI, Espoo)**                                      | se.msi.com/page/ipc_wheretobuy         | +358 400 244 611                          | unverified            |
| MSI IPC                             | Rosch Computer (DE), Spo-comm (DE); MSI direct ipcsales@msi.com | rosch-computer.de                      | lomake                                    | verified              |
| Vecow                               | Assured (UK), Lextron (NL)                                      | assured-systems.com; lextron.nl        | lomake                                    | verified / unverified |
| Syslogic                            | Syslogic AG (CH)                                                | syslogic.com                           | lomake                                    | verified              |
| Thor dev kit                        | Silicon Highway, Arrow, reichelt                                | siliconhighwaydirect.com; reichelt.com | verkkokauppa                              | verified              |
| GB10                                | Bechtle (DE/FI), Multitronic (FI), Elara (IE)                   | ks. §1                                 | verkkokauppa                              | verified              |
| EDGECON                             | EDGECON GmbH (DE)                                               | edgecon.ai                             | lomake                                    | olemassaolo verified  |

## 8. Avoimet ja lähteistetyt lisäykset (01.10.2026)

Boardyn 20.30–20.45 väitteet on auditoitu erikseen lähteineen: `docs/field-notes/2026-10-01-boardy-claims-audit.md`. Tähän on otettu vain lähteistetyt kohdat.

1. **Intel Arc Pro B50 / B60:** B50 16 GB, 170 TOPS INT8, 70 W, MSRP $299; B60 24 GB, 197 TOPS INT8, 120–200 W, ~$500 ([AEC Magazine](https://aecmag.com/news/intel-arc-pro-b50-and-b60-pro-gpus-launch/), [VideoCardz](https://videocardz.com/newz/intel-announces-arc-pro-b60-24gb-and-b50-16gb-cards-dual-b60-features-48gb-memory)). Intel on US-omisteinen → §3.6 Tier 2 kuten NVIDIA. Teollisuus-IPC-integraattorit hakematta.
2. **Beckhoff:** perheomisteinen GmbH & Co. KG ([Wikipedia](https://en.wikipedia.org/wiki/Beckhoff_Automation)); Beckhoff RT Linux Debian-pohjainen, RT-ydin, Docker/Podman/LXC, GPU käytettävissä ([Beckhoff](https://www.beckhoff.com/en-us/products/product-news/linux-r/)). **Mallikohtainen tarkistus puuttuu:** C6675-listaus näytti vain Windowsin. **Outokumpu käyttää Beckhoffia** (HIC 01.10.2026; evidenssi HIC:llä, julkista lähdettä ei löytynyt).
3. **Siemens:** Industrial Edge Device OS: Secure Boot, TPM-levynsalaus, mitattu käynnistysketju, IMA ([Siemens docs](https://docs.eu1.edge.siemens.cloud/get_started_and_operate/security/security_overview/ie_components_security_measures/ied_security.html)). IoT2050 käyttää fTPM:ää (OP-TEE), ei diskreettiä eikä erillistä moduulia ([meta-iot2050](https://github.com/siemens/meta-iot2050/releases)). EFI-muuttujatiedote SSA-216014 koskee SIMATIC IPC -perhettä ([CISA](https://www.cisa.gov/news-events/ics-advisories/icsa-25-072-11)).
4. **Kontron:** Kontron AG Linz (AT); Ennoconn (Foxconn-tytär) ylitti 30 % 10.06.2026, tarjous 23,50 € ([Investing.com](https://www.investing.com/news/stock-market-news/ennoconn-triggers-mandatory-offer-for-kontron-at-235-per-share-93CH-4735826)); tarjouksen jälkeen 48,36 % ([heise](https://www.heise.de/en/news/Kontron-is-now-almost-half-owned-by-Foxconn-11409477.html)). §3.6-luokka on tulkinta: ei emoa, suurin omistaja TW.
5. **ABB:** pääkonttori Zürich, listattu SIX ja Nasdaq Stockholm ([Wikipedia](https://en.wikipedia.org/wiki/ABB)). §3.6:sta puuttuu sääntö listatuille ja EFTA-yhtiöille; sama koskee Siemens AG:ta.
6. **Seuraava haku:** Beckhoff- ja Siemens-IPC-mallit per malli (RT Linux / Industrial OS -tuki, GPU-paikka, dTPM, Landlock-ydin), B&R Automation PC, Intel Arc Pro -integraattorit.

## 9. Suositus hinnaston SKU-joukoksi

**HIC 01.10.2026: pysy x86:ssa, Arm-pohjainen pino ei päde.** Kohdat 1, 2, 5 ja 6 alla ovat siksi vain kirjausta; pilotin laskentasolmu valitaan kohdista 3, 4 ja §8:n Beckhoff/Siemens-hausta.

1. **Halvin 1× solmu (Arm, DGX-yhteensopiva):** Lenovo ThinkStation PGX 128 GB/1 TB, ~€4 565 Bechtle DE (verified); sama GB10 ja DGX OS kuin Spark/GN100; vain toimistoympäristö.
2. **Vaihtoehto:** HP ZGX Nano G1n, DE UVP €3 929 sis. ALV (verified).
3. **x86 yhden GPU:n 70B-solmu:** Neousys Nuvo-10109GC + RTX PRO 6000 Blackwell 96 GB; ainoa x86 rugged -polku ≥96 GB yhdellä kortilla; tarjous (odotus >€12k GPU:lla); Ubuntu 24.04 preload, ei sertifioitu; lämpöalue unverified. Tilaus OEM Finland Oy tai Bressner.
4. **x86 budjetti, 70B-marginaalinen:** Neousys Nuvo-10108GC + RTX 6000 Ada 48 GB, ≈$12k; käsitellään 32B-luokan solmuna.
5. **Rugged Arm (CUDA, JetPack 7, Canonical-sertifioitu Server 24.04):** Syslogic RPC RSL A5AGX (CH, −25…+60 °C, IP67/69; tarjous) tai Vecow EAC-7000. Forecr halvin hinnoiteltu, mutta hinta ristiriitainen.
6. **DGX-yhteensopiva rugged:** GB10:llä ei ole; lähin on Thor T5000 (sama Blackwell-GPU-perhe, 128 GB, CUDA 13), eli kohta 5; Arm, vaiheen 0 validointi.
7. Boardyn nimeämät 2U/fanless x86 -laitteet (GT-92GC, SR-2950, TPC-B610, RCO-6000, MS-C906) yltävät 4–24 GB GPU-muistiin: **Aegis edge/HMI-taso tai TPM-testipenkki**, eivät 70B-inferenssisolmuja.
8. Varmistettava ennen hinnoittelua: Nuvo-10109GC hinta/lämpö/TPM-piiri; MS-C931 €-hinta; Thor dev kit -korotus; kaikki TPM-piirit; GB10:n Ubuntu-sertifioinnin puute.
9. x86-only-säännön seuraus: kohdat 1, 2, 5, 6 putoavat; vain 3–4 (+ edge-taso) jää.
10. **Seuraava haku (Boardy/HIC):** Beckhoff- ja Siemens-mallit per malli (TPM 2.0 dTPM, mitattu käynnistys, Linux-BSP, GPU-paikka), B&R Automation PC, Intel Arc Pro -integraattorit. Outokumpu-casessa Beckhoff ensin.
