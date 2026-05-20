import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addDocument, loadDocuments } from '../store/slices/documentSlice';
import { uploadDocuments } from '../services/uploadService';
import { cn } from '../utils/cn';

const FILE_ICONS = {
  'application/pdf': { label: 'PDF', color: 'text-red-400', bg: 'bg-red-400/10' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { label: 'DOCX', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  'text/plain': { label: 'TXT', color: 'text-green-400', bg: 'bg-green-400/10' },
  default: { label: 'IMG', color: 'text-purple-400', bg: 'bg-purple-400/10' },
};

function getFileIcon(type) {
  return FILE_ICONS[type] || FILE_ICONS.default;
}

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | success | error
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  }, []);

  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleUpload = async () => {
    if (!files.length) return;
    setUploadState('uploading');
    setProgress(0);
    setErrorMsg('');
    try {
      const result = await uploadDocuments(files, (p) => setProgress(p));
      // Add each document to Redux store
      (result.documents || []).forEach((doc) => dispatch(addDocument(doc)));
      
      // Refresh document list / chat history
      dispatch(loadDocuments());
      
      // Store the n8n success message or fallback
      const msg = result.message || result.msg || 'Documents uploaded and indexed successfully!';
      setSuccessMsg(msg);
      
      setUploadState('success');
      setFiles([]);
      
      // Navigate to chat after a brief delay to show successful confirmation
      setTimeout(() => {
        navigate('/chat');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message);
      setUploadState('error');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300',
          isDragging
            ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(99,102,241,0.25)]'
            : 'border-app-line hover:border-primary/50 hover:bg-app-hover bg-app-card',
        )}
      >
        <div className="flex flex-col items-center justify-center">
          <motion.div
            animate={isDragging ? { scale: 1.1, rotate: -5 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20"
          >
            <UploadCloud className="w-8 h-8 text-primary" />
          </motion.div>
          <h3 className="text-xl font-semibold text-text-main mb-2">
            {isDragging ? 'Drop files here!' : 'Upload your documents'}
          </h3>
          <p className="text-text-muted mb-6 text-sm">
            Supports PDF, DOCX, TXT, and images • Max 20MB per file
          </p>

          <label className="cursor-pointer bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Browse Files
            <input
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp"
              onChange={(e) => {
                if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
                e.target.value = '';
              }}
            />
          </label>
        </div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 space-y-3"
          >
            <h4 className="text-sm font-medium text-text-muted">Selected Files ({files.length})</h4>
            <div className="space-y-2">
              {files.map((file, i) => {
                const icon = getFileIcon(file.type);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center p-3 rounded-xl bg-app-card border border-app-line group"
                  >
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mr-3 text-xs font-bold', icon.bg, icon.color)}>
                      {icon.label}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-main truncate">{file.name}</div>
                      <div className="text-xs text-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      className="p-2 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Upload Progress */}
            {uploadState === 'uploading' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Uploading & processing...</span>
                  <span className="text-primary font-medium">{progress}%</span>
                </div>
                <div className="h-2 bg-app-line rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Status messages */}
            {uploadState === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-1 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-left"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">{successMsg}</span>
                </div>
                <p className="text-xs text-green-400/80 ml-6">
                  Successfully indexed. Redirecting you to chat in 2 seconds...
                </p>
              </motion.div>
            )}

            {uploadState === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {errorMsg || 'Upload failed. Check your n8n connection.'}
              </motion.div>
            )}

            {uploadState !== 'uploading' && (
              <button
                onClick={handleUpload}
                disabled={uploadState === 'uploading'}
                className="w-full mt-4 bg-primary text-white py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {uploadState === 'uploading' && <Loader2 className="w-4 h-4 animate-spin" />}
                Process {files.length} {files.length === 1 ? 'Document' : 'Documents'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
