# Aegis-pilotin toimituslista: case Outokumpu ja case Kemira

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Date: 01.10.2026 | Changes: Ensimmäinen toimituslista kahdelle tilille hinnaston tuotteista ja laitekaaviosta. Outokumpu: Azure-ensisijaisuus huomioitu. Kemira: IT-infran julkiset faktat puuttuvat reposta, aukot merkitty. | Harness: Claude Code + CLAUDE.md

Document Status:

- Created: 01.10.2026
- Classification: INTERNAL. Rooleja, ei henkilöitä (paitsi aiemmin kirjattu Outokumpu R02 -yhteys).
- Status: PENDING_REVIEW. Hinnat vain `dws10.com/config/products.json`:ssa. Laitteisto laskutetaan hinnaston riveinä samalla tilauksella (HIC 01.10.2026, vaihtoehto A).

---

## Yhteinen runko (molemmat tilit)

| #   | Rivi                              | SKU                                                                      | Huomio                                                                                                                                       |
| --- | --------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | DWS IQ Aegis Pilot, 3 kk          | `DWS-AEGIS-PILOT-001`                                                    | Ajoympäristö, KYA-identiteetti, Art. 12 -loki, pysäytys; hyvitetään                                                                          |
| 2   | NVIDIA CUDA -laskentasolmu        | `LF-DGX-SPARK` / `edge-node-gn100` / `LF-SITROOM-001` / `LF-NODE-X86-NV` | GB10 tai x86 + NVIDIA; asiakkaan jo käyttämä merkki ensin                                                                                    |
| 3   | NVIDIA-mallien asennus ja palvelu | `LF-NVIDIA-INSTALL`                                                      | Yksi per solmu                                                                                                                               |
| 4   | k3s-orkestrointi                  | `LF-K8S-T1` (2 solmua: `LF-K8S-T2`)                                      |                                                                                                                                              |
| 6   | Syöteyhdyskäytävä, vain luku      | `LF-IPCMAX-IPC409` tai `LF-IPCMAX-CINCOZE-DA1200`                        | OPC UA / Modbus sisään, ei kirjoituspolkua                                                                                                   |
| 7   | Sensorisolmut                     | `LF-JETSON-NANO` / `-NX` / `-AGX`                                        | Vain jos työnkulku tarvitsee omia sensoreita                                                                                                 |
| 8   | Puuttuvat osat 1–9                | ei SKU:ta vielä                                                          | Laiteavain, työasema, kestotallennus, kytkin, palomuuri, aikalähde, UPS, teline, OT-yhdyskäytävä; `docs/sales/AEGIS_PILOT_LAITEKAAVIO_FI.md` |

Phase 0 (2 vk, ei maksua) lukitsee: työnkulku, eristysmenetelmä, kolme hyväksymisehtoa, nimetyt roolit (työnkulun omistaja, operaattori, tekninen yhteyshenkilö, päätösvastuun kantaja).

## Case Outokumpu (Tornio; Kemi toisena ovena)

**Lähtötilanne.** Pilvi-ensisijainen Azurella: Microsoft-kumppanuus 2019, Tietoevry Tech Services 5 v (kriittinen infra, SAP, Azure globaaleille tuotantosivustoille, 04/2025), Azure + Databricks lakehouse, Nortal ASIS-pintatarkastus, Solita ML-alusta. Automaatio: Primetals Level 2 (CCM1/CCM2), Valmet DCS ferrokromilla, ABB-pintatarkastus. Palo Alto OT-tietoturva. Lähde: `docs/sales/outokumpu-it-ot-landscape.md` (hakutuloksiin perustuva; varmista ennen asiakkaalle sanomista).

**Mitä Azure tarkoittaa toimitukselle.**

