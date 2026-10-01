# Aegis-pilottitoimituksen SKU-koostumus v2.0

---

# VERSION AND AGENT HISTORY

Version: 2.0 [Latest]

Sessions & Modifications:

- Version: 2.0 [Latest] | Tool: Claude Code (web) | Date: 01.10.2026 | Changes: Ensimmäinen versioitu SKU-koostumus FI-tekstin v2.0 mukaisesti, kerroksittain ohjelmistosta koulutukseen ja laitteistoon; asiakasprofiilit Outokumpu ja Kemira. Koneluettava pari: `AEGIS_PILOT_SKU_v2.0.json`. | Harness: Claude Code + CLAUDE.md

Document Status:

- Created: 01.10.2026
- Status: DRAFT, PENDING_REVIEW. Jäädytetään, kun HIC hyväksyy; muutokset uutena versiona (v2.1, …), vanhaa ei muokata.

---

## Säännöt

- Portti: NVIDIA CUDA -alusta (GB10 tai x86 + NVIDIA); vaiheen 0 harjoitusajo valitulla laitteella.
- Hinnat vain dws10.com/config/products.json:ssa; uudet SKU:t hinta TBD kunnes HIC päättää ja rivi lisätään products.json + landing-pages-peili samassa commitissa.
- Laitteisto ei hyvity ja jää tilaajalle.
- Koulutuksen toteutuskustannus Lifetime Oy:llä pilotissa; LWM v2 maksuton pilotissa, tekijänoikeus Lifetime Oy:llä.
- Tila "hinnastossa" = rivi on `products.json`:ssa; "uusi" = ehdotus, ei myytävissä ennen hinnoittelua.

## Rivit kerroksittain

### 1 Ohjelmisto (toistuva)

| SKU                   | Nimi                                              | Tila                  | Valintasääntö per asiakas                             | Pilottihinnassa              | Oletusmalli / huomio |
| --------------------- | ------------------------------------------------- | --------------------- | ----------------------------------------------------- | ---------------------------- | -------------------- |
| `DWS-AEGIS-PILOT-001` | DWS IQ Aegis Pilot (3 months)                     | hinnastossa           | aina 1                                                | kiinteä 19 990 €, hyvitetään |                      |
| `LWM-V2-LIC`          | Lifetime World Model v2, käyttölisenssi           | uusi, hinta TBD (HIC) | aina 1                                                | 0 € pilotissa                |                      |
| `LF-NIM-STARTER`      | NIM Microservices — Starter Profile               | hinnastossa           | valinnainen                                           | ei                           |                      |
| `LF-NIM-RETRIEVAL`    | NIM Microservices — Retrieval & Embedding Profile | hinnastossa           | valinnainen, jos haku tarvitaan                       | ei                           |                      |
| `DWS-EU-PILOT`        | DWS IQ — EU Sovereign Pilot                       | hinnastossa           | valinnainen synkronointi; ei, jos data ei saa poistua | ei                           |                      |

### 2 Palvelut (asiakaskohtainen)

| SKU                   | Nimi                                                         | Tila                  | Valintasääntö per asiakas          | Pilottihinnassa                 | Oletusmalli / huomio |
| --------------------- | ------------------------------------------------------------ | --------------------- | ---------------------------------- | ------------------------------- | -------------------- |
| `LWM-V2-CONF`         | LWM v2 asiakaskohtainen konfiguraatio ja sovitus             | uusi, hinta TBD (HIC) | aina 1                             | 0 € pilotissa (Lifetime kantaa) |                      |
| `LWM-V2-TRAIN`        | LWM v2 koulutusajo asiakasdatalla (LoRA)                     | uusi, hinta TBD (HIC) | sisältyy LWM-V2-CONF:iin pilotissa | 0 € pilotissa                   |                      |
| `AEG-TRAIN-OPS`       | Käyttöhenkilöstön koulutus (operaattori, työnkulun omistaja) | uusi, hinta TBD (HIC) | per koulutettava ryhmä             | 0 € pilotissa (Lifetime kantaa) |                      |
| `LF-NVIDIA-INSTALL`   | NVIDIA Model Installation + Full Service                     | hinnastossa           | 1 per laskentasolmu                | ei (laiterivi)                  |                      |
| `AEG-SENS-BUILD`      | Sensorisyötteiden liityntöjen rakentaminen ja yhdistäminen   | uusi, hinta TBD (HIC) | per syöteryhmä                     | HIC päättää                     |                      |
| `AEG-INT-OPCUA-RO`    | Liitin: OPC UA, vain luku (historian, DCS, Level 2)          | uusi, hinta TBD (HIC) | per lähdejärjestelmä               | HIC päättää montako sisältyy    |                      |
| `AEG-INT-MODBUS-MQTT` | Liitin: Modbus TCP / MQTT, vain luku                         | uusi, hinta TBD (HIC) | per hub                            | HIC päättää                     |                      |
| `AEG-INT-MES`         | Liitin: MES vain luku (Opcenter / SAP DM / AVEVA)            | uusi, hinta TBD (HIC) | per MES                            | HIC päättää                     | variantti per MES    |
| `AEG-INT-ERP`         | Liitin: ERP vain luku (S/4HANA, IFS, D365)                   | uusi, hinta TBD (HIC) | per ERP                            | HIC päättää                     |                      |
| `AEG-INT-DCIM`        | Liitin: DCIM/BMS vain luku (SNMP/Modbus/REST)                | uusi, hinta TBD (HIC) | datakeskus                         | HIC päättää                     |                      |

