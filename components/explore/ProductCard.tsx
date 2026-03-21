"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import { Heart, Eye, Star, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: any;
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
  formatPrice: (price: number) => string;
}

export const ProductCard = ({
  product,
  isWishlisted,
  onToggleWishlist,
  formatPrice,
}: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-[#10b981]/5 hover:-translate-y-0.5 border border-[#e5e7eb]">
      <div className="relative aspect-square bg-[#f9fafb] flex items-center justify-center">
        <span className="text-6xl">{product.image}</span>
        {product.tag && (
          <Badge className="absolute top-3 left-3 bg-[#ef4444] text-white text-xs border-0">
            {product.tag}
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
        {product.sales && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/80 backdrop-blur rounded-full px-2 py-1 text-xs">
            <Eye className="h-3 w-3 text-[#6b7280]" />
            <span className="font-medium text-[#374151]">
              {product.sales} sold
            </span>
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-2">
        <p className="text-xs text-[#6b7280]">{product.vendor}</p>
        <h3 className="font-semibold text-sm line-clamp-1 text-[#111827]">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#10b981]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-xs text-[#9ca3af] line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <Badge
                variant="secondary"
                className="text-xs bg-[#f3f4f6] text-[#10b981] border-0"
              >
                -{discount}%
              </Badge>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]" />
          <span className="font-medium text-[#111827]">{product.rating}</span>
          {product.reviews && (
            <span className="text-[#6b7280]">({product.reviews} reviews)</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-medium"
          size="sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
