"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

type RegisterValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: yupResolver(schema),
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: { email: string; password: string }) => {
      const response = await axios.post("/api/auth/register", userData);
      return response.data;
    },
    onSuccess: async (_, variables) => {
      const result = await signIn("credentials", {
        email: variables.email,
        password: variables.password,
        redirect: false,
      });

      if (!result?.error) {
        toast.success("Registration successful!");
        await getSession();
        router.replace("/dashboard");
        router.refresh();
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  const onSubmit = (data: RegisterValues) => {
    registerMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-8 rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-semibold text-primary">Register</h1>
        <Input
          type="email"
          label="Email"
          placeholder="Enter email"
          className="pl-9"
          error={errors.email?.message}
          leftElement={<Mail className="h-4 w-4" />}
          {...register("email")}
        />
        <Input
          type="password"
          label="Password"
          placeholder="Enter password"
          className="pl-9"
          error={errors.password?.message}
          leftElement={<Lock className="h-4 w-4" />}
          showPasswordToggle
          {...register("password")}
        />
        <Input
          type="password"
          label="Confirm Password"
          placeholder="Re-enter password"
          className="pl-9"
          error={errors.confirmPassword?.message}
          leftElement={<Lock className="h-4 w-4" />}
          showPasswordToggle
          {...register("confirmPassword")}
        />
        <Button
          type="submit"
          disabled={isSubmitting || registerMutation.isPending}
          className="w-full"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              Creating account...
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
        <p className="text-sm text-center">
          Already have an account? <Link href="/login" className="underline text-primary">Login</Link>
        </p>
      </form>
    </div>
  );
}
