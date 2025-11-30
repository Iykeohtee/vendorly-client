'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Top border line */}
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
                  {user?.role === 'vendor' ? (
                    <Link href="/dashboard">
                      <Button variant="ghost" size="sm">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/explore">
                      <Button variant="ghost" size="sm">
                        Explore
                      </Button>
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{user?.fullName}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <span className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer">
                      Login
                    </span>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                      Get Started
                    </Button>
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

