export interface Product {
  createdAt: string | number | Date;
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
  originalPrice?: number;
  rating?: number;
  // Aggregated stats
  ordersCount?: number;
  products?: string[];
  
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
  data: any
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
  trendingToday: Product[];
  trendingWeek: Product[]

  // UI States
  isLoadingProducts: boolean;
  isLoadingCategories: boolean;
  isLoadingProduct: boolean;
  isLoadingTrending: boolean;
  error: string | null;

  // Filters
  filters: ExploreFilters;
}