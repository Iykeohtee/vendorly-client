"use client";

import { useState, useEffect, useMemo } from "react";
import { useExplore } from "@/hooks/useExplore";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Button from "@/components/ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/badge";
import { Filter, ChevronRight, Heart, Star, MessageCircle } from "lucide-react";
import { CardContent } from "../ui/Card";
import { ExploreHeader } from "@/components/explore/ExploreHeader";
import { HeroBanner } from "@/components/explore/HeroBanner";
import { Categories } from "@/components/explore/Categories";
import { ProductCard } from "@/components/explore/ProductCard";
import { SectionHeader } from "@/components/explore/SectionHeader";
import { TopVendors } from "@/components/explore/TopVendors";
import { Flame, TrendingUp, Clock, Filter as FilterIcon } from "lucide-react";

const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);

  const {
    trendingToday,
    trendingWeek,
    isLoadingTrending,
    products,
    categories,
    filters,
    isLoadingCategories,
    updateFilters,
    changePage,
    refreshProducts,
    pagination,
  } = useExplore();

  // Handle category change from Categories component
  const handleCategoryChange = (category: string) => {
    // If category is "All", pass undefined to clear the filter
    updateFilters({
      category: category === "All" ? undefined : category,
      page: 1,
    });
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilters({ search: query || undefined, page: 1 });
  };

  // Handle wishlist toggle
  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // Handle view details
  const handleViewDetails = (id: string) => {
    console.log("View details for product:", id);
    // router.push(`/explore/${id}`);
  };

  const newArrivals = useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 6);
  }, [products]);

  // Refresh products when filters change
  useEffect(() => {
    refreshProducts();
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <ExploreHeader
        wishlistCount={wishlist.length}
        cartCount={3}
        onSearch={handleSearch}
      />
      <HeroBanner />

      {/* Categories Component*/}
      <Categories
        activeCategory={filters.category || "All"}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        isLoading={isLoadingCategories}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Trending Today */}
        <section>
          <SectionHeader
            icon={Flame}
            title="Trending Today"
            subtitle="Hottest products right now"
            iconBg="bg-[#ef4444]/10"
          />
          {isLoadingTrending ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trendingToday?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={false}
                  onToggleWishlist={() => {}}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}
        </section>

        {/* Top Vendors */}
        <TopVendors />

        {/* Trending This Week */}
        <section>
          <SectionHeader
            icon={TrendingUp}
            title="Trending This Week"
            subtitle="Popular picks from this week"
            iconBg="bg-[#f59e0b]/10"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trendingWeek?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={false}
                onToggleWishlist={() => {}}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section>
          <SectionHeader
            icon={Clock}
            title="New Arrivals"
            subtitle="Fresh products just added"
            iconBg="bg-[#3b82f6]/10"
            onViewAll={() => {}}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {newArrivals.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 border border-[#e5e7eb]"
              >
                <div className="relative aspect-square bg-[#f9fafb] flex items-center justify-center">
                  {product.images?.[0]?.startsWith("http") ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">
                      {product.images?.[0] || "📦"}
                    </span>
                  )}
                  <Badge className="absolute top-2 left-2 bg-[#3b82f6] text-white text-[10px] border-0">
                    {(() => {
                      const daysAgo = Math.floor(
                        (Date.now() - new Date(product.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24),
                      );
                      return daysAgo === 0 ? "New today" : `${daysAgo}d ago`;
                    })()}
                  </Badge>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white"
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${wishlist.includes(product.id) ? "fill-[#ef4444] text-[#ef4444]" : "text-[#9ca3af]"}`}
                    />
                  </button>
                </div>
                <CardContent className="p-3 space-y-1">
                  <h3 className="font-medium text-xs line-clamp-1 text-[#111827]">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-[#6b7280]">
                    {product.vendor?.storeName || "Unknown Store"}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-sm text-[#10b981]">
                      {formatPrice(product.price)}
                    </span>
                    <div className="flex items-center gap-0.5 text-[10px]">
                      <Star className="h-2.5 w-2.5 fill-[#f59e0b] text-[#f59e0b]" />
                      <span className="text-[#111827]">
                        {product.rating || "4.5"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Browse All Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#f3f4f6] flex items-center justify-center">
                <FilterIcon className="h-5 w-5 text-[#6b7280]" />
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
              className="gap-1 hidden sm:flex border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6]"
            >
              <Filter className="h-3.5 w-3.5" /> Filters
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={toggleWishlist}
                formatPrice={formatPrice}
              />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6] hover:border-[#10b981]/20"
              onClick={() => changePage(filters.page + 1)}
              disabled={!pagination || filters.page >= pagination.pages}
            >
              Load More Products <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#e5e7eb] bg-[#f9fafb] py-10 mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="h-6 w-6 text-[#10b981]" />
                <span className="font-bold text-lg text-[#111827]">
                  Vendorly
                </span>
              </div>
              <p className="text-sm text-[#6b7280]">
                The #1 marketplace for WhatsApp vendors. Buy and sell with
                confidence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[#111827]">Shop</h4>
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
              <h4 className="font-semibold mb-3 text-[#111827]">Vendor</h4>
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
              <h4 className="font-semibold mb-3 text-[#111827]">Support</h4>
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
            © 2026 Vendorly. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
