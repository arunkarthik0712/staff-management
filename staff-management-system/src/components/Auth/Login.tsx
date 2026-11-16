"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { getSession, signIn, useSession } from "next-auth/react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { toast } from "sonner";
import Link from "next/link";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type LoginValues = {
  email: string;
  password: string;
};

const DEFAULT_LOGIN_EMAIL = "admin@workbench.com";
const DEFAULT_LOGIN_PASSWORD = "admin123";

export default function Login() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: DEFAULT_LOGIN_EMAIL,
      password: DEFAULT_LOGIN_PASSWORD,
    },
  });

  const onSubmit = async (data: LoginValues) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    await getSession();
    router.replace("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-card text-card-foreground p-8 rounded-xl shadow space-y-4"
      >
        <h1 className="text-2xl font-semibold text-primary">Login</h1>
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
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm underline text-primary"
          >
            Forgot Password?
          </Link>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              Logging in...
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          ) : (
            "Login"
          )}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          No account?{" "}
          <Link href="/register" className="underline text-primary">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
