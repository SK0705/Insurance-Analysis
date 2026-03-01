 /* Premium Insurance Analytics Dashboard - JavaScript */

// Global chart instances
let charts = {
    areaChart: null,
    revenueChart: null,
    claimChart: null,
    incomeChart: null,
    areaDetailChart: null,
    claimsByAreaChart: null
};

// Page titles for navigation
const pageTitles = {
    'dashboard': { title: 'Dashboard', subtitle: 'Insurance Policy Holders Overview' },
    'area-analysis': { title: 'Area Analysis', subtitle: 'Detailed geographical breakdown' },
    'reports': { title: 'Reports', subtitle: 'Analytics reports and exports' },
    'settings': { title: 'Settings', subtitle: 'Dashboard preferences' }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    fetchAnalytics();
    setupNavigation();
    setupUploadHandler();
    setupFileInput();
});

// Setup navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });
}

// Navigate to a specific page
function navigateTo(page) {
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
        }
    });
    
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected page
    const pageElement = document.getElementById('page-' + page);
    if (pageElement) {
        pageElement.classList.add('active');
    }
    
    // Update header
    const pageData = pageTitles[page];
    if (pageData) {
        document.getElementById('page-title').textContent = pageData.title;
        document.querySelector('.subtitle').textContent = pageData.subtitle;
    }
    
    // Load area analysis data if navigating to that page
    if (page === 'area-analysis') {
        loadAreaAnalysis();
    }
    
    // Load settings if navigating to settings page
    if (page === 'settings') {
        loadSettings();
    }
}

// Theme configurations
const themes = {
    teal: {
        primary: '#0d9488',
        primaryLight: '#14b8a6',
        primaryLighter: '#5eead4',
        primaryDark: '#0f766e',
        sidebar: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        isDark: false
    },
    blue: {
        primary: '#2563eb',
        primaryLight: '#3b82f6',
        primaryLighter: '#60a5fa',
        primaryDark: '#1d4ed8',
        sidebar: 'linear-gradient(180deg, #1e3a8a 0%, #172554 100%)',
        isDark: false
    },
    purple: {
        primary: '#7c3aed',
        primaryLight: '#8b5cf6',
        primaryLighter: '#a78bfa',
        primaryDark: '#6d28d9',
        sidebar: 'linear-gradient(180deg, #4c1d95 0%, #2e1065 100%)',
        isDark: false
    },
    dark: {
        primary: '#0d9488',
        primaryLight: '#14b8a6',
        primaryLighter: '#5eead4',
        primaryDark: '#0f766e',
        sidebar: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
        isDark: true
    }
};

// Apply theme to the dashboard
function applyTheme(themeName) {
    const theme = themes[themeName] || themes.teal;
    const root = document.documentElement;
    
    // Update CSS variables
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-light', theme.primaryLight);
    root.style.setProperty('--primary-lighter', theme.primaryLighter);
    root.style.setProperty('--primary-dark', theme.primaryDark);
    
    // Update sidebar background
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.style.background = theme.sidebar;
    }
    
    // Update gradient elements
    const gradientElements = document.querySelectorAll('.logo-icon, .upload-icon, .kpi-icon, .data-badge, .chart-badge, .btn-upload');
    gradientElements.forEach(function(el) {
        el.style.background = 'linear-gradient(135deg, ' + theme.primary + ', ' + theme.primaryLight + ')';
    });
    
    // Update active nav item
    const activeNavItem = document.querySelector('.sidebar nav li.active');
    if (activeNavItem) {
        activeNavItem.style.background = 'linear-gradient(135deg, ' + theme.primary + ', ' + theme.primaryLight + ')';
    }
    
    // Apply dark mode specific styles
    if (theme.isDark) {
        applyDarkMode(true);
    } else {
        applyDarkMode(false);
    }
}