- Aegis on hallittu on-prem-täydennys, ei Azuren korvaaja. Suositeltu toimitusmuoto: Hybrid. Ydintulos, loki ja pysäytys paikallisesti; Azure vain valinnaiseen synkronointiin ja raportointiin, ja se katkaistaan hyväksymistestissä.
- Laite sijoitetaan DMZ:aan vain-luku-liitännällä. Ei koskaan Level 1 tai Level 2 -verkkoon (Primetals Level 2 on toimittajan sopimusalue).
- Tietoevryn sopimus: varmista, salliiko se asiakkaan omistaman laitteen tuotantoverkossa ja kuka hallinnoi kytkintä ja palomuuria eristyksen ajaksi (eristys tehdään yläpuolelta, asiakkaan tai Tietoevryn toimesta).
- CLOUD Act -kulma pilvialustaan on myyntiargumentti vain jos ostaja nostaa sen; ensikontakti ei ala compliance-sanalla.

**Toimituslista.**

| Rivi                                                                    | SKU                                 | Määrä   | Perustelu                                                                                        |
| ----------------------------------------------------------------------- | ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| Aegis Pilot                                                             | `DWS-AEGIS-PILOT-001`               | 1       |                                                                                                  |
| Situation Room, 2× GN100, tai Beckhoff-IPC + NVIDIA (malli vaiheessa 0) | `LF-SITROOM-001` / `LF-NODE-X86-NV` | 1       | Outokumpu käyttää Beckhoffia (HIC 01.10.2026); Beckhoff-mallin GPU-paikka ja Linux varmistettava |
| NVIDIA-asennus                                                          | `LF-NVIDIA-INSTALL`                 | 2       | Per solmu                                                                                        |
| k3s HA                                                                  | `LF-K8S-T2`                         | 1       | Kaksi solmua                                                                                     |
| Cincoze DA-1200 OT-yhdyskäytävä, vain luku                              | `LF-IPCMAX-CINCOZE-DA1200`          | 1       | Historian / Level 2 -tietokanta OPC UA:lla, jos tuotantohuonetyönkulku valitaan                  |
| Sensorisolmut                                                           | ei                                  | 0       | Olemassa olevat ABB/Nortal-kamerat ja Valmet-kuvantaminen riittävät syötteeksi                   |
| DWS IQ EU Sovereign Pilot                                               | `DWS-EU-PILOT`                      | 0       | Ei tarvita: synkronointi Azureen asiakkaan omaan tenanttiin, ei meidän pilveen                   |
| Puuttuvat osat 1–9                                                      | ei SKU:ta                           | 1 setti | Palomuuri/kytkin todennäköisesti asiakkaan (Palo Alto); muut toimitetaan                         |

**Työnkulkuehdokas.** IP-disclosure/CBAM-dokumenttityönkulku (R02 IP Director -ovi) tai tuotantohuoneen suositustyönkulku (R11 Plant Director). Ensimmäinen on halvempi eristää (dokumenttivarasto, ei OT-liitäntää); toinen on Aegis-tuotteen ydin. Phase 0 valitsee.

**Aukot (varmista ensimmäisessä puhelussa).** Historian- ja MES-toimittaja. OT-tietoturvan omistaja. Tietoevry-sopimuksen laitesääntö. Kattaako Nortal/Solita-sopimus agenttien ajon paikallisesti.

## Case Kemira (Fiber Essentials)

**Lähtötilanne.** Aktiivinen keskustelu (Climate IQ); heinäkuussa 2026 luvattu tarjous, Captain Day + tulosperusteinen pilotti (`docs/sales/offers/2026-09-28-kemira-fiber-essentials-tarjous.md`). Track B "Decision Transfer" lähetetty 28.09.2026, vastaus odottaa (`docs/sales/kemira-track-b-decision-transfer.md`). Omistajuuskartta: Sustainability kokee ongelman, Production omistaa datan, Digitalisation omistaa järjestelmät, COO päättää prosessista, CFO investoinnista. Reunaehdot: reseptit ja formulaatiot ovat ydin-IP:tä, prosessitelemetria ei saa mennä julkiseen pilveen (IP, Seveso, EU-datan sijainti), OT on segmentoitu IT:stä, CER-direktiivi (vesilaitosten toimittaja).

