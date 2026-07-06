# DGX + EDB Postgres AI vs Aiven/UpCloud — Positioning Comparison

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code | Session: claude/aiven-partnership-intro-vm1fgk | Date: 06.07.2026 | Changes: Added the DWS response ("DWS-vastine") section — DWS IQ 6 and DWS IQ Aegis positioned against the Gemini comparison's DGX-vs-managed-cloud dichotomy, grounded in DWS_TRUTH_STANDARD.md Row 20 (product taxonomy), DWS_SECURITY_STANDARD.md §17.5 (infra table), and DWS_DEPLOYMENT_STANDARD.md (Aegis Sovereign cloud jurisdiction)
- Version: 1.0 | Tool: Claude Code | Session: claude/aiven-partnership-intro-vm1fgk | Date: 06.07.2026 | Changes: Recorded Risto's DGX+EDB vs Aiven/UpCloud comparison, checked it against DWS canonical sovereignty facts (DWS_SECURITY_STANDARD.md §17.5), and derived the DWS-specific conclusion + Aiven call action item

Document Status:

- Created: 06.07.2026
- Last Modified: 06.07.2026
- Language: English (original Finnish analysis preserved in Appendix A)
- Publication Status: ACTIVE

---

## Summary

Risto's comparison (Appendix A) frames NVIDIA DGX + EDB Postgres AI vs Aiven-managed
PostgreSQL on UpCloud as a classic choice: local hardware-accelerated raw power vs
effortless, secure, managed EU cloud. The framing is sound as a market-positioning
document. For DWS itself, however, the conclusion is different in two ways:

### 1. For DWS this is not either/or — we already run both halves

- **On-prem AI compute:** DWS runs a **DGX Spark** (desktop-class, not a DGX
  SuperPOD "AI Factory") for local Ollama inference and EU-restricted prompts
  (`/ollama-spark`, `ssh dgx-spark`). The heavy-CapEx "AI factory" scenario in the
  comparison applies to rack-scale DGX, not to our unit.
- **Managed DB layer:** Aiven-managed PostgreSQL is the approved dws6.com DB layer
  (founder decision 2026-07-02).

So the comparison's "choose one" conclusion is for customers/positioning; DWS's own
architecture is DGX Spark for inference + Aiven for the database, each doing what
it is good at.

### 2. Correction: the sovereignty column only holds on UpCloud — our Aiven runs on GCP

The comparison credits Aiven/UpCloud with "100% Finnish/European, free of the US
CLOUD Act." Per `DWS_SECURITY_STANDARD.md` §17.5 (canonical), DWS's actual Aiven
service targets **`google-europe-north1` — Google Cloud infrastructure** — and is
recorded as an **explicit sovereignty exception** with two accepted residual risks:

1. Aiven itself is US-VC-backed (the original "yellow flag" — still unclear, not cleared).
2. The underlying infra is GCP, which the same standard classifies as only
   "Transitional" for DWS compute.

UpCloud, by contrast, sits in the **Approved (EU-sovereign)** row of §17.5 (Finnish,
Tesi-owned, no CLOUD Act exposure) — and Aiven supports UpCloud as a deployable
cloud provider. §17.5 already says: once the GCP migrate-away plan completes,
"revisit whether the DB layer should follow rather than being left as the last
GCP-resident piece."

**Actionable conclusion:** moving (or re-provisioning) the Aiven PostgreSQL service
from `google-europe-north1` to an Aiven-on-UpCloud region would make the pasted
comparison's sovereignty claim TRUE for DWS, would resolve residual risk #2 of the
§17.5 exception (infra layer), and would strengthen the joint "EU-sovereign by
default" story in the Aiven partnership track. Residual risk #1 (Aiven's US-VC
ownership) remains either way.

This has been added as an agenda item for the best-practices call with Leevi
Lindfors (Aiven account manager) in `Partners/outreach/2026-04-18-aiven.md` §4:
availability, pricing delta, MaxIOPS storage, and migration path GCP→UpCloud
region for an existing service.

### 3. Unverified claims in the comparison (flagged, not repeated as fact)

- "EDB Postgres AI runs Postgres queries and vector searches directly on NVIDIA GPU
  cores" — EDB's Postgres AI marketing describes GPU-accelerated analytics/AI
  components, but stock `pgvector`-style search inside Postgres is not
  GPU-executed by default. Treat as vendor-claim until verified against EDB docs.
- "UpCloud MaxIOPS up to 100k IOPS" and "no data transfer fees on UpCloud" — not
  verified this session; confirm on the Leevi call or from UpCloud pricing before
  using in customer-facing material.
- Cost signal (Risto, 2026-07-06): **UpCloud developer mode is currently free.**
  If it applies to the Aiven-on-UpCloud path (verify: free tier limits, and
  whether via Aiven or only direct on UpCloud), sandbox attempt #2 could test the
  sovereign UpCloud region at zero cost.

## DWS-vastine — DWS IQ 6 ja DWS IQ Aegis Geminin vertailukehyksessä

