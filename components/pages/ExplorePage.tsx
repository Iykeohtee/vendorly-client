"use client";

import { useState, useEffect, useMemo } from "react";
import { useExplore } from "@/hooks/useExplore";
import Button from "@/components/ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/badge";
import {
  Filter,
  ChevronRight,
  Heart,
  Star,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { CardContent } from "../ui/Card";
import { ExploreHeader } from "@/components/explore/ExploreHeader";
import { HeroBanner } from "@/components/explore/HeroBanner";
import { Categories } from "@/components/explore/Categories";
import { ProductCard } from "@/components/explore/ProductCard";
import { SectionHeader } from "@/components/explore/SectionHeader";
import { TopVendors } from "@/components/explore/TopVendors";
import { ProductQuickViewModal } from "../explore/ProduckQuickViewModal";
import { Flame, TrendingUp, Clock, Filter as FilterIcon } from "lucide-react";

const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    trendingToday,
    trendingWeek,
    isLoadingTrending,
    products,
    productDetails,
    isProductDetailsLoading,
    isProductDetailsFetching,
    clearSelected,
    categories,
    filters,
    isLoadingCategories,
    updateFilters,
    changePage,
    refreshProducts,
    pagination,
  } = useExplore(selectedProductId!);

  const handleCategoryChange = (category: string) => {
    updateFilters({
      category: category === "All" ? undefined : category,
      page: 1,
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilters({ search: query || undefined, page: 1 });
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleQuickView = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
    clearSelected();
  };

  const newArrivals = useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10); // Increased to show more products
  }, [products]);

  useEffect(() => {
    refreshProducts();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9fafb] to-white">
      <ExploreHeader
        wishlistCount={wishlist.length}
        cartCount={3}
        onSearch={handleSearch}
      />
      <HeroBanner />

      <Categories
        activeCategory={filters.category || "All"}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        isLoading={isLoadingCategories}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Trending Today - 5 products per row */}
        <section>
          <SectionHeader
            icon={Flame}
            title="Trending Today"
            subtitle="Hottest products right now"
            iconBg="bg-[#ef4444]/10"
          />
          {isLoadingTrending ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {trendingToday?.slice(0, 10).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={false}
                  onToggleWishlist={() => {}}
                  formatPrice={formatPrice}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>
          )}
        </section>

        {/* Top Vendors */}
        <TopVendors />

        {/* Trending This Week - 5 products per row */}
        <section>
          <SectionHeader
            icon={TrendingUp}
            title="Trending This Week"
            subtitle="Popular picks from this week"
            iconBg="bg-[#f59e0b]/10"
          />
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {trendingWeek?.slice(0, 10).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={false}
                onToggleWishlist={() => {}}
                formatPrice={formatPrice}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        </section>

        {/* New Arrivals - 6 products per row with time badge */}
        <section>
          <SectionHeader
            icon={Clock}
            title="New Arrivals"
            subtitle="Fresh products just added"
            iconBg="bg-[#3b82f6]/10"
            onViewAll={() => {}}
          />
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {newArrivals.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 border border-[#e5e7eb] bg-white rounded-lg"
              >
                <div className="relative aspect-square bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6] overflow-hidden">
                  {product.images?.[0]?.startsWith("http") ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-4xl opacity-50">
                      {product.images?.[0] || "📦"}
                    </span>
                  )}

                  {/* Time duration badge - RESTORED */}
                  <Badge className="absolute top-2 left-2 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white text-[10px] border-0 px-2 py-0.5 font-medium shadow-sm">
                    {(() => {
                      const daysAgo = Math.floor(
                        (Date.now() - new Date(product.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24),
                      );
                      return daysAgo === 0 ? "✨ New today" : `${daysAgo}d ago`;
                    })()}
                  </Badge>

                  {/* Wishlist button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0"
                  >
                    <Heart
                      className={`h-3 w-3 transition-all ${
                        wishlist.includes(product.id)
                          ? "fill-[#ef4444] text-[#ef4444] scale-110"
                          : "text-[#9ca3af] group-hover:text-[#ef4444]"
                      }`}
                    />
                  </button>

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => handleQuickView(product.id)}
                      className="px-2 py-1 bg-white rounded-md text-[9px] font-medium text-[#111827] hover:bg-[#10b981] hover:text-white transition-all duration-200 transform scale-90 group-hover:scale-100 shadow-lg"
                    >
                      Quick View
                    </button>
                  </div>
                </div>

                <CardContent className="p-2 space-y-1">
                  <h3 className="font-semibold text-[10px] leading-tight line-clamp-2 text-[#111827] group-hover:text-[#10b981] transition-colors min-h-[24px]">
                    {product.name}
                  </h3>
                  <p className="text-[9px] text-[#6b7280] truncate">
                    {product.vendor?.storeName || "Unknown Store"}
                  </p>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-bold text-xs text-[#10b981]">
                      {formatPrice(product.price)}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-[#f59e0b] text-[#f59e0b]" />
                      <span className="text-[9px] font-medium text-[#111827]">
                        {product.rating || "4.5"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Browse All Products - 5 products per row */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#10b981]/10 to-[#10b981]/5 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-[#10b981]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                  Browse All Products
                </h2>
                <p className="text-sm text-[#6b7280]">
                  {products.length} products available
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 hidden sm:flex border-[#e5e7eb] text-[#374151] hover:border-[#10b981] hover:text-[#10b981] transition-all"
            >
              <Filter className="h-3.5 w-3.5" /> Filters
            </Button>
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={toggleWishlist}
                formatPrice={formatPrice}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6] hover:border-[#10b981]/20 rounded-full px-6"
              onClick={() => changePage(filters.page + 1)}
              disabled={!pagination || filters.page >= pagination.pages}
            >
              Load More Products <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        isOpen={isModalOpen}
        onClose={closeModal}  
        product={productDetails}
        isLoading={isProductDetailsLoading || isProductDetailsFetching}
        isWishlisted={
          productDetails ? wishlist.includes(productDetails.id) : false   
        }
        onToggleWishlist={toggleWishlist}
        formatPrice={formatPrice}
      />

      {/* Footer */}
      <footer className="border-t border-[#e5e7eb] bg-gradient-to-b from-white to-[#f9fafb] py-10 mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-[#10b981]" />
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-[#111827] to-[#10b981] bg-clip-text text-transparent">
                  Vendorly
                </span>
              </div>
              <p className="text-sm text-[#6b7280] leading-relaxed">
                The #1 marketplace for WhatsApp vendors. Buy and sell with
                confidence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[#111827] text-sm uppercase tracking-wide">
                Shop
              </h4>
              <ul className="space-y-2 text-sm text-[#6b7280]">
                <li className="hover:text-[#10b981] cursor-pointer transition-colors">
                  All Products
                </li>
                <li className="hover:text-[#10b981] cursor-pointer transition-colors">
                  Categories
                </li>
                <li className="hover:text-[#10b981] cursor-pointer transition-colors">
                  Top Vendors
                </li>
                <li className="hover:text-[#10b981] cursor-pointer transition-colors">
                  Deals
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[#111827] text-sm uppercase tracking-wide">
                Vendor
              </h4>
              <ul className="space-y-2 text-sm text-[#6b7280]">
                <li className="hover:text-[#10b981] cursor-pointer transition-colors">
                  Start Selling
                </li>
                <li className="hover:text-[#10b981] cursor-pointer transition-colors">
                  Pricing
                </li>
                <li className="hover:text-[#10b981] cursor-pointer transition-colors">
                  Resources
                </li>
                <li className="hover:text-[#10b981] cursor-pointer transition-colors">
                  Success Stories
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[#111827] text-sm uppercase tracking-wide">
                Support
              </h4>
              <ul className="space-y-2 text-sm text-[#6b7280]">
                <li className="hover:text-[#10b981] cursor-pointer transition-colors">
                  Help Center
                </li>
                <li className="hover:text-[#10b981] cursor-pointer transition-colors">
                  Contact Us
                </li>
                <li className="hover:text-[#10b981] cursor-pointer transition-colors">
                  Privacy Policy
                </li>
                <li className="hover:text-[#10b981] cursor-pointer transition-colors">
                  Terms of Service
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#e5e7eb] mt-8 pt-6 text-center text-sm text-[#6b7280]">
            <p>© 2026 Vendorly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
