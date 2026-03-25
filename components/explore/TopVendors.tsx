"use client";

import { Card } from "@/components/ui/Card";
import { Award, Star } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { useExplore } from "@/hooks/useExplore";
import Image from "next/image";

export const TopVendors = () => {
  const { topVendors, categories } = useExplore();

  return (
    <section>
      <SectionHeader
        icon={Award}
        title="Top Vendors"
        subtitle="Trusted sellers with high ratings"
        iconBg="bg-[#10b981]/10"
      />
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {topVendors.map((vendor) => (
          <Card
            key={vendor.storeName}
            className="text-center p-4 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border border-[#e5e7eb] hover:border-[#10b981]/20"
          >
            <Image
              src={vendor.logo!}
              height={60}
              width={60}
              alt="Vendor profile image"
            />
            <h3 className="font-semibold text-sm mb-1 text-[#111827]">
              {vendor.storeName}
            </h3>
            <div className="flex items-center justify-center gap-1 text-xs mb-2">
              <Star className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]" />
              <span className="font-medium text-[#111827]">
                {vendor.averageRating}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-xs">
              <span className="text-[#6b7280]">
                {vendor.totalProducts} items
              </span>
              <span className="text-[#10b981] font-medium">
                {vendor.totalOrders} sales
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
