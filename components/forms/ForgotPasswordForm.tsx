'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      // TODO: Implement forgot password API call
      // await forgotPassword(data.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      showToast('Password reset link sent to your email!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to send reset link', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-gray-800 mb-2">
            We've sent a password reset link to your email address.
          </p>
          <p className="text-sm text-gray-600">
            Please check your inbox and follow the instructions to reset your password.
          </p>
        </div>
        <Link href="/login">
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
            Back to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      <Button 
        type="submit" 
        className="w-full bg-green-500 hover:bg-green-600 text-white" 
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>

      <div className="text-center text-sm text-gray-600">
        Remember your password?{' '}
        <Link href="/login" className="text-green-500 hover:underline">
          Sign in here
        </Link>
      </div>
    </form>
  );
}

