---
Status: PENDING_REVIEW
Date: 2026-09-21
Author: Claude Code (session standby)
Topic: Idea-customer / PMF funnel stage
---

# Idea-asiakkaat ja PMF-vaihe ennen maksavia asiakkaita

## Havainto (HIC, 2026-09-21)

Ennen maksavia asiakkaita DWS IQ:lla on useita rinnakkaisia kategorioita, joita ei pidä sekoittaa maksavaan asiakaskantaan raportoinnissa tai pipeline-metriikassa:

- **Idea-asiakkaat** — potentiaaliset asiakkaat, joiden kanssa käydään keskustelua tuotteistuksen suunnasta, mutta ei vielä kaupallista sitoumusta.
- **Työkalukumppanit** — teknologia-/jakelukumppanit (esim. MCP-, integraatio- tai jakelukumppanit), joiden arvo on pääsy tai kyvykkyys, ei suora liikevaihto.
- **Myyntikohteet** — aktiivisessa myyntiprosessissa olevat liidit, joilla ei vielä ole allekirjoitettua sopimusta.
- **Tuotteistukset** — tuotteen/palvelun kehitysvaihe, joka syntyy näistä asiakaskeskusteluista (osaaminen ja product-market fit kehittyvät iteratiivisesti).

## Miksi tämä on merkityksellinen

DWS IQ:n go-to-market-vaiheessa (product-led + sales-led) nämä neljä kategoriaa muodostavat suppilon, jonka kautta PMF löytyy ennen kuin kategoria muuttuu maksavaksi asiakkaaksi. Näiden sekoittaminen maksavien asiakkaiden lukuihin vääristäisi MGD/CRC-raportointia (`/mgd-report`) ja investor-viestintää.

## Ehdotettu jatkotoimi

1. Erottele nämä neljä kategoriaa omaksi kevyeksi pipeline-näkymäksi (esim. CRM-taulu tai kevyt markdown-taulukko `docs/`-alla), jotta idea-asiakkaat/kumppanit/myyntikohteet/tuotteistukset eivät sotkeudu maksavien asiakkaiden lukuihin.
2. Kun ensimmäinen idea-asiakas konvertoituu maksavaksi, kirjata konversio erillisenä tapahtumana MGD-raportointiin.

## HIC-päätöskysymys

Halutaanko tämä nelijako (idea-asiakkaat / työkalukumppanit / myyntikohteet / tuotteistukset) formalisoida omaksi pipeline-tauluksi (esim. Supabase-taulu tai `docs/pipeline/`-tiedosto), vai riittääkö toistaiseksi tämä field note manuaalisena muistiinpanona?

## N/A-kohdat (Rule 12, Fail Loud)

- KB-päivitys: N/A — odottaa HIC-päätöstä pipeline-rakenteesta ennen kuin KB:hen kirjataan pysyvä rakenne.
- HTML-render / Drive-export: N/A — muistiinpano on sisäinen, ei asiakas- tai julkinen artefakti.
- Kalenterimerkintä: N/A — ei päivättyä sitoumusta tässä havainnossa.
