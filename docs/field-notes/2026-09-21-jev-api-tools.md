# Jev API -työkalut — muistio

**Päivä:** 2026-09-21
**Laatija:** Risto Anton Päärni (kooste, ei vahvistettu lähdekoodeista)
**Status:** PENDING_REVIEW — linkkejä ei ole avattu/varmennettu tässä sessiossa, listaus perustuu HIC:n antamaan syötteeseen.

## Tausta

"Jev API" -ekosysteemi (Anthropicin agenttipäätöksenteko-rajapinta, oletettavasti judge/decision-tyyppinen malli-kutsu) on kasvattanut suosiotaan. Alla 20 community-projektia, jotka käyttävät sitä eri tavoin — hyvä lähtölista kun on saanut API-avaimen mutta ei vielä käyttötapaa.

## Lista

| #   | Projekti            | Käyttötapa                                                                                      | Repo                                      |
| --- | ------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 1   | jev-ultrafast       | Browser Use -pohjainen selainagentti; Jev päättää klikattavan elementin, pieni malli kirjoittaa | github.com/browser-use/jev-ultrafast      |
| 2   | fast-jev-compaction | Kontekstikompressio Claude Codelle; Jev arvioi relevanssin ennen työkalukutsua                  | github.com/tamaratran/fast-jev-compaction |
| 3   | json-render         | Vercel Labs generatiivinen UI; Jev valitsee komponentit/asettelun, ei tokenisoi JSONia          | github.com/vercel-labs/json-render        |
| 4   | typesafe-mcp        | Jev-integraatio Claude Code/Desktop/Codex/Pi:hen (Choice/Score/Noul)                            | github.com/itsmostafa/typesafe-mcp        |
| 5   | jev-mcp             | Agenttien päätöstyökalupakki: faktantarkistus, sisällönseulonta, semanttinen lajittelu          | github.com/jkudish/jev-mcp                |
| 6   | SemDecide           | Jev CLI-työkaluksi: luokittelu/pisteytys/suodatus shellissä, CI/putkiin                         | github.com/sharziki/semdecide             |
| 7   | jev-codex-router    | Arvioi koodaustehtävän vaikeuden → valitsee mallitason/nopeuden                                 | github.com/0xNatoshi/jev-codex-router     |
| 8   | Winnow              | Kontekstin roskienkeruu Claude Codelle; suodattaa Read/Bash/Grep-tulosteet                      | github.com/GhalebDweikat/Winnow           |
| 9   | jev-review          | Koodikatselmus: poimii korkeariskiset muutokset ennen kalliimpaa mallia/ihmistä                 | github.com/devagrawal09/jev-review        |
| 10  | Blink               | Koodikirjaston navigointi hakemistotaso kerrallaan relevanssiarvioinnilla                       | github.com/ellipsis-dev/blink             |
| 11  | agent-desktop       | Työpöytäautomaatio saavutettavuuspuun kautta                                                    | github.com/lahfir/agent-desktop           |
| 12  | typesafe-mario      | Super Mario -pelaaminen emulaattorin RAM-tilasta (ei kuvakaappauksista)                         | github.com/fhshaik/typesafe-mario         |
| 13  | jev-drone           | Droonin korkean tason päätökset (nousu/jarrutus/esteet), matala taso erillään                   | github.com/RomanSlack/jev-drone           |
| 14  | OneVOneJev          | Selainpohjainen 1v1 FPS -päätöksenteko per tick                                                 | github.com/emrickgarrett/OneVOneJev       |
| 15  | jev-trader          | Monad-testiverkon HFT-arbitraasi, ~81ms latenssi                                                | github.com/jarrodwatts/jev-trader         |
| 16  | Prism               | Suodattaa myrkylliset virrat/markkinapaineen ennen strategialle luovutusta                      | github.com/irfndi/prism-l                 |
| 17  | neo4jev             | Jev tietokuviossa: kannattavimman reunan valinta solmuittain                                    | github.com/jexp/neo4jev                   |
| 18  | jev-curate          | Koulutusdatan (JSONL/Parquet) laatu-/relevanssi-/riskiseulonta                                  | github.com/AkashPriyadarshi/jev-curate    |
| 19  | Canny               | Estää coding agentia väittämästä valmiiksi ilman diff/testi-evidenssiä                          | github.com/qkal/Canny                     |
| 20  | killmyidea          | Startup-idean pisteytys → KILL/FIX/SHIP-verdikti                                                | github.com/monteduro/killmyidea           |

## Relevanssi DWS IQ:lle

- **#9 jev-review, #19 Canny** — suoraan verrattavissa omaan `code-reviewer`/`Canny`-tyyppiseen "älä väitä valmiiksi ilman evidenssiä" -periaatteeseemme (CLAUDE.md Rule 12, Fail Loud).
- **#2 fast-jev-compaction, #8 Winnow** — kontekstikompressio Claude Codelle; verrattavissa omaan token-budjettikuriin (Discipline Rule 6).
- **#6 SemDecide, #7 jev-codex-router** — malliyönohjaus vaikeusasteen mukaan; sama periaate kuin oma "Model for judgment calls only" (Rule 5).
- Loput (peli/drone/trading/scraping) eivät ole ydinliiketoimintaan relevantteja, mutta osoittavat Jev-mallin yleiskäyttöisyyden judge/router-roolissa.

## Varaukset

- Linkkejä ei avattu eikä koodia auditoitu tässä sessiossa — HIC:n toimittama lista, ei riippumattomasti varmennettu.
- "Jev API" -termiä ei löydy Anthropicin virallisesta dokumentaatiosta tässä tietopohjassa; oletettavasti community-lempinimi jollekin malli-/judge-rajapinnalle tai HIC:n oma lyhenne. Vahvista ennen ulkoista viestintää.

N/A — KB-päivitys/HTML-render/Drive-export ohitettu: kyseessä on nopea tiedon talteenotto, ei substantiaalinen koodi/artefakti-sessio (Rule "trivial sessions exempt").
