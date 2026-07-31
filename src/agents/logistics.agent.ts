/**
 * Logistics Agent - Fleet & Supply Chain Compliance Orchestrator
 *
 * Second orchestration agent in DWS IQ 6. Manages logistics operations
 * including route optimization, fleet compliance, driver dispatch, and
 * supply chain carbon tracking for EU-regulated transport.
 *
 * Handles:
 * - Route optimization with emissions constraints (EU ETS2 transport)
 * - Fleet compliance (ADR hazmat, tachograph, roadworthiness)
 * - Driver dispatch (working time directive, CPC, ADR licenses)
 * - Kela transport coordination (Finnish social insurance patient transport)
 * - Supply chain carbon tracking (GLEC Framework, EN 16258)
 * - CBAM transport emissions for cross-border material imports
 *
 * Target customers: Posti, DB Schenker, DSV, Kela, HUS Logistics,
 *   municipal waste transport, construction material haulers (NCC, YIT fleet)
 *
 * Input: {
 *   action:       "route-optimize" | "fleet-compliance" | "driver-dispatch" |
 *                 "kela-transport" | "supply-chain-carbon" | "full-assessment"
 *   fleet?:       { vehicles: [{ id, type, euroClass, payload_kg, adr?, tachograph? }] }
 *   route?:       { origin, destination, waypoints[], cargo, urgency }
 *   drivers?:     [{ id, name, cpc_valid, adr_license?, hours_today, hours_week }]
 *   kelaOrder?:   { patientId, pickup, destination, mobilityClass, appointmentTime }
 *   materials?:   [{ name, weight_kg, origin_country, transport_mode }]
 * }
 *
 * Output: Unified logistics report with compliance status, optimized routes, and carbon data
 *
 * Tier: 2 (supervised - dispatching and compliance affect real operations)
 * Cognitive pattern: ReAct (observe fleet state → reason about constraints → act on dispatch)
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// Lazy import to avoid circular dependency
let _registry: { executeAgent: (name: string, context: AgentContext, input: Record<string, unknown>) => Promise<AgentResponse> } | null = null;
async function getRegistry() {
  if (!_registry) {
    const mod = await import('./index.js');
    _registry = mod.agentRegistry;
  }
  return _registry;
}

// ============ INPUT INTERFACES ============

interface Vehicle {
  id: string;
  type: 'truck' | 'van' | 'trailer' | 'bus' | 'ambulance' | 'special';
  euroClass: 1 | 2 | 3 | 4 | 5 | 6;
  payload_kg: number;
  adr?: boolean;
  tachograph?: 'analog' | 'digital' | 'smart2';
  lastInspection?: string;
  mileage_km?: number;
}

interface RouteRequest {
  origin: string;
  destination: string;
  waypoints?: string[];
  cargo: string;
  urgency: 'standard' | 'express' | 'critical';
  weight_kg?: number;
  adr_class?: string;
}

interface Driver {
  id: string;
  name: string;
  cpc_valid: boolean;
  adr_license?: string[];
  hours_today: number;
  hours_week: number;
  rest_hours_since_last?: number;
}

interface KelaOrder {
  patientId: string;
  pickup: string;
  destination: string;
  mobilityClass: 'walking' | 'wheelchair' | 'stretcher' | 'bariatric';
  appointmentTime: string;
  returnTrip?: boolean;
}

interface MaterialTransport {
  name: string;
  weight_kg: number;
  origin_country: string;
  transport_mode: 'road' | 'rail' | 'sea' | 'air' | 'inland_waterway';
}

interface LogisticsInput {
  action: 'route-optimize' | 'fleet-compliance' | 'driver-dispatch' | 'kela-transport' | 'supply-chain-carbon' | 'full-assessment';
  fleet?: { vehicles: Vehicle[] };
  route?: RouteRequest;
  drivers?: Driver[];
  kelaOrder?: KelaOrder;
  materials?: MaterialTransport[];
}

// ============ EU TRANSPORT COMPLIANCE ============

/** EU Driving Time Regulations (EC) No 561/2006 */
const DRIVING_TIME_LIMITS = {
  maxDailyDriving_h: 9,
  extendedDailyDriving_h: 10,
  extendedDaysPerWeek: 2,
  maxWeeklyDriving_h: 56,
  maxBiweeklyDriving_h: 90,
  minDailyRest_h: 11,
  reducedDailyRest_h: 9,
  maxContinuousDriving_h: 4.5,
  breakAfterContinuous_min: 45,
};

