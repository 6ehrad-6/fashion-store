import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B51F4]/10 to-[#2ECC71]/10">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#0B51F4]/30 border-t-[#0B51F4] rounded-full animate-spin" />
          <p className="text-white/60 text-sm">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;