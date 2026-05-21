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
    // 1. Rate Limiting
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await authRateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later" },
        { status: 429 }
      );
    }

    // 2. Validation
    const body = await req.json();
    const validatedFields = ForgotPasswordSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    const { email } = validatedFields.data;

    // 3. Always return success message
    const response = { message: "If this email exists, a reset link has been sent" };

    // 4. Check user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(response, { status: 200 });
    }

    // 5. Generate and save token
    const resetToken = generateToken();
    const expires = getResetPasswordExpiry();

    await db.passwordResetToken.create({
      data: {
        email: user.email,
        token: resetToken,
        expires,
      },
    });

    // 6. Send Email (non-blocking)
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    
    sendEmail(
      email,
      "Reset your password",
      <ResetPasswordEmail resetUrl={resetUrl} />
    ).catch(() => {
      // Email failure doesn't block the response
    });

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong. Please try again later" },
      { status: 500 }
    );
  }
}