/** ADR hazmat classes and vehicle requirements */
const ADR_CLASSES: Record<string, string> = {
  '1': 'Explosives',
  '2': 'Gases',
  '3': 'Flammable liquids',
  '4.1': 'Flammable solids',
  '4.2': 'Spontaneously combustible',
  '4.3': 'Dangerous when wet',
  '5.1': 'Oxidizing substances',
  '5.2': 'Organic peroxides',
  '6.1': 'Toxic substances',
  '6.2': 'Infectious substances',
  '7': 'Radioactive material',
  '8': 'Corrosive substances',
  '9': 'Miscellaneous dangerous goods',
};

/** GLEC Framework emission factors (gCO2e/tonne-km) by mode and region */
const EMISSION_FACTORS: Record<string, number> = {
  road_euro6: 62,
  road_euro5: 76,
  road_euro4: 95,
  road_euro3: 112,
  road_euro_default: 80,
  rail_electric_eu: 8,
  rail_diesel_eu: 25,
  sea_container: 12,
  sea_bulk: 6,
  air_longhaul: 602,
  air_shorthaul: 1054,
  inland_waterway: 32,
};

/** Finnish Kela transport reimbursement classes */
const KELA_MOBILITY = {
  walking: { vehicleType: 'taxi', maxWait_min: 15, reimbursement_eur_km: 0.20 },
  wheelchair: { vehicleType: 'wheelchair_taxi', maxWait_min: 20, reimbursement_eur_km: 0.43 },
  stretcher: { vehicleType: 'ambulance', maxWait_min: 10, reimbursement_eur_km: 0.73 },
  bariatric: { vehicleType: 'special_transport', maxWait_min: 25, reimbursement_eur_km: 0.73 },
};

// ============ AGENT IMPLEMENTATION ============

export class LogisticsAgent extends BaseAgent {
  constructor() {
    super({
      name: 'logistics',
      description:
        'Orchestrates fleet compliance, route optimization, driver dispatch, and supply chain carbon tracking for EU-regulated logistics operations',
      capabilities: [
        'route-optimization',
        'fleet-compliance',
        'driver-dispatch',
        'kela-transport',
        'supply-chain-carbon',
        'adr-compliance',
        'tachograph-validation',
        'glec-framework',
        'en16258-transport-emissions',
      ],
      model: 'llama-3.1-70b-versatile',
      modelTier: 'standard',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input,
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    try {
      const validated = this.validateInput(input);

      let result: Record<string, unknown>;
      let reasoning: string;
      let recommendations: string[];

      switch (validated.action) {
        case 'route-optimize':
          ({ result, reasoning, recommendations } = this.runRouteOptimize(validated));
          break;
        case 'fleet-compliance':
          ({ result, reasoning, recommendations } = this.runFleetCompliance(validated));
          break;
        case 'driver-dispatch':
          ({ result, reasoning, recommendations } = this.runDriverDispatch(validated));
          break;
        case 'kela-transport':
          ({ result, reasoning, recommendations } = this.runKelaTransport(validated));
          break;
        case 'supply-chain-carbon':
          ({ result, reasoning, recommendations } = this.runSupplyChainCarbon(validated));
          break;
        case 'full-assessment':
          ({ result, reasoning, recommendations } = await this.runFullAssessment(validated, context));
          break;
        default:
          throw new Error(`Unknown action: ${validated.action}`);
      }

      // LLM enhancement
      const llmEnhancement = await this.enhanceWithLLM(validated, result);
      if (llmEnhancement) {
        recommendations.push(...llmEnhancement);
      }

      const confidence = this.calculateConfidence(validated);

      const response: AgentResponse = {
        agentName: this.config.name,
        result,
        confidence,
        reasoning,
        recommendations,
        metadata: {
          durationMs: Date.now() - startTime,
          model: this.config.model,
          action: validated.action,
        },
      };

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: response,
        status: 'completed',
        duration_ms: Date.now() - startTime,
        created_at: new Date().toISOString(),
      });

      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const durationMs = Date.now() - startTime;

      logger.error('Logistics agent failed', { agent: this.config.name, error: errorMessage });

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: null,
        status: 'error',
        error_message: errorMessage,
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });

