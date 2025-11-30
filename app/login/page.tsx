import LoginForm from '@/components/forms/LoginForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Home</span>
        </Link>

        {/* Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
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
                fill="#22c55e"
              />
            </svg>
            <span className="text-2xl font-bold text-gray-800">Vendorly</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-green-500 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}

