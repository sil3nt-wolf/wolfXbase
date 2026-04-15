import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Copy, Check, Play, Pause, Ban, Trash2,
  Database, AlertCircle, Eye, EyeOff, RefreshCw, Server,
  Plug, Activity, HardDrive, ShieldAlert, Terminal
} from 'lucide-react';
import { apps as appsApi, config as configApi } from '../api';
import type { App, ServerConfig } from '../types';

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024, s = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${s[i]}`;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} title="Copy"
      className="p-1.5 rounded-md transition-colors hover:bg-white/5"
      style={{ color: copied ? 'hsl(120 100% 50%)' : 'rgba(255,255,255,0.3)' }}>
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function ConnBox({ label, value, display, color = 'text-primary', note }: {
  label: string; value: string; display?: string; color?: string; note?: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
      <div className="flex items-center gap-2 rounded-lg px-3 py-2.5"
        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <code className={`${color} text-xs font-mono flex-1 break-all`}>{display ?? value}</code>
        <CopyBtn text={value} />
      </div>
      {note && <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>{note}</p>}
    </div>
  );
}

const TABS = [
  { id: 'connection', label: 'Connection', icon: Plug },
  { id: 'status', label: 'Status', icon: Activity },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'danger', label: 'Danger', icon: ShieldAlert },
];

export default function AppDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<App | null>(null);
  const [serverConfig, setServerConfig] = useState<ServerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [tab, setTab] = useState('connection');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [regenConfirm, setRegenConfirm] = useState(false);

  const load = () => {
    if (!id) return;
    Promise.all([appsApi.get(id), configApi.get()])
      .then(([appRes, cfgRes]) => { setApp(appRes.data); setServerConfig(cfgRes.data); })
      .catch(() => setError('Failed to load app.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleStatus = async (status: App['status']) => {
    if (!app) return;
    setActionLoading(status);
    try { await appsApi.updateStatus(app._id, status); setApp((a) => a ? { ...a, status } : a); }
    catch { setError('Failed to update status.'); }
    finally { setActionLoading(''); }
  };

  const handleDelete = async () => {
    if (!app || deleteInput !== app.name) return;
    setActionLoading('delete');
    try { await appsApi.delete(app._id); navigate('/dashboard/apps'); }
    catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Failed to delete app.');
      setActionLoading('');
    }
  };

  const handleRegenPassword = async () => {
    if (!app) return;
    setRegenLoading(true);
    try {
      const res = await appsApi.regeneratePassword(app._id);
      setApp((a) => a ? { ...a, mongoPassword: res.data.mongoPassword } : a);
      setRegenConfirm(false); setShowPass(true);
    } catch { setError('Failed to regenerate password.'); }
    finally { setRegenLoading(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'hsl(120 100% 50% / 0.6)', borderTopColor: 'transparent' }} />
      <p className="text-xs font-mono" style={{ color: 'hsl(120 100% 50% / 0.45)' }}>loading app data...</p>
    </div>
  );

  if (error && !app) return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="rounded-xl p-10 text-center" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(239,68,68,0.25)' }}>
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="font-mono text-sm text-red-400">{error}</p>
        <Link to="/dashboard/apps" className="text-xs font-mono mt-3 inline-block text-primary hover:underline">← back to apps</Link>
      </div>
    </div>
  );

  if (!app) return null;

  const host = serverConfig?.mongoHost ?? 'your-server-ip';
  const port = serverConfig?.mongoPort ?? 27017;
  const user = app.mongoUser ?? app.name;
  const pass = app.mongoPassword ?? '••••••••';
  const internalConn = `mongodb://127.0.0.1:27018/${app.name}`;
  const vpsConn = `mongodb://${user}:${pass}@${host}:${port}/${app.name}?authSource=admin`;
  const vpsConnMasked = `mongodb://${user}:${showPass ? pass : '••••••••••••••••'}@${host}:${port}/${app.name}?authSource=admin`;
  const httpEndpoint = `${window.location.origin}/app/data-api/endpoint/data/v1/action/{action}`;

  const STATUS_CFG = {
    running: { dot: '#22c55e', color: 'hsl(120 100% 60%)' },
    suspended: { dot: '#f59e0b', color: '#fbbf24' },
    paused: { dot: '#4b5563', color: '#6b7280' },
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link to="/dashboard/apps" className="inline-flex items-center gap-1.5 text-xs font-mono transition-colors hover:text-white"
        style={{ color: 'hsl(120 100% 50% / 0.5)' }}>
        <ArrowLeft className="w-3.5 h-3.5" /> back to apps
      </Link>

      <div className="rounded-xl p-5" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid hsl(120 100% 50% / 0.15)' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center text-white font-bold font-display text-xl"
            style={{ backgroundColor: app.color }}>
            {app.displayName[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display font-bold text-white text-xl tracking-wide">{app.displayName}</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono"
                style={{
                  background: `${STATUS_CFG[app.status].dot}15`,
                  border: `1px solid ${STATUS_CFG[app.status].dot}50`,
                  color: STATUS_CFG[app.status].color,
                }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_CFG[app.status].dot }} />
                {app.status}
              </span>
            </div>
            <p className="text-xs font-mono mt-1" style={{ color: 'hsl(120 100% 50% / 0.4)' }}>{app.name}</p>
            {app.description && <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{app.description}</p>}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 rounded-lg px-4 py-3 text-xs font-mono"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="flex gap-1 rounded-xl p-1" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid hsl(120 100% 50% / 0.1)' }}>
        {TABS.map(({ id: tid, label, icon: Icon }) => (
          <button key={tid} onClick={() => setTab(tid)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono transition-all"
            style={tab === tid
              ? { background: 'hsl(120 100% 50% / 0.12)', color: 'hsl(120 100% 50%)', border: '1px solid hsl(120 100% 50% / 0.25)' }
              : { color: 'rgba(255,255,255,0.3)' }}>
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {tab === 'connection' && (
        <div className="rounded-xl p-5 space-y-5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid hsl(120 100% 50% / 0.12)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <h2 className="font-mono font-semibold text-white text-sm">Connection Strings</h2>
            </div>
            <button onClick={() => setShowPass(!showPass)}
              className="flex items-center gap-1.5 text-xs font-mono transition-colors hover:text-white"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showPass ? 'hide' : 'show'} password
            </button>
          </div>

          <ConnBox label="Internal · same server" value={internalConn} color="text-primary"
            note="Use when your app runs on the same machine as MongoDB." />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
                VPS / External · <Server className="w-3 h-3 inline" /> {host}:{port}
              </p>
              <button onClick={() => setRegenConfirm(true)}
                className="flex items-center gap-1 text-xs font-mono transition-colors hover:text-amber-400"
                style={{ color: 'rgba(255,255,255,0.25)' }}>
                <RefreshCw className="w-3 h-3" /> regen password
              </button>
            </div>
            <ConnBox label="" value={vpsConn} display={vpsConnMasked} color="text-blue-300" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-lg text-xs font-mono"
              style={{ background: 'rgba(0,0,0,0.4)' }}>
              {[['host', host], ['port', String(port)], ['database', app.name], ['user', user], ['password', showPass ? pass : '••••••••']].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>{k}</span>
                  <code className="text-primary truncate">{v}</code>
                </div>
              ))}
            </div>
          </div>

          <ConnBox label="HTTP REST API endpoint" value={httpEndpoint} color="text-amber-300"
            note="Atlas-compatible REST API. Add header: api-key: <your-key>" />
        </div>
      )}

      {tab === 'status' && (
        <div className="rounded-xl p-5 space-y-5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid hsl(120 100% 50% / 0.12)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="font-mono font-semibold text-white text-sm">App Status Control</h2>
          </div>
          <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Control whether this app's database is active, paused, or suspended.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(['running', 'paused', 'suspended'] as const).map((s) => {
              const icons = { running: Play, paused: Pause, suspended: Ban };
              const Icon = icons[s];
              const cfg = {
                running: { active: 'hsl(120 100% 50% / 0.15)', border: 'hsl(120 100% 50% / 0.4)', text: 'hsl(120 100% 60%)' },
                paused: { active: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.2)', text: '#9ca3af' },
                suspended: { active: 'hsl(40 100% 50% / 0.12)', border: 'hsl(40 100% 50% / 0.35)', text: '#fbbf24' },
              }[s];
              const isActive = app.status === s;
              return (
                <button key={s} onClick={() => handleStatus(s)} disabled={isActive || !!actionLoading}
                  className="flex flex-col items-center gap-2 py-5 rounded-xl text-sm font-mono font-medium transition-all"
                  style={isActive
                    ? { background: cfg.active, border: `1px solid ${cfg.border}`, color: cfg.text }
                    : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.25)' }
                  }>
                  <Icon className="w-5 h-5" />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'storage' && (
        <div className="rounded-xl p-5 space-y-5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid hsl(120 100% 50% / 0.12)' }}>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-primary" />
            <h2 className="font-mono font-semibold text-white text-sm">Storage & Collections</h2>
          </div>
          {app.stats ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Collections', value: app.stats.collections },
                  { label: 'Documents', value: app.stats.objects.toLocaleString() },
                  { label: 'Data Size', value: formatBytes(app.stats.dataSize) },
                  { label: 'Storage Size', value: formatBytes(app.stats.storageSize) },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-4 text-center"
                    style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid hsl(120 100% 50% / 0.08)' }}>
                    <p className="text-xl font-bold font-display text-white">{value}</p>
                    <p className="text-xs font-mono mt-1" style={{ color: 'hsl(120 100% 50% / 0.4)' }}>{label}</p>
                  </div>
                ))}
              </div>
              {app.stats.collectionNames.length > 0 && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Collections
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {app.stats.collectionNames.map((col) => (
                      <Link key={col} to={`/dashboard/databases?db=${app.name}&col=${col}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all hover:border-primary/40"
                        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid hsl(120 100% 50% / 0.12)', color: 'hsl(120 100% 50% / 0.7)' }}>
                        <Database className="w-3 h-3" />
                        {col}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm font-mono text-center py-8" style={{ color: 'rgba(255,255,255,0.3)' }}>no storage data available</p>
          )}
        </div>
      )}

      {tab === 'danger' && (
        <div className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <h2 className="font-mono font-semibold text-red-400 text-sm">Danger Zone</h2>
          </div>
          <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Permanently delete this app and all its data. This cannot be undone.
          </p>
          {!deleteConfirm ? (
            <button onClick={() => setDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all hover:opacity-90"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
              <Trash2 className="w-4 h-4" /> Delete App
            </button>
          ) : (
            <div className="rounded-xl p-5 space-y-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-xs font-mono" style={{ color: '#fca5a5' }}>
                type <code className="bg-red-950/50 px-1.5 py-0.5 rounded">{app.name}</code> to confirm deletion:
              </p>
              <input type="text" className="w-full px-3 py-2.5 rounded-lg text-sm font-mono text-white outline-none"
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(239,68,68,0.3)', caretColor: '#ef4444' }}
                placeholder={app.name} value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={() => { setDeleteConfirm(false); setDeleteInput(''); }}
                  className="px-4 py-2 rounded-lg text-xs font-mono transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleteInput !== app.name || actionLoading === 'delete'}
                  className="px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all disabled:opacity-40"
                  style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}>
                  {actionLoading === 'delete' ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {regenConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="rounded-2xl p-6 max-w-sm w-full" style={{ background: '#0a0a0a', border: '1px solid hsl(120 100% 50% / 0.2)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <RefreshCw className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Regenerate Password</h3>
                <p className="text-xs font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>old password will stop working</p>
              </div>
            </div>
            <p className="text-xs font-mono mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              A new password will be generated for <strong className="text-white">{app.name}</strong>. Update any connected apps immediately.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setRegenConfirm(false)}
                className="flex-1 py-2 rounded-lg text-xs font-mono transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                Cancel
              </button>
              <button onClick={handleRegenPassword} disabled={regenLoading}
                className="flex-1 py-2 rounded-lg text-xs font-mono font-medium text-black transition-all hover:opacity-90"
                style={{ background: 'hsl(120 100% 50%)' }}>
                {regenLoading ? 'Generating...' : 'Regenerate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
