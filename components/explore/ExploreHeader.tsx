"use client";

import {
  MessageCircle,
  Search,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  User2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";

interface ExploreHeaderProps {
  wishlistCount: number;
  cartCount: number;
  onSearch: (query: string) => void;
}

export const ExploreHeader = ({
  wishlistCount,
  cartCount,
  onSearch,
}: ExploreHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    setShowUserMenu(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b border-[#e5e7eb] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MessageCircle className="h-7 w-7 text-[#10b981]" />
            <span className="text-xl font-bold text-[#111827]">Vendorly</span>
          </Link>
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
              <Input
                type="search"
                placeholder="Search products, vendors, categories..."
                className="pl-10 h-10 bg-[#f9fafb] border-[#e5e7eb]"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-[#f3f4f6]"
            >
              <Heart className="h-5 w-5 text-[#6b7280]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#ef4444] text-white text-[10px] flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-[#f3f4f6]"
            >
              <ShoppingCart className="h-5 w-5 text-[#6b7280]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#10b981] text-white text-[10px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#f3f4f6] transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] flex items-center justify-center text-white text-sm font-medium">
                    {getInitials(user.fullName || user.email || "User")}
                  </div>
                  <span className="text-sm font-medium text-[#374151] hidden sm:block">
                    {user.fullName?.split(" ")[0] || "User"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#e5e7eb] z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#e5e7eb]">
                        <p className="text-sm font-medium text-[#111827]">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-[#6b7280] mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        {user.role === "VENDOR" ? (
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#374151] hover:bg-[#f3f4f6] transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="h-4 w-4" />
                            Dashboard
                          </Link>
                        ) : (
                          <Link
                            href="/explore"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#374151] hover:bg-[#f3f4f6] transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User2 className="h-4 w-4" />
                            Profile 
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex gap-2 border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6] hover:text-[#111827]"
                >
                  <User className="h-4 w-4" /> Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 h-10 bg-[#f9fafb] border-[#e5e7eb]"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
