import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[#FF9E1B] mx-auto mb-4" />
        <p className="text-[#888B8D]">Loading product catalog...</p>
      </div>
    </div>
  );
};

export default LoadingState;
