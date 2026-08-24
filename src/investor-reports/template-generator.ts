/**
 * Investor Reporting - Template Generator
 * Generates formatted reports (Markdown, HTML) for PDF/email delivery
 */

import { type InvestorReportData } from './types';

// ============================================================================
// TEMPLATE GENERATOR
// ============================================================================

export class TemplateGenerator {
  /**
   * Generate Markdown report
   */
  generateMarkdown(data: InvestorReportData): string {
    const sections: string[] = [];

    // Header
    sections.push(this.generateHeader(data));

    // Executive Summary
    sections.push(this.generateExecutiveSummary(data));

    // Founder Letter
    if (data.founder_letter) {
      sections.push(this.generateFounderLetter(data));
    }

    // KPI Summary Table
    sections.push(this.generateKPITable(data));

    // Detailed Metrics
    sections.push(this.generateDetailedMetrics(data));

    // Key Events
    sections.push(this.generateKeyEvents(data));

    // Outlook
    if (data.outlook) {
      sections.push(this.generateOutlook(data));
    }

    return sections.join('\n\n---\n\n');
  }

  /**
   * Generate HTML report (for PDF rendering)
   */
  generateHTML(data: InvestorReportData): string {
    const markdown = this.generateMarkdown(data);

    // Simple Markdown to HTML conversion (in production, use a proper library like marked.js)
    const html = markdown
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/---/g, '<hr>');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Monthly Investor Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    h1 { font-size: 28px; margin-bottom: 10px; color: #000; }
    h2 { font-size: 22px; margin-top: 30px; margin-bottom: 15px; color: #111; border-bottom: 2px solid #eee; padding-bottom: 5px; }
    h3 { font-size: 18px; margin-top: 20px; margin-bottom: 10px; color: #222; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f8f9fa; font-weight: 600; }
    tr:hover { background-color: #f5f5f5; }
    .metric-value { font-size: 24px; font-weight: bold; color: #000; }
    .metric-change.positive { color: #22c55e; }
    .metric-change.negative { color: #ef4444; }
    .date { color: #666; font-size: 14px; }
    hr { border: none; border-top: 1px solid #eee; margin: 30px 0; }
    .key-event { margin-bottom: 15px; padding: 10px; background: #f9fafb; border-left: 3px solid #3b82f6; }
    .key-event.loss { border-left-color: #ef4444; background: #fef2f2; }
    .key-event.milestone { border-left-color: #22c55e; background: #f0fdf4; }
  </style>
</head>
<body>
  ${html}
</body>
</html>
    `.trim();
  }

  // ==========================================================================
  // SECTION GENERATORS
  // ==========================================================================

  private generateHeader(data: InvestorReportData): string {
    const monthYear = data.report_period.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    return `# Monthly Investor Report\n## ${monthYear}\n\n_Generated on ${data.generated_at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}_`;
  }

  private generateExecutiveSummary(data: InvestorReportData): string {
    if (!data.executive_summary) {
      return '';
    }

    return `## Executive Summary\n\n${data.executive_summary}`;
  }

  private generateFounderLetter(data: InvestorReportData): string {
    if (!data.founder_letter) {
      return '';
    }

    return `## Founder Letter\n\n${data.founder_letter}`;
  }

  private generateKPITable(data: InvestorReportData): string {
    const { mrr_metrics, arr_metrics, customer_metrics, cash_metrics } = data;

    const mrrChange = mrr_metrics.mrr_growth >= 0 ? '+' : '';
    const mrrChangePct = mrr_metrics.mrr_growth_rate.toFixed(1);

    const rows = [
      ['Metric', 'Current', 'Previous', 'Change'],
      ['---', '---', '---', '---'],
      [
        'MRR',
        `€${mrr_metrics.current_mrr.toLocaleString()}`,
        `€${mrr_metrics.previous_month_mrr.toLocaleString()}`,
        `${mrrChange}€${Math.abs(mrr_metrics.mrr_growth).toLocaleString()} (${mrrChange}${mrrChangePct}%)`,
      ],
      [
        'ARR',
        `€${arr_metrics.current_arr.toLocaleString()}`,
        `€${arr_metrics.previous_quarter_arr.toLocaleString()}`,
        `${arr_metrics.arr_growth >= 0 ? '+' : ''}€${Math.abs(arr_metrics.arr_growth).toLocaleString()}`,
      ],
      [
        'Active Customers',
        `${customer_metrics.active_customers}`,
        '-',
        '-',
      ],
      [
        'Churn Rate',
        `${customer_metrics.monthly_churn_rate.toFixed(1)}%`,
        '-',
        '-',
      ],
      [
        'Cash Balance',
        `€${cash_metrics.current_cash.toLocaleString()}`,
        `€${cash_metrics.previous_month_cash.toLocaleString()}`,
        `${cash_metrics.cash_change >= 0 ? '+' : ''}€${Math.abs(cash_metrics.cash_change).toLocaleString()}`,
      ],
      [
        'Runway',
        `${cash_metrics.runway_months.toFixed(1)} months`,
        '-',
        `Until ${cash_metrics.runway_date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
      ],
    ];

    const table = rows.map(row => `| ${row.join(' | ')} |`).join('\n');

    return `## Key Performance Indicators\n\n${table}`;
  }

  private generateDetailedMetrics(data: InvestorReportData): string {
    const sections: string[] = ['## Detailed Metrics'];

    // MRR Breakdown
    sections.push('### MRR Movement');
    sections.push(`
| Type | Amount |
| --- | --- |
| New MRR | €${data.mrr_metrics.new_mrr.toLocaleString()} |
| Expansion MRR | €${data.mrr_metrics.expansion_mrr.toLocaleString()} |
| Contraction MRR | -€${data.mrr_metrics.contraction_mrr.toLocaleString()} |
| Churned MRR | -€${data.mrr_metrics.churned_mrr.toLocaleString()} |
| **Net New MRR** | **€${data.mrr_metrics.net_new_mrr.toLocaleString()}** |
    `.trim());

    // Customer Metrics
    sections.push('### Customer Metrics');
    sections.push(`
| Metric | Value |
| --- | --- |
| Total Customers | ${data.customer_metrics.total_customers} |
| Active Customers | ${data.customer_metrics.active_customers} |
| Trial Customers | ${data.customer_metrics.trial_customers} |
| Churned This Month | ${data.customer_metrics.monthly_churn_count} |
| Retention Rate | ${data.customer_metrics.retention_rate.toFixed(1)}% |
| Avg Customer Lifetime | ${data.customer_metrics.customer_lifetime_months.toFixed(1)} months |
    `.trim());

    // Pipeline Metrics
    sections.push('### Sales Pipeline');
    sections.push(`
| Metric | Value |
| --- | --- |
| Total Pipeline Value | €${(data.pipeline_metrics.total_pipeline_value / 1000).toFixed(0)}k |
| Qualified Pipeline | €${(data.pipeline_metrics.qualified_pipeline_value / 1000).toFixed(0)}k |
| Weighted Pipeline | €${(data.pipeline_metrics.weighted_pipeline_value / 1000).toFixed(0)}k |
| Active Leads | ${data.pipeline_metrics.leads_count} |
| Meetings Booked | ${data.pipeline_metrics.meetings_count} |
| Proposals Out | ${data.pipeline_metrics.proposals_count} |
| Closed Won | ${data.pipeline_metrics.closed_won_count} |
| Meeting Conversion | ${data.pipeline_metrics.meeting_conversion_rate.toFixed(1)}% |
| Win Rate | ${data.pipeline_metrics.win_rate.toFixed(1)}% |
    `.trim());

    // Unit Economics (if available)
    if (data.unit_economics) {
      sections.push('### Unit Economics');
      sections.push(`
| Metric | Value |
| --- | --- |
| CAC | €${data.unit_economics.cac.toLocaleString()} |
| LTV | €${data.unit_economics.ltv.toLocaleString()} |
| LTV:CAC Ratio | ${data.unit_economics.ltv_cac_ratio.toFixed(1)}x |
| Payback Period | ${data.unit_economics.payback_months.toFixed(1)} months |
| ARPU | €${data.unit_economics.arpu.toLocaleString()}/month |
      `.trim());
    }

    return sections.join('\n\n');
  }

  private generateKeyEvents(data: InvestorReportData): string {
    const sections: string[] = ['## Key Events'];

    // Wins
    if (data.key_wins && data.key_wins.length > 0) {
      sections.push('### Wins');
      data.key_wins.forEach(win => {
        sections.push(
          `- **${win.title}** (${win.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}): ${win.description} ${win.impact ? `[${win.impact}]` : ''}`
        );
      });
    }

    // Losses
    if (data.key_losses && data.key_losses.length > 0) {
      sections.push('### Losses');
      data.key_losses.forEach(loss => {
        sections.push(
          `- **${loss.title}** (${loss.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}): ${loss.description} ${loss.impact ? `[${loss.impact}]` : ''}`
        );
      });
    }

    // Milestones
    if (data.key_milestones && data.key_milestones.length > 0) {
      sections.push('### Milestones');
      data.key_milestones.forEach(milestone => {
        sections.push(
          `- **${milestone.title}** (${milestone.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}): ${milestone.description} ${milestone.impact ? `[${milestone.impact}]` : ''}`
        );
      });
    }

    return sections.join('\n\n');
  }

  private generateOutlook(data: InvestorReportData): string {
    if (!data.outlook) {
      return '';
    }

    return `## Outlook\n\n${data.outlook}`;
  }

  // ==========================================================================
  // HISTORICAL CHARTS (Placeholder)
  // ==========================================================================

  /**
   * Generate chart data for frontend rendering
   */
  generateChartData(data: InvestorReportData) {
    return {
      mrr_chart: {
        labels: data.historical_mrr.map(d =>
          d.month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        ),
        data: data.historical_mrr.map(d => d.value),
      },
      arr_chart: {
        labels: data.historical_arr.map(d =>
          d.month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        ),
        data: data.historical_arr.map(d => d.value),
      },
      customers_chart: {
        labels: data.historical_customers.map(d =>
          d.month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        ),
        data: data.historical_customers.map(d => d.count),
      },
      cash_chart: {
        labels: data.historical_cash.map(d =>
          d.month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        ),
        data: data.historical_cash.map(d => d.balance),
      },
    };
  }
}

// Export singleton instance
export const templateGenerator = new TemplateGenerator();
