import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryFilterProps {
  categories: Array<{ name: string; count: number }>;
  selectedCategory?: string;
  isLoading: boolean;
  onSelectCategory: (category?: string) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  isLoading,
  onSelectCategory,
}: CategoryFilterProps) => {
  if (isLoading) {
    return (
      <div className="flex gap-2 mb-8 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      <Badge
        variant={!selectedCategory ? "default" : "outline"}
        className={`px-4 py-2 cursor-pointer whitespace-nowrap ${
          !selectedCategory ? "bg-primary" : "hover:bg-primary/10"
        }`}
        onClick={() => onSelectCategory(undefined)}
      >
        All
      </Badge>

      {categories.map((category) => (
        <Badge
          key={category.name}
          variant={selectedCategory === category.name ? "default" : "outline"}
          className={`px-4 py-2 cursor-pointer whitespace-nowrap ${
            selectedCategory === category.name
              ? "bg-primary"
              : "hover:bg-primary/10"
          }`}
          onClick={() => onSelectCategory(category.name)}
        >
          {category.name} ({category.count})
        </Badge>
      ))}
    </div>
  );
};
