import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { generateProductCatalogPDF } from "@/utils/pdfGenerator";
import { useProductCatalog } from "./hooks/useProductCatalog";
import AddToCartModal from "@/components/cart/AddToCartModal";

// Components
import CatalogHeader from "./components/CatalogHeader";
import FilterSidebar from "./components/FilterSidebar";
import FilterHeaders from "./components/FilterHeaders";
import ProductTable from "./components/ProductTable";
import ProductGrid from "./components/ProductGrid";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
import Pagination from "./components/Pagination";
import ProductDetailModal from "./ProductDetailModal";

// Types
import type { Product } from "./components/types";

const ProductCatalog: React.FC = () => {
  const { canViewPrices, isAuthenticated } = useAuth();
  
  // Use custom hook for catalog logic
  const {
    products,
    flattenedCategories,
    brands,
    pagination,
    loading,
    error,
    filters,
    updateFilter,
    clearAllFilters,
    handleSort,
    handlePageChange,
    handleLimitChange,
    fetchInitialData
  } = useProductCatalog();

  // Local UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [productToAddToCart, setProductToAddToCart] = useState<Product | null>(null);

  // Products are already sorted and paginated from the backend

  // Modal handlers
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Add to cart handlers
  const handleAddToCart = (product: Product) => {
    setProductToAddToCart(product);
    setIsAddToCartModalOpen(true);
  };

  const handleCloseAddToCartModal = () => {
    setIsAddToCartModalOpen(false);
    setProductToAddToCart(null);
  };

  // PDF Generation
  const handleGeneratePDF = async () => {
    if (!isAuthenticated || isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const selectedBrandObj = filters.selectedBrand ? brands.find(b => b._id === filters.selectedBrand) : undefined;
      const selectedCategoryName = filters.selectedCategory ? 
        flattenedCategories.find(c => c._id === filters.selectedCategory)?.name?.replace('-- ', '') : undefined;
      
      await generateProductCatalogPDF({
        products: products,
        selectedBrand: selectedBrandObj,
        searchTerm: filters.searchTerm || undefined,
        selectedCategory: selectedCategoryName,
        selectedTag: filters.selectedTag || undefined,
        selectedTagName: filters.selectedTagName || undefined,
        showPrices: canViewPrices
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Clear individual filters
  const clearSearch = () => {
    updateFilter('searchTerm', '');
    window.history.pushState({}, '', '/catalog');
  };

  const clearBrandFilter = () => {
    updateFilter('selectedBrand', '');
  };

  const clearTagFilter = () => {
    updateFilter('selectedTag', '');
    updateFilter('selectedTagName', '');
    window.history.pushState({}, '', '/catalog');
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CatalogHeader
        productCount={pagination.totalProducts}
        isAuthenticated={isAuthenticated}
        isGeneratingPDF={isGeneratingPDF}
        onGeneratePDF={handleGeneratePDF}
        onRefreshData={fetchInitialData}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        error={error || undefined}
      />

      {/* Main Container with proper alignment */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 py-6">
          {/* Filter Sidebar */}
          <div className="flex-shrink-0 w-80 hidden lg:block">
            <div className="sticky top-6">
              <FilterSidebar
                filters={filters}
                categories={flattenedCategories}
                brands={brands}
                isOpen={false} // Always visible on desktop
                onClose={() => {}} // Not needed for desktop
                onFilterChange={updateFilter}
                onClearFilters={clearAllFilters}
              />
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          <div className="lg:hidden">
            <FilterSidebar
              filters={filters}
              categories={flattenedCategories}
              brands={brands}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              onFilterChange={updateFilter}
              onClearFilters={clearAllFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Filter Headers */}
            <FilterHeaders
              searchTerm={filters.searchTerm}
              selectedBrand={filters.selectedBrand}
              selectedTag={filters.selectedTag}
              selectedTagName={filters.selectedTagName}
              brands={brands}
              productCount={pagination.totalProducts}
              onClearSearch={clearSearch}
              onClearBrand={clearBrandFilter}
              onClearTag={clearTagFilter}
            />

            {/* Products Display */}
            {products.length > 0 ? (
              <>
                {filters.viewMode === 'table' ? (
                  <ProductTable
                    products={products}
                    brands={brands}
                    canViewPrices={canViewPrices}
                    selectedBrand={filters.selectedBrand}
                    sortBy={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    onSort={handleSort}
                    onViewProduct={handleViewProduct}
                    onAddToCart={handleAddToCart}
                  />
                ) : (
                  <ProductGrid
                    products={products}
                    brands={brands}
                    canViewPrices={canViewPrices}
                    onViewProduct={handleViewProduct}
                    onAddToCart={handleAddToCart}
                  />
                )}
                
                {/* Pagination */}
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                />
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        brands={brands}
      />

      {/* Add to Cart Modal */}
      <AddToCartModal
        product={productToAddToCart}
        isOpen={isAddToCartModalOpen}
        onClose={handleCloseAddToCartModal}
      />
    </div>
  );
};

export default ProductCatalog;
