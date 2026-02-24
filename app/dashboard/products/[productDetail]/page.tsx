import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/useProducts";

const ProductDetail = () => {
  const params = useParams();
  const productId = params.productDetail as string;
  const { vendorProduct } = useProduct();

  const { data: product, isLoading, error } = vendorProduct(productId);

  console.log(product);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading product details.</div>;
  }

  return (
    <div>
      <h1>Product Detail</h1>
    </div>
  );
};

export default ProductDetail;