**Mitä Kemiran IT-infra tarkoittaa toimitukselle.**

- Julkisia faktoja Kemiran IT-toimittajista, pilvestä tai ERP:stä ei ole repossa. Ei arvata. Phase 0:n ensimmäinen tehtävä on infrakartoitus Digitalisation-funktion kanssa.
- Koska OT on segmentoitu ja prosessidata ei saa poistua, toimitusmuoto on Local/Edge, ei Hybrid. Pilvisynkronointia ei tarjota oletuksena.
- Reseptidata ei koske ensimmäistä työnkulkua: erätason hiilijalanjälki lasketaan tuotanto- ja energiadatasta, ei formulaatioista. Tämä rajaus kirjoitetaan Phase 0:n rajaukseen, jotta IP-huoli ei pysäytä pilottia.
- Pilotti kytkeytyy jo luvattuun tarjoukseen: Captain Day tuottaa ensimmäisen lasketun erän ja nimetyn omistajan; Aegis-pilotti on askel, jossa sama laskenta ajetaan agentilla tuotantohuoneessa ilman verkkoa. Ei korvaa tarjousta, jatkaa sitä.

**Toimituslista.**

| Rivi                                                            | SKU                                  | Määrä   | Perustelu                                                                             |
| --------------------------------------------------------------- | ------------------------------------ | ------- | ------------------------------------------------------------------------------------- |
| Aegis Pilot                                                     | `DWS-AEGIS-PILOT-001`                | 1       |                                                                                       |
| Control Room, 1× GN100, tai Neousys Nuvo-10108GC + RTX 6000 Ada | `edge-node-gn100` / `LF-NODE-X86-NV` | 1       | Yksi tuotelinja                                                                       |
| NVIDIA-asennus                                                  | `LF-NVIDIA-INSTALL`                  | 1       |                                                                                       |
| k3s, yksi solmu                                                 | `LF-K8S-T1`                          | 1       |                                                                                       |
| iPCMax IPC-409 syöteyhdyskäytävä                                | `LF-IPCMAX-IPC409`                   | 1       | Modbus/OPC UA energia- ja tuotantodatalle, vain luku                                  |
| Jetson Orin NX sensorisolmu                                     | `LF-JETSON-NX`                       | 0–1     | Vain jos energiamittaus puuttuu linjalta; päätetään Phase 0:ssa                       |
| DWS IQ EU Sovereign Pilot                                       | `DWS-EU-PILOT`                       | 0       | Prosessidata ei poistu tontilta                                                       |
| Puuttuvat osat 1–9                                              | ei SKU:ta                            | 1 setti | Kytkin ja palomuuri todennäköisesti Kemiran; Seveso-laitoksen kaappi ja UPS vaaditaan |

**Työnkulkuehdokas.** Erätason hiilijalanjälki yhdelle Fiber Essentials -tuotelinjalle: agentti kokoaa luvun, nimetty omistaja hyväksyy, hylkää tai muuttaa; päätös lokiin. Valmis-tila on määritelty (erä laskettu ja kuitattu), joten työnkulku on testattava.

**Aukot (varmista ensimmäisessä puhelussa).** ERP ja historian. IT-toimittaja ja pilvi. Kuka hallinnoi OT/IT-rajan palomuuria. Onko tuotantohuoneessa tilaa ja sähköä lukittavalle kaapille. Vastaus Track B -viestiin (kuka omistaa päätöksen).

## Ero kahden tilin välillä yhdellä rivillä

Outokumpu: kaksi solmua, Hybrid, Azure jää asiakkaan omaan tenanttiin synkronointia varten, OT-liitäntä historianiin. Kemira: yksi solmu, Local/Edge, ei pilvisynkronointia, energia- ja tuotantodata sisään, reseptit ulkopuolella.
