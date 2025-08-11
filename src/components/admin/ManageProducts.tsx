import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Filter,
  RefreshCw,
  ChevronDown,
  Package2,
  AlertCircle,
  Upload,
  Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { productAPI, categoryAPI, brandAPI, tagAPI } from "@/api";
import ProductForm from "@/components/admin/ProductForm";
import BulkCreateProducts from "@/components/admin/BulkCreateProducts";
import BulkUpdateProducts from "@/components/admin/BulkUpdateProducts";
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  modelCode?: string;
  brand?: {
    _id: string;
    name: string;
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
  sizes?: string[];
  colors?: string[];
  shapes?: string[];
  types?: string[];
}

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface Tag {
  _id: string;
  name: string;
}

const ManageProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  
  // View states
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'bulk-create' | 'bulk-update'>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchProducts();
    }
  }, [searchTerm, selectedCategory, selectedBrand, selectedTag, loading]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsRes, categoriesRes, brandsRes, tagsRes] = await Promise.all([
        productAPI.getAllProducts({ limit: 10000 }), // Get all products for admin
        categoryAPI.getAll(),
        brandAPI.getAll(),
        tagAPI.getAll()
      ]);
      
      // Handle both old and new API response formats for products
      if (productsRes.data?.products) {
        // New paginated format
        setProducts(productsRes.data.products);
      } else if (Array.isArray(productsRes.data)) {
        // Old format - direct array
        setProducts(productsRes.data);
      } else {
        setProducts([]);
      }
      
      setCategories(categoriesRes.data || []);
      setBrands(brandsRes.data || []);
      setTags(tagsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data from server.');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = {
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        brand: selectedBrand || undefined,
        tags: selectedTag || undefined,
        limit: 10000 // Large limit to get all products for admin interface
      };
      
      const response = await productAPI.getAllProducts(params);
      // Handle both old and new API response formats
      if (response.data?.products) {
        // New paginated format
        setProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        // Old format - direct array
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('edit');
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      await productAPI.deleteProduct(selectedProduct._id);
      toast.success('Product deleted successfully');
      setShowDeleteModal(false);
      setSelectedProduct(null);
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleCreateSuccess = () => {
    setCurrentView('list');
    fetchProducts(); // Refresh the list
  };

  const handleEditSuccess = () => {
    setCurrentView('list');
    setSelectedProduct(null);
    fetchProducts(); // Refresh the list
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedProduct(null);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#FF9E1B] mx-auto mb-4" />
          <p className="text-[#888B8D]">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Render different views based on currentView state */}
      {currentView === 'list' && (
        <>
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#53565A] flex items-center gap-2 sm:gap-3">
                  <Package2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#0067A0]" />
                  Manage Products
                </h1>
                <p className="text-sm sm:text-base text-[#888B8D] mt-1">Search, filter, edit, and manage your product catalog</p>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button 
                  onClick={() => setCurrentView('create')}
                  className="bg-[#FF9E1B] hover:bg-[#FF9E1B]/90 flex-1 sm:flex-none"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
                <Button 
                  onClick={() => setCurrentView('bulk-create')}
                  variant="outline"
                  className="border-[#FF9E1B] text-[#FF9E1B] hover:bg-[#FF9E1B]/10 flex-1 sm:flex-none"
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Create
                </Button>
                <Button 
                  onClick={() => setCurrentView('bulk-update')}
                  variant="outline"
                  className="border-[#0067A0] text-[#0067A0] hover:bg-[#0067A0]/10 flex-1 sm:flex-none"
                  size="sm"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Bulk Update
                </Button>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchInitialData}
                  className="ml-auto text-red-600 hover:text-red-700 self-end sm:self-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Filters */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-[#008C95]" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Search */}
                <div className="relative sm:col-span-2 lg:col-span-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D]" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="pl-10 focus:border-[#FF9E1B] focus:ring-[#FF9E1B]/20"
                  />
                </div>

                {/* Category Filter */}
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

                {/* Brand Filter */}
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

                {/* Tag Filter */}
                <div className="relative">
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#FF9E1B] focus:ring-2 focus:ring-[#FF9E1B]/20 appearance-none pr-8"
                  >
                    <option value="">All Tags</option>
                    {tags.map(tag => (
                      <option key={tag._id} value={tag._id}>{tag.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D] pointer-events-none" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <CardTitle className="text-lg sm:text-xl">Products ({products.length})</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchProducts}
                  className="text-[#888B8D] hover:text-[#53565A] self-end sm:self-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-4">
                {products.map((product) => (
                  <div key={product._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start space-x-3">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {product.images && product.images.length > 0 && product.images[0] !== '/placeholder-product.jpg' ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNSAxNUgzM1YzM0gxNVYxNVoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0ibTE4IDI0IDMgMyA5LTkiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHN2Zz4K';
                            }}
                          />
                        ) : (
                          <Package2 className="w-8 h-8 text-[#888B8D]" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-[#53565A] truncate">{product.name}</h3>
                            {product.modelCode && (
                              <p className="text-xs text-[#888B8D] mt-1">Model: {product.modelCode}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="text-[#0067A0] hover:text-[#0067A0]/80 hover:bg-[#0067A0]/10 p-1"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Brand and Category */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {product.brand ? (
                            <Badge 
                              variant="outline" 
                              className={`text-xs
                                ${product.brand.name === 'LUMIZO' ? 'border-[#FF9E1B] text-[#FF9E1B]' : ''}
                                ${product.brand.name === 'Philips' ? 'border-[#0067A0] text-[#0067A0]' : ''}
                                ${product.brand.name === 'OSRAM' ? 'border-[#008C95] text-[#008C95]' : ''}
                                ${product.brand.name === 'LEDVANCE' ? 'border-[#888B8D] text-[#888B8D]' : ''}
                              `}
                            >
                              {product.brand.name}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-gray-300 text-gray-500 text-xs">
                              No Brand
                            </Badge>
                          )}
                          <span className="text-xs text-[#888B8D]">
                            {product.category?.name || 'No Category'}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-[#53565A]">
                              Rs. {getDisplayPrice(product).toLocaleString()}
                            </span>
                            {product.isSpecialPriceActive && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                SPECIAL
                              </Badge>
                            )}
                          </div>
                          {product.isSpecialPriceActive && getOriginalPrice(product) && (
                            <div className="text-xs text-[#888B8D] line-through">
                              Rs. {getOriginalPrice(product)?.toLocaleString()}
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {product.tags.slice(0, 3).map(tag => (
                              <Badge key={tag._id} variant="secondary" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                            {product.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{product.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-20">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.images && product.images.length > 0 && product.images[0] !== '/placeholder-product.jpg' ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNSAxNUgzM1YzM0gxNVYxNVoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0ibTE4IDI0IDMgMyA5LTkiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHN2Zz4K';
                                }}
                              />
                            ) : (
                              <Package2 className="w-6 h-6 text-[#888B8D]" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-[#53565A]">{product.name}</div>
                            {product.modelCode && (
                              <div className="text-sm text-[#888B8D]">Model: {product.modelCode}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.brand ? (
                            <Badge 
                              variant="outline" 
                              className={`
                                ${product.brand.name === 'LUMIZO' ? 'border-[#FF9E1B] text-[#FF9E1B]' : ''}
                                ${product.brand.name === 'Philips' ? 'border-[#0067A0] text-[#0067A0]' : ''}
                                ${product.brand.name === 'OSRAM' ? 'border-[#008C95] text-[#008C95]' : ''}
                                ${product.brand.name === 'LEDVANCE' ? 'border-[#888B8D] text-[#888B8D]' : ''}
                              `}
                            >
                              {product.brand.name}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-gray-300 text-gray-500">
                              No Brand
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-[#53565A]">
                            {product.category?.name || 'No Category'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-[#53565A]">
                                Rs. {getDisplayPrice(product).toLocaleString()}
                              </span>
                              {product.isSpecialPriceActive && (
                                <Badge className="bg-red-100 text-red-800 text-xs">
                                  SPECIAL
                                </Badge>
                              )}
                            </div>
                            {product.isSpecialPriceActive && getOriginalPrice(product) && (
                              <div className="text-sm text-[#888B8D] line-through">
                                Rs. {getOriginalPrice(product)?.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="text-[#0067A0] hover:text-[#0067A0]/80 hover:bg-[#0067A0]/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Empty State */}
              {products.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <Package2 className="w-12 h-12 sm:w-16 sm:h-16 text-[#888B8D] mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-[#53565A] mb-2">No products found</h3>
                  <p className="text-sm sm:text-base text-[#888B8D] mb-4">Try adjusting your search or filter criteria</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button 
                      onClick={() => setCurrentView('create')}
                      className="bg-[#FF9E1B] hover:bg-[#FF9E1B]/90"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Product
                    </Button>
                    <Button 
                      onClick={() => setCurrentView('bulk-create')}
                      variant="outline"
                      className="border-[#FF9E1B] text-[#FF9E1B] hover:bg-[#FF9E1B]/10"
                      size="sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Bulk Create
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Create Product View */}
      {currentView === 'create' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4 sm:pb-6">
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <Button
                variant="ghost"
                onClick={handleBackToList}
                className="text-[#53565A] hover:text-[#53565A]/80 p-2 sm:p-3"
                size="sm"
              >
                ← Back to Products
              </Button>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF9E1B]/10 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF9E1B]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#53565A]">Create New Product</h1>
                <p className="text-sm sm:text-base text-[#888B8D] mt-1">Add a new product to your lighting catalog</p>
              </div>
            </div>
          </div>
          <ProductForm onSuccess={handleCreateSuccess} />
        </div>
      )}

      {/* Edit Product View */}
      {currentView === 'edit' && selectedProduct && (
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4 sm:pb-6">
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <Button
                variant="ghost"
                onClick={handleBackToList}
                className="text-[#53565A] hover:text-[#53565A]/80 p-2 sm:p-3"
                size="sm"
              >
                ← Back to Products
              </Button>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0067A0]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-[#0067A0]" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#53565A]">Edit Product</h1>
                <p className="text-sm sm:text-base text-[#888B8D] mt-1 truncate">Update details for "{selectedProduct.name}"</p>
              </div>
            </div>
          </div>
          <ProductForm 
            editMode={true}
            productData={selectedProduct}
            onSuccess={handleEditSuccess}
          />
        </div>
      )}

      {/* Bulk Create Products View */}
      {currentView === 'bulk-create' && (
        <BulkCreateProducts 
          onBack={handleBackToList}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Bulk Update Products View */}
      {currentView === 'bulk-update' && (
        <BulkUpdateProducts 
          onBack={handleBackToList}
          onSuccess={handleCreateSuccess}
          allProducts={products}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProducts;
