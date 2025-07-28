import React, { useState, useEffect } from "react";
import { 
  Save, 
  Award,
  AlertCircle,
  Upload,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { brandAPI } from "@/api";
import toast, { Toaster } from 'react-hot-toast';

interface BrandFormData {
  name: string;
  image?: File | null;
}

interface BrandFormProps {
  editMode?: boolean;
  brandData?: any;
  onSuccess?: () => void;
}

const BrandForm: React.FC<BrandFormProps> = ({ 
  editMode = false, 
  brandData = null, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form data when editing
  useEffect(() => {
    if (editMode && brandData) {
      setFormData({
        name: brandData.name || '',
        image: null
      });
      
      // Set existing image preview
      if (brandData.image) {
        setImagePreview(brandData.image);
      }
    }
  }, [editMode, brandData]);

  const handleInputChange = (field: keyof BrandFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(editMode && brandData?.image ? brandData.image : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Brand name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (formData.image) {
        // Create FormData for image upload
        const submitFormData = new FormData();
        submitFormData.append('name', formData.name.trim());
        submitFormData.append('image', formData.image);

        if (editMode && brandData?._id) {
          await brandAPI.updateWithImage(brandData._id, submitFormData);
          toast.success('Brand updated successfully!', {
            duration: 3000,
            position: 'top-right',
            style: {
              background: '#10B981',
              color: '#FFFFFF',
              fontWeight: '500',
            },
            icon: '✅',
          });
        } else {
          await brandAPI.createWithImage(submitFormData);
          toast.success('Brand created successfully!', {
            duration: 3000,
            position: 'top-right',
            style: {
              background: '#10B981',
              color: '#FFFFFF',
              fontWeight: '500',
            },
            icon: '✅',
          });
        }
      } else {
        // Create/update without image
        const submitData = {
          name: formData.name.trim()
        };

        if (editMode && brandData?._id) {
          await brandAPI.update(brandData._id, submitData);
          toast.success('Brand updated successfully!', {
            duration: 3000,
            position: 'top-right',
            style: {
              background: '#10B981',
              color: '#FFFFFF',
              fontWeight: '500',
            },
            icon: '✅',
          });
        } else {
          await brandAPI.create(submitData);
          toast.success('Brand created successfully!', {
            duration: 3000,
            position: 'top-right',
            style: {
              background: '#10B981',
              color: '#FFFFFF',
              fontWeight: '500',
            },
            icon: '✅',
          });
        }
      }

      // Reset form if creating new brand
      if (!editMode) {
        setFormData({
          name: '',
          image: null
        });
        setImagePreview(null);
      }

      // Call success callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }

    } catch (error: any) {
      console.error('Error submitting brand:', error);
      
      let errorMessage = editMode ? 'Failed to update brand' : 'Failed to create brand';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          fontWeight: '500',
        },
        icon: '❌',
      });
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Toast Container */}
      <Toaster />

      {/* API Error Warning */}
      {error && (
        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#FF9E1B]" />
              <span>Brand Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">
                Brand Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter brand name (e.g., Philips, OSRAM, Ledvance)"
                required
                className="focus:border-[#FF9E1B] focus:ring-[#FF9E1B]/20"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">
                Brand Logo (Optional)
              </label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4 relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Brand logo preview" 
                    className="w-32 h-32 object-contain border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeImage}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}

              {/* File Input */}
              <div className="flex items-center justify-center w-full">
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> brand logo
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                  </div>
                  <input 
                    id="image-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className="text-xs text-[#888B8D] mt-1">
                Upload a brand logo to help identify products from this brand
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting || !formData.name.trim()}
            className="bg-[#FF9E1B] hover:bg-[#FF9E1B]/90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editMode ? 'Update Brand' : 'Create Brand'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BrandForm;