### 3 Laskenta (NVIDIA CUDA)

| SKU               | Nimi                                         | Tila                  | Valintasääntö per asiakas                     | Pilottihinnassa | Oletusmalli / huomio                                                                                                                           |
| ----------------- | -------------------------------------------- | --------------------- | --------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `edge-node-gn100` | Control Room — Acer Veriton GN100            | hinnastossa           | 1 solmu, pieni työnkulku                      | ei (laiterivi)  |                                                                                                                                                |
| `LF-DGX-SPARK`    | DGX Spark — NVIDIA-Branded Sovereign Edge AI | hinnastossa           | 1 solmu                                       | ei              |                                                                                                                                                |
| `LF-SITROOM-001`  | Situation Room — Two Sovereign AI Nodes      | hinnastossa           | 2 solmua, 24/7 tai varmennus                  | ei              |                                                                                                                                                |
| `LF-NODE-X86-NV`  | x86-teollisuus-PC + NVIDIA-GPU               | uusi, hinta TBD (HIC) | kun asiakas vaatii rugged/x86 tai oman merkin | ei              | variantit: -48 Neousys Nuvo-10108GC + RTX 6000 Ada 48 GB; -96 Nuvo-10109GC + RTX PRO 6000 96 GB; -BK Beckhoff, -SI Siemens (malli vaiheessa 0) |

### 4 Syötteet

| SKU                        | Nimi                                                           | Tila                  | Valintasääntö per asiakas            | Pilottihinnassa | Oletusmalli / huomio                                             |
| -------------------------- | -------------------------------------------------------------- | --------------------- | ------------------------------------ | --------------- | ---------------------------------------------------------------- |
| `LF-IPCMAX-IPC409`         | iPCMax IPC-409 — Compact Fanless Sensor Gateway                | hinnastossa           | sensoriyhdyskäytävä, x86             | ei              |                                                                  |
| `LF-IPCMAX-IPCP68`         | iPCMax IPC-P68 — Vision Gateway with PoE                       | hinnastossa           | konenäkö PoE, x86                    | ei              |                                                                  |
| `LF-IPCMAX-CINCOZE-DA1200` | Cincoze DA-1200 — Rugged Expandable Edge Computer              | hinnastossa           | OT-yhdyskäytävän alusta, x86         | ei              |                                                                  |
| `LF-JETSON-NANO`           | Jetson Sensor Node — Orin Nano Super + Install & Service       | hinnastossa           | valinnainen reunasensorisolmu (CUDA) | ei              |                                                                  |
| `LF-JETSON-NX`             | Jetson Sensor Mid — Orin NX 16 GB + Install & Service          | hinnastossa           | valinnainen reunasensorisolmu (CUDA) | ei              |                                                                  |
| `LF-JETSON-AGX`            | Jetson Sensor Concentrator — AGX Orin 64GB + Install & Service | hinnastossa           | valinnainen reunasensorisolmu (CUDA) | ei              |                                                                  |
| `LF-SENSHUB`               | Sensorihub / etä-I/O                                           | uusi, hinta TBD (HIC) | työnkulun mukaan                     | ei              | Advantech ADAM-6017-D + 6050-D (Elkome) / Moxa ioThinx (Movetec) |
| `LF-METER-PWR`             | Sähköenergiamittari                                            | uusi, hinta TBD (HIC) | työnkulun mukaan                     | ei              | Janitza UMG 801 / ABB M4M 30 / Carlo Gavazzi EM540               |
| `LF-METER-HEAT`            | Höyry-/lämpömittari                                            | uusi, hinta TBD (HIC) | työnkulun mukaan                     | ei              | KROHNE OPTISWIRL 4200 (Modbus RS485)                             |
| `LF-METER-GAS`             | Kaasuvirtausmittari                                            | uusi, hinta TBD (HIC) | työnkulun mukaan                     | ei              | E+H t-mass F 300 / B 150                                         |
| `LF-SENS-VIB`              | Värähtely-/lämpösensori                                        | uusi, hinta TBD (HIC) | työnkulun mukaan                     | ei              | Treon (FI) / ifm VVB001                                          |
| `LF-ENV-RACK`              | Räkin T/RH/ilmavirta                                           | uusi, hinta TBD (HIC) | työnkulun mukaan                     | ei              | APC NetBotz 250 / Vertiv RTAFHD3 / Vaisala (FI)                  |
| `LF-PDU-METER`             | Mitattu PDU                                                    | uusi, hinta TBD (HIC) | työnkulun mukaan                     | ei              | Raritan PX3-5190R                                                |
| `LF-OT-GW-RO`              | OT-yhdyskäytävä vain luku                                      | uusi, hinta TBD (HIC) | työnkulun mukaan                     | ei              | Softing uaGate SI (TK Engineering FI)                            |
| `LF-DIODE`                 | Data-diodi                                                     | uusi, hinta TBD (HIC) | työnkulun mukaan                     | ei              | Advenica DD1000i (Advenica Oy) / genua cyber-diode               |

