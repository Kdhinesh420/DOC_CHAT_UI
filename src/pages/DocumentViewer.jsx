import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, Share2, MoreVertical, MessageSquare, ArrowLeft, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadDocuments } from '../store/slices/documentSlice';

export default function DocumentViewer() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list: documents, loading } = useSelector((state) => state.documents);

  // Load documents if not already loaded
  useEffect(() => {
    if (documents.length === 0) {
      dispatch(loadDocuments());
    }
  }, [dispatch, documents.length]);

  // Find the selected document
  const doc = documents.find((d) => d._id === docId || d.id === docId);

  if (loading && documents.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-app-bg text-text-main">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Loading document details...</p>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="h-full flex items-center justify-center bg-app-bg text-text-main p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <FileText className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Document Not Found</h2>
          <p className="text-text-muted mb-6">
            The document you are looking for does not exist or has been deleted.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Uploads
          </Link>
        </div>
      </div>
    );
  }

  const fileName = doc.fileName || doc.name || 'Untitled Document';
  const fileExtension = fileName.split('.').pop().toUpperCase();
  const fileSizeStr = doc.fileSize
    ? `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB`
    : 'Unknown size';
  const uploadDate = doc.uploadedAt
    ? new Date(doc.uploadedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recently';

  // Fallback / Mock values for insights if not provided by backend
  const docSummary = doc.summary || `This document "${fileName}" has been processed and indexed into the vector store. Its contents have been split into chunks and are fully searchable via the RAG workspace.`;
  const keyEntities = doc.keyEntities || [
    fileExtension,
    doc.fileType || 'Document',
    doc.vectorCount ? `${doc.vectorCount} chunks` : 'Indexed',
    'Active Vector',
  ];

  return (
    <div className="flex h-full bg-app-bg text-text-main">
      {/* Main Document Viewer (Left) */}
      <div className="flex-1 flex flex-col border-r border-app-line-soft min-w-0">
        <div className="h-16 flex items-center justify-between px-6 border-b border-app-line-soft bg-app-card/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-text-muted hover:text-text-main rounded-lg hover:bg-app-hover transition-colors mr-1"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
              {fileExtension}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-text-main text-sm truncate" title={fileName}>
                {fileName}
              </h2>
              <p className="text-xs text-text-muted truncate">
                Uploaded {uploadDate} • {fileSizeStr}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="p-2 text-text-muted hover:text-text-main hover:bg-app-hover rounded-lg transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-text-muted hover:text-text-main hover:bg-app-hover rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-text-muted hover:text-text-main hover:bg-app-hover rounded-lg transition-colors"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mock PDF / Document Preview Area */}
        <div className="flex-1 bg-black/20 p-8 overflow-y-auto flex justify-center items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl aspect-[1/1.414] bg-white dark:bg-slate-900 border border-app-line rounded-xl shadow-2xl p-12 overflow-hidden relative text-slate-800 dark:text-slate-100 flex flex-col justify-between"
          >
            {/* Styled Document Mock Header */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <h1 className="text-xl font-bold tracking-tight">{fileName}</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      SYSTEM DOCUMENT INTERFACE • {fileExtension} READER
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                  PAGE 1 OF 1
                </span>
              </div>

              {/* Mock lines and content representing processed document */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider mb-2">
                    Extracted Header / Metadata
                  </h3>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 font-mono text-xs space-y-1">
                    <p>
                      <span className="text-primary font-bold">Document ID:</span> {doc._id || doc.id}
                    </p>
                    <p>
                      <span className="text-primary font-bold">Content-Type:</span>{' '}
                      {doc.fileType || 'application/octet-stream'}
                    </p>
                    <p>
                      <span className="text-primary font-bold">Vector Database Status:</span>{' '}
                      {doc.vectorCount ? `Indexed with ${doc.vectorCount} chunks` : 'Indexed (Active)'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-11/12"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-10/12"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                </div>

                <div className="h-48 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center">
                  <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                  <span className="text-slate-400 dark:text-slate-500 font-medium text-sm">
                    Interactive PDF & Doc Reader
                  </span>
                  <p className="text-xs text-slate-400 dark:text-slate-600 mt-1 max-w-xs">
                    File text has been parsed and loaded into Qdrant vectors. Ask questions in the Chat tab to inspect specific sections.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between text-xs text-slate-400">
              <span>DocChat Vector Pipeline v1.0.0</span>
              <span>Confidential & Secure</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* AI Insights Panel (Right) */}
      <div className="w-80 bg-app-card border-l border-app-line-soft flex flex-col shrink-0">
        <div className="p-4 border-b border-app-line-soft font-semibold text-text-main flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          AI Insights
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Auto-Summary
            </h3>
            <div className="bg-app-bg border border-app-line-soft p-4 rounded-xl text-sm text-text-main/90 leading-relaxed">
              {docSummary}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Key Metadata
            </h3>
            <div className="flex flex-wrap gap-2">
              {keyEntities.map((entity) => (
                <span
                  key={entity}
                  className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                >
                  {entity}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate('/chat')}
              className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <MessageSquare className="w-4 h-4" />
              Chat about this document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
