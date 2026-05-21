import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(
        { error: "This verification link is invalid or has expired. Request a new one" },
        { status: 400 }
      );
    }

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() },
      });

      await tx.verificationToken.delete({
        where: { token },
      });
    });

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?verified=true`);

  } catch (error) {
    console.error("[VERIFY_EMAIL_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later" },
      { status: 500 }
    );
  }
}
