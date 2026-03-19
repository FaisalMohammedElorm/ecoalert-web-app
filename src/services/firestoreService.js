import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  increment as firestoreIncrement,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '../firebase';

export const firestoreService = {
  /**
   * Create a new waste report
   * @param {object} reportData - Report data including category, location, description, imageUrl, coordinates
   * @returns {Promise<{success: boolean, reportId?: string, error?: string}>}
   */
  async createReport(reportData) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const reportsRef = collection(db, 'reports');
      const docRef = await addDoc(reportsRef, {
        userId: user.uid,
        category: reportData.category,
        title: reportData.title,
        description: reportData.description,
        imageUrl: reportData.imageUrl || '',
        coordinates: reportData.coordinates || {
          latitude: 0,
          longitude: 0
        },
        location: reportData.location || '',
        status: 'pending',
        verificationCount: 0,
        upvotes: 0,
        downvotes: 0,
        comments: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Update user's report count
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        reportsCount: firestoreIncrement(1)
      });

      return { success: true, reportId: docRef.id };
    } catch (error) {
      console.error('Create report error:', error);
      return {
        success: false,
        error: 'Failed to create report. Please try again.'
      };
    }
  },

  /**
   * Get all reports with optional filtering
   * @param {object} filters - Filter options (status, userId, category, limit)
   * @returns {Promise<{success: boolean, reports?: array, error?: string}>}
   */
  async getReports(filters = {}) {
    try {
      let q = collection(db, 'reports');
      const constraints = [];

      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }
      if (filters.userId) {
        constraints.push(where('userId', '==', filters.userId));
      }
      if (filters.category) {
        constraints.push(where('category', '==', filters.category));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }

      const q_final = constraints.length > 0
        ? query(q, ...constraints)
        : query(q, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q_final);
      const reports = [];

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        reports.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      }

      return { success: true, reports };
    } catch (error) {
      console.error('Get reports error:', error);
      return {
        success: false,
        error: 'Failed to fetch reports.'
      };
    }
  },

  /**
   * Get a single report by ID
   * @param {string} reportId - Report ID
   * @returns {Promise<{success: boolean, report?: object, error?: string}>}
   */
  async getReportById(reportId) {
    try {
      const reportRef = doc(db, 'reports', reportId);
      const reportDoc = await getDoc(reportRef);

      if (!reportDoc.exists()) {
        return { success: false, error: 'Report not found' };
      }

      const data = reportDoc.data();
      return {
        success: true,
        report: {
          id: reportDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      };
    } catch (error) {
      console.error('Get report error:', error);
      return {
        success: false,
        error: 'Failed to fetch report.'
      };
    }
  },

  /**
   * Update report status
   * @param {string} reportId - Report ID
   * @param {string} status - New status (pending, verified, resolved)
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async updateReportStatus(reportId, status) {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        status: status,
        updatedAt: Timestamp.now()
      });

      // If report is verified, update user's verified count
      if (status === 'verified') {
        const reportDoc = await getDoc(reportRef);
        const userId = reportDoc.data().userId;
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          verifiedReportsCount: firestoreIncrement(1)
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Update status error:', error);
      return {
        success: false,
        error: 'Failed to update report status.'
      };
    }
  },

  /**
   * Delete a report
   * @param {string} reportId - Report ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deleteReport(reportId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const reportRef = doc(db, 'reports', reportId);
      const reportDoc = await getDoc(reportRef);

      if (!reportDoc.exists()) {
        return { success: false, error: 'Report not found' };
      }

      // Check if user is the owner
      if (reportDoc.data().userId !== user.uid) {
        return { success: false, error: 'You can only delete your own reports' };
      }

      await deleteDoc(reportRef);

      // Update user's report count
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        reportsCount: firestoreIncrement(-1)
      });

      return { success: true };
    } catch (error) {
      console.error('Delete report error:', error);
      return {
        success: false,
        error: 'Failed to delete report.'
      };
    }
  },

  /**
   * Add comment to a report
   * @param {string} reportId - Report ID
   * @param {string} text - Comment text
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async addComment(reportId, text) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const reportRef = doc(db, 'reports', reportId);
      const reportDoc = await getDoc(reportRef);

      if (!reportDoc.exists()) {
        return { success: false, error: 'Report not found' };
      }

      const newComment = {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        profilePictureUrl: user.photoURL || '',
        text: text,
        createdAt: Timestamp.now()
      };

      const currentComments = reportDoc.data().comments || [];
      await updateDoc(reportRef, {
        comments: [...currentComments, newComment],
        updatedAt: Timestamp.now()
      });

      return { success: true };
    } catch (error) {
      console.error('Add comment error:', error);
      return {
        success: false,
        error: 'Failed to add comment.'
      };
    }
  },

  /**
   * Verify a report (upvote)
   * @param {string} reportId - Report ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async verifyReport(reportId) {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        upvotes: firestoreIncrement(1),
        verificationCount: firestoreIncrement(1),
        updatedAt: Timestamp.now()
      });

      return { success: true };
    } catch (error) {
      console.error('Verify report error:', error);
      return {
        success: false,
        error: 'Failed to verify report.'
      };
    }
  },

  /**
   * Create a waste tracking entry
   * @param {object} trackingData - Tracking data including category, quantity, weight, date
   * @returns {Promise<{success: boolean, trackingId?: string, error?: string}>}
   */
  async createTracking(trackingData) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const trackingRef = collection(db, 'waste_tracking');
      const docRef = await addDoc(trackingRef, {
        userId: user.uid,
        category: trackingData.category,
        quantity: trackingData.quantity,
        weight: trackingData.weight || 0,
        unit: trackingData.unit || 'kg',
        date: Timestamp.now(),
        notes: trackingData.notes || '',
        createdAt: Timestamp.now()
      });

      return { success: true, trackingId: docRef.id };
    } catch (error) {
      console.error('Create tracking error:', error);
      return {
        success: false,
        error: 'Failed to create tracking entry.'
      };
    }
  },

  /**
   * Get user's tracking entries
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, trackings?: array, error?: string}>}
   */
  async getUserTrackings(userId) {
    try {
      const trackingRef = collection(db, 'waste_tracking');
      const q = query(
        trackingRef,
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const trackings = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        trackings.push({
          id: doc.id,
          ...data,
          date: data.date?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });

      return { success: true, trackings };
    } catch (error) {
      console.error('Get trackings error:', error);
      return {
        success: false,
        error: 'Failed to fetch tracking entries.'
      };
    }
  }
};
