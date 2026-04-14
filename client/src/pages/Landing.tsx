import { Link } from 'react-router-dom';
import { Zap, Database, Shield, Cpu, ArrowRight, Check, Server } from 'lucide-react';

const features = [
  {
    icon: Cpu,
    title: 'Deploy Bots Instantly',
    desc: 'Launch your WhatsApp bot on your own VPS in seconds. No shared hosting, no limits — full control over your instance.',
  },
  {
    icon: Shield,
    title: 'Always Online',
    desc: 'Keep your WhatsApp bot running 24/7 with auto-restart on failure, uptime monitoring, and zero downtime deployments.',
  },
  {
    icon: Server,
    title: 'Scale With Ease',
    desc: 'Run multiple bot instances from one dashboard. Manage sessions, logs, and configs all in one place.',
  },
];

const specs = [
  'Self-hosted on your own VPS',
  'WhatsApp multi-session support',
  'Auto-restart on crash',
  '24/7 uptime monitoring',
  'Secure session management',
  'Real-time bot logs',
];

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Always On' },
  { value: '∞', label: 'Sessions' },
  { value: 'Live', label: 'Monitoring' },
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


      {/* ── Hero ── */}
      <section className="relative z-10 pt-28 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono mb-8"
            style={{ background: 'hsl(120 100% 50% / 0.12)', border: '1px solid hsl(120 100% 50% / 0.5)', color: 'hsl(120 100% 50% / 1)' }}>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
            Self Hosting · 24/7 Online
          </div>

          <h1 className="font-display font-black tracking-tight mb-4" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1 }}>
            <span className="text-primary" style={{ filter: 'drop-shadow(0 0 10px hsl(120 100% 50% / 0.2))' }}>wolf</span>
            <span className="text-white">Xcore</span>
          </h1>

          <p className="font-mono text-2xl tracking-[0.3em] mb-4" style={{ color: 'hsl(120 100% 50% / 0.6)' }}>
            Deploy. Monitor. Control.
          </p>

          <p className="text-gray-500 font-mono text-sm max-w-xl mx-auto leading-relaxed mb-10">
            wolfXcore is a high-performance game server management panel. Deploy, monitor, and control your servers from a single neon-lit command centre.
          </p>

        </div>
      </section>


    </div>
  );
}
