import { Link } from 'react-router-dom';
import { Zap, ArrowLeft } from 'lucide-react';

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, subtitle, lastUpdated, children }: LegalLayoutProps) {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 backdrop-blur-sm" style={{ borderBottom: '1px solid hsl(120 100% 50% / 0.1)', background: 'rgba(5,5,5,0.9)' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'hsl(120 100% 50% / 0.08)', border: '1px solid hsl(120 100% 50% / 0.3)' }}
            >
              <Zap className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-display font-bold text-sm tracking-widest group-hover:text-primary transition-colors">
              <span className="text-primary">Mongo</span><span className="text-white">Dash</span>
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-primary transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="mb-10 pb-8" style={{ borderBottom: '1px solid hsl(120 100% 50% / 0.1)' }}>
          <p className="text-primary text-xs font-mono uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-3xl font-display font-bold text-white mb-3 tracking-wide">{title}</h1>
          <p className="text-gray-500 text-sm font-mono">{subtitle}</p>
          <p className="text-gray-700 text-xs mt-3 font-mono">Last updated: {lastUpdated}</p>
        </div>
        <div className="prose-legal">{children}</div>
      </main>

      <footer style={{ borderTop: '1px solid hsl(120 100% 50% / 0.1)', background: 'rgba(0,0,0,0.5)' }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: 'hsl(120 100% 50% / 0.08)', border: '1px solid hsl(120 100% 50% / 0.25)' }}
                >
                  <Zap className="w-3 h-3 text-primary" />
                </div>
                <span className="font-display font-bold text-white text-sm tracking-widest">
                  <span className="text-primary">Mongo</span>Dash
                </span>
              </div>
              <p className="text-gray-700 text-xs leading-relaxed font-mono">
                Self-hosted MongoDB management dashboard<br />
                by WOLF TECH ~ Silent Wolf
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-3">
              <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono">
                <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors">Terms of Service</Link>
                <Link to="/privacy" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</Link>
                <Link to="/license" className="text-gray-600 hover:text-primary transition-colors">License</Link>
                <Link to="/dashboard/docs" className="text-gray-600 hover:text-primary transition-colors">Docs</Link>
                <a href="mailto:support@wolftech.dev" className="text-gray-600 hover:text-primary transition-colors">Support</a>
              </nav>
              <p className="text-gray-700 text-xs font-mono">© {year} WOLF TECH ~ Silent Wolf. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
