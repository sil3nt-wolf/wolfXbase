import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Database, ArrowRight, Play, Pause, Ban, User, LayoutGrid, List } from 'lucide-react';
import { apps as appsApi, auth as authApi } from '../api';
import type { App } from '../types';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

const STATUS_CFG = {
  running: { dot: '#22c55e', bg: 'hsl(120 100% 50% / 0.1)', border: 'hsl(120 100% 50% / 0.25)', text: 'hsl(120 100% 60%)' },
  suspended: { dot: '#f59e0b', bg: 'hsl(40 100% 50% / 0.1)', border: 'hsl(40 100% 50% / 0.25)', text: '#fbbf24' },
  paused: { dot: '#4b5563', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', text: '#6b7280' },
};

function StatusChip({ status }: { status: App['status'] }) {
  const c = STATUS_CFG[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {status}
    </span>
  );
}

function AppCard({ app, onStatus, actionLoading, isAdmin }: {
  app: App;
  onStatus: (id: string, s: App['status']) => void;
  actionLoading: string | null;
  isAdmin: boolean;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col group transition-all hover:scale-[1.01]"
      style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid hsl(120 100% 50% / 0.12)' }}
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: app.color }} />
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-white font-bold font-display text-sm"
              style={{ backgroundColor: app.color }}
            >
              {app.displayName[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate">{app.displayName}</p>
              <p className="text-xs font-mono truncate" style={{ color: 'hsl(120 100% 50% / 0.45)' }}>{app.name}</p>
            </div>
          </div>
          <StatusChip status={app.status} />
        </div>

        {app.description && (
          <p className="text-xs leading-relaxed truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{app.description}</p>
        )}

        {app.stats && (
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Collections', val: app.stats.collections },
              { label: 'Size', val: formatBytes(app.stats.dataSize) },
            ].map(({ label, val }) => (
              <div key={label} className="rounded-lg px-3 py-2 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-sm font-bold text-white font-display">{val}</p>
                <p className="text-xs font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
              </div>
            ))}
          </div>
        )}

        {isAdmin && app.owner && (
          <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: '#a78bfa' }}>
            <User className="w-3 h-3" /> {app.owner}
          </div>
        )}
      </div>

      <div className="px-5 py-3 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid hsl(120 100% 50% / 0.08)' }}>
        <div className="flex items-center gap-1">
          {app.status !== 'running' && (
            <button title="Resume" onClick={() => onStatus(app._id, 'running')} disabled={!!actionLoading}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/5 text-green-400">
              <Play className="w-3.5 h-3.5" />
            </button>
          )}
          {app.status !== 'paused' && (
            <button title="Pause" onClick={() => onStatus(app._id, 'paused')} disabled={!!actionLoading}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/5 text-gray-500">
              <Pause className="w-3.5 h-3.5" />
            </button>
          )}
          {app.status !== 'suspended' && (
            <button title="Suspend" onClick={() => onStatus(app._id, 'suspended')} disabled={!!actionLoading}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/5 text-amber-500">
              <Ban className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <Link
          to={`/dashboard/apps/${app._id}`}
          className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg transition-all"
          style={{ color: 'hsl(120 100% 50% / 0.7)', border: '1px solid hsl(120 100% 50% / 0.15)' }}
        >
          Manage <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

function AppRow({ app, onStatus, actionLoading, isAdmin }: {
  app: App;
  onStatus: (id: string, s: App['status']) => void;
  actionLoading: string | null;
  isAdmin: boolean;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
      style={{ borderBottom: '1px solid hsl(120 100% 50% / 0.07)' }}>
      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_CFG[app.status].dot }} />
      <div
        className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white text-xs font-bold font-display"
        style={{ backgroundColor: app.color }}
      >
        {app.displayName[0]?.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{app.displayName}</p>
        <p className="text-xs font-mono truncate" style={{ color: 'hsl(120 100% 50% / 0.4)' }}>{app.name}</p>
      </div>
      {isAdmin && app.owner && (
        <span className="hidden sm:flex items-center gap-1 text-xs font-mono" style={{ color: '#a78bfa' }}>
          <User className="w-3 h-3" /> {app.owner}
        </span>
      )}
      {app.stats && (
        <div className="hidden md:flex flex-col items-end text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <span>{app.stats.collections} col</span>
          <span>{formatBytes(app.stats.dataSize)}</span>
        </div>
      )}
      <StatusChip status={app.status} />
      <div className="flex items-center gap-1">
        {app.status !== 'running' && (
          <button onClick={() => onStatus(app._id, 'running')} disabled={!!actionLoading}
            className="p-1.5 rounded transition-colors hover:bg-white/5 text-green-400">
            <Play className="w-3.5 h-3.5" />
          </button>
        )}
        {app.status !== 'paused' && (
          <button onClick={() => onStatus(app._id, 'paused')} disabled={!!actionLoading}
            className="p-1.5 rounded transition-colors hover:bg-white/5 text-gray-500">
            <Pause className="w-3.5 h-3.5" />
          </button>
        )}
        {app.status !== 'suspended' && (
          <button onClick={() => onStatus(app._id, 'suspended')} disabled={!!actionLoading}
            className="p-1.5 rounded transition-colors hover:bg-white/5 text-amber-500">
            <Ban className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <Link to={`/dashboard/apps/${app._id}`}
        className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
        style={{ color: 'hsl(120 100% 50% / 0.5)' }}>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function Apps() {
  const [appList, setAppList] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | App['status']>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const load = () => {
    setLoading(true);
    appsApi.list().then((r) => setAppList(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    authApi.me().then((r) => setIsAdmin(r.data.username === 'admin'));
  }, []);

  const handleStatus = async (id: string, status: App['status']) => {
    setActionLoading(id + status);
    try {
      await appsApi.updateStatus(id, status);
      setAppList((prev) => prev.map((a) => a._id === id ? { ...a, status } : a));
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = appList.filter((a) => {
    const s = a.displayName.toLowerCase().includes(search.toLowerCase()) || a.name.toLowerCase().includes(search.toLowerCase());
    const f = filter === 'all' || a.status === filter;
    return s && f;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-white tracking-widest">APPS</h1>
          <p className="text-xs font-mono mt-0.5" style={{ color: 'hsl(120 100% 50% / 0.45)' }}>
            {appList.length} registered · {appList.filter(a => a.status === 'running').length} running
          </p>
        </div>
        <Link
          to="/dashboard/apps/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono font-medium text-black self-start transition-all hover:opacity-90"
          style={{ background: 'hsl(120 100% 50%)' }}
        >
          <Plus className="w-4 h-4" /> New App
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(120 100% 50% / 0.4)' }} />
          <input
            type="text"
            placeholder="search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm font-mono text-white placeholder-gray-700 outline-none transition-all"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid hsl(120 100% 50% / 0.15)', caretColor: 'hsl(120 100% 50%)' }}
          />
        </div>
        <div className="flex gap-1 rounded-lg p-1" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid hsl(120 100% 50% / 0.12)' }}>
          {(['all', 'running', 'suspended', 'paused'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-md text-xs font-mono capitalize transition-colors"
              style={filter === f
                ? { background: 'hsl(120 100% 50% / 0.15)', color: 'hsl(120 100% 50%)', border: '1px solid hsl(120 100% 50% / 0.3)' }
                : { color: 'rgba(255,255,255,0.3)' }}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-lg p-1" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid hsl(120 100% 50% / 0.12)' }}>
          {([['grid', LayoutGrid], ['list', List]] as const).map(([v, Icon]) => (
            <button key={v} onClick={() => setView(v)}
              className="p-1.5 rounded-md transition-colors"
              style={view === v ? { background: 'hsl(120 100% 50% / 0.15)', color: 'hsl(120 100% 50%)' } : { color: 'rgba(255,255,255,0.25)' }}>
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'hsl(120 100% 50% / 0.5)', borderTopColor: 'transparent' }} />
          <p className="text-xs font-mono" style={{ color: 'hsl(120 100% 50% / 0.4)' }}>fetching apps...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl p-14 text-center" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid hsl(120 100% 50% / 0.1)' }}>
          <Database className="w-10 h-10 mx-auto mb-4" style={{ color: 'hsl(120 100% 50% / 0.15)' }} />
          <p className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {search || filter !== 'all' ? 'no apps match your filters' : 'no apps yet'}
          </p>
          {!search && filter === 'all' && (
            <Link to="/dashboard/apps/new" className="text-xs font-mono mt-3 inline-block text-primary hover:underline">
              create your first app →
            </Link>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((app) => (
            <AppCard key={app._id} app={app} onStatus={handleStatus} actionLoading={actionLoading} isAdmin={isAdmin} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid hsl(120 100% 50% / 0.12)' }}>
          {filtered.map((app) => (
            <AppRow key={app._id} app={app} onStatus={handleStatus} actionLoading={actionLoading} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}
