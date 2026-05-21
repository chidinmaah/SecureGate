import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { loginLimiter } from "@/lib/rate-limit";

const handler = NextAuth(authOptions);

export async function GET(
  request: NextRequest,
  context: { params: { nextauth: string[] } }
) {
  return handler(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: { nextauth: string[] } }
) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await loginLimiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later" },
      { status: 429 }
    );
  }

  return handler(request, context);
}
