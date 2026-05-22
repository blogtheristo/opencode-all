# Phase 04: Tool Architecture
## DWS IQ 6 Agent Architecture

**Phase:** 04 of 10  
**Status:** Tool Design  
**Dependencies:** Phase 01, Phase 02, Phase 03  
**Output:** MCP server specifications, tool schemas, security configuration

---

## 4.1 Tool Architecture Overview

Tools bridge the gap between agent reasoning and real-world actions. DWS IQ 6 uses the Model Context Protocol (MCP) as the standardized interface for all tool interactions.

### Tool Categories

```
┌─────────────────────────────────────────────────────────────────┐
│                    TOOL ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EXTENSIONS (Agent-side execution)                              │
│  ├── Real-time data queries                                    │
│  ├── External API calls                                        │
│  └── Computed responses                                        │
│  Examples: Google Search, route calculation, weather           │
│                                                                 │
│  FUNCTIONS (Client-side execution)                             │
│  ├── Sensitive operations                                      │
│  ├── Proprietary systems                                       │
│  └── Security-critical actions                                 │
│  Examples: Payment processing, permit submission               │
│                                                                 │
│  DATA STORES (RAG/Retrieval)                                   │
│  ├── Domain knowledge                                          │
│  ├── Regulatory documents                                      │
│  └── Customer-specific data                                    │
│  Examples: Compliance regulations, product catalogs            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4.2 MCP Server Architecture

### Server Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                    MCP SERVER TOPOLOGY                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              MCP GATEWAY (Cloud Run)                    │   │
│  │  - Authentication (OAuth 2.1)                           │   │
│  │  - Rate limiting                                        │   │
│  │  - Request routing                                      │   │
│  │  - Audit logging                                        │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                            │                                    │
│            ┌───────────────┼───────────────┐                   │
│            │               │               │                    │
│            ▼               ▼               ▼                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │  LOGISTICS   │ │ CONSTRUCTION │ │  COMPLIANCE  │           │
│  │  MCP SERVER  │ │  MCP SERVER  │ │  MCP SERVER  │           │
│  ├──────────────┤ ├──────────────┤ ├──────────────┤           │
│  │ • Kela API   │ │ • YTJ API    │ │ • EUR-Lex    │           │
│  │ • Route Opt  │ │ • Traficom   │ │ • Finlex     │           │
│  │ • Driver Mgmt│ │ • Permit Sys │ │ • ISO Docs   │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│            │               │               │                    │
│            └───────────────┼───────────────┘                   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              EDGE MCP SERVER (Jetson)                   │   │
│  │  - Local inference                                      │   │
│  │  - Sensor data processing                               │   │
│  │  - Offline capability                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4.3 Logistics MCP Server

### Server Implementation

```python
"""
mcp_servers/logistics_server.py
MCP Server for Logistics Operations
"""
from mcp.server.fastmcp import FastMCP
from mcp.server.models import Tool, TextContent
import httpx
from typing import Optional
import os

# Initialize FastMCP server
mcp = FastMCP("DWS Logistics Server")

# Kela Transport API client
KELA_API_BASE = os.environ.get("KELA_API_BASE", "https://api.kela.fi/transport/v1")
KELA_API_KEY = os.environ.get("KELA_API_KEY")

