"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useProduct } from "@/hooks/useProducts";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import axiosInstance from "@/lib/axios";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().min(0, "Quantity must be positive"),
  images: z.any(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { createProduct } = useProduct();
  const { showToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setValue("images", fileArray as any);

      // Create previews
      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImagePreviews((prev) => {
      const newPreviews = prev.filter((_, index) => index !== indexToRemove);
      return newPreviews;
    });
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await axiosInstance.post<{ urls: string[] }>(
      "upload/images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.urls;
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);

      const imageUrls = await uploadImages(data.images);
      await createProduct.mutateAsync({
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        images: imageUrls,
        category: data.category,
      });
      showToast("Product added successfully!", "success");
      router.push("/dashboard");
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to add product",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-200 bg-gray-50">
        <CardTitle className="text-xl font-bold text-gray-800">
          Add New Product
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Fill in the details below to add a new product to your inventory
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Product Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-500 transition-colors">
              <div className="space-y-2 text-center">
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {imagePreviews.length < 5 && (
                      <label
                        htmlFor="images"
                        className="w-full h-24 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-green-500 transition-colors"
                      >
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">
                          Add more
                        </span>
                      </label>
                    )}
                  </div>
                ) : (
                  <label
                    htmlFor="images"
                    className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                  >
                    <div className="flex flex-col items-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <span className="relative rounded-md bg-white font-medium text-green-600 hover:text-green-500">
                          Upload images
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each (max 5 images)
                      </p>
                    </div>
                  </label>
                )}
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">
                {errors.images.message as string}
              </p>
            )}
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Pink Ankara Gown"
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <Input
              id="category"
              type="text"
              placeholder="Clothing, Electronics, etc."
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              {...register("category")}
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Price and Quantity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price (₦)
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="10000"
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                placeholder="10"
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                {...register("quantity", { valueAsNumber: true })}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe your product in detail..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white inline-flex items-center justify-center gap-2 py-2.5"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding Product...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
