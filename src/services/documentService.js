import { API_ENDPOINTS } from '../api/config';
import { getToken } from './authService';

/**
 * Fetch the list of uploaded documents from the n8n backend.
 * @returns {Promise<object[]>} Array of documents
 */
export const fetchDocuments = async () => {
  const token = getToken();
  const res = await fetch(API_ENDPOINTS.DOCUMENTS.LIST, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch documents');
  }

  const data = await res.json();
  // Support both direct array response or standard object wraps
  return Array.isArray(data) ? data : data.documents || [];
};

/**
 * Delete a specific document from the vector store and database.
 * @param {string} docId - The ID of the document to delete
 * @returns {Promise<object>} Delete confirmation response
 */
export const deleteDocument = async (docId) => {
  const token = getToken();
  const res = await fetch(API_ENDPOINTS.DOCUMENTS.DELETE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ docId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete document');
  }

  return res.json();
};