      return {
        agentName: this.config.name,
        result: { error: errorMessage },
        confidence: 0,
        reasoning: `Logistics assessment failed: ${errorMessage}`,
        recommendations: ['Verify input format matches the expected schema'],
        metadata: { durationMs, model: this.config.model },
      };
    }
  }

  // ============ ACTION HANDLERS ============

  private runRouteOptimize(input: LogisticsInput): {
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  } {
    const route = input.route;
    if (!route) {
      throw new Error('route field required for route-optimize action');
    }

    const recommendations: string[] = [];
    const flags: string[] = [];

    // ADR routing constraints
    if (route.adr_class) {
      const adrName = ADR_CLASSES[route.adr_class] || 'Unknown';
      flags.push(`ADR Class ${route.adr_class} (${adrName}): Tunnel restrictions apply`);
      recommendations.push('Verify ADR route restrictions: tunnels (ADR categories B-E), urban zone bans, overnight parking rules');
      if (['1', '7'].includes(route.adr_class)) {
        recommendations.push(`ADR Class ${route.adr_class}: Requires police notification for route and special vehicle markings`);
      }
    }

    // Urgency-based routing
    if (route.urgency === 'critical') {
      recommendations.push('Critical urgency: Consider multimodal options (road+rail) for faster delivery with redundancy');
      flags.push('Critical shipment: Real-time GPS tracking and status updates required');
    }

    // Weight-based constraints
    if (route.weight_kg && route.weight_kg > 44000) {
      flags.push(`Total weight ${route.weight_kg}kg exceeds EU max 44t: Special transport permit required`);
      recommendations.push('Apply for erikoiskuljetuslupa (special transport permit) from ELY-keskus');
    }
    if (route.weight_kg && route.weight_kg > 76000) {
      flags.push('Weight exceeds Finnish HCT (High Capacity Transport) limit of 76t');
    }

    // Emission estimate
    const distanceEstimate_km = this.estimateDistance(route.origin, route.destination);
    const weight_t = (route.weight_kg || 10000) / 1000;
    const emissionFactor = EMISSION_FACTORS.road_euro_default;
    const emissions_kgCO2 = (distanceEstimate_km * weight_t * emissionFactor) / 1000;

    recommendations.push(`Estimated route emissions: ${emissions_kgCO2.toFixed(1)} kgCO2e (GLEC Framework). Use rail for >500km to reduce by ~70%`);

    // EU ETS2 (transport ETS starting 2027)
    recommendations.push('EU ETS2 (transport): Fuel carbon cost applies from 2027. Track fuel consumption per route for carbon accounting');

    return {
      result: {
        origin: route.origin,
        destination: route.destination,
        waypoints: route.waypoints || [],
        cargo: route.cargo,
        urgency: route.urgency,
        distanceEstimate_km: distanceEstimate_km,
        estimatedEmissions_kgCO2: Math.round(emissions_kgCO2 * 10) / 10,
        adrClass: route.adr_class || null,
        flags,
      },
      reasoning: `Route optimization ${route.origin} → ${route.destination}. Estimated ${distanceEstimate_km}km, ${emissions_kgCO2.toFixed(1)} kgCO2e. ${flags.length} constraint flag(s). ${route.adr_class ? `ADR Class ${route.adr_class} applies.` : 'No hazmat.'} Urgency: ${route.urgency}.`,
      recommendations,
    };
  }

  private runFleetCompliance(input: LogisticsInput): {
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  } {
    const fleet = input.fleet;
    if (!fleet || !fleet.vehicles.length) {
      throw new Error('fleet.vehicles required for fleet-compliance action');
    }

    const recommendations: string[] = [];
    const vehicleResults: Array<Record<string, unknown>> = [];
    let noncompliantCount = 0;

    for (const v of fleet.vehicles) {
      const issues: string[] = [];

      // Euro class check
      if (v.euroClass < 4) {
        issues.push(`Euro ${v.euroClass}: May be banned from LEZ (Low Emission Zones) in EU cities`);
      }
      if (v.euroClass < 6) {
        issues.push(`Euro ${v.euroClass}: Higher ETS2 carbon costs from 2027. Consider fleet renewal`);
      }

      // Tachograph compliance (EU 165/2014)
      if (v.type === 'truck' || v.type === 'bus') {
        if (!v.tachograph) {
          issues.push('Missing tachograph data: EU Regulation 165/2014 requires digital tachograph for vehicles >3.5t');
        } else if (v.tachograph === 'analog') {
          issues.push('Analog tachograph: Must be replaced with smart tachograph (Gen 2) by Aug 2025 for international transport');
        }
      }

      // ADR vehicle requirements
      if (v.adr) {
        issues.push('ADR vehicle: Annual ADR technical inspection required. Verify ADR certificate validity');
      }

      // Inspection check
      if (v.lastInspection) {
        const inspectionDate = new Date(v.lastInspection);
        const monthsSince = (Date.now() - inspectionDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
        if (monthsSince > 12) {
          issues.push(`Last inspection ${Math.round(monthsSince)} months ago: Annual katsastus (roadworthiness test) overdue`);
        }
      }

      if (issues.length > 0) noncompliantCount++;

      vehicleResults.push({
        id: v.id,
        type: v.type,
        euroClass: v.euroClass,
        compliant: issues.length === 0,
        issues,
      });
    }

    if (noncompliantCount > 0) {
      recommendations.push(`${noncompliantCount}/${fleet.vehicles.length} vehicles have compliance issues. Address before next dispatch`);
    }
    recommendations.push('Schedule periodic fleet compliance audit (quarterly recommended)');
    recommendations.push('Track fleet emissions via GLEC Framework for CSRD reporting');

    return {
      result: {
        totalVehicles: fleet.vehicles.length,
        compliant: fleet.vehicles.length - noncompliantCount,
        noncompliant: noncompliantCount,
        vehicles: vehicleResults,
      },
      reasoning: `Fleet compliance check: ${fleet.vehicles.length} vehicles analyzed. ${noncompliantCount} non-compliant. Issues include Euro class restrictions, tachograph compliance, and inspection status.`,
      recommendations,
    };
  }

  private runDriverDispatch(input: LogisticsInput): {
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  } {
    const drivers = input.drivers;
    if (!drivers || !drivers.length) {
      throw new Error('drivers field required for driver-dispatch action');
    }

    const recommendations: string[] = [];
    const driverResults: Array<Record<string, unknown>> = [];
    const available: string[] = [];

    for (const d of drivers) {
      const issues: string[] = [];
      let dispatchable = true;

      // CPC (Certificate of Professional Competence)
      if (!d.cpc_valid) {
        issues.push('CPC expired: Cannot drive commercially (EU Directive 2003/59/EC). Requires 35h periodic training');
        dispatchable = false;
      }

      // Daily driving hours (EC 561/2006)
      if (d.hours_today >= DRIVING_TIME_LIMITS.maxDailyDriving_h) {
        issues.push(`Daily driving ${d.hours_today}h: At or over ${DRIVING_TIME_LIMITS.maxDailyDriving_h}h limit`);
        dispatchable = false;
      } else if (d.hours_today >= DRIVING_TIME_LIMITS.maxDailyDriving_h - 1) {
        issues.push(`Daily driving ${d.hours_today}h: Less than 1h remaining today`);
      }

      // Weekly driving hours
      if (d.hours_week >= DRIVING_TIME_LIMITS.maxWeeklyDriving_h) {
        issues.push(`Weekly driving ${d.hours_week}h: At or over ${DRIVING_TIME_LIMITS.maxWeeklyDriving_h}h weekly limit`);
        dispatchable = false;
      }

      // Rest period check
      if (d.rest_hours_since_last !== undefined && d.rest_hours_since_last < DRIVING_TIME_LIMITS.minDailyRest_h) {
        if (d.rest_hours_since_last < DRIVING_TIME_LIMITS.reducedDailyRest_h) {
          issues.push(`Rest ${d.rest_hours_since_last}h: Below minimum ${DRIVING_TIME_LIMITS.reducedDailyRest_h}h reduced daily rest`);
          dispatchable = false;
        } else {
          issues.push(`Rest ${d.rest_hours_since_last}h: Reduced daily rest used (max 3 times between weekly rests)`);
        }
      }

      // ADR license check for hazmat routes
      if (input.route?.adr_class && (!d.adr_license || !d.adr_license.includes(input.route.adr_class))) {
        issues.push(`Missing ADR license for class ${input.route.adr_class}: Cannot transport this cargo`);
        dispatchable = false;
      }

      if (dispatchable) available.push(d.name);

      driverResults.push({
        id: d.id,
        name: d.name,
        dispatchable,
        remainingDailyHours: Math.max(0, DRIVING_TIME_LIMITS.maxDailyDriving_h - d.hours_today),
        remainingWeeklyHours: Math.max(0, DRIVING_TIME_LIMITS.maxWeeklyDriving_h - d.hours_week),
        issues,
      });
    }

    if (available.length === 0) {
      recommendations.push('WARNING: No drivers available for dispatch. Check driving hour resets and rest compliance');
    } else {
      recommendations.push(`${available.length} driver(s) available: ${available.join(', ')}`);
    }
    recommendations.push('Monitor tachograph data daily for EC 561/2006 compliance');

    return {
      result: {
        totalDrivers: drivers.length,
        available: available.length,
        unavailable: drivers.length - available.length,
        drivers: driverResults,
        drivingTimeLimits: DRIVING_TIME_LIMITS,
      },
      reasoning: `Driver dispatch assessment: ${drivers.length} drivers checked against EC 561/2006. ${available.length} available for dispatch, ${drivers.length - available.length} restricted (hours/rest/CPC).`,
      recommendations,
    };
  }

  private runKelaTransport(input: LogisticsInput): {
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  } {
    const order = input.kelaOrder;
    if (!order) {
      throw new Error('kelaOrder field required for kela-transport action');
    }

    const recommendations: string[] = [];
    const mobilityConfig = KELA_MOBILITY[order.mobilityClass];
    const appointmentTime = new Date(order.appointmentTime);

    // Calculate pickup time (appointment minus travel time minus wait buffer)
    const estimatedTravelMin = this.estimateDistance(order.pickup, order.destination) * 1.2; // rough min estimate
    const pickupTime = new Date(appointmentTime.getTime() - (estimatedTravelMin + mobilityConfig.maxWait_min) * 60 * 1000);

    recommendations.push(`Required vehicle: ${mobilityConfig.vehicleType} for mobility class "${order.mobilityClass}"`);
    recommendations.push(`Max wait time: ${mobilityConfig.maxWait_min} minutes (Kela standard)`);
    recommendations.push(`Reimbursement rate: EUR ${mobilityConfig.reimbursement_eur_km}/km`);

    if (order.returnTrip) {
      recommendations.push('Return trip requested: Schedule return pickup after appointment (notify driver for wait or callback)');
    }

    // Kela-specific compliance
    recommendations.push('Verify Kela transport agreement (sopimus) is valid for this service area');
    recommendations.push('Record trip details for Kela reimbursement claim (SV 67 form)');

    // Accessibility requirements
    if (order.mobilityClass === 'wheelchair' || order.mobilityClass === 'bariatric') {
      recommendations.push('Vehicle must have wheelchair ramp/lift and securing points (SFS-EN 12183)');
    }
    if (order.mobilityClass === 'stretcher') {
      recommendations.push('Stretcher transport: Trained medical transport personnel required');
    }

    return {
      result: {
        patientId: order.patientId,
        mobilityClass: order.mobilityClass,
        vehicleType: mobilityConfig.vehicleType,
        appointmentTime: order.appointmentTime,
        suggestedPickupTime: pickupTime.toISOString(),
        maxWait_min: mobilityConfig.maxWait_min,
        reimbursement_eur_km: mobilityConfig.reimbursement_eur_km,
        returnTrip: order.returnTrip || false,
        route: { pickup: order.pickup, destination: order.destination },
      },
      reasoning: `Kela transport order: ${order.mobilityClass} class, ${order.pickup} → ${order.destination}. Vehicle: ${mobilityConfig.vehicleType}. Appointment: ${order.appointmentTime}. ${order.returnTrip ? 'Return trip included.' : 'One-way trip.'}`,
      recommendations,
    };
  }

  private runSupplyChainCarbon(input: LogisticsInput): {
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  } {
    const materials = input.materials;
    if (!materials || !materials.length) {
      throw new Error('materials field required for supply-chain-carbon action');
    }

    const recommendations: string[] = [];
    let totalEmissions_kgCO2 = 0;
    const materialResults: Array<Record<string, unknown>> = [];
    const cbamMaterials: string[] = [];

    for (const m of materials) {
      const factorKey = this.getEmissionFactorKey(m.transport_mode);
      const factor = EMISSION_FACTORS[factorKey] || EMISSION_FACTORS.road_euro_default;
      const distance_km = this.estimateCountryDistance(m.origin_country);
      const emissions_kgCO2 = (distance_km * (m.weight_kg / 1000) * factor) / 1000;
      totalEmissions_kgCO2 += emissions_kgCO2;

      // CBAM check
      const cbamGoods = ['cement', 'steel', 'iron', 'aluminium', 'fertilizer', 'electricity', 'hydrogen'];
      const isCbam = cbamGoods.some((g) => m.name.toLowerCase().includes(g));
      if (isCbam && m.origin_country !== 'FI' && !this.isEUCountry(m.origin_country)) {
        cbamMaterials.push(`${m.name} from ${m.origin_country}`);
      }

      materialResults.push({
        material: m.name,
        weight_kg: m.weight_kg,
        origin: m.origin_country,
        mode: m.transport_mode,
        distance_km,
        emissionFactor_gCO2_tkm: factor,
        emissions_kgCO2: Math.round(emissions_kgCO2 * 10) / 10,
        cbamApplicable: isCbam && !this.isEUCountry(m.origin_country),
      });
    }

    if (cbamMaterials.length > 0) {
      recommendations.push(`CBAM: ${cbamMaterials.length} material(s) require CBAM certificates: ${cbamMaterials.join(', ')}`);
    }
    recommendations.push(`Total supply chain transport emissions: ${totalEmissions_kgCO2.toFixed(1)} kgCO2e (GLEC Framework / EN 16258)`);
    recommendations.push('Include transport emissions in Scope 3 Category 4 (upstream transport) for CSRD reporting');
    recommendations.push('Consider rail/sea modal shift for materials >500km to reduce transport emissions by 60-80%');

    return {
      result: {
        materialCount: materials.length,
        totalEmissions_kgCO2: Math.round(totalEmissions_kgCO2 * 10) / 10,
        cbamMaterialCount: cbamMaterials.length,
        materials: materialResults,
        methodology: 'GLEC Framework v3 / EN 16258',
      },
      reasoning: `Supply chain carbon: ${materials.length} materials analyzed. Total transport emissions: ${totalEmissions_kgCO2.toFixed(1)} kgCO2e. ${cbamMaterials.length} material(s) subject to CBAM.`,
      recommendations,
    };
  }

  private async runFullAssessment(input: LogisticsInput, context: AgentContext): Promise<{
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  }> {
    const allRecommendations: string[] = [];
    const results: Record<string, unknown> = {};

    // Local sub-assessments (always available)
    if (input.fleet) {
      const fleet = this.runFleetCompliance(input);
      results.fleet = fleet.result;
      allRecommendations.push(...fleet.recommendations);
    }

    if (input.drivers) {
      const drivers = this.runDriverDispatch(input);
      results.drivers = drivers.result;
      allRecommendations.push(...drivers.recommendations);
    }

    if (input.route) {
      const route = this.runRouteOptimize(input);
      results.route = route.result;
      allRecommendations.push(...route.recommendations);
    }

    if (input.kelaOrder) {
      const kela = this.runKelaTransport(input);
      results.kela = kela.result;
      allRecommendations.push(...kela.recommendations);
    }

    if (input.materials) {
      const carbon = this.runSupplyChainCarbon(input);
      results.supplyChain = carbon.result;
      allRecommendations.push(...carbon.recommendations);
    }

    // Delegate to sub-agents for deeper analysis (graceful fallback)
    const delegatedResults: Record<string, AgentResponse | null> = {};
    try {
      const registry = await getRegistry();
      if (registry && input.materials) {
        // Emissions data analyst for Scope 3 reporting
        await registry.executeAgent('emissions-data-analyst', context, {
          query: 'Analyze transport emissions for CSRD Scope 3 Category 4',
          data: input.materials,
        }).then(r => { delegatedResults['emissions-data-analyst'] = r; }).catch(e => {
          logger.warn('EmissionsDataAnalyst delegation failed', { error: (e as Error).message });
        });
      }
    } catch (err) {
      logger.warn('Sub-agent delegation unavailable — using local results only', {
        error: (err as Error).message,
      });
    }

    // Merge sub-agent recommendations
    for (const [agentName, response] of Object.entries(delegatedResults)) {
      if (response?.recommendations) {
        allRecommendations.push(...response.recommendations.map(r => `[${agentName}] ${r}`));
      }
    }

    const uniqueRecs = [...new Set(allRecommendations)];
    const assessmentCount = Object.keys(results).length;

    // Overall compliance score
    let complianceScore = 100;
    if (results.fleet) {
      const f = results.fleet as Record<string, unknown>;
      const noncompliant = (f.noncompliant as number) || 0;
      const total = (f.totalVehicles as number) || 1;
      complianceScore -= (noncompliant / total) * 30;
    }
    if (results.drivers) {
      const d = results.drivers as Record<string, unknown>;
      const unavail = (d.unavailable as number) || 0;
      const total = (d.totalDrivers as number) || 1;
      complianceScore -= (unavail / total) * 30;
    }
    complianceScore = Math.max(0, Math.round(complianceScore));

    const orchestrated = Object.entries(delegatedResults)
      .filter(([, r]) => r !== null)
      .map(([name, r]) => `${name} (confidence: ${r!.confidence})`);

    return {
      result: {
        assessmentType: 'full',
        sectionsAnalyzed: assessmentCount,
        overallComplianceScore: complianceScore,
        ...results,
        delegatedAgents: orchestrated,
        delegatedResults: Object.fromEntries(
          Object.entries(delegatedResults)
            .filter(([, r]) => r !== null)
            .map(([name, r]) => [name, { confidence: r!.confidence, result: r!.result }])
        ),
        recommendationCount: uniqueRecs.length,
      },
      reasoning: `Full logistics assessment: ${assessmentCount} section(s) analyzed. Overall compliance score: ${complianceScore}/100. ${orchestrated.length} sub-agents delegated. ${uniqueRecs.length} recommendations generated.`,
      recommendations: uniqueRecs,
    };
  }

  // ============ HELPERS ============

  private validateInput(input: Record<string, unknown>): LogisticsInput {
    const actions = ['route-optimize', 'fleet-compliance', 'driver-dispatch', 'kela-transport', 'supply-chain-carbon', 'full-assessment'];
    if (!actions.includes(input.action as string)) {
      throw new Error(`action must be one of: ${actions.join(', ')}`);
    }
    return {
      action: input.action as LogisticsInput['action'],
      fleet: input.fleet as LogisticsInput['fleet'],
      route: input.route as LogisticsInput['route'],
      drivers: input.drivers as Driver[],
      kelaOrder: input.kelaOrder as KelaOrder,
      materials: input.materials as MaterialTransport[],
    };
  }

  /** Rough distance estimate when no geocoding available */
  private estimateDistance(origin: string, destination: string): number {
    // Finland city pair distances (major logistics corridors)
    const corridors: Record<string, number> = {
      'helsinki-tampere': 180,
      'helsinki-turku': 165,
      'helsinki-oulu': 610,
      'helsinki-jyväskylä': 270,
      'helsinki-kuopio': 390,
      'helsinki-rovaniemi': 830,
      'tampere-oulu': 480,
      'tampere-turku': 160,
      'turku-oulu': 590,
    };

    const key1 = `${origin.toLowerCase()}-${destination.toLowerCase()}`;
    const key2 = `${destination.toLowerCase()}-${origin.toLowerCase()}`;
    return corridors[key1] || corridors[key2] || 300; // default 300km
  }

  /** Rough EU country distances from Finland */
  private estimateCountryDistance(country: string): number {
    const distances: Record<string, number> = {
      FI: 200, SE: 600, NO: 800, DK: 1200, EE: 400,
      LV: 600, LT: 800, PL: 1200, DE: 1800, NL: 2000,
      BE: 2100, FR: 2500, ES: 3500, IT: 2800, AT: 2200,
      CZ: 1800, UK: 2200, CN: 8000, IN: 7000, US: 8500,
      TR: 3200, RU: 1000, BR: 11000,
    };
    return distances[country.toUpperCase()] || 3000;
  }

  private isEUCountry(country: string): boolean {
    const eu = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
    return eu.includes(country.toUpperCase());
  }

  private getEmissionFactorKey(mode: string): string {
    const map: Record<string, string> = {
      road: 'road_euro_default',
      rail: 'rail_electric_eu',
      sea: 'sea_container',
      air: 'air_longhaul',
      inland_waterway: 'inland_waterway',
    };
    return map[mode] || 'road_euro_default';
  }

  private async enhanceWithLLM(input: LogisticsInput, result: Record<string, unknown>): Promise<string[] | null> {
    const prompt = [
      `You are a Finnish/EU logistics compliance expert.`,
      `Action: ${input.action}`,
      `Current findings: ${JSON.stringify(result).slice(0, 500)}`,
      ``,
      `Provide 2-3 additional recommendations as JSON: {"recommendations": ["...", "..."]}`,
    ].join('\n');

    const llm = await this.callLLM(prompt);
    try {
      const parsed = JSON.parse(llm.content);
      return Array.isArray(parsed.recommendations) ? parsed.recommendations : null;
    } catch {
      return null;
    }
  }

  private calculateConfidence(input: LogisticsInput): number {
    let confidence = 0.7;
    if (input.fleet) confidence += 0.05;
    if (input.drivers) confidence += 0.05;
    if (input.route) confidence += 0.05;
    if (input.materials) confidence += 0.05;
    if (input.action === 'full-assessment') confidence += 0.1;
    return Math.max(0, Math.min(1, confidence));
  }
}
