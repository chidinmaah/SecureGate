import { sendEmail } from "@/lib/mailer";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await sendEmail(
      "chidinmaah@gmail.com",
      "Your SecureGate Admin Account Details",
      WelcomeEmail({
        name: "Chidinma Okereke",
        email: "chidinmaah@gmail.com",
        loginUrl: `${process.env.NEXTAUTH_URL}/login`,
      })
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send" },
      { status: 500 }
    );
  }
}
