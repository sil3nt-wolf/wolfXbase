import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { auth } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await auth.login(username, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl" style={{ background: 'hsl(120 100% 50% / 0.05)' }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl" style={{ background: 'hsl(120 100% 50% / 0.03)' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(hsl(120 100% 50% / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(120 100% 50% / 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-pulse-glow"
            style={{ background: 'hsl(120 100% 50% / 0.05)', border: '1px solid hsl(120 100% 50% / 0.3)' }}
          >
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-widest text-white">
            <span className="text-primary">wolf</span>Xbase
          </h1>
          <p className="text-gray-500 text-xs mt-2 font-mono tracking-wider">Sign in to manage your databases</p>
        </div>

        <div className="card p-6 shadow-xl neon-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Username</label>
              <input
                type="text"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-primary transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-3 text-sm" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-700 text-xs mt-5 font-mono">
          Password shown in console on first start
        </p>

        <div className="flex items-center justify-center gap-2 mt-5 mb-6">
          <div
            className="w-4 h-4 rounded flex items-center justify-center shrink-0"
            style={{ background: 'hsl(120 100% 50% / 0.15)', border: '1px solid hsl(120 100% 50% / 0.4)' }}
          >
            <span className="text-primary text-xs font-black">W</span>
          </div>
          <span className="text-gray-700 text-xs font-mono">
            Built by{' '}
            <span className="text-gray-500">WOLF TECH ~ Silent Wolf</span>
          </span>
        </div>

        <nav className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1.5 text-xs font-mono">
          <Link to="/terms" className="text-gray-700 hover:text-primary transition-colors">Terms</Link>
          <span className="text-gray-800">·</span>
          <Link to="/privacy" className="text-gray-700 hover:text-primary transition-colors">Privacy</Link>
          <span className="text-gray-800">·</span>
          <Link to="/license" className="text-gray-700 hover:text-primary transition-colors">License</Link>
          <span className="text-gray-800">·</span>
          <a href="mailto:support@wolftech.dev" className="text-gray-700 hover:text-primary transition-colors">Support</a>
        </nav>
      </div>
    </div>
  );
}
