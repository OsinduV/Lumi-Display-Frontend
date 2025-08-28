import React, { useState, useEffect } from "react";
import { 
  Save, 
  Plus, 
  X, 
  Upload, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  Package,
  DollarSign,
  Palette,
  Ruler,
  Tag as TagIcon,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { categoryAPI, brandAPI, tagAPI, productAPI, uploadAPI } from "@/api";
import toast, { Toaster } from 'react-hot-toast';

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

interface ProductFormData {
  name: string;
  modelCode: string;
  description: string;
  features: string[];
  images: string[];
  specSheets: string[];
  category: string;
  brand: string;
  tags: string[];
  sizes: string[];
  colors: string[];
  shapes: string[];
  types: string[];
  price: number | '';
  mrp: number | '';
  discountedPrice: number | '';
  minimumPrice: number | '';
  activePriceType: 'price' | 'mrp' | 'discountedPrice' | 'minimumPrice';
}

interface ProductFormProps {
  editMode?: boolean;
  productData?: any;
  onSuccess?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  editMode = false, 
  productData = null, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    modelCode: '',
    description: '',
    features: [],
    images: [],
    specSheets: [],
    category: '',
    brand: '',
    tags: [],
    sizes: [],
    colors: [],
    shapes: [],
    types: [],
    price: '',
    mrp: '',
    discountedPrice: '',
    minimumPrice: '',
    activePriceType: 'price'
  });

  const [currentFeature, setCurrentFeature] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [currentSize, setCurrentSize] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  const [currentShape, setCurrentShape] = useState('');
  const [currentType, setCurrentType] = useState('');

  // State for API data
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Category search state
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  // File upload state (keeping for future implementation)
  // const [selectedImages, setSelectedImages] = useState<File[]>([]);
  // const [selectedSpecSheets, setSelectedSpecSheets] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingSpecSheets, setUploadingSpecSheets] = useState(false);
  // const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesRes, brandsRes, tagsRes] = await Promise.all([
          categoryAPI.getAll(),
          brandAPI.getAll(),
          tagAPI.getAll()
        ]);

        setCategories(categoriesRes.data || []);
        setBrands(brandsRes.data || []);
        setAvailableTags(tagsRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Using fallback data.');
        
        // Show warning toast for API failure
        toast.error('Failed to load latest data. Using cached data.', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#F59E0B',
            color: '#FFFFFF',
            fontWeight: '500',
          },
          icon: '⚠️',
        });
        
        // Fallback data if API fails
        setCategories([
          { _id: '1', name: 'LED Lighting' },
          { _id: '2', name: 'Smart Lighting' },
          { _id: '3', name: 'Commercial Lighting' },
          { _id: '4', name: 'Residential Lighting' }
        ]);
        setBrands([
          { _id: '1', name: 'LUMIZO' },
          { _id: '2', name: 'Philips' },
          { _id: '3', name: 'OSRAM' },
          { _id: '4', name: 'LEDVANCE' }
        ]);
        setAvailableTags([
          { _id: '1', name: 'Energy Efficient' },
          { _id: '2', name: 'Dimmable' },
          { _id: '3', name: 'Smart' },
          { _id: '4', name: 'Outdoor' },
          { _id: '5', name: 'Indoor' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Populate form data when in edit mode
  useEffect(() => {
    if (editMode && productData) {
      setFormData({
        name: productData.name || '',
        modelCode: productData.modelCode || '',
        description: productData.description || '',
        features: productData.features || [],
        images: productData.images || [],
        specSheets: productData.specSheets || [],
        category: productData.category?._id || '',
        brand: productData.brand?._id || '',
        tags: productData.tags?.map((tag: any) => tag._id) || [],
        sizes: productData.sizes || [],
        colors: productData.colors || [],
        shapes: productData.shapes || [],
        types: productData.types || [],
        price: productData.price || '',
        mrp: productData.mrp || '',
        discountedPrice: productData.discountedPrice || '',
        minimumPrice: productData.minimumPrice || '',
        activePriceType: productData.activePriceType || 'price'
      });
      
      // Set the selected category name for the dropdown
      if (productData.category) {
        setSelectedCategoryName(productData.category.name);
        setCategorySearch(productData.category.name);
      }
    }
  }, [editMode, productData]);

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Handle category selection
  const handleCategorySelect = (category: Category) => {
    setFormData(prev => ({ ...prev, category: category._id }));
    setSelectedCategoryName(category.name);
    setCategorySearch(category.name);
    setShowCategoryDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.category-dropdown-container')) {
        setShowCategoryDropdown(false);
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCategoryDropdown]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle'); // Using toast instead

  // Handle input changes
  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add feature
  const addFeature = () => {
    if (currentFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
      toast.success('Feature added successfully!', {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#0067A0',
          color: '#FFFFFF',
        },
        icon: '✨',
      });
    }
  };

  // Remove feature
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Add image
  const addImage = () => {
    if (currentImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, currentImage.trim()]
      }));
      setCurrentImage('');
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Remove spec sheet by URL
  const removeSpecSheet = (url: string) => {
    setFormData(prev => ({
      ...prev,
      specSheets: prev.specSheets.filter(specUrl => specUrl !== url)
    }));
  };

  // File upload functions
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image format`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadFormData = new FormData();
      validFiles.forEach((file) => {
        uploadFormData.append('images', file);
      });
      
      // Add product name for better organization in Cloudinary
      uploadFormData.append('productName', formData.name || 'unknown-product');

      const response = await uploadAPI.uploadProductImages(uploadFormData);
      
      if (response.data && response.data.images) {
        const imageUrls = response.data.images.map((img: any) => img.url);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...imageUrls]
        }));
        
        toast.success(`${validFiles.length} image(s) uploaded successfully!`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSpecSheetUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid document format`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadingSpecSheets(true);
    try {
      const uploadFormData = new FormData();
      validFiles.forEach((file) => {
        uploadFormData.append('specSheets', file);
      });
      
      // Add product name for better organization in Cloudinary
      uploadFormData.append('productName', formData.name || 'unknown-product');

      const response = await uploadAPI.uploadSpecSheets(uploadFormData);
      
      if (response.data && response.data.specSheets) {
        setFormData(prev => ({
          ...prev,
          specSheets: [...prev.specSheets, ...response.data.specSheets]
        }));
        
        toast.success(`${validFiles.length} document(s) uploaded successfully!`);
      }
    } catch (error) {
      console.error('Error uploading spec sheets:', error);
      toast.error('Failed to upload documents. Please try again.');
    } finally {
      setUploadingSpecSheets(false);
    }
  };

  // Add array item (generic function for sizes, colors, shapes, types)
  const addArrayItem = (field: 'sizes' | 'colors' | 'shapes' | 'types', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  // Remove array item
  const removeArrayItem = (field: 'sizes' | 'colors' | 'shapes' | 'types', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Toggle tag
  const toggleTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId) 
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // setSubmitStatus('idle'); // Using toast instead

    // Show loading toast
    const loadingToastId = toast.loading(
      editMode ? 'Updating product...' : 'Creating product...', 
      {
        position: 'top-right',
        style: {
          background: '#FF9E1B',
          color: '#FFFFFF',
          fontWeight: '500',
        },
      }
    );

    try {
      // Convert string numbers to actual numbers and handle empty strings for ObjectId fields
      const submitData = {
        ...formData,
        // Handle optional ObjectId fields - send null instead of empty string
        category: formData.category.trim() === '' ? null : formData.category,
        brand: formData.brand.trim() === '' ? null : formData.brand,
        // Convert price fields
        price: formData.price === '' ? undefined : Number(formData.price),
        mrp: formData.mrp === '' ? undefined : Number(formData.mrp),
        discountedPrice: formData.discountedPrice === '' ? undefined : Number(formData.discountedPrice),
        minimumPrice: formData.minimumPrice === '' ? undefined : Number(formData.minimumPrice),
        activePriceType: formData.activePriceType
      };

      console.log('Submitting product data:', submitData);
      
      // Submit to API
      if (editMode && productData) {
        await productAPI.updateProduct(productData._id, submitData);
      } else {
        await productAPI.createProduct(submitData);
      }
      
      // Dismiss loading toast and show success toast
      toast.dismiss(loadingToastId);
      toast.success(
        editMode ? 'Product updated successfully! 🎉' : 'Product created successfully! 🎉', 
        {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#FFFFFF',
            fontWeight: '500',
          },
          icon: '✅',
        }
      );
      
      // setSubmitStatus('success'); // Using toast instead
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form after successful submission (only if not in edit mode)
      if (!editMode) {
        setTimeout(() => {
          setFormData({
            name: '',
            modelCode: '',
            description: '',
            features: [],
            images: [],
            specSheets: [],
            category: '',
            brand: '',
            tags: [],
            sizes: [],
            colors: [],
            shapes: [],
            types: [],
            price: '',
            mrp: '',
            discountedPrice: '',
            minimumPrice: '',
            activePriceType: 'price'
          });
          setSelectedCategoryName('');
          setCategorySearch('');
          // setSubmitStatus('idle'); // Using toast instead
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error saving product:', error);
      
      // Dismiss loading toast and show error toast
      toast.dismiss(loadingToastId);
      toast.error(
        editMode ? 'Failed to update product. Please try again.' : 'Failed to create product. Please try again.', 
        {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
            fontWeight: '500',
          },
          icon: '❌',
        }
      );
      
      // setSubmitStatus('error'); // Using toast instead
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6 pb-12 sm:pb-20">
      {/* Toast Container */}
      <Toaster />

      {/* API Error Warning - Keep this one as it's more persistent */}
      {error && (
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <span className="text-sm sm:text-base text-yellow-800">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF9E1B]" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-[#53565A] mb-2">
                  Product Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                  className="focus:border-[#FF9E1B] focus:ring-[#FF9E1B]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#53565A] mb-2">
                  Model Code
                </label>
                <Input
                  value={formData.modelCode}
                  onChange={(e) => handleInputChange('modelCode', e.target.value)}
                  placeholder="Enter model code"
                  className="focus:border-[#FF9E1B] focus:ring-[#FF9E1B]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={4}
                className="focus:border-[#FF9E1B] focus:ring-[#FF9E1B]/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#53565A] mb-2">
                  Category (Optional)
                </label>
                {selectedCategoryName && (
                  <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
                    <span className="text-sm text-blue-800">Selected: {selectedCategoryName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategoryName('');
                        handleInputChange('category', '');
                        setCategorySearch('');
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
                <div className="relative category-dropdown-container">
                  <div className="flex">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                    <Input
                      value={categorySearch}
                      onChange={(e) => {
                        setCategorySearch(e.target.value);
                        setShowCategoryDropdown(true);
                      }}
                      onFocus={() => setShowCategoryDropdown(true)}
                      placeholder="Search categories..."
                      className="pl-10 focus:border-[#FF9E1B] focus:ring-[#FF9E1B]/20"
                    />
                  </div>
                  {showCategoryDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {loading ? (
                        <div className="p-2 text-center text-gray-500">Loading categories...</div>
                      ) : filteredCategories.length > 0 ? (
                        filteredCategories.map(category => (
                          <button
                            key={category._id}
                            type="button"
                            onClick={() => handleCategorySelect(category)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100"
                          >
                            {category.name}
                          </button>
                        ))
                      ) : (
                        <div className="p-2 text-center text-gray-500">No categories found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#53565A] mb-2">
                  Brand (Optional)
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#FF9E1B] focus:ring-2 focus:ring-[#FF9E1B]/20 disabled:bg-gray-100"
                >
                  <option value="">{loading ? 'Loading brands...' : 'Select Brand (Optional)'}</option>
                  {brands.map(brand => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-[#0067A0]" />
              <span>Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 focus:border-[#0067A0] focus:ring-[#0067A0]/20"
              />
              <Button 
                type="button" 
                onClick={addFeature}
                className="bg-[#0067A0] hover:bg-[#0067A0]/90"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-[#008C95]" />
              <span>Media & Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">Images</label>
              
              {/* File Upload Section */}
              <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#008C95] transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload product images</p>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                    disabled={uploadingImages}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                      uploadingImages 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-[#008C95] hover:bg-[#008C95]/90 cursor-pointer'
                    } transition-colors`}
                  >
                    {uploadingImages ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Images
                      </>
                    )}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Max 5 files, 5MB each. JPG, PNG, WebP, GIF</p>
                </div>
              </div>

              {/* URL Input Section */}
              <div className="flex space-x-2 mb-3">
                <Input
                  value={currentImage}
                  onChange={(e) => setCurrentImage(e.target.value)}
                  placeholder="Or enter image URL"
                  className="flex-1 focus:border-[#008C95] focus:ring-[#008C95]/20"
                />
                <Button 
                  type="button" 
                  onClick={addImage}
                  className="bg-[#008C95] hover:bg-[#008C95]/90"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Images Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <img 
                        src={image} 
                        alt={`Product ${index + 1}`}
                        className="w-8 h-8 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="text-sm truncate">{image}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="ml-2 text-red-600 hover:text-red-800 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Spec Sheets */}
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">Specification Sheets</label>
              
              {/* File Upload Section */}
              <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#008C95] transition-colors">
                <div className="text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload specification documents</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleSpecSheetUpload(e.target.files)}
                    className="hidden"
                    id="spec-upload"
                    disabled={uploadingSpecSheets}
                  />
                  <label
                    htmlFor="spec-upload"
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                      uploadingSpecSheets 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-[#008C95] hover:bg-[#008C95]/90 cursor-pointer'
                    } transition-colors`}
                  >
                    {uploadingSpecSheets ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Choose Documents
                      </>
                    )}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Max 3 files, 10MB each. PDF, DOC, DOCX, JPG, PNG</p>
                </div>
              </div>

              {/* Documents List */}
              <div className="space-y-2">
                {formData.specSheets.map((sheetUrl, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-[#008C95] flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm">
                          {sheetUrl.split('/').pop()?.split('.')[0] || 'Document'}
                        </div>
                        <div className="text-xs text-gray-600 truncate">{sheetUrl}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpecSheet(sheetUrl)}
                      className="text-red-600 hover:text-red-800 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Variants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-[#FF9E1B]" />
              <span>Product Variants</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">
                <Ruler className="w-4 h-4 inline mr-1" />
                Sizes
              </label>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={currentSize}
                  onChange={(e) => setCurrentSize(e.target.value)}
                  placeholder="Add size (e.g., Small, Medium, Large)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('sizes', currentSize), setCurrentSize(''))}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={() => { addArrayItem('sizes', currentSize); setCurrentSize(''); }}
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sizes.map((size, index) => (
                  <Badge key={index} variant="outline" className="flex items-center space-x-1">
                    <span>{size}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('sizes', index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">
                <Palette className="w-4 h-4 inline mr-1" />
                Colors
              </label>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  placeholder="Add color (e.g., White, Warm White, Cool White)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('colors', currentColor), setCurrentColor(''))}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={() => { addArrayItem('colors', currentColor); setCurrentColor(''); }}
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map((color, index) => (
                  <Badge key={index} variant="outline" className="flex items-center space-x-1">
                    <span>{color}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('colors', index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Shapes */}
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">Shapes</label>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={currentShape}
                  onChange={(e) => setCurrentShape(e.target.value)}
                  placeholder="Add shape (e.g., Round, Square, Linear)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('shapes', currentShape), setCurrentShape(''))}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={() => { addArrayItem('shapes', currentShape); setCurrentShape(''); }}
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.shapes.map((shape, index) => (
                  <Badge key={index} variant="outline" className="flex items-center space-x-1">
                    <span>{shape}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('shapes', index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Types */}
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">Types</label>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={currentType}
                  onChange={(e) => setCurrentType(e.target.value)}
                  placeholder="Add type (e.g., Downlight, Track Light, Strip Light)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('types', currentType), setCurrentType(''))}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={() => { addArrayItem('types', currentType); setCurrentType(''); }}
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.types.map((type, index) => (
                  <Badge key={index} variant="outline" className="flex items-center space-x-1">
                    <span>{type}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('types', index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TagIcon className="w-5 h-5 text-[#0067A0]" />
              <span>Tags</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading tags...</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => toggleTag(tag._id)}
                    className={`px-3 py-1 rounded-full border transition-colors ${
                      formData.tags.includes(tag._id)
                        ? 'bg-[#0067A0] text-white border-[#0067A0]'
                        : 'bg-white text-[#53565A] border-gray-300 hover:border-[#0067A0]'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
                {availableTags.length === 0 && (
                  <div className="text-gray-500 text-sm">No tags available</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#008C95]" />
              <span>Pricing</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-[#53565A] mb-2">Price (LKR)</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="focus:border-[#008C95] focus:ring-[#008C95]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#53565A] mb-2">MRP (LKR)</label>
                <Input
                  type="number"
                  value={formData.mrp}
                  onChange={(e) => handleInputChange('mrp', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="focus:border-[#008C95] focus:ring-[#008C95]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#53565A] mb-2">Discounted Price (LKR)</label>
                <Input
                  type="number"
                  value={formData.discountedPrice}
                  onChange={(e) => handleInputChange('discountedPrice', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="focus:border-[#008C95] focus:ring-[#008C95]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#53565A] mb-2">Minimum Price (LKR)</label>
                <Input
                  type="number"
                  value={formData.minimumPrice}
                  onChange={(e) => handleInputChange('minimumPrice', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="focus:border-[#008C95] focus:ring-[#008C95]/20"
                />
              </div>
            </div>
            <div className="pt-2">
              <label className="block text-sm font-medium text-[#53565A] mb-2">
                Active Price Type
              </label>
              <select
                value={formData.activePriceType}
                onChange={(e) => handleInputChange('activePriceType', e.target.value as 'price' | 'mrp' | 'discountedPrice' | 'minimumPrice')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#008C95] focus:ring-2 focus:ring-[#008C95]/20"
              >
                <option value="price">Normal Price</option>
                <option value="mrp">MRP (Minimum Retail Price)</option>
                <option value="discountedPrice">Discounted Price</option>
                <option value="minimumPrice">Minimum Price</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select which price should be displayed as the active price for customers
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (confirm('Are you sure you want to reset the form?')) {
                setFormData({
                  name: '',
                  modelCode: '',
                  description: '',
                  features: [],
                  images: [],
                  specSheets: [],
                  category: '',
                  brand: '',
                  tags: [],
                  sizes: [],
                  colors: [],
                  shapes: [],
                  types: [],
                  price: '',
                  mrp: '',
                  discountedPrice: '',
                  minimumPrice: '',
                  activePriceType: 'price'
                });
                setSelectedCategoryName('');
                setCategorySearch('');
                toast.success('Form reset successfully', {
                  duration: 2000,
                  position: 'top-right',
                  style: {
                    background: '#6B7280',
                    color: '#FFFFFF',
                  },
                  icon: '🔄',
                });
              }
            }}
            className="w-full sm:w-auto"
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !formData.name.trim()}
            className="bg-[#FF9E1B] hover:bg-[#FF9E1B]/90 disabled:opacity-50 w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editMode ? 'Update Product' : 'Create Product'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