(Finnish by design: response text intended to be fed back into the Gemini
conversation / used in FI-market positioning. Facts sourced from
`DWS_TRUTH_STANDARD.md` Row 20, `DWS_SECURITY_STANDARD.md` §17.5,
`DWS_DEPLOYMENT_STANDARD.md`.)

Geminin vertailu asettaa valinnan kahden ääripään välille: paikallinen
GPU-raakateho (DGX + EDB) tai hallittu EU-pilvi (Aiven/UpCloud). Säännellylle
eurooppalaiselle ostajalle tämä on väärä dikotomia — DWS tuotteistaa koko
janan kahtena tierinä samasta moottorista:

| Ominaisuus           | **DWS IQ 6** (core-moottori, multi-tenant SaaS)                                                                                          | **DWS IQ Aegis** (single-tenant sovereign / dual-use)                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arkkitehtuuri        | EU-pilvi: Scaleway serverless -compute + Aiven-managed PostgreSQL; orkestroitu agenttikerros saman datan päällä                          | Single-tenant: UpCloud Managed Kubernetes (UKS, Helsinki) + Helm; asiakaskohtainen instanssi                                                            |
| Laitteistokiihdytys  | Ei DB-tasolla (pgvector CPU:lla) — paikallinen LLM-inferenssi NVIDIA DGX Spark -laitteella, kun promptin data ei saa poistua talosta     | NVIDIA-laajennus optiona (on-prem inferenssihalo), ei pakollinen — suvereniteetti ei nojaa rautaan vaan EU-omisteiseen infraan ja hallintomalliin (KYA) |
| Ylläpito ja hallinta | Täysin hallittu DB (Aiven) + serverless: ei DBA- eikä konesalivaatimusta                                                                 | Hallittu K8s EU-omisteisella pilvellä; Lifetime operoi, asiakas ei tarvitse infra-tiimiä                                                                |
| Data-suvereniteetti  | EU-first; nykyinen Aiven-palvelu GCP-regionissa kirjattuna eksplisiittisenä poikkeuksena (ei piilotettuna) — UpCloud-siirto arvioinnissa | Tier 1: non-CLOUD-Act-vaatimus sisäänrakennettu (Aegis Sovereign -cloud-jurisdiktio); dual-use/defence-kelpoinen                                        |
| Kustannusmalli       | OpEx                                                                                                                                     | OpEx — DGX-luokan suvereniteettitakuut ilman DGX-luokan CapEx-seinää; on-prem-laajennus lisätään vain jos vaatimus on aito                              |
| Optimaalinen käyttö  | EU-compliance-raportointi ja -orkestrointi (CSRD / ETS / CBAM / EU AI Act / NIS2) monivuokralaisena SaaS:na                              | Puolustus/dual-use ja asiakkaat, joilla ehdoton residenssi- ja non-CLOUD-Act-vaatimus (myyntialue NO/DK/FI)                                             |

**Ydinviesti Geminin kehykseen:** Geminin "valitse DGX tai valitse
Aiven/UpCloud" olettaa, että suvereniteetti saavutetaan vain omalla raudalla.
Aegis osoittaa kolmannen tien: **suvereniteetti hallintomallina** —
EU-omisteinen pilvi (UpCloud, non-CLOUD-Act) + single-tenant-eristys +
KYA-agenttihallinta — jolloin air-gap-tason vaatimuksiin vastataan ilman
konesali-investointia, ja NVIDIA-rauta lisätään halona vain sinne, missä
inferenssin on pakko pysyä paikan päällä (DWS:llä itsellään: DGX Spark).
DWS IQ 6 puolestaan on täsmälleen se "valitse Aiven/UpCloud" -profiilin
tuote, jonka Gemini kuvaa — sillä erotuksella, että ostaja ei osta
tietokantaa vaan hallitun compliance-lopputuloksen sen päältä.

## Where to use this comparison

- **Aiven call prep** — sovereignty upsell question (UpCloud region).
- **Customer positioning** — for CSRD/CBAM-exposed enterprises asking "why not
  on-prem AI?": the Appendix A table is a ready-made answer skeleton.
