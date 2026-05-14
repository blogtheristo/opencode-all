// DWS 6 IQ Dashboard - Main JavaScript
class DashboardApp {
    constructor() {
        this.portfolioValue = 2847500;
        this.dailyChange = 12500;
        this.dailyChangePercent = 0.44;
        this.currentPeriod = '1M';
        this.performanceChart = null;
        this.allocationChart = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCharts();
        this.animateCounters();
        this.populateHoldings();
        this.populateMarketData();
        this.initializeCarousel();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Period selector
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentPeriod = e.target.dataset.period;
                this.updatePerformanceChart();
            });
        });

        // Pull to refresh simulation
        let startY = 0;
        let pullDistance = 0;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0) {
                pullDistance = e.touches[0].clientY - startY;
                if (pullDistance > 0) {
                    e.preventDefault();
                    // Visual feedback for pull to refresh
                    document.body.style.transform = `translateY(${Math.min(pullDistance * 0.5, 50)}px)`;
                }
            }
        });

        document.addEventListener('touchend', () => {
            if (pullDistance > 100) {
                this.refreshData();
            }
            document.body.style.transform = '';
            pullDistance = 0;
        });
    }

    animateCounters() {
        // Animate portfolio value
        anime({
            targets: { value: 0 },
            value: this.portfolioValue,
            duration: 2000,
            easing: 'easeOutExpo',
            update: (anim) => {
                document.getElementById('portfolio-value').textContent = 
                    '$' + Math.round(anim.animatables[0].target.value).toLocaleString();
            }
        });

        // Animate daily change
        anime({
            targets: { value: 0 },
            value: this.dailyChange,
            duration: 2000,
            delay: 500,
            easing: 'easeOutExpo',
            update: (anim) => {
                const change = Math.round(anim.animatables[0].target.value);
                document.getElementById('daily-change').textContent = 
                    `+$${change.toLocaleString()} (${this.dailyChangePercent}%)`;
            }
        });

        // Animate total return
        anime({
            targets: { value: 0 },
            value: 317500,
            duration: 2000,
            delay: 1000,
            easing: 'easeOutExpo',
            update: (anim) => {
                document.getElementById('total-return').textContent = 
                    '+$' + Math.round(anim.animatables[0].target.value).toLocaleString();
            }
        });
    }

    initializeCharts() {
        this.initPerformanceChart();
        this.initAllocationChart();
    }

    initPerformanceChart() {
        const chartDom = document.getElementById('performance-chart');
        this.performanceChart = echarts.init(chartDom);
        
        const option = {
            grid: { top: 20, right: 20, bottom: 40, left: 60 },
            xAxis: {
                type: 'category',
                data: this.getPerformanceDates(),
                axisLine: { lineStyle: { color: '#e0e0e0' } },
                axisLabel: { color: '#666', fontSize: 10 }
            },
            yAxis: {
                type: 'value',
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: '#666', fontSize: 10 },
                splitLine: { lineStyle: { color: '#f0f0f0' } }
            },
            series: [{
                data: this.getPerformanceData(),
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: { color: '#4a90e2', width: 3 },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
                            { offset: 1, color: 'rgba(74, 144, 226, 0.05)' }
                        ]
                    }
                }
            }],
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0,0,0,0.8)',
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: (params) => {
                    const value = params[0].value;
                    return `Value: $${value.toLocaleString()}`;
                }
            }
        };

        this.performanceChart.setOption(option);
    }

    initAllocationChart() {
        const chartDom = document.getElementById('allocation-chart');
        this.allocationChart = echarts.init(chartDom);
        
        const data = [
            { value: 35, name: 'US Stocks', itemStyle: { color: '#4a90e2' } },
            { value: 25, name: 'International', itemStyle: { color: '#f4a261' } },
            { value: 20, name: 'Bonds', itemStyle: { color: '#2a9d8f' } },
            { value: 12, name: 'Real Estate', itemStyle: { color: '#e76f51' } },
            { value: 8, name: 'Commodities', itemStyle: { color: '#264653' } }
        ];

        const option = {
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                data: data,
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}\n{d}%',
                    fontSize: 10,
                    color: '#666'
                },
                labelLine: { show: true },
                emphasis: {
                    itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
                }
            }],
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0.8)',
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: '{b}: {c}% (${d})'
            }
        };

        this.allocationChart.setOption(option);
    }

    getPerformanceDates() {
        const dates = [];
        const today = new Date();
        for (let i = 30; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return dates;
    }

    getPerformanceData() {
        const baseValue = 2500000;
        const data = [];
        for (let i = 0; i <= 30; i++) {
            const randomChange = (Math.random() - 0.5) * 0.02;
            const value = i === 0 ? baseValue : data[i-1] * (1 + randomChange);
            data.push(Math.round(value));
        }
        return data;
    }

    updatePerformanceChart() {
        // Simulate different data for different time periods
        const newData = this.getPerformanceData();
        const newDates = this.getPerformanceDates();
        
        this.performanceChart.setOption({
            xAxis: { data: newDates },
            series: [{ data: newData }]
        });
    }

    populateHoldings() {
        const holdings = [
            { symbol: 'AAPL', name: 'Apple Inc.', value: 285000, change: 2.34, shares: 1500 },
            { symbol: 'MSFT', name: 'Microsoft Corp.', value: 245000, change: -0.87, shares: 800 },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', value: 198000, change: 1.23, shares: 150 },
            { symbol: 'AMZN', name: 'Amazon.com Inc.', value: 176000, change: 3.45, shares: 120 },
            { symbol: 'TSLA', name: 'Tesla Inc.', value: 154000, change: -2.11, shares: 600 }
        ];

        const holdingsList = document.getElementById('holdings-list');
        holdingsList.innerHTML = holdings.map(holding => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex-1">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span class="text-blue-600 font-semibold text-sm">${holding.symbol.charAt(0)}</span>
                        </div>
                        <div>
                            <p class="font-semibold text-sm">${holding.symbol}</p>
                            <p class="text-gray-500 text-xs">${holding.shares} shares</p>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-sm">$${holding.value.toLocaleString()}</p>
                    <p class="text-xs ${holding.change >= 0 ? 'text-green-600' : 'text-red-600'}">
                        ${holding.change >= 0 ? '+' : ''}${holding.change}%
                    </p>
                </div>
            </div>
        `).join('');
    }

    populateMarketData() {
        const marketData = [
            { name: 'S&P 500', value: 4783.45, change: 0.87, icon: 'S' },
            { name: 'NASDAQ', value: 15011.35, change: 1.23, icon: 'N' },
            { name: 'DOW JONES', value: 37863.80, change: -0.34, icon: 'D' },
            { name: 'VIX', value: 18.45, change: -2.11, icon: 'V' }
        ];

        const marketOverview = document.getElementById('market-overview');
        marketOverview.innerHTML = marketData.map(item => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span class="text-gray-600 font-semibold text-xs">${item.icon}</span>
                    </div>
                    <div>
                        <p class="font-semibold text-sm">${item.name}</p>
                        <p class="text-gray-500 text-xs">${item.value.toLocaleString()}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-xs ${item.change >= 0 ? 'text-green-600' : 'text-red-600'} font-medium">
                        ${item.change >= 0 ? '+' : ''}${item.change}%
                    </p>
                </div>
            </div>
        `).join('');
    }

    initializeCarousel() {
        const splide = new Splide('#stats-carousel', {
            type: 'loop',
            perPage: 2.2,
            perMove: 1,
            gap: '0.5rem',
            pagination: false,
            arrows: false,
            breakpoints: {
                640: { perPage: 1.5 }
            }
        });
        splide.mount();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                if (page && page !== 'index.html') {
                    window.location.href = page;
                }
            });
        });
    }

    refreshData() {
        // Show loading state
        document.querySelectorAll('.metric-card').forEach(card => {
            card.classList.add('loading-skeleton');
        });

        // Simulate data refresh
        setTimeout(() => {
            this.portfolioValue += (Math.random() - 0.5) * 10000;
            this.dailyChange += (Math.random() - 0.5) * 1000;
            
            this.animateCounters();
            this.updatePerformanceChart();
            
            // Remove loading state
            document.querySelectorAll('.metric-card').forEach(card => {
                card.classList.remove('loading-skeleton');
            });
        }, 1500);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardApp();
});

// Handle window resize for charts
window.addEventListener('resize', () => {
    if (window.dashboardApp && window.dashboardApp.performanceChart) {
        window.dashboardApp.performanceChart.resize();
    }
    if (window.dashboardApp && window.dashboardApp.allocationChart) {
        window.dashboardApp.allocationChart.resize();
    }
});

// Export for use in other pages
window.DashboardApp = DashboardApp;