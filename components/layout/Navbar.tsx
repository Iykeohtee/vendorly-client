"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import { LogOut, User, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This runs only on client after hydration
    setIsHydrated(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // During SSR and initial hydration, render a consistent loading state
  if (!isHydrated) {
    return (
      <>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100 shadow-sm">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="flex justify-between items-center h-16">
              {/* Logo with shimmer effect */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-8 w-8 bg-gradient-to-br from-green-100 to-green-200 rounded-xl animate-pulse"></div>
                  <ShoppingBag className="h-4 w-4 text-green-400 absolute inset-2" />
                </div>
                <div className="relative overflow-hidden">
                  <div className="h-6 w-28 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md animate-shimmer"></div>
                </div>
              </div>

              {/* Navigation skeleton */}
              <div className="flex items-center gap-4">
                {/* Menu items */}
                <div className="hidden md:flex items-center gap-4">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse hidden sm:block"></div>
                  <div className="h-9 w-24 bg-gradient-to-r from-green-200 to-green-300 rounded-lg animate-pulse"></div>
                  <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Add this to your global CSS if using Option 2 */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .animate-shimmer {
            position: relative;
            overflow: hidden;
          }
          .animate-shimmer::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            animation: shimmer 1.5s infinite;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="h-px bg-gray-300"></div>
      <nav className="bg-white sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xl font-bold text-gray-800">Vendorly</span>
            </Link>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {user?.role === "VENDOR" ? (
                    <Link
                      href="/dashboard"
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/explore"
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Explore
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {user?.vendor?.storeName}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 border border-red-700">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
