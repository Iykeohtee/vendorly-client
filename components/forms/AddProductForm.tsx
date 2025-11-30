'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCreateProduct } from '@/hooks/useProducts';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  images: z.any(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const createProduct = useCreateProduct();
  const { showToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setValue('images', fileArray as any);
      
      // Create previews
      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);
      await createProduct.mutateAsync({
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        images: data.images || [],
      });
      showToast('Product added successfully!', 'success');
      router.push('/dashboard');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to add product', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="images" className="block text-sm font-medium mb-1">
              Product Images
            </label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images.message as string}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Pink Ankara Gown"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price (₦)
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="10000"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium mb-1">
              Quantity
            </label>
            <Input
              id="quantity"
              type="number"
              placeholder="10"
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe your product..."
              {...register('description')}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Adding Product...' : 'Add Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

