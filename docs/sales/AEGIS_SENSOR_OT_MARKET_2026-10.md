# Aegis: sensorit, sensorihubit ja vain-luku OT-yhdyskäytävät (markkinahaku)

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web), WebSearch-aliagentti | Date: 01.10.2026 | Changes: Ensimmäinen haku + ABB/DE/FI-lisäys. Vain hakukatkelmat; "Verified" = kaksi riippumatonta lähdettä. Lisäyksen rivit merkinnällä "no search" ovat mallin tietoa ilman lähdettä (hakubudjetti loppui) eivätkä saa mennä hinnastoon ennen lähteistämistä. | Harness: Claude Code + CLAUDE.md + DWS_MARKET_RESEARCH_STANDARD

Document Status:

- Created: 01.10.2026
- Classification: INTERNAL
- Status: DRAFT, PENDING_REVIEW. Hinnat ovat DE/PL/UK-listahintoja; FI-hinnat pyydettävä (Elkome, Movetec, TK Engineering, Advenica Oy, Treon, Siemens Osakeyhtiö, ABB Oy).

---

## Vain-luku-periaate (kaikki työnkulut)

Aegis-solmu on vain OPC UA / Modbus / MQTT -asiakas tai -tilaaja. PLC/DCS-puolen OPC UA -palvelimen käyttäjärooli = vain luku -sertifikaatti. Modbus TCP yhdyskäytävän kautta, jossa kirjoitusfunktiot 05/06/15/16 estetty (Moxa/Softing-suodatin), tai data-diodin kautta, jos kohteen politiikka vaatii. Etäyhteysominaisuudet pois (esim. Ewon Talk2M).

## 1. Sensorihubit / etä-I/O

| Valmistaja (HQ)      | Malli                            | Protokollat                      | Tehtävä                            | Hinta (viite)     | FI-kanava                       | Verified?             |
| -------------------- | -------------------------------- | -------------------------------- | ---------------------------------- | ----------------- | ------------------------------- | --------------------- |
| Advantech (TW)       | ADAM-6017-D                      | Modbus TCP, MQTT/TLS, SNMP, REST | 8 AI + 2 DO, analogiset lähettimet | €282 netto        | **Elkome Oy**, +358 29 007 4410 | verified              |
| Advantech            | ADAM-6050-D / 6060-D1            | Modbus TCP, MQTT                 | DI-laskurit, eräsignaalit          | ~$246–265         | Elkome                          | hinta unverified      |
| Advantech            | WISE-4012-AE                     | Modbus TCP, MQTT, Wi-Fi          | 4 UI + 2 DO, loggeri               | €160 netto        | Elkome, Elmark                  | verified              |
| Moxa (TW)            | ioLogik E1242 / -T               | Modbus TCP, EtherNet/IP, REST    | 4 AI + 4 DI + 4 DIO                | €326 / €482 netto | **Movetec Oy**                  | verified              |
| Moxa                 | ioThinx 4510                     | Modbus TCP/RTU, MQTT, SNMP       | modulaarinen I/O-pää               | €344 netto        | Movetec                         | unverified            |
| Beckhoff (DE)        | EK9000                           | Modbus TCP/UDP                   | EtherCAT-väyläkytkin               | €258–299          | Beckhoff Automation Oy          | verified              |
| Beckhoff             | CX7000 + TF6100                  | OPC UA                           | sulautettu PC OPC UA -palvelimena  | ~€200 + €216      | Beckhoff Oy                     | unverified            |
| Siemens (DE)         | ET 200SP IM 155-6 PN ST          | PROFINET                         | hajautettu I/O                     | €290–315          | Siemens Osakeyhtiö              | verified              |
| Weidmüller (DE)      | UR20-FBC-MOD-TCP-V2              | Modbus TCP                       | u-remote-kytkin                    | £377 / €514       | Elit (EE)                       | verified              |
| Phoenix Contact (DE) | AXL F BK ETH; AXC F 2152 PLCnext | Modbus TCP; OPC UA               | kytkin; reunaohjain                | ~€344; ~$880–990  | Phoenix Contact Oy              | verified / unverified |
| WAGO (DE)            | 750-362; PFC200 750-8212         | Modbus TCP; OPC UA, MQTT         | I/O-pää; reunaohjain               | ei lähdettä       | WAGO Finland Oy                 | no search             |
| Teltonika (LT)       | TRB246 (TRB245 EOL)              | Modbus TCP/RTU, MQTT, LTE        | sarja/IO-yhdyskäytävä              | €168–175 (TRB245) | EU-laaja                        | verified              |

