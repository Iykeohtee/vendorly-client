"use client";

import { useEffect, useState } from "react";
import {
  X,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  Store,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/explore";

interface ProductQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  isLoading: boolean;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  formatPrice: (price: number) => string;
}

export const ProductQuickViewModal = ({
  isOpen,
  onClose,
  product,
  isLoading,
  isWishlisted,
  onToggleWishlist,
  formatPrice,
}: ProductQuickViewModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Get all valid images
  const images = product?.images?.filter(img => img?.startsWith("http")) || [];
  const hasMultipleImages = images.length > 1;

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsImageLoading(true);
  }, [product]);

  // Close modal on escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsImageLoading(true);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsImageLoading(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[95vh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 p-1.5 sm:p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 group"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5 text-[#6b7280] group-hover:text-[#111827]" />
        </button>

        {/* ESC Hint - Hide on mobile */}
        <div className="hidden sm:block absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 pointer-events-none">
          <p className="text-[10px] text-white/80 flex items-center gap-1">
            <span className="bg-white/20 px-1 rounded text-[9px]">ESC</span>
            <span>to exit</span>
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[500px] sm:h-[600px]">
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#10b981]/20 rounded-full blur-xl animate-pulse" />
                <RefreshCw className="h-10 w-10 sm:h-12 sm:w-12 text-[#10b981] animate-spin mx-auto mb-4 relative" />
              </div>
              <p className="text-sm text-[#6b7280] font-medium">
                Loading product details...
              </p>
            </div>
          </div>
        ) : product ? (
          <>
            {/* Image Gallery Section - Fixed height on mobile */}
            <div className="bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6] p-3 sm:p-6 lg:p-8">
              <div className="relative flex items-center justify-center min-h-[250px] sm:min-h-[300px] lg:min-h-[400px]">
                {images.length > 0 ? (
                  <>
                    {isImageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8 text-[#10b981] animate-spin" />
                      </div>
                    )}
                    <img
                      src={images[currentImageIndex]}
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      className={`max-w-full max-h-[200px] sm:max-h-[280px] lg:max-h-[350px] object-contain rounded-lg transition-opacity duration-300 ${
                        isImageLoading ? "opacity-0" : "opacity-100"
                      }`}
                      onLoad={() => setIsImageLoading(false)}
                    />
                  </>
                ) : (
                  <span className="text-6xl sm:text-8xl opacity-30">📦</span>
                )}

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-[#374151]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#374151]" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {hasMultipleImages && (
                <div className="flex gap-1 sm:gap-2 mt-3 sm:mt-4 overflow-x-auto pb-2 justify-center">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        setIsImageLoading(true);
                      }}
                      className={`relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === idx
                          ? "border-[#10b981] shadow-md scale-105"
                          : "border-[#e5e7eb] hover:border-[#10b981]/50"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section - Scrollable */}
            <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1">
              {/* Vendor Info */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/10 flex items-center justify-center flex-shrink-0">
                  <Store className="h-4 w-4 sm:h-5 sm:w-5 text-[#10b981]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-[#111827] truncate">
                    {product.vendor?.storeName || "Unknown Store"}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    <div className="flex items-center">
                      <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-[#f59e0b] text-[#f59e0b]" />
                      <span className="text-[10px] sm:text-xs font-medium text-[#111827] ml-0.5">
                        {product.rating || "4.8"}
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-[11px] text-[#9ca3af]">(245 reviews)</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-[#d1d5db] mx-0.5 sm:mx-1" />
                    <div className="flex items-center gap-0.5">
                      <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#10b981]" />
                      <span className="text-[9px] sm:text-[11px] text-[#10b981]">Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-[#111827] mb-2 sm:mb-3 leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#10b981]">
                  {formatPrice(product.price)}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-xs sm:text-sm text-[#9ca3af] line-through">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <Badge className="bg-gradient-to-r from-[#fef3c7] to-[#fed7aa] text-[#d97706] border-0 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs">
                      -{Math.round((1 - product.price / product.discountPrice) * 100)}%
                    </Badge>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="mb-4 sm:mb-5">
                <h3 className="text-[10px] sm:text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-1 sm:mb-2">
                  Description
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  {product.description ||
                    "No description available for this product. Contact the vendor for more details."}
                </p>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#6b7280] bg-[#f9fafb] rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-[#10b981] flex-shrink-0" />
                  <span className="truncate">100% Authentic</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#6b7280] bg-[#f9fafb] rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                  <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-[#10b981] flex-shrink-0" />
                  <span className="truncate">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#6b7280] bg-[#f9fafb] rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 text-[#10b981] flex-shrink-0" />
                  <span className="truncate">7-Day Returns</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#6b7280] bg-[#f9fafb] rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-[#10b981] flex-shrink-0" />
                  <span className="truncate">Instant Support</span>
                </div>
              </div>

              {/* Stock Status */}
              {product.quantity > 0 && product.quantity < 5 && (
                <div className="mb-4 sm:mb-5 p-2 sm:p-3 bg-gradient-to-r from-[#fef3c7] to-[#fed7aa] rounded-xl border border-[#fed7aa]">
                  <p className="text-[10px] sm:text-xs font-semibold text-[#d97706] flex items-center gap-1.5 sm:gap-2">
                    <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    ⚡ Only {product.quantity} items left! Order now.
                  </p>
                </div>
              )}

              {product.quantity === 0 && (
                <div className="mb-4 sm:mb-5 p-2 sm:p-3 bg-[#f3f4f6] rounded-xl">
                  <p className="text-[10px] sm:text-xs font-medium text-[#6b7280] text-center">
                    Out of Stock - Check back soon
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold py-2 sm:py-2.5 text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={product.quantity === 0}
                >
                  <ShoppingCart className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {product.quantity === 0
                    ? "Out of Stock"
                    : "Order on WhatsApp"}
                </Button>
                <Button
                  variant="outline"
                  className={`px-4 sm:px-6 border-2 transition-all duration-300 py-2 sm:py-2.5 text-xs sm:text-sm ${
                    isWishlisted
                      ? "border-[#ef4444] bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444] hover:text-white"
                      : "border-[#e5e7eb] hover:border-[#ef4444] hover:text-[#ef4444]"
                  }`}
                  onClick={() => onToggleWishlist(product.id)}
                >
                  <Heart
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all ${
                      isWishlisted ? "fill-[#ef4444]" : ""
                    }`}
                  />
                  <span className="ml-1.5 sm:ml-2 hidden xs:inline">
                    {isWishlisted ? "Saved" : "Save"}
                  </span>
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#e5e7eb]">
                <p className="text-[10px] sm:text-xs text-[#9ca3af] text-center">
                  Need help? Contact vendor via WhatsApp
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[400px] sm:h-[500px]">
            <div className="text-center px-4">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-[#fef2f2] flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <X className="h-6 w-6 sm:h-8 sm:w-8 text-[#ef4444]" />
              </div>
              <p className="text-sm text-[#6b7280] font-medium">
                Failed to load product details
              </p>
              <p className="text-xs text-[#9ca3af] mt-1">
                Please try again later
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};