import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { SignUpSchema } from "@/lib/validations";
import { generateToken, getVerificationExpiry } from "@/lib/tokens";
import { sendEmail } from "@/lib/mailer";
import { VerificationEmail } from "@/emails/VerificationEmail";
import { signupLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import * as React from "react";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { success } = await signupLimiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in 10 minutes" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedFields = SignUpSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields" },
        { status: 400 }
      );
    }

    const { email, password, name } = validatedFields.data;

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Perform a dummy hash to equalize response timing and avoid leaking
      // whether the account exists via status code or latency.
      await bcrypt.hash(password, 12);
      return NextResponse.json(
        { message: "If this email is available, a verification link has been sent." },
        { status: 200 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationToken = generateToken();
    const expires = getVerificationExpiry();

    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });

      await tx.verificationToken.create({
        data: {
          identifier: user.email,
          token: verificationToken,
          expires,
        },
      });
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/verify-email/${verificationToken}`;

    try {
      await sendEmail(
        email,
        "Verify your account",
        React.createElement(VerificationEmail, { name, verifyUrl })
      );
    } catch (emailErr) {
      console.error("[EMAIL] Failed to send verification email:", emailErr);
      return NextResponse.json(
        { error: "Account created but failed to send verification email. Please use resend later." },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "If this email is available, a verification link has been sent." },
      { status: 200 }
    );

  } catch (error) {
    console.error("[SIGNUP] Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later" },
      { status: 500 }
    );
  }
}
