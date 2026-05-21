import db from "@/lib/db";
import Link from "next/link";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function ResetPasswordTokenPage({
  params,
}: {
  params: { token: string };
}) {
  const token = params.token;

  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.expires < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-6 py-12">
        <div className="auth-card space-y-8 max-w-md text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-text">Link expired</h1>
            <p className="text-sm text-muted">
              This reset link has expired or is invalid. Please request a new one.
            </p>
          </div>
          <Link href="/forgot-password" className="btn-primary inline-block">
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6 py-12">
      <div className="auth-card space-y-8 max-w-md">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text">Set new password</h1>
          <p className="text-sm text-muted">Must be at least 8 characters.</p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
