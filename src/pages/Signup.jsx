import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register({ name, email, password }));
    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Create Account
        </h1>
        <p className="text-text-muted">Join DocChat AI today — it's free</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 mb-5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); dispatch(clearError()); }}
              required
              className="block w-full pl-10 pr-3 py-2.5 border border-app-line rounded-xl bg-app-bg/50 text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); dispatch(clearError()); }}
              required
              className="block w-full pl-10 pr-3 py-2.5 border border-app-line rounded-xl bg-app-bg/50 text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); dispatch(clearError()); }}
              required
              minLength={8}
              className="block w-full pl-10 pr-3 py-2.5 border border-app-line rounded-xl bg-app-bg/50 text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="Min 8 characters"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-3 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-primary/25 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-5 h-5" /></>}
        </motion.button>
      </form>

      <p className="mt-8 text-center text-sm text-text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
