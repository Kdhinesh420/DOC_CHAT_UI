import { motion } from 'framer-motion';
import { FileText, MessageSquare, Zap, Clock, Upload, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadDocuments } from '../store/slices/documentSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: documents } = useSelector((state) => state.documents);

  useEffect(() => {
    dispatch(loadDocuments());
  }, [dispatch]);

  const stats = [
    { label: 'Total Documents', value: documents.length || '0', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    { label: 'AI Interactions', value: '—', icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
    { label: 'Time Saved', value: '—', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    { label: 'Tokens Used', value: '—', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  ];

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-text-main mb-1">
          Good morning, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{firstName} 👋</span>
        </h1>
        <p className="text-text-muted">Here's an overview of your AI document workspace.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-app-card border ${stat.border} rounded-2xl p-6 relative overflow-hidden group`}
          >
            <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <stat.icon className={`w-24 h-24 ${stat.color}`} />
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color} border ${stat.border}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-text-main mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-text-muted">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Upload CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-app-card border border-app-line-soft rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-2xl shadow-primary/20 z-10">
            <Upload className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-text-main mb-3 z-10">Start Chatting with Documents</h2>
          <p className="text-text-muted mb-8 max-w-md z-10 leading-relaxed">
            Upload PDFs, DOCX, or images. Our RAG pipeline will index them using OpenAI embeddings so you can ask questions instantly.
          </p>
          <div className="flex gap-3 z-10">
            <Link
              to="/upload"
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </Link>
            <Link
              to="/chat"
              className="flex items-center gap-2 border border-app-line text-text-main px-6 py-3 rounded-xl font-semibold hover:bg-app-hover transition-colors"
            >
              Start Chatting
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Recent Documents */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-app-card border border-app-line-soft rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-text-main">Recent Documents</h3>
            <Link to="/upload" className="text-xs text-primary hover:underline">View All</Link>
          </div>

          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="w-12 h-12 text-text-muted mb-3 opacity-30" />
              <p className="text-sm text-text-muted">No documents uploaded yet.</p>
              <Link to="/upload" className="mt-2 text-sm text-primary hover:underline">Upload your first document →</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.slice(0, 6).map((doc, i) => (
                <Link key={i} to={`/documents/${doc._id}`} className="flex items-center p-3 rounded-xl hover:bg-app-hover transition-colors cursor-pointer border border-transparent hover:border-app-line-soft">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3 shrink-0">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-main truncate">{doc.fileName || doc.name}</div>
                    <div className="text-xs text-text-muted capitalize">{doc.fileType} • {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '—'}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
