import { API_ENDPOINTS } from '../api/config';
import { getToken } from './authService';

/**
 * Upload documents to the n8n backend using XMLHttpRequest for upload progress tracking.
 * @param {File[]} files - Array of files to upload
 * @param {Function} onProgress - Callback with upload progress percentage
 * @returns {Promise<object>} Response data
 */
export const uploadDocuments = (files, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    // Append all selected files to form data
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    xhr.open('POST', API_ENDPOINTS.UPLOAD, true);

    // Set authorization header if token exists
    const token = getToken();
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    // Monitor upload progress
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (err) {
          // Fallback if response is not valid JSON
          resolve({ success: true, documents: [] });
        }
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          reject(new Error(response.message || 'Upload failed'));
        } catch (err) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred during document upload'));
    };

    xhr.send(formData);
  });
};
