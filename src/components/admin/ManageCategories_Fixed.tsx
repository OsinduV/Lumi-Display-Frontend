import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Filter,
  RefreshCw,
  FolderTree,
  AlertCircle,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { categoryAPI } from "@/api";
import CategoryForm from "./CategoryForm";
import AddProductsToCategory from "./AddProductsToCategory";
import toast from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  description?: string;
  parent?: string;
  level: number;
  createdAt: string;
  updatedAt: string;
}

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  
  // View states
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddProductsModal, setShowAddProductsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchFilteredCategories();
    }
  }, [searchTerm, loading]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoryAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories from server.');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      let filteredCategories = response.data || [];
      
      // Filter by search term
      if (searchTerm) {
        filteredCategories = filteredCategories.filter((category: Category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setCurrentView('edit');
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleAddProducts = (category: Category) => {
    setSelectedCategory(category);
    setShowAddProductsModal(true);
  };

  const handleAddProductsSuccess = () => {
    setShowAddProductsModal(false);
    setSelectedCategory(null);
    toast.success('Products added to category successfully');
    // Note: We don't need to refresh categories as the category list itself doesn't change
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      await categoryAPI.delete(selectedCategory._id);
      toast.success('Category deleted successfully');
      setShowDeleteModal(false);
      setSelectedCategory(null);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleCreateSuccess = () => {
    setCurrentView('list');
    fetchCategories(); // Refresh the list
  };

  const handleEditSuccess = () => {
    setCurrentView('list');
    setSelectedCategory(null);
    fetchCategories(); // Refresh the list
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedCategory(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#008C95] mx-auto mb-4" />
          <p className="text-[#888B8D]">Loading categories...</p>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#53565A] flex items-center gap-2 sm:gap-3">
                <FolderTree className="w-6 h-6 sm:w-8 sm:h-8 text-[#008C95]" />
                Manage Categories
              </h1>
              <p className="text-sm sm:text-base text-[#888B8D] mt-1">Create, edit, and organize your product categories</p>
            </div>
            
            <Button 
              onClick={() => setCurrentView('create')}
              className="bg-[#008C95] hover:bg-[#008C95]/90 w-full sm:w-auto"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
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
                  onClick={fetchCategories}
                  className="ml-auto text-red-600 hover:text-red-700 self-end sm:self-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Search Filter */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-[#008C95]" />
                Search Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D]" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by category name..."
                  className="pl-10 focus:border-[#008C95] focus:ring-[#008C95]/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories Table */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <CardTitle className="text-lg sm:text-xl">Categories ({categories.length})</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchCategories}
                  className="text-[#888B8D] hover:text-[#53565A] self-end sm:self-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-4">
                {categories.map((category) => (
                  <div key={category._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <FolderTree className="w-4 h-4 text-[#008C95] flex-shrink-0" />
                          <h3 className="font-semibold text-sm text-[#53565A] truncate">{category.name}</h3>
                        </div>
                        
                        <div className="flex items-center gap-1 mb-2">
                          {category.parent ? (
                            <>
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              <span className="text-xs text-blue-600 font-medium">Subcategory</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-xs text-green-600 font-medium">Root Category</span>
                            </>
                          )}
                        </div>

                        <div className="text-xs text-[#888B8D] space-y-1">
                          <div>Created: {formatDate(category.createdAt)}</div>
                          <div>Updated: {formatDate(category.updatedAt)}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddProducts(category)}
                          className="text-[#008C95] hover:text-[#008C95]/80 hover:bg-[#008C95]/10 p-1"
                          title="Add Products to Category"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                          className="text-[#0067A0] hover:text-[#0067A0]/80 hover:bg-[#0067A0]/10 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
                      <TableHead>Category Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category._id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FolderTree className="w-4 h-4 text-[#008C95]" />
                            <span className="font-semibold text-[#53565A]">{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {category.parent ? (
                              <>
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span className="text-sm text-blue-600 font-medium">Subcategory</span>
                              </>
                            ) : (
                              <>
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <span className="text-sm text-green-600 font-medium">Root Category</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-[#888B8D]">
                            {formatDate(category.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-[#888B8D]">
                            {formatDate(category.updatedAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddProducts(category)}
                              className="text-[#008C95] hover:text-[#008C95]/80 hover:bg-[#008C95]/10"
                              title="Add Products to Category"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                              className="text-[#0067A0] hover:text-[#0067A0]/80 hover:bg-[#0067A0]/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(category)}
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
              {categories.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <FolderTree className="w-12 h-12 sm:w-16 sm:h-16 text-[#888B8D] mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-[#53565A] mb-2">No categories found</h3>
                  <p className="text-sm sm:text-base text-[#888B8D] mb-4">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Create your first category to get started'}
                  </p>
                  <Button 
                    onClick={() => setCurrentView('create')}
                    className="bg-[#008C95] hover:bg-[#008C95]/90"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Category
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Create Category View */}
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
                ← Back to Categories
              </Button>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#008C95]/10 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-[#008C95]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#53565A]">Create New Category</h1>
                <p className="text-sm sm:text-base text-[#888B8D] mt-1">Add a new category to organize your products</p>
              </div>
            </div>
          </div>
          <CategoryForm onSuccess={handleCreateSuccess} />
        </div>
      )}

      {/* Edit Category View */}
      {currentView === 'edit' && selectedCategory && (
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
                ← Back to Categories
              </Button>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0067A0]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-[#0067A0]" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#53565A]">Edit Category</h1>
                <p className="text-sm sm:text-base text-[#888B8D] mt-1 truncate">Update details for "{selectedCategory.name}"</p>
              </div>
            </div>
          </div>
          <CategoryForm 
            editMode={true}
            categoryData={selectedCategory}
            onSuccess={handleEditSuccess}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Products to Category Modal */}
      {selectedCategory && (
        <AddProductsToCategory 
          isOpen={showAddProductsModal}
          onClose={() => setShowAddProductsModal(false)}
          category={selectedCategory}
          onSuccess={handleAddProductsSuccess}
        />
      )}
    </div>
  );
};

export default ManageCategories;
