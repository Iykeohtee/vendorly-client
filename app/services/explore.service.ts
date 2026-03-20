import axiosInstance from "@/lib/axios";
import { ProductsResponse, Category } from "@/types/explore";

export const exploreService = {
  // Get top products with filters
  getTopProducts: async (
    page: number = 1,
    limit: number = 20,
    category?: string,
  ): Promise<ProductsResponse> => {
    const params: any = { page, limit };
    if (category) params.category = category;

    const response = await axiosInstance.get("/explore/products"); 
    console.log(response.data)
    return response.data;
  },

  // Get single product details
  getProductById: async (id: string): Promise<any> => {
    const response = await axiosInstance.get(`/explore/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (
    category: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ProductsResponse> => {
    const response = await axiosInstance.get(`/explore/categories/${category}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get("/explore/categories");
    return response.data;
  },

  // Search products
  searchProducts: async (
    query: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ProductsResponse> => {
    const response = await axiosInstance.get("/explore/search", {
      params: { q: query, page, limit },
    });
    return response.data;
  },
};
