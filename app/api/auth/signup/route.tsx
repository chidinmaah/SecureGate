import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { SignUpSchema } from "@/lib/validations";
import { generateToken, getVerificationExpiry } from "@/lib/tokens";
import { sendEmail } from "@/lib/mailer";
import { VerificationEmail } from "@/emails/VerificationEmail";
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
        { error: "Too many attempts. Please try again in 10 minutes" },
        { status: 429 }
      );
    }

    // 2. Validation
    const body = await req.json();
    const validatedFields = SignUpSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, name } = validatedFields.data;

    // 3. Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "If this email is available, a verification link has been sent." },
        { status: 400 }
      );
    }

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Create User & Token
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

    // 6. Send Email (non-blocking)
    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email/${verificationToken}`;
    
    sendEmail(
      email,
      "Verify your account",
      <VerificationEmail name={name} verifyUrl={verifyUrl} />
    ).catch(() => {
      // Email failure doesn't block signup
    });

    return NextResponse.json(
      { message: "Check your email to verify your account" },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong. Please try again later" },
      { status: 500 }
    );
  }
}