## 2. Energia, höyry/kaasu, värähtely

| Valmistaja (HQ)                       | Malli                                                 | Protokollat                            | Mittaa                                                            | Hinta (viite)            | FI-kanava                                         | Verified?            |
| ------------------------------------- | ----------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------- | ------------------------ | ------------------------------------------------- | -------------------- |
| Janitza (DE)                          | UMG 96-PA; UMG 801                                    | Modbus RTU/TCP; UMG 801: OPC UA, REST  | teho, energia, PQ                                                 | €427; €1 497–1 740 netto | Janitza FI, Espoo                                 | verified             |
| **ABB (CH)**                          | M4M 30 Ethernet / Modbus                              | Modbus TCP / RTU                       | 3-v verkkoanalysaattori                                           | £524 / £556              | **ABB Oy Electrification**, Onninen, Ahlsell, SLO | verified             |
| ABB                                   | EQmatic QA/S + EQ B21/B23/B24                         | Modbus TCP ylös; RTU/M-Bus mittareille | mittarikeräin, MID-mittarit                                       | ei lähdettä              | ABB Oy                                            | no search            |
| Carlo Gavazzi (IT)                    | EM540                                                 | Modbus RTU                             | 3-v energia, MID                                                  | €247 sis. ALV            | Carlo Gavazzi OY AB                               | verified             |
| Schneider (FR)                        | PowerLogic PM5560                                     | Modbus TCP/RTU                         | PQ                                                                | £1 415                   | Schneider FI                                      | unverified           |
| Siemens (DE)                          | SENTRON PAC3220 / PAC4200                             | Modbus TCP                             | tehonvalvonta                                                     | £466                     | Siemens Osakeyhtiö                                | unverified           |
| Eastron (CN)                          | SDM630-Modbus V2 MID                                  | Modbus RTU                             | 3-v energia                                                       | €80–159                  | autonlataus.com (FI)                              | verified             |
| Phoenix Contact                       | EMpro EEM-MA370                                       | Modbus TCP, REST                       | energia                                                           | $420–540                 | Phoenix Contact Oy                                | unverified           |
| Endress+Hauser (CH)                   | Prowirl F 200                                         | HART; Modbus-optio varmistettava       | höyry/kaasu, vortex                                               | alk. $4 700              | E+H Oy, Vantaa                                    | unverified           |
| Endress+Hauser                        | t-mass F 300 / B 150                                  | HART, Modbus RS485 (F 300)             | kaasun massavirta                                                 | $5 700 / €1 248          | E+H Oy                                            | protokolla verified  |
| **KROHNE (DE)**                       | OPTISWIRL 4200                                        | Modbus RTU (datalehti), HART           | höyry/kaasu P/T-kompensoituna                                     | $4 100–6 000             | KROHNE Oy                                         | protokolla verified  |
| ABB M&A (DE/UK)                       | SwirlMaster FSS450; VortexMaster; Sensyflow FMT500-IG | HART; Modbus-optio varmistettava       | höyry/kaasu                                                       | ei lähdettä              | ABB Oy                                            | no search            |
| Kamstrup (DK)                         | MULTICAL 603 + Modbus-moduuli                         | Modbus TCP/RTU                         | lämpöenergia, MID                                                 | moduuli ~$199            | Kamstrup Oy                                       | unverified           |
| **ABB Drives (FI, Pitäjänmäki)**      | ACS880 / ACS580 + FENA-21                             | Modbus TCP                             | taajuusmuuttajan teho, kWh, lämpö; kirjoitus lukittu parametrilla | ei lähdettä              | ABB Oy Drives                                     | no search            |
| Danfoss Drives / ex-Vacon (FI, Vaasa) | VACON 100 / NXP + OPTE9                               | Modbus TCP/RTU                         | taajuusmuuttajan telemetria                                       | ei lähdettä              | Danfoss Vaasa                                     | no search            |
| Advantech                             | WISE-2410-EB                                          | LoRaWAN → MQTT                         | värähtely + lämpö                                                 | €355–400                 | Elkome                                            | verified             |
| **Treon (FI, Tampere)**               | Industrial Node / 6 Ex + Gateway 2                    | Wirepas → MQTT                         | värähtely ≤1 kHz + lämpö, IP67, Ex                                | ~$150–600/solmu          | sales@treon.fi                                    | olemassaolo verified |
| ifm (DE)                              | VVB001 + AL1350                                       | IO-Link → MQTT, Modbus TCP             | värähtely + lämpö                                                 | ~€470 / €264–307         | ifm electronic Oy                                 | verified             |
| Banner (US)                           | QM30VT2                                               | Modbus RTU                             | värähtely + lämpö                                                 | $314–327                 | Banner EU                                         | verified             |
| **Wapice (FI, Vaasa)**                | WRM247LTE; IoT-TICKET                                 | Modbus, REST/MQTT                      | yhdyskäytävä + alusta (on-prem-optio)                             | tarjous                  | Wapice                                            | olemassaolo verified |

