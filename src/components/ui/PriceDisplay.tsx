import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  price?: number;
  mrp?: number;
  discountedPrice?: number;
  minimumPrice?: number;
  activePriceType: 'price' | 'mrp' | 'discountedPrice' | 'minimumPrice';
}

interface PriceDisplayProps {
  product: Product;
  showPrice: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  product, 
  showPrice, 
  className = "", 
  size = 'medium' 
}) => {
  const navigate = useNavigate();

  const getDisplayPrice = (product: Product) => {
    switch (product.activePriceType) {
      case 'discountedPrice':
        return product.discountedPrice || product.price || product.mrp || 0;
      case 'minimumPrice':
        return product.minimumPrice || product.price || product.mrp || 0;
      case 'mrp':
        return product.mrp || product.price || 0;
      case 'price':
      default:
        return product.price || product.mrp || 0;
    }
  };

  const getOriginalPrice = (product: Product) => {
    // If using discounted or minimum price, show the normal price as original
    if (product.activePriceType === 'discountedPrice' || product.activePriceType === 'minimumPrice') {
      return product.price || product.mrp;
    }
    // If using price, show MRP as original if it exists and is higher
    if (product.activePriceType === 'price' && product.mrp && product.price && product.mrp > product.price) {
      return product.mrp;
    }
    return null;
  };

  const hasDiscount = getOriginalPrice(product) !== null;
  const discountPercentage = hasDiscount
    ? Math.round(((getOriginalPrice(product)! - getDisplayPrice(product)) / getOriginalPrice(product)!) * 100)
    : 0;

  const sizeClasses = {
    small: {
      price: 'text-sm lg:text-base',
      original: 'text-xs',
      badge: 'text-xs',
      button: 'text-xs px-2 py-1'
    },
    medium: {
      price: 'text-lg lg:text-xl',
      original: 'text-xs lg:text-sm',
      badge: 'text-xs',
      button: 'text-sm px-3 py-2'
    },
    large: {
      price: 'text-xl lg:text-2xl',
      original: 'text-sm lg:text-base',
      badge: 'text-sm',
      button: 'text-base px-4 py-2'
    }
  };

  const currentSize = sizeClasses[size];

  if (!showPrice) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center space-x-2">
          <span className={`${currentSize.price} font-bold text-gray-400`}>
            Price Hidden
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/login')}
          className={`${currentSize.button} text-[#FF9E1B] border-[#FF9E1B] hover:bg-[#FF9E1B] hover:text-white transition-colors`}
        >
          <LogIn className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
          Login to View Price
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center space-x-2">
        <span className={`${currentSize.price} font-bold text-[#53565A]`}>
          Rs. {getDisplayPrice(product).toLocaleString()}
        </span>
        {hasDiscount && (
          <Badge className={`bg-red-100 text-red-800 ${currentSize.badge}`}>
            {discountPercentage}% OFF
          </Badge>
        )}
      </div>
      {hasDiscount && getOriginalPrice(product) && (
        <div className={`${currentSize.original} text-[#888B8D] line-through`}>
          Rs. {getOriginalPrice(product)?.toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;
