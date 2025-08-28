export interface Product {
  _id: string;
  name: string;
  modelCode?: string;
  brand?: {
    _id: string;
    name: string;
    image?: string;
  };
  category?: {
    _id: string;
    name: string;
  };
  price?: number;
  mrp?: number;
  discountedPrice?: number;
  minimumPrice?: number;
  activePriceType: 'price' | 'mrp' | 'discountedPrice' | 'minimumPrice';
  images: string[];
  tags: Array<{
    _id: string;
    name: string;
  }>;
  sizes?: string[];
  colors?: string[];
  shapes?: string[];
  types?: string[];
}

export interface Category {
  _id: string;
  name: string;
  parent?: {
    _id: string;
    name: string;
  };
  level?: number;
  subcategories?: Category[];
}

export interface Brand {
  _id: string;
  name: string;
  image?: string;
}

export type SortField = 'name' | 'price' | 'brand' | 'category';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'table' | 'grid';

export interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  selectedBrand: string;
  selectedTag: string;
  selectedTagName: string;
  sortBy: SortField;
  sortOrder: SortOrder;
  viewMode: ViewMode;
  page: number;
  limit: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
}
