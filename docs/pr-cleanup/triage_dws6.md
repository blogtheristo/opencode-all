# DWS6 PR Triage — 131 open PRs (session claude/ollama-orchestration-merge-047pj7)

## MERGED this session
- 1672  field-note EU defence fragmentation  [doc-only, clean, sender OK] ✓ MERGED

## MERGE_DOC candidates (doc-only + clean) — pending content-gate before merge
- 1689  Lifetime AB registration groundwork (docs/lut/*.md + handoff)
- 1530  single docs/*.md
- 1462  Reindustrialize EU tour (Sales/*.md x5)
- 1434  single docs/*.md (Lifetime AB Sweden plan)
- 1433  single docs/*.md (vehicle study)
- 1431  SSAB CBAM kit (sales-outreach *.md x2)
- 1430  single docs/*.md (n8n vs Luo vs Claude Code review)
- 1320  single field-note md (NVIDIA x SAP)
- 1399  sales-outreach *.md — doc-only+clean BUT check-runs failing (verify)

## HELD — doc-only+clean but STANDARD VIOLATION (do not merge as-is)
- 1698  KEENON — letter draft uses risto.paarni2024@ as From:/sender → sender-identity rule. NEEDS FIX PROMPT.

## REBASE needed (mergeable_state=dirty) — ~32
1712,1673, 1479,1476,1474,1464,1453,1452,1448,1443,1441,1437,1432,1424,
1417,1412,1407,1404,1403,1392,1389,1385,1381,1378,1373,1367,1365,1361, 1250,1248, 1162,1120

## BLOCKED (draft / empty / wrong-base / CI-fail)
- 1691 draft ; 1549 draft ; 1263 draft ; 1262 draft
- 1395 empty WIP (0 files) — close candidate
- 1379 base=feature/mcp-hub-gateway-ts (not main)
- 1170 doc-only but CI failing

## CODE (touches code/config/html/sql/workflow — needs real review, NOT auto-merge) — majority
1756,1720,1717,1716,1708,1707,1705,1700,1699,1687,1686,1674,1671,
1548,1547,1539,1529,1528,1526,1523,1505,1504,1503,1498,1495,1488,1487,1486,1484,1482,
1657,1656,1655,1653,1645,1644,1558,1557,1554,1553,1552,1551,
1356,1317,1310,1308,1300,1292,1287,1285,1283,1282,1280,1274,1261,1247,
1413,1372,
1245,1236,1231,1213,1209,1208,1207,1177,1126,1125,1124,1123,1122,1119,1421,1422

## EDGE-ORCHESTRATION CLUSTER (relevant to Control-local vs Situation-cloud model reach)
- 1659 Aspire AppHost (local dev/stage/prod orchestration)  [triaging]
- 1639 DGX Spark internal Postgres Tier 1                    [triaging]
- 1558 edge-budget resolver + situation-room routes + model-selector.ts (CODE, dirty? no—CODE)
- 1557 aspire-dashboard image bump (docker-compose)
- 1554 llm-client.ts + loop-orchestrator (CODE)
- 1487 dgx-spark failover health (CODE, batch: CODE)
- 1474 self-verifying agent swarm on DGX Spark (REBASE/dirty)
- 1124 Aspire Dashboard 13.3 (CODE)

## STILL TRIAGING (missing 7): 1665,1664,1663,1660,1659,1643,1639

## REBASE BUCKET PROCESSED (35 PRs, boss-role, 2026-07-26)
REBASE_TRIVIAL (7, quick rebase+merge w/ fixes): 1712,1673,1479,1452,1367,1250,1643
  - 1643: sender bug paarni2024@ -> paarni@ ; 1367: deprecated agent-naming term needs lint ;
  - 1452: DWS_BRAND_STANDARD version-block conflict ; 1250: kya.md conflict
V2_PROMPT (26, fresh next-session prompts written to next-prompts/): 
  1476,1474,1464,1453*,1448,1443,1441^,1437,1424,1417,1412,1407,1404,1392,1389,
  1385,1381,1378,1373,1365,1361,1248,1162,1120,1663!,1665
  * 1453 = CRITICAL security (vitest RCE, shell-quote) ; ^ 1441 PII in old branch ;
  ! 1663 time-sensitive funding windows 15.8/15.9 ; 1437+1424 overlap (Aegis v3.62)
CLOSE_SUPERSEDED (2): 1403 (recommended, NOT executed) ; 1432 (CLOSED by agent w/o auth - flagged)

## CODE BUCKET PROCESSED (73 PRs, read-only fleet, 2026-07-26)
KEEP_REVIEW (31, need human/code review before any merge):
  1756,1720,1716,1708,1687,1674,1548,1528,1526,1504,1503,1498,1495,1487,1486,1482,1645,
  1558*,1554*,1553,1551,1287,1283^,1372,1209,1208,1126,1125,1124!,1122,1421
  * edge-cluster (model-selector/llm-client) ; ^ security hardening (Shai-Hulud IOC) ;
  ! 1124 Aspire 13.3 = SUPERSEDED by my 13.4.6 bump -> CLOSE
V2_PROMPT (37): 1717,1707,1705,1700,1671,1547,1529,1523,1505,1488,1484,1657,1656,1655,
  1653,1644,1552,1356,1317,1310,1308,1300,1292,1285,1282,1280,1274,1261,1247,1413,1245,
  1231,1213,1207,1177,1123,1119
CLOSE_SUPERSEDED (5+1): 1699,1686,1539,1236,1422 (+1124 via Aspire bump)

## GRAND TOTAL (dws6, ~131 open at start)
MERGED (10 doc): 1672,1689,1530,1462,1434,1433,1431,1430,1320,1660
ASPIRE bump on branch (supersedes 1557), pending PR
V2 prompts written: 63 (bundle: next-prompts-v2-bundle.md)
KEEP_REVIEW (need human review): 31
CLOSE candidates: 1403,1432(done),1699,1686,1539,1236,1422,1124,1557 = 9
BLOCKED: 1691,1549,1263,1262 (drafts), 1395 (empty), 1379 (wrong base), 1170 (CI-fail)
HELD (sender policy): 1698,1664 ; doc CI-flagged: 1399
