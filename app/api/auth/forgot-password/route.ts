import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ForgotPasswordSchema } from "@/lib/validations";
import { generateToken, getResetPasswordExpiry } from "@/lib/tokens";
import { sendEmail } from "@/lib/mailer";
import { ResetPasswordEmail } from "@/emails/ResetPasswordEmail";
import { forgotPasswordLimiter } from "@/lib/rate-limit";
import * as React from "react";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await forgotPasswordLimiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in 5 minutes" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedFields = ForgotPasswordSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    const { email } = validatedFields.data;

    const response = { message: "If this email exists, a reset link has been sent" };

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(response, { status: 200 });
    }

    const resetToken = generateToken();
    const expires = getResetPasswordExpiry();

    await db.passwordResetToken.create({
      data: {
        email: user.email,
        token: resetToken,
        expires,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail(
        email,
        "Reset your password",
        React.createElement(ResetPasswordEmail, { resetUrl })
      );
    } catch (emailErr) {
      console.error("[EMAIL] Failed to send password reset email:", emailErr);
      return NextResponse.json(
        { error: "Failed to send reset email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("[FORGOT-PASSWORD] Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later" },
      { status: 500 }
    );
  }
}
