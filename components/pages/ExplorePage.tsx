"use client";

import { useState } from "react";
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
import Navbar from "../layout/Navbar";
import {
  Flame,
  TrendingUp,
  Clock,
  Filter as FilterIcon,
  Award,
} from "lucide-react";

// Mock data (replace with actual data from your API)
const trendingToday = [
  {
    id: 1,
    name: "AirPods Pro Max 2024",
    vendor: "TechZone NG",
    price: 185000,
    originalPrice: 220000,
    rating: 4.9,
    reviews: 312,
    image: "🎧",
    tag: "Hot Deal",
    sales: 89,
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra Case",
    vendor: "PhoneWorld",
    price: 8500,
    originalPrice: 12000,
    rating: 4.7,
    reviews: 187,
    image: "📱",
    tag: "Bestseller",
    sales: 234,
  },
  {
    id: 3,
    name: "Nike Air Max 270 React",
    vendor: "Sneaker Hub",
    price: 65000,
    originalPrice: 78000,
    rating: 4.8,
    reviews: 145,
    image: "👟",
    tag: "Limited",
    sales: 56,
  },
  {
    id: 4,
    name: "LED Ring Light 18inch",
    vendor: "CreatorTools",
    price: 15000,
    originalPrice: 22000,
    rating: 4.6,
    reviews: 98,
    image: "💡",
    tag: "Flash Sale",
    sales: 167,
  },
];

const trendingThisWeek = [
  {
    id: 5,
    name: "MacBook Pro M3 Sleeve",
    vendor: "LaptopGear",
    price: 12000,
    originalPrice: 15000,
    rating: 4.5,
    reviews: 76,
    image: "💼",
    category: "Accessories",
  },
  {
    id: 6,
    name: "Wireless Charging Pad 3-in-1",
    vendor: "ChargePro",
    price: 18500,
    originalPrice: 25000,
    rating: 4.8,
    reviews: 203,
    image: "🔋",
    category: "Electronics",
  },
  {
    id: 7,
    name: "Vintage Denim Jacket",
    vendor: "StyleVault",
    price: 22000,
    originalPrice: 28000,
    rating: 4.6,
    reviews: 64,
    image: "🧥",
    category: "Fashion",
  },
  {
    id: 8,
    name: "Smart Home Speaker",
    vendor: "AudioMax",
    price: 35000,
    originalPrice: 42000,
    rating: 4.7,
    reviews: 189,
    image: "🔊",
    category: "Electronics",
  },
  {
    id: 9,
    name: "Organic Skincare Set",
    vendor: "GlowUp Beauty",
    price: 9800,
    originalPrice: 14000,
    rating: 4.9,
    reviews: 321,
    image: "🧴",
    category: "Health & Beauty",
  },
  {
    id: 10,
    name: "Minimalist Watch Gold",
    vendor: "TimeKeepers",
    price: 28000,
    originalPrice: 35000,
    rating: 4.4,
    reviews: 112,
    image: "⌚",
    category: "Accessories",
  },
];

const newArrivals = [
  {
    id: 11,
    name: "Bluetooth Earbuds TWS",
    vendor: "AudioMax",
    price: 7500,
    rating: 4.3,
    reviews: 12,
    image: "🎵",
    daysAgo: 1,
  },
  {
    id: 12,
    name: "Canvas Tote Bag",
    vendor: "StyleVault",
    price: 5500,
    rating: 4.6,
    reviews: 8,
    image: "👜",
    daysAgo: 1,
  },
  {
    id: 13,
    name: "Portable Blender USB",
    vendor: "HomeEssentials",
    price: 11000,
    rating: 4.5,
    reviews: 5,
    image: "🥤",
    daysAgo: 2,
  },
  {
    id: 14,
    name: "Desk Organizer Wood",
    vendor: "CraftHouse",
    price: 8200,
    rating: 4.7,
    reviews: 3,
    image: "🗂️",
    daysAgo: 2,
  },
  {
    id: 15,
    name: "Running Shorts Dri-Fit",
    vendor: "FitGear",
    price: 6800,
    rating: 4.4,
    reviews: 15,
    image: "🩳",
    daysAgo: 3,
  },
  {
    id: 16,
    name: "Aromatherapy Diffuser",
    vendor: "GlowUp Beauty",
    price: 13500,
    rating: 4.8,
    reviews: 7,
    image: "🌿",
    daysAgo: 3,
  },
];

const allProducts = [
  ...trendingToday.map((p) => ({ ...p, category: "Electronics" })),
  ...trendingThisWeek,
  ...newArrivals.map((p) => ({ ...p, category: "Gadgets" })),
];

const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <ExploreHeader
        wishlistCount={wishlist.length}
        cartCount={3}
        onSearch={handleSearch}
      />
      <HeroBanner />
      <Categories
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Trending Today */}
        <section>
          <SectionHeader
            icon={Flame}
            title="Trending Today"
            subtitle="Most popular products right now"
            iconBg="bg-[#ef4444]/10"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trendingToday.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={toggleWishlist}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        </section>

        {/* Top Vendors */}
        <TopVendors />

        {/* Trending This Week */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-[#f59e0b]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                  Trending This Week
                </h2>
                <p className="text-sm text-[#6b7280]">
                  Popular picks from this week
                </p>
              </div>
            </div>
            <Tabs defaultValue="all" className="hidden sm:block">
              <TabsList className="h-9 bg-[#f3f4f6] p-1">
                <TabsTrigger
                  value="all"
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#10b981] data-[state=active]:shadow-sm"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="electronics"
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#10b981]"
                >
                  Electronics
                </TabsTrigger>
                <TabsTrigger
                  value="fashion"
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#10b981]"
                >
                  Fashion
                </TabsTrigger>
                <TabsTrigger
                  value="beauty"
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#10b981]"
                >
                  Beauty
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trendingThisWeek.map((product) => (
              <Card
                key={product.id}
                className="group flex overflow-hidden transition-all hover:shadow-md border border-[#e5e7eb]"
              >
                <div className="w-28 sm:w-32 shrink-0 bg-[#f9fafb] flex items-center justify-center">
                  <span className="text-4xl">{product.image}</span>
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 border-[#e5e7eb] text-[#6b7280]"
                      >
                        {product.category}
                      </Badge>
                      <button onClick={() => toggleWishlist(product.id)}>
                        <Heart
                          className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-[#ef4444] text-[#ef4444]" : "text-[#9ca3af] hover:text-[#ef4444]"}`}
                        />
                      </button>
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-1 mb-0.5 text-[#111827]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#6b7280] mb-2">
                      {product.vendor}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#10b981]">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-[#9ca3af] line-through ml-1">
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs">
                      <Star className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]" />
                      <span className="font-medium text-[#111827]">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
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
                  <span className="text-4xl">{product.image}</span>
                  <Badge className="absolute top-2 left-2 bg-[#3b82f6] text-white text-[10px] border-0">
                    {product.daysAgo === 1
                      ? "New today"
                      : `${product.daysAgo}d ago`}
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
                  <p className="text-[10px] text-[#6b7280]">{product.vendor}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-sm text-[#10b981]">
                      {formatPrice(product.price)}
                    </span>
                    <div className="flex items-center gap-0.5 text-[10px]">
                      <Star className="h-2.5 w-2.5 fill-[#f59e0b] text-[#f59e0b]" />
                      <span className="text-[#111827]">{product.rating}</span>
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
                  {allProducts.length} products available
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
            {allProducts.map((product) => (
              <ProductCard
                key={`all-${product.id}`}
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
