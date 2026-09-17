# Sessions Without PRs — Audit & Backfill (2026-07-06)

Audit of all 467 remote branches in `blogtheristo/dws6`: which session branches carry committed work that was never opened as a pull request, and the backfill PRs created for them.

**Method.** Branch tip SHAs and full branch-unique histories (`git rev-list <branch> ^origin/main`) were matched against all `refs/pull/*/head` SHAs (1,178 PR head refs). A branch counts as "never had a PR" only if no PR head SHA appears anywhere in its unique history.

## Result summary

| Category | Count | Action |
| --- | --- | --- |
| Session branches with work but **no PR ever** | 67 | Backfill PR created (#1568–#1634) |
| Branches with a **historical PR** + a few post-PR commits | 247 | No action (mostly merge-back commits) |
| Branches with **zero commits ahead** of main | 2 | Nothing to PR |
| Branches whose tip already has an open/merged PR | remainder | No action |

## Backfilled PRs (67)

| Branch | Commits | Last activity | PR |
| --- | --- | --- | --- |
| `claude/4p-capital-classes-propagate-h0hien` | 8 | 2026-06-21 | [#1568](https://github.com/blogtheristo/dws6/pull/1568) |
| `claude/add-case-schema-context-lM3qe` | 1 | 2026-05-08 | [#1569](https://github.com/blogtheristo/dws6/pull/1569) |
| `claude/add-vault-runtime-auth-NKwSC` | 1 | 2026-05-17 | [#1571](https://github.com/blogtheristo/dws6/pull/1571) |
| `claude/agent-deployment-execution-U8B2C` | 9 | 2026-05-28 | [#1576](https://github.com/blogtheristo/dws6/pull/1576) |
| `claude/agent-swarm-architecture-zPf5Z` | 7 | 2026-06-09 | [#1572](https://github.com/blogtheristo/dws6/pull/1572) |
| `claude/agentic-systems-foundation-5Q0LQ` | 1 | 2026-05-18 | [#1570](https://github.com/blogtheristo/dws6/pull/1570) |
| `claude/ai-codebase-security-audit-BgY2H` | 1 | 2026-07-01 | [#1574](https://github.com/blogtheristo/dws6/pull/1574) |
| `claude/ai-native-support-workflow-1c4kO` | 1 | 2026-05-12 | [#1580](https://github.com/blogtheristo/dws6/pull/1580) |
| `claude/ai-sovereignty-research-9eshgd` | 5 | 2026-07-01 | [#1575](https://github.com/blogtheristo/dws6/pull/1575) |
| `claude/audit-investor-docs-g6t62` | 1 | 2026-05-17 | [#1573](https://github.com/blogtheristo/dws6/pull/1573) |
| `claude/b3b-outreach-analysis-7AtlA` | 5 | 2026-05-12 | [#1578](https://github.com/blogtheristo/dws6/pull/1578) |
| `claude/bugs-architecture-coherence-TT4Xo` | 1 | 2026-05-31 | [#1584](https://github.com/blogtheristo/dws6/pull/1584) |
| `claude/capital-classes-audit-jgworp` | 1 | 2026-06-21 | [#1579](https://github.com/blogtheristo/dws6/pull/1579) |
| `claude/careers-lifetime-links-guf326` | 8 | 2026-06-13 | [#1577](https://github.com/blogtheristo/dws6/pull/1577) |
| `claude/carin-huoltopalvelu-quote-ygb14z` | 3 | 2026-07-01 | [#1581](https://github.com/blogtheristo/dws6/pull/1581) |
| `claude/cbam-alignment-pr-6as8L-gm8Fx` | 1 | 2026-05-21 | [#1586](https://github.com/blogtheristo/dws6/pull/1586) |
| `claude/ceo-review-tech-partner-2jSy9` | 9 | 2026-06-08 | [#1583](https://github.com/blogtheristo/dws6/pull/1583) |
| `claude/cloudflare-serverless-research-9m90rh` | 2 | 2026-07-05 | [#1582](https://github.com/blogtheristo/dws6/pull/1582) |
| `claude/competency-assessment-dashboard-cC3Zs` | 1 | 2026-05-21 | [#1585](https://github.com/blogtheristo/dws6/pull/1585) |
| `claude/daily-backup-audit-5s0hvw` | 1 | 2026-07-05 | [#1591](https://github.com/blogtheristo/dws6/pull/1591) |
| `claude/database-sovereignty-cloud-plan-j8wuy7` | 1 | 2026-07-05 | [#1588](https://github.com/blogtheristo/dws6/pull/1588) |
| `claude/datacentre-energy-ai-demand-bnWxc` | 1 | 2026-05-20 | [#1587](https://github.com/blogtheristo/dws6/pull/1587) |
| `claude/dependabot-alerts-triage-zi7chh` | 2 | 2026-07-04 | [#1590](https://github.com/blogtheristo/dws6/pull/1590) |
| `claude/devco-sisu-partners-dws-vFgUc` | 3 | 2026-06-07 | [#1597](https://github.com/blogtheristo/dws6/pull/1597) |
| `claude/dgx-spark-mining-case-gf1159` | 4 | 2026-06-26 | [#1592](https://github.com/blogtheristo/dws6/pull/1592) |
| `claude/dominant-game-strategy-cjstn5` | 1 | 2026-07-05 | [#1589](https://github.com/blogtheristo/dws6/pull/1589) |
| `claude/dws-investor-outreach-hbsj45` | 7 | 2026-06-09 | [#1596](https://github.com/blogtheristo/dws6/pull/1596) |
| `claude/dws-iq-aegis-roadmap-jlwr2z` | 1 | 2026-07-05 | [#1598](https://github.com/blogtheristo/dws6/pull/1598) |
| `claude/dws-nvidia-os-NDuOs` | 3 | 2026-05-20 | [#1595](https://github.com/blogtheristo/dws6/pull/1595) |
| `claude/dws10-offensive-positioning-6kdf2c` | 2 | 2026-06-10 | [#1593](https://github.com/blogtheristo/dws6/pull/1593) |
| `claude/eu-china-industrial-sovereignty-6hvyjs` | 4 | 2026-06-18 | [#1601](https://github.com/blogtheristo/dws6/pull/1601) |
| `claude/eu-china-trade-diversification-atx3l3` | 3 | 2026-06-21 | [#1603](https://github.com/blogtheristo/dws6/pull/1603) |
| `claude/europe-construction-leads-3rxuw0` | 1 | 2026-07-05 | [#1599](https://github.com/blogtheristo/dws6/pull/1599) |
| `claude/external-cache-lwm-czyno` | 1 | 2026-05-21 | [#1594](https://github.com/blogtheristo/dws6/pull/1594) |
| `claude/fervent-lovelace-fdc2O` | 3 | 2026-06-13 | [#1604](https://github.com/blogtheristo/dws6/pull/1604) |
| `claude/finland-public-ai-strategy-t0goqg` | 2 | 2026-06-27 | [#1608](https://github.com/blogtheristo/dws6/pull/1608) |
| `claude/frankenburg-riga-case-study-fhvngk` | 1 | 2026-07-05 | [#1602](https://github.com/blogtheristo/dws6/pull/1602) |
| `claude/gtm-skills-planning-7ui3kd-lc0j07` | 1 | 2026-07-05 | [#1600](https://github.com/blogtheristo/dws6/pull/1600) |
| `claude/header-all-pages-6fmhi7` | 1 | 2026-07-01 | [#1605](https://github.com/blogtheristo/dws6/pull/1605) |
| `claude/human-token-capital-ai-i4m0ve` | 2 | 2026-06-15 | [#1613](https://github.com/blogtheristo/dws6/pull/1613) |
| `claude/improve-sales-strategy-6qvat` | 2 | 2026-05-21 | [#1607](https://github.com/blogtheristo/dws6/pull/1607) |
| `claude/industries-count-drift-lts7n8` | 2 | 2026-06-21 | [#1606](https://github.com/blogtheristo/dws6/pull/1606) |
| `claude/industry-world-models-study-Mk2mu` | 1 | 2026-05-21 | [#1611](https://github.com/blogtheristo/dws6/pull/1611) |
| `claude/jetson-thor-physical-ai-91mjtv` | 1 | 2026-06-26 | [#1616](https://github.com/blogtheristo/dws6/pull/1616) |
| `claude/keenon-robotics-lifetime-fleet-i26cc5` | 4 | 2026-07-01 | [#1610](https://github.com/blogtheristo/dws6/pull/1610) |
| `claude/loop-engineer-hypothesis-tu0pi8` | 1 | 2026-06-09 | [#1609](https://github.com/blogtheristo/dws6/pull/1609) |
| `claude/loop-explanation-kids-xxwyqw` | 1 | 2026-06-21 | [#1614](https://github.com/blogtheristo/dws6/pull/1614) |
| `claude/mobile-dashboard-scope-u5xfee` | 2 | 2026-07-04 | [#1619](https://github.com/blogtheristo/dws6/pull/1619) |
| `claude/model-performance-notes-4x3or` | 5 | 2026-05-18 | [#1615](https://github.com/blogtheristo/dws6/pull/1615) |
| `claude/nordic-industrial-ai-sales-Jni0E` | 3 | 2026-05-10 | [#1612](https://github.com/blogtheristo/dws6/pull/1612) |
| `claude/nvidia-drive-agx-thor-fsrvvf` | 2 | 2026-07-05 | [#1618](https://github.com/blogtheristo/dws6/pull/1618) |
| `claude/nvidia-inception-reseller-qk6xqx` | 1 | 2026-07-05 | [#1626](https://github.com/blogtheristo/dws6/pull/1626) |
| `claude/one-click-lca-partnership-MIYvn` | 6 | 2026-05-21 | [#1621](https://github.com/blogtheristo/dws6/pull/1621) |
| `claude/outokumpu-customer-strategy-p01zeu` | 1 | 2026-07-01 | [#1617](https://github.com/blogtheristo/dws6/pull/1617) |
| `claude/outreach-agents-spark-7n0fgy` | 2 | 2026-06-16 | [#1622](https://github.com/blogtheristo/dws6/pull/1622) |
| `claude/patria-outreach-FgfK6` | 1 | 2026-05-26 | [#1629](https://github.com/blogtheristo/dws6/pull/1629) |
| `claude/patria-valmet-outreach-xrhsv3` | 3 | 2026-06-21 | [#1623](https://github.com/blogtheristo/dws6/pull/1623) |
| `claude/proactive-nudge-persistence-7q2joh` | 1 | 2026-06-21 | [#1620](https://github.com/blogtheristo/dws6/pull/1620) |
| `claude/risto-cv-cybersecurity-rqhron` | 1 | 2026-06-10 | [#1624](https://github.com/blogtheristo/dws6/pull/1624) |
| `claude/session-container-memory-6ccpnf` | 1 | 2026-07-05 | [#1631](https://github.com/blogtheristo/dws6/pull/1631) |
| `claude/setup-autoresearch-gn100-oemQQ` | 1 | 2026-06-20 | [#1628](https://github.com/blogtheristo/dws6/pull/1628) |
| `claude/sovereign-intelligence-industries-ypyo41` | 1 | 2026-07-05 | [#1625](https://github.com/blogtheristo/dws6/pull/1625) |
| `claude/stoic-shannon-3u1994` | 1 | 2026-06-20 | [#1630](https://github.com/blogtheristo/dws6/pull/1630) |
| `claude/telia-partner-outreach-07n7Y` | 2 | 2026-05-26 | [#1633](https://github.com/blogtheristo/dws6/pull/1633) |
| `claude/valmet-automotive-sales-DM7FT` | 1 | 2026-05-26 | [#1632](https://github.com/blogtheristo/dws6/pull/1632) |
| `claude/vertical-agent-architecture-f8fqc5` | 9 | 2026-06-13 | [#1627](https://github.com/blogtheristo/dws6/pull/1627) |
| `cursor/agent-documentation-validation-b361` | 2 | 2026-05-12 | [#1634](https://github.com/blogtheristo/dws6/pull/1634) |

## Branches with zero commits ahead (no PR possible)

- `claude/ceo-review-dws-firehorse-1kWuP`
- `claude/supabase-audit-aiven-td3x8r`

## Branches with a historical PR and unsubmitted trailing commits (247)

These had a PR earlier in their history (merged or closed) and carry additional commits after it — typically a merge of `main` back into the branch. No backfill PR was created to avoid duplicate/noise PRs. Re-run this audit against this list if those trailing commits should also be reviewed.

- `claude/activate-dev-expenses-Cbb1q`
- `claude/add-aegis-market-data-XLx7j`
- `claude/add-agent-staff-ek7Wo`
- `claude/add-ai-consulting-guidance-pDsPu`
- `claude/add-baseten-compliance-5fQYW`
- `claude/add-erik-kurist-contact-wEQPn`
- `claude/add-eu-commission-field-note-ory1p`
- `claude/add-eu-info-note-8XYey`
- `claude/add-firehorse-features-zW1m0`
- `claude/add-founder-evidence-html-learn`
- `claude/add-godagents-menubar-WiXOs`
- `claude/add-insights-dashboard-Hk3HP`
- `claude/add-karpathy-system-prompt-mDVny`
- `claude/add-lab-notes-training-y57rH`
- `claude/add-lab-notes-visibility-RQRA9`
- `claude/add-model-field-note-0jLQk`
- `claude/add-ollama-provider-vzqYb`
- `claude/add-pe-insights-outreach-dXIng`
- `claude/add-pentesting-security-scan-Ul6uW`
- `claude/add-resend-api-key-1ERw5`
- `claude/add-security-compliance-note-qi3SD`
- `claude/add-world-model-yDZ5G`
- `claude/adoring-sutherland`
- `claude/affectionate-elion`
- `claude/agent-adaptation-framework-NmpCQ`
- `claude/agent-input-schemas-1RWJg`
- `claude/agent-model-routing-RpnU3`
- `claude/agent-native-cloud-RReQu`
- `claude/ai-agent-competition-oV6JM`
- `claude/ai-gdpr-compliance-docs-nA9sm`
- `claude/ai-infrastructure-layers-hCqQ3`
- `claude/ai-native-org-system-BySKh`
- `claude/ai-receptionist-agent-QFRCf`
- `claude/ai-service-brochure-yXqoS`
- `claude/alpha-share-agreement-setup-Uou1C`
- `claude/analyze-test-coverage-VGfIp`
- `claude/anti-silicon-valley-strategy-YhpOy`
- `claude/api-gateway-federation-research-cSEFN`
- `claude/arctic-15-funnel-strategy-3akU2`
- `claude/aspire-dws-dashboard-dCvyG`
- `claude/audit-dws-agi-tjX9U`
- `claude/auto-enable-mode-feature-e1tyZ`
- `claude/automate-bid-api-z19l1`
- `claude/aws-claude-code-consulting-Bhp7E`
- `claude/aws-consulting-phase2-Bhp7E`
- `claude/bilingual-marketing-campaign-SCC4g`
- `claude/block71-deep-sage-2026-xNiom`
- `claude/build-dws7-feature-Ki02f`
- `claude/build-feature-v1-implementations-iOymw`
- `claude/build-insights-dashboard-cNoEr`
- `claude/build-mvp-features-7NbcX`
- `claude/captain-product-messaging-BZgRS`
- `claude/centralized-price-list-rl82P`
- `claude/chatbot-alternatives-6HJcZ`
- `claude/check-brief-posting-022bt`
- `claude/clever-hofstadter`
- `claude/clone-last30days-repo-bZRU0`
- `claude/cloud-sovereignty-analysis-0M2om`
- `claude/colin-brown-podcast-storyboard-t8Cyz`
- `claude/commit-push-merge-2026-04-24`
- `claude/compare-agent-365-themis-29fCC`
- `claude/compare-agent-systems-qDbS7`
- `claude/consolidate-resend-email-dgsHp`
- `claude/construction-captain-sales-2x3ou`
- `claude/construction-captain-seat-laYRr`
- `claude/consulting-to-agentic-products-xo6s9`
- `claude/cool-margulis-1724ce`
- `claude/core-mental-models-9NOL8`
- `claude/creandum-california-research-KjTwr`
- `claude/create-founder-evidence-doc-8pv1K`
- `claude/create-press-release-b3seW`
- `claude/create-risto-persona-PHjHV`
- `claude/cross-vertical-intelligence-sim-LdnCF`
- `claude/cultivation-investor-deck-iASjf`
- `claude/dashboard-v10-forms-1RWJg`
- `claude/debug-ses-auth-RqLbO`
- `claude/delivery-diagnostic-audit-XXkg2`
- `claude/deploy-cloud-run-sentry-NbWPm`
- `claude/deploy-nemotron-openclaw-l1zX7`
- `claude/deploy-team-chat-worker-tDtfo`
- `claude/design-audit-agent-hiQHt-Wx7qF`
- `claude/display-linkedin-kya-post-XQkYx`
- `claude/docs-dws-versions`
- `claude/document-cloud-environments-EK7iZ`
- `claude/document-exit-process-HmEtl`
- `claude/document-google-login-setup-VEj4Y`
- `claude/document-layering-strategy-ddhtQ`
- `claude/draft-consulting-offer-ySSeq`
- `claude/drone-detection-analysis-ygwVm`
- `claude/dws-firehorse-sales-strategy-xsHqI`
- `claude/dws-iq-e-estonia-integration-C82EQ`
- `claude/dws-iq6-compliance-platform-nzLtB`
- `claude/dws-iq6-feature-list-oviSK`
- `claude/dws6-dws7-update-doc-I2Cgk`
- `claude/dws6-missing-features-y21tw`
- `claude/dws6-pilot-setup-01MsouoNp4hdrFQxeYU6EJFY`
- `claude/dws7-roadmap-prs-AlXrD`
- `claude/dynamic-news-content-engine-3qMiz`
- `claude/e2e-test-cli-mcp-1RWJg`
- `claude/enterprise-mcp-strategy-RqxG0`
- `claude/erp-stripe-integration-YWsJa`
- `claude/esg-workshop-notes-Asjc8`
- `claude/eval-agent-harness-integration-9y6MJ`
- `claude/evaluate-github-workflows-5o2ET`
- `claude/expand-standards-knowledge-oAULz`
- `claude/extract-report-clauses-Nwor7`
- `claude/family-offices-outreach-mufFJ`
- `claude/find-climate-investors-batch-3-b1GRN`
- `claude/finish-campaign-posts-QYlR6`
- `claude/firehorse-accounting-01LYtpzNaYx6WYstaweMFUm9`
- `claude/firehorse-evaluation-fjOqr`
- `claude/firehorse-report-features-Nc9xS`
- `claude/fix-carousel-traction-slide-ZZops`
- `claude/fix-compliance-engine-EmXOv`
- `claude/fix-config-dependencies-7npjf`
- `claude/fix-investor-routing-60y5s`
- `claude/fix-phd-versioning-3-10`
- `claude/fix-product-actions-sxrml`
- `claude/fix-product-prices-btcOs`
- `claude/fix-proton-html-script-QuzSI`
- `claude/fix-react-native-cli-issue-OCQrs`
- `claude/fix-resend-integration-ZUv2r`
- `claude/fix-substance-audit-issues-LuCyM`
- `claude/fix-v1-features-wODI5-1QXGi`
- `claude/fix-worktree-conflicts-ht4ML`
- `claude/flamboyant-galileo`
- `claude/goofy-chaplygin`
- `claude/happy-dhawan`
- `claude/hardcore-allen`
- `claude/helm-upload-presentation-TCBo4`
- `claude/hubspot-ai-sales-agent-gEWKK`
- `claude/implement-aegis-e1Qtf`
- `claude/implement-dws-mvp-features-7PVas`
- `claude/implement-dws-std-007-cRAfz`
- `claude/implement-dws6-features-L8fm6`
- `claude/implement-oauth-sso-kC7uv`
- `claude/implement-v1-features-Ffi5W`
- `claude/improve-agent-memory-1IeJJ`
- `claude/improve-campaign-cta-W6618`
- `claude/improve-customer-communication-Dkj0U`
- `claude/improve-resend-dws-agents-5r0yR`
- `claude/integrate-sana-wm-H3OVE`
- `claude/investigate-dws-firehorse-4ARWp`
- `claude/investigate-missing-thesis-r1WOP`
- `claude/investigate-pro-workflow-RXClP`
- `claude/investor-materials-carousel-K3dzZ`
- `claude/investor-outreach-NBEYw`
- `claude/investor-outreach-continued-IM1GB2`
- `claude/investor-pitch-deck-01K5yLjkXepjFLTCZLLMCuRb`
- `claude/investor-research-nv29V`
- `claude/jsonld-dws10-pages-20260426`
- `claude/kya-memory-binding-RuJ0G`
- `claude/liquidity-engine-guide-P6sVY`
- `claude/litellm-supply-chain-research-nb4JA`
- `claude/llm-knowledge-base-frfcq`
- `claude/llm-thesis-foundations-nGyyb`
- `claude/maritime-partner-letter-BSSN9`
- `claude/mcp-google-cloud-run-BuSpY`
- `claude/merchant-feed-fixes-20260427`
- `claude/microsoft-oauth2-integration-vXjsQ`
- `claude/mindsdb-mcp-integration-aLn6O`
- `claude/mission-control-docs-MjkQE`
- `claude/molt-field-note-FFMhi`
- `claude/multi-agent-interoperability-HX3n9`
- `claude/multimodal-agents-setup-CgNIy`
- `claude/mvp-missing-features-kPeuQ`
- `claude/naughty-visvesvaraya`
- `claude/next-phase-consulting-Bhp7E`
- `claude/nordic-industrial-rebrand-glOfb`
- `claude/nordic-sales-strategy-1p5VB`
- `claude/nvidia-gtc-2026-notes-cYO48`
- `claude/ollama-provider-gn100`
- `claude/ontology-2-followup-S3Vgq`
- `claude/ontology-deploy-verification-Dfj8h`
- `claude/open-swe-setup-8BzzB`
- `claude/openclaw-dws6-gaps-5mP1a`
- `claude/openclaw-lab-notes-j9GQk`
- `claude/optimistic-burnell`
- `claude/org-design-ai-intelligence-exksG`
- `claude/parallel-agent-foundry-impl-dg4Bb`
- `claude/partner-network-application-Vx4KZ`
- `claude/payment-stack-integration-rfte6`
- `claude/phd-firehorse-fi-v32-updates`
- `claude/philippine-import-products-aHg7e`
- `claude/pitukri-security-audit-S5cx5`
- `claude/plan-2026-campaign-v7yTe`
- `claude/pricing-strategy-analysis-0Q6FP`
- `claude/pricing-us-cloud-starter-cIxHZ`
- `claude/quick-charts-estimation-RBsoG`
- `claude/reorganize-docs-mcp-0H5J4`
- `claude/research-eid-integration-zyuaY`
- `claude/resolve-mcp-conflicts-ebyb8`
- `claude/resolve-open-issues-dq9kD`
- `claude/review-cloudflare-vinext-L84Jb`
- `claude/review-copyright-requirements-AVOHI`
- `claude/review-development-expenses-JY6DM`
- `claude/review-drone-analysis-MUrmi`
- `claude/review-field-notes-features-VHiER`
- `claude/review-investment-decision-0zTSR`
- `claude/review-open-branches-VYytu`
- `claude/review-shufti-dpa-dugAv`
- `claude/review-thesis-plan-QVvDX`
- `claude/rovo-agents-setup-01Tw8Mj3rg96N2Hiy5VdhRCF`
- `claude/salesforce-v2-headless-api-yKPhY`
- `claude/sandbox-industrial-models-GXxbN`
- `claude/santander-ai-governance-mhd8rj`
- `claude/security-privacy-audit-vyKOE`
- `claude/security-vuln-remediation-main-20260422`
- `claude/seo-sales-agent-pipeline-7et5F`
- `claude/session-merge-20260424-135410`
- `claude/setup-claude-code-ollama-WHYgc`
- `claude/shufti-sumsub-pricing-93JeN`
- `claude/silly-zhukovsky`
- `claude/sovereign-stack-polish-v2`
- `claude/spec-kit-field-note-iXT2k`
- `claude/ssh-tunnel-dws-cli-r1RvA`
- `claude/status-report-mvp-vbug1`
- `claude/stoic-wilbur`
- `claude/store-catalog-refresh-1RWJg`
- `claude/sync-activation-csv-html-20260421`
- `claude/taiwan-chip-field-note-jvfzN`
- `claude/taxi-app-prompt-example-014TSjxeLu7j7igLRWxbxbDH`
- `claude/taxi-helsinki-contract-P9Yx7`
- `claude/tesi-investor-outreach-psIj5`
- `claude/test-onboarding-api-rbyQ0`
- `claude/themis-nav-entry-Nv8pK`
- `claude/thesis-updates-20260426-v2`
- `claude/token-usage-v1-20260426`
- `claude/tokenization-digital-currency-gxSRN`
- `claude/update-ai-ethics-playbook-ck26A`
- `claude/update-blog-announcements-IQ6Fe`
- `claude/update-docs-qwen3-coder-FFGgN`
- `claude/update-industry-registry-count-sBbcq`
- `claude/update-kya-standard-1.1-3sL7X`
- `claude/update-peachscore-notifications-CRiLN`
- `claude/update-pillar-1-messaging-2L8kD`
- `claude/update-product-specs-YsCV0`
- `claude/update-sales-docs-YKFZt`
- `claude/update-ses-limits-zxd5A`
- `claude/user-storyboard-login-R7ORm`
- `claude/vaelix-investor-brief-tgFEi`
- `claude/vinnova-sales-research-uVLRy`
- `claude/visma-erp-integration-Mz8cL`
- `claude/wire-subscriptions-notifications-sg9j3`
- `claude/youthful-liskov-3d0855`
- `claude/zealous-hofstadter`
- `claude/zealous-mcclintock`

