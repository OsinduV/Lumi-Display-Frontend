import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string; // Unique identifier for cart item (product._id + variants)
  productId: string;
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
  redistributionPrice?: number;
  image?: string;
  quantity: number;
  selectedVariants: {
    size?: string;
    color?: string;
    shape?: string;
    type?: string;
  };
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'addedAt'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isInCart: (productId: string, variants?: CartItem['selectedVariants']) => boolean;
  getCartItem: (productId: string, variants?: CartItem['selectedVariants']) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('lumizo_cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        // Convert addedAt strings back to Date objects
        const processedCart = cartData.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        setItems(processedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('lumizo_cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('lumizo_cart', JSON.stringify(items));
  }, [items]);

  // Generate unique ID for cart item based on product and variants
  const generateCartItemId = (productId: string, variants: CartItem['selectedVariants']): string => {
    const variantString = Object.entries(variants)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
    return `${productId}_${variantString}`;
  };

  // Get display price for a cart item
  const getDisplayPrice = (item: CartItem): number => {
    switch (item.activePriceType) {
      case 'discountedPrice':
        return item.discountedPrice || item.price || item.mrp || 0;
      case 'minimumPrice':
        return item.minimumPrice || item.price || item.mrp || 0;
      case 'mrp':
        return item.mrp || item.price || 0;
      case 'price':
      default:
        return item.price || item.mrp || 0;
    }
  };

  const addToCart = (newItem: Omit<CartItem, 'id' | 'addedAt'>) => {
    const itemId = generateCartItemId(newItem.productId, newItem.selectedVariants);
    
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === itemId);
      
      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity
        };
        return updatedItems;
      } else {
        // Add new item
        const cartItem: CartItem = {
          ...newItem,
          id: itemId,
          addedAt: new Date()
        };
        return [...prevItems, cartItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = (): number => {
    return items.reduce((total, item) => {
      return total + (getDisplayPrice(item) * item.quantity);
    }, 0);
  };

  const getCartItemCount = (): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId: string, variants: CartItem['selectedVariants'] = {}): boolean => {
    const itemId = generateCartItemId(productId, variants);
    return items.some(item => item.id === itemId);
  };

  const getCartItem = (productId: string, variants: CartItem['selectedVariants'] = {}): CartItem | undefined => {
    const itemId = generateCartItemId(productId, variants);
    return items.find(item => item.id === itemId);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    getCartItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
