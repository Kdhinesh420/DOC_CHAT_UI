import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { checkAuth } from '../store/slices/authSlice';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (token && !user) {
        await dispatch(checkAuth());
      }
      setLoading(false);
    };
    verify();
  }, [token, user, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
