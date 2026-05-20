import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDocuments, deleteDocument } from '../../services/documentService';

export const loadDocuments = createAsyncThunk(
  'documents/loadDocuments',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDocuments();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load documents');
    }
  }
);

export const removeDocumentById = createAsyncThunk(
  'documents/removeDocument',
  async (docId, { rejectWithValue }) => {
    try {
      await deleteDocument(docId);
      return docId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete document');
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    addDocument: (state, action) => {
      // Add document if it doesn't already exist in the list
      const exists = state.list.some(doc => doc._id === action.payload._id);
      if (!exists) {
        state.list.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Load Documents
      .addCase(loadDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Document
      .addCase(removeDocumentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeDocumentById.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(doc => doc._id !== action.payload);
      })
      .addCase(removeDocumentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addDocument } = documentSlice.actions;
export default documentSlice.reducer;