@mcp.tool()
async def query_kela_transport(
    customer_ssn: str,
    date_from: str,
    date_to: str,
    trip_type: Optional[str] = "all"
) -> str:
    """
    Query Kela transport API for eligible healthcare transport trips.
    
    Args:
        customer_ssn: Finnish social security number (format: DDMMYY-XXXX)
        date_from: Start date for trip search (ISO 8601)
        date_to: End date for trip search (ISO 8601)
        trip_type: Type of trip - 'all', 'hospital', 'rehabilitation', 'dialysis'
    
    Returns:
        JSON string with eligible trips and reimbursement details
    
    Note: Requires Kela API authorization. PII data handling per GDPR.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{KELA_API_BASE}/trips",
            params={
                "ssn": customer_ssn,
                "from": date_from,
                "to": date_to,
                "type": trip_type
            },
            headers={
                "Authorization": f"Bearer {KELA_API_KEY}",
                "X-Request-ID": str(uuid.uuid4())
            },
            timeout=30.0
        )
        
        if response.status_code == 200:
            return response.text
        else:
            return f"Error querying Kela API: {response.status_code}"

@mcp.tool()
async def optimize_route(
    origin_lat: float,
    origin_lon: float,
    destination_lat: float,
    destination_lon: float,
    vehicle_type: str = "car",
    avoid_tolls: bool = False,
    departure_time: Optional[str] = None
) -> str:
    """
    Calculate optimal route between two points.
    
    Args:
        origin_lat: Origin latitude
        origin_lon: Origin longitude
        destination_lat: Destination latitude
        destination_lon: Destination longitude
        vehicle_type: 'car', 'van', 'truck', 'wheelchair_accessible'
        avoid_tolls: Whether to avoid toll roads
        departure_time: Departure time for traffic consideration (ISO 8601)
    
    Returns:
        JSON with route details, distance, duration, and turn-by-turn directions
    """
    # Use Google Maps / HERE / OpenRouteService API
    routing_api = os.environ.get("ROUTING_API_URL")
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{routing_api}/route",
            json={
                "origin": {"lat": origin_lat, "lon": origin_lon},
                "destination": {"lat": destination_lat, "lon": destination_lon},
                "mode": vehicle_type,
                "avoid": ["tolls"] if avoid_tolls else [],
                "departure_time": departure_time
            },
            timeout=15.0
        )
        
        return response.text

@mcp.tool()
async def check_driver_availability(
    region: str,
    date: str,
    time_window_start: str,
    time_window_end: str,
    vehicle_requirements: Optional[list[str]] = None
) -> str:
    """
    Check available drivers for a given time window and region.
    
    Args:
        region: Region code (e.g., 'HEL', 'ESP', 'TKU')
        date: Date for availability check (ISO 8601)
        time_window_start: Start of time window (HH:MM)
        time_window_end: End of time window (HH:MM)
        vehicle_requirements: Required vehicle features (e.g., ['wheelchair', 'stretcher'])
    
    Returns:
        JSON array of available drivers with their details and ratings
    """
    # Query internal driver management system
    # This would typically hit a Supabase or internal API
    
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
    
    async with httpx.AsyncClient() as client:
        # PostgREST query
        query = f"""
        select=*&region=eq.{region}&available_date=eq.{date}
        &available_start=lte.{time_window_start}
        &available_end=gte.{time_window_end}
        """
        
        if vehicle_requirements:
            for req in vehicle_requirements:
                query += f"&vehicle_features=cs.{{{req}}}"
        
        response = await client.get(
            f"{supabase_url}/rest/v1/drivers?{query}",
            headers={
                "apikey": supabase_key,
                "Authorization": f"Bearer {supabase_key}"
            }
        )
        
        return response.text

@mcp.tool()
async def dispatch_driver(
    driver_id: str,
    trip_id: str,
    pickup_time: str,
    pickup_location: str,
    destination: str,
    passenger_notes: Optional[str] = None
) -> str:
    """
    Dispatch a driver for a specific trip.
    
    ⚠️ TIER 2 ACTION: This modifies operational state.
    
    Args:
        driver_id: Unique driver identifier
        trip_id: Unique trip identifier
        pickup_time: Scheduled pickup time (ISO 8601)
        pickup_location: Full address of pickup point
        destination: Full address of destination
        passenger_notes: Special instructions for the driver
    
    Returns:
        Confirmation with dispatch ID and estimated arrival
    """
    # Create dispatch record
    dispatch_data = {
        "driver_id": driver_id,
        "trip_id": trip_id,
        "pickup_time": pickup_time,
        "pickup_location": pickup_location,
        "destination": destination,
        "passenger_notes": passenger_notes,
        "status": "dispatched",
        "dispatched_at": datetime.utcnow().isoformat()
    }
    
    # Store in Supabase
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{supabase_url}/rest/v1/dispatches",
            json=dispatch_data,
            headers={
                "apikey": supabase_key,
                "Authorization": f"Bearer {supabase_key}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
        )
        
        if response.status_code == 201:
            # Notify driver via push notification
            await notify_driver(driver_id, dispatch_data)
            return response.text
        else:
            return f"Dispatch failed: {response.status_code}"

@mcp.tool()
async def calculate_trip_cost(
    distance_km: float,
    duration_minutes: int,
    vehicle_type: str,
    is_kela_reimbursable: bool = False,
    time_of_day: str = "standard"
) -> str:
    """
    Calculate estimated trip cost with breakdown.
    
    Args:
        distance_km: Trip distance in kilometers
        duration_minutes: Estimated trip duration
        vehicle_type: Type of vehicle
        is_kela_reimbursable: Whether Kela reimbursement applies
        time_of_day: 'standard', 'evening', 'night', 'weekend'
    
    Returns:
        JSON with cost breakdown, taxes, and reimbursement details
    """
    # Pricing tiers
    BASE_RATES = {
        "car": 1.20,
        "van": 1.50,
        "wheelchair_accessible": 1.80,
        "stretcher": 2.20
    }
    
    TIME_MULTIPLIERS = {
        "standard": 1.0,
        "evening": 1.2,  # After 18:00
        "night": 1.5,     # After 22:00
        "weekend": 1.3
    }
    
    base_rate = BASE_RATES.get(vehicle_type, 1.20)
    multiplier = TIME_MULTIPLIERS.get(time_of_day, 1.0)
    
    base_cost = distance_km * base_rate * multiplier
    waiting_cost = max(0, (duration_minutes - 30) * 0.50)  # Waiting after 30 min
    subtotal = base_cost + waiting_cost
    vat = subtotal * 0.24  # Finnish VAT
    total = subtotal + vat
    
    result = {
        "distance_km": distance_km,
        "base_cost": round(base_cost, 2),
        "waiting_cost": round(waiting_cost, 2),
        "subtotal": round(subtotal, 2),
        "vat_24_percent": round(vat, 2),
        "total": round(total, 2),
        "currency": "EUR"
    }
    
    if is_kela_reimbursable:
        # Kela reimburses up to €0.20/km
        kela_reimbursement = min(distance_km * 0.20, subtotal)
        result["kela_reimbursement"] = round(kela_reimbursement, 2)
        result["customer_pays"] = round(total - kela_reimbursement, 2)
    
    return json.dumps(result, indent=2)

# Resource: Pricing documentation
@mcp.resource("pricing://current")
async def get_current_pricing():
    """Get current pricing structure for all vehicle types."""
    return {
        "base_rates": BASE_RATES,
        "time_multipliers": TIME_MULTIPLIERS,
        "vat_rate": 0.24,
        "kela_max_reimbursement_per_km": 0.20,
        "effective_date": "2024-01-01",
        "currency": "EUR"
    }

# Run server
if __name__ == "__main__":
    mcp.run(transport="stdio")
```

---

## 4.4 Construction MCP Server

### Server Implementation

```python
"""
mcp_servers/construction_server.py
MCP Server for Construction Compliance Operations
"""
from mcp.server.fastmcp import FastMCP
import httpx
import xmltodict
from typing import Optional

mcp = FastMCP("DWS Construction Server")

# Finnish API endpoints
YTJ_API_BASE = "https://avoindata.prh.fi/bis/v1"
TRAFICOM_API_BASE = os.environ.get("TRAFICOM_API_BASE")

@mcp.tool()
async def verify_company_ytj(
    business_id: str
) -> str:
    """
    Verify company registration and status from YTJ (Finnish Business Information System).
    
    Args:
        business_id: Finnish business ID (Y-tunnus, format: 1234567-8)
    
    Returns:
        JSON with company details including name, status, registration date,
        registered addresses, and industry codes (TOL)
    
    Note: This is public data from PRH (Finnish Patent and Registration Office)
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{YTJ_API_BASE}/{business_id}",
            timeout=15.0
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # Extract relevant fields
            company = data.get("results", [{}])[0]
            
            return json.dumps({
                "business_id": company.get("businessId"),
                "name": company.get("name"),
                "registration_date": company.get("registrationDate"),
                "company_form": company.get("companyForm"),
                "status": "active" if company.get("liquidations") is None else "liquidation",
                "industry_codes": company.get("businessLines", []),
                "addresses": company.get("addresses", []),
                "website": company.get("website")
            }, indent=2)
        
        elif response.status_code == 404:
            return json.dumps({"error": "Business ID not found", "valid": False})
        else:
            return json.dumps({"error": f"YTJ API error: {response.status_code}"})

