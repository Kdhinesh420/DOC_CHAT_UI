import { API_ENDPOINTS } from '../api/config';
import { getToken } from './authService';

/**
 * Helper to extract answer text and citations from various JSON formats,
 * including arrays and objects with keys like 'answer', 'text', 'response', etc.
 */
const extractTextAndCitations = (parsed) => {
  const target = Array.isArray(parsed) ? parsed[0] : parsed;
  if (!target) return { text: '', citations: null };
  const text = target.answer || target.text || target.chunk || target.response || target.content || target.choices?.[0]?.delta?.content;
  const citations = target.citations || null;
  return { text, citations };
};

/**
 * Sends a chat message to the n8n RAG workflow and streams the response.
 * Parses both Server-Sent Events (SSE) format and raw chunked text/JSON.
 * @param {object} payload - { userId, chatId, question }
 * @param {function} onChunk - Callback triggered on each streaming text chunk
 * @param {function} onDone - Callback triggered when stream closes, receives accumulated citations
 */
export const sendMessage = async (payload, onChunk, onDone) => {
  const token = getToken();
  const response = await fetch(API_ENDPOINTS.CHAT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Server responded with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let citations = [];

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep partial line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // 1. SSE Format: data: {...}
        if (trimmed.startsWith('data:')) {
          const dataStr = trimmed.slice(5).trim();
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            const { text, citations: newCits } = extractTextAndCitations(parsed);
            if (newCits) {
              citations = newCits;
            }
            if (text) {
              onChunk(text);
            }
          } catch (e) {
            // Fallback: If it's not valid JSON, treat as raw text
            onChunk(dataStr);
          }
        } else {
          // 2. Direct JSON or Raw text stream
          try {
            const parsed = JSON.parse(trimmed);
            const { text, citations: newCits } = extractTextAndCitations(parsed);
            if (newCits) {
              citations = newCits;
            }
            if (text) {
              onChunk(text);
            }
          } catch (e) {
            onChunk(trimmed);
          }
        }
      }
    }

    // Process any leftover content in the buffer
    if (buffer.trim()) {
      const trimmed = buffer.trim();
      if (trimmed.startsWith('data:')) {
        const dataStr = trimmed.slice(5).trim();
        if (dataStr !== '[DONE]') {
          try {
            const parsed = JSON.parse(dataStr);
            const { text, citations: newCits } = extractTextAndCitations(parsed);
            if (newCits) citations = newCits;
            if (text) onChunk(text);
          } catch (e) {
            onChunk(dataStr);
          }
        }
      } else {
        try {
          const parsed = JSON.parse(trimmed);
          const { text, citations: newCits } = extractTextAndCitations(parsed);
          if (newCits) citations = newCits;
          if (text) onChunk(text);
        } catch (e) {
          onChunk(trimmed);
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    throw error;
  } finally {
    reader.releaseLock();
  }

  if (onDone) {
    onDone(citations);
  }
};

/**
 * Fetches past chat history from the n8n backend.
 * @returns {Promise<object[]>} Array of raw chat interactions (question/answer format)
 */
export const fetchChatHistory = async () => {
  const token = getToken();
  const res = await fetch(API_ENDPOINTS.HISTORY.LIST, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch chat history');
  }

  return res.json();
};

