// Auth Service — communicates with n8n auth webhooks
import { API_ENDPOINTS } from '../api/config';

const TOKEN_KEY = 'docchat_token';
const USER_KEY = 'docchat_user';

// Store token & user in localStorage
export const saveSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  const u = localStorage.getItem(USER_KEY);
  return u ? JSON.parse(u) : null;
};

export const isAuthenticated = () => !!getToken();

// POST /webhook/auth/login  →  { token, user }
export const loginUser = async ({ email, password }) => {
  const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Login failed');
  }
  return res.json(); // { token, user }
};

// POST /webhook/auth/register  →  { token, user }
export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Registration failed');
  }
  return res.json(); // { token, user }
};

// POST /webhook/auth/verify  →  { valid, user }
export const verifyToken = async (token) => {
  const res = await fetch(API_ENDPOINTS.AUTH.VERIFY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) return null;
  return res.json();
};
