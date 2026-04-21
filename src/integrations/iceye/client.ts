/**
 * ICEYE SAR Satellite API Client
 *
 * Integration with ICEYE's Tasking API and Catalog API.
 * ICEYE HQ: Espoo, Finland — same ecosystem as DWS (Helsinki).
 *
 * API docs: https://www.iceye.com/sar-data/api
 * Auth: Bearer token (ICEYE_API_KEY env var)
 * ISO 27001 certified — encryption in transit and at rest.
 */

import logger from '../../utils/logger.js';
import type {
  BoundingBox,
  GeoJsonPolygon,
  IceyeCatalogItem,
  IceyeCatalogRequest,
  IceyeTaskingRequest,
  IceyeTaskingResponse,
} from './types.js';

const ICEYE_API_BASE = process.env.ICEYE_API_BASE || 'https://api.iceye.com/v1';
const ICEYE_API_KEY = process.env.ICEYE_API_KEY;

/** Convert bounding box to GeoJSON polygon */
export function bboxToPolygon(bbox: BoundingBox): GeoJsonPolygon {
  return {
    type: 'Polygon',
    coordinates: [[
      [bbox.west, bbox.south],
      [bbox.east, bbox.south],
      [bbox.east, bbox.north],
      [bbox.west, bbox.north],
      [bbox.west, bbox.south], // close ring
    ]],
  };
}

/** Calculate area of a bounding box in km² (approximate) */
export function bboxAreaKm2(bbox: BoundingBox): number {
  const latMid = (bbox.north + bbox.south) / 2;
  const kmPerDegLat = 111.32;
  const kmPerDegLon = 111.32 * Math.cos((latMid * Math.PI) / 180);
  const widthKm = Math.abs(bbox.east - bbox.west) * kmPerDegLon;
  const heightKm = Math.abs(bbox.north - bbox.south) * kmPerDegLat;
  return widthKm * heightKm;
}

export class IceyeClient {
  private apiBase: string;
  private apiKey: string | undefined;

  constructor(apiKey?: string, apiBase?: string) {
    this.apiKey = apiKey || ICEYE_API_KEY;
    this.apiBase = apiBase || ICEYE_API_BASE;
  }

  /** Check if ICEYE API is configured */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /** Submit a new satellite tasking request */
  async submitTasking(request: IceyeTaskingRequest): Promise<IceyeTaskingResponse> {
    if (!this.apiKey) {
      logger.warn('ICEYE API key not configured — returning simulated response');
      return this.simulateTaskingResponse(request);
    }

    const response = await fetch(`${this.apiBase}/tasking`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ICEYE tasking failed (${response.status}): ${error}`);
    }

    return response.json() as Promise<IceyeTaskingResponse>;
  }

  /** Check status of a tasking request */
  async getTaskingStatus(taskId: string): Promise<IceyeTaskingResponse> {
    if (!this.apiKey) {
      return {
        taskId,
        status: 'processing',
        estimatedAcquisition: new Date(Date.now() + 6 * 3600_000).toISOString(),
      };
    }

    const response = await fetch(`${this.apiBase}/tasking/${taskId}`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
    });

    if (!response.ok) {
      throw new Error(`ICEYE status check failed (${response.status})`);
    }

    return response.json() as Promise<IceyeTaskingResponse>;
  }

  /** Search ICEYE archive catalog for existing imagery */
  async searchCatalog(request: IceyeCatalogRequest): Promise<IceyeCatalogItem[]> {
    if (!this.apiKey) {
      logger.warn('ICEYE API key not configured — returning simulated catalog');
      return this.simulateCatalogResponse(request);
    }

    const response = await fetch(`${this.apiBase}/catalog/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`ICEYE catalog search failed (${response.status})`);
    }

    return response.json() as Promise<IceyeCatalogItem[]>;
  }

  // ============ SIMULATION (for development without ICEYE API key) ============

  private simulateTaskingResponse(request: IceyeTaskingRequest): IceyeTaskingResponse {
    return {
      taskId: `sim-task-${Date.now()}`,
      status: 'accepted',
      estimatedAcquisition: new Date(Date.now() + 12 * 3600_000).toISOString(),
      metadata: {
        satellite: 'ICEYE-X15',
        orbitDirection: 'ascending',
        incidenceAngle: 30,
        resolution: request.mode === 'spotlight_high' ? 0.16 : request.mode === 'spotlight' ? 0.5 : 3,
      },
    };
  }

  private simulateCatalogResponse(request: IceyeCatalogRequest): IceyeCatalogItem[] {
    // Return 3 simulated archive images over the AOI
    const baseDate = new Date(request.dateRange?.start || Date.now());
    return [1, 2, 3].map((i) => ({
      imageId: `sim-img-${Date.now()}-${i}`,
      acquisitionDate: new Date(baseDate.getTime() + i * 86400_000).toISOString(),
      satellite: `ICEYE-X${10 + i}`,
      mode: request.mode || 'stripmap' as const,
      resolution: 3,
      incidenceAngle: 25 + i * 5,
      footprint: request.aoi,
    }));
  }
}

/** Singleton ICEYE client */
export const iceyeClient = new IceyeClient();
