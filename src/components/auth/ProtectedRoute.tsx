import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'salesperson';
  allowedRoles?: ('admin' | 'salesperson')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  allowedRoles 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#FF9E1B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#888B8D]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/catalog" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role as any)) {
    return <Navigate to="/catalog" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
