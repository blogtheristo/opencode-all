# Aegis: avaimet, HSM, työasema, tallennus, verkko, palomuuri, aikalähde, UPS, kaappi (markkinahaku)

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web), WebSearch-aliagentti | Date: 01.10.2026 | Changes: Ensimmäinen haku. Vain hakukatkelmat; "Verified" = kaksi riippumatonta lähdettä. | Harness: Claude Code + CLAUDE.md + DWS_MARKET_RESEARCH_STANDARD

Document Status:

- Created: 01.10.2026
- Classification: INTERNAL
- Status: DRAFT, PENDING_REVIEW. Hinnat markkinaviitteitä, eivät hinnaston hintoja.

---

## Tärkein tekninen havainto

Operaattoriavaimista vain **YubiKey 5** ja **Nitrokey 3** tukevat Ed25519:ää, ja vain OpenPGP-appletin (sign/auth) tai FIDO2:n kautta, **ei PIV:n**. Site-HSM:istä vain **YubiHSM 2** on pieni Ed25519-HSM; Nitrokey HSM 2 (EU) tukee vain P-256/P-384. Pilottipaketti allekirjoittaa Ed25519:llä (`src/aegis/pilot/crypto.ts`), joten avaimen pitää käyttää OpenPGP- tai FIDO2-polkua, tai pakettiin lisätään ECDSA P-256 -tuki Nitrokey HSM 2:ta varten. Vaiheen 0 testi.

## 1. Operaattoriavain ja site-HSM

| Valmistaja (HQ)   | Malli                        | Ed25519                     | Sertifiointi                  | Hinta (viite)       | Verified?          |
| ----------------- | ---------------------------- | --------------------------- | ----------------------------- | ------------------- | ------------------ |
| Yubico (SE/US)    | YubiKey 5C NFC               | OpenPGP + FIDO2, ei PIV     | FIDO2 L2                      | €69 sis. ALV        | verified           |
| Yubico            | YubiKey 5C NFC FIPS 140-3    | kuten yllä                  | FIPS 140-3                    | ~$88 / €105 (140-2) | unverified         |
| Yubico            | YubiKey Bio                  | ei (vain FIDO2)             | FIDO2                         | $98                 | **ei sovellu**     |
| **Nitrokey (DE)** | Nitrokey 3C NFC              | OpenPGP Ed25519, FIDO2, PIV | FIDO2 L1; SE050 EAL6+ (piiri) | €59–65              | verified           |
| Swissbit (CH/DE)  | iShield Key 2 Pro / Pro FIPS | ei todennäköisesti          | FIPS 140-3 L3                 | €41–53              | Ed25519 unverified |
| Token2 (CH)       | PIN+ R3.3                    | OpenPGP unverified          | FIDO2 L1 (väite)              | ~24 CHF             | unverified         |
| Yubico            | **YubiHSM 2 FIPS**           | **kyllä**                   | FIPS 140-3 L3                 | ~$950               | verified           |
| **Nitrokey (DE)** | Nitrokey HSM 2               | **ei** (P-256/P-384)        | CC EAL5+                      | €105–109            | verified           |
| Securosys (CH)    | Primus E2                    | EdDSA (dokumentaatio)       | FIPS 140-2 L3                 | tarjous             | unverified         |
| Utimaco (DE)      | u.trust Se100                | —                           | FIPS/CC EAL4+                 | tarjous             | unverified         |

## 2. Operaattorin työasema

