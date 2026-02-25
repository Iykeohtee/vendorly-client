"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

// Type for the dashboard stats
interface DashboardStats {
  revenue: {
    total: number;
    percentageChange: number;
  };
  orders: {
    total: number;
    percentageChange: number;
  };
  products: {
    total: number;
    newThisMonth: number;
  };
  customers: {
    total: number;
    newThisMonth: number;
    percentageChange: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    items: any[];
    customer: {
      user: {
        fullName: string;
      };
    };
  }>;
}

// Single API call to get all dashboard data
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get("/dashboard/stats");
  console.log(response.data)
  return response.data;
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  // Single query for all dashboard data
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000, 
    refetchInterval: 30000, 
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading skeleton during SSR and initial fetch
  if (!mounted || isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-4 w-96 bg-gray-200 rounded mt-2"></div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome back!{" "}
          <span className="text-green-500 font-bold">
            {user?.vendor?.storeName || "Guest"}
          </span>
        </p>
      </div>

      {/* Stats cards - All data comes from single API call */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{stats?.revenue?.total?.toLocaleString() || "0"}
            </div>
            <p
              className={`text-xs mt-1 ${
                (stats?.revenue?.percentageChange || 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {(stats?.revenue?.percentageChange || 0) >= 0 ? "+" : ""}
              {stats?.revenue?.percentageChange || 0}% from last month
            </p>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.orders?.total?.toLocaleString() || "0"}
            </div>
            <p
              className={`text-xs mt-1 ${
                (stats?.orders?.percentageChange || 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {(stats?.orders?.percentageChange || 0) >= 0 ? "+" : ""}
              {stats?.orders?.percentageChange || 0}% from last month
            </p>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Products
            </CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.products?.total || 0}
            </div>
            <p className="text-xs text-green-600 mt-1">
              +{stats?.products?.newThisMonth || 0} new this month
            </p>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Customers
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.customers?.total || 0}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p
                className={`text-xs ${
                  (stats?.customers?.percentageChange || 0) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(stats?.customers?.percentageChange || 0) >= 0 ? "+" : ""}
                {stats?.customers?.percentageChange || 0}%
              </p>
              <p className="text-xs text-gray-500">
                ({stats?.customers?.newThisMonth || 0} new this month)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentOrders?.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      #{order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.customer?.user?.fullName || "Customer"} • ₦
                      {order.total.toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    order.status === "COMPLETED"
                      ? "bg-green-100 text-green-600"
                      : order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-600"
                        : order.status === "PROCESSING"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
