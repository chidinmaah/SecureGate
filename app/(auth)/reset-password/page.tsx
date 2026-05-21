"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/lib/validations";
import { Input, Button, Alert } from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordStrength } from "@/components/PasswordStrength";
import { z } from "zod";

type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Something went wrong");
      } else {
        router.push("/login?reset=success");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-6 py-12">
        <div className="auth-card">
          <Alert type="error">Invalid or missing reset token.</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6 py-12">
      <div className="auth-card space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text">Set new password</h1>
          <p className="text-sm text-muted">Must be at least 8 characters.</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
          />
          <PasswordStrength password={password || ""} />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
          
          <div className="pt-2">
            <Button type="submit" isLoading={isLoading} className="w-full">
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-bg px-6 py-12"><div className="auth-card space-y-8"><div className="space-y-2"><h1 className="text-2xl font-bold text-text">Set new password</h1></div></div></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
