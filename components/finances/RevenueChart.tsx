"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DailyRevenueChartSkeleton } from "./FinanceSkeleton";
import { DailyRevenue } from "@/types/finance";

interface DailyRevenueChartProps {
  data: DailyRevenue[];
  isLoading: boolean;
  onDaysChange: (days: number) => void;
  days: number;
  formatCurrency: (amount: number) => string;
}

export const DailyRevenueChart = ({
  data,
  isLoading,
  onDaysChange,
  days,
  formatCurrency,
}: DailyRevenueChartProps) => {
  if (isLoading) return <DailyRevenueChartSkeleton />;

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Daily Revenue</CardTitle>
        <select
          className="text-sm border rounded-md px-2 py-1"
          value={days}
          onChange={(e) => onDaysChange(Number(e.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end gap-1">
          {data.map((day, index) => (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center group"
            >
              <div className="relative w-full">
                <div
                  className="bg-primary/20 hover:bg-primary/30 transition-colors rounded-t-sm mx-0.5"
                  style={{ height: `${(day.revenue / maxRevenue) * 200}px` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {formatCurrency(day.revenue)}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-2 rotate-45 origin-left">
                {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};