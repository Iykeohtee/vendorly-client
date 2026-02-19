"use client";

import Image from "next/image";
import { StoreProduct } from "@/redux/slices/storeSlice";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: StoreProduct;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hello, I'm interested in ordering: ${product.name} (₦${product.price.toLocaleString()})`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative h-48 bg-gray-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Out of stock overlay */}
        {product.quantity === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold px-3 py-1 bg-red-500 rounded-full text-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick action buttons */}
        <div
          className={`absolute top-2 right-2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-green-600">
              ₦{product.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleWhatsAppOrder}
            disabled={product.quantity === 0}
            className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Order
          </button>
        </div>
      </div>
    </div>
  );
}
