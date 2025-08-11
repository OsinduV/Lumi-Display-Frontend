import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Check,
  X,
  Package,
  ShoppingCart,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { productAPI } from "@/api";
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  modelCode: string;
  description?: string;
  price?: number;
  category?: {
    _id: string;
    name: string;
  };
  brand?: {
    _id: string;
    name: string;
  };
  images?: string[];
}

interface Category {
  _id: string;
  name: string;
  level: number;
}

interface AddProductsToCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  onSuccess: () => void;
}

const AddProductsToCategory: React.FC<AddProductsToCategoryProps> = ({
  isOpen,
  onClose,
  category,
  onSuccess
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      setSelectedProducts(new Set());
      setSearchTerm('');
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all products by requesting a large limit to get all products
      // This ensures we get all products, not just the first page
      const response = await productAPI.getAllProducts({
        limit: 10000 // Large limit to get all products
      });
      
      // Handle both old and new API response formats
      let allProducts = [];
      if (response.data?.products) {
        // New paginated format
        allProducts = response.data.products;
      } else if (Array.isArray(response.data)) {
        // Old format - direct array
        allProducts = response.data;
      }
      
      // Filter out products that are already in this category
      const availableProducts = allProducts.filter((product: Product) => 
        !product.category || product.category._id !== category._id
      );
      
      setProducts(availableProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.modelCode && product.modelCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleProductSelect = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p._id)));
    }
  };

  const handleAddProducts = async () => {
    if (selectedProducts.size === 0) {
      toast.error('Please select at least one product');
      return;
    }

    try {
      setUpdating(true);
      
      // Prepare bulk update data
      const updates = Array.from(selectedProducts).map(productId => ({
        id: productId,
        category: category._id
      }));

      await productAPI.bulkUpdateProducts(updates);
      
      toast.success(`Successfully added ${selectedProducts.size} products to ${category.name}`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding products to category:', error);
      toast.error('Failed to add products to category');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#008C95]" />
            Add Products to {category.name}
          </DialogTitle>
          <DialogDescription>
            Select products to add to the "{category.name}" category. Products already in this category are not shown.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-hidden">
          {/* Search and Selection Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D]" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by name or model code..."
                className="pl-10 focus:border-[#008C95] focus:ring-[#008C95]/20"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleSelectAll}
              disabled={loading || filteredProducts.length === 0}
            >
              {selectedProducts.size === filteredProducts.length ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Deselect All
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Select All ({filteredProducts.length})
                </>
              )}
            </Button>
          </div>

          {/* Selected Count */}
          {selectedProducts.size > 0 && (
            <div className="bg-[#008C95]/10 border border-[#008C95]/20 rounded-lg p-3">
              <p className="text-sm text-[#008C95] font-medium">
                {selectedProducts.size} product{selectedProducts.size !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-sm text-red-800">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchProducts}
                  className="ml-auto text-red-600 hover:text-red-700"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Products Table */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Available Products ({filteredProducts.length})</span>
                {loading && <RefreshCw className="w-4 h-4 animate-spin text-[#008C95]" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-96">
                <Table>
                  <TableHeader className="sticky top-0 bg-white">
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={filteredProducts.length > 0 && selectedProducts.size === filteredProducts.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-[#008C95] focus:ring-[#008C95]"
                        />
                      </TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Model Code</TableHead>
                      <TableHead>Current Category</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <RefreshCw className="w-6 h-6 animate-spin text-[#008C95] mx-auto mb-2" />
                          <p className="text-[#888B8D]">Loading products...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Package className="w-12 h-12 text-[#888B8D] mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-[#53565A] mb-2">No products available</h3>
                          <p className="text-[#888B8D]">
                            {searchTerm ? 'No products match your search criteria' : 'All products are already in this category'}
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow 
                          key={product._id} 
                          className={`hover:bg-gray-50 cursor-pointer ${
                            selectedProducts.has(product._id) ? 'bg-[#008C95]/5' : ''
                          }`}
                          onClick={() => handleProductSelect(product._id)}
                        >
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedProducts.has(product._id)}
                              onChange={() => handleProductSelect(product._id)}
                              className="w-4 h-4 text-[#008C95] focus:ring-[#008C95]"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Package className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-[#53565A]">{product.name}</p>
                                {product.description && (
                                  <p className="text-sm text-[#888B8D] truncate max-w-[200px]">
                                    {product.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm text-[#53565A]">
                              {product.modelCode || '-'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-[#888B8D]">
                              {product.category?.name || 'Uncategorized'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-[#888B8D]">
                              {product.brand?.name || '-'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {product.price ? (
                              <span className="font-semibold text-[#53565A]">
                                ₹{product.price.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-[#888B8D]">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={updating}>
            Cancel
          </Button>
          <Button
            onClick={handleAddProducts}
            disabled={selectedProducts.size === 0 || updating}
            className="bg-[#008C95] hover:bg-[#008C95]/90"
          >
            {updating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Adding Products...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add {selectedProducts.size} Product{selectedProducts.size !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductsToCategory;
