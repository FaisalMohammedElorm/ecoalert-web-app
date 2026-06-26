// Service layer for reports, backed by the EcoAlert REST API.
import { Recycle, Leaf, Biohazard, TrafficCone, Trash2, Laptop } from 'lucide-react';
import { apiService } from './apiService';
import { storageService } from './storageService';

// Each category carries a lucide-react icon component (premium vector set used
// app-wide) in place of the previous platform emoji glyphs.
export const CATEGORIES = [
  { id: 'plastic', label: 'Plastic Waste', color: '#2196F3', icon: Recycle },
  { id: 'organic', label: 'Organic Waste', color: '#4CAF50', icon: Leaf },
  { id: 'hazardous', label: 'Hazardous Waste', color: '#F44336', icon: Biohazard },
  { id: 'road', label: 'Road Hazard', color: '#FF9800', icon: TrafficCone },
  { id: 'mixed', label: 'Mixed Waste', color: '#9C27B0', icon: Trash2 },
  { id: 'electronic', label: 'E-Waste', color: '#607D8B', icon: Laptop },
];

export const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: '#FF9800',
    bg: '#FFF3E0',
    dot: '#FF9800',
  },
  verified: {
    label: 'Verified',
    color: '#2196F3',
    bg: '#E3F2FD',
    dot: '#2196F3',
  },
  resolved: {
    label: 'Resolved',
    color: '#4CAF50',
    bg: '#E8F5E9',
    dot: '#4CAF50',
  },
};

export function getCategoryConfig(categoryLabel) {
  return CATEGORIES.find(c => c.label === categoryLabel) || CATEGORIES[4];
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-GH', { day: 'numeric', month: 'short' });
}

export async function reverseGeocode(lat, lng) {
  // Uses OpenStreetMap Nominatim (free, no key required)
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`
    );
    const data = await res.json();
    return data.display_name?.split(',').slice(0, 3).join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

/**
 * Create a new waste report with image upload
 * @param {object} reportData - Report data including category, title, description, etc.
 * @param {File} imageFile - Optional image file to upload
 * @returns {Promise<object>} Result object with success status
 */
export async function createReport(reportData, imageFile = null) {
  try {
    let imageUrl = '';

    // Upload image if provided
    if (imageFile) {
      const uploadResult = await storageService.uploadImage(imageFile, 'reports');
      if (!uploadResult.success) {
        return uploadResult;
      }
      imageUrl = uploadResult.url;
    }

    // Create report via the API
    const result = await apiService.createReport({
      ...reportData,
      imageUrl
    });

    return result;
  } catch (error) {
    console.error('Create report error:', error);
    return {
      success: false,
      error: 'Failed to create report. Please try again.'
    };
  }
}

/**
 * Get all reports
 * @param {object} filters - Optional filters
 * @returns {Promise<object>} Result object with reports array
 */
export async function getReports(filters = {}) {
  return apiService.getReports(filters);
}

/**
 * Get a single report
 * @param {string} reportId - Report ID
 * @returns {Promise<object>} Result object with report data
 */
export async function getReportById(reportId) {
  return apiService.getReportById(reportId);
}

/**
 * Get user's reports
 * @param {string} userId - User ID
 * @returns {Promise<object>} Result object with reports array
 */
export async function getUserReports(userId) {
  return apiService.getReports({ userId });
}

/**
 * Update report status
 * @param {string} reportId - Report ID
 * @param {string} status - New status
 * @returns {Promise<object>} Result object
 */
export async function updateReportStatus(reportId, status) {
  return apiService.updateReportStatus(reportId, status);
}

/**
 * Update a report
 * @param {string} reportId - Report ID
 * @param {object} reportData - Report fields to update
 * @returns {Promise<object>} Result object
 */
export async function updateReport(reportId, reportData) {
  return apiService.updateReport(reportId, reportData);
}

/**
 * Delete a report
 * @param {string} reportId - Report ID
 * @returns {Promise<object>} Result object
 */
export async function deleteReport(reportId) {
  return apiService.deleteReport(reportId);
}

/**
 * Add comment to a report
 * @param {string} reportId - Report ID
 * @param {string} text - Comment text
 * @returns {Promise<object>} Result object
 */
export async function addComment(reportId, text) {
  return apiService.addComment(reportId, text);
}

/**
 * Verify a report (upvote)
 * @param {string} reportId - Report ID
 * @returns {Promise<object>} Result object
 */
export async function verifyReport(reportId) {
  return apiService.verifyReport(reportId);
}

/**
 * Create waste tracking entry
 * @param {object} trackingData - Tracking data
 * @returns {Promise<object>} Result object
 */
export async function createTracking(trackingData) {
  return apiService.createTracking(trackingData);
}

/**
 * Get user's tracking entries
 * @param {string} userId - User ID
 * @returns {Promise<object>} Result object with trackings array
 */
export async function getUserTrackings(userId) {
  return apiService.getUserTrackings(userId);
}

/* ─── Admin ─── */

/** [ADMIN] Get all registered users */
export async function getAllUsers() {
  return apiService.getAllUsers();
}

/** [ADMIN] Delete any report regardless of ownership */
export async function adminDeleteReport(reportId) {
  return apiService.adminDeleteReport(reportId);
}

/** [ADMIN] Set a user's role */
export async function setUserRole(userId, role) {
  return apiService.setUserRole(userId, role);
}