// Apply or remove dark mode styles
function applyDarkMode(isDark) {
    const body = document.body;
    const cards = document.querySelectorAll('.card, .chart-card, .upload-card, .format-card, .kpi-card');
    const mainContent = document.querySelector('.main-content');
    const headers = document.querySelectorAll('.header-left h1, .section-header h2, .chart-header h3');
    const subtitles = document.querySelectorAll('.subtitle, .section-header p, .upload-header p');
    const tables = document.querySelectorAll('table');
    
    if (isDark) {
        body.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
        
        cards.forEach(function(card) {
            card.style.background = '#1e293b';
            card.style.border = '1px solid #334155';
            card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
        });
        
        if (mainContent) {
            mainContent.style.background = 'transparent';
        }
        
        headers.forEach(function(header) {
            header.style.color = '#f1f5f9';
        });
        
        subtitles.forEach(function(sub) {
            sub.style.color = '#94a3b8';
        });
        
        // Update input and select elements
        const selects = document.querySelectorAll('select');
        selects.forEach(function(select) {
            select.style.background = '#334155';
            select.style.color = '#f1f5f9';
            select.style.border = '1px solid #475569';
        });
        
        // Update table styles
        tables.forEach(function(table) {
            table.querySelectorAll('th').forEach(function(th) {
                th.style.background = '#1e293b';
                th.style.color = '#94a3b8';
                th.style.borderBottom = '2px solid #334155';
            });
            table.querySelectorAll('td').forEach(function(td) {
                td.style.color = '#e2e8f0';
                td.style.borderBottom = '1px solid #334155';
            });
            table.querySelectorAll('tbody tr').forEach(function(tr) {
                tr.style.background = '#1e293b';
            });
        });
        
        // Update file input display
        const fileInputDisplays = document.querySelectorAll('.file-input-display');
        fileInputDisplays.forEach(function(el) {
            el.style.background = '#334155';
            el.style.borderColor = '#475569';
            el.style.color = '#e2e8f0';
        });
        
        // Store dark mode state
        localStorage.setItem('darkMode', 'true');
    } else {
        body.style.background = '';
        
        cards.forEach(function(card) {
            card.style.background = '';
            card.style.border = '';
            card.style.boxShadow = '';
        });
        
        if (mainContent) {
            mainContent.style.background = '';
        }
        
        headers.forEach(function(header) {
            header.style.color = '';
        });
        
        subtitles.forEach(function(sub) {
            sub.style.color = '';
        });
        
        const selects = document.querySelectorAll('select');
        selects.forEach(function(select) {
            select.style.background = '';
            select.style.color = '';
            select.style.border = '';
        });
        
        tables.forEach(function(table) {
            table.querySelectorAll('th').forEach(function(th) {
                th.style.background = '';
                th.style.color = '';
                th.style.borderBottom = '';
            });
            table.querySelectorAll('td').forEach(function(td) {
                td.style.color = '';
                td.style.borderBottom = '';
            });
            table.querySelectorAll('tbody tr').forEach(function(tr) {
                tr.style.background = '';
            });
        });
        
        fileInputDisplays.forEach(function(el) {
            el.style.background = '';
            el.style.borderColor = '';
            el.style.color = '';
        });
        
        localStorage.setItem('darkMode', 'false');
    }
}

// Settings functions
function loadSettings() {
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        const themeSelect = document.getElementById('theme-select');
        const refreshSelect = document.getElementById('refresh-select');
        if (themeSelect) {
            themeSelect.value = settings.theme || 'teal';
            applyTheme(settings.theme || 'teal');
        }
        if (refreshSelect) refreshSelect.value = settings.refreshInterval || 'manual';
    } else {
        applyTheme('teal');
    }
}

function saveSettings() {
    const themeValue = document.getElementById('theme-select')?.value || 'teal';
    const refreshValue = document.getElementById('refresh-select')?.value || 'manual';
    
    const settings = {
        theme: themeValue,
        refreshInterval: refreshValue
    };
    localStorage.setItem('dashboardSettings', JSON.stringify(settings));
    
    // Apply the selected theme
    applyTheme(themeValue);
    
    // Show save confirmation
    const statusEl = document.getElementById('settings-status');
    if (statusEl) {
        statusEl.textContent = '✓ Settings saved successfully!';
        statusEl.style.display = 'block';
        statusEl.style.color = '#10b981';
        statusEl.style.marginTop = '1rem';
        setTimeout(function() {
            statusEl.style.display = 'none';
        }, 3000);
    }
}

// Setup file input display
function setupFileInput() {
    const fileInput = document.getElementById('csvFile');
    const fileNameDisplay = document.getElementById('fileName');
    
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                fileNameDisplay.textContent = e.target.files[0].name;
                fileNameDisplay.style.color = '#0d9488';
            } else {
                fileNameDisplay.textContent = 'Choose CSV file...';
            }
        });
    }
}

