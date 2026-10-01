# Aegis-pilotin SKU-koostumus v2.1-draft: LWM v2 Pilot -versio

---

# VERSION AND AGENT HISTORY

Version: 2.1-draft [Latest]

Sessions & Modifications:

- Version: 2.1-draft [Latest] | Tool: Claude Code (web) | Date: 01.10.2026 | Changes: HIC-kysymys: nimetty LWM v2 Pilot -versio, joka jää asiakkaalle ja päivitetään täyteen versioon erikseen hinnoiteltuna. Ehdotus; v2.0 ei muuttunut. Koneluettava pari `AEGIS_PILOT_SKU_v2.1-draft.json`. | Harness: Claude Code + CLAUDE.md

Document Status:

- Status: EHDOTUS, odottaa HIC-päätöstä.

---

## Nykytila (fakta)

- `products.json`:ssa ei ole LWM v2 -SKU:ta eikä hintaa.
- Ainoa hinnoiteltu LWM-työ: `DWS-AEGIS-IMPL-001` vaihe 3 "LWM integration", 8 viikkoa, **25 000 €**, ei hyvity (`Store/PRODUCT_AEGIS_IMPLEMENTATION.md`).
- HIC 01.10.2026: LWM v2 kuuluu pilottiin maksutta, tekijänoikeus Lifetime Oy:llä, koulutuksen kustannus Lifetime Oy:llä.
- FI v2.0 "Päivä 91": jos asiakas ei jatka, käyttölisenssi malliin päättyy.

## Ehdotus

| SKU            | Nimi                                    | Pilotissa               | Päivä 91+                                                                                                                                                          |
| -------------- | --------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `LWM-V2-PILOT` | Lifetime World Model v2 Pilot           | 0 €, sisältyy pilottiin | Jää asiakkaalle: pysyvä, ei-siirrettävä käyttöoikeus pilotin rajaukseen (yksi kohde, yksi työnkulku), versio jäädytetty päivänä 90, ei päivityksiä ilman ylläpitoa |
| `LWM-V2-FULL`  | Lifetime World Model v2, täysi lisenssi | —                       | Päivitys Pilot-versiosta; useampi työnkulku ja kohde, jatkuvat päivitykset ylläpitotilauksen kautta; hinta HIC                                                     |
| `LWM-V2-CONF`  | Asiakaskohtainen konfiguraatio          | 0 € (Lifetime kantaa)   | sisältyy FULL-päivitykseen tai IMPL vaihe 3:een                                                                                                                    |

## Miksi Pilot-versio kannattaa

- Asiakkaalle jää jotain käytettävää myös ilman jatkoa → pilotin hylkäämisen kynnys nousee, ja päätös jatkosta on päivitys, ei uusi hankinta.
- Myyntikieli: "pidät koulutetun mallin pilottirajaukseen; täysi versio laajentaa sen".
- Kaksi nimettyä versiota tekee tuotteesta toistettavan: Pilot on sama jokaiselle asiakkaalle, FULL on hinnoiteltu päivitys.

## Kolme asiaa, jotka on ratkaistava ennen hinnoittelua

1. **Toimiiko Pilot-versio ilman Aegis-lisenssiä?** Malli ajetaan Aegis-ajoympäristössä. Jos asiakas ei jatka, ajoympäristön käyttöoikeus päättyy (v2.0 Päivä 91). Vaihtoehdot: (a) Pilot-versio jää vain käyttöoikeutena ilman ajoympäristöä, eli käytännössä arkistona; (b) myös pilottirajattu ajoympäristö jää käyttöön ilman päivityksiä; (c) Pilot-version käyttö vaatii ylläpitotilauksen Standard-tasolla. (b) on lupaus, joka sitoo tukea; (c) muuttaa sen tilaukseksi.
2. **Päällekkäisyys IMPL vaihe 3:n kanssa.** "LWM integration" 25 000 € ja `LWM-V2-FULL` kuvaavat osin samaa työtä. Ehdotus: FULL = lisenssi (ohjelmisto), IMPL vaihe 3 = integraatiotyö (palvelu); kumpaakaan ei laskuteta kahdesti samasta rajauksesta.
3. **Hinnan ankkuri.** Repossa ei ole perustetta LWM v2 FULL -hinnalle. Vaihtoehdot HIC:lle: (i) kertamaksu ankkuroituna IMPL vaihe 3:een (25 000 €); (ii) osa Aegis-lisenssiä (59 990 €) + ylläpitotason korotus; (iii) per työnkulku / per kohde -lisenssi. Agentti ei aseta hintaa.

## Vaikutus FI-tekstiin (jos hyväksytään, tekstin v2.1)

"Päivä 91. … Ei jatkoa: asiakas pitää datansa, lokinsa, raportin, arkkitehtuurikuvauksen, mittaukset, laitteiston ja Lifetime World Model v2 Pilot -version pilotin rajaukseen. Täysi LWM v2 -lisenssi hinnoitellaan erikseen."
