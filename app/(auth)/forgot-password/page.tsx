"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "@/lib/validations";
import { Input, Button, Alert } from "@/components/ui";
import Link from "next/link";
import { z } from "zod";

type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setMessage(result.message || result.error);
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6 py-12">
      <div className="auth-card space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text">Forgot password?</h1>
          <p className="text-sm text-muted">No worries, we&apos;ll send you reset instructions.</p>
        </div>

        {message && <Alert type="warning">{message}</Alert>}

        {!message && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              error={errors.email?.message}
            />
            
            <div className="pt-2">
              <Button type="submit" isLoading={isLoading} className="w-full">
                Reset Password
              </Button>
            </div>
          </form>
        )}

        <div className="text-center">
          <Link href="/login" className="text-sm text-accent hover:underline font-medium">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
