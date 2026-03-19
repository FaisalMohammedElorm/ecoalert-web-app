import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { storage, auth } from '../firebase';

export const storageService = {
  /**
   * Upload an image file to Cloud Storage
   * @param {File} file - Image file to upload
   * @param {string} folder - Storage folder path (e.g., 'reports', 'profiles')
   * @returns {Promise<{success: boolean, url?: string, error?: string}>}
   */
  async uploadImage(file, folder = 'reports') {
    try {
      if (!file) {
        return { success: false, error: 'No file selected' };
      }

      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        return { success: false, error: 'Invalid file type. Please upload JPG, PNG, or WebP' };
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return { success: false, error: 'File size must be less than 10MB' };
      }

      // Create storage path
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const filename = `${timestamp}_${randomString}.${file.name.split('.').pop()}`;
      const storagePath = `${folder}/${user.uid}/${filename}`;

      // Upload file
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file, {
        contentType: file.type
      });

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      return { success: true, url: downloadURL };
    } catch (error) {
      console.error('Upload image error:', error);
      return {
        success: false,
        error: 'Failed to upload image. Please try again.'
      };
    }
  },

  /**
   * Upload base64 image to Cloud Storage
   * @param {string} base64Data - Base64 encoded image data
   * @param {string} mimeType - MIME type (e.g., 'image/jpeg')
   * @param {string} folder - Storage folder path
   * @returns {Promise<{success: boolean, url?: string, error?: string}>}
   */
  async uploadBase64Image(base64Data, mimeType = 'image/jpeg', folder = 'reports') {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Convert base64 to blob
      const arr = base64Data.split(',');
      const bstr = atob(arr[1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }
      const blob = new Blob([u8arr], { type: mimeType });

      // Create storage path
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const ext = mimeType.split('/')[1] || 'jpg';
      const filename = `${timestamp}_${randomString}.${ext}`;
      const storagePath = `${folder}/${user.uid}/${filename}`;

      // Upload blob
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, blob, {
        contentType: mimeType
      });

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      return { success: true, url: downloadURL };
    } catch (error) {
      console.error('Upload base64 image error:', error);
      return {
        success: false,
        error: 'Failed to upload image. Please try again.'
      };
    }
  },

  /**
   * Delete an image from Cloud Storage
   * @param {string} imageUrl - Full URL or storage path of the image
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deleteImage(imageUrl) {
    try {
      if (!imageUrl) {
        return { success: false, error: 'No image URL provided' };
      }

      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // If full URL is provided, extract the path
      let storagePath = imageUrl;
      if (imageUrl.includes('firebasestorage.googleapis.com')) {
        // Extract path from full URL
        try {
          const url = new URL(imageUrl);
          storagePath = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
        } catch (e) {
          return { success: false, error: 'Invalid image URL' };
        }
      }

      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);

      return { success: true };
    } catch (error) {
      console.error('Delete image error:', error);
      // Don't fail silently on delete errors - some URLs might already be deleted
      return { success: true };
    }
  },

  /**
   * Upload profile picture
   * @param {File} file - Image file
   * @returns {Promise<{success: boolean, url?: string, error?: string}>}
   */
  async uploadProfilePicture(file) {
    return this.uploadImage(file, 'profile_pictures');
  },

  /**
   * Get image metadata (size, type)
   * @param {File} file - Image file
   * @returns {object} Metadata object
   */
  getImageMetadata(file) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      formattedSize: this.formatFileSize(file.size)
    };
  },

  /**
   * Format file size to human readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
};
