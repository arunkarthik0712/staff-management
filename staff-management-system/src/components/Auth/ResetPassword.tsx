"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";

const schema = yup.object({
  password: yup.string().min(6, "At least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm password"),
});

type ResetValues = {
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");
  const token = params.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: ResetValues) => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ ...data, email, token }),
    });

    const result = await res.json();

    if (res.ok) {
      toast.success(result.message);
      router.push("/login");
    } else {
      toast.error(result.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">Reset password</h2>
        <p className="text-sm text-gray-500 mb-6">Set your new password</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left flex flex-col">
          <Input
            type="password"
            placeholder="New password"
            className="pl-9 py-4"
            label="Password"
            leftElement={<LockKeyhole className="w-4 h-4" />}
            showPasswordToggle
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            type="password"
            placeholder="Re-enter password"
            className="pl-9 py-4"
            label="Confirm Password"
            leftElement={<LockKeyhole className="w-4 h-4" />}
            showPasswordToggle
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button type="submit" className="w-full font-semibold py-3 text-base rounded-full">
            Reset Password
          </Button>

          <div className="mt-3 text-center">
            <Link href="/login" className="text-sm text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