@mcp.tool()
async def check_vat_registration(
    business_id: str
) -> str:
    """
    Check VAT registration status for a Finnish company.
    
    Args:
        business_id: Finnish business ID
    
    Returns:
        JSON with VAT number and registration status
    """
    # Finnish VAT number is FI + business_id without hyphen
    vat_number = f"FI{business_id.replace('-', '')}"
    
    # VIES (VAT Information Exchange System) check
    vies_url = "https://ec.europa.eu/taxation_customs/vies/services/checkVatService"
    
    soap_request = f"""
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                      xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
       <soapenv:Header/>
       <soapenv:Body>
          <urn:checkVat>
             <urn:countryCode>FI</urn:countryCode>
             <urn:vatNumber>{business_id.replace('-', '')}</urn:vatNumber>
          </urn:checkVat>
       </soapenv:Body>
    </soapenv:Envelope>
    """
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            vies_url,
            content=soap_request,
            headers={"Content-Type": "text/xml"},
            timeout=20.0
        )
        
        result = xmltodict.parse(response.text)
        
        # Extract validation result
        body = result.get("soap:Envelope", {}).get("soap:Body", {})
        check_vat_response = body.get("checkVatResponse", {})
        
        return json.dumps({
            "vat_number": vat_number,
            "valid": check_vat_response.get("valid") == "true",
            "company_name": check_vat_response.get("name"),
            "address": check_vat_response.get("address"),
            "request_date": datetime.utcnow().isoformat()
        }, indent=2)

