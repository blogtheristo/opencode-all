# Seuraavan session prompt — blogisarjan osat 8–10 + konsultoinnin käsikirja

**Edellinen sessio:** `claude/agent-use-cases-comparison-h7vl25`, PR #1808 **mergetty** 08.08.2026.
**Tämä työ menee UUDELLE branchille.** Merged PR on valmis eikä voi seurata uutta työtä.

***

## Kopioi tämä uuden session ensimmäiseksi viestiksi

```
Jatka KYA-S1 -blogisarjaa ja konsultoinnin käsikirjaa. Edellinen sessio oli
claude/agent-use-cases-comparison-h7vl25 ja sen PR #1808 on jo mergetty mainiin —
älä jatka sillä branchilla, vaan luo uusi branch mainin päälle.

Lue ensin nämä, ne kantavat koko kontekstin:
- .claude/handoffs/claude/agent-use-cases-comparison-h7vl25.md (edellisen session tila
  ja viisi ratkaisematonta päätöstä)
- Legal/KYA_AUDIT_WORKLIST_2026-08.md (16 työkohtaa; P0 kaikki korjattu, P1-P3 auki)
- Legal/KYA_S1_v1.3.md (korjattu spesifikaatio: TRS-4, TRS-5, PRV-4, TC4-5, FLT-4)
- docs/blog-drafts/ (7 luonnosta, kaikki Status: DRAFT, ei yhtään julkaistu)

TEHTÄVÄ 1 — blogisarjan osat 8, 9 ja 10 luonnoksiksi (Osa 11 on jo kirjoitettu:
docs/blog-drafts/eudi-wallet-eidas2-idv-ankkurointi.md):
- Osa 8: KYA-S1 ekosysteemi & tuotanto-roadmap — tierit Bronze/Silver/Gold ja miten
  §3:n self-attestation-kielto toteutetaan käytännön auditoinneissa.
  HUOM: §8:n tier-luvut jätettiin v1.3:sta pois tarkoituksella koska ne olivat
  mittaamattomia. Älä keksi niitä blogiin — se tekisi niistä normatiivisia.
- Osa 9: Lifetime World Model globaalina tilarekisterinä — IDV-sidokset, TRS-historia,
  PRV-vedokset. HUOM: LWM-termiristiriita DWS_TRUTH_STANDARD.md rivin 20 kanssa on
  yhä ratkaisematta; nosta se esiin äläkä ohita sitä.
- Osa 10: Agentic Commerce -protokollat ja autonomiset maksut — TRS_req-kynnykset ja
  mandate bands, atominen Lease Token tuplaveloitusten estäjänä, FLT kaupallisissa
  virhetilanteissa. Kanoni: KYA_STANDARD_v1.md §14 ja src/identity/ats-engine.ts
  (MANDATE_FLOOR_ATS / PAYMENT_BAND_ATS / HNP_FLOOR_ATS).

TEHTÄVÄ 2 — konsultoinnin käsikirja docs/KONSULTOINNIN_KASIKIRJA_2026.md (v1.10):
kerron erikseen mitä siihen pitää muuttaa. Älä koske siihen ennen kuin sanon.

REUNAEHDOT:
- Blogit ovat RED (Non-Negotiable Rule 13). Kirjoita luonnokset
  docs/blog-drafts/<slug>.md, Status: DRAFT. ÄLÄ julkaise mitään.
- Merkitse jokainen varmentamaton väite frontmatteriin, älä arvaa lukuja.
- Lukitse sarjan numerointi 1-11 ennen kuin kirjoitat: nyt osat 5-7 sanovat "/7"
  ja osien 1-4 kartoitus on epäselvä.
- Noudata CLAUDE.md:n 12 sääntöä; VERSION AND AGENT HISTORY -lohkossa *** ei ---.
```

***

## Miksi näin

**Uusi branch, ei jatkoa vanhalle.** PR #1808 on mergetty. Uudet commitit sen branchille eivät päädy mihinkään PR:ään, ja vanhan historian päälle pinoaminen sotkee seuraavan PR:n diffin.

```bash
git fetch origin main
git checkout -B claude/kya-series-8-10-<id> origin/main
```

**Osa 11 on jo olemassa.** Se kirjoitettiin ennen osia 8–10, koska se osui ainoaan aukkoon joka oli todistetusti rikki toteutuksessa (IDV-tila ei ollut ATS:n syöte). Osat 8–10 täydentävät sarjan, mutta ne eivät saa olettaa että 11 vielä puuttuu.

**Konsultoinnin käsikirja on erikseen syystä.** Se on 1129 rivin elävä dokumentti, jota ~20 muuta tiedostoa ristiviittaa. Sen muutokset eivät kuulu samaan diffiin blogiluonnosten kanssa.

## Se mitä ei saa unohtaa

- **04.11.2026** — KYA-S1:n kommenttikausi sulkeutuu. Kalenteroimatta.
- **Seitsemän luonnosta odottaa hyväksyntää** slug-kohtaisesti. Luonnos jota ei koskaan julkaista on sekin epäonnistuminen.
- **P1-1 on seuraava koodikohta** auditlistalla: poista latenssi luottamuspisteestä. Hitaus ja epälojaalius eivät ole sama signaali.
