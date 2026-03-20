import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingCart, Eye, Star, Store } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: any;
  onViewDetails: (id: string) => void;
  formatCurrency: (amount: number) => string;
}

export const ProductCard = ({
  product,
  onViewDetails,
  formatCurrency,
}: ProductCardProps) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const discount = product.discountPrice
    ? ((product.price - product.discountPrice) / product.price) * 100
    : 0;

  const getBadges = () => {
    const badges = [];

    if (product.ordersCount && product.ordersCount > 100) {
      badges.push({ text: "Best Seller", color: "bg-amber-500" });
    } else if (product.ordersCount && product.ordersCount > 50) {
      badges.push({ text: "Trending", color: "bg-blue-500" });
    }

    if (product.quantity < 5 && product.quantity > 0) {
      badges.push({ text: "Low Stock", color: "bg-red-500" });
    }

    const daysOld = Math.floor(
      (Date.now() - new Date(product.createdAt).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (daysOld < 7) {
      badges.push({ text: "New", color: "bg-green-500" });
    }

    return badges;
  };

  const badges = getBadges();

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 && !imageError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Store className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {badges.map((badge, index) => (
            <Badge
              key={index}
              className={`${badge.color} text-white border-0 text-xs`}
            >
              {badge.text}
            </Badge>
          ))}
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white border-0">
            -{Math.round(discount)}%
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        {/* Vendor Info */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
              {product.vendor?.storeName?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
            {product.vendor?.storeName || "Unknown Store"}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-base mb-1 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>
            {product.quantity > 0
              ? `${product.quantity} in stock`
              : "Out of stock"}
          </span>
          {product.ordersCount && (
            <span className="flex items-center gap-1">
              <ShoppingCart className="h-3 w-3" />
              {product.ordersCount} sold
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(product.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={() => router.push(`/checkout?product=${product.id}`)}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Buy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
