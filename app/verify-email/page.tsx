import { redirect } from "next/navigation";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) {
    redirect("/login?error=missing_token");
  }

  redirect(`/api/auth/verify-email?token=${token}`);
}