// Setup upload form handler
function setupUploadHandler() {
    const uploadForm = document.getElementById('uploadForm');
    const resetBtn = document.getElementById('resetBtn');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('csvFile');
            const statusEl = document.getElementById('uploadStatus');
            
            if (!fileInput.files[0]) {
                showStatus('Please select a CSV file', 'error');
                return;
            }
            
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            
            // Show loading state
            const submitBtn = uploadForm.querySelector('.btn-upload');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showStatus(result.message, 'success');
                    document.getElementById('dataInfo').textContent = `✓ Loaded ${result.total_records} policy records`;
                    document.getElementById('resetBtn').style.display = 'inline-flex';
                    
                    // Update data source badge
                    updateDataSource('user');
                    
                    // Refresh analytics with new data
                    fetchAnalytics();
                    
                    // Refresh area analysis if on that page
                    if (document.getElementById('page-area-analysis').classList.contains('active')) {
                        loadAreaAnalysis();
                    }
                } else {
                    showStatus(result.error, 'error');
                }
            } catch (error) {
                showStatus('Error uploading file: ' + error.message, 'error');
            } finally {
                // Restore button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/reset', {
                    method: 'POST'
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    document.getElementById('uploadStatus').textContent = '';
                    document.getElementById('uploadStatus').className = 'upload-status';
                    document.getElementById('dataInfo').textContent = '';
                    document.getElementById('resetBtn').style.display = 'none';
                    document.getElementById('csvFile').value = '';
                    document.getElementById('fileName').textContent = 'Choose CSV file...';
                    document.getElementById('fileName').style.color = '';
                    
                    // Update data source badge
                    updateDataSource('default');
                    
                    // Refresh analytics with default data
                    fetchAnalytics();
                    
                    // Refresh area analysis if on that page
                    if (document.getElementById('page-area-analysis').classList.contains('active')) {
                        loadAreaAnalysis();
                    }
                }
            } catch (error) {
                console.error('Error resetting data:', error);
            }
        });
    }
}

// Update data source display
function updateDataSource(source) {
    const dataSourceEl = document.getElementById('dataSource');
    if (dataSourceEl) {
        if (source === 'user') {
            dataSourceEl.innerHTML = '<i class="fas fa-user-upload"></i><span>Your Data</span>';
            dataSourceEl.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
        } else {
            dataSourceEl.innerHTML = '<i class="fas fa-database"></i><span>Default Dataset</span>';
            dataSourceEl.style.background = 'linear-gradient(135deg, #0d9488, #14b8a6)';
        }
    }
}

// Show status message
function showStatus(message, type) {
    const statusEl = document.getElementById('uploadStatus');
    statusEl.textContent = message;
    statusEl.className = 'upload-status ' + type;
}

