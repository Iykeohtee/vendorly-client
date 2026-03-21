"use client";

import { Card } from "@/components/ui/Card";
import { Award, Star } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const topVendors = [
  {
    name: "TechZone NG",
    products: 48,
    rating: 4.9,
    sales: "2.3k",
    avatar: "🏪",
  },
  {
    name: "StyleVault",
    products: 36,
    rating: 4.8,
    sales: "1.8k",
    avatar: "👗",
  },
  {
    name: "GlowUp Beauty",
    products: 29,
    rating: 4.9,
    sales: "3.1k",
    avatar: "💄",
  },
  {
    name: "PhoneWorld",
    products: 52,
    rating: 4.7,
    sales: "4.2k",
    avatar: "📲",
  },
  {
    name: "Sneaker Hub",
    products: 41,
    rating: 4.8,
    sales: "1.5k",
    avatar: "👟",
  },
];

export const TopVendors = () => {
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
            key={vendor.name}
            className="text-center p-4 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border border-[#e5e7eb] hover:border-[#10b981]/20"
          >
            <div className="text-4xl mb-3">{vendor.avatar}</div>
            <h3 className="font-semibold text-sm mb-1 text-[#111827]">
              {vendor.name}
            </h3>
            <div className="flex items-center justify-center gap-1 text-xs mb-2">
              <Star className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]" />
              <span className="font-medium text-[#111827]">
                {vendor.rating}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-xs">
              <span className="text-[#6b7280]">{vendor.products} items</span>
              <span className="text-[#10b981] font-medium">
                {vendor.sales} sales
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
