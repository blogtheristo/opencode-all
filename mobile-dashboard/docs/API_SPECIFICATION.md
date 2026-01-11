# DWS IQ Mobile API Specification

## Overview

The DWS IQ Mobile API provides endpoints for portfolio management, project KPIs, and real-time alerts optimized for mobile clients on devices like Kimi K2. All endpoints support role-based access control (RBAC) via OAuth2/OIDC with bearer tokens.

## Authentication

All endpoints require an `Authorization: Bearer <token>` header.

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Security Schemes

- **OAuth2/OIDC**: Resource Owner Password Flow or Authorization Code Flow
- **Bearer Token**: JWT with role claims (exec, pm, site-manager)
- **Device Binding**: Refresh tokens are device-bound for enhanced security
- **TLS 1.2+**: All communications encrypted

### Token Requirements

```json
{
  "sub": "user-id",
  "roles": ["pm", "exec"],
  "projectScopes": ["PRJ-001", "PRJ-002"],
  "exp": 1735030400,
  "iat": 1735026800
}
```

## Base URL

```
https://api.dws-iq.ncc.corp/v1/mobile
```

## Endpoints

### Portfolio Summary

**GET** `/portfolio/summary`

Returns high-level portfolio KPIs, trends, and critical alerts.

**Parameters:**
- `region` (query, optional): Filter by region code (e.g., "nordics", "central-europe")

**Response: 200 OK**

```json
{
  "asOf": "2025-12-23T08:00:00Z",
  "portfolio": {
    "spi": 0.94,
    "cpi": 0.96,
    "budgetVsForecastPct": -2.4,
    "safetyTrifr": 3.2,
    "qualityNcrOpen": 28,
    "qualityNcrOverdue": 5
  },
  "trends": {
    "cashBurn8w": [2.1, 2.3, 2.2, 2.5, 2.6, 2.7, 2.9, 3.1],
    "changeOrdersNet": [0, 0.1, 0.15, 0.2, 0.18, 0.22, 0.25, 0.28],
    "workforceTrend": [162, 168, 171, 175, 180, 184, 184, 182]
  },
  "topAlerts": [
    {
      "id": "AL-101",
      "projectId": "PRJ-001",
      "type": "schedule",
      "severity": "red",
      "message": "Critical path slip 5d",
      "ageHours": 48
    },
    {
      "id": "AL-102",
      "projectId": "PRJ-002",
      "type": "quality",
      "severity": "red",
      "message": "NCR overdue 3",
      "ageHours": 24
    }
  ]
}
```

---

### Projects List

**GET** `/projects`

Returns paginated list of projects with quick KPI snapshot.

**Parameters:**
- `region` (query, optional): e.g., "nordics"
- `phase` (query, optional): e.g., "planning", "execution", "closeout"
- `riskLevel` (query, optional): e.g., "red", "amber", "green"
- `spiMin` (query, optional): Filter by minimum SPI threshold
- `cpiMin` (query, optional): Filter by minimum CPI threshold
- `safetyStatus` (query, optional): e.g., "green", "amber", "red"
- `page` (query, default: 1): Pagination page number
- `pageSize` (query, default: 20): Items per page (max 100)
- `sortBy` (query, default: "name"): "name", "spi", "cpi", "createdAt"

**Response: 200 OK**

```json
{
  "items": [
    {
      "projectId": "PRJ-001",
      "name": "HQ Expansion",
      "region": "Nordics",
      "phase": "execution",
      "spi": 0.94,
      "cpi": 0.96,
      "percentComplete": 58,
      "daysAheadBehind": -5,
      "safetyStatus": "amber",
      "qualityStatus": "red",
      "riskLevel": "red"
    },
    {
      "projectId": "PRJ-002",
      "name": "Office Retrofit",
      "region": "Central Europe",
      "phase": "planning",
      "spi": 1.02,
      "cpi": 0.98,
      "percentComplete": 12,
      "daysAheadBehind": 3,
      "safetyStatus": "green",
      "qualityStatus": "green",
      "riskLevel": "green"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 47,
    "totalPages": 3
  },
  "asOf": "2025-12-23T08:00:00Z"
}
```

---

