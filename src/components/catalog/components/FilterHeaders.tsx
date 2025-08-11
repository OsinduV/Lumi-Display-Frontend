import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Brand } from './types';

interface FilterHeadersProps {
  searchTerm?: string;
  selectedBrand?: string;
  selectedTag?: string;
  selectedTagName?: string;
  brands: Brand[];
  productCount: number;
  onClearSearch: () => void;
  onClearBrand: () => void;
  onClearTag: () => void;
}

const FilterHeaders: React.FC<FilterHeadersProps> = ({
  searchTerm,
  selectedBrand,
  selectedTag,
  selectedTagName,
  brands,
  productCount,
  onClearSearch,
  onClearBrand,
  onClearTag
}) => {
  const getSelectedBrand = () => {
    return brands.find(brand => brand._id === selectedBrand);
  };

  return (
    <div className="space-y-6">
      {/* Brand Filter Header */}
      {selectedBrand && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="h-8 lg:h-10 bg-gray-50 border border-gray-200 rounded flex items-center justify-center overflow-hidden">
                {getSelectedBrand()?.image ? (
                  <img 
                    src={getSelectedBrand()?.image} 
                    alt={getSelectedBrand()?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#888B8D] font-bold text-sm lg:text-lg">
                    {getSelectedBrand()?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-[#53565A]">
                  {getSelectedBrand()?.name} Products
                </h3>
                <p className="text-sm text-[#888B8D]">
                  Showing {productCount} products from {getSelectedBrand()?.name}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearBrand}
              className="text-[#888B8D] hover:text-[#53565A] border-gray-300 self-start sm:self-auto"
            >
              Clear Filter
            </Button>
          </div>
        </div>
      )}

      {/* Tag Filter Header */}
      {selectedTag && selectedTagName && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="h-8 w-8 lg:h-10 lg:w-10 bg-gradient-to-r from-[#FF9E1B] to-[#0067A0] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs lg:text-sm">#</span>
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-[#53565A]">
                  "{selectedTagName}" Products
                </h3>
                <p className="text-sm text-[#888B8D]">
                  Showing {productCount} products tagged with "{selectedTagName}"
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearTag}
              className="text-[#888B8D] hover:text-[#53565A] border-gray-300 self-start sm:self-auto"
            >
              Clear Filter
            </Button>
          </div>
        </div>
      )}

      {/* Search Results Header */}
      {searchTerm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="h-8 w-8 lg:h-10 lg:w-10 bg-gradient-to-r from-[#0067A0] to-[#008C95] rounded-full flex items-center justify-center">
                <Search className="text-white w-4 h-4 lg:w-5 lg:h-5" />
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-[#53565A]">
                  Search Results for "{searchTerm}"
                </h3>
                <p className="text-sm text-[#888B8D]">
                  Found {productCount} products matching your search
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSearch}
              className="text-[#888B8D] hover:text-[#53565A] border-gray-300 self-start sm:self-auto"
            >
              Clear Search
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterHeaders;
