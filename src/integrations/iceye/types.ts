/**
 * ICEYE SAR Satellite Integration — Type Definitions
 *
 * ICEYE (Helsinki, Finland) operates the world's largest SAR constellation.
 * SAR = Synthetic Aperture Radar — sees through clouds, darkness, rain.
 * Resolution: down to 16cm (Gen4), scenes up to 120,000 km².
 *
 * API: Tasking API (satellite commands) + Catalog API (archive imagery)
 * Auth: OAuth2 Bearer token (ICEYE_API_KEY)
 * Delivery: GeoTIFF, SICD, SLC — standard geospatial formats
 */

// ============ ICEYE API TYPES ============

/** ICEYE SAR imaging modes */
export type IceyeImagingMode =
  | 'spotlight'      // Highest resolution (< 1m), small area
  | 'stripmap'       // Medium resolution (~3m), corridor coverage
  | 'scan'           // Wide area (~15m resolution), up to 120,000 km²
  | 'spotlight_high'; // Gen4 ultra-high resolution (16cm)

/** ICEYE product types */
export type IceyeProductType =
  | 'SLC'            // Single Look Complex — full phase + amplitude
  | 'GRD'            // Ground Range Detected — amplitude only, georeferenced
  | 'ORTHO';         // Orthorectified — terrain-corrected, map-ready

/** Tasking request to ICEYE API */
export interface IceyeTaskingRequest {
  /** Area of interest as GeoJSON polygon */
  aoi: GeoJsonPolygon;
  /** Imaging mode */
  mode: IceyeImagingMode;
  /** Product type */
  productType: IceyeProductType;
  /** Earliest acquisition time (ISO 8601) */
  windowStart: string;
  /** Latest acquisition time (ISO 8601) */
  windowEnd: string;
  /** Look direction preference */
  lookDirection?: 'left' | 'right' | 'any';
  /** Minimum incidence angle (degrees) */
  minIncidenceAngle?: number;
  /** Maximum incidence angle (degrees) */
  maxIncidenceAngle?: number;
}

/** ICEYE tasking response */
export interface IceyeTaskingResponse {
  taskId: string;
  status: 'accepted' | 'scheduled' | 'acquired' | 'processing' | 'delivered' | 'failed';
  estimatedAcquisition?: string;
  deliveryUrl?: string;
  metadata?: {
    satellite: string;
    orbitDirection: 'ascending' | 'descending';
    incidenceAngle: number;
    resolution: number; // meters
  };
}

/** ICEYE catalog search request */
export interface IceyeCatalogRequest {
  aoi: GeoJsonPolygon;
  dateRange: {
    start: string; // ISO 8601
    end: string;
  };
  mode?: IceyeImagingMode;
  maxResults?: number;
}

/** ICEYE catalog item */
export interface IceyeCatalogItem {
  imageId: string;
  acquisitionDate: string;
  satellite: string;
  mode: IceyeImagingMode;
  resolution: number;
  incidenceAngle: number;
  footprint: GeoJsonPolygon;
  thumbnailUrl?: string;
  downloadUrl?: string;
}

// ============ GEOSPATIAL TYPES ============

export interface GeoJsonPolygon {
  type: 'Polygon';
  coordinates: number[][][]; // [[[lon, lat], [lon, lat], ...]]
}

export interface GeoJsonPoint {
  type: 'Point';
  coordinates: [number, number]; // [lon, lat]
}

export interface BoundingBox {
  west: number;
  south: number;
  east: number;
  north: number;
}

// ============ ORBITAL TARGET LABELING TYPES ============

/** The 20 DWS industries — orbital observation targets */
export type DwsIndustry =
  // Tier 1: Critical Emissions (ETS + CBAM Direct)
  | 'power-heat-generation'
  | 'iron-steel'
  | 'cement-lime'
  | 'chemicals-petrochemicals'
  | 'aviation'
  | 'maritime-shipping'
  | 'road-transport-logistics'
  | 'construction-buildings'
  // Tier 2: Important Emissions (ESR + Indirect ETS)
  | 'agriculture-livestock'
  | 'waste-management-recycling'
  | 'aluminium'
  | 'pulp-paper-printing'
  | 'petroleum-refining'
  | 'food-beverage'
  | 'glass-ceramics'
  | 'mining-quarrying'
  // Tier 3: Wedge Industries (High Agent Density)
  | 'fintech-trading'
  | 'pharma-biotech'
  | 'cybersecurity'
  | 'healthcare-medtech';

