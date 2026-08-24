/**
 * EC3 / BuildingTransparency Integration
 *
 * Provides real EPD (Environmental Product Declaration) data from the
 * EC3 database via the openEPD REST API. Used by Material Oracle to
 * replace hardcoded emission factors with verified EPD data.
 */

export { EC3Client, createEC3Client } from './ec3-client.js';
export type {
  EC3ClientConfig,
} from './ec3-client.js';
export type {
  EC3Epd,
  EC3SearchResponse,
  EC3CategoryStats,
  NormalizedEpd,
  EC3Measurement,
  EC3GWPBreakdown,
} from './types.js';