| Valmistaja (HQ)     | Malli           | Huomio                                                                                                                                                                 | Hinta (viite) | Verified?             |
| ------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | --------------------- |
| Advantech           | **MIC-770 V3W** | fanless, **Ubuntu 24.04 -sertifioitu**                                                                                                                                 | ~€1 500–2 500 | sertifiointi verified |
| Advantech           | FPM-7211W-P3AE  | 21,5" PCAP, IP66 etu                                                                                                                                                   | $1 415        | verified              |
| OnLogic (US; EU NL) | Karbon 800      | rugged, −40…70 °C, Ubuntu 24.04 tilattavissa                                                                                                                           | $1 500–2 500  | unverified            |
| Siemens (DE)        | SIMATIC IPC227G | Industrial OS (Debian) virallinen                                                                                                                                      | ~€1 500       | OS verified           |
| **Beckhoff (DE)**   | CP3921-1500     | 15–24" IP65 paneeli, CP-Link                                                                                                                                           | tarjous       | unverified            |
| Kontron             | KBox A-250      | omistus: Ennoconn (Foxconn-tytär) 48,36 % 08/2026 ([heise](https://www.heise.de/en/news/Kontron-is-now-almost-half-owned-by-Foxconn-11409477.html)); §3.6-luokka avoin | tarjous       | unverified            |

## 3. Lokin kestotallennus

| Valmistaja             | Malli                           | PLP             | Hinta (viite) | Verified?    |
| ---------------------- | ------------------------------- | --------------- | ------------- | ------------ |
| Micron (US)            | 7450 PRO M.2 480/960 GB         | kyllä           | $338–680      | verified     |
| **Swissbit (DE/CH)**   | N3000 powersafe M.2             | kyllä, Berliini | EU-tarjous    | PLP verified |
| Innodisk / Cervoz (TW) | iCell / Powerguard M.2          | kyllä           | tarjous       | unverified   |
| QNAP (TW)              | TS-264-8G (QuTS hero ZFS, WORM) | —               | €546–582      | verified     |
| Synology (TW)          | DS225+                          | —               | ~€350–400     | unverified   |

## 4. Hallittava teollisuuskytkin

| Valmistaja (HQ)           | Malli                | IEC 62443         | Hinta (viite) | FI-kanava                          | Verified? |
| ------------------------- | -------------------- | ----------------- | ------------- | ---------------------------------- | --------- |
| **Westermo (SE)**         | Lynx 3510-F2G-T8G-LV | **4-2 SL2**       | €1 429        | Westermo FI (info.fi@westermo.com) | verified  |
| Moxa                      | EDS-4008-LV-T        | 4-2               | $784–1 150    | Hatteland Technology               | verified  |
| Siemens (DE)              | SCALANCE XC208       | 4-2               | £713          | Siemens Osakeyhtiö                 | verified  |
| Phoenix Contact (DE)      | FL SWITCH 2008       | 4-1 / 4-2 (linja) | $463–506      | Phoenix Contact Oy                 | verified  |
| Hirschmann/Belden (DE/US) | BOBCAT BRS20         | 4-1 (väite)       | $916–1 260    | Belden FI                          | verified  |
| Cisco (US)                | IE-3300-8T2S-E       | 4-2 CSA L2        | $3 299        | Cisco FI                           | verified  |
| Teltonika (LT)            | TSW212               | ei                | €107–121      | EU                                 | verified  |

## 5. Palomuuri / reunareititin (deny-all egress)

| Valmistaja (HQ)      | Malli                          | Sertifiointi                                                  | Hinta (viite)          | Verified?                                                       |
| -------------------- | ------------------------------ | ------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------- |
| **Stormshield (FR)** | SNi20 / SNi20HA                | **ANSSI, EU/NATO RESTRICTED**, CC EAL3+/4+, 62443-4-1, OT-DPI | €1 649 / €1 814 ex ALV | verified                                                        |
| **genua (DE)**       | genuscreen XS                  | CC EAL4+, BSI VS-NfD                                          | ~€1 545                | cert verified                                                   |
| Phoenix Contact (DE) | FL MGUARD RS4000 / 1100 / 4300 | 62443-4-1                                                     | €1 794                 | verified                                                        |
| Westermo (SE)        | Lynx 3510 (WeOS FW)            | 62443-4-2 SL2                                                 | €1 429                 | verified                                                        |
| Fortinet (US)        | FortiGate Rugged 70G           | IEC 61850-3, EN 50155                                         | $3 503                 | verified                                                        |
| Cisco (US)           | IR1101-K9                      | IEC 61850-3 (väite)                                           | $999–1 649             | verified                                                        |
| Teltonika (LT)       | RUTX11 / RUTX50                | —                                                             | €300–581               | verified; **mobiiliyhteys rikkoo deny-all-egressin → SIM pois** |

## 6. Aikalähde

| Valmistaja (HQ)           | Malli                         | Huomio                                                       | Hinta (viite)    | FI-kanava                               | Verified?               |
| ------------------------- | ----------------------------- | ------------------------------------------------------------ | ---------------- | --------------------------------------- | ----------------------- |
| **Meinberg (DE)**         | LANTIME M250/GPS              | NTP + PTP-optio, monikonstellaatio, OCXO-holdover            | €2 766 + ALV     | Ehrenborg Networks AB; Dustin.fi (M200) | hinta yksi lähde        |
| **Meinberg**              | microSync RX                  | **häirintä- ja spoofing-tunnistus → automaattinen holdover** | tarjous (~€4–8k) | Ehrenborg                               | ominaisuus verified     |
| Oscilloquartz/Adtran (CH) | OSA 5401 SyncPlug             | SFP-grandmaster                                              | ~€2 200          | Adtran EU                               | unverified              |
| Safran/Orolia (FR)        | SecureSync 2400 + BroadShield | 75+ spoofing-algoritmia, Rb-holdover                         | tarjous          | gomeasure.dk                            | ominaisuus verified     |
| TimeMachines (US)         | TM1000A                       | ei holdoveria, ei spoofing-tunnistusta                       | €420             | LT                                      | **ei täytä vaatimusta** |

## 7. UPS (NUT-tuki Linuxille)

| Valmistaja (HQ) | Malli                               | Huomio                                         | Hinta (viite)    | Verified?    |
| --------------- | ----------------------------------- | ---------------------------------------------- | ---------------- | ------------ |
| Eaton (IE/US)   | 5P 1550iR G2 + Network-M3           | Network-M3: UL 2900-1 + IEC 62443-4-2; NUT HCL | €1 199 (Bechtle) | verified     |
| Eaton           | 9PX 1500i RT2U                      | online                                         | ~€1 500–2 000    | unverified   |
| **Riello (IT)** | Sentinel Dual SDH 1500 + NetMan 204 | online; NUT riello-ajurit                      | €782–977         | NUT verified |
| APC (FR/US)     | SMT1500RMI2UC + AP9641              | NUT usbhid-ups                                 | ~€1 579          | unverified   |
| Salicru (ES)    | SLC-1500-TWIN RT2                   | online                                         | ~€960            | unverified   |

## 8. Kaappi

| Valmistaja (HQ) | Malli                                               | IP      | Hinta (viite) | FI-kanava         | Verified?                              |
| --------------- | --------------------------------------------------- | ------- | ------------- | ----------------- | -------------------------------------- |
| **Rittal (DE)** | AX IT 12U seinä + Blue e+ SK 3238 -suodatintuuletin | IP55/66 | $762–1 076    | Rittal Oy, Vantaa | EUR unverified                         |
| Rittal          | VX IT 24U IP55                                      | IP55    | £1 179–1 216  | Rittal Oy         | verified                               |
| APC             | NetShelter WX 13U                                   | IP20    | €649          | —                 | verified                               |
| Lande (TR)      | PROline 12U                                         | IP20    | €107–131      | EU                | verified; **vain puhtaisiin tiloihin** |

## 9. Suositus: oletus + EU-vaihtoehto per luokka

| Luokka           | Oletus                                | EU-suvereeni vaihtoehto                                |
| ---------------- | ------------------------------------- | ------------------------------------------------------ |
| Operaattoriavain | YubiKey 5C NFC (€69)                  | Nitrokey 3C NFC (DE, €59–65)                           |
| Site-HSM         | YubiHSM 2 FIPS (~$950, Ed25519)       | Nitrokey HSM 2 (DE, €109; vaatii ECDSA-tuen pakettiin) |
| Työasema         | Advantech MIC-770 V3W + FPM-7211W     | Siemens IPC227G + Beckhoff CP3921                      |
| Lokitallennus    | Micron 7450 PRO + QNAP TS-264         | Swissbit N3000 powersafe                               |
| Kytkin           | Westermo Lynx 3510 (€1 429, FI-haara) | sama (SE); budjetti Teltonika TSW212                   |
| Palomuuri        | Stormshield SNi20 (€1 649)            | sama (FR); genua genuscreen XS (DE)                    |
| Aikalähde        | Meinberg LANTIME M250/GPS (€2 766)    | sama (DE); microSync RX spoofing-suojaan               |
| UPS              | Eaton 5P 1550iR G2 (€1 199)           | Riello Sentinel Dual SDH 1500 (IT)                     |
| Kaappi           | Rittal AX IT 12U + suodatintuuletin   | sama (DE)                                              |

Avoinna: Ed25519 ei toimi PIV:llä millään avaimella → vahvista OpenPGP- tai FIDO2-polku pysäytykselle; tarjoukset Swissbit N3000, microSync RX, Rittal AX IT, Beckhoff CP3921; jokainen "unverified"-hinta toisesta lähteestä ennen hinnastoa.
