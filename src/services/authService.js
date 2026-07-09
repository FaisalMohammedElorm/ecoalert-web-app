import { apiFetch, tokenStore } from './apiClient';

// JWT-based auth service. The token is persisted in localStorage and attached
// to protected requests by the Axios interceptor in apiClient.
export const authService = {
  async signup(email, password, name, phone) {
    try {
      const { token, user } = await apiFetch('/auth/register', {
        method: 'POST',
        auth: false,
        body: { email, password, name, phone },
      });
      tokenStore.set(token);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async login(email, password) {
    try {
      const { token, user } = await apiFetch('/auth/login', {
        method: 'POST',
        auth: false,
        body: { email, password },
      });
      tokenStore.set(token);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async logout() {
    // JWT is stateless: the server confirms the intent, then the browser
    // removes the token so future protected requests are unauthenticated.
    try {
      if (tokenStore.get()) {
        await apiFetch('/auth/logout', { method: 'POST' });
      }
    } catch {
      // Still clear the token if the server is unreachable; local removal is
      // what actually signs this browser out.
    }
    tokenStore.clear();
    return { success: true };
  },

  // Returns the current user (from the stored token) or null.
  async getCurrentUser() {
    if (!tokenStore.get()) return null;
    try {
      const { user } = await apiFetch('/auth/me');
      return user;
    } catch {
      tokenStore.clear();
      return null;
    }
  },

  async updateUserProfile(data) {
    try {
      const { user } = await apiFetch('/auth/profile', { method: 'PUT', body: data });
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