### 5 Turva, verkko, infra

| SKU               | Nimi                                            | Tila                  | Valintasääntö per asiakas           | Pilottihinnassa | Oletusmalli / huomio                 |
| ----------------- | ----------------------------------------------- | --------------------- | ----------------------------------- | --------------- | ------------------------------------ |
| `LF-OP-KEY`       | Operaattorin laiteavain (OpenPGP/FIDO2 Ed25519) | uusi, hinta TBD (HIC) | väh. 2 per operaattori (pää + vara) | ei              | YubiKey 5C NFC / Nitrokey 3C NFC     |
| `LF-SITE-HSM`     | Site-avaimen HSM                                | uusi, hinta TBD (HIC) | valinnainen, korkea turva           | ei              | YubiHSM 2 FIPS (Ed25519)             |
| `LF-OP-WS`        | Operaattorin työasema + näyttö                  | uusi, hinta TBD (HIC) | 1 per tilannehuone                  | ei              | Advantech MIC-770 V3W + FPM-7211W    |
| `LF-LEDGER-STORE` | Lokin kestotallennus + WORM-peili               | uusi, hinta TBD (HIC) | 1 per solmu                         | ei              | Micron 7450 PRO PLP + QNAP TS-264    |
| `LF-NET-SWITCH`   | Hallittava teollisuuskytkin                     | uusi, hinta TBD (HIC) | jos asiakas ei tarjoa               | ei              | Westermo Lynx 3510                   |
| `LF-NET-EDGE-FW`  | Palomuuri, deny-all egress                      | uusi, hinta TBD (HIC) | jos asiakas ei tarjoa               | ei              | Stormshield SNi20                    |
| `LF-TIME-SRC`     | NTP/GNSS-aikalähde                              | uusi, hinta TBD (HIC) | 1 per kohde                         | ei              | Meinberg LANTIME M250                |
| `LF-UPS`          | UPS 1,5 kVA, NUT                                | uusi, hinta TBD (HIC) | 1 per kaappi                        | ei              | Eaton 5P 1550iR G2 / Riello SDH 1500 |
| `LF-RACK`         | Lukittava kaappi + suodatintuuletin             | uusi, hinta TBD (HIC) | 1 per kohde                         | ei              | Rittal AX IT 12U                     |

### 6 Tuotanto (päivä 91+)

| SKU                  | Nimi                                             | Tila        | Valintasääntö per asiakas | Pilottihinnassa                         | Oletusmalli / huomio |
| -------------------- | ------------------------------------------------ | ----------- | ------------------------- | --------------------------------------- | -------------------- |
| `DWS-AEGIS-001`      | DWS IQ Aegis                                     | hinnastossa | jatkettaessa              | hyvitys 19 990 € vain DWS-AEGIS-001:stä |                      |
| `DWS-AEGIS-SUB-001`  | DWS IQ Aegis — Maintenance Subscription          | hinnastossa | jatkettaessa              | ei                                      |                      |
| `DWS-AEGIS-IMPL-001` | DWS IQ Aegis Implementation Programme (3 phases) | hinnastossa | jatkettaessa              | ei                                      |                      |

