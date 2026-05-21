import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { z } from "zod";
import { resetPasswordLimiter } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { PasswordSchema } from "@/lib/validations";

const RequestSchema = z.object({
  token: z.string().min(1, "Missing token"),
  password: PasswordSchema,
});

export async function POST(req: Request) {
  try {
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await resetPasswordLimiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      return NextResponse.json(
        { error: firstError?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json(
        { error: "This reset link has expired. Please request a new one" },
        { status: 400 }
      );
    }

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
