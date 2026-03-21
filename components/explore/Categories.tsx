"use client";

import {
  Sparkles,
  Zap,
  Award,
  Package,
  Heart,
  TrendingUp,
  Star,
} from "lucide-react";

const categories = [
  { name: "All", icon: Sparkles, count: 248 },
  { name: "Electronics", icon: Zap, count: 64 },
  { name: "Fashion", icon: Award, count: 52 },
  { name: "Home & Living", icon: Package, count: 38 },
  { name: "Health & Beauty", icon: Heart, count: 31 },
  { name: "Gadgets", icon: TrendingUp, count: 27 },
  { name: "Accessories", icon: Star, count: 36 },
];

interface CategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const Categories = ({
  activeCategory,
  onCategoryChange,
}: CategoriesProps) => {
  return (
    <section className="py-6 border-b border-[#e5e7eb] bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => onCategoryChange(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#10b981] text-white shadow-md"
                    : "bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb] hover:text-[#111827]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.name}
                <span
                  className={`text-xs ${isActive ? "text-white/70" : "text-[#9ca3af]"}`}
                >
                  ({cat.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
