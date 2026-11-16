"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

type ForgotValues = {
  email: string;
};

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({ resolver: yupResolver(schema) });

  const [msg, setMsg] = useState("");

  const onSubmit = async (data: ForgotValues) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      toast.success(result.message);
      setMsg(result.message);
    } else {
      toast.error(result.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Forgot Your Password?</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your email and we will send you a reset link.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="email"
            label="Email"
            leftElement={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            placeholder="Enter email"
            className="pl-9 py-4"
            {...register("email")}
          />

          <Button type="submit" className="w-full bg-primary text-white">
            Reset Password
          </Button>
        </form>

        <div className="mt-3 text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Back to Login
          </Link>
        </div>
        <div className="mt-3 text-center text-green-600 font-bold text-xs">{msg}</div>
      </div>
    </div>
  );
}
