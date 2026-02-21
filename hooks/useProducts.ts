"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Product, CreateProductDto, UpdateProductDto } from "@/types/product";
import { setProducts } from "@/redux/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";

export const useProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const { products, selectedProduct } = useSelector(
    (state: RootState) => state.products,
  );

  const useProducts = (vendorId?: string) => {
    return useQuery({
      queryKey: ["products", vendorId],
      queryFn: async () => {
        const url = vendorId ? `/products?vendorId=${vendorId}` : "/products";
        const response = await axiosInstance.get<Product[]>(url);
        dispatch(setProducts(response.data));
        return response.data;
      },
    });
  };

  const useSingleProduct = (productId: string) => {
    return useQuery({
      queryKey: ["product", productId],
      queryFn: async () => {
        const response = await axiosInstance.get<Product>(
          `/products/${productId}`,
        );
        return response.data;
      },
      enabled: !!productId,
    });
  };

  const createProduct = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axiosInstance.post<Product>(
        "/products/create-product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      dispatch(setProducts([response.data]));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Error creating product:", error);
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const response = await axiosInstance.put<Product>(
        `/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (productId: string) => {
      await axiosInstance.delete(`/products/${productId}`);
      return productId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    products,
    selectedProduct,
    useProducts,
    useSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
