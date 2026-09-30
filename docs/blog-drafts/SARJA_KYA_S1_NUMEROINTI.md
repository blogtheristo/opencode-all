# KYA-S1 -blogisarjan numerointi — lukittu kartoitus 1–11

**Tarkoitus:** Ratkaisee auditlistan kohdan **P3-1** (`Legal/KYA_AUDIT_WORKLIST_2026-08.md` §4). Sarjan osat 5–7 kantoivat `series: "… n/7"`, osien 1–4 kartoitus oli kirjaamatta, ja osa 11 oli jo merkitty `11/11`. Numerointi on tässä lukittu **ennen ensimmäistäkään julkaisua**, kuten P3-1 vaatii.

**Tila:** Kaikki 11 osaa ovat `Status: DRAFT`. Yksikään ei ole julkaistu. Non-Negotiable Rule 13: hyväksyntä annetaan **slug-kohtaisesti**, ei sarjatasolla.

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/kya-s1-blog-parts-8-10-flfmrn | Date: 08.08.2026 | Changes: Ensimmäinen versio — sarjan kartoitus 1–11 lukittu. Osien 1–4 numerointi johdettu päivämääristä, olemassa olevista `series`-kentistä ja Osan 7 yhteenvetoketjusta. Osien 5–7 `series`-kentät korjattu `/7` → `/11`. Osan 7 "sarjan päätösosa" -merkintä korjattu ydinkaaren päätökseksi (sarja jatkuu osissa 8–11).

Session Links & References:

- Claude Code (claude/kya-s1-blog-parts-8-10-flfmrn): https://github.com/blogtheristo/dws6/commits/claude/kya-s1-blog-parts-8-10-flfmrn

Document Status:

- Created: 08.08.2026
- Last Modified: 08.08.2026
- Language: Finnish
- Publication Status: DRAFT — INTERNAL
- Classification: INTERNAL — EDITORIAL
- Document Type: Sarjan hakemisto

---

## 1. Lukittu kartoitus

Sarjan nimi: **DWS IQ & Lifetime World Model**. Julkaisupaikka: `onelifetime.world`. Kieli: FI.

| Osa    | Slug                                                   | Aihe                                                       | Päivä      | Tila  |
| ------ | ------------------------------------------------------ | ---------------------------------------------------------- | ---------- | ----- |
| **1**  | `kya-s1-one-signed-page`                               | Yksi allekirjoitettu sivu — mikä KYA-S1 on ostajalle       | 06.08.2026 | DRAFT |
| **2**  | `hic-hallintamalli-ja-dws-iq-agentit`                  | HIC-hallintamalli ja DWS IQ -agentit                       | 07.08.2026 | DRAFT |
| **3**  | `teollisuuden-prosessikuvaustavat-ja-tekoalyagentit`   | BPMN, VSM, ISA-95, SysML, SIPOC — mihin agentti kiinnittyy | 07.08.2026 | DRAFT |
| **4**  | `lifetime-world-model-ja-teollisuuden-prosessimallit`  | LWM ja teollisuuden prosessimallit                         | 07.08.2026 | DRAFT |
| **5**  | `kya-s1-ja-bpmn-2-luottamustaso-ohjaa-prosessia`       | Luottamustaso ohjaa prosessia                              | 07.08.2026 | DRAFT |
| **6**  | `bpmn-xml-trs-portti-riskiluokka-lease-fail-closed`    | Atominen Lease Token, fail-closed, rehellinen TRS          | 07.08.2026 | DRAFT |
| **7**  | `flt-72h-virheluokittelu-ja-prv-paatoksen-toistaminen` | FLT 72 h ja PRV-toisto                                     | 08.08.2026 | DRAFT |
| **8**  | `kya-s1-ekosysteemi-ja-tuotanto-roadmap`               | Tierit Bronze/Silver/Gold ja self-attestation-kielto       | 08.08.2026 | DRAFT |
| **9**  | `lifetime-world-model-globaalina-tilarekisterina`      | IDV-sidokset, TRS-historia, PRV-vedokset                   | 08.08.2026 | DRAFT |
| **10** | `agentic-commerce-protokollat-ja-autonomiset-maksut`   | Mandate bands, Lease Token, FLT kaupallisissa virheissä    | 08.08.2026 | DRAFT |
| **11** | `eudi-wallet-eidas2-idv-ankkurointi`                   | EUDI Wallet / eIDAS 2.0 ankkuroi IDV-1:n                   | 08.08.2026 | DRAFT |

