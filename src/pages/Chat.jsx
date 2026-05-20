import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Plus, Trash2, Paperclip, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
import CitationCard from '../components/CitationCard';
import {
  setMessages, addMessage, setTyping, clearMessages,
  appendStreamingText, flushStreamingMessage, setStreamingText, setError,
} from '../store/slices/chatSlice';
import { sendMessage, fetchChatHistory } from '../services/chatService';
import { uploadDocuments } from '../services/uploadService';
import { addDocument, loadDocuments } from '../store/slices/documentSlice';

export default function Chat() {
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const dispatch = useDispatch();
  const { messages, isTyping, streamingText, error } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, streamingText]);

  // Load chat history from backend on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const historyData = await fetchChatHistory();
        if (Array.isArray(historyData)) {
          const formattedMessages = [];
          historyData.forEach((item) => {
            if (item.question) {
              formattedMessages.push({
                id: `${item._id}-q` || `${item.id}-q` || Math.random(),
                isAi: false,
                content: item.question,
                timestamp: item.created_at || new Date().toISOString(),
              });
            }
            if (item.answer) {
              formattedMessages.push({
                id: `${item._id}-a` || `${item.id}-a` || Math.random(),
                isAi: true,
                content: item.answer,
                timestamp: item.created_at || new Date().toISOString(),
                citations: item.citations || [],
              });
            }
          });
          dispatch(setMessages(formattedMessages));
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };
    loadHistory();
  }, [dispatch]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const question = input.trim();
    const filesToUpload = [...attachedFiles];
    
    setInput('');
    setAttachedFiles([]); // Clear attached files immediately in UI

    // Add user message
    dispatch(addMessage({
      id: Date.now(),
      isAi: false,
      content: question,
      timestamp: new Date().toISOString(),
    }));

    dispatch(setTyping(true));
    dispatch(setStreamingText(''));

    try {
      // 1. If files are attached, perform inline upload first
      if (filesToUpload.length > 0) {
        dispatch(setStreamingText('📤 Uploading and processing ' + filesToUpload.length + ' attached document(s)...'));
        const result = await uploadDocuments(filesToUpload);
        if (result && result.documents) {
          result.documents.forEach((doc) => {
            dispatch(addDocument(doc));
          });
          // Refresh document history/sidebar list
          dispatch(loadDocuments());
        }
        dispatch(setStreamingText('🔍 Searching vector database...'));
      }

      let isFirstChunk = true;

      // 2. Stream AI response
      await sendMessage(
        {
          userId: user?._id || user?.id || 'anonymous',
          chatId: `chat-${Date.now()}`,
          question,
        },
        // onChunk — append each streaming token
        (chunk) => {
          if (isFirstChunk) {
            dispatch(setStreamingText('')); // Clear temporary uploading/searching text
            isFirstChunk = false;
          }
          dispatch(setTyping(false));
          dispatch(appendStreamingText(chunk));
          scrollToBottom();
        },
        // onDone — finalise message
        (citations) => {
          dispatch(flushStreamingMessage(citations));
          dispatch(setTyping(false));
        },
      );
    } catch (err) {
      dispatch(setTyping(false));
      dispatch(setStreamingText(''));
      dispatch(setError(err.message));
      dispatch(addMessage({
        id: Date.now(),
        isAi: true,
        content: `⚠️ Error: ${err.message}. Please check your n8n connection.`,
        timestamp: new Date().toISOString(),
      }));
    }
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removeAttachedFile = (idx) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const isEmpty = messages.length === 0 && !streamingText;

  return (
    <div className="flex flex-col h-full bg-app-bg relative">
      {/* Clear button */}
      {!isEmpty && (
        <div className="absolute top-0 right-0 p-4 z-10">
          <button
            onClick={() => dispatch(clearMessages())}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-muted hover:text-red-400 bg-app-card/50 hover:bg-red-400/5 border border-app-line-soft rounded-lg transition-colors backdrop-blur-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-44">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-2xl shadow-primary/30"
            >
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-text-main mb-3">Ask anything about your documents</h2>
            <p className="text-text-muted max-w-md">
              Upload a document first, then ask questions. Our AI will search through your documents and provide accurate answers with source citations.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-8 max-w-md w-full">
              {['Summarize this document', 'Extract key points', 'Find specific information', 'Compare sections'].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="p-3 rounded-xl bg-app-card border border-app-line text-sm text-text-muted hover:text-text-main hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto pt-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div key={msg.id} className="group">
                  <ChatBubble message={msg.content} isAi={msg.isAi} timestamp={msg.timestamp} />
                  {msg.citations?.length > 0 && (
                    <div className="pl-16 pr-4 pb-4 flex flex-wrap gap-2">
                      {msg.citations.map((c, i) => <CitationCard key={i} citation={c} />)}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Streaming message */}
            {streamingText && (
              <ChatBubble message={streamingText} isAi={true} isStreaming={true} />
            )}

            {/* Typing indicator (before streaming starts) */}
            {isTyping && !streamingText && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-app-bg via-app-bg/95 to-transparent pt-10 pb-6 px-4 z-20">
        <div className="max-w-4xl mx-auto">
          {/* Attached file chips */}
          <AnimatePresence>
            {attachedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-wrap gap-2 mb-3"
              >
                {attachedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-app-card border border-app-line rounded-full text-sm text-text-main">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span className="max-w-[180px] truncate">{file.name}</span>
                    <button onClick={() => removeAttachedFile(i)} className="text-text-muted hover:text-red-400 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input box */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-500 pointer-events-none" />
            <div className="relative bg-app-card rounded-2xl border border-app-line flex items-end p-2 shadow-2xl">
              <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileAttach} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-text-muted hover:text-primary transition-colors rounded-xl hover:bg-primary/5 shrink-0"
                title="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                placeholder="Ask anything about your documents..."
                className="flex-1 min-h-[44px] max-h-[180px] bg-transparent text-text-main placeholder-text-muted resize-none focus:outline-none p-3 scrollbar-thin"
                rows={1}
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed m-1 shadow-lg shadow-primary/20 shrink-0"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <p className="text-center mt-3 text-xs text-text-muted">
            Powered by GPT-4.1-mini via RAG • Answers based only on your uploaded documents
          </p>
        </div>
      </div>
    </div>
  );
}
