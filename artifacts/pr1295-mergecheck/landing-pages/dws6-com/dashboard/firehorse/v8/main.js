// Supabase Configuration
const SUPABASE_URL = 'https://kpucuwwfhuwurdxyjjtz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdWN1d3dmaHV3dXJkeHlqanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMTU4NzgsImV4cCI6MjA1MDg5MTg3OH0.mZtEHU2k4WolHxePGF6g3w_tdkMCWRh';

// Supabase Client (will be initialized when supabase module loads)
let supabase = null;

// DWS 6 IQ V8 Enhanced Mobile App
class DWSV8App {
  constructor() {
    this.projects = [];
    this.alerts = [];
    this.isLoading = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupRouter();
    this.updateDebugPanel();
    // Initialize Supabase (will load data when ready)
    this.initSupabase();
  }

  async initSupabase() {
    try {
      // Wait for Supabase to be available
      if (typeof window.supabase === 'undefined') {
        console.log('Waiting for Supabase library...');
        setTimeout(() => this.initSupabase(), 100);
        return;
      }

      const { createClient } = window.supabase;
      supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      
      console.log('✅ Supabase connected');
      this.updateDebugPanel();
      
      // Load initial data from Supabase
      await this.loadInitialData();
    } catch (error) {
      console.error('Supabase initialization failed:', error);
      this.showErrorBanner('Failed to connect to database');
      this.renderMockData();
    }
  }

  setupEventListeners() {
    // Listen for cache updates
    window.addEventListener('cache:update', (e) => {
      this.updateDebugPanel();
    });

    // Listen for auth changes
    window.addEventListener('auth:change', (e) => {
      this.updateDebugPanel();
      this.loadInitialData();
    });

    // Listen for network changes
    window.addEventListener('net:online', (e) => {
      this.updateOnlineStatus(e.detail.isOnline);
      this.updateDebugPanel();
    });

    // Listen for WebSocket status
    window.addEventListener('ws:status', (e) => {
      this.updateDebugPanel();
    });

    // Listen for API errors
    window.addEventListener('auth:error', (e) => {
      this.showAuthError();
    });
  }

  setupRouter() {
    const { router } = window.DWS;
    
    // Define routes
    router.onRouteChange((path) => {
      this.showView(path);
    });

    // Add navigation guard
    router.beforeEach(async (path) => {
      // Show loading state
      this.showLoadingBanner(`Navigating to ${path}...`);
      
      // Simulate loading delay for smooth transitions
      await new Promise(resolve => setTimeout(resolve, 200));
      
      this.hideLoadingBanner();
      return true;
    });
  }

