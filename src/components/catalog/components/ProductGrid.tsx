import React from 'react';
import { Package2, Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PriceDisplay from '@/components/ui/PriceDisplay';
import type { Product, Brand } from './types';

interface ProductGridProps {
  products: Product[];
  brands: Brand[];
  canViewPrices: boolean;
  onViewProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  brands,
  canViewPrices,
  onViewProduct,
  onAddToCart
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {products.map((product) => (
        <Card key={product._id} className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-3 flex-1 flex flex-col">
              {/* Product Image */}
              <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {product.images && product.images.length > 0 && product.images[0] !== '/placeholder-product.jpg' ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA2MEgxMzJWMTMySDYwVjYwWiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJtNzIgOTAgMTIgMTIgMzAtMzAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHN2Zz4K';
                    }}
                  />
                ) : (
                  <Package2 className="w-8 h-8 text-[#888B8D]" />
                )}
              </div>
              
              {/* Product Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-[#53565A] mb-1 text-sm line-clamp-2">
                  {product.name}
                </h3>
                {product.modelCode && (
                  <p className="text-xs text-[#888B8D]">Model: {product.modelCode}</p>
                )}
              </div>
              
              {/* Brand & Category */}
              <div className="flex justify-between items-center">
                {product.brand ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-50 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
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
                    <span className="text-xs text-[#53565A] font-medium truncate">
                      {product.brand.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-400">?</span>
                    </div>
                    <span className="text-xs text-gray-400">No Brand</span>
                  </div>
                )}
                <span className="text-xs text-[#888B8D] truncate">
                  {product.category?.name || 'No Category'}
                </span>
              </div>
              
              {/* Price */}
              {canViewPrices && (
                <PriceDisplay 
                  product={product}
                  showPrice={canViewPrices}
                  size="medium"
                  className=""
                />
              )}
              
              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
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
              
              {/* Action Buttons */}
              <div className="mt-auto space-y-2">
                <Button
                  className="w-full bg-[#0067A0] hover:bg-[#0067A0]/90 text-sm"
                  size="sm"
                  onClick={() => onViewProduct(product)}
                >
                  <Eye className="w-3 h-3 mr-2" />
                  View Details
                </Button>
                {canViewPrices && onAddToCart && (
                  <Button
                    variant="outline"
                    className="w-full border-[#FF9E1B] text-[#FF9E1B] hover:bg-[#FF9E1B] hover:text-white text-sm"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                  >
                    <ShoppingCart className="w-3 h-3 mr-2" />
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
