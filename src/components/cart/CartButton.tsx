import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartModal from './CartModal';

const CartButton: React.FC = () => {
  const { getCartItemCount } = useCart();
  const { canViewPrices } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (!canViewPrices) {
    return null;
  }

  const itemCount = getCartItemCount();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsCartOpen(true)}
        className="relative"
      >
        <ShoppingCart className="w-4 h-4" />
        {itemCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 bg-[#FF9E1B] hover:bg-[#FF9E1B] text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center p-0"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
        <span className="ml-2 hidden sm:inline">Cart</span>
      </Button>

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
};

export default CartButton;
