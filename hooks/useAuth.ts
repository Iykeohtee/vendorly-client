"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setCredentials, logout, updateUser } from "@/redux/slices/authSlice";
import { User, AuthResponse } from "@/types/user";
import axiosInstance from "@/lib/axios";
import { useState } from "react";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const [verificationStatus, setVerificationStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false,
  });

  const login = async (
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    dispatch(setCredentials(response.data));
    return response.data;
  };

  const signup = async (
    fullName: string,
    email: string,
    password: string,
    role: "VENDOR" | "CUSTOMER",
    storeName?: string,
    phone?: string,
    location?: string,
  ): Promise<AuthResponse> => {
    const payload: any = { fullName, email, password, role, phone, location };
    if (role === "VENDOR") {
      payload.storeName = storeName;
    }
    const response = await axiosInstance.post<AuthResponse>( 
      "/auth/register",
      payload,
    );
    dispatch(setCredentials(response.data));
    return response.data;
  };

  const verifyEmail = async (
    token: string,
  ): Promise<{ success: boolean; message: string }> => {
    setVerificationStatus({ loading: true, error: null, success: false });

    try {
      const response = await axiosInstance.get(
        `/auth/verify-email?token=${token}`,
      );
      console.log(response);

      setVerificationStatus({ loading: false, error: null, success: true });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to verify email";
      setVerificationStatus({
        loading: false,
        error: errorMessage,
        success: false,
      });
      return { success: false, message: errorMessage };
    }
  };

  const resendVerificationEmail = async (
    email: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      await axiosInstance.post("/auth/resend-verification", { email });
      return { success: true, message: "Verification email resent!" };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend email";
      return { success: false, message: errorMessage };
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isAuthenticated,
    verificationStatus,
    login,
    signup,
    logout: handleLogout,
    verifyEmail,
    resendVerificationEmail,
  };
};
