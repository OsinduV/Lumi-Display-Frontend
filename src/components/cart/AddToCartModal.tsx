import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Minus, Plus, ShoppingCart, Package, Palette, Ruler } from 'lucide-react';
import type { Product } from '../catalog/components/types';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ isOpen, onClose, product }) => {
  const { addToCart, isInCart, getCartItem } = useCart();
  const { canViewPrices } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{
    size?: string;
    color?: string;
    shape?: string;
    type?: string;
  }>({});

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSelectedVariants({});
    }
  }, [isOpen, product]);

  // Return early after hooks are called
  if (!product) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Cart</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-500">No product selected</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getDisplayPrice = () => {
    if (product.isSpecialPriceActive && product.specialPrice) {
      return product.specialPrice;
    }
    return product.price || product.mrp || 0;
  };

  const handleVariantChange = (variantType: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantType]: value
    }));
  };

  const removeVariant = (variantType: string) => {
    setSelectedVariants(prev => {
      const updated = { ...prev };
      delete updated[variantType as keyof typeof updated];
      return updated;
    });
  };

  const handleAddToCart = () => {
    if (!canViewPrices) {
      alert('Please login to add items to cart');
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      modelCode: product.modelCode,
      brand: product.brand,
      category: product.category,
      price: product.price,
      mrp: product.mrp,
      specialPrice: product.specialPrice,
      isSpecialPriceActive: product.isSpecialPriceActive,

      image: product.images?.[0],
      quantity,
      selectedVariants
    };

    addToCart(cartItem);
    onClose();
  };

  const isItemInCart = isInCart(product._id, selectedVariants);
  const existingCartItem = getCartItem(product._id, selectedVariants);

  const hasVariants = (product.sizes && product.sizes.length > 0) ||
                     (product.colors && product.colors.length > 0) ||
                     (product.shapes && product.shapes.length > 0) ||
                     (product.types && product.types.length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-[#FF9E1B]" />
            <span>Add to Cart</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex space-x-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {product.images?.[0] && product.images[0] !== '/placeholder-product.jpg' ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';
                  }}
                />
              ) : (
                <Package className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-[#53565A]">{product.name}</h3>
              {product.modelCode && (
                <p className="text-sm text-[#888B8D]">Model: {product.modelCode}</p>
              )}
              {product.brand && (
                <p className="text-sm text-[#888B8D]">Brand: {product.brand.name}</p>
              )}
              {canViewPrices && (
                <div className="mt-2">
                  <span className="text-2xl font-bold text-[#53565A]">
                    Rs. {getDisplayPrice().toLocaleString()}
                  </span>
                  {product.isSpecialPriceActive && product.price && product.specialPrice && product.price > product.specialPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      Rs. {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Variant Selection */}
          {hasVariants && (
            <div className="space-y-4">
              <h4 className="font-medium text-[#53565A]">Select Options:</h4>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-[#53565A] mb-2 flex items-center">
                    <Ruler className="w-4 h-4 mr-1" />
                    Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedVariants.size === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVariantChange('size', size)}
                        className={selectedVariants.size === size ? "bg-[#FF9E1B] hover:bg-[#FF9E1B]/90" : ""}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-[#53565A] mb-2 flex items-center">
                    <Palette className="w-4 h-4 mr-1" />
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedVariants.color === color ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVariantChange('color', color)}
                        className={selectedVariants.color === color ? "bg-[#FF9E1B] hover:bg-[#FF9E1B]/90" : ""}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Shape Selection */}
              {product.shapes && product.shapes.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-[#53565A] mb-2 flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    Shape
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.shapes.map((shape) => (
                      <Button
                        key={shape}
                        variant={selectedVariants.shape === shape ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVariantChange('shape', shape)}
                        className={selectedVariants.shape === shape ? "bg-[#FF9E1B] hover:bg-[#FF9E1B]/90" : ""}
                      >
                        {shape}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Type Selection */}
              {product.types && product.types.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-[#53565A] mb-2 flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.types.map((type) => (
                      <Button
                        key={type}
                        variant={selectedVariants.type === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVariantChange('type', type)}
                        className={selectedVariants.type === type ? "bg-[#FF9E1B] hover:bg-[#FF9E1B]/90" : ""}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Variants Display */}
              {Object.keys(selectedVariants).length > 0 && (
                <div>
                  <p className="text-sm font-medium text-[#53565A] mb-2">Selected Options:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedVariants).map(([key, value]) => (
                      <Badge
                        key={key}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <span className="capitalize">{key}: {value}</span>
                        <button
                          onClick={() => removeVariant(key)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-medium text-[#53565A] mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center"
                min="1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Total Price */}
          {canViewPrices && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#53565A]">Total:</span>
                <span className="text-xl font-bold text-[#53565A]">
                  Rs. {(getDisplayPrice() * quantity).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Current Cart Status */}
          {isItemInCart && existingCartItem && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                This item is already in your cart with quantity: {existingCartItem.quantity}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Adding will increase the total quantity to {existingCartItem.quantity + quantity}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={!canViewPrices}
              className="flex-1 bg-[#FF9E1B] hover:bg-[#FF9E1B]/90"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>

          {!canViewPrices && (
            <p className="text-sm text-center text-gray-500">
              Please login to add items to cart and view prices
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartModal;
