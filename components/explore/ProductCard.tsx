"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import { Heart, Eye, Star, ShoppingCart } from "lucide-react";
import { Product } from "@/types/explore";

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  formatPrice: (price: number) => string;
}

export const ProductCard = ({
  product,
  isWishlisted,
  onToggleWishlist,
  formatPrice,
}: ProductCardProps) => {
  // Get first image or placeholder
  const productImage = product.images?.[0] || "📦";

  // Check if product has hot tag
  const isHotDeal = product.tags?.some((tag) =>
    ["Hot Deal", "Hot", "Bestseller", "Trending"].includes(tag),
  );

  // Check low stock
  const isLowStock = product.quantity > 0 && product.quantity < 5;
  const isOutOfStock = product.quantity === 0;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-[#10b981]/5 hover:-translate-y-0.5 border border-[#e5e7eb]">
      <div className="relative aspect-square bg-[#f9fafb] flex items-center justify-center">
        {productImage.startsWith("http") ? (
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl">{productImage}</span>
        )}

        {isHotDeal && (
          <Badge className="absolute top-3 left-3 bg-[#ef4444] text-white text-xs border-0">
            Hot Deal
          </Badge>
        )}

        {isLowStock && !isHotDeal && (
          <Badge className="absolute top-3 left-3 bg-[#f59e0b] text-white text-xs border-0">
            Low Stock
          </Badge>
        )}

        {isOutOfStock && (
          <Badge className="absolute top-3 left-3 bg-[#6b7280] text-white text-xs border-0">
            Out of Stock
          </Badge>
        )}

        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center transition-all hover:scale-110 hover:bg-white"
        >
          <Heart
            className={`h-4 w-4 ${
              isWishlisted
                ? "fill-[#ef4444] text-[#ef4444]"
                : "text-[#9ca3af] hover:text-[#ef4444]"
            }`}
          />
        </button>

        {product.ordersCount && product.ordersCount > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/80 backdrop-blur rounded-full px-2 py-1 text-xs">
            <Eye className="h-3 w-3 text-[#6b7280]" />
            <span className="font-medium text-[#374151]">
              {product.ordersCount} sold
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        <p className="text-xs text-[#6b7280]">
          {product.vendor?.storeName || "Unknown Store"}
        </p>
        <h3 className="font-semibold text-sm line-clamp-1 text-[#111827]">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#10b981]">
            {formatPrice(product.price)}
          </span>
          {product.discountPrice && (
            <>
              <span className="text-xs text-[#9ca3af] line-through">
                {formatPrice(product.discountPrice)}
              </span>
              <Badge
                variant="secondary"
                className="text-xs bg-[#f3f4f6] text-[#10b981] border-0"
              >
                -{Math.round((1 - product.price / product.discountPrice) * 100)}
                %
              </Badge>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]" />
          <span className="font-medium text-[#111827]">4.5</span>
          <span className="text-[#6b7280]">(Coming soon)</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-medium"
          size="sm"
          disabled={isOutOfStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};
