import React, { useState, useEffect } from "react";
import { 
  Save, 
  FolderTree,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryAPI } from "@/api";
import toast, { Toaster } from 'react-hot-toast';

interface CategoryFormData {
  name: string;
  parent: string;
}

interface Category {
  _id: string;
  name: string;
  level: number;
  parent?: string;
}

interface CategoryFormProps {
  editMode?: boolean;
  categoryData?: any;
  onSuccess?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  editMode = false, 
  categoryData = null, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    parent: ''
  });

  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch parent categories
  useEffect(() => {
    fetchParentCategories();
  }, []);

  // Populate form data when editing
  useEffect(() => {
    if (editMode && categoryData) {
      setFormData({
        name: categoryData.name || '',
        parent: categoryData.parent?._id || categoryData.parent || ''
      });
    }
  }, [editMode, categoryData]);

  const fetchParentCategories = async () => {
    try {
      const response = await categoryAPI.getParents();
      setParentCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching parent categories:', error);
      toast.error('Failed to load parent categories');
    }
  };

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submitData: any = {
        name: formData.name.trim()
      };

      // Only include parent if it's selected
      if (formData.parent) {
        submitData.parent = formData.parent;
      }

      if (editMode && categoryData?._id) {
        await categoryAPI.update(categoryData._id, submitData);
        toast.success('Category updated successfully!', {
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
        await categoryAPI.create(submitData);
        toast.success('Category created successfully!', {
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

      // Reset form if creating new category
      if (!editMode) {
        setFormData({
          name: '',
          parent: ''
        });
      }

      // Call success callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }

    } catch (error: any) {
      console.error('Error submitting category:', error);
      
      let errorMessage = editMode ? 'Failed to update category' : 'Failed to create category';
      
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
              <FolderTree className="w-5 h-5 text-[#008C95]" />
              <span>Category Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">
                Category Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter category name (e.g., LED Bulbs, Ceiling Lights)"
                required
                className="focus:border-[#008C95] focus:ring-[#008C95]/20"
              />
            </div>

            {/* Parent Category Selection */}
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">
                Parent Category (Optional)
              </label>
              <select
                value={formData.parent}
                onChange={(e) => handleInputChange('parent', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#008C95] focus:border-[#008C95] transition-colors"
              >
                <option value="">No Parent (Root Category)</option>
                {parentCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select a parent category to create a subcategory
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting || !formData.name.trim()}
            className="bg-[#008C95] hover:bg-[#008C95]/90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editMode ? 'Update Category' : 'Create Category'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
