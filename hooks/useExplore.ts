import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { exploreService } from "@/app/services/explore.service";
import {
  setLoadingProducts,
  setLoadingCategories,
  setLoadingProduct,
  setError,
  setProducts,
  setCategories,
  setSelectedProduct,
  setFilters,
  setPage,
  clearSelectedProduct,
} from "@/redux/slices/exploreSlice";
import { ExploreFilters } from "@/types/explore";

export const useExplore = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const explore = useSelector((state: RootState) => state.explore);

  // Query for products
  const productsQuery = useQuery({
    queryKey: ["explore", "products", explore.filters],
    queryFn: async () => {
      dispatch(setLoadingProducts(true));
      try {
        const { page, limit, category, search } = explore.filters;

        let response;
        if (search) {
          response = await exploreService.searchProducts(search, page, limit);
        } else if (category) {
          response = await exploreService.getProductsByCategory(
            category,
            page,
            limit,
          );
        } else {
          response = await exploreService.getTopProducts(page, limit);
        }

        dispatch(setProducts(response));
        return response;
      } catch (error: any) {
        dispatch(
          setError(error.response?.data?.message || "Failed to fetch products"),
        );
        throw error;
      } finally {
        dispatch(setLoadingProducts(false));
      }
    },
  });

  // Query for categories
  const categoriesQuery = useQuery({
    queryKey: ["explore", "categories"],
    queryFn: async () => {
      dispatch(setLoadingCategories(true));
      try {
        const response = await exploreService.getCategories();
        dispatch(setCategories(response));
        return response;
      } catch (error: any) {
        dispatch(
          setError(
            error.response?.data?.message || "Failed to fetch categories",
          ),
        );
        throw error;
      } finally {
        dispatch(setLoadingCategories(false));
      }
    },
  });

  // Query for single product
  const useProductDetails = (productId: string) => {
    return useQuery({
      queryKey: ["explore", "product", productId],
      queryFn: async () => {
        dispatch(setLoadingProduct(true));
        try {
          const response = await exploreService.getProductById(productId);
          dispatch(setSelectedProduct(response));
          return response;
        } catch (error: any) {
          dispatch(
            setError(
              error.response?.data?.message || "Failed to fetch product",
            ),
          );
          throw error;
        } finally {
          dispatch(setLoadingProduct(false));
        }
      },
      enabled: !!productId,
    });
  };

  // Actions
  const updateFilters = (newFilters: Partial<ExploreFilters>) => {
    dispatch(setFilters(newFilters));
  };

  const changePage = (page: number) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectProduct = (productId: string) => {
    queryClient
      .fetchQuery({
        queryKey: ["explore", "product", productId],
        queryFn: () => exploreService.getProductById(productId),
      })
      .then((data) => {
        dispatch(setSelectedProduct(data));
      });
  };

  const clearSelected = () => {
    dispatch(clearSelectedProduct());
  };

  const refreshProducts = () => {
    queryClient.invalidateQueries({ queryKey: ["explore", "products"] });
  };

  // Load categories on mount
  useEffect(() => {
    categoriesQuery.refetch();
  }, []);

  return {
    // Data
    products: explore.products,
    categories: explore.categories,
    selectedProduct: explore.selectedProduct,
    pagination: explore.pagination,
    filters: explore.filters,

    // Loading states
    isLoadingProducts: explore.isLoadingProducts || productsQuery.isLoading,
    isLoadingCategories: explore.isLoadingCategories,
    isLoadingProduct: explore.isLoadingProduct,
    isFetchingProducts: productsQuery.isFetching,

    // Error
    error: explore.error,

    // Query objects
    productsQuery,
    categoriesQuery,
    useProductDetails,

    // Actions
    updateFilters,
    changePage,
    selectProduct,
    clearSelected,
    refreshProducts,
  };
};
