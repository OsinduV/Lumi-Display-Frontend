import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Settings, 
  Check,
  AlertCircle,
  Upload
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

interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'array' | 'checkbox';
  required: boolean;
  options?: { value: string; label: string }[];
}

interface ProductRow {
  id: string;
  [key: string]: any;
}

interface BulkCreateProductsProps {
  onBack: () => void;
  onSuccess: () => void;
}

const BulkCreateProducts: React.FC<BulkCreateProductsProps> = ({ onBack, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState<'select-fields' | 'input-data'>('select-fields');
  const [selectedFields, setSelectedFields] = useState<string[]>(['name']); // name is mandatory
  const [productRows, setProductRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [availableFields, setAvailableFields] = useState<FieldConfig[]>([
    { key: 'name', label: 'Product Name', type: 'text', required: true },
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
    { key: 'redistributionPrice', label: 'Redistribution Price', type: 'number', required: false },
    { key: 'specialPrice', label: 'Special Price', type: 'number', required: false },
    { key: 'isSpecialPriceActive', label: 'Special Price Active', type: 'checkbox', required: false },
  ]);

  useEffect(() => {
    fetchReferenceData();
  }, []);

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

  const handleFieldToggle = (fieldKey: string) => {
    if (fieldKey === 'name') return; // name is mandatory

    setSelectedFields(prev => 
      prev.includes(fieldKey)
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleNextStep = () => {
    if (selectedFields.length === 0) {
      toast.error('Please select at least the product name field');
      return;
    }

    // Initialize with one empty row
    const initialRow: ProductRow = {
      id: `row-${Date.now()}`,
    };
    
    // Initialize all selected fields with empty values
    selectedFields.forEach(fieldKey => {
      const field = availableFields.find(f => f.key === fieldKey);
      if (field?.type === 'array' || field?.key === 'tags') {
        initialRow[fieldKey] = [];
      } else if (field?.type === 'checkbox') {
        initialRow[fieldKey] = false;
      } else {
        initialRow[fieldKey] = '';
      }
    });

    setProductRows([initialRow]);
    setCurrentStep('input-data');
  };

  const addNewRow = () => {
    const newRow: ProductRow = {
      id: `row-${Date.now()}-${Math.random()}`,
    };
    
    selectedFields.forEach(fieldKey => {
      const field = availableFields.find(f => f.key === fieldKey);
      if (field?.type === 'array' || field?.key === 'tags') {
        newRow[fieldKey] = [];
      } else if (field?.type === 'checkbox') {
        newRow[fieldKey] = false;
      } else {
        newRow[fieldKey] = '';
      }
    });

    setProductRows(prev => [...prev, newRow]);
  };

  const removeRow = (rowId: string) => {
    if (productRows.length <= 1) {
      toast.error('At least one product row is required');
      return;
    }
    setProductRows(prev => prev.filter(row => row.id !== rowId));
  };

  const updateRowValue = (rowId: string, fieldKey: string, value: any) => {
    setProductRows(prev => prev.map(row => 
      row.id === rowId ? { ...row, [fieldKey]: value } : row
    ));
  };

  const handleArrayInput = (rowId: string, fieldKey: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    updateRowValue(rowId, fieldKey, arrayValue);
  };

  const handleMultiSelectInput = (rowId: string, fieldKey: string, value: string) => {
    const selectedIds = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    updateRowValue(rowId, fieldKey, selectedIds);
  };

  const validateData = (): boolean => {
    for (const row of productRows) {
      // Check required fields
      for (const fieldKey of selectedFields) {
        const field = availableFields.find(f => f.key === fieldKey);
        if (field?.required && (!row[fieldKey] || row[fieldKey] === '')) {
          toast.error(`${field.label} is required for all products`);
          return false;
        }
      }

      // Validate product name is not empty (it's always required)
      if (!row.name || row.name.trim() === '') {
        toast.error('Product name is required for all products');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateData()) return;

    setLoading(true);
    try {
      // Transform the data for API
      const productsToCreate = productRows.map(row => {
        const product: any = {};
        
        selectedFields.forEach(fieldKey => {
          if (row[fieldKey] !== undefined && row[fieldKey] !== '') {
            product[fieldKey] = row[fieldKey];
          }
        });

        return product;
      });

      await productAPI.bulkCreateProducts(productsToCreate);
      toast.success(`Successfully created ${productsToCreate.length} products`);
      onSuccess();
    } catch (error: any) {
      console.error('Error creating products:', error);
      if (error.response?.data?.errors) {
        toast.error(`Bulk creation completed with some failures: ${error.response.data.failedCount} failed`);
      } else {
        toast.error('Failed to create products');
      }
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const renderFieldInput = (row: ProductRow, field: FieldConfig) => {
    const value = row[field.key] || '';

    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => updateRowValue(row.id, field.key, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="min-w-32"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => updateRowValue(row.id, field.key, parseFloat(e.target.value) || '')}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="min-w-32"
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => updateRowValue(row.id, field.key, e.target.value)}
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
            value={Array.isArray(value) ? value.join(', ') : ''}
            onChange={(e) => handleMultiSelectInput(row.id, field.key, e.target.value)}
            placeholder="Enter IDs separated by commas"
            className="min-w-32"
          />
        );

      case 'array':
        return (
          <Input
            value={Array.isArray(value) ? value.join(', ') : ''}
            onChange={(e) => handleArrayInput(row.id, field.key, e.target.value)}
            placeholder="Enter values separated by commas"
            className="min-w-32"
          />
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => updateRowValue(row.id, field.key, e.target.checked)}
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
          <div className="w-12 h-12 bg-[#FF9E1B]/10 rounded-lg flex items-center justify-center">
            <Upload className="w-6 h-6 text-[#FF9E1B]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#53565A]">Bulk Create Products</h1>
            <p className="text-[#888B8D] mt-1">Create multiple products at once by selecting fields and entering data</p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`flex items-center ${currentStep === 'select-fields' ? 'text-[#FF9E1B]' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            currentStep === 'select-fields' ? 'border-[#FF9E1B] bg-[#FF9E1B] text-white' : 'border-gray-300'
          }`}>
            1
          </div>
          <span className="ml-2 font-medium">Select Fields</span>
        </div>
        <div className="w-16 h-px bg-gray-300"></div>
        <div className={`flex items-center ${currentStep === 'input-data' ? 'text-[#FF9E1B]' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            currentStep === 'input-data' ? 'border-[#FF9E1B] bg-[#FF9E1B] text-white' : 'border-gray-300'
          }`}>
            2
          </div>
          <span className="ml-2 font-medium">Input Data</span>
        </div>
      </div>

      {/* Step 1: Field Selection */}
      {currentStep === 'select-fields' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#FF9E1B]" />
              Select Fields to Include
            </CardTitle>
            <p className="text-sm text-[#888B8D]">
              Choose which fields you want to include in your bulk creation. Product name is mandatory and cannot be deselected.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableFields.map(field => (
                <div
                  key={field.key}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedFields.includes(field.key)
                      ? 'border-[#FF9E1B] bg-[#FF9E1B]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${field.required ? 'opacity-75' : ''}`}
                  onClick={() => !field.required && handleFieldToggle(field.key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-[#53565A]">{field.label}</h3>
                    {selectedFields.includes(field.key) && (
                      <Check className="w-5 h-5 text-[#FF9E1B]" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={field.type === 'text' ? 'default' : 'secondary'} className="text-xs">
                      {field.type}
                    </Badge>
                    {field.required && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-[#888B8D]">
                Selected {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''}
              </p>
              <Button
                onClick={handleNextStep}
                className="bg-[#FF9E1B] hover:bg-[#FF9E1B]/90"
                disabled={selectedFields.length === 0}
              >
                Next: Input Data
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Data Input */}
      {currentStep === 'input-data' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#FF9E1B]" />
                  Enter Product Data
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('select-fields')}
                    size="sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Change Fields
                  </Button>
                  <Button
                    onClick={addNewRow}
                    size="sm"
                    className="bg-[#0067A0] hover:bg-[#0067A0]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Row
                  </Button>
                </div>
              </div>
              <p className="text-sm text-[#888B8D]">
                Enter data for {productRows.length} product{productRows.length !== 1 ? 's' : ''}. 
                For array fields (features, sizes, colors, etc.), separate values with commas.
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">#</TableHead>
                      {selectedFields.map(fieldKey => {
                        const field = availableFields.find(f => f.key === fieldKey);
                        return (
                          <TableHead key={fieldKey} className="min-w-32">
                            <div className="flex items-center gap-1">
                              {field?.label}
                              {field?.required && <span className="text-red-500">*</span>}
                            </div>
                          </TableHead>
                        );
                      })}
                      <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productRows.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        {selectedFields.map(fieldKey => {
                          const field = availableFields.find(f => f.key === fieldKey);
                          return (
                            <TableCell key={fieldKey}>
                              {field && renderFieldInput(row, field)}
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRow(row.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={productRows.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-[#888B8D]">
                  {productRows.length} product{productRows.length !== 1 ? 's' : ''} ready for creation
                </p>
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={productRows.length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create All Products
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
              <AlertCircle className="w-5 h-5 text-[#FF9E1B]" />
              Confirm Bulk Creation
            </DialogTitle>
            <DialogDescription>
              You are about to create {productRows.length} product{productRows.length !== 1 ? 's' : ''} with the following fields:
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
              <p className="mt-2 text-sm text-red-600">
                This action cannot be undone. Make sure all data is correct before proceeding.
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
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Products
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkCreateProducts;