## Ei pilotissa (hinnastossa, mutta ei tähän toimitukseen)

- `LF-IGX-ORIN`: ei osa pilottikoostumusta.
- `LF-K8S-*`: pilottipaketti ei käytä Kubernetesia.
- `LF-DOCA-*`: ei pilotin tarpeeseen.

## Asiakasprofiilit (esimerkkikoostumus, vahvistetaan vaiheessa 0)

### Outokumpu

- Työnkulku: tuotantohuoneen suositus (Level 2 / historian) tai IP/CBAM-dokumenttityönkulku; vaihe 0 valitsee
- Toimitusmuoto: Hybrid; synkronointi asiakkaan omaan Azure-tenanttiin, ei DWS-EU-PILOT

| SKU                              | Määrä                                 |
| -------------------------------- | ------------------------------------- | --- |
| `DWS-AEGIS-PILOT-001`            | 1                                     |
| `LWM-V2-LIC`                     | 1                                     |
| `LWM-V2-CONF`                    | 1                                     |
| `AEG-TRAIN-OPS`                  | 1                                     |
| `LF-SITROOM-001                  | LF-NODE-X86-NV-BK`                    | 1   |
| `LF-NVIDIA-INSTALL`              | 2                                     |
| `AEG-INT-OPCUA-RO`               | 1                                     |
| `LF-OT-GW-RO`                    | 1                                     |
| `LF-DIODE`                       | valinnainen                           |
| `LF-METER-PWR`                   | 1–2                                   |
| `LF-SENS-VIB`                    | vaihe 0                               |
| `LF-OP-KEY`                      | 4                                     |
| `LF-OP-WS`                       | 1                                     |
| `LF-LEDGER-STORE`                | 1                                     |
| `LF-TIME-SRC`                    | 1                                     |
| `LF-UPS`                         | 1                                     |
| `LF-RACK`                        | 1                                     |
| `LF-NET-SWITCH / LF-NET-EDGE-FW` | todennäköisesti asiakkaan (Palo Alto) |

Avoinna: historian- ja MES-toimittaja; Tietoevry-sopimuksen laitesääntö; Beckhoff-mallin GPU-paikka ja Linux.

### Kemira

- Työnkulku: erätason hiilijalanjälki yhdelle Fiber Essentials -tuotelinjalle
- Toimitusmuoto: Local/Edge; ei pilvisynkronointia; reseptit rajattu ulos

| SKU                   | Määrä              |
| --------------------- | ------------------ | --- |
| `DWS-AEGIS-PILOT-001` | 1                  |
| `LWM-V2-LIC`          | 1                  |
| `LWM-V2-CONF`         | 1                  |
| `AEG-TRAIN-OPS`       | 1                  |
| `edge-node-gn100      | LF-NODE-X86-NV-48` | 1   |
| `LF-NVIDIA-INSTALL`   | 1                  |
| `LF-SENSHUB`          | 1                  |
| `LF-METER-PWR`        | per linja          |
| `LF-METER-HEAT`       | 1                  |
| `LF-METER-GAS`        | 1                  |
| `AEG-INT-MES`         | 1                  |
| `AEG-INT-MODBUS-MQTT` | 1                  |
| `LF-IPCMAX-IPC409`    | 1                  |
| `LF-OP-KEY`           | 4                  |
| `LF-OP-WS`            | 1                  |
| `LF-LEDGER-STORE`     | 1                  |
| `LF-TIME-SRC`         | 1                  |
| `LF-UPS`              | 1                  |
| `LF-RACK`             | 1 (Seveso-tila)    |

Avoinna: ERP, historian, IT-toimittaja, pilvi; kuka hallinnoi OT/IT-rajan palomuuria; Track B -vastaus: päätöksen omistaja.

## Avoimet HIC-päätökset

1. Hinnat ja marginaali uusille SKU:ille; lisäys `products.json` + peili erillisessä PR:ssä.
2. Montako liitintä (`AEG-INT-*`) ja sensoriliityntää (`AEG-SENS-BUILD`) sisältyy pilottihintaan.
3. Lokin ankkurointitasot 1 ja 3 (operaattorin komentokopiot työasemalle, todistajan allekirjoitus): `docs/field-notes/2026-10-01-boardy-claims-audit.md`.
