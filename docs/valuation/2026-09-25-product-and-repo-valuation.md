# DWS Product and Repository Valuation — 25.09.2026

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/price-list-a5-campaign | Date: 25.09.2026 | Changes: First per-product TAM and valuation, with a cost-approach value for the repository as a product-development environment (HIC 25.09.2026).

Document Status:

- Created: 25.09.2026
- Last Modified: 25.09.2026
- Language: English
- Publication Status: INTERNAL — decision material for the HIC; not for investors until the segment sizes marked "estimate" are verified
- Canonical row: DWS_TRUTH_STANDARD.md §2 row 45

---

## 1. Result

| Measure                                                                    | Low        | Central    | High       |
| -------------------------------------------------------------------------- | ---------- | ---------- | ---------- |
| A. Products: risk-adjusted present value of the 80 public offers           | €0.32M     | €0.64M     | €1.28M     |
| B. Repository as product-development environment: AI-assisted rebuild cost | €1.41M     | €1.88M     | €2.35M     |
| **A + B: products and development environment**                            | **€1.73M** | **€2.52M** | **€3.63M** |
| Ceiling: traditional-team rebuild cost of the code (basic COCOMO)          |            | €7.04M     |            |

Reference points:

- Prior independent valuations: Gust €3.8M (2021, DWS platform value only), Monaco Fondry $6M (2022). Source: `docs/010825_310726/tuotekehitysmenot/F_Dual_Version_Activation_Package.md`.
- Documented R&D: the hours ledger 2018–09/2025 records 8,684 h (€778,081). €594,000 is capitalised on the balance sheet (account 1030). Source: `docs/010825_310726/tuotekehitysmenot/F_Liite_Tuntikirjaukset.md`.

The per-offer table and every assumption are in `docs/truth/PRODUCT_VALUATION.md` and `config/truth/product-valuation-model.json`.

## 2. Reading the result

1. **Most of today's value is in the environment, not in product cash flows.** The repository holds a large body of built work:
   - 276,658 lines of code (non-blank, non-comment) and 418,629 lines of standards and documentation
   - 47 skills, 24 standards, 87 database migrations and 851 product pages
   - 7,244 commits since 22.12.2025

   A buyer would pay to avoid rebuilding this, even before any product earns revenue.

2. **Product value is low because revenue evidence is thin, not because the markets are small.**
   - The sum of product TAMs is €1.43B per year. Year-5 obtainable revenue in the central case is €2.23M.
   - The present value is small because every family carries a probability of 0.2–0.6 of reaching that revenue. Only two paid pilots (€59,900) and ~€7k/month of services revenue are verified (`docs/TRACTION_CANONICAL.md`), and a 30 % discount rate applies over five years.
3. **Against the 2021 figure.** €3.8M (2021) measured the DWS platform alone, with a comparables method. The new central estimate of €2.52M uses a different method: cost of the environment plus risk-adjusted product income. The high case (€3.63M) is at the 2021 level. The methods differ, so the numbers are not a like-for-like fall or rise.
4. **What moves the number most.**
   - Each verified paying customer raises the probability for its family.
   - Aegis revenue after GA (September 2026) moves the largest single family.
   - Verified segment counts replace the estimates in §3.
   - In the model, doubling every capture share doubles A: €1.28M in the high case.

## 3. Method

**Per product (income approach)**

- TAM = buyers in the segment × fit × annual value per buyer.
  - Annual value is the recurring price × 12 (monthly), the yearly price, the hourly price × 100 h, or the one-time price ÷ its replacement cycle.
- Year-5 revenue = TAM × the family's year-5 capture share.
- Present value = year-5 revenue × revenue multiple × probability ÷ 1.3⁵.
- The low and high cases halve and double the capture shares.

| Family    | Offers | Year-5 capture | Multiple | Probability |
| --------- | ------ | -------------- | -------- | ----------- |
| SME       | 3      | 0.30 %         | 1×       | 0.6         |
| DWS IQ    | 15     | 0.20 %         | 6×       | 0.25        |
| Aegis     | 3      | 1.00 %         | 6×       | 0.2         |
| Firehorse | 9      | 0.10 %         | 4×       | 0.2         |
| Data      | 4      | 0.30 %         | 6×       | 0.2         |
| Services  | 18     | 0.05 %         | 1×       | 0.5         |
| Hardware  | 11     | 0.10 %         | 0.5×     | 0.4         |
| Infra     | 17     | 0.10 %         | 3×       | 0.25        |

**Segments**

| Segment                                   | Buyers  | Status              | Basis                                      |
| ----------------------------------------- | ------- | ------------------- | ------------------------------------------ |
| EU CSRD scope after Omnibus I             | 5,000   | Sourced             | DWS_TRUTH_STANDARD.md regulatory-scope row |
| Finnish enterprises                       | 290,000 | Estimate, to verify | Order of magnitude from Statistics Finland |
| EU industrial enterprises, 250+ employees | 20,000  | Estimate, to verify | Order of magnitude from Eurostat           |
| EU industrial edge sites                  | 60,000  | Estimate, to verify | 3 sites per industrial enterprise          |
| EU enterprises, 250+ employees            | 50,000  | Estimate, to verify | Order of magnitude from Eurostat           |
| EU regulated and defence bodies           | 3,000   | Estimate, to verify | Model estimate                             |

**Repository (cost approach)**

- Basic COCOMO, organic mode: 2.4 × 276.7^1.05 ≈ 880 person-months, at €8,000 loaded cost per person-month, gives €7.04M for a traditional team.
- An AI-assisted team is assumed to be 3–5× faster, which gives €1.41M–€2.35M.
- Documentation, standards, data and the 851 product pages are not in the line count, so B is a floor for the environment.

## 4. Limits

- **The product TAMs overlap.** A pilot, a starter tier and the subscription sell to the same buyer, so the €1.43B sum is not the company's TAM.
- **The data-room TAM is not used.** `docs/investor/data-room-2026Q2/TAM_REFRAMED.md` gives a €60–90B labour pool. It rests on "~50k EU undertakings in CSRD scope", a pre-Omnibus figure that DWS_TRUTH_STANDARD.md marks false. It should be revised before anyone uses it again.
- **Aegis's €59,990 has two names.** The R&D file (`F_Liite3_Aktivoitavat_Tuotteet.md`) calls it a one-time licence fee with €999/month maintenance; the catalogue calls it onboarding. The HIC decides which is correct; the model values it the same way either way.
- **Five figures are model assumptions:** the multiples, probabilities, capture shares, the €8,000 monthly cost and the AI productivity factor. Each is one line in the model file and can be challenged there.
