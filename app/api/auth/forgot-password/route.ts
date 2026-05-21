import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ForgotPasswordSchema } from "@/lib/validations";
import { generateToken, getResetPasswordExpiry } from "@/lib/tokens";
import { sendEmail } from "@/lib/mailer";
import { ResetPasswordEmail } from "@/emails/ResetPasswordEmail";
import { authRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import * as React from "react";

export async function POST(req: Request) {
  try {
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await authRateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in 10 minutes" },
        { status: 429 }
      );
    }

    const body = await req.json();
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
    
    sendEmail(
      email,
      "Reset your password",
      React.createElement(ResetPasswordEmail, { resetUrl })
    ).catch((err) => {
      console.error("[EMAIL] Failed to send password reset email:", err);
    });

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("[FORGOT-PASSWORD] Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later" },
      { status: 500 }
    );
  }
}
