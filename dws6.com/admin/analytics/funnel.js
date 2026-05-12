/**
 * Funnel Analytics Dashboard — Client-side logic
 * GTM Machine Phase 2b
 */

let funnelChart = null;

async function loadDashboard() {
  const vertical = document.getElementById('vertical').value;
  const company_size = document.getElementById('company_size').value;
  const region = document.getElementById('region').value;
  const days = document.getElementById('days').value;

  // Build query string
  const params = new URLSearchParams();
  if (vertical) params.append('vertical', vertical);
  if (company_size) params.append('company_size', company_size);
  if (region) params.append('region', region);
  if (days) params.append('days', days);

  try {
    // Clear error
    document.getElementById('error').innerHTML = '';

    // Fetch funnel data
    const response = await fetch(`/api/v1/analytics/funnel?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Update metrics
    updateMetrics(data.metrics);

    // Update email engagement
    updateEmailEngagement(data.email_engagement);

    // Update funnel table
    updateFunnelTable(data.funnel);

    // Update funnel chart
    updateFunnelChart(data.funnel);
  } catch (err) {
    console.error('Dashboard error:', err);
    const errorDiv = document.getElementById('error');
    errorDiv.innerHTML = `<div class="error">❌ Failed to load dashboard: ${err.message}</div>`;
  }
}

function updateMetrics(metrics) {
  document.getElementById('totalEntries').textContent = formatNumber(metrics.total_entries);
  document.getElementById('completionRate').textContent = formatPercent(metrics.completion_rate);
  document.getElementById('revenue').textContent = formatCurrency(metrics.revenue_eur);
  document.getElementById('aov').textContent = formatCurrency(metrics.aov_eur);
}

function updateEmailEngagement(engagement) {
  document.getElementById('emailOpens').textContent = formatPercent(engagement.step_4_opens);
  document.getElementById('emailClicks').textContent = formatPercent(engagement.step_4_clicks);
  document.getElementById('formStarts').textContent = formatPercent(engagement.form_starts);
  document.getElementById('formCompletes').textContent = formatPercent(engagement.form_completes);
}

function updateFunnelTable(funnel) {
  const tbody = document.getElementById('funnelTable');
  tbody.innerHTML = funnel
    .map(
      (step) => `
    <tr>
      <td><span class="step-label">Step ${step.step}: ${step.label}</span></td>
      <td>${formatNumber(step.enters)}</td>
      <td>${formatNumber(step.completes)}</td>
      <td>${formatNumber(step.drop_off)}</td>
      <td>
        <span class="conversion-bar" style="width: ${step.conversion_rate * 100}px;"></span>
        ${formatPercent(step.conversion_rate)}
      </td>
    </tr>
  `,
    )
    .join('');
}

function updateFunnelChart(funnel) {
  const ctx = document.getElementById('funnelChart').getContext('2d');

  // Destroy existing chart if it exists
  if (funnelChart) {
    funnelChart.destroy();
  }

  // Create new chart
  funnelChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: funnel.map((s) => `${s.label}\n(Step ${s.step})`),
      datasets: [
        {
          label: 'Entries',
          data: funnel.map((s) => s.enters),
          backgroundColor: 'rgba(96, 165, 250, 0.8)',
          borderColor: 'rgba(96, 165, 250, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Completes',
          data: funnel.map((s) => s.completes),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Drop-off',
          data: funnel.map((s) => s.drop_off),
          backgroundColor: 'rgba(244, 63, 94, 0.8)',
          borderColor: 'rgba(244, 63, 94, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#cbd5e1',
            font: {
              size: 12,
              weight: '600',
            },
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${formatNumber(context.parsed.y)}`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: false,
          grid: {
            display: false,
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#cbd5e1',
            font: {
              size: 11,
            },
          },
        },
        y: {
          stacked: false,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#cbd5e1',
            font: {
              size: 11,
            },
            callback: function (value) {
              return formatNumber(value);
            },
          },
        },
      },
    },
  });
}

function formatNumber(num) {
  if (typeof num !== 'number') return '—';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return Math.round(num).toString();
}

function formatPercent(decimal) {
  if (typeof decimal !== 'number') return '—';
  return (decimal * 100).toFixed(1) + '%';
}

function formatCurrency(amount) {
  if (typeof amount !== 'number') return '—';
  return amount.toLocaleString('en-EU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
});
