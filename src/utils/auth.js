// Auth utility — manages JWT token in localStorage

const TOKEN_KEY = 'alhikma_admin_token';
const EXPIRY_KEY = 'alhikma_admin_expiry';

export function saveToken(token, expiresIn) {
  const expiry = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRY_KEY, expiry.toString());
}

export function getToken() {
  const expiry = parseInt(localStorage.getItem(EXPIRY_KEY) || '0', 10);
  if (Date.now() > expiry) {
    clearToken();
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

// Attach Authorization header to fetch options
export function authFetch(url, options = {}) {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
