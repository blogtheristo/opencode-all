# Handoff — claude/tutkimussuunnitelma-tiivistelmä-fczxea

**Date:** 28.09.2026 · **Status:** v2.7 committoitu, odottaa Drive-vientiä

## Missä mennään

|                                                                                       | Versio | Tila                              |
| ------------------------------------------------------------------------------------- | ------ | --------------------------------- |
| Masteri `docs/lut/tutkimussuunnitelman-tiivistelma-lut-2026-fi.md`                    | 2.7    | Tässä haarassa, ei vielä mainissa |
| Nokia-export `docs/lut/2026-08-10-nokia-saatio-tutkimussuunnitelma-tiivistelma-FI.md` | 2.7    | Tässä haarassa, ei vielä mainissa |
| Drive-vienti (kansio: LUT PhD — Sovereign Edge AI)                                    | 2.4    | Jäljessä kolme versiota           |

## PR-historia

- **PR #1820** — merged 11.08.2026 03:16Z, v2.1 → v2.6, 5 tiedostoa, +725/−27, 7 committia.
  Sisältö: empiirinen perusta + käyttöönottoriippuvuus · jurisdiktiokehyksen laajennus (ei EU–US-asetelma) · tutkimus-vs-GTM-erottelu · versioparius · Etelä-Korean poisto · Geminin kahden kierroksen konsolidointi (GTM-status-sarake, akateeminen tutkimusalue / markkinastrategia; ehdottomat GTM-statukset hylätty).
- **Tämä haara (28.09.2026)** — v2.7, kaksi mainissa ollutta puutetta korjattu, ks. alla.
- Haara on uudelleenperustettu mainista #1820:n squash-mergen jälkeen; vanhat commitit ovat mainin historiassa.

## Mitä v2.7 korjaa (kaksi puutetta mainissa)

1. **HIC:n 11.08.2026 hyväksymä korvaus puuttui PR #1820:sta.** "Syvä paikallinen validointi Suomessa, Ruotsissa ja Saksassa" → "paikalliset vertailut … niiden kunkin evidenssistatuksen mukaisesti". Vanha muotoilu lupasi empiiristä aineistoa kolmesta maasta, joista vain Suomi on empiirinen. Korjattu sekä Akateeminen tutkimusalue -kappaleessa että GTM-vertailutaulukon Laajuus-rivillä.
2. **Nokia-exportista puuttui koko tutkimus-vs-GTM-kappale**, vaikka sen v2.3-muutoshistoria väitti sen olevan siellä. Apurahaliitteestä puuttui siis HIC:n vaatima erottelu. Palautettu.

Lisäksi: empiirinen riippuvuus rajattu osittaiseksi HIC:n tarkennuksen mukaan — väitös ei romahda käyttöönottojen viivästyessä, koska RQ1/RQ2 voivat edetä fallback-aineistolla; RQ3/RQ4 ovat ne osat, jotka edellyttävät käyttöönottoja.

## Repon tila ympärillä (uusimmat mainin PR:t)

- **#2208** Coding Delegation Rule, `scripts/loop-task.mjs`, HIC PR -päätökset
- **#2207** `opencode-loop`: DONE päättyy PR:ään; done-gate `opencode-all`:ssa; `--prs` purkaa PR-jonon
- **#2206** `opencode-loop` shell-komento valvomattomaan tehtäväsilmukkaan

Näillä on yksi seuraus tälle työlle: CLAUDE.md:n **Done Gate Rule** vaatii nyt `node scripts/agent-done-gate.mjs --full` -tulosteen ennen kuin työ raportoidaan valmiiksi. Dokumenttimuutoksille tämä tarkoittaa käytännössä committed + pushed + formatoitu.

## Avoin

1. Drive-vienti v2.7 (masteri + export samalla numerolla, versioparius). MCP Drive ei osaa ylikirjoittaa Docsia → uusi tiedosto per versio; kansiossa on jo 2.0–2.4.
2. PR tälle haaralle.

## Huom seuraavalle sessiolle

- **Delimiter:** `VERSION AND AGENT HISTORY` käyttää nyt `---` (CLAUDE.md, HIC 19.09.2026 poisti `***`). Aiempi ohje "palauta `***` käsin" on vanhentunut — Prettier-hook toimii nyt oikein, älä taistele sitä vastaan.
- **Hyväksyntä ≠ commit:** kun HIC hyväksyy sanamuodon kesken session, committoi se ennen seuraavaa aihetta ja tarkista `grep`illä että se on tiedostossa. v2.7 syntyi juuri tämän laiminlyönnistä.
- Muotoilija (Prettier) järjestelee HTML/MD:n Edit/Write-kutsun jälkeen; merkkijonokorvaukset kannattaa tehdä Bashista pythonilla ja **assertoida** osuma, muuten korvaus epäonnistuu hiljaisesti.
