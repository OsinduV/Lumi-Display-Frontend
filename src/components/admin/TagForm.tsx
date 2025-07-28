import React, { useState, useEffect } from "react";
import { 
  Save, 
  Tag,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tagAPI } from "@/api";
import toast, { Toaster } from 'react-hot-toast';

interface TagFormData {
  name: string;
}

interface TagFormProps {
  editMode?: boolean;
  tagData?: any;
  onSuccess?: () => void;
}

const TagForm: React.FC<TagFormProps> = ({ 
  editMode = false, 
  tagData = null, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<TagFormData>({
    name: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form data when editing
  useEffect(() => {
    if (editMode && tagData) {
      setFormData({
        name: tagData.name || ''
      });
    }
  }, [editMode, tagData]);

  const handleInputChange = (field: keyof TagFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Tag name is required');
      return;
    }

    // Validate tag name format (alphanumeric, spaces, hyphens, underscores)
    const tagNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (!tagNameRegex.test(formData.name.trim())) {
      toast.error('Tag name can only contain letters, numbers, spaces, hyphens, and underscores');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = {
        name: formData.name.trim()
      };

      if (editMode && tagData?._id) {
        await tagAPI.update(tagData._id, submitData);
        toast.success('Tag updated successfully!', {
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
        await tagAPI.create(submitData);
        toast.success('Tag created successfully!', {
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

      // Reset form if creating new tag
      if (!editMode) {
        setFormData({
          name: ''
        });
      }

      // Call success callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }

    } catch (error: any) {
      console.error('Error submitting tag:', error);
      
      let errorMessage = editMode ? 'Failed to update tag' : 'Failed to create tag';
      
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
              <Tag className="w-5 h-5 text-[#0067A0]" />
              <span>Tag Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#53565A] mb-2">
                Tag Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter tag name"
                required
                className="focus:border-[#0067A0] focus:ring-[#0067A0]/20"
              />
              <p className="text-xs text-[#888B8D] mt-1">
                Use descriptive tags to help categorize and filter products. Only letters, numbers, spaces, hyphens, and underscores are allowed.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting || !formData.name.trim()}
            className="bg-[#0067A0] hover:bg-[#0067A0]/90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editMode ? 'Update Tag' : 'Create Tag'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TagForm;
