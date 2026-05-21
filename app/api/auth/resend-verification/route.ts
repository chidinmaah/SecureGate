import { NextResponse } from "next/server";
import db from "@/lib/db";
import { generateToken, getVerificationExpiry } from "@/lib/tokens";
import { sendEmail } from "@/lib/mailer";
import { VerificationEmail } from "@/emails/VerificationEmail";
import { resendVerificationLimiter } from "@/lib/rate-limit";
import * as React from "react";
import { z } from "zod";

const EmailSchema = z.string().email("Invalid email address");

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await resendVerificationLimiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        { message: "If this email exists, a verification link has been sent." },
        { status: 200 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "If this email exists, a verification link has been sent." },
        { status: 200 }
      );
    }

    const parsed = EmailSchema.safeParse(email);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "If this email exists, a verification link has been sent." },
        { status: 200 }
      );
    }

    const user = await db.user.findUnique({ where: { email: parsed.data } });

    if (!user || user.emailVerified) {
      return NextResponse.json(
        { message: "If this email exists, a verification link has been sent." },
        { status: 200 }
      );
    }

    await db.verificationToken.deleteMany({
      where: { identifier: email },
    });

    const token = generateToken();
    const expires = getVerificationExpiry();

    await db.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email/${token}`;

    try {
      await sendEmail(
        email,
        "Verify your account",
        React.createElement(VerificationEmail, { name: user.name, verifyUrl })
      );
    } catch (emailErr) {
      console.error("[EMAIL] Failed to resend verification email:", emailErr);
      return NextResponse.json(
        { message: "If this email exists, a verification link has been sent." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "If this email exists, a verification link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[RESEND-VERIFICATION] Error:", error);
    return NextResponse.json(
      { message: "If this email exists, a verification link has been sent." },
      { status: 200 }
    );
  }
}
