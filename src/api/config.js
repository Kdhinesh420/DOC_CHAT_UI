// Central config for all n8n webhook endpoints
const BASE_URL = import.meta.env.VITE_N8N_BASE_URL || 'https://devakavi.app.n8n.cloud/webhook-test';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    VERIFY: `${BASE_URL}/auth/verify`,
  },
  UPLOAD: `${BASE_URL}/upload`,
  CHAT: `${BASE_URL}/chat`,
  DOCUMENTS: {
    LIST: `${BASE_URL}/documents/list`,
    DELETE: `${BASE_URL}/documents/delete`,
  },
  HISTORY: {
    LIST: `${BASE_URL}/history`,
    GET: `${BASE_URL}/history/get`,
  },
};

export default BASE_URL;
