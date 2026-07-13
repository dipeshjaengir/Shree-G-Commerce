import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../redux/slices/authSlice.js';
import { toast } from 'react-hot-toast';

const ProtectedAdminRoute = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(fetchProfile()).unwrap();
      } catch (err) {
        // Ignored, anonymous user
      } finally {
        setAuthChecked(true);
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    } else {
      setAuthChecked(true);
    }
  }, [dispatch, isAuthenticated]);

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#F8F8F8]">
        <div className="w-8 h-8 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
        <span className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase font-light">Verifying Access Credentials...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error('Access Denied: Please log in to access the Admin Panel.');
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = ['super_admin', 'admin', 'manager', 'staff'];
  if (!user || !allowedRoles.includes(user.role)) {
    toast.error('Access Forbidden: You do not have permissions to view this page.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
