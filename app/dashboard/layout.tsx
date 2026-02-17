"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  Wallet,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

// Shadcn UI components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Finances",
    href: "/dashboard/finances",
    icon: Wallet,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

// Copy button component
const CopyButton = ({ storeUrl }: { storeUrl: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleCopy}
          className={cn(
            "p-1 rounded-md transition-all",
            copied
              ? "bg-green-100 text-green-600"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
          )}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{copied ? "Copied!" : "Copy store link"}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 z-30 h-full bg-white border-r border-gray-200 transition-all duration-300",
            sidebarOpen ? "w-64" : "w-20",
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0",
          )}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div
              className={cn(
                "flex items-center gap-2",
                !sidebarOpen && "justify-center w-full",
              )}
            >
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              {sidebarOpen && (
                <span className="font-bold text-gray-800">Vendorly</span>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-1.5 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight
                className={cn(
                  "h-5 w-5 text-gray-500 transition-transform",
                  !sidebarOpen && "rotate-180",
                )}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative group",
                    isActive
                      ? "bg-green-50 text-green-600"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive && "text-green-600",
                    )}
                  />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-sm font-medium">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
                      {item.title}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="space-y-1">
              <Link
                href="/dashboard/settings"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100",
                  !sidebarOpen && "justify-center",
                )}
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">Settings</span>}
              </Link>
              <button
                onClick={logout}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100",
                  !sidebarOpen && "justify-center",
                )}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">Logout</span>}
              </button>
            </div>

            {sidebarOpen && user && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.role === "VENDOR" ? "Vendor" : "Customer"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div
          className={cn(
            "transition-all duration-300",
            sidebarOpen ? "lg:ml-64" : "lg:ml-20",
            "ml-0",
          )}
        >
          {/* Top bar */}
          <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>

              <div className="flex-1" />

              {/* Store link with copy functionality */}
              <div className="flex items-center gap-4">
                {user?.vendor?.storeSlug && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                    {/* Store link with tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/${user.vendor.storeSlug}`}
                          className="group flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                          target="_blank"
                        >
                          <span>My Store</span>
                          <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="max-w-xs text-center bg-green-700"
                      >
                        <p>
                          Copy your store link and share with your customers
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Copy button (already has its own tooltip) */}
                    <CopyButton
                      storeUrl={`${process.env.NEXT_PUBLIC_CLIENT_URL}/${user.vendor.storeSlug}`}
                    />
                  </div>
                )}

                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