## 2. Miten osien 1–4 numerointi johdettiin

P3-1 totesi kartoituksen epäselväksi. Se ei ollut mielivaltainen — kolme itsenäistä signaalia osoittavat samaan järjestykseen, ja ne kirjataan tähän, jotta valintaa ei tarvitse tehdä uudestaan:

1. **Osan 7 yhteenvetoketju** nimeää ensimmäiseksi lenkiksi "yksi allekirjoitettu sivu". Se on `kya-s1-one-signed-page` → **osa 1**. Se on myös sarjan varhaisin luonnos (06.08.2026).
2. **Olemassa olevat `series`-kentät.** `teollisuuden-prosessikuvaustavat` on merkitty jatko-osaksi kirjoitukselle "HIC-hallintamalli ja DWS IQ -agentit"; `lifetime-world-model-ja-teollisuuden-prosessimallit` on merkitty **kolmanneksi osaksi** samassa alisarjassa. Tämä lukitsee järjestyksen 2 → 3 → 4.
3. **Sisältöriippuvuus.** Osa 5 avaa lauseella, joka olettaa lukijan tuntevan prosessimallit ja LWM:n; osat 3 ja 4 tuottavat juuri sen pohjan.

**Huomio Osan 7 "Katso myös" -listasta.** Se nimeää osiksi 1–3 KYA-johdantotekstejä, joita **ei ole tässä repossa luonnoksina**. Nämä eivät ole yllä olevan taulukon osia 1–3. Osan 7 "Katso myös" -lista on korjattava osoittamaan tähän kartoitukseen ennen julkaisua — kirjattu kohtaan P3-1 jäännösvelkana.

## 3. Mitä tässä sessiossa muutettiin

| Tiedosto                                                                                                          | Muutos                                                                          |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `kya-s1-ja-bpmn-2-…`                                                                                              | `series: "Blogi 5/7 …"` → `5/11`; leipätekstin allekirjoitusrivi `5/7` → `5/11` |
| `bpmn-xml-trs-portti-…`                                                                                           | `series: "Blogi 6/7 …"` → `6/11`                                                |
| `flt-72h-…`                                                                                                       | `series: "Blogi 7/7 … sarjan päätösosa"` → `7/11 … ydinkaaren päätösosa`        |
| `kya-s1-one-signed-page.fi`, `hic-hallintamalli`, `teollisuuden-prosessikuvaustavat`, `lifetime-world-model-ja-…` | `series`-kenttä lisätty / täsmennetty muotoon `Blogi n/11`                      |
| Osat 8–10                                                                                                         | Kirjoitettu tässä sessiossa                                                     |

**Osan 7 leipäteksti.** Lause _"Tähän päättyy sarjamme KYA-S1-spesifikaatiosta…"_ ja sitä seuraava neljän kohdan yhteenveto **säilytetään sellaisenaan** (Sääntö 12). Ainoastaan kehystävä johtolause täsmennetään: se päättää sarjan ydinkaaren (spesifikaatio → portti → kriisinhallinta), ei koko sarjaa.

## 4. Jäljelle jäävä velka ennen julkaisua

- **P3-1 jäännös:** Osan 7 "Katso myös" -lista osoittaa olemattomiin osiin 1–3.
- **P3-2:** Osan 11 kolme varmentamatonta EU-väitettä (EUDI-takaraja, edustusattestaation normatiivinen tila, peruutuksen etenemisviive).
- **P2-2:** LWM-termiristiriita `DWS_TRUTH_STANDARD.md` rivin 20 kanssa. Koskee osia **4 ja 9**. Ratkaisematta.
- **P3-3:** Kaikki 11 odottavat HIC-hyväksyntää slug-kohtaisesti.
