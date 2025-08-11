import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Download, 
  Package
} from 'lucide-react';
import { generateCartPDF } from '../../utils/cartPdfGenerator';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartItemCount 
  } = useCart();
  const { canViewPrices } = useAuth();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const getDisplayPrice = (item: any) => {
    if (item.isSpecialPriceActive && item.specialPrice) {
      return item.specialPrice;
    }
    return item.price || item.mrp || 0;
  };

  const getVariantString = (variants: any) => {
    const variantArray = Object.entries(variants)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`);
    
    return variantArray.length > 0 ? variantArray.join(', ') : null;
  };

  const handleGeneratePDF = async () => {
    if (items.length === 0) return;
    
    setIsGeneratingPDF(true);
    try {
      await generateCartPDF({
        items,
        total: getCartTotal(),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!canViewPrices) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cart</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Please login to view your cart</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-[#FF9E1B]" />
            <span>Cart ({getCartItemCount()} items)</span>
          </DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-400">Add some products to get started</p>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex space-x-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden border">
                      {item.image && item.image !== '/placeholder-product.jpg' ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';
                          }}
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-semibold text-[#53565A]">{item.name}</h3>
                        {item.modelCode && (
                          <p className="text-sm text-[#888B8D]">Model: {item.modelCode}</p>
                        )}
                        {item.brand && (
                          <p className="text-sm text-[#888B8D]">Brand: {item.brand.name}</p>
                        )}
                      </div>

                      {/* Variants */}
                      {getVariantString(item.selectedVariants) && (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(item.selectedVariants)
                            .filter(([_, value]) => value)
                            .map(([key, value]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key}: {value}
                              </Badge>
                            ))}
                        </div>
                      )}

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-[#53565A]">
                            Rs. {getDisplayPrice(item).toLocaleString()}
                          </span>
                          {item.isSpecialPriceActive && item.price && item.specialPrice && item.price > item.specialPrice && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              Rs. {item.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <span className="text-sm text-[#888B8D]">
                          Subtotal: Rs. {(getDisplayPrice(item) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Cart Summary */}
            <div className="flex-shrink-0 space-y-4 py-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-[#53565A]">Total:</span>
                <span className="text-2xl font-bold text-[#53565A]">
                  Rs. {getCartTotal().toLocaleString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex-1"
                  disabled={items.length === 0}
                >
                  Clear Cart
                </Button>
                <Button
                  onClick={handleGeneratePDF}
                  disabled={items.length === 0 || isGeneratingPDF}
                  className="flex-1 bg-[#FF9E1B] hover:bg-[#FF9E1B]/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGeneratingPDF ? 'Generating...' : 'Export PDF'}
                </Button>
              </div>

              <p className="text-xs text-center text-gray-500">
                PDF will include all items with prices and total amount
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
