import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../utils/auth';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      if (!res.ok) { setError(data.error || 'Invalid credentials'); return; }
      saveToken(data.token, data.expiresIn);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .al-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
          background: #f0f2f5;
          padding: 20px;
        }

        /* Card */
        .al-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 8px 48px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06);
          width: 100%;
          max-width: 400px;
          padding: 0;
          overflow: hidden;
        }

        /* Top teal strip */
        .al-header {
          background: linear-gradient(135deg, #0d5c4a 0%, #1a8a6e 100%);
          padding: 36px 40px 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .al-logo-ring {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 3px solid rgba(255,255,255,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          backdrop-filter: blur(4px);
        }
        .al-logo-ring img {
          width: 68px;
          height: 68px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .al-heading {
          color: #fff;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          margin-bottom: 3px;
        }
        .al-sub {
          color: rgba(255,255,255,0.65);
          font-size: 0.78rem;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        /* Form body */
        .al-body {
          padding: 32px 36px 36px;
        }

        /* Error */
        .al-err {
          background: #fef2f2;
          border-left: 3px solid #ef4444;
          border-radius: 8px;
          padding: 10px 14px;
          color: #dc2626;
          font-size: 0.82rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        /* Fields */
        .al-field {
          margin-bottom: 18px;
        }
        .al-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 7px;
        }
        .al-input-wrap {
          position: relative;
        }
        .al-input {
          width: 100%;
          padding: 13px 44px 13px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.94rem;
          color: #111827;
          background: #fafafa;
          outline: none;
          font-family: inherit;
          transition: all 0.18s ease;
        }
        .al-input::placeholder { color: #c4c8cf; }
        .al-input:focus {
          border-color: #1a8a6e;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(26,138,110,0.10);
        }

        .al-suffix {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          color: #d1d5db;
        }
        .al-eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          color: #9ca3af;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .al-eye-btn:hover { color: #374151; }

        /* Submit */
        .al-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #0d5c4a 0%, #1a8a6e 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          margin-top: 8px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .al-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0);
          transition: background 0.15s;
        }
        .al-btn:hover:not(:disabled)::after { background: rgba(255,255,255,0.08); }
        .al-btn:hover:not(:disabled) {
          box-shadow: 0 6px 20px rgba(13,92,74,0.35);
          transform: translateY(-1px);
        }
        .al-btn:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
        .al-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .al-spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        /* Footer */
        .al-footer {
          text-align: center;
          padding: 16px 36px 24px;
          font-size: 0.73rem;
          color: #c4c8cf;
          letter-spacing: 0.01em;
          border-top: 1px solid #f3f4f6;
        }
      `}</style>

      <div className="al-root">
        <div className="al-card">

          {/* Teal header */}
          <div className="al-header">
            <div className="al-logo-ring">
              <img src="/logo.png" alt="Al Hikma" />
            </div>
            <div className="al-heading">Admin Log in</div>
            <div className="al-sub">Al Hikma Women's College · Kasaragod</div>
          </div>

          {/* Form */}
          <div className="al-body">
            {error && (
              <div className="al-err">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="al-field">
                <label className="al-label" htmlFor="al-uid">User ID</label>
                <div className="al-input-wrap">
                  <input
                    id="al-uid"
                    type="text"
                    className="al-input"
                    placeholder="Enter your user ID"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    autoFocus
                  />
                  <span className="al-suffix">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="al-field">
                <label className="al-label" htmlFor="al-pw">Password</label>
                <div className="al-input-wrap">
                  <input
                    id="al-pw"
                    type={showPass ? 'text' : 'password'}
                    className="al-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <span className="al-suffix">
                    <button
                      type="button"
                      className="al-eye-btn"
                      onClick={() => setShowPass(v => !v)}
                      tabIndex={-1}
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </span>
                </div>
              </div>

              <button id="al-login-btn" type="submit" className="al-btn" disabled={loading}>
                {loading && <span className="al-spinner" />}
                {loading ? 'Signing in…' : 'Login'}
              </button>
            </form>
          </div>

          <div className="al-footer">Powered by Al Hikma Administration System</div>
        </div>
      </div>
    </>
  );
}
