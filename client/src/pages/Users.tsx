import { useEffect, useState, FormEvent } from 'react';
import {
  UserPlus, Trash2, AlertCircle, Check, X,
  KeyRound, Shield, Clock, Users as UsersIcon
} from 'lucide-react';
import api from '../api';

interface UserRecord {
  _id: string;
  username: string;
  createdAt: string;
}

interface NewUserForm {
  username: string;
  password: string;
  confirmPassword: string;
}

interface ChangePassForm {
  newPassword: string;
  confirmPassword: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return 'just now';
}

const AVATAR_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];
function avatarColor(username: string) {
  let h = 0;
  for (const c of username) h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

function FieldInput({ label, type = 'text', value, onChange, placeholder, ...rest }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  [k: string]: unknown;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg text-sm font-mono text-white outline-none transition-all placeholder-gray-700"
        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid hsl(120 100% 50% / 0.15)', caretColor: 'hsl(120 100% 50%)' }}
        {...rest} />
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<NewUserForm>({ username: '', password: '', confirmPassword: '' });
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [changePassTarget, setChangePassTarget] = useState<UserRecord | null>(null);
  const [changePassForm, setChangePassForm] = useState<ChangePassForm>({ newPassword: '', confirmPassword: '' });
  const [changePassError, setChangePassError] = useState('');
  const [changePassLoading, setChangePassLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const load = async () => {
    const [usersRes, meRes] = await Promise.all([
      api.get<UserRecord[]>('/users'),
      api.get<{ userId: string }>('/auth/me'),
    ]);
    setUsers(usersRes.data);
    setCurrentUserId(meRes.data.userId);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (addForm.password !== addForm.confirmPassword) return setAddError('Passwords do not match.');
    if (addForm.password.length < 6) return setAddError('Password must be at least 6 characters.');
    setAddLoading(true);
    try {
      await api.post('/users', { username: addForm.username, password: addForm.password });
      setAddForm({ username: '', password: '', confirmPassword: '' });
      setShowAdd(false);
      await load();
      showSuccess(`User "${addForm.username}" created.`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setAddError(msg || 'Failed to create user.');
    } finally { setAddLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/users/${deleteTarget._id}`);
      setDeleteTarget(null);
      await load();
      showSuccess(`User "${deleteTarget.username}" deleted.`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      alert(msg || 'Failed to delete user.');
    } finally { setDeleteLoading(false); }
  };

  const handleChangePass = async (e: FormEvent) => {
    e.preventDefault();
    setChangePassError('');
    if (changePassForm.newPassword !== changePassForm.confirmPassword) return setChangePassError('Passwords do not match.');
    setChangePassLoading(true);
    try {
      await api.patch(`/users/${changePassTarget!._id}/password`, { newPassword: changePassForm.newPassword });
      setChangePassTarget(null);
      setChangePassForm({ newPassword: '', confirmPassword: '' });
      showSuccess(`Password updated for "${changePassTarget!.username}".`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setChangePassError(msg || 'Failed to update password.');
    } finally { setChangePassLoading(false); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-white tracking-widest">ACCESS CONTROL</h1>
          <p className="text-xs font-mono mt-0.5" style={{ color: 'hsl(120 100% 50% / 0.45)' }}>
            {users.length} login account{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => { setShowAdd(!showAdd); setAddError(''); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono font-medium text-black transition-all hover:opacity-90"
          style={{ background: 'hsl(120 100% 50%)' }}>
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-xs font-mono"
          style={{ background: 'hsl(120 100% 50% / 0.1)', border: '1px solid hsl(120 100% 50% / 0.25)', color: 'hsl(120 100% 60%)' }}>
          <Check className="w-4 h-4 shrink-0" /> {successMsg}
        </div>
      )}

      {showAdd && (
        <div className="rounded-xl p-5" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid hsl(120 100% 50% / 0.2)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-primary" />
              <h2 className="font-mono font-semibold text-white text-sm">Create New Account</h2>
            </div>
            <button onClick={() => setShowAdd(false)} className="p-1 rounded transition-colors hover:bg-white/5"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <FieldInput label="Username" value={addForm.username}
                onChange={(v) => setAddForm({ ...addForm, username: v })}
                placeholder="e.g. alice" minLength={2} maxLength={30} required autoFocus />
              <FieldInput label="Password" type="password" value={addForm.password}
                onChange={(v) => setAddForm({ ...addForm, password: v })}
                placeholder="min. 6 chars" minLength={6} required />
              <FieldInput label="Confirm Password" type="password" value={addForm.confirmPassword}
                onChange={(v) => setAddForm({ ...addForm, confirmPassword: v })}
                placeholder="repeat password" required />
            </div>
            {addError && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono text-red-400"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <AlertCircle className="w-3.5 h-3.5" /> {addError}
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-lg text-xs font-mono transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                Cancel
              </button>
              <button type="submit" disabled={addLoading}
                className="px-4 py-2 rounded-lg text-xs font-mono font-medium text-black transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: 'hsl(120 100% 50%)' }}>
                {addLoading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'hsl(120 100% 50% / 0.5)', borderTopColor: 'transparent' }} />
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl p-14 text-center" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid hsl(120 100% 50% / 0.1)' }}>
          <UsersIcon className="w-10 h-10 mx-auto mb-3" style={{ color: 'hsl(120 100% 50% / 0.15)' }} />
          <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>no users found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {users.map((user) => {
            const isCurrentUser = user._id === currentUserId;
            const isAdmin = user.username === 'admin';
            const color = avatarColor(user.username);
            return (
              <div key={user._id} className="rounded-xl p-4 flex flex-col gap-4 group transition-all"
                style={{ background: 'rgba(0,0,0,0.35)', border: isCurrentUser ? 'hsl(120 100% 50% / 0.25) 1px solid' : '1px solid hsl(120 100% 50% / 0.1)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold font-display text-sm shrink-0"
                    style={{ backgroundColor: color }}>
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white text-sm truncate">{user.username}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
                          <Shield className="w-2.5 h-2.5" /> admin
                        </span>
                      )}
                      {isCurrentUser && (
                        <span className="inline-flex items-center text-xs font-mono px-1.5 py-0.5 rounded-full"
                          style={{ background: 'hsl(120 100% 50% / 0.1)', border: '1px solid hsl(120 100% 50% / 0.25)', color: 'hsl(120 100% 60%)' }}>
                          you
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      <Clock className="w-3 h-3" /> {timeAgo(user.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1" style={{ borderTop: '1px solid hsl(120 100% 50% / 0.07)' }}>
                  <button
                    onClick={() => { setChangePassTarget(user); setChangePassForm({ newPassword: '', confirmPassword: '' }); setChangePassError(''); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-mono transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                    <KeyRound className="w-3 h-3" /> Password
                  </button>
                  {!isCurrentUser && !isAdmin && (
                    <button
                      onClick={() => setDeleteTarget(user)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                      style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="rounded-2xl p-6 max-w-sm w-full" style={{ background: '#0a0a0a', border: '1px solid rgba(239,68,68,0.25)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Delete Account</h3>
                <p className="text-xs font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>this cannot be undone</p>
              </div>
            </div>
            <p className="text-xs font-mono mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Remove <strong className="text-white">{deleteTarget.username}</strong>? They will immediately lose access.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 rounded-lg text-xs font-mono transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleteLoading}
                className="flex-1 py-2 rounded-lg text-xs font-mono font-medium transition-all disabled:opacity-50"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}>
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {changePassTarget && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="rounded-2xl p-6 max-w-sm w-full" style={{ background: '#0a0a0a', border: '1px solid hsl(120 100% 50% / 0.2)' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsl(120 100% 50% / 0.08)', border: '1px solid hsl(120 100% 50% / 0.2)' }}>
                  <KeyRound className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Change Password</h3>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{changePassTarget.username}</p>
                </div>
              </div>
              <button onClick={() => setChangePassTarget(null)} className="p-1 rounded transition-colors hover:bg-white/5"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleChangePass} className="space-y-4">
              <FieldInput label="New Password" type="password" value={changePassForm.newPassword}
                onChange={(v) => setChangePassForm({ ...changePassForm, newPassword: v })}
                placeholder="min. 6 characters" minLength={6} required autoFocus />
              <FieldInput label="Confirm New Password" type="password" value={changePassForm.confirmPassword}
                onChange={(v) => setChangePassForm({ ...changePassForm, confirmPassword: v })}
                placeholder="repeat new password" required />
              {changePassError && (
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono text-red-400"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <AlertCircle className="w-3.5 h-3.5" /> {changePassError}
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setChangePassTarget(null)}
                  className="flex-1 py-2 rounded-lg text-xs font-mono transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                  Cancel
                </button>
                <button type="submit" disabled={changePassLoading}
                  className="flex-1 py-2 rounded-lg text-xs font-mono font-medium text-black transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'hsl(120 100% 50%)' }}>
                  {changePassLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
