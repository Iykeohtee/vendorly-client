'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Eye, EyeOff, Home } from 'lucide-react';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  storeName: z.string().min(2, 'Store name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().min(10, 'Phone number is required'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      const response = await signup(
        data.fullName,
        data.email,
        data.password,
        'vendor',
        data.storeName,
        data.phoneNumber
      );
      showToast('Account created successfully!', 'success');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to create account', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-bold text-gray-800 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          className="w-full"
          {...register('fullName')}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="storeName" className="block text-sm font-bold text-gray-800 mb-2">
          Store Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="storeName"
          type="text"
          placeholder="e.g., lyke Collections"
          className="w-full"
          {...register('storeName')}
        />
        {errors.storeName && (
          <p className="text-red-500 text-sm mt-1">{errors.storeName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="w-full"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-2">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            className="w-full pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-green-500 hover:bg-green-600 text-white inline-flex items-center justify-center gap-2" 
        disabled={isLoading}
      >
        <Home className="h-5 w-5" />
        {isLoading ? 'Creating...' : 'Create My Store'}
      </Button>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-green-500 hover:underline">
          Sign in here
        </Link>
      </div>
    </form>
  );
}

