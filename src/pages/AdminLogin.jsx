import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../utils/auth';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(data.error || 'Invalid credentials');
        return;
      }

      saveToken(data.token, data.expiresIn);
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Login fetch error:', err);
      setError(err?.message || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-page {
          min-height: 100vh;
          display: flex;
          background: #f5f6fa;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }

        /* ── LEFT PANEL ── */
        .login-left {
          display: none;
          flex: 1;
          background: linear-gradient(160deg, #0d3b35 0%, #1a6b5a 60%, #1e8870 100%);
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 900px) {
          .login-left { display: flex; }
        }
        .login-left::before {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          top: -80px; left: -80px;
        }
        .login-left::after {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          bottom: -60px; right: -60px;
        }
        .left-logo {
          width: 160px;
          filter: brightness(0) invert(1);
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }
        .left-tagline {
          color: rgba(255,255,255,0.9);
          font-size: 1.5rem;
          font-weight: 700;
          text-align: center;
          line-height: 1.4;
          position: relative;
          z-index: 1;
          margin-bottom: 12px;
        }
        .left-sub {
          color: rgba(255,255,255,0.55);
          font-size: 0.9rem;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        /* ── RIGHT PANEL ── */
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
          background: #fff;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
        }

        /* Mobile logo (shown only on small screens) */
        .mobile-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 32px;
        }
        .mobile-logo img {
          width: 130px;
        }
        @media (min-width: 900px) {
          .mobile-logo { display: none; }
        }

        .login-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .login-subtitle {
          font-size: 0.88rem;
          color: #6b7280;
          margin-bottom: 32px;
        }

        .form-group {
          margin-bottom: 20px;
        }
        .form-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 7px;
          letter-spacing: 0.01em;
        }
        .form-input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.94rem;
          color: #111827;
          background: #fafafa;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          font-family: inherit;
        }
        .form-input:focus {
          border-color: #1a6b5a;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(26,107,90,0.1);
        }
        .input-wrap {
          position: relative;
        }
        .input-wrap .form-input {
          padding-right: 44px;
        }
        .show-pass-btn {
          position: absolute;
          right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer;
          color: #9ca3af;
          font-size: 1rem;
          padding: 4px;
          line-height: 1;
          transition: color 0.15s;
        }
        .show-pass-btn:hover { color: #374151; }

        .error-box {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 11px 14px;
          margin-bottom: 20px;
          color: #b91c1c;
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .error-icon { flex-shrink: 0; margin-top: 1px; }

        .login-btn {
          width: 100%;
          padding: 13px;
          background: #1a6b5a;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.96rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, transform 0.1s, box-shadow 0.18s;
          font-family: inherit;
          letter-spacing: 0.01em;
          margin-top: 4px;
        }
        .login-btn:hover:not(:disabled) {
          background: #15594b;
          box-shadow: 0 4px 12px rgba(26,107,90,0.25);
        }
        .login-btn:active:not(:disabled) { transform: scale(0.99); }
        .login-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .login-footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #f3f4f6;
          color: #9ca3af;
          font-size: 0.78rem;
        }

        .attempts-warning {
          font-size: 0.78rem;
          color: #d97706;
          margin-top: 6px;
          text-align: center;
        }
      `}</style>

      <div className="login-page">
        {/* Left decorative panel */}
        <div className="login-left">
          <img src="/logo.png" alt="Al Hikma Logo" className="left-logo" />
          <div className="left-tagline">Admissions Management</div>
          <div className="left-sub">Kasaragod · 2026</div>
        </div>

        {/* Right form panel */}
        <div className="login-right">
          <div className="login-card">
            {/* Mobile logo */}
            <div className="mobile-logo">
              <img src="/logo.png" alt="Al Hikma Women's College" />
            </div>

            <h1 className="login-title">Admin Sign In</h1>
            <p className="login-subtitle">Enter your credentials to access the dashboard</p>

            {/* Error */}
            {error && (
              <div className="error-box">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-username">Username</label>
                <input
                  id="admin-username"
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-password">Password</label>
                <div className="input-wrap">
                  <input
                    id="admin-password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="show-pass-btn"
                    onClick={() => setShowPass(v => !v)}
                    tabIndex={-1}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <button
                id="admin-login-btn"
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>

              {attempts >= 3 && (
                <p className="attempts-warning">
                  ⚠️ {attempts} failed attempts — account locks after 5
                </p>
              )}
            </form>

            <div className="login-footer">
              Al Hikma Women's College · Kasaragod
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
