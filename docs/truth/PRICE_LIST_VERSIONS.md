# Price-List Versions — evidence register

# VERSION AND AGENT HISTORY

---

Version: 1.33 [Latest]

Sessions & Modifications:

- Version: 1.33 [Latest] | Tool: scripts/truth/price-list-versions.mjs | Changes: Generated from config/truth/price-list-versions.json. Do not edit by hand.

Document Status:

- Language: English
- Publication Status: ACTIVE
- Canonical row: DWS_TRUTH_STANDARD.md §2 row 44

---

Every catalogue version keeps its price-list snapshot (HIC 25.09.2026). Versions older than the current one are **frozen**: the snapshot must exist unchanged (sha256) in `dws10.com/price-list/versions/` and its `landing-pages/` mirror, and the generator refuses to overwrite it. **Reconstructed** snapshots were never saved at the time; they were rebuilt from the catalogue at the named commit and say so on the page.

Missing: 1.14 is listed in `priceHistory`, but no catalogue commit on any branch ever carried it (the catalogue went from 1.13 to 1.15 in #1305), so there is nothing to rebuild. 1.26 was never issued.

Counts: `records` = entries in `products`; `public` = non-BLUE, non-archived `products`; `on list` = public products + active subscription-only records (what the price list renders).

| Version | Snapshot | Origin | Frozen | Last main date | Last main commit | Records | Public | On list |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026.Q2 | `price-list-v2026.Q2.html` | original | yes | 2026-05-04 | `e721d4610` | 39 | 33 | 33 |
| 1.10 | `price-list-v1.10.html` | reconstructed | yes | 2026-05-10 | `52230e45a` | 39 | 39 | 41 |
| 1.11 | `price-list-v1.11.html` | reconstructed | yes | 2026-05-10 | `8b4ecb4ce` | 39 | 39 | 41 |
| 1.12 | `price-list-v1.12.html` | reconstructed | yes | 2026-05-10 | `3e2a30698` | 39 | 39 | 41 |
| 1.13 | `price-list-v1.13.html` | reconstructed | yes | 2026-05-11 | `317be46e2` | 39 | 37 | 39 |
| 1.14 | — | missing | no | — | — | — | — | — |
| 1.15 | `price-list-v1.15.html` | reconstructed | yes | 2026-05-14 | `e75b66204` | 106 | 37 | 39 |
| 1.16 | `price-list-v1.16.html` | reconstructed | yes | 2026-05-17 | `163d8ce79` | 108 | 39 | 42 |
| 1.17 | `price-list-v1.17.html` | reconstructed | yes | 2026-05-17 | `70dbf087e` | 110 | 41 | 44 |
| 1.18 | `price-list-v1.18.html` | reconstructed | yes | 2026-05-17 | `63a58e9ab` | 113 | 44 | 47 |
| 1.19 | `price-list-v1.19.html` | reconstructed | yes | 2026-05-17 | `65b9c79f9` | 113 | 44 | 47 |
| 1.20 | `price-list-v1.20.html` | reconstructed | yes | 2026-06-16 | `fe39be381` | 114 | 47 | 50 |
| 1.21 | `price-list-v1.21.html` | original | yes | 2026-06-24 | `93ae5f0a0` | 114 | 47 | 55 |
| 1.22 | `price-list-v1.22.html` | original | yes | 2026-07-06 | `c104591d7` | 119 | 52 | 60 |
| 1.23 | `price-list-v1.23.html` | original | yes | 2026-08-13 | `8c05594e7` | 116 | 49 | 57 |
| 1.24 | `price-list-v1.24.html` | reconstructed | yes | 2026-07-30 | `5ed749f55` | 120 | 53 | 61 |
| 1.25 | `price-list-v1.25.html` | reconstructed | yes | 2026-08-24 | `a2b3e09b8` | 116 | 49 | 57 |
| 1.27 | `price-list-v1.27.html` | reconstructed | yes | 2026-08-30 | `e76e93583` | 134 | 67 | 75 |
| 1.28 | `price-list-v1.28.html` | original | yes | 2026-09-04 | `d76f94bec` | 134 | 67 | 80 |
| 1.29 | `price-list-v1.29.html` | original | yes | 2026-09-15 | `bfc20a9b8` | 133 | 68 | 83 |
| 1.30 | `price-list-v1.30.html` | original | yes | 2026-09-23 | `e9a189eae` | 136 | 71 | 79 |
| 1.31 | `price-list-v1.31.html` | original | yes | 2026-09-24 | `f2c5f2f1f` | 136 | 71 | 80 |
| 1.32 | `price-list-v1.32.html` | original | yes | 2026-09-25 | `174ebce7b` | 136 | 71 | 80 |
| 1.33 | `price-list-v1.33.html` | original | current | 2026-09-25 | `4f0ae8e93` | 138 | 72 | 81 |
