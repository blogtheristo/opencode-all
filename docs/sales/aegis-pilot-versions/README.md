# Aegis-pilotin versiot

Jokainen FI-tekstin ja SKU-koostumuksen versio tallennetaan tänne jäädytettynä. Vanhaa versiota ei muokata; muutos tehdään uutena versiona.

- `AEGIS_PILOT_FI_<versio>.md`: Store-sivun FI-osio sellaisena kuin se oli kyseisessä versiossa. `pre-v1.6-<commit>` = versiot ennen versiorivin lisäämistä, nimetty commitin mukaan.
- `AEGIS_PILOT_SKU_<versio>.md` + `.json`: toimituksen SKU-koostumus kerroksittain (ohjelmisto, palvelut ja koulutus, laskenta, syötteet, turva/verkko/infra, tuotanto) sekä asiakasprofiilit.
- Asiakkaan paketti koostetaan JSON-tiedoston `lines`-listasta `profiles`-esimerkin mukaan; asiakaskohtainen koostumus tallennetaan omaksi tiedostokseen nimellä `AEGIS_PILOT_SKU_<versio>_<asiakas>.json`.

Nykyinen: FI v2.0.20, SKU v2.0 (01.10.2026). Patch-versiot `AEGIS_PILOT_FI_v2.0.N.md`; muutokset osion versiohistoriassa.
