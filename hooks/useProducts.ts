'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Product, CreateProductDto, UpdateProductDto } from '@/types/product';

export const useProducts = (vendorId?: string) => {
  return useQuery({
    queryKey: ['products', vendorId],
    queryFn: async () => {
      const url = vendorId ? `/products?vendorId=${vendorId}` : '/products';
      const response = await axiosInstance.get<Product[]>(url);
      return response.data;
    },
  });
};

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await axiosInstance.get<Product>(`/products/${productId}`);
      return response.data;
    },
    enabled: !!productId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductDto) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('quantity', data.quantity.toString());
      data.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axiosInstance.post<Product>('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProductDto) => {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.price) formData.append('price', data.price.toString());
      if (data.quantity) formData.append('quantity', data.quantity.toString());
      if (data.images) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await axiosInstance.put<Product>(`/products/${data.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      await axiosInstance.delete(`/products/${productId}`);
      return productId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

