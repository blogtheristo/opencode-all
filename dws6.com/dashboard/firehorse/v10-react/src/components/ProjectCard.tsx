/**
 * Project Card Component
 * Individual project display with RAG status, metrics, and compliance
 */

import type { Project } from '../types/dashboard';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getRAGColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'bg-green-500';
      case 'amber':
        return 'bg-yellow-500';
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-background0';
    }
  };

  const getSPIColor = (spi: number) => {
    if (spi >= 0.95) return 'text-green-600';
    if (spi >= 0.85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCPIColor = (cpi: number) => {
    if (cpi >= 0.95) return 'text-green-600';
    if (cpi >= 0.85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="card hover:shadow-lg transition-shadow cursor-pointer group">
      {/* Header with Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg group-hover:text-primary-600 transition-colors">
            {project.name}
          </h3>
          {project.location && (
            <p className="text-sm text-fg-muted mt-1">📍 {project.location}</p>
          )}
        </div>
        <div className={`w-3 h-3 rounded-full ${getRAGColor(project.status)} flex-shrink-0`} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-fg-muted mb-1">SPI</p>
          <p className={`text-2xl font-bold ${getSPIColor(project.spi)}`}>
            {project.spi.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-fg-muted mb-1">CPI</p>
          <p className={`text-2xl font-bold ${getCPIColor(project.cpi)}`}>
            {project.cpi.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Carbon Footprint */}
      <div className="bg-emerald-50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Carbon Tracked</span>
          <span className="font-semibold text-emerald-700">
            {(project.carbon_footprint / 1000).toFixed(1)}t CO₂e
          </span>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="space-y-2">
        <p className="text-xs text-fg-muted font-medium">Compliance Status</p>
        <div className="grid grid-cols-2 gap-2">
          <ComplianceBadge label="CSRD" status={project.compliance_status.csrd} />
          <ComplianceBadge label="EPBD" status={project.compliance_status.epbd} />
          <ComplianceBadge label="ETS" status={project.compliance_status.ets} />
          <ComplianceBadge label="CBAM" status={project.compliance_status.cbam} />
        </div>
      </div>

      {/* Budget Info */}
      {project.budget && project.spent !== undefined && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-fg-muted">Budget</span>
            <span className="font-semibold text-foreground">
              {((project.spent / project.budget) * 100).toFixed(0)}% spent
            </span>
          </div>
          <div className="mt-2 w-full bg-fg-muted/20 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((project.spent / project.budget) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ComplianceBadge({ label, status }: { label: string; status: boolean }) {
  return (
    <div
      className={`text-xs px-2 py-1 rounded text-center font-medium ${
        status
          ? 'bg-green-100 text-green-700'
          : 'bg-border text-fg-muted'
      }`}
    >
      {status ? '✓' : '○'} {label}
    </div>
  );
}
