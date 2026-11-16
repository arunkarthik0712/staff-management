"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Building } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { toast } from "sonner";
import Link from "next/link";

export default function TenantRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    tenantSlug: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.tenantSlug) {
      toast.error("Tenant slug is required");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/tenant/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          tenantSlug: formData.tenantSlug,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Registration successful! Please login.");
      router.push("/tenant/login");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-semibold text-primary">Tenant Registration</h1>
        <Input
          type="text"
          label="Tenant Slug"
          placeholder="your-company"
          name="tenantSlug"
          value={formData.tenantSlug}
          onChange={handleChange}
          leftElement={<Building className="h-4 w-4" />}
          required
        />
        <Input
          type="email"
          label="Email"
          placeholder="Enter email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          leftElement={<Mail className="h-4 w-4" />}
          required
        />
        <Input
          type="password"
          label="Password"
          placeholder="Enter password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          leftElement={<Lock className="h-4 w-4" />}
          showPasswordToggle
          required
        />
        <Input
          type="password"
          label="Confirm Password"
          placeholder="Re-enter password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          leftElement={<Lock className="h-4 w-4" />}
          showPasswordToggle
          required
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              Creating account...
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/tenant/login" className="underline text-primary">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}