## 3. Datakeskus: ympäristö ja PDU

| Valmistaja (HQ)          | Malli                     | Protokollat                           | Mittaa                          | Hinta (viite)        | FI-kanava                     | Verified?       |
| ------------------------ | ------------------------- | ------------------------------------- | ------------------------------- | -------------------- | ----------------------------- | --------------- |
| Raritan/Legrand          | PX3-5190R + DX2-T1H1      | SNMPv3, Modbus TCP                    | PDU-teho + T/RH                 | £481 + $104–136      | Legrand EU                    | verified        |
| Schneider APC            | NetBotz 250 + AP9335TH    | SNMP, Modbus TCP                      | T/RH, ovi, vuoto                | £285 / $147–245      | Schneider FI                  | verified        |
| Rittal (DE)              | CMC III PU + 7030.111     | SNMP, Modbus TCP, OPC UA (unverified) | T/RH, ilmavirta, ovi            | PU £900; anturi €186 | Rittal Oy                     | anturi verified |
| Vertiv Geist             | rPDU2 + GTHD / RTAFHD3    | SNMP, Modbus                          | PDU + T/RH/ilmavirta            | $270–408             | Vertiv Finland                | verified (USD)  |
| Eaton                    | ePDU G3 + EMPDT1H1C2      | SNMPv3                                | PDU + T/RH                      | $1 811–2 908         | Eaton Power Quality Oy, Espoo | unverified      |
| **Vaisala (FI, Vantaa)** | HMP110 / Indigo520; HMW90 | Modbus TCP/RTU                        | referenssitason T/RH/kastepiste | ei lähdettä          | Vaisala                       | no search       |
| Produal (FI, Kotka)      | HDH-M / TEHR-M            | Modbus RTU                            | T/RH, edullinen kattavuus       | ei lähdettä          | Produal, SLO                  | no search       |

## 4. Vain-luku OT-yhdyskäytävät ja data-diodit

