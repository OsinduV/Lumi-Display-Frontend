import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PriceDisplay from "@/components/ui/PriceDisplay";
import QuickLogin from "@/components/auth/QuickLogin";
import AddToCartModal from "@/components/cart/AddToCartModal";
import { useAuth } from "@/contexts/AuthContext";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  Star, 
  Zap, 
  Tag as TagIcon,
  FileText,
  Palette,
  Ruler,
  Download,
  ExternalLink,
  ArrowLeft,
  ShoppingCart
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  modelCode?: string;
  description?: string;
  features?: string[];
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
  specialPrice?: number;
  isSpecialPriceActive: boolean;
  images: string[];
  specSheets?: string[];
  tags: Array<{
    _id: string;
    name: string;
  }>;
  sizes?: string[];
  colors?: string[];
  shapes?: string[];
  types?: string[];
  redistributionPrice?: number;
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  brands?: Array<{
    _id: string;
    name: string;
    image?: string;
  }>;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  isOpen, 
  onClose,
  brands = []
}) => {
  const { canViewPrices } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isQuickLoginOpen, setIsQuickLoginOpen] = useState(false);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  // Handle escape key press and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const getDisplayPrice = () => {
    if (product.isSpecialPriceActive && product.specialPrice) {
      return product.specialPrice;
    }
    return product.price || product.mrp || 0;
  };

  const getOriginalPrice = () => {
    if (product.isSpecialPriceActive && product.specialPrice && product.price) {
      return product.price;
    }
    return product.mrp;
  };

  const hasDiscount = product.isSpecialPriceActive && getOriginalPrice();

  const productImages = product.images?.filter(img => img && img !== '/placeholder-product.jpg') || [];
  const hasImages = productImages.length > 0;

  const nextImage = () => {
    if (hasImages && currentImageIndex < productImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (hasImages) {
      setCurrentImageIndex(0);
    }
  };

  const prevImage = () => {
    if (hasImages && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (hasImages) {
      setCurrentImageIndex(productImages.length - 1);
    }
  };

  const getBrandInfo = () => {
    return brands?.find(b => b._id === product.brand?._id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      {/* Full Screen Container */}
      <div className="h-full w-full overflow-auto">
        <div className="min-h-full bg-gray-50">
          
          {/* Top Navigation Bar */}
          <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="flex items-center space-x-2 text-[#53565A] hover:text-[#FF9E1B]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Catalog</span>
                </Button>
                
                <div className="flex items-center space-x-3">
                  {product.specSheets && product.specSheets.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(product.specSheets![0], '_blank')}
                      className="text-[#0067A0] border-[#0067A0] hover:bg-[#0067A0] hover:text-white"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">View Spec Sheet</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Left Side - Image Gallery */}
              <div className="space-y-6">
                {/* Main Image */}
                <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="aspect-square flex items-center justify-center p-8">
                    {hasImages ? (
                      <>
                        <img 
                          src={productImages[currentImageIndex]} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgMTI1SDE3NVYxNzVIMTI1VjEyNVoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==';
                          }}
                        />
                        
                        {/* Image Navigation */}
                        {productImages.length > 1 && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                            
                            {/* Image Counter */}
                            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                              {currentImageIndex + 1} / {productImages.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Package className="w-24 h-24 mb-4" />
                        <p className="text-lg">No image available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {hasImages && productImages.length > 1 && (
                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          currentImageIndex === index 
                            ? 'border-[#FF9E1B] shadow-lg scale-105' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side - Product Details */}
              <div className="space-y-8">
                
                {/* Product Header */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-[#53565A] mb-4 leading-tight">
                    {product.name}
                  </h1>
                  {product.modelCode && (
                    <p className="text-lg text-[#888B8D] font-medium">Model: {product.modelCode}</p>
                  )}
                </div>

                {/* Brand & Category */}
                <div className="flex flex-wrap gap-4">
                  {product.brand && (
                    <div className="flex items-center space-x-3 px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center overflow-hidden">
                        {getBrandInfo()?.image ? (
                          <img 
                            src={getBrandInfo()?.image} 
                            alt={product.brand.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-sm text-gray-500 font-bold">
                            {product.brand.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-[#53565A] text-lg">{product.brand.name}</span>
                    </div>
                  )}
                  {product.category && (
                    <Badge variant="outline" className="text-[#0067A0] border-[#0067A0] px-4 py-2 text-base">
                      {product.category.name}
                    </Badge>
                  )}
                </div>

                {/* Pricing Section */}
                {canViewPrices ? (
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <PriceDisplay 
                      product={product}
                      showPrice={canViewPrices}
                      size="large"
                      className=""
                    />
                    {canViewPrices && hasDiscount && (
                      <div className="flex items-center space-x-4 text-base mt-3">
                        <span className="text-green-600 font-semibold">
                          You save Rs. {(getOriginalPrice()! - getDisplayPrice()).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {canViewPrices && product.redistributionPrice && (
                      <div className="text-[#888B8D] mt-3">
                        <span className="font-medium">Redistribution Price:</span> Rs. {product.redistributionPrice.toLocaleString()}
                      </div>
                    )}
                    
                    {/* Add to Cart Button */}
                    <div className="mt-4">
                      <Button
                        onClick={() => setIsAddToCartModalOpen(true)}
                        className="w-full bg-[#FF9E1B] hover:bg-[#FF9E1B]/90 text-white font-semibold py-3 text-lg"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="text-right">
                      <Button 
                        onClick={() => setIsQuickLoginOpen(true)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        View Prices
                      </Button>
                    </div>
                  </div>
                )}

                <Separator className="my-8" />

                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className="text-xl font-semibold text-[#53565A] mb-4">Product Description</h3>
                    <p className="text-[#888B8D] leading-relaxed text-base">{product.description}</p>
                  </div>
                )}

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-[#53565A] mb-4 flex items-center">
                      <Star className="w-6 h-6 mr-3 text-[#FF9E1B]" />
                      Key Features
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white border border-gray-200">
                          <Zap className="w-5 h-5 text-[#FF9E1B] mt-0.5 flex-shrink-0" />
                          <span className="text-[#53565A]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-[#53565A] mb-4 flex items-center">
                      <TagIcon className="w-6 h-6 mr-3 text-[#0067A0]" />
                      Product Tags
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.tags.map((tag) => (
                        <Badge key={tag._id} variant="secondary" className="px-4 py-2 text-base hover:bg-[#0067A0] hover:text-white transition-colors cursor-pointer">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Variants */}
                {((product.sizes && product.sizes.length > 0) || 
                  (product.colors && product.colors.length > 0) || 
                  (product.shapes && product.shapes.length > 0) ||
                  (product.types && product.types.length > 0)) && (
                  <div>
                    <h3 className="text-xl font-semibold text-[#53565A] mb-4 flex items-center">
                      <Palette className="w-6 h-6 mr-3 text-[#008C95]" />
                      Available Variants
                    </h3>
                    <div className="space-y-6">
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center space-x-3 mb-3">
                            <Ruler className="w-5 h-5 text-[#888B8D]" />
                            <span className="font-medium text-[#53565A] text-lg">Available Sizes:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size, index) => (
                              <Badge key={index} variant="outline" className="px-3 py-1 text-base">
                                {size}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {product.colors && product.colors.length > 0 && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center space-x-3 mb-3">
                            <Palette className="w-5 h-5 text-[#888B8D]" />
                            <span className="font-medium text-[#53565A] text-lg">Available Colors:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {product.colors.map((color, index) => (
                              <Badge key={index} variant="outline" className="px-3 py-1 text-base">
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {product.shapes && product.shapes.length > 0 && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center space-x-3 mb-3">
                            <Package className="w-5 h-5 text-[#888B8D]" />
                            <span className="font-medium text-[#53565A] text-lg">Available Shapes:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {product.shapes.map((shape, index) => (
                              <Badge key={index} variant="outline" className="px-3 py-1 text-base">
                                {shape}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {product.types && product.types.length > 0 && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center space-x-3 mb-3">
                            <Package className="w-5 h-5 text-[#888B8D]" />
                            <span className="font-medium text-[#53565A] text-lg">Available Types:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {product.types.map((type, index) => (
                              <Badge key={index} variant="outline" className="px-3 py-1 text-base">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Specification Sheets */}
                {product.specSheets && product.specSheets.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-[#53565A] mb-4 flex items-center">
                      <FileText className="w-6 h-6 mr-3 text-[#0067A0]" />
                      Technical Documentation
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.specSheets.map((sheet, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start h-auto p-4 hover:bg-[#0067A0] hover:text-white transition-all"
                          onClick={() => window.open(sheet, '_blank')}
                        >
                          <div className="flex items-center space-x-3">
                            <Download className="w-6 h-6" />
                            <div className="text-left">
                              <div className="font-medium text-base">Spec Sheet {index + 1}</div>
                              <div className="text-sm opacity-70">Download PDF</div>
                            </div>
                            <ExternalLink className="w-5 h-5 ml-auto" />
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Login Modal */}
        <QuickLogin 
          isOpen={isQuickLoginOpen}
          onClose={() => setIsQuickLoginOpen(false)}
        />

        {/* Add to Cart Modal */}
        <AddToCartModal
          product={product}
          isOpen={isAddToCartModalOpen}
          onClose={() => setIsAddToCartModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default ProductDetailModal;
