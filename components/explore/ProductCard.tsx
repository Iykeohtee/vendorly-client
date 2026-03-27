"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import { Heart, Eye, Star, ShoppingCart } from "lucide-react";
import { Product } from "@/types/explore";

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onQuickView: (id: string) => void;
  formatPrice: (price: number) => string;
}

export const ProductCard = ({
  product,  
  isWishlisted,
  onToggleWishlist,
  formatPrice,
  onQuickView
}: ProductCardProps) => {
  const productImage = product.images?.[0] || "📦";

  const isHotDeal = product.tags?.some((tag) =>
    ["Hot Deal", "Hot", "Bestseller", "Trending"].includes(tag),
  );

  const isLowStock = product.quantity > 0 && product.quantity < 5;
  const isOutOfStock = product.quantity === 0;
  
  const discountPercentage = product.discountPrice 
    ? Math.round((1 - product.price / product.discountPrice) * 100)
    : null;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-[#e5e7eb] bg-white rounded-lg">
      {/* Image Container - Reduced height */}
      <div className="relative aspect-square bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6] overflow-hidden">
        {productImage.startsWith("http") ? (
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-50">
            {productImage}
          </div>
        )}

        {/* Badges - Smaller */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
          {isHotDeal && (
            <Badge className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white text-[9px] border-0 px-1.5 py-0 font-medium shadow-sm">
              🔥 Hot
            </Badge>
          )}
          {isLowStock && !isHotDeal && (
            <Badge className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white text-[9px] border-0 px-1.5 py-0 font-medium shadow-sm">
              ⚡ Low
            </Badge>
          )}
          {isOutOfStock && (
            <Badge className="bg-[#6b7280] text-white text-[9px] border-0 px-1.5 py-0 font-medium shadow-sm">
              Sold
            </Badge>
          )}
        </div>

        {/* Wishlist Button - Smaller */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0"
        >
          <Heart
            className={`h-3 w-3 transition-all ${
              isWishlisted
                ? "fill-[#ef4444] text-[#ef4444] scale-110"
                : "text-[#9ca3af] group-hover:text-[#ef4444]"
            }`}
          />
        </button>

        {/* Stats Badge - Smaller */}
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5">
          <Eye className="h-2 w-2 text-white" />
          <span className="text-[8px] font-medium text-white">
            {product.ordersCount || 0}
          </span>
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button 
           onClick={() => onQuickView(product.id)}
          className="px-2 py-1 bg-white rounded-md text-[9px] font-medium text-[#111827] hover:bg-[#10b981] hover:text-white transition-all duration-200 transform scale-90 group-hover:scale-100 shadow-lg">
            Quick View
          </button>
        </div>
      </div>

      {/* Content - Reduced padding and spacing */}
      <CardContent className="p-2 space-y-1">
        {/* Vendor Name */}
        <p className="text-[9px] text-[#6b7280] truncate">
          {product.vendor?.storeName || "Unknown"}
        </p>
        
        {/* Product Name */}
        <h3 className="font-semibold text-[10px] leading-tight line-clamp-2 text-[#111827] group-hover:text-[#10b981] transition-colors min-h-[24px]">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-bold text-xs text-[#10b981]">
            {formatPrice(product.price)}
          </span>
          {product.discountPrice && (
            <>
              <span className="text-[8px] text-[#9ca3af] line-through">
                {formatPrice(product.discountPrice)}
              </span>
              <Badge className="bg-[#fef3c7] text-[#d97706] text-[8px] border-0 px-1 py-0">
                -{discountPercentage}%
              </Badge>
            </>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            <Star className="h-2.5 w-2.5 fill-[#f59e0b] text-[#f59e0b]" />
            <span className="text-[9px] font-medium text-[#111827]">4.5</span>
          </div>
          <span className="text-[8px] text-[#9ca3af]">(128)</span>
        </div>

        {/* Order Button - Smaller */}
        <Button
          className="w-full mt-1 bg-[#10b981] hover:bg-[#059669] text-white font-medium text-[10px] h-7 transition-all duration-200 group/btn rounded-md"
          size="sm"
          disabled={isOutOfStock}
        >
          <ShoppingCart className="mr-1 h-2.5 w-2.5 group-hover/btn:scale-110 transition-transform" />
          {isOutOfStock ? "Out of Stock" : "Order"}
        </Button>
      </CardContent>
    </Card>
  );
};