import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { Order } from "@/types/order";
import { orderService } from "@/app/services/order.service";
import { addOrder } from "@/redux/slices/orderSlice";
import { setError } from "@/redux/slices/storeSlice";

interface CreateOrderData {
  productId: string;
  vendorId: string;
  customerName: string;
  customerPhone: string;
  customerId: string;
  productName: string;
}

export const useOrder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

//   const { user } = useSelector((state: RootState) => state.auth); 

  const { orders, selectedOrder, isLoading, error } = useSelector(
    (state: RootState) => state.order,
  );

  const createOrder = useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      const response = await orderService.trackWhatsAppClick(orderData);
      return response;
    },
    onSuccess: (data) => {
      dispatch(addOrder(data));
      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-stats"] });
    },
    onError: (error) => {
      dispatch(
        setError(
          error instanceof Error ? error.message : "Failed to create order",
        ),
      );
    },
  });

  return {
    // data from redux
    orders,
    selectedOrder,
    isLoading,
    error,

    // actions
    createOrder: createOrder.mutateAsync,

    isCreating: createOrder.isPending,
  };
};
