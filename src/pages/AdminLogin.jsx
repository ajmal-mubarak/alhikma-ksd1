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
      setError(err?.message || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eef0f4;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          padding: 16px;
        }

        .lp-card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.10);
          padding: 48px 40px 40px;
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Logo circle */
        .lp-avatar {
          width: 86px;
          height: 86px;
          border-radius: 50%;
          background: #2e7fc1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(46,127,193,0.25);
        }
        .lp-avatar img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 10px;
          filter: brightness(0) invert(1);
        }

        .lp-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: #1a1a2e;
          margin-bottom: 26px;
          letter-spacing: 0.01em;
        }

        /* Error */
        .lp-error {
          width: 100%;
          background: #fff0f0;
          border: 1px solid #fca5a5;
          border-radius: 7px;
          padding: 9px 13px;
          color: #b91c1c;
          font-size: 0.82rem;
          margin-bottom: 14px;
          text-align: center;
        }

        /* Input group */
        .lp-field {
          width: 100%;
          position: relative;
          margin-bottom: 14px;
        }
        .lp-input {
          width: 100%;
          padding: 11px 40px 11px 14px;
          border: 1.5px solid #d1d5db;
          border-radius: 7px;
          font-size: 0.93rem;
          color: #111827;
          background: #fff;
          outline: none;
          font-family: inherit;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .lp-input::placeholder { color: #9ca3af; }
        .lp-input:focus {
          border-color: #2e7fc1;
          box-shadow: 0 0 0 3px rgba(46,127,193,0.12);
        }
        .lp-icon {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 0.95rem;
          pointer-events: none;
          line-height: 1;
        }
        .lp-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          font-size: 0.85rem;
          padding: 4px 6px;
          font-family: inherit;
          font-weight: 600;
          transition: color 0.15s;
          line-height: 1;
        }
        .lp-toggle:hover { color: #374151; }

        /* Button */
        .lp-btn {
          width: 100%;
          padding: 12px;
          background: #2e7fc1;
          color: #fff;
          border: none;
          border-radius: 7px;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          cursor: pointer;
          font-family: inherit;
          margin-top: 4px;
          transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
        }
        .lp-btn:hover:not(:disabled) {
          background: #2569a8;
          box-shadow: 0 4px 14px rgba(46,127,193,0.3);
        }
        .lp-btn:active:not(:disabled) { transform: scale(0.99); }
        .lp-btn:disabled { background: #9ca3af; cursor: not-allowed; }
      `}</style>

      <div className="lp-wrap">
        <div className="lp-card">

          {/* Logo circle */}
          <div className="lp-avatar">
            <img src="/logo.png" alt="Al Hikma" />
          </div>

          <h1 className="lp-title">Admin Log in</h1>

          {error && <div className="lp-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {/* Username */}
            <div className="lp-field">
              <input
                id="admin-username"
                type="text"
                className="lp-input"
                placeholder="User ID"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
                autoFocus
              />
              <span className="lp-icon">👤</span>
            </div>

            {/* Password */}
            <div className="lp-field">
              <input
                id="admin-password"
                type={showPass ? 'text' : 'password'}
                className="lp-input"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="lp-toggle"
                onClick={() => setShowPass(v => !v)}
                tabIndex={-1}
                aria-label={showPass ? 'Hide' : 'Show'}
              >
                {showPass ? 'Off' : 'On'}
              </button>
            </div>

            <button id="admin-login-btn" type="submit" className="lp-btn" disabled={loading}>
              {loading ? 'Please wait…' : 'LOGIN'}
            </button>
          </form>

        </div>
      </div>
    </>
  );
}
