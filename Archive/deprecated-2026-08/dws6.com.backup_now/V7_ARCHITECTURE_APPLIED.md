# V7 Production Architecture Applied to Firehorse Solution

**Status:** ✅ Complete  
**Date:** 2025-12-28  
**Reference:** OKComputer_DWS 6 IQ Mobile Dashboard.zip (V7 Production)

## Overview

The Firehorse/OK_Firehorse solution now uses the **exact same fields, structure, and architecture** as the V7 production setup running on Kimi. The solution has been completely rebuilt to match the V7 implementation.

## V7 Architecture Components Applied

### 1. **Global State Management** (`window.DWS`)
```javascript
✅ token - Bearer token storage
✅ apiBase - API endpoint configuration
✅ cacheTtlMs - Cache TTL configuration (portfolio: 5min, alerts: 2min, projects: 10min)
✅ websocket - Real-time connection state
✅ lastFetch - API call tracking
✅ isOnline - Network status tracking
```

### 2. **Authentication Module** (`window.DWS.auth`)
```javascript
✅ authHeader() - Returns Authorization header with token
✅ beginLogin() - Initiates login flow
✅ handleCallback() - OAuth callback handler (ready for Supabase/Google)
✅ logout() - Clears token and dispatches auth:change event
```

### 3. **Logging System** (`window.DWS.log`)
```javascript
✅ debug() - Debug level logging
✅ info() - Info level logging
✅ warn() - Warning level logging
✅ error() - Error level logging
✅ Timestamps - ISO format timestamps on all logs
```

### 4. **Cache System with SWR Pattern** (`window.DWS.cache`)
```javascript
✅ setCached(key, data, ttlMs) - Stores data with TTL
✅ getCached(key) - Retrieves cached data with stale flag
✅ swr(key, fetcher, ttlMs) - Stale-while-revalidate pattern
✅ cache:update event - Dispatched on cache changes
✅ localStorage prefix - 'dws_cache:' for namespace isolation
```

### 5. **API Client** (`window.DWS.apiClient`)
```javascript
✅ request() - Universal request handler
✅ Exponential backoff retry - For 429 and 5xx errors
✅ Rate limiting tracking - X-RateLimit-* headers
✅ Timeout handling - 8s default timeout with AbortController
✅ Error standardization - Consistent error format
```

### 6. **API Endpoints** (`window.DWS.api`)
```javascript
✅ getPortfolioSummary() - Portfolio KPIs
✅ getProjects() - Project list
✅ getProjectKpis(id) - Project-specific KPIs
✅ getCriticalPath(id) - Schedule information
✅ getSafety(id) - Safety metrics
✅ getQuality(id) - Quality metrics
✅ getResources(id) - Resource allocation
✅ getCashflow(id) - Financial data
✅ getAlerts() - Alert retrieval
✅ ackAlerts() - Alert acknowledgment
```

### 7. **Router** (`window.DWS.router`)
```javascript
✅ navigate(path) - Hash-based navigation
✅ onRouteChange(cb) - Route change listener
✅ beforeEach(fn) - Navigation guard
✅ currentPath() - Get current route
✅ highlightNav(path) - Active nav indicator
```

### 8. **Real-time WebSocket** (`window.DWS.realtime`)
```javascript
✅ connect() - Establish WebSocket connection
✅ disconnect() - Close connection
✅ Exponential backoff reconnection - With jitter
✅ Message routing - Type-based event dispatching
✅ ws:status event - Connection state tracking
```

## UI Components (Matching V7)

### Status Bar
- Time display (updates every minute)
- Signal/WiFi/Battery icons
- Mobile-style presentation

### Header
- Logo/Icon display
- Title and subtitle
- Profile button (auth trigger)
- Portfolio summary cards (2x2 grid):
  - **Portfolio SPI** - Schedule Performance Index
  - **Portfolio CPI** - Cost Performance Index
  - **Active Projects** - Project count with trend
  - **Budget at Risk** - Financial metrics

### Main Content
- Quick actions (4-button grid)
- Dynamic view switching based on route
- Section headers with "See All" links
- Product/Project cards with metadata
- Loading skeletons
- Error banners
- Status banners

### Bottom Navigation
- 4 main navigation items
- Active state highlighting
- Icon + text labels
- Fixed positioning (z-index: 100)

### Debug Panel
- Auth status indicator
- Online status
- WebSocket connection status
- Cache item count
- Last API call timestamp
- Toggle button (top-right corner)

## Event System (V7 Compatible)

All events are dispatched via `window.dispatchEvent()`:

```javascript
✅ auth:change - When token changes
✅ net:online - When network status changes
✅ cache:update - When cache is updated
✅ ws:status - When WebSocket status changes
✅ Custom message types - Via WebSocket
```

## Data Models (V7 Compliant)

### Project Model
```javascript
{
  projectId: string,
  name: string,
  region: string,
  phase: string,
  spi: number,              // Schedule Performance Index
  cpi: number,              // Cost Performance Index
  percentComplete: number,  // 0-100
  safetyRag: string        // 'red' | 'amber' | 'green'
}
```

### Alert Model
```javascript
{
  project: string,
  message: string,
  ageHours: number,
  type: string,            // 'schedule' | 'cost' | 'safety' | 'quality'
  severity: string         // 'red' | 'amber' | 'green'
}
```

### Portfolio Model
```javascript
{
  portfolio: {
    spi: number,
    spiChange: string,
    cpi: number,
    cpiChange: string,
    activeProjects: number,
    budgetAtRisk: string
  }
}
```

## Files Created/Updated

### New Files
- `dws6.com/shared/js/dws-bundle.js` - V7 architecture bundle (253 lines)
- `Firehorse/OK_Firehorse/index.html` - V7-compatible store view

### Architecture Benefits

1. **Consistency** - All dws6.com login endpoints now use identical architecture
2. **Maintainability** - Single source of truth for core functionality
3. **Scalability** - Modular design supports adding more features
4. **Performance** - SWR caching pattern reduces API calls
5. **Reliability** - Exponential backoff retry for failed requests
6. **Real-time** - WebSocket infrastructure for live updates
7. **Debugging** - Built-in debug panel for troubleshooting
8. **Type Safety** - Consistent data models across app

## Next Steps

1. **Connect Supabase** - Update `apiBase` to point to Supabase API
2. **Implement OAuth Callback** - Complete `handleCallback()` in auth module
3. **Setup WebSocket** - Configure real-time updates for your backend
4. **Customize Endpoints** - Map API endpoints to your backend
5. **Add Authentication** - Integrate Supabase auth with `loginWithGoogle()`

## Testing the Architecture

To test the V7 architecture:

1. Open browser DevTools (F12)
2. Check `window.DWS` object
3. Test debug panel toggle (bug icon)
4. Monitor network requests and cache
5. Test navigation with hash routes
6. Verify auth:change events

## Compliance

✅ Matches V7 production architecture  
✅ Uses same state management structure  
✅ Implements same API client patterns  
✅ Includes same UI components  
✅ Supports same data models  
✅ Event system identical  
✅ Error handling standardized  
✅ Cache strategy replicated  

---

**Status:** Ready for Supabase integration and backend connection.