  showView(path) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });

    // Show requested view
    const viewId = path.replace('/', '') || 'dashboard';
    const targetView = document.getElementById(`${viewId}-view`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const activeNav = document.querySelector(`[data-route="${path}"]`);
    if (activeNav) {
      activeNav.classList.add('active');
    }

    // Load view-specific data
    this.loadViewData(path);
  }

  loadViewData(path) {
    switch(path) {
      case '/dashboard':
        this.loadDashboardData();
        break;
      case '/portfolio':
        this.loadPortfolioData();
        break;
      case '/alerts':
        this.loadAlertsData();
        break;
      case '/settings':
        this.loadSettingsData();
        break;
    }
  }

  async loadInitialData() {
    await this.loadDashboardData();
  }

  async loadDashboardData() {
    if (!supabase) {
      console.warn('Supabase not initialized yet, using mock data');
      this.renderMockData();
      return;
    }
    
    try {
      this.isLoading = true;
      
      // Load projects from Supabase
      await this.loadProjectsFromSupabase();
      
      // Load alerts from Supabase
      await this.loadAlertsFromSupabase();
      
      // Calculate portfolio metrics from projects
      this.updatePortfolioMetrics();
      
      this.isLoading = false;
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      this.showErrorBanner('Failed to load dashboard data');
      this.renderMockData();
      this.isLoading = false;
    }
  }

  async loadProjectsFromSupabase() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading projects:', error);
        this.showErrorBanner('Failed to load projects');
        return;
      }

      if (data && data.length > 0) {
        this.projects = data.map(project => ({
          projectId: project.id,
          name: project.name || 'Unnamed Project',
          region: project.region || 'Unknown',
          phase: project.phase || 'Planning',
          spi: project.spi || 1.0,
          cpi: project.cpi || 1.0,
          percentComplete: project.percent_complete || 0,
          safetyRag: project.safety_rag || 'green'
        }));
        this.renderProjects();
      } else {
        console.log('No projects found in Supabase');
        this.renderMockData();
      }
    } catch (error) {
      console.error('Exception loading projects:', error);
      this.renderMockData();
    }
  }

  async loadAlertsFromSupabase() {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading alerts:', error);
        return;
      }

      if (data && data.length > 0) {
        this.alerts = data.map(alert => ({
          project: alert.project_name || 'Unknown Project',
          message: alert.message || 'No message',
          ageHours: alert.age_hours || 0,
          type: alert.type || 'info',
          severity: alert.severity || 'low'
        }));
        this.renderAlerts();
      } else {
        console.log('No alerts found in Supabase');
        this.alerts = [];
        this.renderAlerts();
      }
    } catch (error) {
      console.error('Exception loading alerts:', error);
    }
  }

  updatePortfolioMetrics() {
    if (this.projects.length === 0) return;

    // Calculate average SPI and CPI
    const avgSpi = this.projects.reduce((sum, p) => sum + (p.spi || 0), 0) / this.projects.length;
    const avgCpi = this.projects.reduce((sum, p) => sum + (p.cpi || 0), 0) / this.projects.length;
    
    // Count projects at risk (SPI or CPI < 0.9)
    const projectsAtRisk = this.projects.filter(p => p.spi < 0.9 || p.cpi < 0.9).length;

    this.updatePortfolioCards({
      portfolio: {
        spi: avgSpi.toFixed(2),
        spiChange: avgSpi >= 1.0 ? '↑ On track' : '↓ Below target',
        cpi: avgCpi.toFixed(2),
        cpiChange: avgCpi >= 1.0 ? '↑ On budget' : '↓ Over budget',
        activeProjects: this.projects.length,
        projectsAtRisk: projectsAtRisk
      }
    });
  }

  loadPortfolioData() {
    // Portfolio view is a placeholder for now
    // Will implement detailed portfolio management in future updates
  }

  loadAlertsData() {
    // Alerts view is a placeholder for now  
    // Will implement full alerts management in future updates
  }

  loadSettingsData() {
    const { state } = window.DWS;
    
    // Update token status
    const tokenStatus = document.getElementById('token-status');
    if (tokenStatus) {
      tokenStatus.textContent = state.token ? 'Set' : 'Not set';
    }
    
    // Update API base
    const apiBase = document.getElementById('api-base');
    if (apiBase) {
      apiBase.textContent = state.apiBase;
    }
    
    // Update WebSocket status
    const wsStatus = document.getElementById('ws-status');
    if (wsStatus) {
      wsStatus.textContent = state.websocket ? 'Connected' : 'Disconnected';
    }
    
    // Update cache count
    this.updateCacheCount();
  }

  updatePortfolioCards(data) {
    if (data.portfolio) {
      const portfolio = data.portfolio;
      
      // Update SPI
      const spiElement = document.getElementById('portfolio-spi');
      if (spiElement) spiElement.textContent = portfolio.spi || '--';
      
      const spiChangeElement = document.getElementById('portfolio-spi-change');
      if (spiChangeElement) spiChangeElement.textContent = portfolio.spiChange || 'No change';
      
      // Update CPI
      const cpiElement = document.getElementById('portfolio-cpi');
      if (cpiElement) cpiElement.textContent = portfolio.cpi || '--';
      
      const cpiChangeElement = document.getElementById('portfolio-cpi-change');
      if (cpiChangeElement) cpiChangeElement.textContent = portfolio.cpiChange || 'No change';
      
      // Update Active Projects
      const projectsElement = document.getElementById('portfolio-projects');
      if (projectsElement) projectsElement.textContent = portfolio.activeProjects || '--';
      
      const projectsChangeElement = document.getElementById('portfolio-projects-change');
      if (projectsChangeElement) projectsChangeElement.textContent = 'Active';
      
      // Update Budget at Risk
      const riskElement = document.getElementById('portfolio-risk');
      if (riskElement) riskElement.textContent = portfolio.projectsAtRisk || '0';
      
      const riskChangeElement = document.getElementById('portfolio-risk-change');
      if (riskChangeElement) riskChangeElement.textContent = 'Projects at risk';
    }
  }

  renderProjects() {
    const projectList = document.getElementById('project-list');
    if (!projectList) return;

    if (this.projects.length === 0) {
      projectList.innerHTML = '<p>No projects found</p>';
      return;
    }

    projectList.innerHTML = this.projects.slice(0, 4).map(project => `
      <div class="project-card" onclick="showProjectDetail('${project.projectId}')">
        <div class="project-header">
          <div>
            <div class="project-name">${project.name}</div>
            <div class="project-meta">${project.region} • ${project.phase}</div>
          </div>
          <div class="rag-status rag-${project.safetyRag || 'green'}"></div>
        </div>
        <div class="project-metrics">
          <div class="metric">
            <div class="metric-value ${project.spi >= 1.0 ? 'positive' : 'negative'}">${project.spi || '--'}</div>
            <div class="metric-label">SPI</div>
          </div>
          <div class="metric">
            <div class="metric-value ${project.cpi >= 1.0 ? 'positive' : 'negative'}">${project.cpi || '--'}</div>
            <div class="metric-label">CPI</div>
          </div>
          <div class="metric">
            <div class="metric-value">${project.percentComplete || '--'}%</div>
            <div class="metric-label">Complete</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderAlerts() {
    const alertsList = document.getElementById('alerts-list');
    if (!alertsList) return;

    if (this.alerts.length === 0) {
      alertsList.innerHTML = '<p>No critical alerts</p>';
      return;
    }

    alertsList.innerHTML = this.alerts.slice(0, 3).map(alert => `
      <div class="alert-card">
        <div class="alert-header">
          <div class="alert-project">${alert.project || 'Unknown Project'}</div>
          <div class="alert-time">${alert.ageHours ? `${alert.ageHours}h ago` : 'Recent'}</div>
        </div>
        <div class="alert-message">${alert.message}</div>
        <div class="alert-tags">
          <div class="alert-tag tag-${alert.type || 'info'}">${alert.type || 'info'}</div>
          <div class="alert-tag ${alert.severity === 'red' ? 'tag-cost' : 'tag-schedule'}">${alert.severity}</div>
        </div>
      </div>
    `).join('');
  }

  renderMockData() {
    // Fallback to mock data if API fails
    this.projects = [
      {
        projectId: 'PRJ-001',
        name: 'HQ Expansion',
        region: 'Nordics',
        phase: 'Execution',
        spi: 0.94,
        cpi: 0.96,
        percentComplete: 58,
        safetyRag: 'amber'
      },
      {
        projectId: 'PRJ-002',
        name: 'Residential Complex',
        region: 'Nordics',
        phase: 'Execution',
        spi: 1.02,
        cpi: 0.98,
        percentComplete: 72,
        safetyRag: 'green'
      }
    ];

    this.alerts = [
      {
        project: 'HQ Expansion',
        message: 'Critical path slip: Steel erection delayed by 5 days',
        ageHours: 2,
        type: 'schedule',
        severity: 'red'
      }
    ];

    this.renderProjects();
    this.renderAlerts();
    this.updatePortfolioCards({
      portfolio: {
        spi: 0.94,
        spiChange: '↓ 2.1% vs target',
        cpi: 0.96,
        cpiChange: '↓ 1.8% vs budget'
      }
    });
  }

  // Utility functions
  refreshProjects() {
    this.loadDashboardData();
  }

  refreshAlerts() {
    this.loadDashboardData();
  }

  refreshPortfolio() {
    this.loadPortfolioData();
  }

  clearCache() {
    const { cache } = window.DWS;
    localStorage.clear();
    this.showSuccessBanner('Cache cleared successfully');
    this.updateCacheCount();
  }

  updateCacheCount() {
    const count = Object.keys(localStorage).filter(key => key.startsWith('dws_cache:')).length;
    const cacheCountElement = document.getElementById('cache-count');
    if (cacheCountElement) {
      cacheCountElement.textContent = count;
    }
  }

  updateDebugPanel() {
    const { state } = window.DWS;
    
    // Database status
    const dbElement = document.getElementById('debug-db');
    if (dbElement) {
      dbElement.textContent = supabase ? '✓ Connected' : '✗ Not connected';
    }
    
    // Auth status
    const authElement = document.getElementById('debug-auth');
    if (authElement) {
      authElement.textContent = state.token ? 'Authenticated' : 'No token';
    }
    
    // Online status
    const onlineElement = document.getElementById('debug-online');
    if (onlineElement) {
      onlineElement.textContent = state.isOnline ? 'Yes' : 'No';
    }
    
    // Projects count
    const projectsElement = document.getElementById('debug-projects');
    if (projectsElement) {
      projectsElement.textContent = this.projects.length;
    }
    
    // Alerts count
    const alertsElement = document.getElementById('debug-alerts');
    if (alertsElement) {
      alertsElement.textContent = this.alerts.length;
    }
  }

  showLoadingBanner(message) {
    const banners = document.getElementById('status-banners');
    if (banners) {
      banners.innerHTML = `<div class="loading-banner">${message}</div>`;
    }
  }

  hideLoadingBanner() {
    const banners = document.getElementById('status-banners');
    if (banners) {
      banners.innerHTML = '';
    }
  }

  showErrorBanner(message) {
    const banners = document.getElementById('status-banners');
    if (banners) {
      banners.innerHTML = `<div class="error-banner">${message}</div>`;
      setTimeout(() => {
        banners.innerHTML = '';
      }, 5000);
    }
  }

  showSuccessBanner(message) {
    const banners = document.getElementById('status-banners');
    if (banners) {
      banners.innerHTML = `<div class="offline-banner" style="background: #d1fae5; color: #065f46; border-color: #a7f3d0;">${message}</div>`;
      setTimeout(() => {
        banners.innerHTML = '';
      }, 3000);
    }
  }

  updateOnlineStatus(isOnline) {
    if (isOnline) {
      this.showSuccessBanner('Back online');
    } else {
      this.showErrorBanner('You are offline');
    }
  }
}

// Global functions for onclick handlers
function refreshProjects() {
  if (window.app) window.app.refreshProjects();
}

function refreshAlerts() {
  if (window.app) window.app.refreshAlerts();
}

function refreshPortfolio() {
  if (window.app) window.app.refreshPortfolio();
}

function clearCache() {
  if (window.app) window.app.clearCache();
}

function toggleDebug() {
  const panel = document.getElementById('debug-panel');
  if (panel) {
    panel.classList.toggle('active');
  }
}

function showProjectDetail(projectId) {
  alert(`Project detail for ${projectId} - Coming in V8 Phase 2`);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new DWSV8App();
  
  // Update time every minute
  setInterval(() => {
    const timeElement = document.getElementById('status-time');
    if (timeElement) {
      timeElement.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }, 60000);
});