| Valmistaja (HQ)   | Malli                                   | Tehtävä                                         | Hinta (viite)        | FI-kanava                 | Verified?            |
| ----------------- | --------------------------------------- | ----------------------------------------------- | -------------------- | ------------------------- | -------------------- |
| **Softing (DE)**  | dataFEED uaGate SI                      | S7 → OPC UA + MQTT, vain-luku-tagit             | €760 netto           | **TK Engineering Oy**     | verified             |
| Softing           | edgeConnector / edgeAggregator (Docker) | OPC UA -aggregointi Aegis-solmulla              | tarjous              | TK Engineering            | unverified           |
| HMS/Ewon (SE)     | Flexy 205                               | monijärjestelmä → OPC UA, MQTT (etäyhteys pois) | €786–820             | HMS Nordic                | verified             |
| Moxa              | UC-8100A-ME-T + ThingsPro               | Modbus → OPC UA/MQTT                            | €614–667             | Movetec                   | verified             |
| PTC Kepware (US)  | KEPServerEX Siemens Plus                | S7 → OPC UA (Windows)                           | €866/v; €2 698 kesto | Klinkmann/Novotek         | verified             |
| Siemens           | OPC UA S7-1500 -lisenssi S/M/L          | PLC:n oma OPC UA, vain-luku-rooli               | $253–671             | Siemens Osakeyhtiö        | verified             |
| ABB               | 800xA OPC UA Server; Ability Edgenius   | DCS-tagit ja historia vain luku                 | ei julkinen          | ABB Oy, Helsinki          | no search            |
| **Advenica (SE)** | SecuriCDS DD1000i / DD1000A             | laitteistopohjainen yksisuuntaisuus             | alk. ~€3 000         | **Advenica Oy, Helsinki** | olemassaolo verified |
| genua (DE)        | cyber-diode                             | yksisuuntainen, natiivi OPC UA                  | tarjous              | genua direct              | OPC UA verified      |
| Sentyron/Fox (NL) | Fox DataDiode                           | EAL7+, NATO                                     | tarjous              | direct                    | verified             |
| Waterfall (IL)    | WF-600                                  | OPC UA- ja historian-replikointi                | tarjous              | Bakotech (EU)             | verified             |
| Owl (US)          | OPDS-100D                               | DIN-diodi                                       | tarjous              | EU-kumppanit              | unverified           |

## 5. Suositus: minimipaketti per työnkulku (vain luku)

**(a) Erätason hiilijalanjälki (kemia):** Janitza UMG 801 tai ABB M4M 30 (ABB-standardikohteissa) tai Carlo Gavazzi EM540 alamittareina; KROHNE OPTISWIRL 4200 höyrylle; E+H t-mass F 300 (tai B 150) kaasulle; Advantech ADAM-6017-D + ADAM-6050-D hubiksi; Softing uaGate SI DCS/MES-eräsignaaleille; valinnaisesti Advenica DD1000i. ABB ACS880 FENA-21 pumppujen/sekoittimien kWh:lle, jos ABB-käytöt.

**(b) Terästehtaan tuotantohuone (Level 2 / historian):** Siemens OPC UA S7-1500 -lisenssi tai ABB 800xA OPC UA Server lähteenä; Softing edgeAggregator tai Kepware aggregointiin; genua cyber-diode tai Advenica DD1000i yksisuuntaiseksi poluksi; Treon-solmut värähtelyyn; Janitza UMG 96-PA syöttöihin kWh/t-kontekstiin.

**(c) Datakeskus:** Raritan PX3 + DX2 per räkki; APC NetBotz 250 per rivi; Vertiv RTAFHD3 ilmavirtaan; Vaisala HMP110/Indigo520 referenssiksi; Janitza UMG 801 tai ABB M4M 30 UPS/CRAC-syöttöihin PUE:ta varten.

## 6. Avoimet

1. "no search" -rivit (ABB EQmatic/SwirlMaster/FENA-21/Edgenius/800xA, WAGO, Pepperl+Fuchs, Vaisala, Produal, Danfoss) lähteistettävä uudessa istunnossa.
2. FI-hinnat suoraan: ABB Oy, Vaisala, Treon, Wapice eivät julkaise hintoja.
3. Prowirl F 200 ja SITRANS FX330 Modbus-optiot varmistettava ennen hinnastoa; TRB245 on EOL → TRB246.