/** SAR signature pattern for industry detection */
export interface SarSignaturePattern {
  /** Industry this signature identifies */
  industry: DwsIndustry;
  /** Human-readable label */
  label: string;
  /** SAR backscatter characteristics */
  backscatterProfile: {
    /** Expected intensity range (dB) */
    intensityRange: [number, number];
    /** Texture descriptor */
    texture: 'smooth' | 'rough' | 'mixed' | 'metallic' | 'urban' | 'vegetation';
    /** Temporal change signature */
    changeRate: 'static' | 'slow' | 'dynamic' | 'rapid';
  };
  /** Physical target descriptors */
  targetFeatures: string[];
  /** Confidence threshold for positive classification */
  minConfidence: number;
}

/** A labeled target detected from orbital SAR imagery */
export interface OrbitalTarget {
  /** Unique target identifier */
  targetId: string;
  /** Detected industry classification */
  industry: DwsIndustry;
  /** Classification confidence 0.0–1.0 */
  confidence: number;
  /** Geographic center of target */
  location: GeoJsonPoint;
  /** Target boundary polygon */
  footprint: GeoJsonPolygon;
  /** Area in square meters */
  areaSqM: number;
  /** Human-readable description */
  description: string;
  /** SAR-derived attributes */
  sarAttributes: {
    /** Mean backscatter intensity (dB) */
    meanIntensity: number;
    /** Detected change since last acquisition */
    changeDetected: boolean;
    /** Change magnitude (0.0–1.0) */
    changeMagnitude: number;
    /** Temporal coherence (for InSAR) */
    coherence?: number;
  };
  /** Source imagery metadata */
  sourceImage: {
    imageId: string;
    acquisitionDate: string;
    satellite: string;
    resolution: number;
  };
  /** KYA governance metadata */
  kyaGovernance: {
    /** Agent that performed the labeling */
    labelingAgentId: string;
    /** KYA trust score of the labeling agent */
    agentKyaScore: number;
    /** Whether human review is required */
    humanReviewRequired: boolean;
    /** Firehorse audit trail reference */
    firehorseTraceId: string;
  };
}

/** Orbital scan request — input to the Argus agent */
export interface OrbitalScanRequest {
  /** Area of interest */
  aoi: GeoJsonPolygon | BoundingBox;
  /** Filter to specific industries (empty = detect all 20) */
  industries?: DwsIndustry[];
  /** Date range for imagery */
  dateRange?: {
    start: string;
    end: string;
  };
  /** Use archive imagery (catalog) or request new acquisition (tasking) */
  acquisitionMode: 'catalog' | 'tasking' | 'both';
  /** Minimum resolution in meters */
  minResolution?: number;
  /** Enable change detection against previous scan */
  changeDetection?: boolean;
  /** Previous scan ID for change detection baseline */
  baselineScanId?: string;
}

/** Orbital scan result — output from the Argus agent */
export interface OrbitalScanResult {
  /** Unique scan identifier */
  scanId: string;
  /** Timestamp of scan completion */
  completedAt: string;
  /** Total area scanned (km²) */
  areaScanedKm2: number;
  /** Number of SAR images processed */
  imagesProcessed: number;
  /** All detected targets */
  targets: OrbitalTarget[];
  /** Summary by industry */
  industrySummary: {
    industry: DwsIndustry;
    targetCount: number;
    avgConfidence: number;
    totalAreaSqM: number;
  }[];
  /** Change detection results (if enabled) */
  changes?: {
    newTargets: number;
    removedTargets: number;
    modifiedTargets: number;
    significantChanges: OrbitalTarget[];
  };
  /** Processing metadata */
  metadata: {
    processingTimeMs: number;
    modelUsed: string;
    kyaGovernanceApplied: boolean;
  };
}
