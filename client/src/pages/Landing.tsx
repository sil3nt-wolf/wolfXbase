import { Link } from 'react-router-dom';
import { Zap, Database, Shield, Cpu, ArrowRight, Check, Server } from 'lucide-react';

const features = [
  {
    icon: Cpu,
    title: 'Instant App Databases',
    desc: 'Spin up an isolated MongoDB database per app in seconds. Auto-generates credentials and connection strings.',
  },
  {
    icon: Shield,
    title: 'Auth Built-In',
    desc: 'Multi-user dashboard with session management. Each app gets its own MongoDB user with scoped permissions.',
  },
  {
    icon: Server,
    title: 'Atlas-Compatible API',
    desc: 'Full REST API compatible with MongoDB Atlas Data API. Query and mutate data over HTTP with just an API key.',
  },
];

const specs = [
  'Self-hosted on your own VPS',
  'MongoDB v8.0 bundled',
  'Multi-user dashboard access',
  'Atlas-compatible REST API',
  'Auto connection string generation',
  'Real-time database browser',
];

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Always On' },
  { value: 'v8.0', label: 'MongoDB' },
  { value: 'REST', label: 'API Ready' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: 'linear-gradient(hsl(120 100% 50% / 0.04) 1px, transparent 1px), linear-gradient(90deg, hsl(120 100% 50% / 0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Left neon bar */}
      <div className="fixed left-0 top-0 bottom-0 w-[3px] z-50" style={{ background: 'hsl(120 100% 50% / 0.6)' }} />

      {/* ── Navbar ── */}
      <nav className="relative z-40 border-b" style={{ borderColor: 'hsl(120 100% 50% / 0.1)', background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center animate-pulse-glow"
              style={{ background: 'hsl(120 100% 50% / 0.08)', border: '1px solid hsl(120 100% 50% / 0.3)' }}
            >
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-lg tracking-widest">
              <span className="text-primary">wolf</span><span className="text-white">Xbase</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-mono text-primary border rounded-lg transition-all hover:bg-primary/10"
              style={{ borderColor: 'hsl(120 100% 50% / 0.4)', background: 'hsl(120 100% 50% / 0.06)' }}
            >
              Sign In →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 pt-28 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-8"
            style={{ background: 'hsl(120 100% 50% / 0.06)', border: '1px solid hsl(120 100% 50% / 0.2)', color: 'hsl(120 100% 50% / 0.7)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
            MongoDB v8.0 · Self-Hosted · REST API Ready
          </div>

          <h1 className="font-display font-black tracking-tight mb-4" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1 }}>
            <span className="text-primary" style={{ filter: 'drop-shadow(0 0 10px hsl(120 100% 50% / 0.2))' }}>wolf</span>
            <span className="text-white">Xbase</span>
          </h1>

          <p className="font-mono text-2xl tracking-[0.3em] mb-4" style={{ color: 'hsl(120 100% 50% / 0.6)' }}>
            Manage. Connect. Control.
          </p>

          <p className="text-gray-500 font-mono text-sm max-w-xl mx-auto leading-relaxed mb-10">
            A self-hosted MongoDB management dashboard with a built-in Atlas-compatible REST API.
            Deploy databases, manage users, and connect your apps — all from one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="flex items-center gap-2 px-7 py-3 font-mono font-semibold text-sm rounded-lg transition-all"
              style={{ background: 'hsl(120 100% 50% / 0.1)', border: '1px solid hsl(120 100% 50% / 0.35)', color: 'hsl(120 100% 50%)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'hsl(120 100% 50% / 0.18)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'hsl(120 100% 50% / 0.1)')}
            >
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/sil3nt-wolf/wolfXbase"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 font-mono text-sm text-gray-500 hover:text-gray-300 border rounded-lg transition-all"
              style={{ borderColor: 'hsl(120 100% 50% / 0.1)' }}
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-2xl font-display font-black text-white">{s.value}</div>
              <div className="text-xs font-mono mt-1" style={{ color: 'hsl(120 100% 50% / 0.5)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Connection string preview ── */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-3xl mx-auto card p-5 neon-border">
          <p className="text-xs font-mono mb-3" style={{ color: 'hsl(120 100% 50% / 0.5)' }}>// Your auto-generated connection string</p>
          <div className="rounded-lg px-4 py-3 font-mono text-sm overflow-x-auto" style={{ background: '#050505', border: '1px solid hsl(120 100% 50% / 0.12)' }}>
            <span className="text-gray-600">mongodb://</span>
            <span className="text-primary">myapp</span>
            <span className="text-gray-600">:••••••••@</span>
            <span style={{ color: '#4488ff' }}>database.xwolf.space</span>
            <span className="text-gray-600">:27018/</span>
            <span className="text-primary">myapp</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: 'hsl(120 100% 50% / 0.5)' }}>What you get</p>
            <h2 className="font-display font-black text-white text-3xl tracking-wide">Everything in one place</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card p-6 group hover:neon-border transition-all duration-300">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'hsl(120 100% 50% / 0.07)', border: '1px solid hsl(120 100% 50% / 0.2)' }}
                >
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-white text-base tracking-wide mb-2">{f.title}</h3>
                <p className="text-gray-600 text-xs font-mono leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specs checklist ── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-3xl mx-auto card p-8 neon-border">
          <p className="text-xs font-mono tracking-widest uppercase mb-6" style={{ color: 'hsl(120 100% 50% / 0.5)' }}>Included out of the box</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {specs.map(s => (
              <div key={s} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                  style={{ background: 'hsl(120 100% 50% / 0.1)', border: '1px solid hsl(120 100% 50% / 0.25)' }}>
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-gray-400 text-sm font-mono">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 px-6 pb-28">
        <div className="max-w-2xl mx-auto text-center card p-10 neon-border">
          <Database className="w-10 h-10 text-primary mx-auto mb-5 animate-pulse-glow" />
          <h2 className="font-display font-black text-white text-2xl tracking-wide mb-3">Ready to manage your data?</h2>
          <p className="text-gray-600 font-mono text-sm mb-7">Sign in to your wolfXbase dashboard and take control of your MongoDB databases.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-3 font-mono font-semibold text-sm rounded-lg transition-all text-primary"
            style={{ background: 'hsl(120 100% 50% / 0.1)', border: '1px solid hsl(120 100% 50% / 0.35)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'hsl(120 100% 50% / 0.18)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'hsl(120 100% 50% / 0.1)')}
          >
            Open Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 px-6 py-8" style={{ borderTop: '1px solid hsl(120 100% 50% / 0.08)', background: 'rgba(0,0,0,0.5)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: 'hsl(120 100% 50% / 0.1)', border: '1px solid hsl(120 100% 50% / 0.3)' }}>
              <span className="text-primary text-xs font-black">W</span>
            </div>
            <span className="font-display font-bold text-sm tracking-widest">
              <span className="text-primary">wolf</span><span className="text-gray-500">Xbase</span>
            </span>
          </div>
          <nav className="flex items-center gap-4 text-xs font-mono">
            <Link to="/terms" className="text-gray-700 hover:text-primary transition-colors">Terms</Link>
            <span className="text-gray-800">·</span>
            <Link to="/privacy" className="text-gray-700 hover:text-primary transition-colors">Privacy</Link>
            <span className="text-gray-800">·</span>
            <Link to="/license" className="text-gray-700 hover:text-primary transition-colors">License</Link>
            <span className="text-gray-800">·</span>
            <Link to="/dashboard/docs" className="text-gray-700 hover:text-primary transition-colors">Docs</Link>
            <span className="text-gray-800">·</span>
            <a href="mailto:support@wolftech.dev" className="text-gray-700 hover:text-primary transition-colors">Support</a>
          </nav>
          <p className="text-gray-800 text-xs font-mono">© {new Date().getFullYear()} WOLF TECH ~ Silent Wolf. All systems operational.</p>
        </div>
      </footer>
    </div>
  );
}
