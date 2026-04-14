import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, AppWindow, Database, BookOpen,
  LogOut, Zap, Menu, X, Users,
} from 'lucide-react';
import { useState } from 'react';
import { auth } from '../api';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/apps', label: 'Apps', icon: AppWindow },
  { to: '/dashboard/databases', label: 'Databases', icon: Database },
  { to: '/dashboard/users', label: 'Users', icon: Users },
  { to: '/dashboard/docs', label: 'Docs', icon: BookOpen },
];

function SidebarContent({ mobile, onClose, onLogout }: { mobile?: boolean; onClose?: () => void; onLogout: () => void }) {
  return (
    <div className="flex flex-col h-screen w-60" style={{ background: '#080808', borderRight: '1px solid hsl(120 100% 50% / 0.15)' }}>
      <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: '1px solid hsl(120 100% 50% / 0.1)' }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 animate-pulse-glow"
          style={{ background: 'hsl(120 100% 50% / 0.08)', border: '1px solid hsl(120 100% 50% / 0.3)' }}
        >
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm leading-tight tracking-widest">
            <span className="text-primary">wolf</span><span className="text-white">Xbase</span>
          </p>
          <p className="text-primary/50 text-xs font-mono">MongoDB Manager</p>
        </div>
        {mobile && (
          <button className="text-gray-500 hover:text-primary transition-colors" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all ${
                isActive
                  ? 'text-primary neon-border'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'hsl(120 100% 50% / 0.08)',
              border: '1px solid hsl(120 100% 50% / 0.25)',
            } : {}}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-3" style={{ borderTop: '1px solid hsl(120 100% 50% / 0.1)' }}>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>

      <div className="px-4 py-3" style={{ borderTop: '1px solid hsl(120 100% 50% / 0.1)', background: 'rgba(0,0,0,0.4)' }}>
        <div className="flex items-center gap-2 mb-0.5">
          <div
            className="w-5 h-5 rounded flex items-center justify-center shrink-0"
            style={{ background: 'hsl(120 100% 50% / 0.12)', border: '1px solid hsl(120 100% 50% / 0.35)' }}
          >
            <span className="text-primary text-xs font-black">W</span>
          </div>
          <span className="text-xs font-display font-bold text-primary/80 tracking-widest">WOLF TECH</span>
        </div>
        <p className="text-gray-700 text-xs leading-snug pl-7 font-mono">~ Silent Wolf</p>
      </div>
    </div>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ borderTop: '1px solid hsl(120 100% 50% / 0.1)', background: 'rgba(0,0,0,0.5)' }}>
      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
              style={{ background: 'hsl(120 100% 50% / 0.08)', border: '1px solid hsl(120 100% 50% / 0.25)' }}
            >
              <Zap className="w-3 h-3 text-primary" />
            </div>
            <div>
              <span className="text-white font-display font-bold text-sm tracking-widest">
                <span className="text-primary">wolf</span>Xbase
              </span>
              <span className="text-gray-700 text-xs ml-2 hidden sm:inline font-mono">Self-hosted MongoDB Management</span>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono">
            <Link to="/terms" className="text-gray-700 hover:text-primary transition-colors">Terms</Link>
            <span className="text-gray-800">·</span>
            <Link to="/privacy" className="text-gray-700 hover:text-primary transition-colors">Privacy</Link>
            <span className="text-gray-800">·</span>
            <Link to="/license" className="text-gray-700 hover:text-primary transition-colors">License</Link>
            <span className="text-gray-800">·</span>
            <Link to="/dashboard/docs" className="text-gray-700 hover:text-primary transition-colors">Docs</Link>
            <span className="text-gray-800">·</span>
            <a href="mailto:support@wolftech.dev" className="text-gray-700 hover:text-primary transition-colors">
              Support
            </a>
          </nav>
        </div>

        <div className="mt-4 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2" style={{ borderTop: '1px solid hsl(120 100% 50% / 0.08)' }}>
          <p className="text-gray-700 text-xs font-mono">© {year} WOLF TECH ~ Silent Wolf. All systems operational.</p>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded flex items-center justify-center text-primary text-xs font-black shrink-0"
              style={{ background: 'hsl(120 100% 50% / 0.1)', border: '1px solid hsl(120 100% 50% / 0.3)' }}
            >
              W
            </div>
            <span className="text-xs font-display font-bold text-primary/70 tracking-widest">WOLF TECH</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await auth.logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:block w-60 shrink-0">
        <SidebarContent onLogout={handleLogout} />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <div className="relative">
            <SidebarContent mobile onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3" style={{ background: '#080808', borderBottom: '1px solid hsl(120 100% 50% / 0.15)' }}>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-primary transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-sm tracking-widest">
              <span className="text-primary">wolf</span><span className="text-white">Xbase</span>
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
