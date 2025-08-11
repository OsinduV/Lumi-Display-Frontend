import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Filter,
  RefreshCw,
  Tag,
  AlertCircle
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
import { tagAPI } from "@/api";
import TagForm from "./TagForm";
import toast from 'react-hot-toast';

interface TagType {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const ManageTags: React.FC = () => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  
  // View states
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchFilteredTags();
    }
  }, [searchTerm, loading]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tagAPI.getAll();
      setTags(response.data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setError('Failed to load tags from server.');
      toast.error('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredTags = async () => {
    try {
      const response = await tagAPI.getAll();
      let filteredTags = response.data || [];
      
      // Filter by search term
      if (searchTerm) {
        filteredTags = filteredTags.filter((tag: TagType) =>
          tag.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setTags(filteredTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to fetch tags');
    }
  };

  const handleEdit = (tag: TagType) => {
    setSelectedTag(tag);
    setCurrentView('edit');
  };

  const handleDelete = (tag: TagType) => {
    setSelectedTag(tag);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedTag) return;
    
    try {
      await tagAPI.delete(selectedTag._id);
      toast.success('Tag deleted successfully');
      setShowDeleteModal(false);
      setSelectedTag(null);
      fetchTags(); // Refresh the list
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete tag');
    }
  };

  const handleCreateSuccess = () => {
    setCurrentView('list');
    fetchTags(); // Refresh the list
  };

  const handleEditSuccess = () => {
    setCurrentView('list');
    setSelectedTag(null);
    fetchTags(); // Refresh the list
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedTag(null);
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
          <RefreshCw className="w-8 h-8 animate-spin text-[#0067A0] mx-auto mb-4" />
          <p className="text-[#888B8D]">Loading tags...</p>
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
                <Tag className="w-6 h-6 sm:w-8 sm:h-8 text-[#0067A0]" />
                Manage Tags
              </h1>
              <p className="text-sm sm:text-base text-[#888B8D] mt-1">Create, edit, and organize your product tags</p>
            </div>
            
            <Button 
              onClick={() => setCurrentView('create')}
              className="bg-[#0067A0] hover:bg-[#0067A0]/90 w-full sm:w-auto"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Tag
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
                  onClick={fetchTags}
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#0067A0]" />
                Search Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888B8D]" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by tag name..."
                  className="pl-10 focus:border-[#0067A0] focus:ring-[#0067A0]/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tags ({tags.length})</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchTags}
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
                      <TableHead>Tag Name</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tags.map((tag) => (
                      <TableRow key={tag._id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-[#0067A0]/10 rounded-full flex items-center justify-center">
                              <Tag className="w-3 h-3 text-[#0067A0]" />
                            </div>
                            <span className="font-semibold text-[#53565A]">{tag.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-[#888B8D]">
                            {formatDate(tag.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-[#888B8D]">
                            {formatDate(tag.updatedAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(tag)}
                              className="text-[#0067A0] hover:text-[#0067A0]/80 hover:bg-[#0067A0]/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(tag)}
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
              {tags.length === 0 && (
                <div className="text-center py-12">
                  <Tag className="w-16 h-16 text-[#888B8D] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#53565A] mb-2">No tags found</h3>
                  <p className="text-[#888B8D] mb-4">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Create your first tag to get started'}
                  </p>
                  <Button 
                    onClick={() => setCurrentView('create')}
                    className="bg-[#0067A0] hover:bg-[#0067A0]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Tag
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Create Tag View */}
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
                ← Back to Tags
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#0067A0]/10 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-[#0067A0]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#53565A]">Create New Tag</h1>
                <p className="text-[#888B8D] mt-1">Add a new tag to categorize your products</p>
              </div>
            </div>
          </div>
          <TagForm onSuccess={handleCreateSuccess} />
        </div>
      )}

      {/* Edit Tag View */}
      {currentView === 'edit' && selectedTag && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                onClick={handleBackToList}
                className="text-[#53565A] hover:text-[#53565A]/80"
              >
                ← Back to Tags
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#0067A0]/10 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-[#0067A0]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#53565A]">Edit Tag</h1>
                <p className="text-[#888B8D] mt-1">Update details for "{selectedTag.name}"</p>
              </div>
            </div>
          </div>
          <TagForm 
            editMode={true}
            tagData={selectedTag}
            onSuccess={handleEditSuccess}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedTag?.name}"? This action cannot be undone and may affect products associated with this tag.
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
              Delete Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageTags;
