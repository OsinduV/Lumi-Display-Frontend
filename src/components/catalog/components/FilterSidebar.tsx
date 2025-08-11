import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, X, List, Grid3X3, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Category, Brand, FilterState } from './types';

interface FilterSidebarProps {
  filters: FilterState;
  categories: Category[];
  brands: Brand[];
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  categories,
  brands,
  isOpen,
  onClose,
  onFilterChange,
  onClearFilters
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  const hasActiveFilters = filters.searchTerm || filters.selectedCategory || 
                          filters.selectedBrand || filters.selectedTag;

  const clearTagFilter = () => {
    onFilterChange('selectedTag', '');
    onFilterChange('selectedTagName', '');
    window.history.pushState({}, '', '/catalog');
  };

  // Organize categories into parent-child structure
  const categoryTree = useMemo(() => {
    const parentCategories = categories.filter(cat => !cat.parent);
    return parentCategories.map(parent => ({
      ...parent,
      subcategories: categories.filter(cat => cat.parent?._id === parent._id)
    }));
  }, [categories]);

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategorySelect = (categoryId: string) => {
    onFilterChange('selectedCategory', categoryId === filters.selectedCategory ? '' : categoryId);
  };

  const CategoryItem: React.FC<{ 
    category: any; 
    isSubcategory?: boolean; 
    hasSubcategories?: boolean;
  }> = ({ category, isSubcategory = false, hasSubcategories = false }) => {
    const isSelected = filters.selectedCategory === category._id;
    const isExpanded = expandedCategories.has(category._id);

    return (
      <div className={`${isSubcategory ? 'ml-4' : ''}`}>
        <div
          className={`
            flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors duration-200
            ${isSelected 
              ? 'bg-[#0067A0] text-white' 
              : 'hover:bg-gray-100 text-[#53565A]'
            }
            ${isSubcategory ? 'text-sm' : 'font-medium'}
          `}
          onClick={() => handleCategorySelect(category._id)}
        >
          <div className="flex items-center space-x-3 flex-1">
            {/* Consistent dot indicator for all categories */}
            <div className={`w-1.5 h-1.5 rounded-full ${
              isSelected ? 'bg-white' : 'bg-gray-400'
            }`} />
            <span className="truncate">{category.name}</span>
          </div>
          
          {/* Show dropdown icon only for categories with subcategories */}
          {hasSubcategories && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCategoryExpansion(category._id);
              }}
              className={`p-1 rounded hover:bg-black/10 transition-all duration-200 ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`}
            >
              <ChevronDown className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-full bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#53565A] flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Filters & Search
            </h3>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-[#53565A] mb-2">
              Search Products
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D]" />
              <Input
                value={filters.searchTerm}
                onChange={(e) => onFilterChange('searchTerm', e.target.value)}
                placeholder="Search by name, model..."
                className="pl-10 focus:border-[#FF9E1B] focus:ring-[#FF9E1B]/20"
              />
            </div>
          </div>

          {/* Category Navigation */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-[#53565A] flex items-center">
                <Folder className="w-4 h-4 mr-1 text-[#0067A0]" />
                Categories
              </label>
              {filters.selectedCategory && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFilterChange('selectedCategory', '')}
                  className="text-[#FF9E1B] hover:text-[#FF9E1B]/80 h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            <div className="space-y-1 max-h-80 overflow-y-auto border border-gray-200 rounded-md p-3 bg-white">
              {/* All Categories Option */}
              <div
                className={`
                  flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors duration-200
                  ${!filters.selectedCategory 
                    ? 'bg-[#0067A0] text-white' 
                    : 'hover:bg-gray-100 text-[#53565A]'
                  }
                  font-medium border-b border-gray-100 mb-2 pb-2
                `}
                onClick={() => handleCategorySelect('')}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    !filters.selectedCategory ? 'bg-white' : 'bg-gray-400'
                  }`} />
                  <span>All Categories</span>
                </div>
              </div>

              {/* Category Tree */}
              {categoryTree.map(parentCategory => (
                <div key={parentCategory._id} className="space-y-1">
                  <CategoryItem
                    category={parentCategory}
                    hasSubcategories={parentCategory.subcategories && parentCategory.subcategories.length > 0}
                  />
                  
                  {/* Subcategories */}
                  {parentCategory.subcategories && 
                   parentCategory.subcategories.length > 0 && 
                   expandedCategories.has(parentCategory._id) && (
                    <div className="space-y-1 ml-4 border-l border-gray-200 pl-3">
                      {parentCategory.subcategories.map(subcategory => (
                        <CategoryItem
                          key={subcategory._id}
                          category={subcategory}
                          isSubcategory={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-[#53565A] mb-2">
              Brand
            </label>
            <div className="relative">
              <select
                value={filters.selectedBrand}
                onChange={(e) => onFilterChange('selectedBrand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#FF9E1B] focus:ring-2 focus:ring-[#FF9E1B]/20 appearance-none pr-8"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand._id} value={brand._id}>{brand.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D] pointer-events-none" />
            </div>
          </div>

          {/* Active Tag Filter Display */}
          {filters.selectedTag && filters.selectedTagName && (
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">
                Active Tag Filter
              </label>
              <div className="flex items-center justify-between p-3 bg-[#FF9E1B]/10 border border-[#FF9E1B]/20 rounded-md">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-[#FF9E1B] text-white">
                    {filters.selectedTagName}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearTagFilter}
                  className="text-[#FF9E1B] hover:text-[#FF9E1B]/80 h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* View Mode */}
          <div>
            <label className="block text-sm font-medium text-[#53565A] mb-2">
              View Mode
            </label>
            <div className="flex space-x-2">
              <Button
                variant={filters.viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange('viewMode', 'table')}
                className={`flex-1 ${filters.viewMode === 'table' ? 'bg-[#FF9E1B] hover:bg-[#FF9E1B]/90' : ''}`}
              >
                <List className="w-4 h-4 mr-1" />
                Table
              </Button>
              <Button
                variant={filters.viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange('viewMode', 'grid')}
                className={`flex-1 ${filters.viewMode === 'grid' ? 'bg-[#FF9E1B] hover:bg-[#FF9E1B]/90' : ''}`}
              >
                <Grid3X3 className="w-4 h-4 mr-1" />
                Grid
              </Button>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="w-full"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden w-80 bg-white border-r border-gray-200 min-h-screen p-6 shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out
      `}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#53565A] flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Filters & Search
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Search */}
          <div>
            <label className="block text-sm font-medium text-[#53565A] mb-2">
              Search Products
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D]" />
              <Input
                value={filters.searchTerm}
                onChange={(e) => onFilterChange('searchTerm', e.target.value)}
                placeholder="Search by name, model..."
                className="pl-10 focus:border-[#FF9E1B] focus:ring-[#FF9E1B]/20"
              />
            </div>
          </div>

          {/* Mobile Category Navigation */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-[#53565A] flex items-center">
                <Folder className="w-4 h-4 mr-1 text-[#0067A0]" />
                Categories
              </label>
              {filters.selectedCategory && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFilterChange('selectedCategory', '')}
                  className="text-[#FF9E1B] hover:text-[#FF9E1B]/80 h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            <div className="space-y-1 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-3 bg-white">
              {/* All Categories Option */}
              <div
                className={`
                  flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors duration-200
                  ${!filters.selectedCategory 
                    ? 'bg-[#0067A0] text-white' 
                    : 'hover:bg-gray-100 text-[#53565A]'
                  }
                  font-medium border-b border-gray-100 mb-2 pb-2
                `}
                onClick={() => handleCategorySelect('')}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    !filters.selectedCategory ? 'bg-white' : 'bg-gray-400'
                  }`} />
                  <span>All Categories</span>
                </div>
              </div>

              {/* Category Tree */}
              {categoryTree.map(parentCategory => (
                <div key={parentCategory._id} className="space-y-1">
                  <CategoryItem
                    category={parentCategory}
                    hasSubcategories={parentCategory.subcategories && parentCategory.subcategories.length > 0}
                  />
                  
                  {/* Subcategories */}
                  {parentCategory.subcategories && 
                   parentCategory.subcategories.length > 0 && 
                   expandedCategories.has(parentCategory._id) && (
                    <div className="space-y-1 ml-4 border-l border-gray-200 pl-3">
                      {parentCategory.subcategories.map(subcategory => (
                        <CategoryItem
                          key={subcategory._id}
                          category={subcategory}
                          isSubcategory={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-[#53565A] mb-2">
              Brand
            </label>
            <div className="relative">
              <select
                value={filters.selectedBrand}
                onChange={(e) => onFilterChange('selectedBrand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#FF9E1B] focus:ring-2 focus:ring-[#FF9E1B]/20 appearance-none pr-8"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand._id} value={brand._id}>{brand.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D] pointer-events-none" />
            </div>
          </div>

          {/* Mobile Active Tag Filter Display */}
          {filters.selectedTag && filters.selectedTagName && (
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">
                Active Tag Filter
              </label>
              <div className="flex items-center justify-between p-3 bg-[#FF9E1B]/10 border border-[#FF9E1B]/20 rounded-md">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-[#FF9E1B] text-white">
                    {filters.selectedTagName}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearTagFilter}
                  className="text-[#FF9E1B] hover:text-[#FF9E1B]/80 h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Mobile View Mode */}
          <div>
            <label className="block text-sm font-medium text-[#53565A] mb-2">
              View Mode
            </label>
            <div className="flex space-x-2">
              <Button
                variant={filters.viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange('viewMode', 'table')}
                className={`flex-1 ${filters.viewMode === 'table' ? 'bg-[#FF9E1B] hover:bg-[#FF9E1B]/90' : ''}`}
              >
                <List className="w-4 h-4 mr-1" />
                Table
              </Button>
              <Button
                variant={filters.viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange('viewMode', 'grid')}
                className={`flex-1 ${filters.viewMode === 'grid' ? 'bg-[#FF9E1B] hover:bg-[#FF9E1B]/90' : ''}`}
              >
                <Grid3X3 className="w-4 h-4 mr-1" />
                Grid
              </Button>
            </div>
          </div>

          {/* Mobile Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="w-full"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