### Project KPIs

**GET** `/projects/{projectId}/kpis`

Detailed KPI snapshot for a single project.

**Parameters:**
- `projectId` (path, required): Project identifier

**Response: 200 OK**

```json
{
  "projectId": "PRJ-001",
  "name": "HQ Expansion",
  "region": "Nordics",
  "phase": "execution",
  "status": "in-progress",
  "overview": {
    "spi": 0.94,
    "cpi": 0.96,
    "percentComplete": 58,
    "facVsBudgetPct": -2.4,
    "daysAheadBehind": -5,
    "rag": {
      "schedule": "red",
      "cost": "amber",
      "safety": "amber",
      "quality": "red"
    }
  },
  "financial": {
    "budgetTotal": 45.2,
    "committed": 38.6,
    "actual": 43.5,
    "forecast": 46.3,
    "variance": 1.1,
    "changeOrders": {
      "pending": 2,
      "approved": 3,
      "netValue": 0.28
    }
  },
  "schedule": {
    "baselineFinish": "2025-03-12",
    "forecastFinish": "2025-03-17",
    "criticalPathAtRiskCount": 3,
    "topCriticalTasks": [
      {
        "id": "T123",
        "name": "Steel erection",
        "floatDays": 0,
        "due": "2025-01-05",
        "responsible": "Sub A"
      }
    ]
  },
  "safety": {
    "trifr12m": 3.2,
    "ltifr12m": 0.6,
    "nearMissesMtd": 12,
    "openActions": 7,
    "incidents": 2
  },
  "quality": {
    "ncrOpen": 28,
    "ncrOverdue": 5,
    "reworkPct": 3.1
  },
  "resources": {
    "workforceToday": 184,
    "planToday": 170,
    "equipUtilPct": 76,
    "overtimeHours": 112
  },
  "asOf": "2025-12-23T08:00:00Z"
}
```

---

### Schedule / Critical Path

**GET** `/projects/{projectId}/schedule/critical`

Critical path tasks and milestone timeline.

**Response: 200 OK**

```json
{
  "projectId": "PRJ-001",
  "spi": 0.94,
  "baselineFinish": "2025-03-12",
  "forecastFinish": "2025-03-17",
  "criticalTasks": [
    {
      "id": "T123",
      "name": "Steel erection",
      "floatDays": 0,
      "due": "2025-01-05",
      "responsible": "Sub A",
      "percentComplete": 45,
      "status": "in-progress"
    },
    {
      "id": "T140",
      "name": "Envelope install",
      "floatDays": 1,
      "due": "2025-01-22",
      "responsible": "Sub B",
      "percentComplete": 0,
      "status": "pending"
    }
  ],
  "milestonesNext": [
    {
      "name": "Level 5 structural complete",
      "due": "2025-01-18",
      "status": "at-risk"
    },
    {
      "name": "MEP rough-in starts",
      "due": "2025-02-01",
      "status": "on-track"
    }
  ],
  "asOf": "2025-12-23T08:00:00Z"
}
```

---

### Safety

**GET** `/projects/{projectId}/safety`

Safety KPIs, incidents, and open actions.

**Response: 200 OK**

```json
{
  "projectId": "PRJ-001",
  "trifr12m": 3.2,
  "ltifr12m": 0.6,
  "trifr12mTrend": [3.5, 3.4, 3.3, 3.2],
  "nearMissesMtd": 12,
  "incidents": [
    {
      "id": "S901",
      "severity": "medium",
      "date": "2025-12-18",
      "status": "open",
      "description": "Fall from height near stairwell",
      "actionsOpen": 2
    }
  ],
  "actions": [
    {
      "id": "A77",
      "description": "Install guardrails level 4",
      "ageDays": 3,
      "owner": "Site HSE Manager",
      "status": "open",
      "dueDate": "2025-12-27"
    }
  ],
  "asOf": "2025-12-23T08:00:00Z"
}
```

---

### Quality

**GET** `/projects/{projectId}/quality`

Quality metrics, NCRs, defects.

**Response: 200 OK**

