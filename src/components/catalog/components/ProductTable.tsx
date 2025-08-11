import React from 'react';
import { Package2, Eye, SortAsc, SortDesc, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import PriceDisplay from '@/components/ui/PriceDisplay';
import type { Product, Brand, SortField, SortOrder } from './types';

interface ProductTableProps {
  products: Product[];
  brands: Brand[];
  canViewPrices: boolean;
  selectedBrand?: string;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onViewProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  brands,
  canViewPrices,
  selectedBrand,
  sortBy,
  sortOrder,
  onSort,
  onViewProduct,
  onAddToCart
}) => {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? 
      <SortAsc className="w-4 h-4 ml-1" /> : 
      <SortDesc className="w-4 h-4 ml-1" />;
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12 lg:w-16 font-semibold text-[#53565A] text-xs lg:text-sm sticky left-0 bg-gray-50">
                Image
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 transition-colors min-w-[180px] max-w-[250px]"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center font-semibold text-[#53565A] text-xs lg:text-sm">
                  Product Name
                  <SortIcon field="name" />
                </div>
              </TableHead>
              {!selectedBrand && (
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors min-w-[100px] max-w-[140px] hidden sm:table-cell"
                  onClick={() => onSort('brand')}
                >
                  <div className="flex items-center font-semibold text-[#53565A] text-xs lg:text-sm">
                    Brand
                    <SortIcon field="brand" />
                  </div>
                </TableHead>
              )}
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 transition-colors min-w-[100px] max-w-[140px] hidden md:table-cell"
                onClick={() => onSort('category')}
              >
                <div className="flex items-center font-semibold text-[#53565A] text-xs lg:text-sm">
                  Category
                  <SortIcon field="category" />
                </div>
              </TableHead>
              {canViewPrices && (
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors min-w-[80px] max-w-[120px]"
                  onClick={() => onSort('price')}
                >
                  <div className="flex items-center font-semibold text-[#53565A] text-xs lg:text-sm">
                    Price (Rs.)
                    <SortIcon field="price" />
                  </div>
                </TableHead>
              )}
              <TableHead className="text-center font-semibold text-[#53565A] text-xs lg:text-sm w-20 lg:w-24">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow 
                key={product._id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <TableCell className="p-2 lg:p-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 && product.images[0] !== '/placeholder-product.jpg' ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0ibTI0IDMwIDQgNCAxMC0xMCIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                        }}
                      />
                    ) : (
                      <Package2 className="w-6 h-6 lg:w-8 lg:h-8 text-[#888B8D]" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="p-2 lg:p-4 min-w-[180px] max-w-[250px]">
                  <div className="space-y-1">
                    <div className="font-semibold text-[#53565A] text-sm lg:text-base break-words line-clamp-2">
                      {product.name}
                    </div>
                    {product.modelCode && (
                      <div className="text-xs lg:text-sm text-[#888B8D] break-words">Model: {product.modelCode}</div>
                    )}
                    {/* Show brand and category on mobile when columns are hidden */}
                    <div className="sm:hidden space-y-1">
                      {product.brand && (
                        <div className="text-xs text-[#888B8D] break-words">Brand: {product.brand.name}</div>
                      )}
                      <div className="text-xs text-[#888B8D] break-words">
                        Category: {product.category?.name || 'No Category'}
                      </div>
                    </div>
                    {product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.tags.slice(0, 2).map(tag => (
                          <Badge key={tag._id} variant="secondary" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                        {product.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{product.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                {!selectedBrand && (
                  <TableCell className="p-2 lg:p-4 hidden sm:table-cell min-w-[100px] max-w-[140px]">
                    {product.brand ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-50 rounded border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {brands.find(b => b._id === product.brand?._id)?.image ? (
                            <img 
                              src={brands.find(b => b._id === product.brand?._id)?.image} 
                              alt={product.brand.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                if (target.nextElementSibling) {
                                  (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div 
                            className="w-full h-full flex items-center justify-center text-[#888B8D] font-bold text-xs"
                            style={{ display: brands.find(b => b._id === product.brand?._id)?.image ? 'none' : 'flex' }}
                          >
                            {product.brand.name.charAt(0)}
                          </div>
                        </div>
                        <span className="text-xs lg:text-sm text-[#53565A] font-medium break-words line-clamp-2 min-w-0">
                          {product.brand.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-gray-400">?</span>
                        </div>
                        <span className="text-xs lg:text-sm text-gray-400 break-words">No Brand</span>
                      </div>
                    )}
                  </TableCell>
                )}
                <TableCell className="p-2 lg:p-4 hidden md:table-cell min-w-[100px] max-w-[140px]">
                  <span className="text-xs lg:text-sm text-[#53565A] font-medium break-words line-clamp-2">
                    {product.category?.name || 'No Category'}
                  </span>
                </TableCell>
                {canViewPrices && (
                  <TableCell className="p-2 lg:p-4 min-w-[80px] max-w-[120px]">
                    <PriceDisplay 
                      product={product}
                      showPrice={canViewPrices}
                      size="small"
                      className=""
                    />
                  </TableCell>
                )}
                <TableCell className="text-center p-2 lg:p-4 w-20 lg:w-24">
                  <div className="flex flex-col sm:flex-row gap-1 items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewProduct(product)}
                      className="text-[#0067A0] hover:text-[#0067A0]/80 hover:bg-[#0067A0]/10 text-xs lg:text-sm"
                    >
                      <Eye className="w-3 h-3 lg:w-4 lg:h-4 lg:mr-1" />
                      <span className="hidden lg:inline">View</span>
                    </Button>
                    {canViewPrices && onAddToCart && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="text-[#FF9E1B] hover:text-[#FF9E1B]/80 hover:bg-[#FF9E1B]/10 text-xs lg:text-sm"
                      >
                        <ShoppingCart className="w-3 h-3 lg:w-4 lg:h-4 lg:mr-1" />
                        <span className="hidden lg:inline">Add</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    </div>
  );
};

export default ProductTable;
