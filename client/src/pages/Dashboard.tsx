import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppWindow, Database, HardDrive, Zap,
  PauseCircle, AlertCircle, Plus, Activity,
  Terminal, TrendingUp, Cpu, ArrowRight
} from 'lucide-react';
import { stats, apps } from '../api';
import type { DashboardStats, App } from '../types';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatUptime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function MetricBlock({ label, value, sub, accent = false }: {
  label: string; value: string | number; sub?: string; accent?: boolean;
}) {
  return (
    <div
      className="flex flex-col justify-between p-4 rounded-xl"
      style={{
        background: accent ? 'hsl(120 100% 50% / 0.07)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${accent ? 'hsl(120 100% 50% / 0.25)' : 'hsl(120 100% 50% / 0.1)'}`,
      }}
    >
      <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'hsl(120 100% 50% / 0.5)' }}>{label}</p>
      <div className="mt-3">
        <p className={`text-3xl font-display font-bold ${accent ? 'text-primary' : 'text-white'}`}>{value}</p>
        {sub && <p className="text-xs font-mono mt-1" style={{ color: 'hsl(120 100% 50% / 0.4)' }}>{sub}</p>}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: App['status'] }) {
  const cfg = {
    running: { bg: 'hsl(120 100% 50% / 0.12)', border: 'hsl(120 100% 50% / 0.3)', text: 'hsl(120 100% 60%)', dot: '#22c55e' },
    suspended: { bg: 'hsl(40 100% 50% / 0.12)', border: 'hsl(40 100% 50% / 0.3)', text: 'hsl(40 100% 65%)', dot: '#f59e0b' },
    paused: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#6b7280', dot: '#4b5563' },
  }[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {status}
    </span>
  );
}

