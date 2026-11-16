"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { toast } from "sonner";
import Link from "next/link";

export default function PlatformLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        router.push("/platform/dashboard");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-semibold text-primary">Platform Login</h1>
        <Input
          type="email"
          label="Email"
          placeholder="Enter email"
          className="pl-9"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftElement={<Mail className="h-4 w-4" />}
          required
        />
        <Input
          type="password"
          label="Password"
          placeholder="Enter password"
          className="pl-9"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftElement={<Lock className="h-4 w-4" />}
          showPasswordToggle
          required
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              Logging in...
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          ) : (
            "Login"
          )}
        </Button>
        <p className="text-sm text-center">
          No account?{" "}
          <Link href="/platform/register" className="underline text-primary">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}