import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  isTyping: false,
  streamingText: '',
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.error = null;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      state.error = null;
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.streamingText = '';
      state.error = null;
    },
    setStreamingText: (state, action) => {
      state.streamingText = action.payload;
    },
    appendStreamingText: (state, action) => {
      state.streamingText += action.payload;
    },
    flushStreamingMessage: (state, action) => {
      if (state.streamingText.trim()) {
        state.messages.push({
          id: Date.now(),
          isAi: true,
          content: state.streamingText,
          citations: action.payload || [],
          timestamp: new Date().toISOString(),
        });
      }
      state.streamingText = '';
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMessages,
  addMessage,
  setTyping,
  clearMessages,
  setStreamingText,
  appendStreamingText,
  flushStreamingMessage,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;
