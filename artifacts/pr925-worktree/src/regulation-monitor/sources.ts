/**
 * Regulation Monitor — Source Configuration
 *
 * EU regulatory news sources for CBAM, CSRD, Fit for 55, etc.
 * Uses public RSS feeds, EU institution pages, and news APIs.
 */

import type { RegulatorySource } from './types.js';

export const REGULATORY_SOURCES: RegulatorySource[] = [
  // --- EU INSTITUTIONS ---
  {
    name: 'European Commission - Climate Action',
    url: 'https://ec.europa.eu/commission/presscorner/api/files/RSS?cl=en&po=CLIMA',
    type: 'rss',
    regulations: ['CBAM', 'CSRD', 'FITFOR55', 'ETS'],
  },
  {
    name: 'European Commission - Environment',
    url: 'https://ec.europa.eu/commission/presscorner/api/files/RSS?cl=en&po=ENV',
    type: 'rss',
    regulations: ['CSRD', 'GREEN_CLAIMS', 'EPBD'],
  },
  {
    name: 'European Commission - Internal Market',
    url: 'https://ec.europa.eu/commission/presscorner/api/files/RSS?cl=en&po=GROW',
    type: 'rss',
    regulations: ['EU_AI_ACT', 'GREEN_CLAIMS'],
  },
  {
    name: 'EUR-Lex Recent Acts',
    url: 'https://eur-lex.europa.eu/EN/display-feed.html?rssId=recentlyAdoptedActs',
    type: 'rss',
    regulations: ['CBAM', 'CSRD', 'FITFOR55', 'EPBD', 'EU_AI_ACT', 'ETS'],
  },

  // --- INDUSTRY NEWS ---
  {
    name: 'Carbon Pulse (Free)',
    url: 'https://carbon-pulse.com/feed/',
    type: 'rss',
    regulations: ['CBAM', 'ETS', 'FITFOR55'],
  },
  {
    name: 'Euractiv - Climate & Environment',
    url: 'https://www.euractiv.com/sections/climate-environment/feed/',
    type: 'rss',
    regulations: ['CBAM', 'CSRD', 'FITFOR55', 'EPBD', 'GREEN_CLAIMS'],
  },
  {
    name: 'Euractiv - Energy',
    url: 'https://www.euractiv.com/sections/energy/feed/',
    type: 'rss',
    regulations: ['FITFOR55', 'EPBD', 'ETS'],
  },

  // --- SUSTAINABILITY & REPORTING ---
  {
    name: 'EFRAG Updates',
    url: 'https://www.efrag.org/News?AspxAutoDetectCookieSupport=1',
    type: 'webpage',
    regulations: ['CSRD'],
  },
];

/**
 * Keywords that indicate relevance to each regulation type.
 */
export const REGULATION_KEYWORDS: Record<string, string[]> = {
  CBAM: ['cbam', 'carbon border', 'border adjustment', 'carbon import', 'carbon tax import'],
  CSRD: ['csrd', 'corporate sustainability reporting', 'sustainability reporting directive', 'esrs', 'double materiality'],
  FITFOR55: ['fit for 55', 'fitfor55', 'fit-for-55', '55% reduction', 'green deal package'],
  EPBD: ['epbd', 'energy performance building', 'building directive', 'building renovation', 'energy efficiency building'],
  EU_AI_ACT: ['eu ai act', 'artificial intelligence act', 'ai regulation eu', 'high-risk ai'],
  ETS: ['ets', 'emissions trading', 'carbon trading', 'eu ets', 'allowance', 'carbon price'],
  GREEN_CLAIMS: ['green claims', 'greenwashing', 'green claims directive', 'environmental claims'],
};