@mcp.tool()
async def verify_tilaajavastuu(
    business_id: str
) -> str:
    """
    Check Tilaajavastuu (Contractor's Obligations) compliance status.
    
    This verifies that a company meets the requirements under the
    Finnish Act on the Contractor's Obligations and Liability (1233/2006).
    
    Args:
        business_id: Finnish business ID
    
    Returns:
        JSON with compliance status including:
        - Tax payment status
        - Pension insurance (TyEL) status
        - Trade register status
        - Collective agreement status
        - Accident insurance status
    
    Note: Requires Tilaajavastuu/Vastuu Group API access
    """
    tilaajavastuu_api = os.environ.get("TILAAJAVASTUU_API_URL")
    tilaajavastuu_key = os.environ.get("TILAAJAVASTUU_API_KEY")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{tilaajavastuu_api}/companies/{business_id}/status",
            headers={"X-API-Key": tilaajavastuu_key},
            timeout=15.0
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # Determine overall compliance
            checks = [
                data.get("tax_status", {}).get("compliant"),
                data.get("pension_insurance", {}).get("compliant"),
                data.get("trade_register", {}).get("active"),
                data.get("accident_insurance", {}).get("valid")
            ]
            
            overall_compliant = all(checks)
            
            return json.dumps({
                "business_id": business_id,
                "overall_compliant": overall_compliant,
                "tax_status": data.get("tax_status"),
                "pension_insurance": data.get("pension_insurance"),
                "trade_register_status": data.get("trade_register"),
                "collective_agreement": data.get("collective_agreement"),
                "accident_insurance": data.get("accident_insurance"),
                "last_updated": data.get("last_updated"),
                "report_url": data.get("report_url")
            }, indent=2)
        
        else:
            return json.dumps({
                "error": "Failed to retrieve Tilaajavastuu status",
                "business_id": business_id
            })

