---
title: Field Note — Jev-KYA 4B Nemotron-4 Distillation & Proxy Trust Hardening
date: 2026-09-20
status: Learning Outcome (Active)
author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
owner: Lifetime Oy (Business ID: 0772407-9)
---

# Field Note — 2026-09-20: Jev-KYA 4B Nemotron-4 Distillation & Proxy Trust Hardening

## 1. What happened in this session

Tämä istunto tuotti kaksi merkittävää arkkitehtuuri- ja tietoturvatulosta DWS6-alustalle:

1. **Proxy-validaattorin tietoturvalukitus (PR #2048 / commit `d11f9d3bc`):**
   - Korjattiin `proxy-addr`-kirjaston haavoittuvuus, jossa IPv4-kartoitettuja IPv6-aliverkkoja (esim. `::ffff:10.0.0.0/8`) käsiteltiin etuliitevirheellä täyden `/104`-etuliitteen sijaan.
   - Väliohjelmisto `src/middleware/proxy-trust-validator.middleware.ts` ja sen testipatteristo `src/__tests__/proxy-trust-validator.test.ts` estävät asiakkaan IP-osoitteen väärentämisen (`X-Forwarded-For`), turvaten nopeusrajoitukset, geolokaatiorajat sekä EU AI Act Artikla 12 mukaisen audit-lokituksen.

2. **Jev-KYA 4B Tislausputki DGX Spark -noodille:**
   - Laadittiin ja dokumentoitiin toteutussuunnitelma Jev-KYA 4B -mallin tislaukseen yhdellä DGX Spark -laitteella (Grace Blackwell GB10 -arkkitehtuuri).
   - Putki on suunniteltu sekventiaaliseksi:
     - **Vaihe 1:** Datan generointi opettajamallilla (`Nemotron-4-340B-Instruct` FP8, eräajo, VRAM tyhjennys, ~6–8 h).
     - **Vaihe 2:** Datan karsinta ja kuratointi arvioijamallilla (`Nemotron-4-340B-Reward`, LLM-as-a-Judge, top 10–20 % laatusuodatus, .jsonl-tallennus, VRAM tyhjennys, ~4–5 h).
     - **Vaihe 3:** Oppilaan koulutus (4B-pohjamalli, Full Parameter SFT & Distillation BF16, FSDP-rinnakkaistus, ~2–4 h).
     - **Vaihe 4:** Kvantisointi ja pakkaus reunaan (Mac / Apple Silicon MLX INT4 ~2.5 GB sekä paikalliset agentti-GPU:t vLLM AWQ/FP8 ~22 ms latenssilla, ~1 h).

Täydellinen arkkitehtuurikuvaus on tallennettu tiedostoon [docs/learning-outcomes/jev-kya-nemotron-distillation-plan.md](../learning-outcomes/jev-kya-nemotron-distillation-plan.md).

---

## 2. Learning Standard -kirjaus (DWS_LEARNING_STANDARD.md — EU AI Act Art. 14)

| Askel | Kuvaus | Tila |
|---|---|---|
| 1 | Tietopankin päivitys (`kb/`) | Kirjattu: `kb/raw/signals/2026-09-20-jev-kya-nemotron-distillation.md` |
| 2 | Field Note | Tämä tiedosto (`docs/field-notes/2026-09-20-jev-kya-nemotron-distillation-plan.md`) |
| 3 | Oppimistulosdokumentti | `docs/learning-outcomes/jev-kya-nemotron-distillation-plan.md` |
| 4 | HTML-renderöinti | `Learn/2026-09-20-jev-kya-nemotron-distillation-plan.html` |
| 5 | Drive-vienti | N/A — Drive MCP ei ole kytkettynä tässä istunnossa; repo toimii totuuslähteenä. |
| 6 | Päätöskysymys ihmiselle (HIC) | Ks. kohta 4 alla. |

---

## 3. DWS Rule 14 (Cost Policy & Sovereignty) -yhteensopivuus

- **Data Sovereignty:** Koko aineiston luonti, laadunarviointi ja oppilasmallin opetus tapahtuu omassa DGX Spark -infrassa Espoossa. Data ei poistu ulkoisiin pilvipalveluihin.
- **Zero Marginal Inference Cost:** Kun 4B-malli on kvantisoitu ja jaettu paikallisille agenteille tai Mac-laitteille, miljoonat KYA-päätökset eivät aiheuta senttiäkään API- tai pilvikuluja.

---

## 4. Päätöskysymys ihmiselle (HIC Decision Gate)

> **HIC Decision Question:**  
> Hyväksytäänkö tämä Jev-KYA 4B -mallin sekventiaalinen tislaussuunnitelma ja proxy-validaattorin tietoturvalukitus viralliseksi toteutusohjeeksi, ja voidaanko seuraavaksi luoda suoritettava batch-ajuri (`scripts/runners/kya-distill-runner.py`) DGX Spark -ympäristöön?
