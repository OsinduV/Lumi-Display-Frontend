import React from 'react';
import { Package2, Download, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CatalogHeaderProps {
  productCount: number;
  isAuthenticated: boolean;
  isGeneratingPDF: boolean;
  onGeneratePDF: () => void;
  onRefreshData: () => void;
  onToggleSidebar: () => void;
  error?: string;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  productCount,
  isAuthenticated,
  isGeneratingPDF,
  onGeneratePDF,
  onRefreshData,
  onToggleSidebar,
  error
}) => {
  return (
    <>
      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <RefreshCw className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRefreshData}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-[#FF9E1B] to-[#0067A0] rounded-lg">
                <Package2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#53565A]">Product Catalog</h1>
                <p className="text-[#888B8D]">Lighting solutions for every space</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* PDF Generation Button (only for authenticated users) */}
              {isAuthenticated && productCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onGeneratePDF}
                  disabled={isGeneratingPDF}
                  className="text-[#0067A0] border-[#0067A0] hover:bg-[#0067A0] hover:text-white"
                >
                  {isGeneratingPDF ? (
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-1" />
                  )}
                  {isGeneratingPDF ? 'Generating...' : 'Export PDF'}
                </Button>
              )}
              
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleSidebar}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </Button>
              
              <Badge variant="outline" className="text-[#53565A]">
                {productCount} Products
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefreshData}
                className="text-[#888B8D] hover:text-[#53565A]"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogHeader;
