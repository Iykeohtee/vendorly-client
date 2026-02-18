// hooks/useStore.ts
"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  setStore,
  setLoading,
  setError,
  clearStore,
  setSelectedProduct,
  updateProductQuantity,
  StoreData,
  StoreProduct,
} from "@/redux/slices/storeSlice";
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

interface UseStoreReturn {
  // State
  currentStore: StoreData | null;
  loading: boolean;
  error: string | null;
  selectedProduct: StoreProduct | null;

  // Store actions
  getStoreBySlug: (storeSlug: string) => Promise<StoreData | null>;
  clearCurrentStore: () => void;

  // Product actions
  selectProduct: (product: StoreProduct | null) => void;
  getProductById: (productId: string) => Promise<StoreProduct | null>;

  // Category and filter helpers
  getCategories: () => string[];
  filterByCategory: (category: string) => StoreProduct[];
  searchProducts: (query: string) => StoreProduct[];

  // WhatsApp integration
  createWhatsAppOrder: (product: StoreProduct, quantity?: number) => string;

  // Status
  isProductInStock: (productId: string) => boolean;
  getProductQuantity: (productId: string) => number;
}

export const useStore = (): UseStoreReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();

  const { currentStore, loading, error, selectedProduct } = useSelector(
    (state: RootState) => state.store,
  );

  const [requestStatus, setRequestStatus] = useState<{
    loading: boolean;
    error: string | null;
  }>({
    loading: false,
    error: null,
  });

  /**
   * Fetch store by slug (public endpoint)
   */
  const getStoreBySlug = async (
    storeSlug: string,
  ): Promise<StoreData | null> => {
    dispatch(setLoading(true));
    setRequestStatus({ loading: true, error: null });

    try {
      const response = await axiosInstance.get<StoreData>(
        `/store/${storeSlug}`,
      );

      dispatch(setStore(response.data));
      setRequestStatus({ loading: false, error: null });

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load store";

      dispatch(setError(errorMessage));
      setRequestStatus({ loading: false, error: errorMessage });

      showToast(errorMessage, "error");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Clear current store from state
   */
  const clearCurrentStore = () => {
    dispatch(clearStore());
  };

  /**
   * Select a product for modal/view
   */
  const selectProduct = (product: StoreProduct | null) => {
    dispatch(setSelectedProduct(product));
  };

  /**
   * Fetch single product by ID
   */
  const getProductById = async (
    productId: string,
  ): Promise<StoreProduct | null> => {
    try {
      const response = await axiosInstance.get(`/store/product/${productId}`);
      return response.data;
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to load product",
        "error",
      );
      return null;
    }
  };

  /**
   * Get all unique categories from current store products
   */
  const getCategories = (): string[] => {
    if (!currentStore) return [];

    const categories = new Set(currentStore.products.map((p) => p.category));
    return Array.from(categories);
  };

  /**
   * Filter products by category
   */
  const filterByCategory = (category: string): StoreProduct[] => {
    if (!currentStore) return [];

    if (category === "all") return currentStore.products;

    return currentStore.products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  };

  /**
   * Search products by name or description
   */
  const searchProducts = (query: string): StoreProduct[] => {
    if (!currentStore || !query.trim()) return currentStore?.products || [];

    const searchTerm = query.toLowerCase().trim();

    return currentStore.products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    );
  };

  /**
   * Create WhatsApp message for ordering
   */
  const createWhatsAppOrder = (
    product: StoreProduct,
    quantity: number = 1,
  ): string => {
    const storeUrl = `${window.location.origin}/${currentStore?.storeSlug}`;

    const message =
      `Hello, I'm interested in ordering:%0A%0A` +
      `*Product:* ${product.name}%0A` +
      `*Price:* ₦${product.price.toLocaleString()}%0A` +
      `*Quantity:* ${quantity}%0A` +
      `*Store:* ${storeUrl}%0A%0A` +
      `My delivery location: [Please add your address]`;

    return `https://wa.me/?text=${message}`;
  };

  /**
   * Check if product is in stock
   */
  const isProductInStock = (productId: string): boolean => {
    if (!currentStore) return false;

    const product = currentStore.products.find((p) => p.id === productId);
    return product ? product.quantity > 0 : false;
  };

  /**
   * Get product quantity
   */
  const getProductQuantity = (productId: string): number => {
    if (!currentStore) return 0;

    const product = currentStore.products.find((p) => p.id === productId);
    return product?.quantity || 0;
  };

  return {
    // State
    currentStore,
    loading: loading || requestStatus.loading,
    error: error || requestStatus.error,
    selectedProduct,

    // Store actions
    getStoreBySlug,
    clearCurrentStore,

    // Product actions
    selectProduct,
    getProductById,

    // Category and filter helpers
    getCategories,
    filterByCategory,
    searchProducts,

    // WhatsApp integration
    createWhatsAppOrder,

    // Status
    isProductInStock,
    getProductQuantity,
  };
};
