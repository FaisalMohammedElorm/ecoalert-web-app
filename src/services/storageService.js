import { apiFetch } from './apiClient';

// Image uploads go to the backend (POST /api/upload), which stores the file
// and returns a public URL.
export const storageService = {
  async uploadImage(file, folder = 'reports') {
    try {
      if (!file) return { success: false, error: 'No file selected' };
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        return { success: false, error: 'Invalid file type. Please upload JPG, PNG, or WebP' };
      }
      if (file.size > 10 * 1024 * 1024) {
        return { success: false, error: 'File size must be less than 10MB' };
      }

      const form = new FormData();
      form.append('image', file);
      form.append('folder', folder);

      const { url } = await apiFetch('/upload', { method: 'POST', isForm: true, body: form });
      return { success: true, url };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to upload image. Please try again.' };
    }
  },

  async uploadProfilePicture(file) {
    return this.uploadImage(file, 'profile_pictures');
  },

  getImageMetadata(file) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      formattedSize: this.formatFileSize(file.size),
    };
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },
};
