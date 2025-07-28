import React, { useState, useEffect } from "react";
import { 
  Search, 
  Grid3X3, 
  List, 
  Package2, 
  Eye, 
  ChevronDown,
  SortAsc,
  SortDesc,
  RefreshCw,
  Filter,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { productAPI, categoryAPI, brandAPI } from "@/api";
import { useSearchParams } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  modelCode?: string;
  brand?: {
    _id: string;
    name: string;
    image?: string;
  };
  category?: {
    _id: string;
    name: string;
  };
  price?: number;
  mrp?: number;
  specialPrice?: number;
  isSpecialPriceActive: boolean;
  images: string[];
  tags: Array<{
    _id: string;
    name: string;
  }>;
}

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
  image?: string;
}

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'LED Panel Light 600x600',
    modelCode: 'LP-600-40W',
    brand: { _id: 'b1', name: 'LUMIZO' },
    category: { _id: 'c1', name: 'LED Lighting' },
    price: 4500,
    mrp: 5000,
    specialPrice: 4200,
    isSpecialPriceActive: true,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't1', name: 'Energy Efficient' },
      { _id: 't2', name: 'Dimmable' }
    ]
  },
  {
    _id: '2',
    name: 'Smart LED Bulb 9W',
    modelCode: 'SLB-9W-RGB',
    brand: { _id: 'b2', name: 'Philips', image: '/brand-logos/philips.jpg' },
    category: { _id: 'c2', name: 'Smart Lighting' },
    price: 1800,
    mrp: 2200,
    specialPrice: 1600,
    isSpecialPriceActive: false,
    images: ['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't3', name: 'Smart' },
      { _id: 't1', name: 'Energy Efficient' }
    ]
  },
  {
    _id: '3',
    name: 'Track Light 30W COB',
    modelCode: 'TL-30W-COB',
    brand: { _id: 'b3', name: 'OSRAM', image: '/brand-logos/osram.png' },
    category: { _id: 'c3', name: 'Commercial Lighting' },
    price: 3200,
    mrp: 3800,
    specialPrice: 2900,
    isSpecialPriceActive: true,
    images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't4', name: 'Commercial' },
      { _id: 't5', name: 'High Output' }
    ]
  },
  {
    _id: '4',
    name: 'Pendant Light Modern',
    modelCode: 'PL-MOD-15W',
    brand: { _id: 'b1', name: 'LUMIZO' },
    category: { _id: 'c4', name: 'Residential Lighting' },
    price: 2800,
    mrp: 3200,
    specialPrice: 2500,
    isSpecialPriceActive: false,
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't6', name: 'Decorative' },
      { _id: 't7', name: 'Modern' }
    ]
  },
  {
    _id: '5',
    name: 'Outdoor Flood Light 50W',
    modelCode: 'FL-50W-IP65',
    brand: { _id: 'b4', name: 'LEDVANCE', image: '/brand-logos/ledvance.png' },
    category: { _id: 'c5', name: 'Outdoor Lighting' },
    price: 5200,
    mrp: 6000,
    specialPrice: 4800,
    isSpecialPriceActive: true,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't8', name: 'Outdoor' },
      { _id: 't9', name: 'Waterproof' }
    ]
  },
  {
    _id: '6',
    name: 'LED Strip Light 5M',
    modelCode: 'LS-5M-RGB',
    brand: { _id: 'b2', name: 'Philips' },
    category: { _id: 'c6', name: 'Decorative Lighting' },
    price: 2100,
    mrp: 2500,
    specialPrice: 1950,
    isSpecialPriceActive: true,
    images: ['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't10', name: 'RGB' },
      { _id: 't11', name: 'Flexible' }
    ]
  },
  {
    _id: '7',
    name: 'Ceiling Fan Light 48W',
    modelCode: 'CFL-48W-WW',
    brand: { _id: 'b1', name: 'LUMIZO' },
    category: { _id: 'c4', name: 'Residential Lighting' },
    price: 3800,
    mrp: 4200,
    specialPrice: 3500,
    isSpecialPriceActive: false,
    images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't12', name: 'Warm White' },
      { _id: 't13', name: 'Remote Control' }
    ]
  },
  {
    _id: '8',
    name: 'Industrial High Bay 100W',
    modelCode: 'IHB-100W-CW',
    brand: { _id: 'b3', name: 'OSRAM' },
    category: { _id: 'c3', name: 'Commercial Lighting' },
    price: 7200,
    mrp: 8000,
    specialPrice: 6800,
    isSpecialPriceActive: true,
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'],
    tags: [
      { _id: 't14', name: 'Industrial' },
      { _id: 't15', name: 'High Power' }
    ]
  }
];

