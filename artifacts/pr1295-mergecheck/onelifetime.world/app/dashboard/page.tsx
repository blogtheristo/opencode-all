'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/auth';

interface DashboardStats {
  projects: number;
  reports: number;
  agents: number;
  carbonSaved: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    reports: 0,
    agents: 0,
    carbonSaved: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function loadStats() {
      // In production, fetch from database
      // For now, use placeholder data
      setStats({
        projects: 12,
        reports: 47,
        agents: 5,
        carbonSaved: 2340,
      });
      setLoading(false);
    }
    
    loadStats();
  }, []);

  const statCards = [
    { 
      label: 'Active Projects', 
      value: stats.projects, 
      icon: '📊',
      change: '+2 this month',
      color: 'blue' 
    },
    { 
      label: 'Reports Generated', 
      value: stats.reports, 
      icon: '📄',
      change: '+12 this week',
      color: 'green' 
    },
    { 
      label: 'AI Agents Running', 
      value: stats.agents, 
      icon: '🤖',
      change: 'All operational',
      color: 'purple' 
    },
    { 
      label: 'Carbon Saved (kg)', 
      value: stats.carbonSaved.toLocaleString(), 
      icon: '🌱',
      change: '+340 this week',
      color: 'emerald' 
    },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here&apos;s your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`badge badge-${stat.color === 'blue' ? 'info' : stat.color === 'green' ? 'success' : stat.color === 'purple' ? 'info' : 'success'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-slate-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-secondary px-4 py-3 text-left">
              <span className="block text-sm font-medium">New Report</span>
              <span className="text-xs text-slate-400">Generate analysis</span>
            </button>
            <button className="btn-secondary px-4 py-3 text-left">
              <span className="block text-sm font-medium">Add Project</span>
              <span className="text-xs text-slate-400">Create project</span>
            </button>
            <button className="btn-secondary px-4 py-3 text-left">
              <span className="block text-sm font-medium">Run Agent</span>
              <span className="text-xs text-slate-400">Start AI task</span>
            </button>
            <button className="btn-secondary px-4 py-3 text-left">
              <span className="block text-sm font-medium">View Metrics</span>
              <span className="text-xs text-slate-400">Carbon tracking</span>
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Report generated', project: 'Helsinki HQ', time: '2 hours ago' },
              { action: 'Carbon calculation', project: 'Tampere Office', time: '5 hours ago' },
              { action: 'Agent completed', project: 'Oulu Warehouse', time: '1 day ago' },
              { action: 'Project updated', project: 'Turku Retail', time: '2 days ago' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="flex-1">
                  <span className="text-white">{activity.action}</span>
                  <span className="text-slate-400"> - {activity.project}</span>
                </div>
                <span className="text-slate-500 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">System Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'MCP Hub', status: 'Operational', color: 'success' },
            { name: 'AI Agents', status: 'Running', color: 'success' },
            { name: 'Database', status: 'Healthy', color: 'success' },
            { name: 'API', status: 'Online', color: 'success' },
          ].map((service) => (
            <div key={service.name} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${service.color === 'success' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
              <span className="text-slate-300 text-sm">{service.name}</span>
              <span className={`text-xs ${service.color === 'success' ? 'text-green-400' : 'text-yellow-400'}`}>
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
