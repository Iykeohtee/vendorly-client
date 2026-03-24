import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Product,
  Category,
  ProductsResponse,
  ExploreState,
  ExploreFilters,
} from "@/types/explore";

const initialState: ExploreState = {
  // Data
  products: [],
  selectedProduct: null,
  categories: [],
  pagination: null,

  trendingToday: [],
  trendingWeek: [],

  // UI States
  isLoadingProducts: false,
  isLoadingCategories: false,
  isLoadingProduct: false,
  isLoadingTrending: false,
  error: null,

  // Filters
  filters: {
    page: 1,
    limit: 20,
    category: undefined,
    search: undefined,
  },
};

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    // Loading states
    setLoadingProducts: (state, action: PayloadAction<boolean>) => {
      state.isLoadingProducts = action.payload;
    },
    setLoadingCategories: (state, action: PayloadAction<boolean>) => {
      state.isLoadingCategories = action.payload;
    },
    setLoadingProduct: (state, action: PayloadAction<boolean>) => {
      state.isLoadingProduct = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Data setters
    setProducts: (state, action: PayloadAction<ProductsResponse>) => {
      state.products = action.payload.products;
      state.pagination = action.payload.pagination;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },

    setLoadingTrending: (state, action: PayloadAction<boolean>) => {
      state.isLoadingTrending = action.payload;
    },

    setTrendingToday: (state, action: PayloadAction<any>) => {
      state.trendingToday = action.payload.products;
    },
    setTrendingWeek: (state, action: PayloadAction<any>) => {
      state.trendingWeek = action.payload.products;
    },

    // Filters
    setFilters: (state, action: PayloadAction<Partial<ExploreFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to page 1 when filters change
      if (
        action.payload.category !== undefined ||
        action.payload.search !== undefined
      ) {
        state.filters.page = 1;
      }
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Clear
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoadingProducts,
  setLoadingCategories,
  setLoadingProduct,
  setLoadingTrending,
  setError,
  setProducts,
  setCategories,
  setSelectedProduct,
  setTrendingToday,
  setTrendingWeek,
  setFilters,
  setPage,
  resetFilters,
  clearSelectedProduct,
  clearError,
} = exploreSlice.actions;

export default exploreSlice.reducer;