export default function Dashboard() {
  const [dashStats, setDashStats] = useState<DashboardStats | null>(null);
  const [recentApps, setRecentApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([stats.get(), apps.list()])
      .then(([statsRes, appsRes]) => {
        setDashStats(statsRes.data);
        setRecentApps(appsRes.data.slice(0, 5));
      })
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'hsl(120 100% 50% / 0.6)', borderTopColor: 'transparent' }} />
        <p className="text-xs font-mono" style={{ color: 'hsl(120 100% 50% / 0.5)' }}>loading system data...</p>
      </div>
    );
  }

  const diskPct = dashStats && dashStats.storage.disk.total > 0
    ? Math.round((dashStats.storage.disk.used / dashStats.storage.disk.total) * 100)
    : null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(120 100% 50% / 0.1)', border: '1px solid hsl(120 100% 50% / 0.3)' }}>
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-white tracking-widest">COMMAND CENTER</h1>
            <p className="text-xs font-mono" style={{ color: 'hsl(120 100% 50% / 0.5)' }}>wolfXbase · system overview</p>
          </div>
        </div>
        <Link
          to="/dashboard/apps/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono font-medium text-black transition-all hover:opacity-90"
          style={{ background: 'hsl(120 100% 50%)' }}
        >
          <Plus className="w-4 h-4" /> New App
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 rounded-lg px-4 py-3 text-sm font-mono"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {dashStats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricBlock label="Running" value={dashStats.apps.running} sub={`of ${dashStats.apps.total} apps`} accent />
            <MetricBlock label="Suspended" value={dashStats.apps.suspended} />
            <MetricBlock label="Paused" value={dashStats.apps.paused} />
            <MetricBlock label="Data Size" value={formatBytes(dashStats.storage.dataSize)} sub="stored on disk" />
          </div>

          <div className="grid lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 rounded-xl overflow-hidden" style={{ border: '1px solid hsl(120 100% 50% / 0.12)' }}>
              <div className="flex items-center justify-between px-5 py-3" style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid hsl(120 100% 50% / 0.1)' }}>
                <div className="flex items-center gap-2">
                  <AppWindow className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-widest text-white">Recent Apps</span>
                </div>
                <Link to="/dashboard/apps" className="flex items-center gap-1 text-xs font-mono transition-colors hover:text-white" style={{ color: 'hsl(120 100% 50% / 0.6)' }}>
                  view all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)' }}>
                {recentApps.length === 0 ? (
                  <div className="py-12 text-center">
                    <Database className="w-10 h-10 mx-auto mb-3" style={{ color: 'hsl(120 100% 50% / 0.15)' }} />
                    <p className="text-sm font-mono" style={{ color: 'hsl(120 100% 50% / 0.4)' }}>no apps yet</p>
                    <Link to="/dashboard/apps/new" className="text-xs font-mono mt-2 inline-block text-primary hover:underline">
                      create your first app →
                    </Link>
                  </div>
                ) : recentApps.map((app, i) => (
                  <Link
                    key={app._id}
                    to={`/dashboard/apps/${app._id}`}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.03] group"
                    style={{ borderBottom: i < recentApps.length - 1 ? '1px solid hsl(120 100% 50% / 0.07)' : 'none' }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-white text-xs font-bold font-display"
                      style={{ backgroundColor: app.color }}
                    >
                      {app.displayName[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{app.displayName}</p>
                      <p className="text-xs font-mono truncate" style={{ color: 'hsl(120 100% 50% / 0.4)' }}>{app.name}</p>
                    </div>
                    <StatusPill status={app.status} />
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'hsl(120 100% 50% / 0.6)' }} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className="rounded-xl p-5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid hsl(120 100% 50% / 0.12)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-widest text-white">MongoDB Node</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'version', value: `v${dashStats.mongodb.version}` },
                    { label: 'uptime', value: formatUptime(dashStats.mongodb.uptime) },
                    { label: 'connections', value: dashStats.mongodb.connections?.current !== undefined ? `${dashStats.mongodb.connections.current} active` : '–' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid hsl(120 100% 50% / 0.07)' }}>
                      <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'hsl(120 100% 50% / 0.4)' }}>{label}</span>
                      <span className="text-xs font-mono text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {diskPct !== null && (
                <div className="rounded-xl p-5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid hsl(120 100% 50% / 0.12)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-primary" />
                      <span className="text-xs font-mono font-semibold uppercase tracking-widest text-white">Disk</span>
                    </div>
                    <span className="text-xs font-mono" style={{ color: diskPct > 90 ? '#f87171' : diskPct > 70 ? '#f59e0b' : 'hsl(120 100% 50%)' }}>
                      {diskPct}%
                    </span>
                  </div>
                  <div className="w-full rounded-full h-1.5 mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, diskPct)}%`,
                        background: diskPct > 90 ? '#ef4444' : diskPct > 70 ? '#f59e0b' : 'hsl(120 100% 50%)',
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-mono" style={{ color: 'hsl(120 100% 50% / 0.35)' }}>
                    <span>{formatBytes(dashStats.storage.disk.used)} used</span>
                    <span>{formatBytes(dashStats.storage.disk.total)} total</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/dashboard/apps/new"
                  className="flex flex-col items-center gap-2 py-4 rounded-xl text-xs font-mono font-semibold text-black transition-all hover:opacity-90"
                  style={{ background: 'hsl(120 100% 50%)' }}
                >
                  <Plus className="w-4 h-4" />
                  New App
                </Link>
                <Link
                  to="/dashboard/databases"
                  className="flex flex-col items-center gap-2 py-4 rounded-xl text-xs font-mono font-semibold transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid hsl(120 100% 50% / 0.15)', color: 'hsl(120 100% 50% / 0.8)' }}
                >
                  <Database className="w-4 h-4" />
                  Databases
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid hsl(120 100% 50% / 0.1)' }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'hsl(120 100% 50% / 0.5)' }}>System Pulse</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Zap, label: 'Running Apps', val: dashStats.apps.running, color: 'text-primary' },
                { icon: PauseCircle, label: 'Paused Apps', val: dashStats.apps.paused, color: 'text-gray-500' },
                { icon: AlertCircle, label: 'Suspended', val: dashStats.apps.suspended, color: 'text-amber-400' },
                { icon: Cpu, label: 'Total Apps', val: dashStats.apps.total, color: 'text-blue-400' },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                  <div>
                    <p className="text-base font-bold font-display text-white">{val}</p>
                    <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
