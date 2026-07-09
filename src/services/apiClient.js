import axios from 'axios';

// Axios instance for the EcoAlert REST API. Keeping every backend request here
// means components do not need to know where the server lives or how JWT auth is
// attached.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'eco_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Axios interceptors run before every request. This one reads the JWT from
// localStorage and sends it as a Bearer token for protected Express routes.
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (config.authRequired !== false && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Keeps the existing service API stable while switching the implementation from
// fetch to Axios. `isForm` lets Axios set the multipart boundary itself.
export async function apiFetch(path, { method = 'GET', body, auth = true, isForm = false } = {}) {
  try {
    const response = await apiClient.request({
      url: path,
      method,
      data: body,
      authRequired: auth,
      headers: isForm ? {} : undefined,
    });
    return response.data;
  } catch (err) {
    const error = new Error(err.response?.data?.message || err.message || 'Request failed.');
    error.status = err.response?.status;
    throw error;
  }
}

export { BASE_URL };
