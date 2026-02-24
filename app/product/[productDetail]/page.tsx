"use client";

import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProducts";
import { useState } from "react";
import {
  ChevronLeft,
  ImageOff,
  Package,
  Tag,
  Store,
  Calendar,
  Clock,
  ChevronRight,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const ProductDetail = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.productDetail as string;
  const { vendorProduct } = useProduct();

  const [mainImage, setMainImage] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: product, isLoading, error } = vendorProduct(productId);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
            <div className="space-y-6">
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-7 w-1/3 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-20 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            This product might have been removed or doesn't exist.
          </p>
          <Button
            onClick={() => router.push("/products")}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Browse Products
          </Button>
        </Card>
      </div>
    );
  }

  const currentImage = product.images?.[mainImage];
  const hasImageError = imageErrors.has(mainImage);
  const stockColor =
    product.quantity === 0 ? "red" : product.quantity < 10 ? "yellow" : "green";
  const stockText =
    product.quantity === 0
      ? "Out of Stock"
      : product.quantity < 10
        ? "Low Stock"
        : "In Stock";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-green-600 transition-colors group"
          >
            <div className="p-2 rounded-full bg-white shadow-sm group-hover:bg-green-50 transition-colors mr-2">
              <ChevronLeft className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Back to Products</span>
          </button>

          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Heart
              className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
              {currentImage && !hasImageError ? (
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={() => handleImageError(mainImage)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                  <ImageOff className="h-16 w-16 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Image unavailable</p>
                </div>
              )}

              {/* Status Badge */}
              <div
                className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg
                ${
                  stockColor === "green"
                    ? "bg-green-100 text-green-800"
                    : stockColor === "yellow"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {stockText}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      mainImage === index
                        ? "border-green-500 ring-2 ring-green-200"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(index)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {/* <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {product.status}
                </span> */}
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
            </div>

            {/* Price Card */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <p className="text-sm text-green-700 font-medium mb-1">Price</p>
              <p className="text-4xl font-bold text-green-600">
                ₦{product.price.toLocaleString()}
              </p>
            </div>

            {/* Description Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-sm font-medium text-gray-700 mb-3">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            {/* Stock Info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Package
                    className={`h-5 w-5 ${
                      stockColor === "green"
                        ? "text-green-600"
                        : stockColor === "yellow"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Stock</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {product.quantity} units
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-700">
                  {formatDate(product.updatedAt)}
                </p>
              </div>
            </div>

            {/* Vendor Card */}
            {product.vendor && (
              <Card className="overflow-hidden border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <Store className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Sold by</p>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {product.vendor.storeName}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Listed {formatDate(product.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500 text-green-600 hover:bg-green-50"
                    >
                      View Store
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {/* {product.tags && product.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )} */}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                disabled={product.quantity === 0}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-6 text-lg font-medium"
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="px-8 border-2 border-green-500 text-green-600 hover:bg-green-50"
              >
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
