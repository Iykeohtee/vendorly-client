export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
  vendorId: string;
  vendor?: {
    id: string;
    storeName: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  images: string[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  id: string;
}

