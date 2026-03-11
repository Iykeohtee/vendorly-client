import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { customerService } from "@/app/services/customer.service";
import {
  setFilters,
  clearSelectedCustomer,
  resetFilters,
} from "@/redux/slices/customerSlice";
import { CustomerQueryParams } from "@/types/customer";

export const useCustomer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  // Redux state
  const {
    customers,
    selectedCustomer,
    stats,
    pagination,
    isLoading,
    isFetchingOne,
    error,
    filters,
  } = useSelector((state: RootState) => state.customer);

  // Query for fetching customers
  const customersQuery = useQuery({
    queryKey: ["customers", filters],
    queryFn: () => customerService.getCustomers(filters),
  });

  // Query for fetching customer stats
  const statsQuery = useQuery({
    queryKey: ["customer-stats"],
    queryFn: () => customerService.getCustomerStats(),
  });

  // Query for fetching single customer
  const useCustomerById = (id: string) => {
    return useQuery({
      queryKey: ["customer", id],
      queryFn: () => customerService.getCustomerById(id),
      enabled: !!id,
    });
  };

  // Actions
  const updateFilters = (newFilters: Partial<CustomerQueryParams>) => {
    dispatch(setFilters(newFilters));
  };

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  const clearSelected = () => {
    dispatch(clearSelectedCustomer());
  };

  const refetchCustomers = () => {
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    queryClient.invalidateQueries({ queryKey: ["customer-stats"] });
  };

  return {
    // Data
    customers,
    selectedCustomer,
    stats,
    pagination,
    filters,

    // Loading states
    isLoading: isLoading || customersQuery.isLoading,
    isFetchingOne,
    isFetching: customersQuery.isFetching,
    error,

    // Queries
    useCustomerById,

    // Actions
    updateFilters,
    resetAllFilters,
    clearSelected,
    refetchCustomers,

    // Direct service access (if needed)
    getCustomerOrders: customerService.getCustomerOrders.bind(customerService),
  };
};
