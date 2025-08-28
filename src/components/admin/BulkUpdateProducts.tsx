import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  Settings, 
  Check,
  AlertCircle,
  Package2,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { productAPI, categoryAPI, brandAPI, tagAPI } from '@/api';
import toast from 'react-hot-toast';

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

interface Product {
  _id: string;
  name: string;
  modelCode?: string;
  description?: string;
  features?: string[];
  brand?: {
    _id: string;
    name: string;
  };
  category?: {
    _id: string;
    name: string;
  };
  tags?: Array<{
    _id: string;
    name: string;
  }>;
  price?: number;
  mrp?: number;
  discountedPrice?: number;
  minimumPrice?: number;
  activePriceType?: 'price' | 'mrp' | 'discountedPrice' | 'minimumPrice';
  images?: string[];
  sizes?: string[];
  colors?: string[];
  shapes?: string[];
  types?: string[];
}

interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'array' | 'checkbox';
  required: boolean;
  options?: { value: string; label: string }[];
}

interface BulkUpdateProductsProps {
  onBack: () => void;
  onSuccess: () => void;
  allProducts: Product[];
}

const BulkUpdateProducts: React.FC<BulkUpdateProductsProps> = ({ onBack, onSuccess, allProducts }) => {
  const [currentStep, setCurrentStep] = useState<'select-products' | 'select-fields' | 'update-data'>('select-products');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const [availableFields, setAvailableFields] = useState<FieldConfig[]>([
    { key: 'name', label: 'Product Name', type: 'text', required: false },
    { key: 'modelCode', label: 'Model Code', type: 'text', required: false },
    { key: 'description', label: 'Description', type: 'text', required: false },
    { key: 'features', label: 'Features', type: 'array', required: false },
    { key: 'category', label: 'Category', type: 'select', required: false, options: [] },
    { key: 'brand', label: 'Brand', type: 'select', required: false, options: [] },
    { key: 'tags', label: 'Tags', type: 'multiselect', required: false, options: [] },
    { key: 'sizes', label: 'Sizes', type: 'array', required: false },
    { key: 'colors', label: 'Colors', type: 'array', required: false },
    { key: 'shapes', label: 'Shapes', type: 'array', required: false },
    { key: 'types', label: 'Types', type: 'array', required: false },
    { key: 'price', label: 'Price', type: 'number', required: false },
    { key: 'mrp', label: 'MRP', type: 'number', required: false },
    { key: 'discountedPrice', label: 'Discounted Price', type: 'number', required: false },
    { key: 'minimumPrice', label: 'Minimum Price', type: 'number', required: false },
    { key: 'activePriceType', label: 'Active Price Type', type: 'select', required: false, options: [
      { value: 'price', label: 'Normal Price' },
      { value: 'mrp', label: 'MRP' },
      { value: 'discountedPrice', label: 'Discounted Price' },
      { value: 'minimumPrice', label: 'Minimum Price' }
    ] },
  ]);

  useEffect(() => {
    fetchReferenceData();
    setFilteredProducts(allProducts);
  }, [allProducts]);

  useEffect(() => {
    // Filter products based on search term
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.modelCode && product.modelCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brand?.name && product.brand.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, allProducts]);

  const fetchReferenceData = async () => {
    try {
      const [categoriesRes, brandsRes, tagsRes] = await Promise.all([
        categoryAPI.getAll(),
        brandAPI.getAll(),
        tagAPI.getAll()
      ]);

      // Update field options
      const categoryOptions = (categoriesRes.data || []).map((cat: Category) => ({
        value: cat._id,
        label: cat.name
      }));
      const brandOptions = (brandsRes.data || []).map((brand: Brand) => ({
        value: brand._id,
        label: brand.name
      }));
      const tagOptions = (tagsRes.data || []).map((tag: Tag) => ({
        value: tag._id,
        label: tag.name
      }));

      // Update available fields with options
      setAvailableFields(prevFields => prevFields.map(field => {
        if (field.key === 'category') return { ...field, options: categoryOptions };
        if (field.key === 'brand') return { ...field, options: brandOptions };
        if (field.key === 'tags') return { ...field, options: tagOptions };
        return field;
      }));
    } catch (error) {
      console.error('Error fetching reference data:', error);
      toast.error('Failed to load reference data');
    }
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p._id));
    }
  };

  const handleNextFromProducts = () => {
    if (selectedProductIds.length === 0) {
      toast.error('Please select at least one product to update');
      return;
    }
    
    const products = allProducts.filter(p => selectedProductIds.includes(p._id));
    setSelectedProducts(products);
    setCurrentStep('select-fields');
  };

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldKey)
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleNextFromFields = () => {
    if (selectedFields.length === 0) {
      toast.error('Please select at least one field to update');
      return;
    }
    setCurrentStep('update-data');
  };

  const updateProductValue = (productId: string, fieldKey: string, value: any) => {
    setSelectedProducts(prev => prev.map(product => 
      product._id === productId ? { ...product, [fieldKey]: value } : product
    ));
  };

  const handleArrayInput = (productId: string, fieldKey: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    updateProductValue(productId, fieldKey, arrayValue);
  };

  const handleMultiSelectInput = (productId: string, fieldKey: string, value: string) => {
    const selectedIds = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    updateProductValue(productId, fieldKey, selectedIds);
  };

  const getFieldValue = (product: Product, fieldKey: string): any => {
    if (fieldKey === 'category') {
      return product.category?._id || '';
    }
    if (fieldKey === 'brand') {
      return product.brand?._id || '';
    }
    if (fieldKey === 'tags') {
      return product.tags?.map(tag => tag._id) || [];
    }
    return product[fieldKey as keyof Product] || '';
  };

  const getDisplayValue = (product: Product, fieldKey: string): string => {
    const value = getFieldValue(product, fieldKey);
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    return value?.toString() || '';
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Transform the data for API
      const updates = selectedProducts.map(product => {
        const updateData: any = { id: product._id };
        
        selectedFields.forEach(fieldKey => {
          const value = product[fieldKey as keyof Product];
          if (value !== undefined && value !== '') {
            updateData[fieldKey] = value;
          }
        });

        return updateData;
      });

      await productAPI.bulkUpdateProducts(updates);
      toast.success(`Successfully updated ${updates.length} products`);
      onSuccess();
    } catch (error: any) {
      console.error('Error updating products:', error);
      if (error.response?.data?.errors) {
        toast.error(`Bulk update completed with some failures: ${error.response.data.errors.length} failed`);
      } else {
        toast.error('Failed to update products');
      }
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const renderFieldInput = (product: Product, field: FieldConfig) => {
    const value = getFieldValue(product, field.key);

    switch (field.type) {
      case 'text':
        return (
          <Input
            value={getDisplayValue(product, field.key)}
            onChange={(e) => updateProductValue(product._id, field.key, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="min-w-32"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => updateProductValue(product._id, field.key, parseFloat(e.target.value) || '')}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="min-w-32"
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => updateProductValue(product._id, field.key, e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md focus:border-[#FF9E1B] focus:ring-2 focus:ring-[#FF9E1B]/20 min-w-32"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <Input
            value={getDisplayValue(product, field.key)}
            onChange={(e) => handleMultiSelectInput(product._id, field.key, e.target.value)}
            placeholder="Enter IDs separated by commas"
            className="min-w-32"
          />
        );

      case 'array':
        return (
          <Input
            value={getDisplayValue(product, field.key)}
            onChange={(e) => handleArrayInput(product._id, field.key, e.target.value)}
            placeholder="Enter values separated by commas"
            className="min-w-32"
          />
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => updateProductValue(product._id, field.key, e.target.checked)}
            className="w-4 h-4 text-[#FF9E1B] focus:ring-[#FF9E1B] border-gray-300 rounded"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-[#53565A] hover:text-[#53565A]/80 p-3"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#0067A0]/10 rounded-lg flex items-center justify-center">
            <Edit className="w-6 h-6 text-[#0067A0]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#53565A]">Bulk Update Products</h1>
            <p className="text-[#888B8D] mt-1">Select products, choose fields to update, and modify values</p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`flex items-center ${currentStep === 'select-products' ? 'text-[#0067A0]' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            currentStep === 'select-products' ? 'border-[#0067A0] bg-[#0067A0] text-white' : 'border-gray-300'
          }`}>
            1
          </div>
          <span className="ml-2 font-medium">Select Products</span>
        </div>
        <div className="w-16 h-px bg-gray-300"></div>
        <div className={`flex items-center ${currentStep === 'select-fields' ? 'text-[#0067A0]' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            currentStep === 'select-fields' ? 'border-[#0067A0] bg-[#0067A0] text-white' : 'border-gray-300'
          }`}>
            2
          </div>
          <span className="ml-2 font-medium">Select Fields</span>
        </div>
        <div className="w-16 h-px bg-gray-300"></div>
        <div className={`flex items-center ${currentStep === 'update-data' ? 'text-[#0067A0]' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            currentStep === 'update-data' ? 'border-[#0067A0] bg-[#0067A0] text-white' : 'border-gray-300'
          }`}>
            3
          </div>
          <span className="ml-2 font-medium">Update Data</span>
        </div>
      </div>

      {/* Step 1: Product Selection */}
      {currentStep === 'select-products' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Package2 className="w-5 h-5 text-[#0067A0]" />
                Select Products to Update
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleSelectAll}
                  size="sm"
                >
                  {selectedProductIds.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
                </Button>
                <span className="text-sm text-[#888B8D]">
                  {selectedProductIds.length} of {filteredProducts.length} selected
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D]" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 focus:border-[#0067A0] focus:ring-[#0067A0]/20"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-[#0067A0] focus:ring-[#0067A0] border-gray-300 rounded"
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product._id} className="hover:bg-gray-50">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(product._id)}
                          onChange={() => handleProductToggle(product._id)}
                          className="w-4 h-4 text-[#0067A0] focus:ring-[#0067A0] border-gray-300 rounded"
                        />
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
                          <Badge variant="outline">
                            {product.brand.name}
                          </Badge>
                        ) : (
                          <span className="text-[#888B8D]">No Brand</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-[#53565A]">
                          {product.category?.name || 'No Category'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-[#53565A]">
                          Rs. {(product.price || product.mrp || 0).toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-[#888B8D]">
                Selected {selectedProductIds.length} product{selectedProductIds.length !== 1 ? 's' : ''}
              </p>
              <Button
                onClick={handleNextFromProducts}
                className="bg-[#0067A0] hover:bg-[#0067A0]/90"
                disabled={selectedProductIds.length === 0}
              >
                Next: Select Fields
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Field Selection */}
      {currentStep === 'select-fields' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#0067A0]" />
              Select Fields to Update
            </CardTitle>
            <p className="text-sm text-[#888B8D]">
              Choose which fields you want to update for the selected {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableFields.map(field => (
                <div
                  key={field.key}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedFields.includes(field.key)
                      ? 'border-[#0067A0] bg-[#0067A0]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleFieldToggle(field.key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-[#53565A]">{field.label}</h3>
                    {selectedFields.includes(field.key) && (
                      <Check className="w-5 h-5 text-[#0067A0]" />
                    )}
                  </div>
                  <Badge variant={field.type === 'text' ? 'default' : 'secondary'} className="text-xs">
                    {field.type}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('select-products')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back: Select Products
              </Button>
              <div className="flex items-center gap-4">
                <p className="text-sm text-[#888B8D]">
                  Selected {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''}
                </p>
                <Button
                  onClick={handleNextFromFields}
                  className="bg-[#0067A0] hover:bg-[#0067A0]/90"
                  disabled={selectedFields.length === 0}
                >
                  Next: Update Data
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Data Update */}
      {currentStep === 'update-data' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-[#0067A0]" />
                  Update Product Data
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('select-fields')}
                  size="sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Change Fields
                </Button>
              </div>
              <p className="text-sm text-[#888B8D]">
                Update data for {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''}. 
                Current values are pre-filled. For array fields, separate values with commas.
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-48">Product</TableHead>
                      {selectedFields.map(fieldKey => {
                        const field = availableFields.find(f => f.key === fieldKey);
                        return (
                          <TableHead key={fieldKey} className="min-w-32">
                            {field?.label}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProducts.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold text-[#53565A] truncate">{product.name}</div>
                            {product.modelCode && (
                              <div className="text-xs text-[#888B8D]">Model: {product.modelCode}</div>
                            )}
                          </div>
                        </TableCell>
                        {selectedFields.map(fieldKey => {
                          const field = availableFields.find(f => f.key === fieldKey);
                          return (
                            <TableCell key={fieldKey}>
                              {field && renderFieldInput(product, field)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('select-fields')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back: Select Fields
                </Button>
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update All Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#0067A0]" />
              Confirm Bulk Update
            </DialogTitle>
            <DialogDescription>
              You are about to update {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} with the following fields:
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedFields.map(fieldKey => {
                  const field = availableFields.find(f => f.key === fieldKey);
                  return (
                    <Badge key={fieldKey} variant="secondary" className="text-xs">
                      {field?.label}
                    </Badge>
                  );
                })}
              </div>
              <p className="mt-2 text-sm text-amber-600">
                This action will modify existing product data. Make sure all changes are correct before proceeding.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Products
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkUpdateProducts;