const mockCategories: Category[] = [
  { _id: 'c1', name: 'LED Lighting' },
  { _id: 'c2', name: 'Smart Lighting' },
  { _id: 'c3', name: 'Commercial Lighting' },
  { _id: 'c4', name: 'Residential Lighting' },
  { _id: 'c5', name: 'Outdoor Lighting' },
  { _id: 'c6', name: 'Decorative Lighting' }
];

const mockBrands: Brand[] = [
  { _id: 'b1', name: 'LUMIZO', image: '/brand-logos/lumizo.png' },
  { _id: 'b2', name: 'Philips', image: '/brand-logos/philips.jpg' },
  { _id: 'b3', name: 'OSRAM', image: '/brand-logos/osram.png' },
  { _id: 'b4', name: 'LEDVANCE', image: '/brand-logos/ledvance.png' }
];

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedTagName, setSelectedTagName] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'brand' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchInitialData();
    
    // Check for search parameter from URL
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam));
    } else {
      setSearchTerm('');
    }
    
    // Check for tag filter from URL
    const tagId = searchParams.get('tag');
    const tagName = searchParams.get('tagName');
    if (tagId && tagName) {
      setSelectedTag(tagId);
      setSelectedTagName(decodeURIComponent(tagName));
    } else {
      // Clear tag filters if no URL parameters
      setSelectedTag('');
      setSelectedTagName('');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading) {
      fetchProducts();
    }
  }, [searchTerm, selectedCategory, selectedBrand, selectedTag, loading]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch data from backend API
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        productAPI.getAllProducts(),
        categoryAPI.getAll(),
        brandAPI.getAll()
      ]);
      
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load data from server. Using offline data.');
      
      // Fallback to mock data if API fails
      setProducts(mockProducts);
      setCategories(mockCategories);
      setBrands(mockBrands);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      // Use API call with filters
      const params = {
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        brand: selectedBrand || undefined,
        tags: selectedTag || undefined, // Changed from 'tag' to 'tags' to match backend API
      };
      
      const response = await productAPI.getAllProducts(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to client-side filtering of mock data
      let filtered = mockProducts.filter(product => {
        const matchesSearch = 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.modelCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.brand?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        
        const matchesCategory = !selectedCategory || product.category?._id === selectedCategory;
        const matchesBrand = !selectedBrand || product.brand?._id === selectedBrand;
        const matchesTag = !selectedTag || product.tags.some(tag => tag._id === selectedTag);
        
        return matchesSearch && matchesCategory && matchesBrand && matchesTag;
      });
      
      setProducts(filtered);
    }
  };

  const getDisplayPrice = (product: Product) => {
    if (product.isSpecialPriceActive && product.specialPrice) {
      return product.specialPrice;
    }
    return product.price || product.mrp || 0;
  };

  const getOriginalPrice = (product: Product) => {
    if (product.isSpecialPriceActive && product.specialPrice && product.price) {
      return product.price;
    }
    return product.mrp;
  };

  const getSelectedBrand = () => {
    return brands.find(brand => brand._id === selectedBrand);
  };

  const filteredAndSortedProducts = products
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = getDisplayPrice(a);
          bValue = getDisplayPrice(b);
          break;
        case 'brand':
          aValue = a.brand?.name || '';
          bValue = b.brand?.name || '';
          break;
        case 'category':
          aValue = a.category?.name || '';
          bValue = b.category?.name || '';
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

  const handleSort = (field: 'name' | 'price' | 'brand' | 'category') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: 'name' | 'price' | 'brand' | 'category' }) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? 
      <SortAsc className="w-4 h-4 ml-1" /> : 
      <SortDesc className="w-4 h-4 ml-1" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#FF9E1B] mx-auto mb-4" />
          <p className="text-[#888B8D]">Loading product catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                    onClick={fetchInitialData}
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
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </Button>
              
              <Badge variant="outline" className="text-[#53565A]">
                {filteredAndSortedProducts.length} Products
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchInitialData}
                className="text-[#888B8D] hover:text-[#53565A]"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex relative">
        {/* Sidebar - Filters & Search */}
        <div className={`
          w-80 bg-white border-r border-gray-200 min-h-screen p-6 shadow-xl
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:sticky lg:top-0 lg:shadow-none
          fixed left-0 top-0 z-50 lg:z-auto transition-transform duration-300 ease-in-out
        `}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#53565A] flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Filters & Search
              </h3>
              {/* Mobile Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">
                Search Products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D]" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, model..."
                  className="pl-10 focus:border-[#FF9E1B] focus:ring-[#FF9E1B]/20"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#FF9E1B] focus:ring-2 focus:ring-[#FF9E1B]/20 appearance-none pr-8"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D] pointer-events-none" />
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">
                Brand
              </label>
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
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
            {selectedTag && selectedTagName && (
              <div>
                <label className="block text-sm font-medium text-[#53565A] mb-2">
                  Active Tag Filter
                </label>
                <div className="flex items-center justify-between p-3 bg-[#FF9E1B]/10 border border-[#FF9E1B]/20 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-[#FF9E1B] text-white">
                      {selectedTagName}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTag('');
                      setSelectedTagName('');
                      // Update URL to remove tag filter
                      window.history.pushState({}, '', '/catalog');
                    }}
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
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className={`flex-1 ${viewMode === 'table' ? 'bg-[#FF9E1B] hover:bg-[#FF9E1B]/90' : ''}`}
                >
                  <List className="w-4 h-4 mr-1" />
                  Table
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 ${viewMode === 'grid' ? 'bg-[#FF9E1B] hover:bg-[#FF9E1B]/90' : ''}`}
                >
                  <Grid3X3 className="w-4 h-4 mr-1" />
                  Grid
                </Button>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedCategory || selectedBrand || selectedTag) && (
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedBrand('');
                    setSelectedTag('');
                    setSelectedTagName('');
                    // Update URL to remove all filters
                    window.history.pushState({}, '', '/catalog');
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className={`
          flex-1 lg:p-4 lg:ml-0 p-4 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'lg:translate-x-0 translate-x-80' : 'translate-x-0'}
        `}>
          <div className="space-y-6">

            {/* Brand Filter Header */}
            {selectedBrand && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="h-8 w-8 lg:h-10 lg:w-10 bg-gray-50 border border-gray-200 rounded flex items-center justify-center overflow-hidden">
                      {getSelectedBrand()?.image ? (
                        <img 
                          src={getSelectedBrand()?.image} 
                          alt={getSelectedBrand()?.name}
                          className="w-full h-full object-contain"
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
                        Showing {filteredAndSortedProducts.length} products from {getSelectedBrand()?.name}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBrand('')}
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
                        Showing {filteredAndSortedProducts.length} products tagged with "{selectedTagName}"
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTag('');
                      setSelectedTagName('');
                      window.history.pushState({}, '', '/catalog');
                    }}
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
                        Found {filteredAndSortedProducts.length} products matching your search
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      window.history.pushState({}, '', '/catalog');
                    }}
                    className="text-[#888B8D] hover:text-[#53565A] border-gray-300 self-start sm:self-auto"
                  >
                    Clear Search
                  </Button>
                </div>
              </div>
            )}

            {/* Product Table/Grid */}
            {viewMode === 'table' ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-16 lg:w-20 font-semibold text-[#53565A] text-xs lg:text-sm">
                          Image
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-100 transition-colors min-w-[200px]"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center font-semibold text-[#53565A] text-xs lg:text-sm">
                            Product Name
                            <SortIcon field="name" />
                          </div>
                        </TableHead>
                        {!selectedBrand && (
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-100 transition-colors min-w-[120px] hidden sm:table-cell"
                            onClick={() => handleSort('brand')}
                          >
                            <div className="flex items-center font-semibold text-[#53565A] text-xs lg:text-sm">
                              Brand
                              <SortIcon field="brand" />
                            </div>
                          </TableHead>
                        )}
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-100 transition-colors min-w-[120px] hidden md:table-cell"
                          onClick={() => handleSort('category')}
                        >
                          <div className="flex items-center font-semibold text-[#53565A] text-xs lg:text-sm">
                            Category
                            <SortIcon field="category" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-100 transition-colors min-w-[100px]"
                          onClick={() => handleSort('price')}
                        >
                          <div className="flex items-center font-semibold text-[#53565A] text-xs lg:text-sm">
                            Price (Rs.)
                            <SortIcon field="price" />
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-[#53565A] text-xs lg:text-sm w-20">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedProducts.map((product) => (
                        <TableRow 
                          key={product._id} 
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <TableCell className="p-2 lg:p-4">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {product.images && product.images.length > 0 && product.images[0] !== '/placeholder-product.jpg' ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                  onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0ibTI0IDMwIDQgNCAxMC0xMCIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                                  }}
                                />
                              ) : (
                                <Package2 className="w-6 h-6 lg:w-8 lg:h-8 text-[#888B8D]" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="p-2 lg:p-4">
                            <div className="space-y-1">
                              <div className="font-semibold text-[#53565A] text-sm lg:text-base line-clamp-2">
                                {product.name}
                              </div>
                              {product.modelCode && (
                                <div className="text-xs lg:text-sm text-[#888B8D]">Model: {product.modelCode}</div>
                              )}
                              {/* Show brand and category on mobile when columns are hidden */}
                              <div className="sm:hidden space-y-1">
                                {product.brand && (
                                  <div className="text-xs text-[#888B8D]">Brand: {product.brand.name}</div>
                                )}
                                <div className="text-xs text-[#888B8D]">
                                  Category: {product.category?.name || 'No Category'}
                                </div>
                              </div>
                              {product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {product.tags.slice(0, 2).map(tag => (
                                    <Badge key={tag._id} variant="secondary" className="text-xs">
                                      {tag.name}
                                    </Badge>
                                  ))}
                                  {product.tags.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{product.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          {!selectedBrand && (
                            <TableCell className="p-2 lg:p-4 hidden sm:table-cell">
                              {product.brand ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-50 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                                    {brands.find(b => b._id === product.brand?._id)?.image ? (
                                      <img 
                                        src={brands.find(b => b._id === product.brand?._id)?.image} 
                                        alt={product.brand.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.style.display = 'none';
                                          if (target.nextElementSibling) {
                                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                          }
                                        }}
                                      />
                                    ) : null}
                                    <div 
                                      className="w-full h-full flex items-center justify-center text-[#888B8D] font-bold text-xs"
                                      style={{ display: brands.find(b => b._id === product.brand?._id)?.image ? 'none' : 'flex' }}
                                    >
                                      {product.brand.name.charAt(0)}
                                    </div>
                                  </div>
                                  <span className="text-xs lg:text-sm text-[#53565A] font-medium">
                                    {product.brand.name}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                    <span className="text-xs text-gray-400">?</span>
                                  </div>
                                  <span className="text-xs lg:text-sm text-gray-400">No Brand</span>
                                </div>
                              )}
                            </TableCell>
                          )}
                          <TableCell className="p-2 lg:p-4 hidden md:table-cell">
                            <span className="text-xs lg:text-sm text-[#53565A] font-medium">
                              {product.category?.name || 'No Category'}
                            </span>
                          </TableCell>
                          <TableCell className="p-2 lg:p-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm lg:text-lg font-bold text-[#53565A]">
                                  Rs. {getDisplayPrice(product).toLocaleString()}
                                </span>
                                {product.isSpecialPriceActive && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">
                                    SPECIAL
                                  </Badge>
                                )}
                              </div>
                              {product.isSpecialPriceActive && getOriginalPrice(product) && (
                                <div className="text-xs lg:text-sm text-[#888B8D] line-through">
                                  Rs. {getOriginalPrice(product)?.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center p-2 lg:p-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#0067A0] hover:text-[#0067A0]/80 hover:bg-[#0067A0]/10 text-xs lg:text-sm"
                            >
                              <Eye className="w-3 h-3 lg:w-4 lg:h-4 lg:mr-1" />
                              <span className="hidden lg:inline">View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <Card key={product._id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 lg:p-6">
                      <div className="space-y-3 lg:space-y-4">
                        {/* Product Image */}
                        <div className="w-full h-36 lg:h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 && product.images[0] !== '/placeholder-product.jpg' ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA2MEgxMzJWMTMySDYwVjYwWiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJtNzIgOTAgMTIgMTIgMzAtMzAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHN2Zz4K';
                              }}
                            />
                          ) : (
                            <Package2 className="w-8 h-8 lg:w-12 lg:h-12 text-[#888B8D]" />
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div>
                          <h3 className="font-semibold text-[#53565A] mb-1 text-sm lg:text-base line-clamp-2">
                            {product.name}
                          </h3>
                          {product.modelCode && (
                            <p className="text-xs lg:text-sm text-[#888B8D]">Model: {product.modelCode}</p>
                          )}
                        </div>
                        
                        {/* Brand & Category */}
                        <div className="flex justify-between items-center">
                          {product.brand ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gray-50 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                                {brands.find(b => b._id === product.brand?._id)?.image ? (
                                  <img 
                                    src={brands.find(b => b._id === product.brand?._id)?.image} 
                                    alt={product.brand.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      if (target.nextElementSibling) {
                                        (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                      }
                                    }}
                                  />
                                ) : null}
                                <div 
                                  className="w-full h-full flex items-center justify-center text-[#888B8D] font-bold text-xs"
                                  style={{ display: brands.find(b => b._id === product.brand?._id)?.image ? 'none' : 'flex' }}
                                >
                                  {product.brand.name.charAt(0)}
                                </div>
                              </div>
                              <span className="text-xs lg:text-sm text-[#53565A] font-medium truncate">
                                {product.brand.name}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-400">?</span>
                              </div>
                              <span className="text-xs lg:text-sm text-gray-400">No Brand</span>
                            </div>
                          )}
                          <span className="text-xs lg:text-sm text-[#888B8D] truncate">
                            {product.category?.name || 'No Category'}
                          </span>
                        </div>
                        
                        {/* Price */}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg lg:text-xl font-bold text-[#53565A]">
                              Rs. {getDisplayPrice(product).toLocaleString()}
                            </span>
                            {product.isSpecialPriceActive && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                SPECIAL
                              </Badge>
                            )}
                          </div>
                          {product.isSpecialPriceActive && getOriginalPrice(product) && (
                            <div className="text-xs lg:text-sm text-[#888B8D] line-through">
                              Rs. {getOriginalPrice(product)?.toLocaleString()}
                            </div>
                          )}
                        </div>
                        
                        {/* Tags */}
                        {product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {product.tags.slice(0, 2).map(tag => (
                              <Badge key={tag._id} variant="secondary" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                            {product.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{product.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {/* Action Button */}
                        <Button
                          className="w-full bg-[#FF9E1B] hover:bg-[#FF9E1B]/90 text-sm lg:text-base"
                          size="sm"
                        >
                          <Eye className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredAndSortedProducts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 lg:p-12 text-center">
                <Package2 className="w-12 h-12 lg:w-16 lg:h-16 text-[#888B8D] mx-auto mb-4" />
                <h3 className="text-base lg:text-lg font-semibold text-[#53565A] mb-2">No products found</h3>
                <p className="text-sm lg:text-base text-[#888B8D]">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
