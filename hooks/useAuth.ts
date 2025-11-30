'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { setCredentials, logout } from '@/redux/slices/authSlice';
import { User, AuthResponse } from '@/types/user';
import axiosInstance from '@/lib/axios';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', { email, password });
    dispatch(setCredentials(response.data));
    return response.data;
  };

  const signup = async (
    fullName: string,
    email: string,
    password: string,
    role: 'vendor' | 'customer',
    storeName?: string,
    phoneNumber?: string
  ): Promise<AuthResponse> => {
    const payload: any = { fullName, email, password, role };
    if (role === 'vendor') {
      payload.storeName = storeName;
      payload.phoneNumber = phoneNumber;
    }
    const response = await axiosInstance.post<AuthResponse>('/auth/signup', payload);
    dispatch(setCredentials(response.data));
    return response.data;
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    signup,
    logout: handleLogout,
  };
};

