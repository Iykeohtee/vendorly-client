"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useExplore } from "@/hooks/useExplore";
import { ExploreSkeleton } from "@/components/explore/ExploreSkeleton";
import { CategoryFilter } from "@/components/explore/CategoryFilter";
import { ProductGrid } from "@/components/explore/ProductGrid";
import Input  from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
  const router = useRouter();
  const {
    products,
    categories,
    pagination,
    filters,
    isLoadingProducts,
    isLoadingCategories,
    updateFilters,
    changePage,
    selectProduct,
    refreshProducts,
  } = useExplore();

  console.log(products)

  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput, page: 1 });
  };

  // Handle category select
  const handleCategorySelect = useCallback(
    (category?: string) => {
      updateFilters({ category, page: 1 });
    },
    [updateFilters],
  );

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    // You can implement sorting logic here
  };

  // Handle view product details
  const handleViewDetails = useCallback(
    (productId: string) => {
      selectProduct(productId);
      router.push(`/explore/${productId}`);
    },
    [selectProduct, router],
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchInput("");
    updateFilters({ search: undefined, page: 1 });
  }, [updateFilters]);

  // Refresh on mount
  useEffect(() => {
    refreshProducts();
  }, []);

  if (isLoadingProducts && products.length === 0) {
    return <ExploreSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Explore Products
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover amazing products from trusted vendors
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10 pr-10 w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {filters.search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </form>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories - Always visible on desktop, toggle on mobile */}
        <div className={showFilters ? "block" : "hidden md:block"}>
          <CategoryFilter
            categories={categories}
            selectedCategory={filters.category}
            isLoading={isLoadingCategories}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* Active Filters */}
        {(filters.category || filters.search) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.category && (
              <Badge
                variant="secondary"
                className="px-3 py-1 gap-1 cursor-pointer hover:bg-secondary/80"
                onClick={() => handleCategorySelect(undefined)}
              >
                {filters.category}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {filters.search && (
              <Badge
                variant="secondary"
                className="px-3 py-1 gap-1 cursor-pointer hover:bg-secondary/80"
                onClick={clearSearch}
              >
                "{filters.search}"
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid
          products={products}
          isLoading={isLoadingProducts}
          onViewDetails={handleViewDetails}
          formatCurrency={formatCurrency}
        />

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} products
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm px-3 py-1 bg-muted rounded-md">
                Page {pagination.page} of {pagination.pages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
