"use client";

import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/redux/store";
import { queryClient } from "@/lib/queryClient";
import { ToastProvider } from "@/components/ui/Toast";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Navbar from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();

  const authPaths = [
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/verifyEmail",
  ];

  const shouldHideNavbar = authPaths.includes(pathName);

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <TooltipProvider>
                {!shouldHideNavbar && <Navbar />}
                <main className="min-h-screen bg-gray-50">{children}</main>
              </TooltipProvider>
            </ToastProvider>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}
