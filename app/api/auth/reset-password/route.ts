import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { ResetPasswordSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // 1. Validate Token
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json(
        { error: "This reset link has expired. Please request a new one" },
        { status: 400 }
      );
    }

    // 2. Validate Password
    const validatedFields = ResetPasswordSchema.safeParse({ password, confirmPassword: password });
    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // 3. Update Password & Delete Token
    const hashedPassword = await bcrypt.hash(password, 12);

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { email: resetToken.email },
        data: { password: hashedPassword },
      });

      await tx.passwordResetToken.delete({
        where: { token },
      });
    });

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later" },
      { status: 500 }
    );
  }
}
