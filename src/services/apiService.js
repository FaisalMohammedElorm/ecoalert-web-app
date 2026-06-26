import { apiFetch } from './apiClient';

// Data-access layer backed by the EcoAlert REST API.
// Keeps stable method names and return shapes for the rest of the app.
export const apiService = {
  // ─── Reports ───
  async createReport(reportData) {
    try {
      const { report } = await apiFetch('/reports', { method: 'POST', body: reportData });
      return { success: true, reportId: report.id, report };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getReports(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.userId) params.set('userId', filters.userId);
      if (filters.category) params.set('category', filters.category);
      if (filters.limit) params.set('limit', String(filters.limit));
      const qs = params.toString();
      const { reports } = await apiFetch(`/reports${qs ? `?${qs}` : ''}`, { auth: false });
      return { success: true, reports };
    } catch (error) {
      return { success: false, error: error.message, reports: [] };
    }
  },

  async getReportById(reportId) {
    try {
      const { report } = await apiFetch(`/reports/${reportId}`, { auth: false });
      return { success: true, report };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateReportStatus(reportId, status) {
    try {
      await apiFetch(`/reports/${reportId}/status`, { method: 'PUT', body: { status } });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateReport(reportId, reportData) {
    try {
      const { report } = await apiFetch(`/reports/${reportId}`, { method: 'PUT', body: reportData });
      return { success: true, report };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteReport(reportId) {
    try {
      await apiFetch(`/reports/${reportId}`, { method: 'DELETE' });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Admin delete uses the same endpoint; the backend authorizes by role/owner.
  async adminDeleteReport(reportId) {
    return this.deleteReport(reportId);
  },

  async addComment(reportId, text) {
    try {
      await apiFetch(`/reports/${reportId}/comments`, { method: 'POST', body: { text } });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async verifyReport(reportId) {
    try {
      await apiFetch(`/reports/${reportId}/verify`, { method: 'POST' });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // ─── Tracking ───
  async createTracking(trackingData) {
    try {
      const { tracking } = await apiFetch('/tracking', { method: 'POST', body: trackingData });
      return { success: true, trackingId: tracking.id, tracking };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getUserTrackings() {
    try {
      const { trackings } = await apiFetch('/tracking');
      return { success: true, trackings };
    } catch (error) {
      return { success: false, error: error.message, trackings: [] };
    }
  },

  // ─── Admin: users ───
  async getAllUsers() {
    try {
      const { users } = await apiFetch('/users');
      return { success: true, users };
    } catch (error) {
      return { success: false, error: error.message, users: [] };
    }
  },

  async setUserRole(userId, role) {
    try {
      await apiFetch(`/users/${userId}/role`, { method: 'PUT', body: { role } });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
