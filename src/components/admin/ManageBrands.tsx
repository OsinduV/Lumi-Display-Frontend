import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Filter,
  RefreshCw,
  Award,
  AlertCircle,
  ImageIcon
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
import { brandAPI } from "@/api";
import BrandForm from "@/components/admin/BrandForm";
import toast from 'react-hot-toast';

interface Brand {
  _id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

const ManageBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  
  // View states
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchFilteredBrands();
    }
  }, [searchTerm, loading]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await brandAPI.getAll();
      setBrands(response.data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setError('Failed to load brands from server.');
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredBrands = async () => {
    try {
      const response = await brandAPI.getAll();
      let filteredBrands = response.data || [];
      
      // Filter by search term
      if (searchTerm) {
        filteredBrands = filteredBrands.filter((brand: Brand) =>
          brand.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setBrands(filteredBrands);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to fetch brands');
    }
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setCurrentView('edit');
  };

  const handleDelete = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedBrand) return;
    
    try {
      await brandAPI.delete(selectedBrand._id);
      toast.success('Brand deleted successfully');
      setShowDeleteModal(false);
      setSelectedBrand(null);
      fetchBrands(); // Refresh the list
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Failed to delete brand');
    }
  };

  const handleCreateSuccess = () => {
    setCurrentView('list');
    fetchBrands(); // Refresh the list
  };

  const handleEditSuccess = () => {
    setCurrentView('list');
    setSelectedBrand(null);
    fetchBrands(); // Refresh the list
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedBrand(null);
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
          <RefreshCw className="w-8 h-8 animate-spin text-[#FF9E1B] mx-auto mb-4" />
          <p className="text-[#888B8D]">Loading brands...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Render different views based on currentView state */}
      {currentView === 'list' && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#53565A] flex items-center gap-3">
                <Award className="w-8 h-8 text-[#FF9E1B]" />
                Manage Brands
              </h1>
              <p className="text-[#888B8D] mt-1">Create, edit, and organize your product brands</p>
            </div>
            
            <Button 
              onClick={() => setCurrentView('create')}
              className="bg-[#FF9E1B] hover:bg-[#FF9E1B]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Brand
            </Button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-sm text-red-800">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchBrands}
                  className="ml-auto text-red-600 hover:text-red-700"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Search Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#FF9E1B]" />
                Search Brands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D]" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by brand name..."
                  className="pl-10 focus:border-[#FF9E1B] focus:ring-[#FF9E1B]/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Brands Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Brands ({brands.length})</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchBrands}
                  className="text-[#888B8D] hover:text-[#53565A]"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Brand Name</TableHead>
                      <TableHead>Logo</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brands.map((brand) => (
                      <TableRow key={brand._id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-[#FF9E1B]" />
                            <span className="font-semibold text-[#53565A]">{brand.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {brand.image ? (
                              <img 
                                src={brand.image} 
                                alt={brand.name} 
                                className="w-8 h-8 object-contain rounded border"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center">
                                <ImageIcon className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                            <span className="text-sm text-[#888B8D]">
                              {brand.image ? 'Has Logo' : 'No Logo'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-[#888B8D]">
                            {formatDate(brand.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-[#888B8D]">
                            {formatDate(brand.updatedAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(brand)}
                              className="text-[#0067A0] hover:text-[#0067A0]/80 hover:bg-[#0067A0]/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(brand)}
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
              {brands.length === 0 && (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-[#888B8D] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#53565A] mb-2">No brands found</h3>
                  <p className="text-[#888B8D] mb-4">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Create your first brand to get started'}
                  </p>
                  <Button 
                    onClick={() => setCurrentView('create')}
                    className="bg-[#FF9E1B] hover:bg-[#FF9E1B]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Brand
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Create Brand View */}
      {currentView === 'create' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                onClick={handleBackToList}
                className="text-[#53565A] hover:text-[#53565A]/80"
              >
                ← Back to Brands
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF9E1B]/10 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-[#FF9E1B]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#53565A]">Create New Brand</h1>
                <p className="text-[#888B8D] mt-1">Add a new brand to organize your products</p>
              </div>
            </div>
          </div>
          <BrandForm onSuccess={handleCreateSuccess} />
        </div>
      )}

      {/* Edit Brand View */}
      {currentView === 'edit' && selectedBrand && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                onClick={handleBackToList}
                className="text-[#53565A] hover:text-[#53565A]/80"
              >
                ← Back to Brands
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#0067A0]/10 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-[#0067A0]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#53565A]">Edit Brand</h1>
                <p className="text-[#888B8D] mt-1">Update details for "{selectedBrand.name}"</p>
              </div>
            </div>
          </div>
          <BrandForm 
            editMode={true}
            brandData={selectedBrand}
            onSuccess={handleEditSuccess}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Brand</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedBrand?.name}"? This action cannot be undone and may affect products associated with this brand.
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
              Delete Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageBrands;
