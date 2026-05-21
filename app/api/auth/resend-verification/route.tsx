import { NextResponse } from "next/server";
import db from "@/lib/db";
import { generateToken, getVerificationExpiry } from "@/lib/tokens";
import { sendEmail } from "@/lib/mailer";
import { VerificationEmail } from "@/emails/VerificationEmail";
import * as React from "react";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "If this email exists, a verification link has been sent." },
        { status: 200 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });

    if (!user || user.emailVerified) {
      return NextResponse.json(
        { message: "If this email exists, a verification link has been sent." },
        { status: 200 }
      );
    }

    // Delete old tokens for this user
    await db.verificationToken.deleteMany({
      where: { identifier: email },
    });

    const token = generateToken();
    const expires = getVerificationExpiry();

    await db.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email/${token}`;

    sendEmail(
      email,
      "Verify your account",
      <VerificationEmail name={user.name} verifyUrl={verifyUrl} />
    ).catch(() => {});

    return NextResponse.json(
      { message: "If this email exists, a verification link has been sent." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "If this email exists, a verification link has been sent." },
      { status: 200 }
    );
  }
}