@mcp.tool()
async def check_building_permit_status(
    permit_id: str,
    municipality: str
) -> str:
    """
    Check status of a building permit application.
    
    Args:
        permit_id: Building permit application ID
        municipality: Municipality code or name
    
    Returns:
        JSON with permit status, conditions, and timeline
    
    Note: Connects to Lupapiste or municipal systems via integration
    """
    lupapiste_api = os.environ.get("LUPAPISTE_API_URL")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{lupapiste_api}/permits/{permit_id}",
            params={"municipality": municipality},
            timeout=20.0
        )
        
        if response.status_code == 200:
            return response.text
        else:
            return json.dumps({
                "error": "Permit not found or access denied",
                "permit_id": permit_id,
                "municipality": municipality
            })

@mcp.tool()
async def search_subcontractor_history(
    business_id: str,
    project_types: Optional[list[str]] = None
) -> str:
    """
    Search for subcontractor's project history and ratings.
    
    Args:
        business_id: Subcontractor's Finnish business ID
        project_types: Filter by project types (e.g., ['residential', 'commercial'])
    
    Returns:
        JSON with project history, client ratings, and compliance history
    
    Note: Data sourced from internal DWS database and public records
    """
    # Query internal database
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
    
    async with httpx.AsyncClient() as client:
        query = f"business_id=eq.{business_id}"
        
        if project_types:
            type_filter = ",".join(project_types)
            query += f"&project_type=in.({type_filter})"
        
        response = await client.get(
            f"{supabase_url}/rest/v1/subcontractor_projects?{query}&order=completed_at.desc&limit=20",
            headers={
                "apikey": supabase_key,
                "Authorization": f"Bearer {supabase_key}"
            }
        )
        
        projects = response.json()
        
        # Calculate aggregated metrics
        if projects:
            avg_rating = sum(p.get("client_rating", 0) for p in projects) / len(projects)
            on_time_rate = sum(1 for p in projects if p.get("completed_on_time")) / len(projects)
            
            return json.dumps({
                "business_id": business_id,
                "total_projects": len(projects),
                "average_rating": round(avg_rating, 2),
                "on_time_completion_rate": round(on_time_rate * 100, 1),
                "recent_projects": projects[:5],
                "compliance_issues": [p for p in projects if p.get("compliance_issue")]
            }, indent=2)
        
        return json.dumps({
            "business_id": business_id,
            "total_projects": 0,
            "message": "No project history found"
        })

# Prompt template for construction compliance
@mcp.prompt()
async def construction_compliance_check():
    """Standard prompt for construction compliance verification."""
    return """
    When verifying a construction subcontractor, always check:
    
    1. YTJ registration status - Company must be active
    2. VAT registration - Required for B2B transactions
    3. Tilaajavastuu compliance - All five areas must be compliant:
       - Tax payments
       - Pension insurance (TyEL)
       - Trade register
       - Collective agreement
       - Accident insurance
    4. Project history - Look for patterns of issues
    
    For NCC and T2H projects, additional requirements:
    - ISO 45001 certification for safety
    - Environmental compliance certification
    - Valid insurance with minimum €5M coverage
    
    Flag any company with:
    - Less than 2 years in business
    - Tax arrears
    - Missing insurance
    - Multiple compliance issues in history
    """

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

---

## 4.5 Compliance RAG MCP Server

### Server Implementation