```json
{
  "projectId": "PRJ-001",
  "ncrOpen": 28,
  "ncrOverdue": 5,
  "cycleTimeDays": 9.4,
  "reworkPct": 3.1,
  "reworkTrend": [2.8, 2.9, 3.0, 3.1],
  "defectsByTrade": [
    {
      "trade": "Concrete",
      "count": 11,
      "resolved": 8
    },
    {
      "trade": "MEP",
      "count": 8,
      "resolved": 5
    }
  ],
  "ncrsByAge": [
    {
      "ageDays": "0-7",
      "count": 15
    },
    {
      "ageDays": "8-14",
      "count": 8
    },
    {
      "ageDays": "15+",
      "count": 5
    }
  ],
  "asOf": "2025-12-23T08:00:00Z"
}
```

---

### Resources

**GET** `/projects/{projectId}/resources`

Workforce, equipment, and subcontractor performance.

**Response: 200 OK**

```json
{
  "projectId": "PRJ-001",
  "workforce": {
    "today": 184,
    "plan": 170,
    "trend7d": [162, 168, 171, 175, 180, 184, 184]
  },
  "equipment": {
    "utilPct": 76,
    "onSite": 12,
    "idle": 4
  },
  "overtime": {
    "hoursThisWeek": 112,
    "budgetedHours": 80
  },
  "subcontractors": [
    {
      "name": "Sub A",
      "onTimePct": 94,
      "reworkPct": 2.1,
      "safetyIncidents": 1,
      "performanceScore": 8.7
    },
    {
      "name": "Sub B",
      "onTimePct": 88,
      "reworkPct": 3.5,
      "safetyIncidents": 0,
      "performanceScore": 8.1
    }
  ],
  "asOf": "2025-12-23T08:00:00Z"
}
```

---

### Cash Flow

**GET** `/projects/{projectId}/cashflow`

Cash burn, forecasting, and burn rate.

**Response: 200 OK**

```json
{
  "projectId": "PRJ-001",
  "currency": "EUR",
  "budgetTotal": 45.2,
  "burnRateMtd": 2.8,
  "burnRate8w": [2.1, 2.3, 2.2, 2.5, 2.6, 2.7, 2.9, 2.8],
  "byPeriod": [
    {
      "period": "2025-W49",
      "planned": 2.5,
      "actual": 2.6,
      "cumPlanned": 18.5,
      "cumActual": 19.2
    },
    {
      "period": "2025-W50",
      "planned": 2.6,
      "actual": 2.7,
      "cumPlanned": 21.1,
      "cumActual": 21.9
    },
    {
      "period": "2025-W51",
      "planned": 2.7,
      "actual": 2.9,
      "cumPlanned": 23.8,
      "cumActual": 24.8
    }
  ],
  "asOf": "2025-12-23T08:00:00Z"
}
```

---

### Alerts

**GET** `/alerts`

Cross-domain alerts with filtering and sorting.

**Parameters:**
- `projectId` (query, optional): Filter by project
- `type` (query, optional): "schedule", "cost", "safety", "quality", "resource"
- `severity` (query, optional): "red", "amber", "green"
- `ageHoursMax` (query, optional): Alerts newer than N hours
- `acknowledged` (query, optional): true/false
- `sortBy` (query, default: "severity"): "severity", "createdAt", "ageHours"
- `page` (query, default: 1)
- `pageSize` (query, default: 50)

**Response: 200 OK**

```json
{
  "items": [
    {
      "id": "AL-101",
      "projectId": "PRJ-001",
      "type": "schedule",
      "severity": "red",
      "message": "Critical path slip 5d",
      "ageHours": 48,
      "createdAt": "2025-12-21T08:00:00Z",
      "acknowledged": false,
      "acknowledgedBy": null,
      "acknowledgedAt": null
    },
    {
      "id": "AL-102",
      "projectId": "PRJ-002",
      "type": "quality",
      "severity": "red",
      "message": "NCR overdue 3",
      "ageHours": 24,
      "createdAt": "2025-12-22T08:00:00Z",
      "acknowledged": false,
      "acknowledgedBy": null,
      "acknowledgedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 8,
    "totalPages": 1
  },
  "asOf": "2025-12-23T08:00:00Z"
}
```

---

### Acknowledge Alert

