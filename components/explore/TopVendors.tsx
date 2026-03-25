"use client";

import { Card } from "@/components/ui/Card";
import { Award, Star, TrendingUp, Shield, Sparkles, Store, MapPin, Calendar } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { useExplore } from "@/hooks/useExplore";
import Image from "next/image";
import { useState } from "react";

export const TopVendors = () => {
  const { topVendors, categories } = useExplore();
  const [hoveredVendor, setHoveredVendor] = useState<string | null>(null);

  console.log(topVendors)

  // Format date helper
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 30) {
      return `${diffDays} days ago`;
    } else if (diffDays <= 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  };

  return (
    <section className="relative">
      {/* Background decoration */}
      <div />

      <SectionHeader
        icon={Award}
        title="Top Vendors"
        subtitle="Trusted sellers with high ratings"
        iconBg="bg-[#10b981]/10"
      />

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {topVendors.map((vendor, index) => (
          <Card
            key={vendor.storeName}
            className="group relative text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-[#e5e7eb] hover:border-[#10b981]/30 bg-white/80 backdrop-blur-sm overflow-hidden"
            onMouseEnter={() => setHoveredVendor(vendor.storeName)}
            onMouseLeave={() => setHoveredVendor(null)}
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#10b981]/0 via-[#10b981]/0 to-[#10b981]/0 group-hover:from-[#10b981]/10 group-hover:via-[#10b981]/5 group-hover:to-transparent transition-all duration-500" />

            {/* Verified badge */}
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-[#10b981]/10 rounded-full p-1 group-hover:bg-[#10b981]/20 transition-colors">
                <Shield className="h-3 w-3 text-[#10b981]" />
              </div>
            </div>

            {/* Image container with enhanced styling */}
            <div className="relative mb-4 flex justify-center">
              <div className="relative">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#10b981]/20 to-[#10b981]/0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Image wrapper with border and shadow */}
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/5 p-0.5 group-hover:from-[#10b981]/40 group-hover:to-[#10b981]/20 transition-all duration-300">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-md group-hover:shadow-xl transition-all duration-300">
                    {vendor.logo ? (
                      <Image
                        src={vendor.logo}
                        height={80}
                        width={80}
                        alt={`${vendor.storeName} logo`}
                        className="object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#10b981]/10 to-[#10b981]/5 flex items-center justify-center">
                        <Store className="h-10 w-10 text-[#10b981]/40" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Decorative ring on hover */}
                <div className="absolute inset-0 rounded-full border-2 border-[#10b981]/0 group-hover:border-[#10b981]/30 transition-all duration-300 scale-110" />
              </div>

              {/* Floating rating indicator */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-full px-2 py-0.5 flex items-center gap-1 border border-[#e5e7eb] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                <Star className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]" />
                <span className="text-xs font-semibold text-[#111827]">
                  {vendor.averageRating}
                </span>
              </div>
            </div>

            {/* Store name with hover effect */}
            <h3 className="font-semibold text-sm mb-2 text-[#111827] group-hover:text-[#10b981] transition-colors duration-300 line-clamp-1">
              {vendor.storeName}
            </h3>

            {/* Rating stars */}
            <div className="flex items-center justify-center gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(vendor.averageRating!)
                      ? "fill-[#f59e0b] text-[#f59e0b]"
                      : i < vendor.averageRating!
                        ? "fill-[#f59e0b]/50 text-[#f59e0b]/50"
                        : "fill-gray-200 text-gray-200"
                  } transition-all duration-300`}
                />
              ))}
            </div>

            {/* Location and Join Date */}
            <div className="flex items-center justify-center gap-3 mb-3 text-xs">
              {vendor.location && (
                <div className="flex items-center gap-1 text-[#6b7280] group-hover:text-[#10b981] transition-colors duration-300">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-[80px]">{vendor.location}</span>
                </div>
              )}
              {vendor.joinDate && (
                <div className="flex items-center gap-1 text-[#6b7280] group-hover:text-[#10b981] transition-colors duration-300">
                  <Calendar className="h-3 w-3" />
                  <span>{formatJoinDate(vendor.joinDate)}</span>
                </div>
              )}
            </div>

            {/* Stats with icons */}
            <div className="flex items-center justify-center gap-4 text-xs mb-3">
              <div className="flex items-center gap-1 text-[#6b7280] group-hover:text-[#111827] transition-colors">
                <div className="w-1 h-1 rounded-full bg-[#10b981] group-hover:scale-125 transition-transform" />
                <span>{vendor.totalProducts} items</span>
              </div>
              <div className="flex items-center gap-1 text-[#10b981] font-medium">
                <TrendingUp className="h-3 w-3" />
                <span>{vendor.totalOrders} sales</span>
              </div>
            </div>

            {/* Hover action button */}
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <button className="w-full text-xs bg-[#10b981]/10 text-[#10b981] py-1.5 rounded-lg font-medium hover:bg-[#10b981] hover:text-white transition-all duration-300">
                View Store
              </button>
            </div>

            {/* Decorative sparkle effect on hover */}
            {hoveredVendor === vendor.storeName && (
              <div className="absolute inset-0 pointer-events-none">
                <Sparkles className="absolute top-1/4 left-1/4 h-3 w-3 text-[#10b981]/40 animate-ping" />
                <Sparkles className="absolute bottom-1/4 right-1/4 h-2 w-2 text-[#10b981]/40 animate-pulse" />
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
};