import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8FA5A0] to-[#AFC1B3] flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#AFC1B3] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Authenticating...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;