**POST** `/alerts/{alertId}/acknowledge`

Mark an alert as acknowledged.

**Request Body:**

```json
{
  "notes": "Coordinating with Sub A"
}
```

**Response: 200 OK**

```json
{
  "id": "AL-101",
  "acknowledged": true,
  "acknowledgedBy": "user-123",
  "acknowledgedAt": "2025-12-23T09:15:00Z",
  "notes": "Coordinating with Sub A"
}
```

---

### Bulk Acknowledge Alerts

**POST** `/alerts/acknowledge-bulk`

Acknowledge multiple alerts at once.

**Request Body:**

```json
{
  "alertIds": ["AL-101", "AL-102", "AL-103"],
  "notes": "Batch review completed"
}
```

**Response: 200 OK**

```json
{
  "acknowledged": 3,
  "failed": 0,
  "timestamp": "2025-12-23T09:15:00Z"
}
```

---

## Error Responses

All error responses follow this envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid filter combination",
    "details": [
      {
        "field": "spiMin",
        "issue": "must be between 0.0 and 1.5"
      }
    ],
    "requestId": "req-12345",
    "timestamp": "2025-12-23T09:15:00Z"
  }
}
```

### Common Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions for resource |
| `NOT_FOUND` | 404 | Project, alert, or resource not found |
| `VALIDATION_ERROR` | 400 | Invalid query parameters or body |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Backend system unavailable |

---

## Caching Headers

All GET endpoints return cache directives:

```
Cache-Control: public, max-age=300
ETag: "abc123def456"
Last-Modified: 2025-12-23T08:00:00Z
X-Data-Freshness: 2025-12-23T08:00:00Z
```

**Recommended client behavior:**
- Portfolio summary: refresh every 5–10 minutes
- Projects list: refresh every 10 minutes or on filter change
- Project KPIs: refresh every 5 minutes or on demand
- Alerts: refresh every 2 minutes or use WebSocket subscription

---

## Offline Support

When offline, clients should:

1. **Serve cached responses** with `X-From-Cache: true` header
2. **Queue acknowledgments** with local timestamp
3. **Sync queue** on reconnection (merge acknowledgments with server state)
4. **Mark data stale** after 1 hour without refresh

Example offline response:

```json
{
  "items": [...],
  "asOf": "2025-12-23T08:00:00Z",
  "X-From-Cache": true,
  "cacheAge": "45m",
  "warning": "Data may be stale. Will sync when online."
}
```

---

## Pagination

All list endpoints support cursor-based or offset pagination:

```
GET /projects?page=2&pageSize=20

Response includes:
{
  "pagination": {
    "page": 2,
    "pageSize": 20,
    "total": 47,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## Rate Limiting

- **Standard rate limit**: 100 requests per 1 minute per user
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Backoff strategy**: Exponential backoff with jitter; respect `Retry-After` header

---

## Data Freshness & Sync Strategy

| Endpoint | Refresh | Reason |
|----------|---------|--------|
| `/portfolio/summary` | Every 5 min | High-value executives want latest snapshot |
| `/projects` | Every 10 min | List rarely changes; filter focus |
| `/projects/{id}/kpis` | Every 5 min | Daily updates from ERP/scheduling systems |
| `/projects/{id}/schedule/critical` | Every 1 min | Tight schedule risk; real-time alignment |
| `/projects/{id}/safety` | Real-time | Incident reporting time-critical |
| `/projects/{id}/quality` | Every 15 min | Batch NCR system updates |
| `/projects/{id}/resources` | Every 10 min | Workforce/access logs update ~hourly |
| `/alerts` | Every 2 min | Severity-driven: red = more frequent |

---

## Authentication Flow (OAuth2/OIDC)

```
1. Client launches app → redirect to auth provider
2. User logs in → receives authorization code
3. Client exchanges code for access token + refresh token
4. Store tokens in secure storage (KeyChain/Keystore)
5. Attach access token to all API requests
6. On expiry, use refresh token to obtain new access token
7. If refresh fails → prompt re-authentication
```

---

**Document Version**: 1.0.0  
**Last Updated**: December 23, 2025  
**API Version**: 0.1.0

