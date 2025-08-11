import React from 'react';
import { Package2 } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 lg:p-12 text-center">
      <Package2 className="w-12 h-12 lg:w-16 lg:h-16 text-[#888B8D] mx-auto mb-4" />
      <h3 className="text-base lg:text-lg font-semibold text-[#53565A] mb-2">No products found</h3>
      <p className="text-sm lg:text-base text-[#888B8D]">Try adjusting your search or filter criteria</p>
    </div>
  );
};

export default EmptyState;
