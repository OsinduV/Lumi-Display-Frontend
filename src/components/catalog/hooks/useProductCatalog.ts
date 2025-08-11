import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI, brandAPI } from '@/api';
import { 
  mockProducts, 
  mockCategories, 
  mockBrands 
} from '../components/mockData';
import { flattenCategories, getCategoryFilterIds } from '../components/utils';
import type { 
  Product, 
  Category, 
  Brand, 
  FilterState,
  SortField,
  PaginationInfo
} from '../components/types';

export const useProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [flattenedCategories, setFlattenedCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null
  });
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategory: '',
    selectedBrand: '',
    selectedTag: '',
    selectedTagName: '',
    sortBy: 'name',
    sortOrder: 'asc',
    viewMode: 'table',
    page: 1,
    limit: 20
  });

  // Initialize data from URL params
  useEffect(() => {
    fetchInitialData();
    
    // Check for search parameter from URL
    const searchParam = searchParams.get('search');
    if (searchParam) {
      updateFilter('searchTerm', decodeURIComponent(searchParam));
    } else {
      updateFilter('searchTerm', '');
    }
    
    // Check for tag filter from URL
    const tagId = searchParams.get('tag');
    const tagName = searchParams.get('tagName');
    if (tagId && tagName) {
      updateFilter('selectedTag', tagId);
      updateFilter('selectedTagName', decodeURIComponent(tagName));
    } else {
      updateFilter('selectedTag', '');
      updateFilter('selectedTagName', '');
    }
  }, [searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    if (!loading) {
      fetchProducts();
    }
  }, [filters.searchTerm, filters.selectedCategory, filters.selectedBrand, filters.selectedTag, filters.page, filters.limit, filters.sortBy, filters.sortOrder, loading]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [categoriesRes, brandsRes] = await Promise.all([
        categoryAPI.getAll({ includeHierarchy: 'true' }),
        brandAPI.getAll()
      ]);
      
      setFlattenedCategories(flattenCategories(categoriesRes.data));
      setBrands(brandsRes.data);
      
      // Fetch first page of products
      await fetchProducts();
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load data from server. Using offline data.');
      
      // Fallback to mock data if API fails
      setProducts(mockProducts.slice(0, filters.limit));
      setFlattenedCategories(flattenCategories(mockCategories));
      setBrands(mockBrands);
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(mockProducts.length / filters.limit),
        totalProducts: mockProducts.length,
        limit: filters.limit,
        hasNextPage: mockProducts.length > filters.limit,
        hasPrevPage: false,
        nextPage: mockProducts.length > filters.limit ? 2 : null,
        prevPage: null
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = {
        search: filters.searchTerm || undefined,
        category: filters.selectedCategory || undefined,
        brand: filters.selectedBrand || undefined,
        tags: filters.selectedTag || undefined,
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };
      
      const response = await productAPI.getAllProducts(params);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to client-side filtering and pagination of mock data
      let filtered = mockProducts.filter(product => {
        const matchesSearch = !filters.searchTerm ||
          product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          product.modelCode?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          (product.brand?.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) || false);
        
        const categoryFilterIds = getCategoryFilterIds(filters.selectedCategory, mockCategories);
        const matchesCategory = !filters.selectedCategory || 
          (product.category?._id && categoryFilterIds.includes(product.category._id));
        
        const matchesBrand = !filters.selectedBrand || product.brand?._id === filters.selectedBrand;
        const matchesTag = !filters.selectedTag || product.tags.some(tag => tag._id === filters.selectedTag);
        
        return matchesSearch && matchesCategory && matchesBrand && matchesTag;
      });
      
      // Client-side pagination
      const startIndex = (filters.page - 1) * filters.limit;
      const endIndex = startIndex + filters.limit;
      const paginatedProducts = filtered.slice(startIndex, endIndex);
      
      setProducts(paginatedProducts);
      setPagination({
        currentPage: filters.page,
        totalPages: Math.ceil(filtered.length / filters.limit),
        totalProducts: filtered.length,
        limit: filters.limit,
        hasNextPage: endIndex < filtered.length,
        hasPrevPage: filters.page > 1,
        nextPage: endIndex < filtered.length ? filters.page + 1 : null,
        prevPage: filters.page > 1 ? filters.page - 1 : null
      });
    }
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Reset to page 1 when filters change (except for page changes)
      if (key !== 'page' && key !== 'limit') {
        newFilters.page = 1;
      }
      
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters(prev => ({
      ...prev,
      searchTerm: '',
      selectedCategory: '',
      selectedBrand: '',
      selectedTag: '',
      selectedTagName: '',
      page: 1
    }));
    window.history.pushState({}, '', '/catalog');
  };

  const handleSort = (field: SortField) => {
    if (filters.sortBy === field) {
      updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      updateFilter('sortBy', field);
      updateFilter('sortOrder', 'asc');
    }
  };

  const handlePageChange = (page: number) => {
    updateFilter('page', page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (limit: number) => {
    updateFilter('limit', limit);
    updateFilter('page', 1); // Reset to first page when changing limit
  };

  return {
    // Data
    products,
    flattenedCategories,
    brands,
    pagination,
    
    // State
    loading,
    error,
    filters,
    
    // Actions
    updateFilter,
    clearAllFilters,
    handleSort,
    handlePageChange,
    handleLimitChange,
    fetchInitialData
  };
};
