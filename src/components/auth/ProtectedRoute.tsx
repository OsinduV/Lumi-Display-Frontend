import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/components/auth/Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

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
    return <Login onLogin={() => {}} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