// Fetch analytics data from API
async function fetchAnalytics() {
    try {
        const response = await fetch('/api/analytics');
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        updateKPIs(data.kpi);
        renderCharts(data.charts);
        
        // Update data source based on response
        if (data.data_source === 'user_uploaded') {
            updateDataSource('user');
        } else {
            updateDataSource('default');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Load detailed area analysis
async function loadAreaAnalysis() {
    try {
        const response = await fetch('/api/area-analysis');
        const data = await response.json();

        if (data.error) {
            console.error('Error loading area analysis:', data.error);
            return;
        }

        renderAreaDetailCharts(data);
        renderAreaTable(data.area_data);
    } catch (error) {
        console.error('Error loading area analysis:', error);
    }
}

// Render area detail charts
function renderAreaDetailCharts(data) {
    // Teal & Grey premium palette
    const tealGreyPalette = ['#0d9488', '#14b8a6', '#64748b', '#94a3b8', '#475569', '#5eead4', '#374151'];
    
    // Destroy existing detail charts
    if (charts.areaDetailChart) charts.areaDetailChart.destroy();
    if (charts.claimsByAreaChart) charts.claimsByAreaChart.destroy();
    
    // Policy holders by area bar chart
    const areaDetailCtx = document.getElementById('areaDetailChart');
    if (areaDetailCtx && data.area_data) {
        const labels = data.area_data.map(a => a.Area);
        const counts = data.area_data.map(a => a.Premium_Amount_count);
        
        charts.areaDetailChart = new Chart(areaDetailCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Policy Holders',
                    data: counts,
                    backgroundColor: tealGreyPalette.slice(0, labels.length),
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        grid: { color: '#f1f5f9' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    // Claims by area - using teal gradient
    const claimsByAreaCtx = document.getElementById('claimsByAreaChart');
    if (claimsByAreaCtx && data.area_data) {
        const labels = data.area_data.map(a => a.Area);
        const claims = data.area_data.map(a => a.Claim_Amount_sum);
        
        charts.claimsByAreaChart = new Chart(claimsByAreaCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Claims',
                    data: claims,
                    backgroundColor: 'rgba(13, 148, 136, 0.85)',
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        grid: { color: '#f1f5f9' },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

// Render area table
function renderAreaTable(areaData) {
    const tbody = document.getElementById('areaTableBody');
    if (!tbody || !areaData) return;
    
    tbody.innerHTML = areaData.map(area => `
        <tr>
            <td><strong>${area.Area}</strong></td>
            <td>${area.Premium_Amount_count}</td>
            <td>${formatCurrency(area.Premium_Amount_sum)}</td>
            <td>${formatCurrency(area.Claim_Amount_sum)}</td>
            <td style="color: ${area.profit >= 0 ? '#10b981' : '#ef4444'}">${formatCurrency(area.profit)}</td>
            <td>${area.loss_ratio}%</td>
        </tr>
    `).join('');
}

// Update KPI values
function updateKPIs(kpi) {
    document.getElementById('kpi-revenue').textContent = formatCurrency(kpi.revenue);
    document.getElementById('kpi-profit').textContent = formatCurrency(kpi.net_profit);
    document.getElementById('kpi-loss').textContent = kpi.loss_ratio + '%';
    document.getElementById('kpi-policies').textContent = kpi.total_policies.toLocaleString();
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Render all charts
function renderCharts(chartsData) {
    // Color palettes
    const tealPalette = ['#0d9488', '#14b8a6', '#5eead4', '#99f6e4', '#ccfbf1'];
    const vibrantPalette = ['#0d9488', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    // Destroy existing charts
    destroyCharts();
    
    // 1. Area Distribution Chart (Main Chart) - Doughnut
    const areaCtx = document.getElementById('areaChart');
    if (areaCtx) {
        charts.areaChart = new Chart(areaCtx, {
            type: 'doughnut',
            data: {
                labels: chartsData.area_distribution.labels,
                datasets: [{
                    label: 'Number of Policy Holders',
                    data: chartsData.area_distribution.data,
                    backgroundColor: vibrantPalette,
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '55%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                family: "'Plus Jakarta Sans', sans-serif",
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 14 },
                        bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${context.raw} policies (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // 2. Revenue by Policy Type Chart - Bar
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        charts.revenueChart = new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: chartsData.policy_revenue.labels,
                datasets: [{
                    label: 'Revenue',
                    data: chartsData.policy_revenue.data,
                    backgroundColor: tealPalette.slice(0, chartsData.policy_revenue.labels.length),
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 14 },
                        bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return 'Revenue: ' + formatCurrency(context.raw);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f1f5f9' },
                        ticks: {
                            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'k';
                            }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
                        }
                    }
                }
            }
        });
    }
    
    // 3. Claim Status Chart - Pie
    const claimCtx = document.getElementById('claimChart');
    if (claimCtx) {
        charts.claimChart = new Chart(claimCtx, {
            type: 'pie',
            data: {
                labels: chartsData.claim_status.labels,
                datasets: [{
                    data: chartsData.claim_status.data,
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#64748b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                family: "'Plus Jakarta Sans', sans-serif",
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 14 },
                        bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13 },
                        padding: 12,
                        cornerRadius: 8
                    }
                }
            }
        });
    }
    
    // 4. Income vs Premium Chart - Line
    const incomeCtx = document.getElementById('incomeChart');
    if (incomeCtx) {
        charts.incomeChart = new Chart(incomeCtx, {
            type: 'line',
            data: {
                labels: chartsData.income_premium.labels,
                datasets: [{
                    label: 'Avg Premium',
                    data: chartsData.income_premium.data,
                    borderColor: '#0d9488',
                    backgroundColor: 'rgba(13, 148, 136, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#0d9488',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 14 },
                        bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return 'Avg Premium: ' + formatCurrency(context.raw);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f1f5f9' },
                        ticks: {
                            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
                        }
                    }
                }
            }
        });
    }
}

// Destroy all chart instances
function destroyCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
}
