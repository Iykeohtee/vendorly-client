import { Store } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: any[];
  isLoading: boolean;
  onViewDetails: (id: string) => void;
  formatCurrency: (amount: number) => string;
}

export const ProductGrid = ({
  products,
  isLoading,
  onViewDetails,
  formatCurrency,
}: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-xl" />
            <div className="p-4 space-y-3 bg-white rounded-b-xl">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="p-6 bg-gray-100 rounded-full inline-block mb-4">
          <Store className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={onViewDetails}
          formatCurrency={formatCurrency}
        />
      ))}
    </div>
  );
};
