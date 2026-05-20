import UploadZone from '../components/UploadZone';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FileText, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Upload() {
  const { list: documents } = useSelector((state) => state.documents);

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-2">Upload Documents</h1>
        <p className="text-text-muted">
          Upload documents to your workspace. The AI will extract text, create embeddings via OpenAI, and store them in Qdrant for RAG-based Q&A.
        </p>
      </div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <UploadZone />
      </motion.div>

      {/* Existing Documents */}
      {documents.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-semibold text-text-main mb-4">Your Documents ({documents.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, i) => (
              <motion.div
                key={doc._id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center p-4 bg-app-card border border-app-line-soft rounded-2xl group hover:border-primary/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-4 shrink-0">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-text-main truncate">{doc.fileName || doc.name}</div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {doc.fileType} • {doc.vectorCount ? `${doc.vectorCount} chunks` : '—'} • {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '—'}
                  </div>
                </div>
                <Link
                  to={`/documents/${doc._id}`}
                  className="ml-3 px-3 py-1.5 text-xs font-medium text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors opacity-0 group-hover:opacity-100"
                >
                  View
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
