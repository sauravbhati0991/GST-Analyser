const API_BASE = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('maksaa_token') || sessionStorage.getItem('maksaa_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// ─── Auth API ───

export async function apiSignup(name, email, password) {
  const data = await request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

  // Store token in sessionStorage by default (login will handle remember me)
  sessionStorage.setItem('maksaa_token', data.token);

  return data;
}

export async function apiLogin(email, password, rememberMe = false) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe }),
  });

  // Remember Me: localStorage (persistent) vs sessionStorage (tab-only)
  if (rememberMe) {
    localStorage.setItem('maksaa_token', data.token);
    localStorage.setItem('maksaa_remember', 'true');
  } else {
    sessionStorage.setItem('maksaa_token', data.token);
    localStorage.removeItem('maksaa_token');
    localStorage.removeItem('maksaa_remember');
  }

  return data;
}

export async function apiGetMe() {
  return request('/auth/me');
}

export async function apiForgotPassword(email) {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function apiResetPassword(email, otp, newPassword) {
  const data = await request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, newPassword }),
  });

  // Auto-login after reset
  sessionStorage.setItem('maksaa_token', data.token);

  return data;
}

export function logout() {
  localStorage.removeItem('maksaa_token');
  localStorage.removeItem('maksaa_remember');
  sessionStorage.removeItem('maksaa_token');
}

export function getStoredToken() {
  return localStorage.getItem('maksaa_token') || sessionStorage.getItem('maksaa_token');
}

export function isRemembered() {
  return localStorage.getItem('maksaa_remember') === 'true';
}

// ─── App API ───

export async function apiAnalyzeBill(fileBase64, mimeType) {
  const data = await request('/analyze', {
    method: 'POST',
    body: JSON.stringify({ fileBase64, mimeType }),
  });
  return data.data; // Return the inner 'data' object containing the validated output
}

export async function apiGetInvoices() {
  return request('/invoices');
}
