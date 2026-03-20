export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  tags: string[];
  quantity: number;
  discountPrice?: number;
  performanceScore?: number;
  
  // Aggregated stats
  ordersCount?: number;
  
  vendor: {
    id: string;
    storeName: string;
    storeSlug: string;
    user: {
      fullName: string;
    };
  };
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Category {
  name: string;
  count: number;
}

export interface ExploreFilters {
  category?: string;
  search?: string;
  page: number;
  limit: number;
}

export interface ExploreState {
  // Data
  products: Product[];
  selectedProduct: Product | null;
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;

  // UI States
  isLoadingProducts: boolean;
  isLoadingCategories: boolean;
  isLoadingProduct: boolean;
  error: string | null;

  // Filters
  filters: ExploreFilters;
}