- **PhD thesis (market-signal side, not master's thesis)** — DGX-class sovereign AI
  vs managed EU cloud is a live market signal per the Thesis Content Scope Rule.

---

## Appendix A — Original analysis (Risto, 2026-07-06, Finnish — preserved verbatim)

Kun verrataan NVIDIA DGX + EDB Postgres AI -yhdistelmää Aiven / UpCloud -ratkaisuun, siirrytään raskaasta, laitteistokiihdytetystä tekoäly- ja analytiikkajärjestelmästä moderniin, pilvipohjaiseen ja täysin hallittuun (Managed) tietokantainfrastruktuuriin.

Kyseessä on perinteinen valinta älyttömän paikallisen raakatehon (DGX) ja vaivattoman, tietoturvallisen pilviskaalautuvuuden (Aiven/UpCloud) välillä.

### Vertailutaulukko

| Ominaisuus           | NVIDIA DGX + EDB Postgres AI                                    | Aiven / UpCloud (Managed Postgres)                                                     |
| -------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Arkkitehtuuri        | Paikallinen / Dedikoidut AI-palvelimet                          | Julkinen tai Private Cloud (Eurooppalainen)                                            |
| Laitteistokiihdytys  | Kyllä (NVIDIA GPU / CUDA / RAPIDS)                              | Ei suoraan DB-tasolla (Nojaa CPU:hun ja MaxIOPS-tallennustilaan)                       |
| Ylläpito ja hallinta | Itsehallittu (Korkea DBA- ja konesalivaatimus)                  | Täysin hallittu (Automatisoidut varmuuskopiot, päivitykset ja 99.99% SLA)              |
| Data-suvereniteetti  | Täydellinen (Air-gapped / Sovereign AI)                         | Erinomainen EU-tasolla (100 % suomalainen/eurooppalainen, GDPR-vapaa US CLOUD Actista) |
| Kustannusmalli       | CapEx (Suuret alkuinvestoinnit laitteistoon ja lisensseihin)    | OpEx (Joustava kuukausilaskutus, ei datasiirtomaksuja UpCloudissa)                     |
| Optimaalinen käyttö  | Massiivinen AI-päättely, RAG ja LLM-integraatiot TB/PB-luokassa | Tuotantosovellukset, korkean suorituskyvyn OLTP, skaalautuva perus-Postgres            |

### Keskeisimmät erot käytännössä

**1. Suorituskyky: GPU-muskeli vs. MaxIOPS-nopeus**

- DGX + EDB: Postgres-kyselyt ja vektorihaut (esim. tekoälyä varten) ajetaan suoraan NVIDIAn GPU-ytimillä. Jos teet miljoonien rivien vektori- tai analytiikkahakuja, DGX tekee ne millisekunneissa laitteistokiihdytyksen ansiosta.
- Aiven / UpCloud: Aivenin hallitsema Postgres hyödyntää UpCloudin omaa MaxIOPS-tallennusteknologiaa (jopa 100k IOPS). Se tekee tietokannan luku- ja kirjoitusnopeudesta (OLTP) poikkeuksellisen nopeaa perinteisessä mielessä. Se ei kuitenkaan kiihdytä SQL-laskentaa tai tekoälyvektoreita GPU:lla, vaan nojaa vahvoihin AMD EPYC / Intel -suorittimiin ja pgvector-laajennukseen.

**2. Vaivattomuus ja Day-2-operaatiot**

- DGX + EDB: DGX on fyysinen laite (tai erittäin kallis dedikoitu privaattipilvi). Tarvitset tiimin huolehtimaan palvelimen fyysisestä ylläpidosta, verkottamisesta, jäähdytyksestä sekä EDB-ohjelmiston klusteroinnista ja varmuuskopioista.
- Aiven / UpCloud: Tämä on ratkaisun suurin valttikortti. Aiven automatisoi kaiken: tietokannan pystytyksen, monitoroinnin, versiopäivitykset, tietoturvapaikkaukset ja kahdennuksen (High Availability). UpCloud hoitaa alla olevan raudan. Kehittäjät voivat keskittyä koodaamiseen infrahuolien sijaan.

**3. Tietosuoja ja Sovereign AI**

- DGX: Data ei liiku mihinkään omasta konesalista. Tämä on ehdoton vaatimus esimerkiksi puolustusteollisuudelle, pankeille tai tiukan linjan potilastietojärjestelmille.
- UpCloud + Aiven: Tarjoaa parasta mahdollista pilvitason tietosuojaa Euroopassa. UpCloud on suomalaisomisteinen yritys, jonka infrastruktuuri on immuuni Yhdysvaltain CLOUD Act -laille. Jos DGX-tason täydellistä eristystä (air-gap) ei vaadita, mutta GDPR ja eurooppalainen data-suvereniteetti ovat kriittisiä, Aiven UpCloudissa on markkinoiden kärkitasoa.

### Kumpi sinun pitäisi valita?

> Valitse NVIDIA DGX + EDB Postgres AI, jos:
> Kehität yrityksen omaa, massiivista tekoälytehdasta (AI Factory), opetat tai hienosäädät suuria kielimalleja (LLM), ja tietokannan on pystyttävä käsittelemään petatavuluokan dataa reaaliaikaisesti suoraan näytönohjaimien muistissa. Budjetti ei ole este ja teillä on oma infra-tiimi.

> Valitse Aiven / UpCloud, jos:
> Rakennat modernia, skaalautuvaa yritysohjelmistoa tai verkkopalvelua, jossa tarvitaan luotettavaa, erittäin nopeaa ja tietoturvallista eurooppalaista Postgres-tietokantaa ilman ylläpidon vaivaa. Voit yhä käyttää pgvector-laajennusta kevyempiin RAG/AI-ominaisuuksiin, mutta säästät satoja tuhansia euroja laite- ja ylläpitokustannuksissa.

## Related

- `DWS_SECURITY_STANDARD.md` §17.5 — Aiven sovereignty exception (canonical)
- `docs/field-notes/2026-07-02-supabase-audit-aiven-deployment-plan.md`
- `docs/field-notes/2026-03-10-v1-aiven-plan-decision.md`
- `Partners/outreach/2026-04-18-aiven.md` — Aiven partner record + Leevi Lindfors contact

---

(c) 2026 Lifetime Oy — Field Note
