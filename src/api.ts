import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Product API endpoints
export const productAPI = {
  // Get all products with optional filters and pagination
  getAllProducts: (params?: {
    search?: string;
    category?: string;
    brand?: string;
    tags?: string; // Changed from 'tags' to match backend expectation
    minPrice?: number;
    maxPrice?: number;
    specialOnly?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }) => api.get('/products', { params }),
  
  // Get single product by ID
  getProductById: (id: string) => api.get(`/products/${id}`),
  
  // Create new product
  createProduct: (productData: any) => api.post('/products', productData),
  
  // Update product
  updateProduct: (id: string, productData: any) => api.put(`/products/${id}`, productData),
  
  // Delete product
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  
  // Bulk operations
  bulkCreateProducts: (products: any[]) => api.post('/products/bulk', { products }),
  bulkUpdateProducts: (updates: any[]) => api.put('/products/bulk', { updates }),
};

// Category API endpoints
export const categoryAPI = {
  getAll: (params?: { includeHierarchy?: string }) => api.get('/categories', { params }),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
  getParents: () => api.get('/categories/parents'),
  getTree: () => api.get('/categories/tree'),
  getSubcategories: (parentId: string) => api.get(`/categories/${parentId}/subcategories`),
};

// Brand API endpoints
export const brandAPI = {
  getAll: () => api.get('/brands'),
  getById: (id: string) => api.get(`/brands/${id}`),
  create: (data: any) => api.post('/brands', data),
  createWithImage: (formData: FormData) => api.post('/brands/with-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: string, data: any) => api.put(`/brands/${id}`, data),
  updateWithImage: (id: string, formData: FormData) => api.put(`/brands/${id}/with-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: string) => api.delete(`/brands/${id}`),
};

// Tag API endpoints (for future use)
export const tagAPI = {
  getAll: () => api.get('/tags'),
  getById: (id: string) => api.get(`/tags/${id}`),
  create: (data: any) => api.post('/tags', data),
  update: (id: string, data: any) => api.put(`/tags/${id}`, data),
  delete: (id: string) => api.delete(`/tags/${id}`),
};

// Upload API endpoints
export const uploadAPI = {
  // Upload product images (multiple files)
  uploadProductImages: (formData: FormData) => 
    api.post('/upload/product-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Upload spec sheets (multiple files)
  uploadSpecSheets: (formData: FormData) => 
    api.post('/upload/spec-sheets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Upload brand image (single file)
  uploadBrandImage: (formData: FormData) => 
    api.post('/upload/brand-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Delete file from Cloudinary
  deleteFile: (publicId: string, resourceType = 'image') => 
    api.delete(`/upload/delete/${publicId}?resource_type=${resourceType}`),
};

export default api;
