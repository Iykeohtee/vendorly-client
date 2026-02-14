"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const page = () => {
  const { user } = useAuth();
  const router = useRouter();

  // If no user, redirect to signup
  if (!user) {
    router.push("/signup");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center">
        Check your email, {user.email}
      </h1>
      <p className="mt-4 text-gray-600 text-center">
        We've sent a verification link to your email address. Please verify your
        email before logging in.
      </p>
    </div>
  );
};

export default page;
