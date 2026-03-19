// Service layer for reports with Firestore integration
import { firestoreService } from './firestoreService';
import { storageService } from './storageService';

export const CATEGORIES = [
  { id: 'plastic', label: 'Plastic Waste', color: '#2196F3', emoji: '♻️' },
  { id: 'organic', label: 'Organic Waste', color: '#4CAF50', emoji: '🌿' },
  { id: 'hazardous', label: 'Hazardous Waste', color: '#F44336', emoji: '☠️' },
  { id: 'road', label: 'Road Hazard', color: '#FF9800', emoji: '🚧' },
  { id: 'mixed', label: 'Mixed Waste', color: '#9C27B0', emoji: '🗑️' },
  { id: 'electronic', label: 'E-Waste', color: '#607D8B', emoji: '💻' },
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

    // Create report in Firestore
    const result = await firestoreService.createReport({
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
  return firestoreService.getReports(filters);
}

/**
 * Get a single report
 * @param {string} reportId - Report ID
 * @returns {Promise<object>} Result object with report data
 */
export async function getReportById(reportId) {
  return firestoreService.getReportById(reportId);
}

/**
 * Get user's reports
 * @param {string} userId - User ID
 * @returns {Promise<object>} Result object with reports array
 */
export async function getUserReports(userId) {
  return firestoreService.getReports({ userId });
}

/**
 * Update report status
 * @param {string} reportId - Report ID
 * @param {string} status - New status
 * @returns {Promise<object>} Result object
 */
export async function updateReportStatus(reportId, status) {
  return firestoreService.updateReportStatus(reportId, status);
}

/**
 * Delete a report
 * @param {string} reportId - Report ID
 * @returns {Promise<object>} Result object
 */
export async function deleteReport(reportId) {
  return firestoreService.deleteReport(reportId);
}

/**
 * Add comment to a report
 * @param {string} reportId - Report ID
 * @param {string} text - Comment text
 * @returns {Promise<object>} Result object
 */
export async function addComment(reportId, text) {
  return firestoreService.addComment(reportId, text);
}

/**
 * Verify a report (upvote)
 * @param {string} reportId - Report ID
 * @returns {Promise<object>} Result object
 */
export async function verifyReport(reportId) {
  return firestoreService.verifyReport(reportId);
}

/**
 * Create waste tracking entry
 * @param {object} trackingData - Tracking data
 * @returns {Promise<object>} Result object
 */
export async function createTracking(trackingData) {
  return firestoreService.createTracking(trackingData);
}

/**
 * Get user's tracking entries
 * @param {string} userId - User ID
 * @returns {Promise<object>} Result object with trackings array
 */
export async function getUserTrackings(userId) {
  return firestoreService.getUserTrackings(userId);
}

