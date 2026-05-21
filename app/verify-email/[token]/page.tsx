import db from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ResendForm } from "./ResendForm";

export default async function VerifyEmailPage({
  params,
}: {
  params: { token: string };
}) {
  const token = params.token;

  if (!token) {
    redirect("/login?error=missing_token");
  }

  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || verificationToken.expires < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-6 py-12">
        <div className="auth-card space-y-8 max-w-md text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-text">Link expired</h1>
            <p className="text-sm text-muted">
              This verification link is invalid or has expired. Enter your email to receive a new one.
            </p>
          </div>
          <ResendForm />
          <Link href="/login" className="block text-sm text-accent hover:underline font-medium">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });
    await tx.verificationToken.delete({
      where: { token },
    });
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6 py-12">
      <div className="auth-card space-y-8 max-w-md text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text">Email verified</h1>
          <p className="text-sm text-muted">
            Your account has been verified successfully. You can now sign in.
          </p>
        </div>
        <Link href="/login" className="btn-primary inline-block">
          Sign in
        </Link>
      </div>
    </div>
  );
}