```python
"""
mcp_servers/compliance_rag_server.py
MCP Server for Compliance Document Retrieval (RAG)
"""
from mcp.server.fastmcp import FastMCP
from typing import Optional
import httpx

mcp = FastMCP("DWS Compliance RAG Server")

# Supabase pgVector connection
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
EMBEDDING_MODEL = "text-embedding-3-small"

@mcp.tool()
async def search_regulations(
    query: str,
    regulation_types: Optional[list[str]] = None,
    jurisdiction: str = "EU",
    max_results: int = 5
) -> str:
    """
    Search regulatory documents using semantic similarity.
    
    Args:
        query: Natural language search query
        regulation_types: Filter by types - ['NIS2', 'GDPR', 'ISO27001', 'eIDAS', 'national']
        jurisdiction: 'EU', 'FI', 'all'
        max_results: Maximum number of results to return
    
    Returns:
        JSON array of relevant document chunks with metadata and sources
    """
    # Generate embedding for query
    embedding = await generate_embedding(query)
    
    # Build filter
    filters = []
    if regulation_types:
        filters.append(f"regulation_type=in.({','.join(regulation_types)})")
    if jurisdiction != "all":
        filters.append(f"jurisdiction=eq.{jurisdiction}")
    
    filter_string = "&".join(filters) if filters else ""
    
    # Query Supabase with vector similarity
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SUPABASE_URL}/rest/v1/rpc/match_regulations",
            json={
                "query_embedding": embedding,
                "match_count": max_results,
                "filter": filter_string
            },
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json"
            }
        )
        
        results = response.json()
        
        # Format results
        formatted = []
        for r in results:
            formatted.append({
                "content": r["content"],
                "regulation": r["regulation_name"],
                "article": r["article_number"],
                "section": r["section_title"],
                "similarity": round(r["similarity"], 4),
                "source_url": r["source_url"],
                "last_updated": r["last_updated"]
            })
        
        return json.dumps(formatted, indent=2)

@mcp.tool()
async def get_regulation_article(
    regulation: str,
    article_number: str
) -> str:
    """
    Retrieve full text of a specific regulation article.
    
    Args:
        regulation: Regulation name (e.g., 'GDPR', 'NIS2')
        article_number: Article number (e.g., '32', '6.1')
    
    Returns:
        JSON with full article text, recitals, and related articles
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/regulation_articles",
            params={
                "regulation_name": f"eq.{regulation}",
                "article_number": f"eq.{article_number}",
                "select": "*,recitals(*),related_articles(*)"
            },
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}"
            }
        )
        
        return response.text

@mcp.tool()
async def check_compliance_requirements(
    industry: str,
    company_size: str,
    data_types: list[str]
) -> str:
    """
    Get applicable compliance requirements for a company profile.
    
    Args:
        industry: Industry sector (e.g., 'logistics', 'healthcare', 'construction')
        company_size: 'micro', 'small', 'medium', 'large', 'enterprise'
        data_types: Types of data processed (e.g., ['personal', 'health', 'financial'])
    
    Returns:
        JSON with applicable regulations, required certifications, and deadlines
    """
    # Determine applicable regulations based on profile
    requirements = {
        "mandatory_regulations": [],
        "recommended_certifications": [],
        "deadlines": [],
        "notes": []
    }
    
    # GDPR applies to all processing personal data
    if "personal" in data_types or "health" in data_types:
        requirements["mandatory_regulations"].append({
            "name": "GDPR",
            "full_name": "General Data Protection Regulation (EU) 2016/679",
            "key_articles": ["6 (Lawful basis)", "32 (Security)", "33 (Breach notification)"],
            "applies_because": "Processing personal data"
        })
    
    # NIS2 for critical sectors
    nis2_sectors = ["energy", "transport", "health", "digital_infrastructure", 
                    "public_administration", "space"]
    if industry in nis2_sectors or company_size in ["large", "enterprise"]:
        requirements["mandatory_regulations"].append({
            "name": "NIS2",
            "full_name": "Network and Information Security Directive (EU) 2022/2555",
            "key_articles": ["21 (Risk management)", "23 (Incident reporting)"],
            "deadline": "2024-10-17",
            "applies_because": f"{'Critical sector' if industry in nis2_sectors else 'Company size'}"
        })
    
    # Finnish national law
    requirements["mandatory_regulations"].append({
        "name": "Tietosuojalaki",
        "full_name": "Finnish Data Protection Act (1050/2018)",
        "key_sections": ["Sections 4-7 (Processing rules)", "Section 31 (Penalties)"],
        "applies_because": "Operating in Finland"
    })
    
    # ISO recommendations
    if company_size in ["medium", "large", "enterprise"]:
        requirements["recommended_certifications"].extend([
            {"name": "ISO 27001", "scope": "Information Security"},
            {"name": "ISO 27701", "scope": "Privacy Information Management"}
        ])
    
    if industry == "construction":
        requirements["recommended_certifications"].append({
            "name": "ISO 45001",
            "scope": "Occupational Health and Safety"
        })
    
    return json.dumps(requirements, indent=2)

# Helper function for embeddings
async def generate_embedding(text: str) -> list[float]:
    """Generate embedding using OpenAI API."""
    openai_key = os.environ.get("OPENAI_API_KEY")
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/embeddings",
            json={
                "input": text,
                "model": EMBEDDING_MODEL
            },
            headers={"Authorization": f"Bearer {openai_key}"}
        )
        
        return response.json()["data"][0]["embedding"]

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

---

## 4.6 Tool Security Configuration

### OAuth 2.1 Configuration

```yaml
# config/mcp_security.yaml
oauth:
  authorization_server: "https://auth.dws.lifetime.fi"
  token_endpoint: "/oauth/token"
  authorization_endpoint: "/oauth/authorize"
  
  clients:
    logistics_server:
      client_id: "${LOGISTICS_CLIENT_ID}"
      client_secret: "${LOGISTICS_CLIENT_SECRET}"
      scopes:
        - "kela:read"
        - "drivers:read"
        - "drivers:dispatch"
        - "routes:calculate"
      
    construction_server:
      client_id: "${CONSTRUCTION_CLIENT_ID}"
      client_secret: "${CONSTRUCTION_CLIENT_SECRET}"
      scopes:
        - "ytj:read"
        - "tilaajavastuu:read"
        - "permits:read"
        - "subcontractors:read"
      
    compliance_server:
      client_id: "${COMPLIANCE_CLIENT_ID}"
      client_secret: "${COMPLIANCE_CLIENT_SECRET}"
      scopes:
        - "regulations:read"
        - "embeddings:generate"

