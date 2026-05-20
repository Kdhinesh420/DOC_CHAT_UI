import { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, FileText, Settings, Plus, LayoutDashboard,
  UploadCloud, ChevronRight, User, LogOut, Loader2, RotateCw,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { loadDocuments } from '../store/slices/documentSlice';
import { clearMessages } from '../store/slices/chatSlice';
import { cn } from '../utils/cn';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: MessageSquare, label: 'Chat', path: '/chat' },
  { icon: UploadCloud, label: 'Upload', path: '/upload' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { list: documents, loading } = useSelector((state) => state.documents);

  useEffect(() => {
    dispatch(loadDocuments());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNewChat = () => {
    dispatch(clearMessages());
    navigate('/chat');
  };

  return (
    <div className="w-64 bg-app-card border-r border-app-line-soft flex flex-col h-full flex-shrink-0 z-20">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-app-line-soft">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          DocChat AI
        </span>
      </div>

      <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-6">
        {/* New Chat */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewChat}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl p-3 flex items-center justify-center gap-2 font-medium transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </motion.button>

        {/* Navigation */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider px-3">Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-text-muted hover:bg-app-hover hover:text-text-main',
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </div>

        {/* Uploaded Documents */}
        <div className="flex-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">Your Documents</div>
            <button
              onClick={() => dispatch(loadDocuments())}
              disabled={loading}
              className="p-1 rounded text-text-muted hover:text-text-main hover:bg-app-hover transition-all disabled:opacity-50"
              title="Refresh document history"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
          ) : documents.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-xs text-text-muted">No documents yet.</p>
              <Link to="/upload" className="text-xs text-primary hover:underline">Upload one →</Link>
            </div>
          ) : (
            <div className="space-y-1">
              <AnimatePresence>
                {documents.slice(0, 8).map((doc, i) => (
                  <motion.div
                    key={doc._id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={`/documents/${doc._id}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-text-muted hover:bg-app-hover hover:text-text-main transition-colors group"
                    >
                      <FileText className="w-4 h-4 shrink-0 text-primary" />
                      <span className="truncate text-sm">{doc.fileName || doc.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
              {documents.length > 8 && (
                <Link to="/upload" className="block px-3 py-2 text-xs text-primary hover:underline">
                  +{documents.length - 8} more
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-app-line-soft">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-app-hover transition-colors">
          <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30 shrink-0">
            <User className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-text-main truncate">{user?.name || 'User'}</div>
            <div className="text-xs text-text-muted truncate">{user?.email || 'Pro Plan'}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
