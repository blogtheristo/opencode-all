# Handoff — claude/agent-use-cases-comparison-h7vl25

**Tila:** PR #1808 mergetty mainiin 08.08.2026. **Tämä branch on suljettu.** Jatkotyö menee uudelle branchille — merged PR ei voi seurata uutta työtä.

## Mitä tässä PR:ssä meni läpi

| Alue                   | Tulos                                                                                                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A4-vertailu            | `docs/AGENTTIEN_KAYTTOTAPAUKSET_VERTAILU_FI.md` v1.1 — Claude Code vs Copilot vs DWS IQ Skilled Agents, RUP vaihe × tieteenala -kartta, Liite A (BPMN/VSM/ISA-95/SysML/SIPOC) |
| Blogiluonnokset        | 7 kpl `docs/blog-drafts/`, **kaikki `Status: DRAFT`** — ei yhtään julkaistu                                                                                                   |
| Korjattu spesifikaatio | `Legal/KYA_S1_v1.3.md` — TRS-4, TRS-5, PRV-4, TC4-5, FLT-4 (vain lisäyksiä, §11 stabiilius säilyy)                                                                            |
| Katselmus              | `Legal/KYA_S1_REVIEW_v1.3_PROPOSAL.md` — Osa A (7 aukkoa vendor-standardissa), Osa B (9 löydöstä sisäisistä standardeista + koodista)                                         |
| Auditlista             | `Legal/KYA_AUDIT_WORKLIST_2026-08.md` — 16 työkohtaa, P0–P3                                                                                                                   |
| Koodi                  | P0-1: IDV-tila pakolliseksi syötteeksi ATS:ään, 8 uutta testiä                                                                                                                |
| Kanonin sovitus        | P0-2 + P0-3: ATS-kaava yhdenmukaistettu neljässä dokumentissa                                                                                                                 |
| Kenttämuistiinpano     | `docs/field-notes/2026-08-08-*.md` + `Learn/2026-08-08-*.html`                                                                                                                |

**Kaikki P0-esteet poistettu.** P1–P3 ovat auki.

## Ratkaisematta jääneet päätökset (nämä estävät seuraavan vaiheen)

1. **ATS range overflow.** Multiplikatiivinen kaava vuotaa asteikon yli: `ATS_Base = 1.0` ja `A = 0.25` → `ATS_Final = 1.25` (KYA 125), ulkona §3.2:n 0–1-skaalasta. Kirjattu `KYA_STANDARD_v1.md` §3.2:een **päättämättä**. Kolme vaihtoehtoa dokumentissa; suositus oli clamp 1.0:aan. Päätettävä ennen kuin A-faktori toteutetaan missään.
2. **Behavioral baseline distance -mittari.** TRS-1:n toinen puuttuva syöte. Perustaso, etäisyysmitta ja painotus ovat määrittelypäätöksiä. Agentin suositus oli johtaa perustaso kyvykkyysmanifestista (toimii ilman telemetriahistoriaa ja kytkee manifest scope -syötteen samalla mukaan).
3. **KYA-S1 §9 conformance-note.** v1.3 sanoo julkisesti, ettei oma referenssitoteutus täytä TRS-1:tä (3/4 syötettä yhä puuttuu). Julkaistaanko sellaisenaan? Agentin suositus: kyllä — §3 kieltää self-attestationin.
4. **LWM-termiristiriita.** `DWS_TRUTH_STANDARD.md` rivi 20 määrittelee LWM:n mallipohjaksi; blogiluonnos käyttää sitä tila- ja luottamusrekisterinä. Ratkaistava ennen blogin julkaisua.
5. **Blogisarjan numerointi.** Osat 5–7 kantavat `/7`; osat 8–11 tekevät kokonaismääräksi 11. Osien 1–4 kartoitus on epäselvä — Osan 7 "Katso myös" -lista nimeää osat 1–3 teksteiksi joita ei ole repossa.

## Päivätty sitoumus

**04.11.2026** — KYA-S1:n julkinen kommenttikausi sulkeutuu. v1.3:n amendmentit kuuluvat siihen ikkunaan; sen jälkeen ne vaativat uuden version. **Ei kalenteroitu** (työkalu ei ollut käytettävissä) — HIC-toimenpide.

## Seuraava työ, uudella branchilla

Sovittu jako: **osat 8–11 ja konsultoinnin käsikirja omaan PR:ään.** Seuraavan session prompt: `docs/NEXT_SESSION_PROMPT_2026-08-08.md`.