tls:
  minimum_version: "TLS1.3"
  certificate: "/etc/ssl/certs/dws-mcp.crt"
  private_key: "/etc/ssl/private/dws-mcp.key"

rate_limiting:
  default:
    requests_per_minute: 60
    burst: 10
  
  per_tool:
    query_kela_transport:
      requests_per_minute: 30  # Kela API limits
    dispatch_driver:
      requests_per_minute: 20  # Prevent abuse

audit:
  enabled: true
  log_destination: "supabase"
  log_table: "mcp_audit_logs"
  retention_days: 2555  # 7 years for compliance
  pii_redaction: true
```

---

## 4.7 Cost Analysis

### API Cost Estimates

| API/Service | Usage Estimate | Unit Cost | Monthly Cost |
|-------------|---------------|-----------|--------------|
| Kela Transport API | 500 calls | €0.00 (government) | €0.00 |
| YTJ/PRH API | 200 calls | €0.00 (public data) | €0.00 |
| VIES VAT Check | 100 calls | €0.00 (EU service) | €0.00 |
| Tilaajavastuu | 50 calls | €0.10/call | €5.00 |
| Routing API (HERE/Google) | 1,000 calls | €0.005/call | €5.00 |
| OpenAI Embeddings | 10,000 chunks | €0.00002/1K tokens | €2.00 |
| **Total External APIs** | | | **€12.00/month** |

### Infrastructure Costs

| Component | Specification | Monthly Cost |
|-----------|--------------|--------------|
| MCP Gateway (Cloud Run) | 2 vCPU, 2GB | €25.00 |
| MCP Servers (Cloud Run) | 3 × 1 vCPU, 1GB | €45.00 |
| Supabase Pro | Vector storage + DB | €25.00 |
| **Total Infrastructure** | | **€95.00/month** |

**Total Tool Layer Cost: €107.00/month**

---

## References

1. Model Context Protocol Working Group. (2025). *MCP Specification v1.0*. Anthropic. https://modelcontextprotocol.io/specification

2. Model Context Protocol Security. (2025). *MCP Security Best Practices*. Anthropic. https://modelcontextprotocol.io/docs/security

3. Finnish Patent and Registration Office. (2025). *YTJ Open Data API*. PRH. https://avoindata.prh.fi/

---

**Phase Complete Checklist:**
- [ ] MCP server architecture designed
- [ ] Logistics tools implemented
- [ ] Construction tools implemented
- [ ] Compliance RAG server implemented
- [ ] Security configuration defined
- [ ] Cost analysis completed

**Next Phase:** Proceed to `05-GROUNDING-MEMORY.md` for memory system design.
