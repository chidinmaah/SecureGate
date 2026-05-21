"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/validations";
import { Input, Button, Alert } from "@/components/ui";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

type LoginValues = z.infer<typeof LoginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === "unverified") {
          setError("Please verify your email before logging in.");
        } else {
          setError("Invalid email or password");
        }
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6 py-12">
      <div className="auth-card space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text">Welcome back</h1>
          <p className="text-sm text-muted">Sign in to your account to continue.</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}
        {searchParams.get("verified") && (
          <Alert type="success">Email verified successfully. You can now sign in.</Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
            error={errors.email?.message}
          />
          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />
            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-xs text-accent hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          
          <div className="pt-2">
            <Button type="submit" isLoading={isLoading} className="w-full">
              Sign In
            </Button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-bg"><div className="auth-card space-y-8"><div className="space-y-2"><h1 className="text-2xl font-bold text-text">Welcome back</h1></div></div></div>}>
      <LoginForm />
    </Suspense>
  );
}
